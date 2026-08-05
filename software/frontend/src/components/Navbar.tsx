import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { Sun, Moon, Flame, LogOut, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  if (!user) return null;

  const xpPercentage = Math.min(
    100,
    Math.max(0, Math.round((user.currentXP / user.requiredXP) * 100))
  );

  const getFlameClass = (color: string) => {
    switch (color) {
      case 'Red':
        return 'flame-red text-rose-500';
      case 'Blue':
        return 'flame-blue text-cyan-400';
      case 'Purple':
        return 'flame-purple text-purple-400';
      case 'White':
        return 'flame-white text-slate-100';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <header className="glass-panel sticky top-0 z-40 mb-6 px-4 py-3 border-b">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & System Title */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <Shield className="w-7 h-7 text-cyan-400 animate-pulse" />
            <span className="font-hud text-xl font-bold text-hud-cyan tracking-wider">
              LEVELING ALONE
            </span>
          </Link>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800 font-mono">
            SYSTEM HUD v1.0
          </span>
        </div>

        {/* User Stats & XP Bar */}
        <div className="flex-1 max-w-xl w-full flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-hud font-bold text-amber-400">
                LVL {user.level}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800 text-[10px] font-bold">
                {user.rankTier}
              </span>
            </div>

            {/* Streak Booster Indicator */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/60 border border-slate-700">
              <Flame className={`w-4 h-4 ${getFlameClass(user.streakFlameColor)}`} />
              <span className="font-bold text-amber-300">
                {user.streakCount} D STREAK
              </span>
            </div>

            <span className="text-slate-400">
              {user.currentXP} / {user.requiredXP} XP ({xpPercentage}%)
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="xp-progress-bar">
            <div
              className="xp-progress-fill"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-3">
          <Link
            to="/badges"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-700/50 transition-all no-underline"
          >
            <Award className="w-4 h-4" />
            <span>Badges ({user.unlockedBadgeCount})</span>
          </Link>

          {/* Dark / Light Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-amber-300 border border-slate-700 transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50 transition-all"
            title="Logout System"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
