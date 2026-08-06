import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useQuestStore } from '../store/useQuestStore';
import { QuestCard } from '../components/QuestCard';
import { QuestModal } from '../components/QuestModal';
import { LevelUpModal } from '../components/LevelUpModal';
import { Quest, CreateQuestInput } from '../types';
import { PlusCircle, Target, CheckCircle2, ListFilter, Sparkles, Inbox } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    quests,
    isLoading,
    completionEvent,
    fetchQuests,
    createQuest,
    updateQuest,
    deleteQuest,
    completeQuest,
    clearCompletionEvent,
  } = useQuestStore();

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const filteredQuests = quests.filter((q) => {
    if (filter === 'active') return !q.isCompleted;
    if (filter === 'completed') return q.isCompleted;
    return true;
  });

  const activeCount = quests.filter((q) => !q.isCompleted).length;
  const completedCount = quests.filter((q) => q.isCompleted).length;

  const handleCreateOrUpdate = async (input: CreateQuestInput) => {
    if (editingQuest) {
      await updateQuest(editingQuest.id, input);
    } else {
      await createQuest(input);
    }
  };

  const handleOpenEdit = (quest: Quest) => {
    setEditingQuest(quest);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingQuest(null);
    setIsModalOpen(true);
  };

  return (
    <div className="page-container">
      {/* Hunter Dashboard Header */}
      <div className="glass-card dashboard-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-cyan)', background: 'rgba(0, 229, 255, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
              PLAYER COMMAND CENTER // DASHBOARD
            </span>
          </div>
          <h1 className="font-hud text-hud-cyan" style={{ fontSize: '1.85rem', fontWeight: 900 }}>
            Welcome Back, <span style={{ color: '#fff' }}>{user?.username}</span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '640px' }}>
            Execute daily productivity quests to gain XP, trigger flame boosters, and rank up from E-Rank to National-Level Hunter.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-primary"
          style={{ width: 'auto', flexShrink: 0 }}
        >
          <PlusCircle style={{ width: 18, height: 18 }} />
          <span>Initialize New Quest</span>
        </button>
      </div>

      {/* Quest Quick Stats Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Target style={{ width: 28, height: 28, color: 'var(--accent-cyan)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-secondary)' }}>ACTIVE QUESTS</div>
            <div className="font-hud" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', marginTop: '0.25rem' }}>
              {activeCount}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <CheckCircle2 style={{ width: 28, height: 28, color: 'var(--accent-success)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-secondary)' }}>COMPLETED QUESTS</div>
            <div className="font-hud" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', marginTop: '0.25rem' }}>
              {completedCount}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
            <Sparkles style={{ width: 28, height: 28, color: 'var(--accent-gold)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-secondary)' }}>HUNTER RANK TIER</div>
            <div className="font-hud" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-gold)', marginTop: '0.25rem' }}>
              {user?.rankTier}
            </div>
          </div>
        </div>
      </div>

      {/* Quest Filtering Bar & Section Title */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ListFilter style={{ width: 20, height: 20, color: 'var(--accent-cyan)' }} />
          <h2 className="font-hud" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            SYSTEM QUEST LOG ({filteredQuests.length})
          </h2>
        </div>

        <div className="filter-pills">
          <button
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All ({quests.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Quest List Grid */}
      {isLoading ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
          <div className="animate-spin" style={{ width: 32, height: 32, border: '4px solid var(--accent-cyan)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1rem auto' }} />
          Synchronizing quest data with System Server...
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Inbox style={{ width: 48, height: 48, color: 'var(--text-muted)' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No Quests Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px' }}>
            {filter === 'completed'
              ? 'No completed quests yet. Execute active quests to earn rewards!'
              : 'Your quest log is clear. Click "Initialize New Quest" above to add your next task!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={completeQuest}
              onEdit={handleOpenEdit}
              onDelete={deleteQuest}
            />
          ))}
        </div>
      )}

      {/* Quest Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        editingQuest={editingQuest}
      />

      {/* Level Up Reward Popup Modal */}
      {completionEvent && (
        <LevelUpModal
          event={completionEvent}
          onClose={clearCompletionEvent}
        />
      )}
    </div>
  );
};
