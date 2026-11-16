-- Automatically recalculate and cache student balances whenever a transaction
-- occurs in the token_ledger.
--
-- IMPORTANT: run this file AFTER 20261103000000_dual_point_system.sql.

CREATE OR REPLACE FUNCTION public.update_profile_balances(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET
    token_balance = (
      SELECT COALESCE(SUM(token_amount), 0)
      FROM public.token_ledger
      WHERE user_id = target_user_id
    ),
    lifetime_xp = (
      SELECT COALESCE(SUM(xp_amount), 0)
      FROM public.token_ledger
      WHERE user_id = target_user_id
    )
  WHERE id = target_user_id;
END;
$$;

-- Trigger: keep profiles.token_balance / lifetime_xp in sync with the ledger.
CREATE OR REPLACE FUNCTION public.handle_ledger_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.update_profile_balances(NEW.user_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS token_ledger_balance_sync ON public.token_ledger;
CREATE TRIGGER token_ledger_balance_sync
  AFTER INSERT ON public.token_ledger
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_ledger_insert();
