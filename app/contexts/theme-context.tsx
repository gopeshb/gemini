"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)


// Helper to get system theme
function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'gemini-ui-theme',
  ...props
}: ThemeProviderProps) {
  // Hydration-safe theme state
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  // Track if mounted to avoid SSR mismatch
  const [mounted, setMounted] = useState(false);

  // Sync theme from localStorage and system on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored) {
      setThemeState(stored);
    } else if (defaultTheme === 'system') {
      setThemeState(getSystemTheme());
    } else {
      setThemeState(defaultTheme);
    }
  }, [defaultTheme, storageKey]);

  // Listen for system theme changes if using system
  useEffect(() => {
    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setThemeState('system');
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [theme]);

  // Apply theme to <html> and persist to localStorage
  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    let applied: Theme = theme;
    if (theme === 'system') {
      applied = getSystemTheme();
    }
    root.classList.add(applied);
    localStorage.setItem(storageKey, theme);
  }, [theme, mounted, storageKey]);

  // Gemini-like context value
  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem(storageKey, newTheme);
    },
  };

  // Prevent rendering until mounted to avoid SSR mismatch
  if (!mounted) return null;

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
