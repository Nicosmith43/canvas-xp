import React, { useState } from 'react';
import { Package, Check, MousePointer2 } from 'lucide-react';

export default function Inventory() {
  // Placeholder inventory - will be connected to Supabase 'user_inventory' and 'store_items' tables
  const [items, setItems] = useState([
    {
      id: 'c-1',
      name: 'Basic Blue Theme',
      rarity: 'Common',
      type: 'theme',
      previewColor: '#3b82f6',
      equipped: true,
    },
    {
      id: 'c-2',
      name: 'Basic Green Theme',
      rarity: 'Common',
      type: 'theme',
      previewColor: '#22c55e',
      equipped: false,
    },
    {
      id: 'u-1',
      name: 'Ocean Gradient',
      rarity: 'Uncommon',
      type: 'theme',
      previewColor: 'linear-gradient(to right, #3b82f6, #22c55e)',
      equipped: false,
    },
  ]);

  const equipItem = (itemId) => {
    setItems(
      items.map((item) => ({
        ...item,
        equipped: item.id === itemId,
      }))
    );
    // Backend: Update Supabase user_inventory to set selected=true for this item and false for others of same type
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">Your Inventory</h1>
        <p className="text-xl text-gray-400">Manage and equip your unlocked themes and items.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className={`bg-white/5 border-2 rounded-2xl overflow-hidden transition-all
                ${item.equipped ? 'border-unc-gold shadow-lg shadow-unc-gold/10' : 'border-white/10 hover:border-white/20'}`}
            >
              <div
                className="aspect-square flex items-center justify-center relative"
                style={{ background: item.previewColor }}
              >
                {item.equipped && (
                  <div className="absolute top-4 right-4 bg-unc-gold text-unc-navy p-1.5 rounded-full">
                    <Check className="w-5 h-5 font-bold" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-lg">{item.name}</h3>
                </div>
                <p
                  className={`text-[10px] font-bold uppercase tracking-widest mb-4 
                  ${
                    item.rarity === 'Legendary'
                      ? 'text-yellow-400'
                      : item.rarity === 'Epic'
                        ? 'text-purple-500'
                        : item.rarity === 'Rare'
                          ? 'text-blue-500'
                          : item.rarity === 'Uncommon'
                            ? 'text-green-500'
                            : 'text-gray-500'
                  }`}
                >
                  {item.rarity}
                </p>

                <button
                  onClick={() => equipItem(item.id)}
                  disabled={item.equipped}
                  className={`w-full py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                    ${
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
                      EQUIP
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <Package className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-500">
              Your inventory is empty. Open some boxes in the Arcade!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
