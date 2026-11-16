import React, { useEffect, useState } from 'react';
import { Star, Zap, Coins, Flame, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getWeeklyXp } from '../lib/economy';
import { useAuth } from '../context/AuthContext';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function Home() {
  const { user, profile } = useAuth();
  const [weeklyXP, setWeeklyXP] = useState(0);
  const [activity, setActivity] = useState([]);

  const weeklyGoal = profile?.weekly_xp_goal ?? 2000;
  const lifetimeXP = profile?.lifetime_xp ?? 0;
  const tokens = profile?.token_balance ?? 0;
  const streak = profile?.current_streak ?? 0;
  const progress = Math.min(100, (weeklyXP / weeklyGoal) * 100);

  useEffect(() => {
    if (!user || !supabase) return;
    getWeeklyXp(user.id).then(setWeeklyXP);
    supabase
      .from('token_ledger')
      .select('reason, token_amount, xp_amount, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setActivity(data || []));
  }, [user, profile?.lifetime_xp]);

  const displayName = profile?.full_name || profile?.username || 'Athlete';

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">Welcome back, {displayName}!</h1>
        <p className="text-xl text-gray-400">
          Keep track of your academic performance and earn rewards.
        </p>
      </header>

      {/* Weekly Goal Progress */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <Target className="text-unc-gold w-6 h-6" />
              Weekly Goal
            </h2>
            <p className="text-gray-400 text-sm">
              Earn {weeklyGoal.toLocaleString()} XP this week to hit your goal.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-white">{weeklyXP.toLocaleString()}</span>
            <span className="text-gray-500"> / {weeklyGoal.toLocaleString()} XP</span>
          </div>
        </div>
        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-unc-gold to-yellow-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-unc-gold font-medium">{Math.floor(progress)}% Complete</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* XP Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-unc-gold/50 transition-colors">
          <div className="bg-unc-gold/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Zap className="text-unc-gold w-6 h-6" />
          </div>
          <h3 className="text-gray-400 font-medium mb-1">Lifetime XP</h3>
          <p className="text-3xl font-bold text-white">{lifetimeXP.toLocaleString()}</p>
        </div>

        {/* Tokens Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-colors">
          <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Coins className="text-blue-400 w-6 h-6" />
          </div>
          <h3 className="text-gray-400 font-medium mb-1">Tokens Wallet</h3>
          <p className="text-3xl font-bold text-white">{tokens.toLocaleString()}</p>
        </div>

        {/* Rank Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-colors">
          <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Star className="text-purple-400 w-6 h-6" />
          </div>
          <h3 className="text-gray-400 font-medium mb-1">Season Rank</h3>
          <p className="text-3xl font-bold text-white">—</p>
        </div>

        {/* Streak Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/50 transition-colors">
          <div className="bg-orange-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Flame className="text-orange-400 w-6 h-6" />
          </div>
          <h3 className="text-gray-400 font-medium mb-1">Current Streak</h3>
          <p className="text-3xl font-bold text-white">{streak} Days</p>
        </div>
      </div>

      <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        {activity.length === 0 ? (
          <p className="text-gray-500">
            No activity yet. Complete Canvas assignments to start earning XP and tokens.
          </p>
        ) : (
          <div className="space-y-4">
            {activity.map((row, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${row.xp_amount > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                  >
                    {row.xp_amount > 0 ? (
                      <Zap className="w-5 h-5" />
                    ) : (
                      <Coins className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{row.reason || 'Transaction'}</p>
                    <p className="text-xs text-gray-500">{timeAgo(row.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  {row.xp_amount !== 0 && (
                    <p className="text-unc-gold font-bold text-sm">
                      {row.xp_amount > 0 ? '+' : ''}
                      {row.xp_amount} XP
                    </p>
                  )}
                  {row.token_amount !== 0 && (
                    <p
                      className={`font-bold text-sm ${row.token_amount > 0 ? 'text-blue-400' : 'text-red-400'}`}
                    >
                      {row.token_amount > 0 ? '+' : ''}
                      {row.token_amount} Tokens
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
