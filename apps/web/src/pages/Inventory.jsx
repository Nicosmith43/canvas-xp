import React, { useEffect, useState } from 'react';
import { Package, Check, MousePointer2, PawPrint } from 'lucide-react';
import { getThemeCollection, equipItem } from '../lib/economy';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

const rarityText = {
  Common: 'text-gray-500',
  Uncommon: 'text-green-500',
  Rare: 'text-blue-500',
  Epic: 'text-purple-500',
  Legendary: 'text-yellow-400',
};

function ThemeSwatch({ theme }) {
  const colors = theme.colors || {};
  if (theme.kind === 'bear') {
    return (
      <div
        className="aspect-square flex items-center justify-center relative"
        style={{ background: colors.primary || '#F6B000' }}
      >
        {theme.image_url ? (
          <img src={theme.image_url} alt={theme.name} className="w-3/4 h-3/4 object-contain" />
        ) : (
          <PawPrint className="w-16 h-16 text-white/80" />
        )}
      </div>
    );
  }
  if (colors.secondary) {
    return (
      <div
        className="aspect-square"
        style={{
          background: `linear-gradient(135deg, ${colors.primary || '#334155'}, ${colors.secondary})`,
        }}
      />
    );
  }
  return (
    <div
      className="aspect-square"
      style={{ background: colors.primary || '#334155' }}
    />
  );
}

export default function Inventory() {
  const { user } = useAuth();
  const { refreshEquipped } = useTheme();
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [showLocked, setShowLocked] = useState(false);

  const load = async () => {
    try {
      const data = await getThemeCollection();
      setCollection(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleEquip = async (item) => {
    setError('');
    setBusyId(item.item_id);
    try {
      await equipItem(item.item_id);
      await load();
      await refreshEquipped();
    } catch (err) {
      setError(err.message || 'Failed to equip');
    } finally {
      setBusyId(null);
    }
  };

  const owned = collection.filter((t) => t.owned);
  const visible = showLocked ? collection : owned;
  const totalThemes = collection.length;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Your Inventory</h1>
          <p className="text-xl text-gray-400">
            {owned.length} of {totalThemes} themes collected. Equip one to reskin your dashboard.
          </p>
        </div>
        <button
          onClick={() => setShowLocked((v) => !v)}
          className="text-sm text-unc-gold hover:underline"
        >
          {showLocked ? 'Hide locked themes' : 'Show locked themes'}
        </button>
      </header>

      {error && (
        <p className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-400">Loading inventory...</p>
      ) : visible.length === 0 ? (
        <div className="col-span-full py-20 text-center">
          <Package className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-500">
            Your inventory is empty. Open some boxes in the Arcade!
          </p>
        </div>
      ) : (
        RARITY_ORDER.map((rarity) => {
          const items = visible.filter((t) => t.rarity === rarity);
          if (items.length === 0) return null;
          return (
            <section key={rarity} className="mb-12">
              <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 ${rarityText[rarity]}`}>
                {rarity} ({items.filter((t) => t.owned).length}/{items.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                  <div
                    key={item.theme_id}
                    className={`bg-white/5 border-2 rounded-2xl overflow-hidden transition-all ${
                      item.equipped
                        ? 'border-unc-gold shadow-lg shadow-unc-gold/10'
                        : item.owned
                          ? 'border-white/10 hover:border-white/20'
                          : 'border-white/5 opacity-50'
                    }`}
                  >
                    <div className="relative">
                      <ThemeSwatch theme={item} />
                      {!item.owned && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      {item.equipped && (
                        <div className="absolute top-4 right-4 bg-unc-gold text-unc-navy p-1.5 rounded-full">
                          <Check className="w-5 h-5 font-bold" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-white text-lg mb-1">{item.name}</h3>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${rarityText[item.rarity]}`}>
                        {item.rarity}
                        {item.kind === 'bear' ? ' • Bear' : ''}
                      </p>
                      {item.owned ? (
                        <button
                          onClick={() => handleEquip(item)}
                          disabled={item.equipped || busyId === item.item_id}
                          className={`w-full py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                            item.equipped
                              ? 'bg-gray-700 text-gray-400 cursor-default'
                              : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
                          }`}
                        >
                          {item.equipped ? (
                            'EQUIPPED'
                          ) : (
                            <>
                              <MousePointer2 className="w-4 h-4" />
                              {busyId === item.item_id ? 'EQUIPPING...' : 'EQUIP'}
                            </>
                          )}
                        </button>
                      ) : (
                        <p className="text-xs text-gray-500 text-center py-2">
                          Find this in a {item.rarity} box
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
