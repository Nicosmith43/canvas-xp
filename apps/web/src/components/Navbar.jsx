import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Store, User, LogOut, Gamepad2, Package, PawPrint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { equippedTheme } = useTheme();
  const location = useLocation();

  const isBear = equippedTheme?.kind === 'bear';
  const bearColor = equippedTheme?.colors?.primary || '#F6B000';

  const linkClass = (path) =>
    `flex items-center gap-2 transition-colors ${
      location.pathname === path ? 'text-unc-gold' : 'text-gray-300 hover:text-unc-gold'
    }`;

  return (
    <nav className="fixed top-0 w-full bg-unc-blue border-b border-white/10 px-6 py-4 flex justify-between items-center z-50">
      <Link to="/" className="flex items-center gap-2 group">
        <div
          className="p-1.5 rounded-lg group-hover:rotate-12 transition-transform"
          style={{ backgroundColor: isBear ? bearColor : '#F6B000' }}
        >
          {isBear ? (
            equippedTheme?.image_url ? (
              <img src={equippedTheme.image_url} alt="Bear" className="w-6 h-6 object-contain" />
            ) : (
              <PawPrint className="w-6 h-6 text-unc-blue" />
            )
          ) : (
            <Trophy className="w-6 h-6 text-unc-blue" />
          )}
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Canvas XP</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/games" className={linkClass('/games')}>
          <Gamepad2 className="w-5 h-5" />
          <span className="font-medium">Arcade</span>
        </Link>
        <Link to="/inventory" className={linkClass('/inventory')}>
          <Package className="w-5 h-5" />
          <span className="font-medium">Inventory</span>
        </Link>
        <Link to="/store" className={linkClass('/store')}>
          <Store className="w-5 h-5" />
          <span className="font-medium">Store</span>
        </Link>
        <Link to="/profile" className={linkClass('/profile')}>
          <User className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </Link>

        {user ? (
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors ml-4 pl-4 border-l border-white/10"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{profile?.username || 'Logout'}</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 text-gray-300 hover:text-unc-gold transition-colors ml-4 pl-4 border-l border-white/10"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
