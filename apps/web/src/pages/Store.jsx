import React from 'react'
import { ShoppingBag } from 'lucide-react'

export default function Store() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Item Store</h1>
          <p className="text-xl text-gray-400">Unlock new themes and avatars with your earned tokens.</p>
        </div>
        <div className="bg-unc-gold text-unc-blue px-6 py-2 rounded-full font-bold flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          <span>1,250 XP</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-unc-gold/50 transition-all hover:-translate-y-1">
            <div className="aspect-video bg-white/10 flex items-center justify-center relative overflow-hidden">
               <img 
                src={`https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=digital%20item%20avatar%20theme%20gaming%20style%20item%20${i}&image_size=landscape_16_9`} 
                alt="Item"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-unc-gold text-unc-blue px-6 py-2 rounded-lg font-bold">Buy Now</button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-white">Item Name {i}</h3>
                <span className="text-unc-gold font-bold">500 XP</span>
              </div>
              <p className="text-gray-400 text-sm">A cool virtual item to customize your Canvas experience.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
