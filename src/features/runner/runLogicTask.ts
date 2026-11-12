import type { RunOutcome, TestResultItem } from '@/types/runner';
import type { LogicTest } from '@/types/task';

export function runLogicTask(
  code: string,
  tests: LogicTest[],
  timeoutMs = 3000,
): Promise<RunOutcome> {
  return new Promise((resolve) => {
    const worker = new Worker(
      new URL('../../workers/jsRunner.worker.ts', import.meta.url),
      { type: 'module' },
    );

    const timer = window.setTimeout(() => {
      worker.terminate();
      const results: TestResultItem[] = tests.map((t) => ({
        name: t.name,
        passed: false,
        expected: JSON.stringify(t.expected),
        received: 'Таймаут 3 сек (возможен бесконечный цикл)',
      }));
      resolve({ results, allPassed: false, timedOut: true });
    }, timeoutMs);

    worker.onmessage = (
      event: MessageEvent<{ results: TestResultItem[] }>,
    ) => {
      window.clearTimeout(timer);
      worker.terminate();
      const { results } = event.data;
      const allPassed =
        results.length > 0 && results.every((item) => item.passed);
      resolve({ results, allPassed });
    };

    worker.onerror = (err) => {
      window.clearTimeout(timer);
      worker.terminate();
      const results: TestResultItem[] = tests.map((t) => ({
        name: t.name,
        passed: false,
        expected: JSON.stringify(t.expected),
        received: `Ошибка выполнения: ${err.message}`,
      }));
      resolve({ results, allPassed: false });
    };

    worker.postMessage({ code, tests });
  });
}