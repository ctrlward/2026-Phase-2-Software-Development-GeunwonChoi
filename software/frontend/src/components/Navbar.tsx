import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { Sun, Moon, Flame, LogOut, Shield, Award, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

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
    <header className="navbar-header">
      <div className="navbar-inner">
        {/* Brand & Title */}
        <Link to="/" className="navbar-brand">
          <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)', display: 'inline-flex' }}>
            <Shield style={{ width: 24, height: 24, color: 'var(--accent-cyan)' }} />
          </div>
          <div>
            <span className="font-hud text-hud-cyan" style={{ fontSize: '1.15rem', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>
              LEVELING ALONE
            </span>
            <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
              SYSTEM HUD v1.0
            </span>
          </div>
        </Link>

        {/* User Stats & XP Bar */}
        <div className="navbar-stats">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="font-hud" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                LVL {user.level}
              </span>
              <span style={{ padding: '0.15rem 0.5rem', borderRadius: '9999px', background: 'rgba(168, 85, 247, 0.2)', color: 'var(--accent-purple)', border: '1px solid rgba(168, 85, 247, 0.4)', fontSize: '0.65rem', fontWeight: 800 }}>
                {user.rankTier}
              </span>
            </div>

            {/* Streak Booster Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.15rem 0.6rem', borderRadius: '9999px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Flame className={`w-3.5 h-3.5 ${getFlameClass(user.streakFlameColor)}`} />
              <span style={{ fontWeight: 700, color: 'var(--accent-gold)', fontSize: '0.75rem' }}>
                {user.streakCount} D STREAK
              </span>
            </div>

            <span style={{ color: 'var(--text-secondary)' }}>
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
        <div className="navbar-actions">
          <Link
            to="/"
            className={`nav-link-btn ${location.pathname === '/' ? 'active' : ''}`}
          >
            <LayoutDashboard style={{ width: 16, height: 16 }} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/badges"
            className={`nav-link-btn ${location.pathname === '/badges' ? 'active' : ''}`}
          >
            <Award style={{ width: 16, height: 16 }} />
            <span>Badges ({user.unlockedBadgeCount})</span>
          </Link>

          {user.role === 'Admin' && (
            <Link
              to="/admin"
              className={`nav-link-btn ${location.pathname === '/admin' ? 'active' : ''}`}
              style={{ borderColor: 'rgba(251, 191, 36, 0.4)', color: 'var(--accent-gold)' }}
            >
              <Shield style={{ width: 16, height: 16 }} />
              <span>Admin</span>
            </Link>
          )}

          {/* Dark / Light Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="nav-link-btn"
            style={{ padding: '0.6rem' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun style={{ width: 16, height: 16, color: 'var(--accent-gold)' }} /> : <Moon style={{ width: 16, height: 16 }} />}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="nav-link-btn"
            style={{ padding: '0.6rem', color: 'var(--accent-danger)', borderColor: 'rgba(244, 63, 94, 0.4)', background: 'rgba(244, 63, 94, 0.1)' }}
            title="Logout System"
          >
            <LogOut style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </header>
  );
};
