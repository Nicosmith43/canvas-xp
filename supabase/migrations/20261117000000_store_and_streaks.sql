-- ============================================================================
-- Guaranteed theme store pricing, purchase duplicate guard,
-- weekly goal bonus, and streak tracking.
--
-- IMPORTANT: run AFTER 20261116000000_theme_rewards.sql.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Guaranteed theme store: non-Legendary themes become directly purchasable
--    at fixed token prices. Legendary Bears stay box-exclusive.
-- ---------------------------------------------------------------------------
UPDATE public.store_items si
SET price = CASE t.rarity
  WHEN 'Common'    THEN 75
  WHEN 'Uncommon'  THEN 200
  WHEN 'Rare'      THEN 500
  WHEN 'Epic'      THEN 1200
  ELSE 0  -- Legendary: loot-box exclusive
END
FROM public.themes t
WHERE si.theme_id = t.id;

-- ---------------------------------------------------------------------------
-- 2. purchase_item: block buying something you already own so tokens aren't
--    wasted on a no-op insert.
-- ---------------------------------------------------------------------------
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

  IF EXISTS (
    SELECT 1 FROM public.user_inventory
    WHERE user_id = v_user AND item_id = target_item_id
  ) THEN
    RAISE EXCEPTION 'Already owned';
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
  VALUES (v_user, target_item_id);

  RETURN jsonb_build_object('success', true, 'item', v_item.name, 'price', v_item.price);
END;
$$;

-- ---------------------------------------------------------------------------
-- 3. Streak tracking: current_streak = consecutive days (ending today or
--    yesterday) with at least one XP-earning ledger entry. Recomputed by the
--    ledger trigger so it stays correct no matter what wrote the entry.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.recompute_streak(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_day    DATE;
  v_streak INTEGER := 0;
  v_guard  INTEGER := 0;
BEGIN
  -- Anchor: today if there is activity today, otherwise yesterday.
  -- If neither has activity, the streak is already broken -> 0.
  SELECT MAX(d) INTO v_day
  FROM (
    SELECT DISTINCT created_at::date AS d
    FROM public.token_ledger
    WHERE user_id = target_user_id AND xp_amount > 0
  ) days
  WHERE d <= CURRENT_DATE
    AND d >= CURRENT_DATE - 1;

  WHILE v_day IS NOT NULL AND v_guard < 400 LOOP
    IF EXISTS (
      SELECT 1 FROM public.token_ledger
      WHERE user_id = target_user_id
        AND xp_amount > 0
        AND created_at::date = v_day
    ) THEN
      v_streak := v_streak + 1;
      v_day := v_day - 1;
    ELSE
      EXIT;
    END IF;
    v_guard := v_guard + 1;
  END LOOP;

  UPDATE public.profiles SET current_streak = v_streak WHERE id = target_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_ledger_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.update_profile_balances(NEW.user_id);
  PERFORM public.recompute_streak(NEW.user_id);
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 4. Weekly goal bonus: +250 XP once per ISO week when the week's earned XP
--    reaches weekly_xp_goal. The ledger's unique (user_id, assignment_id)
--    index doubles as the "already claimed" guard via a week key.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.claim_weekly_bonus()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_goal     INTEGER;
  v_xp       BIGINT;
  v_week_key TEXT;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT weekly_xp_goal INTO v_goal
  FROM public.profiles WHERE id = v_user;

  SELECT COALESCE(SUM(xp_amount), 0) INTO v_xp
  FROM public.token_ledger
  WHERE user_id = v_user
    AND xp_amount > 0
    AND created_at >= date_trunc('week', now());

  IF v_xp < v_goal THEN
    RAISE EXCEPTION 'Weekly goal not reached (% / % XP)', v_xp, v_goal;
  END IF;

  v_week_key := 'weekly-' || to_char(date_trunc('week', now())::date, 'IYYY-"W"IW');

  BEGIN
    INSERT INTO public.token_ledger (user_id, token_amount, xp_amount, reason, assignment_id)
    VALUES (v_user, 0, 250, 'weekly_goal_bonus', v_week_key);
  EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'Weekly bonus already claimed';
  END;

  RETURN jsonb_build_object('success', true, 'xp', 250);
END;
$$;

-- ---------------------------------------------------------------------------
-- 5. Grants
-- ---------------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.purchase_item(UUID)   TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_weekly_bonus()  TO authenticated;
