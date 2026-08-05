import React, { useEffect, useState } from 'react';
import { Badge } from '../types';
import { fetchApi } from '../api/client';
import { Award, Lock, ArrowLeft } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 pb-12 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 mb-2 transition-colors no-underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Command Center</span>
          </Link>
          <h1 className="font-hud text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-7 h-7 text-amber-400" />
            <span>HUNTER BADGE VAULT</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your achievements, streaks, and milestone unlock status.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-purple-950/60 border border-purple-800 text-center font-mono">
          <div className="text-[10px] text-purple-300">TOTAL UNLOCKED</div>
          <div className="text-xl font-bold text-amber-400 font-hud">
            {unlockedCount} / {badges.length}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Badges Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 font-mono text-xs">
          ACCESSING SYSTEM BADGE CATALOG...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`glass-panel p-5 relative flex flex-col justify-between transition-all ${
                badge.isUnlocked
                  ? 'border-purple-500/50 shadow-[0_0_20px_rgba(157,78,221,0.2)]'
                  : 'opacity-50 grayscale border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-3 rounded-xl ${
                      badge.isUnlocked
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                  >
                    {badge.isUnlocked ? (
                      <Award className="w-6 h-6" />
                    ) : (
                      <Lock className="w-6 h-6" />
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      badge.isUnlocked
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    {badge.isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-100 mb-1">
                  {badge.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {badge.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>Requirement:</span>
                <span className="text-purple-300 font-semibold">
                  {badge.requiredType} {badge.requiredValue}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
