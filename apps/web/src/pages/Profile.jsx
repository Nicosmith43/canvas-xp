import React, { useEffect, useState } from 'react';
import { User, Settings, Link2, Coins, Zap, Flame, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSeasonProgress, claimSeasonReward } from '../lib/economy';

function SeasonRewardCard({ season, onClaimed }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const now = new Date();
  const endsOn = new Date(season.ends_on);
  const ended = now > endsOn;
  const eligible = ended && !season.claimed && season.xp_earned >= season.xp_required;
  const progress = Math.min(100, Math.round((season.xp_earned / season.xp_required) * 100));

  const handleClaim = async () => {
    setBusy(true);
    setError('');
    try {
      await claimSeasonReward(season.season_id);
      onClaimed();
    } catch (err) {
      setError(err.message || 'Claim failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-white font-bold">{season.name} Rank Reward</h4>
          <p className="text-xs text-gray-500">
            {season.reward_name || 'Season theme'}
            {season.reward_kind === 'bear' ? ' (Bear)' : ''}
          </p>
        </div>
        {season.claimed ? (
          <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
            CLAIMED
          </span>
        ) : ended ? (
          <span className="text-xs font-bold text-unc-gold bg-unc-gold/10 px-2 py-1 rounded-full">
            ENDED
          </span>
        ) : (
          <span className="text-xs font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-full">
            IN PROGRESS
          </span>
        )}
      </div>

      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-unc-gold to-yellow-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mb-3">
        {season.xp_earned.toLocaleString()} / {season.xp_required.toLocaleString()} XP
      </p>

      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

      {eligible && (
        <button
          onClick={handleClaim}
          disabled={busy}
          className="w-full bg-unc-gold text-unc-navy font-bold py-2 rounded-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Gift className="w-4 h-4" />
          {busy ? 'CLAIMING...' : 'CLAIM REWARD'}
        </button>
      )}
      {ended && !season.claimed && !eligible && (
        <p className="text-xs text-gray-500">
          You needed {season.xp_required.toLocaleString()} XP this season.
        </p>
      )}
    </div>
  );
}

export default function Profile() {
  const { user, profile } = useAuth();
  const [seasons, setSeasons] = useState([]);

  const loadSeasons = async () => {
    try {
      const data = await getSeasonProgress();
      setSeasons(data || []);
    } catch (err) {
      console.error('Error loading seasons:', err.message);
    }
  };

  useEffect(() => {
    loadSeasons();
  }, [user]);

  const displayName = profile?.full_name || profile?.username || user?.email || 'Student';
  const xp = profile?.lifetime_xp ?? 0;
  const tokens = profile?.token_balance ?? 0;
  const streak = profile?.current_streak ?? 0;
  const weeklyGoal = profile?.weekly_xp_goal ?? 2000;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-unc-blue to-blue-900"></div>
        <div className="px-8 pb-8 -mt-12">
          <div className="flex justify-between items-end mb-6">
            <div className="w-24 h-24 rounded-2xl bg-unc-gold border-4 border-slate-900 flex items-center justify-center text-unc-blue">
              <User className="w-12 h-12" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">{displayName}</h2>
          <p className="text-gray-400 mb-6">{user?.email}</p>

          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-unc-gold" />
              <span className="font-bold text-white">{xp.toLocaleString()}</span> Lifetime XP
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300 flex items-center gap-2">
              <Coins className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-white">{tokens.toLocaleString()}</span> Tokens
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="font-bold text-white">{streak}</span> Day Streak
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300">
              Weekly goal:{' '}
              <span className="font-bold text-white">{weeklyGoal.toLocaleString()}</span> XP
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-unc-gold" />
            Connections
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
              <div>
                <p className="text-white font-medium">Canvas LMS</p>
                <p className="text-xs text-gray-500 italic">Not connected</p>
              </div>
              <button className="text-gray-500 font-bold text-sm cursor-not-allowed">
                Pending IT setup
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-unc-gold" />
            Season Rank Rewards
          </h3>
          <div className="space-y-4">
            {seasons.length === 0 && (
              <p className="text-sm text-gray-500">No seasons configured yet.</p>
            )}
            {seasons.map((season) => (
              <SeasonRewardCard key={season.season_id} season={season} onClaimed={loadSeasons} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
