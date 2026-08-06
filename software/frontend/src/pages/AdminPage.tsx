import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../api/admin';
import { User } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { Shield, Trash2, Search, AlertTriangle, CheckCircle, RefreshCw, UserX } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<User | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve user registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (userToDelete: User) => {
    setDeletingId(userToDelete.id);
    setError(null);
    setActionSuccess(null);
    try {
      const res = await deleteUser(userToDelete.id);
      setActionSuccess(res.message || `Account '${userToDelete.username}' deleted.`);
      setConfirmUser(null);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user account');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* System Banner Header */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', borderLeft: '4px solid var(--accent-gold)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-gold)', background: 'rgba(251, 191, 36, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid rgba(251, 191, 36, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Shield style={{ width: 14, height: 14 }} /> SYSTEM OVERSEER CONTROL PANEL
            </span>
          </div>
          <h1 className="font-hud" style={{ fontSize: '1.85rem', fontWeight: 900 }}>
            Hunter Registry & Oversight
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '640px' }}>
            Review registered hunter player accounts, roles, level progression, and execute account purges.
          </p>
        </div>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="btn-secondary"
        >
          <RefreshCw className={loading ? 'animate-spin' : ''} style={{ width: 16, height: 16 }} />
          Refresh Registry
        </button>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <CheckCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <AlertTriangle style={{ width: 18, height: 18, flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Stats Bar */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap', padding: '1.25rem 1.75rem' }}>
        <div className="input-wrapper" style={{ maxWidth: '380px' }}>
          <Search className="input-icon" />
          <input
            type="text"
            placeholder="Search by hunter username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
          <div>
            Total Registered: <strong style={{ color: 'var(--accent-cyan)', fontSize: '1rem' }}>{users.length}</strong>
          </div>
          <div>
            Administrators: <strong style={{ color: 'var(--accent-gold)', fontSize: '1rem' }}>{users.filter((u) => u.role === 'Admin').length}</strong>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
            <RefreshCw className="animate-spin" style={{ width: 32, height: 32, margin: '0 auto 1rem auto', color: 'var(--accent-cyan)' }} />
            Loading system user registry...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <UserX style={{ width: 44, height: 44, color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Hunter Accounts Found</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No registered accounts matched your search keyword.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hunter Profile</th>
                <th>Role</th>
                <th>Rank & Level</th>
                <th>Flame Streak</th>
                <th>Quests & Badges</th>
                <th>Registered Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isCurrentSelf = currentUser?.id === u.id;
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{u.username}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{u.email}</div>
                    </td>
                    <td>
                      {u.role === 'Admin' ? (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: 'rgba(251, 191, 36, 0.2)', color: 'var(--accent-gold)', border: '1px solid rgba(251, 191, 36, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Shield style={{ width: 12, height: 12 }} /> Admin
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: 'rgba(30, 41, 59, 0.8)', color: 'var(--text-secondary)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          User
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="font-hud" style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>{u.rankTier}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace', marginLeft: '0.35rem' }}>(Lvl {u.level})</span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      🔥 <strong style={{ color: 'var(--accent-gold)' }}>{u.streakCount} days</strong> ({u.streakFlameColor})
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <div>Quests: <strong style={{ color: 'var(--accent-cyan)' }}>{u.completedQuestCount}</strong></div>
                      <div>Badges: <strong style={{ color: 'var(--accent-gold)' }}>{u.unlockedBadgeCount}</strong></div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isCurrentSelf ? (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontStyle: 'italic' }}>Active Self</span>
                      ) : (
                        <button
                          onClick={() => setConfirmUser(u)}
                          disabled={deletingId === u.id}
                          style={{
                            padding: '0.4rem 0.85rem',
                            borderRadius: '10px',
                            background: 'rgba(244, 63, 94, 0.15)',
                            color: 'var(--accent-danger)',
                            border: '1px solid rgba(244, 63, 94, 0.3)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Trash2 style={{ width: 14, height: 14 }} /> Purge
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem', borderColor: 'rgba(244, 63, 94, 0.5)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-danger)' }}>
              <div style={{ padding: '0.75rem', borderRadius: '14px', background: 'rgba(244, 63, 94, 0.2)', border: '1px solid rgba(244, 63, 94, 0.4)' }}>
                <AlertTriangle style={{ width: 28, height: 28 }} />
              </div>
              <div>
                <h3 className="font-hud" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Purge Hunter Account?</h3>
                <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>SYSTEM ADMIN OVERRIDE</p>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Are you sure you want to permanently purge hunter account{' '}
              <strong style={{ color: 'var(--accent-danger)' }}>{confirmUser.username}</strong> ({confirmUser.email})?
            </p>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
              <div>• Level {confirmUser.level} ({confirmUser.rankTier})</div>
              <div>• All completed quests and badges will be permanently erased.</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '0.5rem' }}>
              <button
                onClick={() => setConfirmUser(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmUser)}
                disabled={deletingId === confirmUser.id}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  background: 'var(--accent-danger)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {deletingId === confirmUser.id ? (
                  <>
                    <RefreshCw className="animate-spin" style={{ width: 16, height: 16 }} /> Purging...
                  </>
                ) : (
                  <>
                    <Trash2 style={{ width: 16, height: 16 }} /> Confirm Purge
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
