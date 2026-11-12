import type { TaskProgressRecord } from '@/db/database';
import { ALL_TASKS } from '@/features/tasks/loadTasks';
import {
  DAILY_SESSION_SIZE,
  pickDailyTasks,
} from '@/features/today/dailySession';
import { describe, expect, it } from 'vitest';

describe('pickDailyTasks', () => {
  it('picks 3 distinct tasks for a fresh user', () => {
    const slots = pickDailyTasks(ALL_TASKS, {});
    expect(slots).toHaveLength(DAILY_SESSION_SIZE);
    const uniqueIds = new Set(slots.map((s) => s.taskId));
    expect(uniqueIds.size).toBe(DAILY_SESSION_SIZE);
  });

  it('prioritizes repeat queue and due memory review tasks', () => {
    const now = 1_700_000_000_000;
    const progress: Record<string, TaskProgressRecord> = {
      'layout-02-nav': {
        taskId: 'layout-02-nav',
        solved: false,
        attempts: 1,
        bestXp: 0,
        lastSolvedAt: null,
        inRepeatQueue: true,
        reviewStage: 0,
        nextReviewAt: null,
      },
      'js-01-sum-even': {
        taskId: 'js-01-sum-even',
        solved: true,
        attempts: 1,
        bestXp: 15,
        lastSolvedAt: now - 3 * 86400_000,
        inRepeatQueue: false,
        reviewStage: 1,
        nextReviewAt: now - 1000,
      },
    };

    const slots = pickDailyTasks(ALL_TASKS, progress, now);
    expect(slots[0]?.taskId).toBe('layout-02-nav');
    expect(slots[0]?.reason).toBe('repeat');
    expect(slots[1]?.taskId).toBe('js-01-sum-even');
    expect(slots[1]?.reason).toBe('memory');
    expect(slots[1]?.memoryMode).toBe(true);
  });
});