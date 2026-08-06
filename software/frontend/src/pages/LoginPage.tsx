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
          <h1 className="font-hud text-hud-cyan" style={{ fontSize: '1.75rem', fontWeight: 900 }}>
            SYSTEM AUTHENTICATION
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Access Leveling Alone System Interface
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

        {/* Quick Admin Test Hint */}
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KeyRound style={{ width: 16, height: 16, color: 'var(--accent-gold)' }} />
            <span>System Admin: <strong style={{ color: '#fff' }}>admin@levelingalone.com</strong></span>
          </div>
          <button
            type="button"
            onClick={handleQuickAdminFill}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-gold)',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.75rem'
            }}
          >
            Auto-fill
          </button>
        </div>

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
    </div>
  );
};
