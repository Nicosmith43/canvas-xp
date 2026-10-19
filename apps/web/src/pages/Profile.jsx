import React from 'react'
import { User, Settings, Link2 } from 'lucide-react'

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-unc-blue to-blue-900"></div>
        <div className="px-8 pb-8 -mt-12">
          <div className="flex justify-between items-end mb-6">
            <div className="w-24 h-24 rounded-2xl bg-unc-gold border-4 border-slate-900 flex items-center justify-center text-unc-blue">
              <User className="w-12 h-12" />
            </div>
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors">
              <Settings className="w-5 h-5" />
              Edit Profile
            </button>
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">UNC Student</h2>
          <p className="text-gray-400 mb-6">Class of 2027 • Athlete Account</p>
          
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300">
              <span className="font-bold text-white">1,250</span> Total XP
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300">
              <span className="font-bold text-white">12</span> Rank
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
              <button className="text-unc-gold font-bold text-sm hover:underline">Connect</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-unc-gold" />
            App Settings
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 text-gray-300 cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-colors">
              <input type="checkbox" className="accent-unc-gold" defaultChecked />
              <span>Enable XP notifications</span>
            </label>
            <label className="flex items-center gap-3 text-gray-300 cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-colors">
              <input type="checkbox" className="accent-unc-gold" defaultChecked />
              <span>Show rank on leaderboard</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
