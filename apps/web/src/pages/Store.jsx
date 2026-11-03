import React from 'react'
import { ShoppingBag, Coins } from 'lucide-react'

export default function Store() {
  const items = [
    { name: "Common Avatar Frame", price: 100, rarity: "Common", desc: "A simple frame for your profile." },
    { name: "Uncommon Theme", price: 250, rarity: "Uncommon", desc: "A subtle color change for Canvas." },
    { name: "Rare Midnight Theme", price: 500, rarity: "Rare", desc: "A dark, high-contrast theme for late nights." },
    { name: "Epic UNC Bear Avatar", price: 1000, rarity: "Epic", desc: "Show your school spirit with the official mascot!" },
    { name: "Mystery Reward Box", price: 300, rarity: "Mystery", desc: "What's inside? Open to find out!" },
    { name: "Token Multiplier (2h)", price: 150, rarity: "Booster", desc: "Earn double tokens for the next 2 hours." },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Item Store</h1>
          <p className="text-xl text-gray-400">Unlock new themes and avatars with your earned tokens.</p>
        </div>
        <div className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <Coins className="w-5 h-5" />
          <span>825 Tokens</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <div key={i} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all hover:-translate-y-1">
            <div className="aspect-video bg-white/10 flex items-center justify-center relative overflow-hidden">
               <img 
                src={`https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=digital%20item%20${item.rarity}%20${item.name}%20gaming%20style&image_size=landscape_16_9`} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg">Purchase</button>
              </div>
              <div className="absolute top-4 left-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                  item.rarity === 'Epic' ? 'bg-purple-500 text-white' : 
                  item.rarity === 'Rare' ? 'bg-blue-500 text-white' : 
                  item.rarity === 'Uncommon' ? 'bg-green-500 text-white' : 
                  'bg-gray-500 text-white'
                }`}>
                  {item.rarity}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-white">{item.name}</h3>
                <div className="flex items-center gap-1 text-blue-400 font-bold">
                  <Coins className="w-4 h-4" />
                  <span>{item.price}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
