import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useQuestStore } from '../store/useQuestStore';
import { QuestCard } from '../components/QuestCard';
import { QuestModal } from '../components/QuestModal';
import { LevelUpModal } from '../components/LevelUpModal';
import { Quest, CreateQuestInput } from '../types';
import { PlusCircle, Target, CheckCircle2, ListFilter, Flame, Zap } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    quests,
    isLoading,
    error,
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
    <div className="max-w-7xl mx-auto px-4 pb-12 space-y-6">
      {/* Hunter Dashboard Header */}
      <div className="glass-panel p-6 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              PLAYER COMMAND CENTER
            </span>
          </div>
          <h1 className="font-hud text-2xl font-bold text-slate-100 mt-1">
            Welcome Back, <span className="text-hud-cyan">{user?.username}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete daily quests to gain XP, unlock badges, and advance your Hunter Rank.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-xl font-hud font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>NEW QUEST</span>
        </button>
      </div>

      {/* Quest Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">ACTIVE QUESTS</div>
            <div className="text-xl font-bold font-hud text-slate-100">
              {activeCount}
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">COMPLETED</div>
            <div className="text-xl font-bold font-hud text-emerald-400">
              {completedCount}
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">CURRENT STREAK</div>
            <div className="text-xl font-bold font-hud text-amber-400">
              {user?.streakCount} DAYS
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-400">FILTER:</span>
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                filter === f
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Quest List */}
      {isLoading && quests.length === 0 ? (
        <div className="text-center py-12 text-slate-500 font-mono text-xs">
          LOADING SYSTEM QUESTS...
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-3">
          <Zap className="w-10 h-10 text-slate-600 mx-auto animate-bounce" />
          <h3 className="text-lg font-hud text-slate-300">NO QUESTS FOUND</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You currently have no quests registered under this filter. Click 'NEW QUEST' above to start earning XP!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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

      {/* Quest Creation/Edit Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        editingQuest={editingQuest}
      />

      {/* Level Up & Completion Reward Modal */}
      {completionEvent && (
        <LevelUpModal
          event={completionEvent}
          onClose={clearCompletionEvent}
        />
      )}
    </div>
  );
};
