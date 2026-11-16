import React, { useEffect, useState } from 'react';
import { Coins, Package, Sparkles, Trophy, PawPrint } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { openLootBox } from '../lib/economy';
import { useAuth } from '../context/AuthContext';

const rarityIconColor = {
  Common: 'text-gray-400',
  Uncommon: 'text-green-500',
  Rare: 'text-blue-500',
  Epic: 'text-purple-500',
  Legendary: 'text-yellow-400',
};

const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

export default function Games() {
  const { profile, user, refreshProfile } = useAuth();
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const tokens = profile?.token_balance ?? 0;

  useEffect(() => {
    async function load() {
      if (!supabase) return;
      const { data } = await supabase.from('loot_boxes').select('*').order('cost');
      setBoxes(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleOpen = async (box) => {
    setError('');
    setResult(null);
    setOpening(true);

    // Let the animation play a moment, then resolve on the server.
    const minDelay = new Promise((r) => setTimeout(r, 1600));
    try {
      const [data] = await Promise.all([openLootBox(box.tier), minDelay]);
      setResult(data.theme);
      await refreshProfile();
    } catch (err) {
      setError(err.message || 'Failed to open box');
    } finally {
      setOpening(false);
    }
  };

  const sortedBoxes = [...boxes].sort(
    (a, b) => rarityOrder.indexOf(a.tier) - rarityOrder.indexOf(b.tier)
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-4">UNC Loot Boxes</h1>
          <p className="text-xl text-gray-400">
            Spend tokens to unlock random themes for your dashboard.
          </p>
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
            <h2 className="text-2xl font-bold text-white">Opening box...</h2>
          </div>
        ) : result ? (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
            <div
              className="w-48 h-48 rounded-2xl mb-6 shadow-2xl border-4 border-white/20 flex items-center justify-center overflow-hidden"
              style={{
                background: result.colors?.secondary
                  ? `linear-gradient(135deg, ${result.colors.primary}, ${result.colors.secondary})`
                  : result.colors?.primary || '#334155',
              }}
            >
              {result.kind === 'bear' &&
                (result.image_url ? (
                  <img src={result.image_url} alt={result.name} className="w-3/4 h-3/4 object-contain" />
                ) : (
                  <PawPrint className="w-24 h-24 text-white/80" />
                ))}
            </div>
            <Sparkles className="text-unc-gold w-12 h-12 mb-4" />
            <h2 className="text-3xl font-black text-white mb-2">UNLOCKED: {result.name}</h2>
            <p className="text-unc-gold font-bold uppercase tracking-widest">
              {result.rarity} {result.kind === 'bear' ? 'BEAR' : 'THEME'}
            </p>
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

      {error && (
        <p className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* Box Selection Grid */}
      {loading ? (
        <p className="text-gray-400">Loading boxes...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {sortedBoxes.map((box) => {
            const afford = tokens >= box.cost;
            return (
              <div
                key={box.id}
                className="group bg-white/5 border-2 border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  {box.tier === 'Legendary' ? (
                    <PawPrint className="w-16 h-16 text-yellow-400" />
                  ) : (
                    <Package className={`w-16 h-16 ${rarityIconColor[box.tier] || 'text-gray-400'}`} />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-1">{box.name}</h3>
                <p className="text-gray-500 text-xs text-center mb-4">
                  {box.tier === 'Legendary'
                    ? 'Guaranteed UNC Bear collectible'
                    : `Contains ${box.pool_size} themes`}
                </p>
                <div className="flex items-center justify-center gap-2 text-unc-gold font-black">
                  <Coins className="w-4 h-4" />
                  <span>{box.cost}</span>
                </div>
                <button
                  onClick={() => handleOpen(box)}
                  disabled={opening || !user || !afford}
                  className={`w-full mt-4 py-2 rounded-xl font-bold transition-all ${
                    afford && user
                      ? 'bg-unc-gold text-unc-navy hover:scale-105'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {opening ? 'OPENING...' : 'OPEN BOX'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Rarity Info */}
      <section className="mt-16 bg-white/5 rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="text-unc-gold w-6 h-6" />
          Gambling Rules & Odds
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400">
          <div>
            <p className="mb-4">
              Every box contains one random theme from its rarity pool. Odds are equally
              distributed within the pool, and you can never pull a duplicate — boxes only offer
              themes you don't already own.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Common / Uncommon / Rare / Epic: 100% chance of that rarity's theme</li>
              <li>Legendary: 100% chance of a UNC Bear collectible (replaces your logo)</li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-bold text-white">Important Note:</p>
            <p>
              Loot boxes are purchased with tokens earned in-app only — never real money. Payouts
              are purely cosmetic, award no XP, and do not affect your academic standing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
