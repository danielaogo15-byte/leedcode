import { injectBugIntoTask } from '@/features/special/specialModes';
import { ALL_TASKS } from '@/features/tasks/loadTasks';
import { describe, expect, it } from 'vitest';

describe('injectBugIntoTask (Bug Hunt mode)', () => {
  it('injects an actual bug into every single layout and logic task', () => {
    for (const task of ALL_TASKS) {
      const buggy = injectBugIntoTask(task);
      expect(buggy.bugHint.length).toBeGreaterThan(10);

      if (task.track === 'layout') {
        const isTailwind =
          task.codeLanguage === 'tailwind' && !task.starterCss.trim();
        if (isTailwind) {
          expect(buggy.html).not.toBe(task.targetHtml || task.solution);
        } else {
          expect(buggy.css).not.toBe(task.targetCss || task.solution);
        }
      } else {
        expect(buggy.js).not.toBe(task.solution);
      }
    }
  });
});