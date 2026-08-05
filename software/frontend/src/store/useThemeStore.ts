import { create } from 'zustand';

type ThemeMode = 'dark' | 'light';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
  if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
    return savedTheme;
  }
  return 'dark'; // Default Solo Leveling System Dark Theme
};

const applyThemeToDocument = (theme: ThemeMode) => {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
  }
};

const initialTheme = getInitialTheme();
applyThemeToDocument(initialTheme);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,

  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      applyThemeToDocument(nextTheme);
      return { theme: nextTheme };
    }),

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    applyThemeToDocument(theme);
    set({ theme });
  },
}));
