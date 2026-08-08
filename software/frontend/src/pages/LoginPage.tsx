import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, User as UserIcon, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ usernameOrEmail, password });
      navigate('/');
    } catch {
      // Handled in store
    }
  };

  const handleQuickAdminFill = () => {
    setUsernameOrEmail('admin@levelingalone.com');
    setPassword('AdminPassword123!');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Header Branding */}
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <Shield style={{ width: 44, height: 44, color: 'var(--accent-cyan)' }} />
          </div>
          <h1 className="font-hud text-hud-cyan" style={{ fontSize: '1.65rem', fontWeight: 900, textAlign: 'center', lineHeight: 1.25 }}>
            Access Leveling Alone System
          </h1>
          <p className="font-hud" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem', letterSpacing: '0.05em' }}>
            system Authentication
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '0.85rem',
            borderRadius: '12px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: 'var(--accent-danger)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <div className="input-wrapper">
              <UserIcon className="input-icon" />
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Enter hunter username or email"
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ marginTop: '0.5rem' }}
          >
            {isLoading ? (
              'Authenticating...'
            ) : (
              <>
                Initialize System <ArrowRight style={{ width: 18, height: 18 }} />
              </>
            )}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          New Hunter?{' '}
          <Link to="/register" style={{ color: 'var(--accent-cyan)', fontWeight: 700, textDecoration: 'none' }}>
            Awaken Hunter Account →
          </Link>
        </div>
      </div>

      {/* Floating Key Icon for Quick Admin Auto-fill at Bottom Right */}
      <button
        type="button"
        onClick={handleQuickAdminFill}
        title="Auto-fill System Admin Credentials"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(251, 191, 36, 0.6)',
          boxShadow: '0 0 20px rgba(251, 191, 36, 0.3), 0 8px 24px rgba(0, 0, 0, 0.6)',
          color: 'var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(10px)',
          zIndex: 50
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.borderColor = 'var(--accent-gold)';
          e.currentTarget.style.boxShadow = '0 0 25px rgba(251, 191, 36, 0.6), 0 10px 28px rgba(0, 0, 0, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.6)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.3), 0 8px 24px rgba(0, 0, 0, 0.6)';
        }}
      >
        <KeyRound style={{ width: 20, height: 20 }} />
      </button>
    </div>
  );
};
