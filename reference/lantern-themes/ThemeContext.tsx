'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Theme, themes, ThemeConfig } from './themes';

interface ThemeContextType {
  theme: Theme;
  themeConfig: ThemeConfig;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'nostalgia',
  themeConfig: themes.nostalgia,
  toggleTheme: () => {},
  isTransitioning: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('nostalgia');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setIsTransitioning(true);
    document.body.classList.add('theme-transition');

    setTimeout(() => {
      setTheme(prev => prev === 'nostalgia' ? 'reality' : 'nostalgia');
    }, 100);

    setTimeout(() => {
      setIsTransitioning(false);
      document.body.classList.remove('theme-transition');
    }, 1200);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, themeConfig: themes[theme], toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
