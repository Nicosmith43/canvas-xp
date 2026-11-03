Database plan
Start with only these tables:
Table -> Purpose
profiles, Minimal app profile (XP balance, Token balance, streaks, goals)
token_ledger, Every award or purchase (tracks both XP and Tokens)
store_items, Items students can purchase with Tokens
user_inventory, Items a student owns and whether one is selected
canvas_connections, Canvas user ID and secure connection metadata

The important design choice is the token_ledger: never just overwrite a balance. Record entries for both XP (progress) and Tokens (currency). This provides a full audit trail.

### Gamification Logic
- **XP (Experience Points)**: Non-spendable points for leaderboard and leveling.
- **Tokens**: Virtual currency spent in the Store and on Games.
- **Assignment Rewards**: Base XP is scaled by the assignment's point value in Canvas.
- **Early Submission**: Bonus XP and Tokens are awarded for submissions 24+, 48+, and 72+ hours before the deadline.
Enable Row Level Security on every user-data table so students can access only their own records. Supabase documents RLS as the database-level control for limiting data by user, and recommends protecting public user tables with it.
