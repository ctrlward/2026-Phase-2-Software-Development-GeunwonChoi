import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminPage } from './AdminPage';

// Mock admin API calls
vi.mock('../api/admin', () => ({
  getAllUsers: vi.fn().mockResolvedValue([
    {
      id: 'admin-1',
      username: 'system_admin',
      email: 'admin@levelingalone.com',
      role: 'Admin',
      level: 100,
      currentXP: 0,
      requiredXP: 10000,
      streakCount: 99,
      rankTier: 'National-Level',
      streakFlameColor: 'White',
      createdAt: '2026-01-01T00:00:00Z',
      completedQuestCount: 50,
      unlockedBadgeCount: 8,
    },
    {
      id: 'user-2',
      username: 'Hunter_Solo',
      email: 'hunter@shadow.com',
      role: 'User',
      level: 10,
      currentXP: 50,
      requiredXP: 1000,
      streakCount: 5,
      rankTier: 'D-Rank',
      streakFlameColor: 'None',
      createdAt: '2026-02-01T00:00:00Z',
      completedQuestCount: 12,
      unlockedBadgeCount: 3,
    },
  ]),
  deleteUser: vi.fn().mockResolvedValue({ message: 'User deleted successfully.' }),
}));

describe('AdminPage Component', () => {
  it('renders admin registry heading and user count', async () => {
    render(<AdminPage />);
    expect(await screen.findByText('Hunter Registry & Oversight')).toBeInTheDocument();
    expect(await screen.findByText('Hunter_Solo')).toBeInTheDocument();
  });
});
