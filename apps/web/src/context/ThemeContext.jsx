/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const [equippedTheme, setEquippedTheme] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshEquipped = useCallback(async () => {
    if (!supabase || !user) {
      setEquippedTheme(null);
      return null;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('user_inventory')
      .select('is_selected, store_items(themes(key, name, kind, rarity, colors, image_url))')
      .eq('user_id', user.id)
      .eq('is_selected', true)
      .maybeSingle();
    setLoading(false);
    if (error) {
      console.error('Error loading equipped theme:', error.message);
      return null;
    }
    const theme = data?.store_items?.themes ?? null;
    setEquippedTheme(theme);
    return theme;
  }, [user]);

  useEffect(() => {
    refreshEquipped();
  }, [refreshEquipped]);

  const value = { equippedTheme, loading, refreshEquipped };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
