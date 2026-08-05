import React, { useState, useEffect } from 'react';
import { Quest, CreateQuestInput } from '../types';
import { X, PlusCircle, Save } from 'lucide-react';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateQuestInput) => Promise<void>;
  editingQuest?: Quest | null;
}

export const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingQuest,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [xpReward, setXpReward] = useState(50);
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingQuest) {
      setTitle(editingQuest.title);
      setDescription(editingQuest.description || '');
      setDifficulty(editingQuest.difficulty);
      setXpReward(editingQuest.xpReward);
      setDueDate(
        editingQuest.dueDate
          ? new Date(editingQuest.dueDate).toISOString().split('T')[0]
          : ''
      );
    } else {
      setTitle('');
      setDescription('');
      setDifficulty('Easy');
      setXpReward(50);
      setDueDate('');
    }
  }, [editingQuest, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        difficulty,
        xpReward,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDifficultyChange = (diff: 'Easy' | 'Medium' | 'Hard') => {
    setDifficulty(diff);
    // Auto-adjust default XP reward based on difficulty
    if (diff === 'Easy') setXpReward(50);
    else if (diff === 'Medium') setXpReward(100);
    else if (diff === 'Hard') setXpReward(200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 relative border border-cyan-500/40">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <h2 className="font-hud text-xl font-bold text-hud-cyan mb-4 flex items-center gap-2">
          {editingQuest ? <Save className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
          <span>{editingQuest ? 'EDIT QUEST' : 'REGISTER NEW QUEST'}</span>
        </h2>

        {/* Quest Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              QUEST TITLE *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Solve 3 Algorithm Challenges"
              className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-100 text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              DESCRIPTION (OPTIONAL)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details or subtasks..."
              className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-100 text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              DIFFICULTY LEVEL
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => handleDifficultyChange(diff)}
                  className={`py-1.5 rounded text-xs font-mono font-bold border transition-all ${
                    difficulty === diff
                      ? diff === 'Hard'
                        ? 'bg-rose-900/80 text-rose-200 border-rose-500'
                        : diff === 'Medium'
                        ? 'bg-amber-900/80 text-amber-200 border-amber-500'
                        : 'bg-emerald-900/80 text-emerald-200 border-emerald-500'
                      : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                XP REWARD
              </label>
              <input
                type="number"
                min={10}
                max={1000}
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-100 text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                DUE DATE
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-100 text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg font-hud text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all"
            >
              {isSubmitting ? 'SAVING...' : editingQuest ? 'UPDATE QUEST' : 'CREATE QUEST'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
