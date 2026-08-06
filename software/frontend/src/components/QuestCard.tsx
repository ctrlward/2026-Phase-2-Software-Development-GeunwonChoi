import React from 'react';
import { Quest } from '../types';
import { CheckCircle2, Circle, Edit3, Trash2, Zap, Clock } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onEdit: (quest: Quest) => void;
  onDelete: (id: string) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onComplete,
  onEdit,
  onDelete,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Hard':
        return 'bg-rose-950/60 text-rose-300 border-rose-700/60';
      case 'Medium':
        return 'bg-amber-950/60 text-amber-300 border-amber-700/60';
      default:
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60';
    }
  };

  return (
    <div
      className={`glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 ${
        quest.isCompleted
          ? 'opacity-60 border-slate-800 bg-slate-950/30 hover:opacity-90'
          : 'hover:border-cyan-500/50 hover:shadow-[0_10px_30px_-10px_rgba(0,229,255,0.2)]'
      }`}
    >
      <div className="flex items-start gap-4 flex-1">
        {/* Quest Completion Checkbox */}
        <button
          onClick={() => !quest.isCompleted && onComplete(quest.id)}
          disabled={quest.isCompleted}
          className={`mt-1 p-1 rounded-lg transition-all ${
            quest.isCompleted
              ? 'text-emerald-400 cursor-default'
              : 'text-slate-500 hover:text-cyan-400 hover:scale-110 cursor-pointer'
          }`}
          title={quest.isCompleted ? 'Quest Completed' : 'Complete Quest'}
        >
          {quest.isCompleted ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-400 fill-emerald-950/60" />
          ) : (
            <Circle className="w-7 h-7" />
          )}
        </button>

        {/* Quest Info */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3
              className={`font-bold text-lg tracking-tight ${
                quest.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
              }`}
            >
              {quest.title}
            </h3>

            {/* Difficulty Badge */}
            <span
              className={`text-[11px] font-mono font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider ${getDifficultyColor(
                quest.difficulty
              )}`}
            >
              {quest.difficulty}
            </span>

            {/* XP Reward Tag */}
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-700/60 px-3 py-1 rounded-full shadow-inner">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />+{quest.xpReward} XP
            </span>
          </div>

          {quest.description && (
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {quest.description}
            </p>
          )}

          {/* Due Date Indicator */}
          {quest.dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono pt-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Target Completion: <strong className="text-slate-300">{new Date(quest.dueDate).toLocaleDateString()}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Card Controls */}
      <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
        {!quest.isCompleted && (
          <button
            onClick={() => onEdit(quest)}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all hover:text-cyan-300 flex items-center gap-1.5"
            title="Edit Quest"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}

        <button
          onClick={() => onDelete(quest.id)}
          className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50 text-xs font-semibold transition-all flex items-center gap-1.5"
          title="Abandon Quest"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Abandon</span>
        </button>
      </div>
    </div>
  );
};
