import { ALL_TASKS, tasksFor } from '@/features/tasks/loadTasks';
import { describe, expect, it } from 'vitest';

describe('loadTasks', () => {
  it('loads all tasks across layout and logic tracks (levels 1-7)', () => {
    expect(ALL_TASKS.length).toBeGreaterThanOrEqual(75);
    expect(tasksFor('layout', 1).length).toBeGreaterThanOrEqual(5);
    expect(tasksFor('logic', 1).length).toBeGreaterThanOrEqual(5);
  });

  it('validates that every task has 3 tiered hints and tests or checks', () => {
    for (const task of ALL_TASKS) {
      expect(task.hints).toHaveLength(3);
      expect(task.learn.length).toBeGreaterThan(0);
      const totalChecks =
        task.tests.length +
        task.checks.length +
        (task.codeChecks ? task.codeChecks.length : 0);
      expect(totalChecks).toBeGreaterThan(0);
    }
  });
});