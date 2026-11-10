/**
 * Theme Pools for Loot Boxes
 * Each rarity contains a pool of themes that can be unlocked.
 */
export const themePools = {
  Common: Array.from({ length: 35 }, (_, i) => ({
    id: `c-${i + 1}`,
    name: `Basic ${['Blue', 'Green', 'Red', 'Gray', 'Slate'][i % 5]} ${i + 1}`,
    rarity: 'Common',
    previewColor: ['#3b82f6', '#22c55e', '#ef4444', '#64748b', '#334155'][i % 5],
  })),
  Uncommon: Array.from({ length: 30 }, (_, i) => ({
    id: `u-${i + 1}`,
    name: `Gradient ${['Ocean', 'Forest', 'Sunset', 'Lavender'][i % 4]} ${i + 1}`,
    rarity: 'Uncommon',
    previewColor: 'linear-gradient(to right, #3b82f6, #22c55e)',
  })),
  Rare: Array.from({ length: 30 }, (_, i) => ({
    id: `r-${i + 1}`,
    name: `Neon ${['Cyber', 'Matrix', 'Synthwave'][i % 3]} ${i + 1}`,
    rarity: 'Rare',
    previewColor: '#00ff00',
  })),
  Epic: Array.from({ length: 25 }, (_, i) => ({
    id: `e-${i + 1}`,
    name: `Animated ${['Galaxy', 'Fire', 'Storm'][i % 3]} ${i + 1}`,
    rarity: 'Epic',
    previewColor: '#8b5cf6',
  })),
  Legendary: Array.from({ length: 20 }, (_, i) => ({
    id: `l-${i + 1}`,
    name: `UNC Bear Elite ${i + 1}`,
    rarity: 'Legendary',
    previewColor: '#F6B000',
  })),
};

export const boxCosts = {
  Common: 50,
  Uncommon: 150,
  Rare: 400,
  Epic: 1000,
  Legendary: 2500,
};
