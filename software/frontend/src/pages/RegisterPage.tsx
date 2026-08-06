import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, User as UserIcon, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register({ username, email, password });
      navigate('/');
    } catch {
      // Handled in store
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card" style={{ borderColor: 'rgba(168, 85, 247, 0.35)', boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(168, 85, 247, 0.15)' }}>
        {/* Header Branding */}
        <div className="auth-header">
          <div className="auth-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.08)', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
            <Shield style={{ width: 44, height: 44, color: 'var(--accent-purple)' }} />
          </div>
          <h1 className="font-hud" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent-purple)', textShadow: '0 0 12px rgba(168, 85, 247, 0.4)' }}>
            HUNTER REGISTRATION
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Awaken Your Player Account
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Hunter Username</label>
            <div className="input-wrapper">
              <UserIcon className="input-icon" />
              <input
                type="text"
                required
                minLength={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose hunter username"
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hunter@association.com"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="input-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)',
              marginTop: '0.5rem'
            }}
          >
            {isLoading ? (
              'Awakening Account...'
            ) : (
              <>
                Awaken Player Account <ArrowRight style={{ width: 18, height: 18 }} />
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
          Already Awakened?{' '}
          <Link to="/login" style={{ color: 'var(--accent-purple)', fontWeight: 700, textDecoration: 'none' }}>
            Sign In System →
          </Link>
        </div>
      </div>
    </div>
  );
};
