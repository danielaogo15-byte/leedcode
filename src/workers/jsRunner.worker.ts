import type { CustomRunOutcome, TestResultItem } from '@/types/runner';
import type { LogicTest } from '@/types/task';

type WorkerRequest =
  | {
      mode?: 'tests';
      code: string;
      tests: LogicTest[];
    }
  | {
      mode: 'custom';
      code: string;
      customCall: string;
    };

function formatValue(val: unknown): string {
  if (val === undefined) return 'undefined';
  if (typeof val === 'string') return JSON.stringify(val);
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

function formatLogArg(val: unknown): string {
  if (typeof val === 'string') return val;
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

function runWithCapturedConsole<T>(fn: () => T): {
  value: T;
  logs: string[];
  durationMs: number;
} {
  const logs: string[] = [];
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;

  const pushLog = (prefix: string, args: unknown[]) => {
    const text = args.map(formatLogArg).join(' ');
    logs.push(prefix ? `${prefix} ${text}` : text);
  };

  console.log = (...args: unknown[]) => pushLog('', args);
  console.info = (...args: unknown[]) => pushLog('ℹ️', args);
  console.warn = (...args: unknown[]) => pushLog('⚠️', args);
  console.error = (...args: unknown[]) => pushLog('✖', args);

  const start = performance.now();
  try {
    const value = fn();
    const durationMs = Math.max(1, Math.round(performance.now() - start));
    return { value, logs, durationMs };
  } catch (err) {
    const durationMs = Math.max(1, Math.round(performance.now() - start));
    throw Object.assign(new Error(err instanceof Error ? err.message : String(err)), {
      capturedLogs: logs,
      durationMs,
    });
  } finally {
    console.log = originalLog;
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
  }
}

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const data = event.data;

  if (data.mode === 'custom') {
    try {
      const { value, logs, durationMs } = runWithCapturedConsole(() => {
        const runnerFn = new Function(`${data.code}\nreturn (${data.customCall});`);
        return runnerFn();
      });
      const customResult: CustomRunOutcome = {
        call: data.customCall,
        output: formatValue(value),
        logs,
        isError: false,
        durationMs,
      };
      self.postMessage({ customResult });
    } catch (error) {
      const errObj = error as Error & {
        capturedLogs?: string[];
        durationMs?: number;
      };
      const customResult: CustomRunOutcome = {
        call: data.customCall,
        output: `Ошибка: ${errObj.message}`,
        logs: errObj.capturedLogs ?? [],
        isError: true,
        durationMs: errObj.durationMs ?? 1,
      };
      self.postMessage({ customResult });
    }
    return;
  }

  const { code, tests } = data;

  const results: TestResultItem[] = tests.map((test) => {
    try {
      const { value: actual, logs, durationMs } = runWithCapturedConsole(() => {
        const runnerFn = new Function(`${code}\nreturn (${test.call});`);
        return runnerFn();
      });
      const passed = deepEqual(actual, test.expected);
      return {
        name: test.name,
        passed,
        expected: formatValue(test.expected),
        received: formatValue(actual),
        logs,
        durationMs,
      };
    } catch (error) {
      const errObj = error as Error & {
        capturedLogs?: string[];
        durationMs?: number;
      };
      return {
        name: test.name,
        passed: false,
        expected: formatValue(test.expected),
        received: `Ошибка: ${errObj.message}`,
        logs: errObj.capturedLogs ?? [],
        durationMs: errObj.durationMs ?? 1,
      };
    }
  });

  self.postMessage({ results });
};