import React, { useState, useRef } from 'react';
import { Coins, Package, Sparkles, Trophy } from 'lucide-react';
import { themePools, boxCosts } from '../lib/themes';

export default function Games() {
  const [tokens, setTokens] = useState(825); // Placeholder for Supabase balance
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedRarity, setSelectedRarity] = useState('Common');
  
  const reelRef = useRef(null);

  const openBox = (rarity) => {
    const cost = boxCosts[rarity];
    if (tokens < cost) {
      alert("Not enough tokens!");
      return;
    }

    setOpening(true);
    setTokens(prev => prev - cost);
    setResult(null);

    // Simulate opening animation
    setTimeout(() => {
      const pool = themePools[rarity];
      const winningTheme = pool[Math.floor(Math.random() * pool.length)];
      
      setResult(winningTheme);
      setOpening(false);
      
      // Backend: Deduct tokens and add item to inventory in Supabase
      // Game logic: Payouts/Items never award XP.
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-4">UNC Loot Boxes</h1>
          <p className="text-xl text-gray-400">Unlock exclusive themes for your Canvas dashboard.</p>
        </div>
        <div className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <Coins className="w-5 h-5" />
          <span>{tokens} Tokens</span>
        </div>
      </header>

      {/* Opening Animation Area */}
      <div className="bg-white/5 border-2 border-white/10 rounded-3xl p-12 mb-12 relative overflow-hidden flex flex-col items-center min-h-[400px] justify-center">
        {opening ? (
          <div className="flex flex-col items-center animate-pulse">
            <Package className="w-32 h-32 text-unc-gold animate-bounce mb-8" />
            <h2 className="text-2xl font-bold text-white">Opening {selectedRarity} Box...</h2>
          </div>
        ) : result ? (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
            <div 
              className="w-48 h-48 rounded-2xl mb-6 shadow-2xl border-4 border-white/20"
              style={{ background: result.previewColor }}
            />
            <Sparkles className="text-unc-gold w-12 h-12 mb-4" />
            <h2 className="text-3xl font-black text-white mb-2">UNLOCKED: {result.name}</h2>
            <p className="text-unc-gold font-bold uppercase tracking-widest">{result.rarity} THEME</p>
            <button 
              onClick={() => setResult(null)}
              className="mt-8 text-gray-400 hover:text-white transition-colors"
            >
              Back to Shop
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Package className="w-32 h-32 text-gray-600 mb-8" />
            <h2 className="text-2xl font-bold text-gray-400">Select a box below to begin</h2>
          </div>
        )}
      </div>

      {/* Box Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {Object.keys(boxCosts).map((rarity) => (
          <div 
            key={rarity}
            className={`group bg-white/5 border-2 rounded-2xl p-6 transition-all cursor-pointer hover:-translate-y-2
              ${selectedRarity === rarity ? 'border-unc-gold bg-unc-gold/5' : 'border-white/10 hover:border-white/20'}`}
            onClick={() => setSelectedRarity(rarity)}
          >
            <div className="flex justify-center mb-4">
              <Package 
                className={`w-16 h-16 transition-colors ${
                  rarity === 'Legendary' ? 'text-yellow-400' :
                  rarity === 'Epic' ? 'text-purple-500' :
                  rarity === 'Rare' ? 'text-blue-500' :
                  rarity === 'Uncommon' ? 'text-green-500' : 'text-gray-400'
                }`} 
              />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-1">{rarity} Box</h3>
            <p className="text-gray-500 text-xs text-center mb-4">Contains 20-35 Themes</p>
            <div className="flex items-center justify-center gap-2 text-unc-gold font-black">
              <Coins className="w-4 h-4" />
              <span>{boxCosts[rarity]}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRarity(rarity);
                openBox(rarity);
              }}
              disabled={opening}
              className={`w-full mt-4 py-2 rounded-xl font-bold transition-all
                ${tokens >= boxCosts[rarity] 
                  ? 'bg-unc-gold text-unc-navy hover:scale-105' 
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
            >
              BUY BOX
            </button>
          </div>
        ))}
      </div>

      {/* Rarity Info */}
      <section className="mt-16 bg-white/5 rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="text-unc-gold w-6 h-6" />
          Gambling Rules & Odds
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400">
          <div>
            <p className="mb-4">Every box contains a random theme of the specified rarity. Odds are equally distributed within the pool of that rarity tier.</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Common: 100% chance of Common theme</li>
              <li>Uncommon: 100% chance of Uncommon theme</li>
              <li>Legendary: 100% chance of Legendary Bear themes</li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-bold text-white">Important Note:</p>
            <p>Loot box purchases and theme unlocks are purely cosmetic. Payouts do not award XP and do not affect your academic standing or ranking.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
