import { create } from 'zustand';
import { Quest, CreateQuestInput, QuestCompletionResponse } from '../types';
import { fetchApi } from '../api/client';
import { useAuthStore } from './useAuthStore';

interface QuestState {
  quests: Quest[];
  isLoading: boolean;
  error: string | null;
  completionEvent: QuestCompletionResponse | null;

  fetchQuests: () => Promise<void>;
  createQuest: (input: CreateQuestInput) => Promise<Quest>;
  updateQuest: (id: string, input: CreateQuestInput) => Promise<Quest>;
  deleteQuest: (id: string) => Promise<void>;
  completeQuest: (id: string) => Promise<QuestCompletionResponse>;
  clearCompletionEvent: () => void;
  clearError: () => void;
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: [],
  isLoading: false,
  error: null,
  completionEvent: null,

  fetchQuests: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchApi<Quest[]>('/quests');
      set({ quests: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch quests', isLoading: false });
    }
  },

  createQuest: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const newQuest = await fetchApi<Quest>('/quests', {
        method: 'POST',
        body: JSON.stringify(input),
      });

      set((state) => ({
        quests: [newQuest, ...state.quests],
        isLoading: false,
      }));

      return newQuest;
    } catch (err: any) {
      set({ error: err.message || 'Failed to create quest', isLoading: false });
      throw err;
    }
  },

  updateQuest: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      const updatedQuest = await fetchApi<Quest>(`/quests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      });

      set((state) => ({
        quests: state.quests.map((q) => (q.id === id ? updatedQuest : q)),
        isLoading: false,
      }));

      return updatedQuest;
    } catch (err: any) {
      set({ error: err.message || 'Failed to update quest', isLoading: false });
      throw err;
    }
  },

  deleteQuest: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await fetchApi<void>(`/quests/${id}`, {
        method: 'DELETE',
      });

      set((state) => ({
        quests: state.quests.filter((q) => q.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete quest', isLoading: false });
      throw err;
    }
  },

  completeQuest: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const completionResult = await fetchApi<QuestCompletionResponse>(
        `/quests/${id}/complete`,
        { method: 'POST' }
      );

      set((state) => ({
        quests: state.quests.map((q) => (q.id === id ? completionResult.quest : q)),
        completionEvent: completionResult,
        isLoading: false,
      }));

      // Update user auth store state (Level, XP, Streak, Rank)
      useAuthStore.getState().updateUserData({
        level: completionResult.newLevel,
        currentXP: completionResult.currentXP,
        requiredXP: completionResult.requiredXP,
        streakCount: completionResult.streakCount,
        rankTier: completionResult.rankTier,
        streakFlameColor: completionResult.streakFlameColor,
      });

      return completionResult;
    } catch (err: any) {
      set({ error: err.message || 'Failed to complete quest', isLoading: false });
      throw err;
    }
  },

  clearCompletionEvent: () => set({ completionEvent: null }),
  clearError: () => set({ error: null }),
}));
