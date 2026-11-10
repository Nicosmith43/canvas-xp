import { supabase } from './supabase';

/**
 * Records a token transaction in the token_ledger table.
 * 
 * @param {string} userId - The Supabase user ID
 * @param {number} tokenAmount - Amount to add (positive) or subtract (negative)
 * @param {number} xpAmount - XP to award (usually 0 for games)
 * @param {string} reason - Description of the transaction (e.g., "Loot Box Purchase")
 * @param {string} assignmentId - Optional assignment ID for reward tracking
 */
export async function recordTransaction(userId, tokenAmount, xpAmount = 0, reason = '', assignmentId = null) {
  try {
    const { data, error } = await supabase
      .from('token_ledger')
      .insert([
        {
          user_id: userId,
          token_amount: tokenAmount,
          xp_amount: xpAmount,
          reason: reason,
          assignment_id: assignmentId,
        }
      ]);

    if (error) throw error;
    
    // Also update the cached balance in the profiles table for performance
    // Note: In a production app, this would be handled by a database trigger
    const { error: profileError } = await supabase.rpc('update_profile_balances', {
      target_user_id: userId
    });

    if (profileError) console.error('Error updating cached balances:', profileError);

    return { success: true, data };
  } catch (error) {
    console.error('Transaction error:', error.message);
    return { success: false, error };
  }
}

/**
 * Fetches the current user's token and XP balances from their profile.
 */
export async function getBalances(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('token_balance, lifetime_xp, current_streak')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching balances:', error.message);
    return { tokens: 0, xp: 0, streak: 0 };
  }

  return {
    tokens: data.token_balance || 0,
    xp: data.lifetime_xp || 0,
    streak: data.current_streak || 0
  };
}
