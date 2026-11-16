import React, { useEffect, useState } from 'react';
import { Coins, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { purchaseItem } from '../lib/economy';
import { useAuth } from '../context/AuthContext';

const RARITIES = ['All', 'Common', 'Uncommon', 'Rare', 'Epic'];

const rarityBadge = {
  Common: 'bg-gray-500 text-white',
  Uncommon: 'bg-green-500 text-white',
  Rare: 'bg-blue-500 text-white',
  Epic: 'bg-purple-500 text-white',
  Legendary: 'bg-yellow-500 text-black',
};

function ThemeSwatch({ theme }) {
  const colors = theme?.colors || {};
  const style = colors.secondary
    ? { background: `linear-gradient(135deg, ${colors.primary || '#334155'}, ${colors.secondary})` }
    : { background: colors.primary || '#334155' };
  return <div className="aspect-video w-full" style={style} />;
}

export default function Store() {
  const { profile, refreshProfile } = useAuth();
  const [cosmetics, setCosmetics] = useState([]);
  const [themes, setThemes] = useState([]);
  const [ownedIds, setOwnedIds] = useState(new Set());
  const [rarityFilter, setRarityFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      if (!supabase) return;
      const [{ data: items }, { data: inventory }] = await Promise.all([
        supabase
          .from('store_items')
          .select('*, themes(key, name, rarity, kind, colors, image_url)')
          .gt('price', 0)
          .order('price'),
        supabase.from('user_inventory').select('item_id'),
      ]);
      const rows = items || [];
      setCosmetics(rows.filter((i) => !i.themes));
      setThemes(rows.filter((i) => i.themes));
      setOwnedIds(new Set((inventory || []).map((row) => row.item_id)));
      setLoading(false);
    }
    load();
  }, []);

  const handlePurchase = async (item) => {
    setError('');
    setBusyId(item.id);
    try {
      await purchaseItem(item.id);
      setOwnedIds((prev) => new Set(prev).add(item.id));
      await refreshProfile();
    } catch (err) {
      setError(err.message || 'Purchase failed');
    } finally {
      setBusyId(null);
    }
  };

  const tokens = profile?.token_balance ?? 0;
  const visibleThemes =
    rarityFilter === 'All' ? themes : themes.filter((t) => t.themes.rarity === rarityFilter);

  const buyButton = (item, owned) => {
    const afford = tokens >= item.price;
    return (
      <button
        onClick={() => handlePurchase(item)}
        disabled={owned || !afford || busyId === item.id}
        className={`w-full py-2 rounded-xl font-bold transition-all ${
          owned
            ? 'bg-gray-700 text-gray-400 cursor-default'
            : afford
              ? 'bg-blue-500 text-white hover:bg-blue-400 active:scale-95'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        {owned ? 'OWNED' : busyId === item.id ? 'BUYING...' : 'PURCHASE'}
      </button>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Item Store</h1>
          <p className="text-xl text-gray-400">
            Guaranteed themes and profile cosmetics — spend tokens, never real money.
          </p>
        </div>
        <div className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <Coins className="w-5 h-5" />
          <span>{tokens} Tokens</span>
        </div>
      </header>

      {error && (
        <p className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-400">Loading store...</p>
      ) : (
        <>
          {/* Guaranteed theme store */}
          <section className="mb-16">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Theme Store</h2>
                <p className="text-gray-400 text-sm">
                  Pick exactly what you want. Legendary Bears are loot-box exclusive.
                </p>
              </div>
              <div className="flex gap-2">
                {RARITIES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRarityFilter(r)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                      rarityFilter === r
                        ? 'bg-unc-gold text-unc-navy'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleThemes.map((item) => {
                const owned = ownedIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all"
                  >
                    <ThemeSwatch theme={item.themes} />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-white text-sm">{item.themes.name}</h3>
                        {owned && (
                          <span className="text-green-400">
                            <Check className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2 ${rarityBadge[item.themes.rarity] || 'bg-gray-500 text-white'}`}
                      >
                        {item.themes.rarity}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-blue-400 font-bold text-sm">
                          <Coins className="w-4 h-4" />
                          {item.price}
                        </span>
                        {buyButton(item, owned)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Profile cosmetics */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Profile Cosmetics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cosmetics.map((item) => {
                const owned = ownedIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all hover:-translate-y-1"
                  >
                    <div className="aspect-video bg-gradient-to-br from-unc-blue to-slate-800 flex items-center justify-center relative">
                      <span className="text-4xl font-black text-white/20 uppercase">
                        {item.type}
                      </span>
                      {owned && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white p-1.5 rounded-full">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                        <div className="flex items-center gap-1 text-blue-400 font-bold">
                          <Coins className="w-4 h-4" />
                          <span>{item.price}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                      {buyButton(item, owned)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      <p className="mt-8 text-xs text-gray-500">
        All prices are in tokens earned in-app. No real money is involved.
      </p>
    </div>
  );
}
