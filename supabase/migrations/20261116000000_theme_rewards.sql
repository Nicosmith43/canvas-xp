-- ============================================================================
-- Theme catalog, loot boxes, season ranks, and economy functions.
--
-- IMPORTANT: run this file LAST (after the three earlier migrations).
-- All purchases, box openings, and equips go through SECURITY DEFINER
-- functions so students cannot forge balances or grant themselves items.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Theme catalog (the cosmetic definitions)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.themes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT NOT NULL UNIQUE,               -- stable slug, e.g. 'common-01'
  name        TEXT NOT NULL,
  rarity      TEXT NOT NULL CHECK (rarity IN ('Common','Uncommon','Rare','Epic','Legendary')),
  kind        TEXT NOT NULL DEFAULT 'theme' CHECK (kind IN ('theme','bear')),
  box_tier    TEXT NOT NULL,                      -- which loot box can drop it
  colors      JSONB NOT NULL DEFAULT '{}'::jsonb, -- { primary, secondary, accent }
  image_url   TEXT,                               -- optional art (e.g. bear render)
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Theme catalog is public" ON public.themes
  FOR SELECT USING (true);

-- ---------------------------------------------------------------------------
-- 2. Loot box definitions (cost + which rarity pool they draw from)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loot_boxes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier       TEXT NOT NULL UNIQUE CHECK (tier IN ('Common','Uncommon','Rare','Epic','Legendary')),
  name       TEXT NOT NULL,
  cost       INTEGER NOT NULL CHECK (cost > 0),
  pool_size  INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.loot_boxes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Loot boxes are public" ON public.loot_boxes
  FOR SELECT USING (true);

INSERT INTO public.loot_boxes (tier, name, cost, pool_size) VALUES
  ('Common',    'Common Box',    50,   30),
  ('Uncommon',  'Uncommon Box',  150,  30),
  ('Rare',      'Rare Box',      400,  30),
  ('Epic',      'Epic Box',      1000, 30),
  ('Legendary', 'Legendary Box', 2500, 10) -- Bear collection only
ON CONFLICT (tier) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 3. Link store_items to themes (store_items stays the sellable/inventory unit)
-- ---------------------------------------------------------------------------
ALTER TABLE public.store_items
  ADD COLUMN IF NOT EXISTS theme_id UUID REFERENCES public.themes(id) ON DELETE SET NULL;

-- One owned copy per user per item.
CREATE UNIQUE INDEX IF NOT EXISTS user_inventory_unique_item
  ON public.user_inventory (user_id, item_id);

-- Users may insert/delete their own inventory rows (used by RPCs; the RPCs
-- run as the function owner anyway, so this is just a safety net).
DROP POLICY IF EXISTS "Users can insert their own inventory" ON public.user_inventory;
CREATE POLICY "Users can insert their own inventory" ON public.user_inventory
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own inventory" ON public.user_inventory;
CREATE POLICY "Users can delete their own inventory" ON public.user_inventory
  FOR DELETE USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. Seasons + season rank rewards
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seasons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,               -- e.g. 'Fall 2026'
  starts_on        DATE NOT NULL,
  ends_on          DATE NOT NULL,
  xp_required      INTEGER NOT NULL DEFAULT 5000,
  reward_theme_id  UUID REFERENCES public.themes(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.season_claims (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  season_id  UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, season_id)
);

ALTER TABLE public.seasons       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seasons are public" ON public.seasons
  FOR SELECT USING (true);
CREATE POLICY "Users view own season claims" ON public.season_claims
  FOR SELECT USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 5. Seed the theme catalog (~150 themes) + matching store_items rows.
--    Deterministic UUIDs via md5 so re-running is idempotent.
-- ---------------------------------------------------------------------------

-- 5a. Common (30) — solid color themes
INSERT INTO public.themes (key, name, rarity, kind, box_tier, colors, description)
SELECT
  'common-' || lpad(i::text, 2, '0'),
  'Basic ' || (ARRAY['Blue','Green','Red','Gray','Slate'])[1 + (i % 5)] || ' ' || i,
  'Common', 'theme', 'Common',
  jsonb_build_object('primary', (ARRAY['#3b82f6','#22c55e','#ef4444','#64748b','#334155','#0ea5e9','#f97316','#8b5cf6'])[1 + (i % 8)]),
  'A clean, simple dashboard theme.'
FROM generate_series(1, 30) AS i
ON CONFLICT (key) DO NOTHING;

-- 5b. Uncommon (30) — two-color gradients
INSERT INTO public.themes (key, name, rarity, kind, box_tier, colors, description)
SELECT
  'uncommon-' || lpad(i::text, 2, '0'),
  'Gradient ' || (ARRAY['Ocean','Forest','Sunset','Lavender','Candy','Mint','Ember','Frost'])[1 + (i % 8)] || ' ' || i,
  'Uncommon', 'theme', 'Uncommon',
  jsonb_build_object(
    'primary',   (ARRAY['#3b82f6','#22c55e','#f59e0b','#8b5cf6','#ec4899','#14b8a6','#f97316','#38bdf8'])[1 + (i % 8)],
    'secondary', (ARRAY['#06b6d4','#84cc16','#ef4444','#d946ef','#f43f5e','#0d9488','#fb923c','#818cf8'])[1 + ((i + 3) % 8)]
  ),
  'A smooth two-tone gradient theme.'
FROM generate_series(1, 30) AS i
ON CONFLICT (key) DO NOTHING;

-- 5c. Rare (30) — neon accents
INSERT INTO public.themes (key, name, rarity, kind, box_tier, colors, description)
SELECT
  'rare-' || lpad(i::text, 2, '0'),
  'Neon ' || (ARRAY['Cyber','Matrix','Synthwave','Laser','Volt','Pulse','Glitch','Ion'])[1 + (i % 8)] || ' ' || i,
  'Rare', 'theme', 'Rare',
  jsonb_build_object('primary', (ARRAY['#00ff41','#00ffff','#ff00ff','#39ff14','#ff2d95','#7df9ff','#f0f','#39ff14'])[1 + (i % 8)]),
  'A bright neon theme for late-night sessions.'
FROM generate_series(1, 30) AS i
ON CONFLICT (key) DO NOTHING;

-- 5d. Epic (30) — animated/gorgeous themes
INSERT INTO public.themes (key, name, rarity, kind, box_tier, colors, description)
SELECT
  'epic-' || lpad(i::text, 2, '0'),
  'Animated ' || (ARRAY['Galaxy','Fire','Storm','Aurora','Prism','Nova','Inferno','Zephyr'])[1 + (i % 8)] || ' ' || i,
  'Epic', 'theme', 'Epic',
  jsonb_build_object(
    'primary',   (ARRAY['#8b5cf6','#f43f5e','#0ea5e9','#d946ef','#f59e0b','#10b981','#6366f1','#ec4899'])[1 + (i % 8)],
    'secondary', (ARRAY['#f59e0b','#8b5cf6','#22d3ee','#f43f5e','#a78bfa','#34d399','#818cf8','#fb7185'])[1 + ((i + 2) % 8)]
  ),
  'An animated theme with shifting gradients.'
FROM generate_series(1, 30) AS i
ON CONFLICT (key) DO NOTHING;

-- 5e. Legendary (10) — UNC Bear collectibles. These render as the bear logo.
INSERT INTO public.themes (key, name, rarity, kind, box_tier, colors, image_url, description)
SELECT
  'bear-' || lpad(i::text, 2, '0'),
  'UNC Bear — ' || (ARRAY['Gold','Midnight','Crimson','Arctic','Emerald','Royal','Solar','Phantom','Frostbite','Champion'])[i],
  'Legendary', 'bear', 'Legendary',
  jsonb_build_object('primary', (ARRAY['#F6B000','#002a54','#e11d48','#0ea5e9','#10b981','#7c3aed','#f97316','#1e293b','#67e8f9','#facc15'])[i]),
  '/themes/bear-' || lpad(i::text, 2, '0') || '.svg',
  'A limited-edition UNC Bear mascot collectible.'
FROM generate_series(1, 10) AS i
ON CONFLICT (key) DO NOTHING;

-- 5f. Every theme gets a store_items row so inventory/purchases are uniform.
--     price = 0 + description marks it as box-only; the Store page filters
--     these out (they are earned through loot boxes, not bought directly).
INSERT INTO public.store_items (id, name, description, price, type, theme_id)
SELECT
  md5('theme-item-' || t.key)::uuid,
  t.name,
  COALESCE(t.description, ''),
  0,
  'theme',
  t.id
FROM public.themes t
ON CONFLICT (id) DO NOTHING;

-- 5g. Purchasable store items (spent with tokens only — never real money).
INSERT INTO public.store_items (id, name, description, price, type)
VALUES
  (md5('store-item-avatar-frame')::uuid,
   'UNC Avatar Frame',
   'A classic Carolina Blue frame for your profile picture.',
   100, 'avatar'),
  (md5('store-item-nameplate-gold')::uuid,
   'Gold Nameplate',
   'A shiny gold nameplate shown next to your username.',
   250, 'nameplate'),
  (md5('store-item-banner-midnight')::uuid,
   'Midnight Banner',
   'A dark gradient banner for your profile header.',
   400, 'banner'),
  (md5('store-item-frame-legendary-bear')::uuid,
   'Legendary Bear Frame',
   'A limited frame featuring the UNC Bear. Display only.',
   1000, 'avatar')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 6. Auto-create a profile row when a user signs up.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (
      NEW.id,
      NULLIF(NEW.raw_user_meta_data->>'username', ''),
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
      NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN unique_violation THEN
    -- Username already taken: create the profile without it rather than
    -- failing the whole signup.
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
      NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
  END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 7. Economy functions (all SECURITY DEFINER, auth.uid() scoped)
-- ---------------------------------------------------------------------------

-- 7a. Buy a store item: check balance, deduct tokens, grant inventory.
CREATE OR REPLACE FUNCTION public.purchase_item(target_item_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_item   public.store_items%ROWTYPE;
  v_bal    INTEGER;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_item FROM public.store_items WHERE id = target_item_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Item not found';
  END IF;
  IF v_item.price <= 0 THEN
    RAISE EXCEPTION 'Item is not purchasable';
  END IF;

  -- Lock the profile row so concurrent purchases can't overspend.
  SELECT token_balance INTO v_bal
  FROM public.profiles WHERE id = v_user FOR UPDATE;

  IF v_bal IS NULL OR v_bal < v_item.price THEN
    RAISE EXCEPTION 'Insufficient tokens';
  END IF;

  INSERT INTO public.token_ledger (user_id, token_amount, xp_amount, reason)
  VALUES (v_user, -v_item.price, 0, 'store_purchase:' || v_item.name);

  INSERT INTO public.user_inventory (user_id, item_id)
  VALUES (v_user, target_item_id)
  ON CONFLICT (user_id, item_id) DO NOTHING;

  RETURN jsonb_build_object('success', true, 'item', v_item.name, 'price', v_item.price);
END;
$$;

-- 7b. Open a loot box: deduct cost, grant a random unowned theme from the tier.
CREATE OR REPLACE FUNCTION public.open_loot_box(target_tier TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_box     public.loot_boxes%ROWTYPE;
  v_bal     INTEGER;
  v_theme   public.themes%ROWTYPE;
  v_item_id UUID;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_box FROM public.loot_boxes WHERE tier = target_tier;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Unknown box tier: %', target_tier;
  END IF;

  SELECT token_balance INTO v_bal
  FROM public.profiles WHERE id = v_user FOR UPDATE;

  IF v_bal IS NULL OR v_bal < v_box.cost THEN
    RAISE EXCEPTION 'Insufficient tokens';
  END IF;

  -- Pick a random theme from this tier the user does not already own.
  SELECT t.* INTO v_theme
  FROM public.themes t
  WHERE t.box_tier = target_tier
    AND NOT EXISTS (
      SELECT 1
      FROM public.user_inventory ui
      JOIN public.store_items si ON si.id = ui.item_id
      WHERE ui.user_id = v_user AND si.theme_id = t.id
    )
  ORDER BY random()
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'You already own every theme in this box';
  END IF;

  INSERT INTO public.token_ledger (user_id, token_amount, xp_amount, reason)
  VALUES (v_user, -v_box.cost, 0, 'loot_box:' || target_tier);

  SELECT id INTO v_item_id FROM public.store_items WHERE theme_id = v_theme.id;

  INSERT INTO public.user_inventory (user_id, item_id)
  VALUES (v_user, v_item_id);

  RETURN jsonb_build_object(
    'success', true,
    'theme', jsonb_build_object(
      'id', v_theme.id, 'key', v_theme.key, 'name', v_theme.name,
      'rarity', v_theme.rarity, 'kind', v_theme.kind,
      'colors', v_theme.colors, 'image_url', v_theme.image_url
    ),
    'cost', v_box.cost
  );
END;
$$;

-- 7c. Equip an owned item (exactly one theme can be equipped at a time).
CREATE OR REPLACE FUNCTION public.equip_item(target_item_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Only theme items can be equipped; other cosmetics are passive unlocks.
  IF NOT EXISTS (
    SELECT 1
    FROM public.user_inventory ui
    JOIN public.store_items si ON si.id = ui.item_id
    WHERE ui.user_id = v_user AND ui.item_id = target_item_id AND si.theme_id IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Item not in inventory or not equippable';
  END IF;

  UPDATE public.user_inventory SET is_selected = false WHERE user_id = v_user;
  UPDATE public.user_inventory SET is_selected = true
  WHERE user_id = v_user AND item_id = target_item_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- 7d. Full theme collection with ownership flags (for the Inventory page).
CREATE OR REPLACE FUNCTION public.get_theme_collection()
RETURNS TABLE (
  theme_id   UUID,
  key        TEXT,
  name       TEXT,
  rarity     TEXT,
  kind       TEXT,
  colors     JSONB,
  image_url  TEXT,
  owned      BOOLEAN,
  equipped   BOOLEAN,
  item_id    UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id, t.key, t.name, t.rarity, t.kind, t.colors, t.image_url,
    (ui.id IS NOT NULL),
    COALESCE(ui.is_selected, false),
    si.id
  FROM public.themes t
  JOIN public.store_items si ON si.theme_id = t.id
  LEFT JOIN public.user_inventory ui
    ON ui.item_id = si.id AND ui.user_id = auth.uid()
  ORDER BY
    CASE t.rarity
      WHEN 'Common' THEN 1 WHEN 'Uncommon' THEN 2 WHEN 'Rare' THEN 3
      WHEN 'Epic' THEN 4 WHEN 'Legendary' THEN 5 END,
    t.key;
END;
$$;

-- 7e. Season reward progress + claim.
--     A season is claimable after ends_on, if the user earned >= xp_required
--     XP from ledger entries dated inside the season window.
CREATE OR REPLACE FUNCTION public.get_season_progress()
RETURNS TABLE (
  season_id     UUID,
  name          TEXT,
  starts_on     DATE,
  ends_on       DATE,
  xp_required   INTEGER,
  xp_earned     BIGINT,
  claimed       BOOLEAN,
  reward_name   TEXT,
  reward_kind   TEXT,
  reward_colors JSONB,
  reward_image  TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id, s.name, s.starts_on, s.ends_on, s.xp_required,
    COALESCE((
      SELECT SUM(tl.xp_amount)
      FROM public.token_ledger tl
      WHERE tl.user_id = auth.uid()
        AND tl.created_at::date BETWEEN s.starts_on AND s.ends_on
    ), 0),
    EXISTS (SELECT 1 FROM public.season_claims sc
            WHERE sc.season_id = s.id AND sc.user_id = auth.uid()),
    rt.name, rt.kind, rt.colors, rt.image_url
  FROM public.seasons s
  LEFT JOIN public.themes rt ON rt.id = s.reward_theme_id
  ORDER BY s.starts_on;
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_season_reward(target_season_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_season  public.seasons%ROWTYPE;
  v_xp      BIGINT;
  v_item_id UUID;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_season FROM public.seasons WHERE id = target_season_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Season not found';
  END IF;
  IF CURRENT_DATE < v_season.ends_on THEN
    RAISE EXCEPTION 'Season has not ended yet';
  END IF;
  IF EXISTS (SELECT 1 FROM public.season_claims
             WHERE user_id = v_user AND season_id = target_season_id) THEN
    RAISE EXCEPTION 'Reward already claimed';
  END IF;

  SELECT COALESCE(SUM(xp_amount), 0) INTO v_xp
  FROM public.token_ledger
  WHERE user_id = v_user
    AND created_at::date BETWEEN v_season.starts_on AND v_season.ends_on;

  IF v_xp < v_season.xp_required THEN
    RAISE EXCEPTION 'Not enough XP (% / %)', v_xp, v_season.xp_required;
  END IF;

  INSERT INTO public.season_claims (user_id, season_id)
  VALUES (v_user, target_season_id);

  -- Grant the reward theme if the user doesn't already own it.
  IF v_season.reward_theme_id IS NOT NULL THEN
    SELECT id INTO v_item_id FROM public.store_items WHERE theme_id = v_season.reward_theme_id;
    IF v_item_id IS NOT NULL THEN
      INSERT INTO public.user_inventory (user_id, item_id)
      VALUES (v_user, v_item_id)
      ON CONFLICT (user_id, item_id) DO NOTHING;
    END IF;
  END IF;

  RETURN jsonb_build_object('success', true, 'season', v_season.name);
END;
$$;

-- ---------------------------------------------------------------------------
-- 8. Grants: let signed-in users call the economy functions.
-- ---------------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.purchase_item(UUID)               TO authenticated;
GRANT EXECUTE ON FUNCTION public.open_loot_box(TEXT)               TO authenticated;
GRANT EXECUTE ON FUNCTION public.equip_item(UUID)                  TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_theme_collection()            TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_season_progress()             TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_season_reward(UUID)         TO authenticated;
