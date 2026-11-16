import { supabase } from './supabase';

/**
 * All economy mutations go through Postgres functions so balance checks,
 * ledger writes, and inventory grants happen atomically on the server.
 */

export async function purchaseItem(itemId) {
  const { data, error } = await supabase.rpc('purchase_item', {
    target_item_id: itemId,
  });
  if (error) throw error;
  return data;
}

export async function openLootBox(tier) {
  const { data, error } = await supabase.rpc('open_loot_box', { target_tier: tier });
  if (error) throw error;
  return data;
}

export async function equipItem(itemId) {
  const { data, error } = await supabase.rpc('equip_item', { target_item_id: itemId });
  if (error) throw error;
  return data;
}

export async function getThemeCollection() {
  const { data, error } = await supabase.rpc('get_theme_collection');
  if (error) throw error;
  return data;
}

export async function getSeasonProgress() {
  const { data, error } = await supabase.rpc('get_season_progress');
  if (error) throw error;
  return data;
}

export async function claimSeasonReward(seasonId) {
  const { data, error } = await supabase.rpc('claim_season_reward', {
    target_season_id: seasonId,
  });
  if (error) throw error;
  return data;
}

export async function claimWeeklyBonus() {
  const { data, error } = await supabase.rpc('claim_weekly_bonus');
  if (error) throw error;
  return data;
}

/**
 * XP earned since Monday plus whether this week's goal bonus was claimed.
 */
export async function getWeeklySummary(userId) {
  const monday = new Date();
  const day = monday.getDay() || 7;
  monday.setDate(monday.getDate() - day + 1);
  monday.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('token_ledger')
    .select('xp_amount, reason')
    .eq('user_id', userId)
    .gte('created_at', monday.toISOString());

  if (error) {
    console.error('Error loading weekly summary:', error.message);
    return { xp: 0, bonusClaimed: false };
  }

  const rows = data || [];
  return {
    xp: rows.reduce((sum, row) => sum + (row.xp_amount > 0 ? row.xp_amount : 0), 0),
    bonusClaimed: rows.some((row) => row.reason === 'weekly_goal_bonus'),
  };
}
