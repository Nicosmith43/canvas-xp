-- Create a function to recalculate profile balances from the ledger
-- This ensures the 'profiles' table cache is always accurate
CREATE OR REPLACE FUNCTION update_profile_balances(target_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    token_balance = (SELECT COALESCE(SUM(token_amount), 0) FROM token_ledger WHERE user_id = target_user_id),
    lifetime_xp = (SELECT COALESCE(SUM(xp_amount), 0) FROM token_ledger WHERE user_id = target_user_id)
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
