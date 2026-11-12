import { ALL_TASKS, tasksFor } from '@/features/tasks/loadTasks';
import { describe, expect, it } from 'vitest';

describe('loadTasks', () => {
  it('loads 10 starter tasks across layout and logic tracks', () => {
    expect(ALL_TASKS.length).toBeGreaterThanOrEqual(10);
    const layoutL1 = tasksFor('layout', 1);
    const logicL1 = tasksFor('logic', 1);

    expect(layoutL1.length).toBe(5);
    expect(logicL1.length).toBe(5);
    expect(layoutL1.some((t) => t.isBoss)).toBe(true);
    expect(logicL1.some((t) => t.isBoss)).toBe(true);
  });

  it('validates that every task has 3 tiered hints and tests or checks', () => {
    for (const task of ALL_TASKS) {
      expect(task.hints).toHaveLength(3);
      expect(task.learn.length).toBeGreaterThan(0);
      expect(task.tests.length + task.checks.length).toBeGreaterThan(0);
    }
  });
});