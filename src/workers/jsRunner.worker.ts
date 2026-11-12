import type { LogicTest } from '@/types/task';
import type { TestResultItem } from '@/types/runner';

type WorkerRequest = {
  code: string;
  tests: LogicTest[];
};

function formatValue(val: unknown): string {
  if (val === undefined) return 'undefined';
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { code, tests } = event.data;

  const results: TestResultItem[] = tests.map((test) => {
    try {
      const runnerFn = new Function(`${code}\nreturn (${test.call});`);
      const actual = runnerFn();
      const passed = deepEqual(actual, test.expected);
      return {
        name: test.name,
        passed,
        expected: formatValue(test.expected),
        received: formatValue(actual),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        name: test.name,
        passed: false,
        expected: formatValue(test.expected),
        received: `Ошибка: ${message}`,
      };
    }
  });

  self.postMessage({ results });
};