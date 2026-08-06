import React, { useEffect, useState } from 'react';
import { Badge } from '../types';
import { fetchApi } from '../api/client';
import { Award, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BadgesPage: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const data = await fetchApi<Badge[]>('/users/me/badges');
        setBadges(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load badges catalog');
      } finally {
        setIsLoading(false);
      }
    };

    loadBadges();
  }, []);

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', borderLeft: '4px solid var(--accent-purple)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', fontFamily: 'monospace' }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            <span>RETURN TO COMMAND CENTER</span>
          </Link>
          <h1 className="font-hud" style={{ fontSize: '1.85rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award style={{ width: 32, height: 32, color: 'var(--accent-gold)' }} />
            <span>HUNTER BADGE VAULT</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Review unlocked hunter achievements, streaks, and level milestone badges.
          </p>
        </div>

        <div style={{ padding: '1rem 1.5rem', borderRadius: '16px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', textAlign: 'center', fontFamily: 'monospace' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', fontWeight: 800 }}>TOTAL UNLOCKED</div>
          <div className="font-hud" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent-gold)', marginTop: '0.25rem' }}>
            {unlockedCount} / {badges.length}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', color: 'var(--accent-danger)', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Badges Grid */}
      {isLoading ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
          <div className="animate-spin" style={{ width: 32, height: 32, border: '4px solid var(--accent-purple)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1rem auto' }} />
          ACCESSING SYSTEM BADGE CATALOG...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem' }}>
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                opacity: badge.isUnlocked ? 1 : 0.55,
                filter: badge.isUnlocked ? 'none' : 'grayscale(1)',
                borderColor: badge.isUnlocked ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      padding: '0.75rem',
                      borderRadius: '14px',
                      background: badge.isUnlocked ? 'rgba(251, 191, 36, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                      color: badge.isUnlocked ? 'var(--accent-gold)' : 'var(--text-muted)',
                      border: `1px solid ${badge.isUnlocked ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`
                    }}
                  >
                    {badge.isUnlocked ? (
                      <Award style={{ width: 28, height: 28 }} />
                    ) : (
                      <Lock style={{ width: 28, height: 28 }} />
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      padding: '0.25rem 0.6rem',
                      borderRadius: '9999px',
                      background: badge.isUnlocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                      color: badge.isUnlocked ? 'var(--accent-success)' : 'var(--text-muted)',
                      border: `1px solid ${badge.isUnlocked ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`
                    }}
                  >
                    {badge.isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{badge.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                    {badge.description}
                  </p>
                </div>
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                {badge.isUnlocked ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-success)', fontWeight: 700 }}>
                    <CheckCircle style={{ width: 14, height: 14 }} />
                    <span>Unlocked: {new Date(badge.unlockedAt!).toLocaleDateString()}</span>
                  </div>
                ) : (
                  <div>
                    Requirement: <strong style={{ color: '#fff' }}>{badge.requiredType} = {badge.requiredValue}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
