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
        return 'bg-rose-950/60 text-rose-300 border-rose-800';
      case 'Medium':
        return 'bg-amber-950/60 text-amber-300 border-amber-800';
      default:
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
    }
  };

  return (
    <div
      className={`glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
        quest.isCompleted ? 'opacity-60 border-slate-800 bg-slate-950/40' : ''
      }`}
    >
      <div className="flex items-start gap-3 flex-1">
        {/* Quest Completion Checkbox */}
        <button
          onClick={() => !quest.isCompleted && onComplete(quest.id)}
          disabled={quest.isCompleted}
          className={`mt-1 transition-all ${
            quest.isCompleted
              ? 'text-emerald-400 cursor-default'
              : 'text-slate-500 hover:text-cyan-400 cursor-pointer'
          }`}
          title={quest.isCompleted ? 'Quest Completed' : 'Complete Quest'}
        >
          {quest.isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950/50" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        {/* Quest Title & Description */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-semibold text-base ${
                quest.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
              }`}
            >
              {quest.title}
            </h3>

            {/* Difficulty Badge */}
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getDifficultyColor(
                quest.difficulty
              )}`}
            >
              {quest.difficulty.toUpperCase()}
            </span>

            {/* XP Reward Tag */}
            <span className="flex items-center gap-0.5 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
              <Zap className="w-3 h-3 text-cyan-400" />+{quest.xpReward} XP
            </span>
          </div>

          {quest.description && (
            <p className="text-xs text-slate-400 leading-relaxed">
              {quest.description}
            </p>
          )}

          {/* Due Date Indicator */}
          {quest.dueDate && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
              <Clock className="w-3 h-3" />
              <span>Due: {new Date(quest.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Controls */}
      <div className="flex items-center gap-2 self-end md:self-center">
        {!quest.isCompleted && (
          <button
            onClick={() => onEdit(quest)}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700 transition-all text-xs flex items-center gap-1"
            title="Edit Quest"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={() => onDelete(quest.id)}
          className="p-2 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-800/40 transition-all text-xs flex items-center gap-1"
          title="Delete Quest"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
