import React from 'react';
import { Star, Zap, Coins, Flame, Target } from 'lucide-react';

export default function Home() {
  const weeklyXP = 1250;
  const weeklyGoal = 2000;
  const progress = (weeklyXP / weeklyGoal) * 100;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">Welcome back, Athlete! 🐻</h1>
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
              Earn {weeklyGoal} XP this week to unlock a bonus!
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-white">{weeklyXP}</span>
            <span className="text-gray-500"> / {weeklyGoal} XP</span>
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
          <p className="text-3xl font-bold text-white">4,850</p>
        </div>

        {/* Tokens Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-colors">
          <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Coins className="text-blue-400 w-6 h-6" />
          </div>
          <h3 className="text-gray-400 font-medium mb-1">Tokens Wallet</h3>
          <p className="text-3xl font-bold text-white">825</p>
        </div>

        {/* Rank Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-colors">
          <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Star className="text-purple-400 w-6 h-6" />
          </div>
          <h3 className="text-gray-400 font-medium mb-1">Global Rank</h3>
          <p className="text-3xl font-bold text-white">#12</p>
        </div>

        {/* Streak Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/50 transition-colors">
          <div className="bg-orange-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Flame className="text-orange-400 w-6 h-6" />
          </div>
          <h3 className="text-gray-400 font-medium mb-1">Current Streak</h3>
          <p className="text-3xl font-bold text-white">7 Days</p>
        </div>
      </div>

      <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            {
              type: 'award',
              label: 'Assignment: Database Project',
              xp: 175,
              tokens: 75,
              date: '2 hours ago',
            },
            { type: 'award', label: 'Weekly Goal Reached', xp: 250, tokens: 0, date: 'Yesterday' },
            {
              type: 'purchase',
              label: 'Bought: Golden Avatar Frame',
              xp: 0,
              tokens: -500,
              date: 'Oct 31',
            },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'award' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                >
                  {activity.type === 'award' ? (
                    <Zap className="w-5 h-5" />
                  ) : (
                    <Coins className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{activity.label}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
              <div className="text-right">
                {activity.xp !== 0 && (
                  <p className="text-unc-gold font-bold text-sm">+{activity.xp} XP</p>
                )}
                {activity.tokens !== 0 && (
                  <p
                    className={`font-bold text-sm ${activity.tokens > 0 ? 'text-blue-400' : 'text-red-400'}`}
                  >
                    {activity.tokens > 0 ? '+' : ''}
                    {activity.tokens} Tokens
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
