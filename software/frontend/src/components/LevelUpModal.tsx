import React from 'react';
import { QuestCompletionResponse, Badge } from '../types';
import { ShieldAlert, Award, Zap, CheckCircle } from 'lucide-react';

interface LevelUpModalProps {
  event: QuestCompletionResponse;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg p-6 border-2 border-cyan-400/80 shadow-[0_0_50px_rgba(0,229,255,0.4)] relative overflow-hidden text-center">
        {/* Decorative Top Banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 animate-pulse" />

        {/* System Header */}
        <div className="flex items-center justify-center gap-2 mb-2 text-cyan-400">
          <ShieldAlert className="w-8 h-8 animate-bounce" />
          <span className="font-hud font-bold text-sm tracking-widest text-cyan-300">
            SYSTEM NOTIFICATION
          </span>
        </div>

        {/* Main Title */}
        <h2 className="font-hud text-3xl font-extrabold text-amber-400 tracking-wider my-3 drop-shadow-[0_0_15px_rgba(255,183,3,0.6)]">
          {event.leveledUp ? 'LEVEL UP!' : 'QUEST COMPLETED!'}
        </h2>

        {/* Level & Rank Gains */}
        <div className="my-6 p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex justify-around items-center">
          <div className="text-center">
            <div className="text-xs text-slate-400 font-mono">XP EARNED</div>
            <div className="text-2xl font-bold font-hud text-emerald-400 flex items-center justify-center gap-1">
              <Zap className="w-5 h-5" /> +{event.xpEarned}
            </div>
            {event.streakMultiplier > 1.0 && (
              <span className="text-[10px] text-amber-300 font-mono">
                ({event.streakMultiplier}x Streak Bonus)
              </span>
            )}
          </div>

          <div className="h-10 w-px bg-slate-700" />

          <div className="text-center">
            <div className="text-xs text-slate-400 font-mono">CURRENT LEVEL</div>
            <div className="text-2xl font-bold font-hud text-cyan-400">
              LVL {event.newLevel}
            </div>
            <span className="text-xs text-purple-300 font-mono font-bold">
              {event.rankTier}
            </span>
          </div>
        </div>

        {/* Newly Unlocked Badges Section */}
        {event.newlyUnlockedBadges.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-purple-950/40 border border-purple-500/50 text-left">
            <div className="flex items-center gap-2 text-purple-300 font-hud text-xs font-bold mb-3">
              <Award className="w-5 h-5 text-amber-400" />
              <span>NEW BADGE UNLOCKED!</span>
            </div>
            <div className="space-y-2">
              {event.newlyUnlockedBadges.map((badge: Badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/80 border border-purple-800/50"
                >
                  <Award className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-slate-100">{badge.name}</div>
                    <div className="text-xs text-slate-400">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg font-hud font-bold text-sm tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          <span>CONFIRM REWARD</span>
        </button>
      </div>
    </div>
  );
};
