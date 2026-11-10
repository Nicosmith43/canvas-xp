import React, { useState } from 'react';
import { Coins, Play, RefreshCw, Trophy } from 'lucide-react';

const REEL_SYMBOLS = ['🍎', '🍋', '🍒', '🍇', '🔔', '💎', '7️⃣'];
const SPIN_COST = 10;

export default function Games() {
  const [reels, setReels] = useState(['❓', '❓', '❓']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [tokens, setTokens] = useState(825); // Placeholder, will connect to Supabase
  const [message, setMessage] = useState('Feeling lucky? Spin for 10 Tokens!');

  const spin = () => {
    if (tokens < SPIN_COST) {
      setMessage("Not enough tokens! Keep completing assignments.");
      return;
    }

    setIsSpinning(true);
    setTokens(prev => prev - SPIN_COST);
    setMessage('Spinning...');

    // Simulate reel animation
    setTimeout(() => {
      const newReels = [
        REEL_SYMBOLS[Math.floor(Math.random() * REEL_SYMBOLS.length)],
        REEL_SYMBOLS[Math.floor(Math.random() * REEL_SYMBOLS.length)],
        REEL_SYMBOLS[Math.floor(Math.random() * REEL_SYMBOLS.length)],
      ];
      
      setReels(newReels);
      setIsSpinning(false);
      calculateWin(newReels);
    }, 1500);
  };

  const calculateWin = (result) => {
    const [r1, r2, r3] = result;
    let winAmount = 0;

    if (r1 === r2 && r2 === r3) {
      // Jackpot!
      winAmount = r1 === '7️⃣' ? 500 : 100;
      setMessage(`JACKPOT! You won ${winAmount} Tokens! 🎊`);
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
      // Pair
      winAmount = 20;
      setMessage(`Nice! A pair. You won ${winAmount} Tokens.`);
    } else {
      setMessage('Better luck next time!');
    }

    if (winAmount > 0) {
      setTokens(prev => prev + winAmount);
      // Backend logic would go here: update Supabase token_ledger
      // IMPORTANT: Game payouts NEVER award XP.
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">UNC Arcade</h1>
        <p className="text-xl text-gray-400">Spend tokens, win big. No XP at stake!</p>
      </header>

      <div className="bg-white/5 border-4 border-unc-gold rounded-3xl p-12 relative overflow-hidden shadow-2xl shadow-unc-gold/20">
        {/* Token Balance Badge */}
        <div className="absolute top-6 right-6 bg-blue-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
          <Coins className="w-5 h-5" />
          <span>{tokens} Tokens</span>
        </div>

        {/* Slot Machine Display */}
        <div className="flex justify-center gap-6 mb-12">
          {reels.map((symbol, i) => (
            <div 
              key={i} 
              className={`w-32 h-40 bg-white/10 rounded-2xl flex items-center justify-center text-6xl shadow-inner border border-white/10
                ${isSpinning ? 'animate-bounce' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="text-center">
          <p className={`text-xl font-bold mb-8 ${message.includes('won') ? 'text-unc-gold' : 'text-white'}`}>
            {message}
          </p>
          
          <button
            onClick={spin}
            disabled={isSpinning || tokens < SPIN_COST}
            className={`px-12 py-4 rounded-2xl font-black text-2xl transition-all flex items-center gap-3 mx-auto
              ${isSpinning || tokens < SPIN_COST 
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : 'bg-unc-gold text-unc-navy hover:scale-105 active:scale-95 shadow-lg shadow-unc-gold/40'}`}
          >
            {isSpinning ? <RefreshCw className="animate-spin" /> : <Play />}
            SPIN
          </button>
          
          <p className="mt-4 text-gray-500 text-sm">Cost: {SPIN_COST} Tokens per spin</p>
        </div>
      </div>

      {/* Prize Table */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
          <h3 className="text-unc-gold font-bold mb-2">Jackpot (7-7-7)</h3>
          <p className="text-2xl text-white">500 Tokens</p>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
          <h3 className="text-unc-gold font-bold mb-2">Triple Match</h3>
          <p className="text-2xl text-white">100 Tokens</p>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
          <h3 className="text-unc-gold font-bold mb-2">Any Pair</h3>
          <p className="text-2xl text-white">20 Tokens</p>
        </div>
      </section>
    </div>
  );
}
