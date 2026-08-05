import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QuestCard } from './QuestCard';
import { Quest } from '../types';

const mockQuest: Quest = {
  id: 'quest-123',
  userId: 'user-456',
  title: 'Solve Algorithm Challenge',
  description: 'Complete 3 medium dynamic programming problems',
  xpReward: 100,
  difficulty: 'Medium',
  isCompleted: false,
  createdAt: '2026-08-05T12:00:00Z',
};

describe('QuestCard Component', () => {
  it('renders quest title, XP reward, and difficulty badge', () => {
    render(
      <QuestCard
        quest={mockQuest}
        onComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Solve Algorithm Challenge')).toBeInTheDocument();
    expect(screen.getByText('+100 XP')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
  });

  it('triggers onComplete when complete button is clicked', () => {
    const handleComplete = vi.fn();

    render(
      <QuestCard
        quest={mockQuest}
        onComplete={handleComplete}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const completeButton = screen.getByTitle('Complete Quest');
    fireEvent.click(completeButton);

    expect(handleComplete).toHaveBeenCalledWith('quest-123');
  });
});
