import React from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Store, User, LogOut } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-unc-blue border-b border-white/10 px-6 py-4 flex justify-between items-center z-50">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-unc-gold p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
          <Trophy className="w-6 h-6 text-unc-blue" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Canvas XP</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/store" className="flex items-center gap-2 text-gray-300 hover:text-unc-gold transition-colors">
          <Store className="w-5 h-5" />
          <span className="font-medium">Store</span>
        </Link>
        <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-unc-gold transition-colors">
          <User className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </Link>
        <button className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors ml-4 pl-4 border-l border-white/10">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </nav>
  )
}
