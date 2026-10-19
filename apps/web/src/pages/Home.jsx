import React from 'react'
import { Trophy, Star, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">Welcome back, Athlete! 🐻</h1>
        <p className="text-xl text-gray-400">Keep track of your academic performance and earn rewards.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-unc-gold/50 transition-colors">
          <div className="bg-unc-gold/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Zap className="text-unc-gold w-6 h-6" />
          </div>
          <h3 className="text-gray-400 font-medium mb-1">Current XP</h3>
          <p className="text-3xl font-bold text-white">1,250</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-unc-gold/50 transition-colors">
          <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Star className="text-blue-400 w-6 h-6" />
          </div>
          <h3 className="text-gray-400 font-medium mb-1">Rank</h3>
          <p className="text-3xl font-bold text-white">#12</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-unc-gold/50 transition-colors">
          <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Trophy className="text-purple-400 w-6 h-6" />
          </div>
          <h3 className="text-gray-400 font-medium mb-1">Items Owned</h3>
          <p className="text-3xl font-bold text-white">8</p>
        </div>
      </div>

      <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4 text-center py-12 text-gray-500 italic">
          Logic for XP activity history will appear here once connected.
        </div>
      </section>
    </div>
  )
}
