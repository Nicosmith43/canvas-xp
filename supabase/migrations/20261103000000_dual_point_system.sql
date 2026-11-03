-- Update profiles table with XP and Token fields for caching
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS lifetime_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS token_balance INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS weekly_xp_goal INTEGER DEFAULT 2000;

-- Update token_ledger table to track both XP and Tokens
ALTER TABLE token_ledger 
RENAME COLUMN amount TO token_amount;

ALTER TABLE token_ledger
ADD COLUMN IF NOT EXISTS xp_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS assignment_id TEXT; -- To prevent duplicate rewards

-- Add a unique constraint to prevent duplicate rewards for the same assignment and student
-- We use a partial index because not all ledger entries are linked to an assignment (e.g., store purchases)
CREATE UNIQUE INDEX IF NOT EXISTS unique_assignment_reward 
ON token_ledger (user_id, assignment_id) 
WHERE assignment_id IS NOT NULL;
