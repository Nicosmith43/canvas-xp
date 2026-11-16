import React, { useEffect, useState } from 'react';
import { Coins, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { purchaseItem } from '../lib/economy';
import { useAuth } from '../context/AuthContext';

export default function Store() {
  const { profile, refreshProfile } = useAuth();
  const [items, setItems] = useState([]);
  const [ownedIds, setOwnedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      if (!supabase) return;
      const [{ data: storeItems }, { data: inventory }] = await Promise.all([
        supabase.from('store_items').select('*').gt('price', 0).order('price'),
        supabase.from('user_inventory').select('item_id'),
      ]);
      setItems(storeItems || []);
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

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Item Store</h1>
          <p className="text-xl text-gray-400">
            Unlock profile cosmetics with tokens earned from assignments.
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
      ) : items.length === 0 ? (
        <p className="text-gray-400">No items available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const owned = ownedIds.has(item.id);
            const afford = tokens >= item.price;
            return (
              <div
                key={item.id}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all hover:-translate-y-1"
              >
                <div className="aspect-video bg-gradient-to-br from-unc-blue to-slate-800 flex items-center justify-center relative">
                  <span className="text-4xl font-black text-white/20 uppercase">{item.type}</span>
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
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-xs text-gray-500">
        All prices are in tokens earned in-app. No real money is involved.
      </p>
    </div>
  );
}
