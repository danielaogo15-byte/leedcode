import type { RunOutcome, TestResultItem } from '@/types/runner';
import type { CodePatternCheck } from '@/types/task';

export async function runSqlTask(
  sqlCode: string,
  codeChecks: CodePatternCheck[],
): Promise<RunOutcome> {
  const results: TestResultItem[] = [];

  for (const chk of codeChecks) {
    const regex = new RegExp(chk.pattern, chk.flags ?? 'is');
    const matched = regex.test(sqlCode);
    const passed = chk.mustNotMatch ? !matched : matched;
    results.push({
      name: chk.name,
      passed,
      expected: chk.expectedHint,
      received: passed ? 'Конструкция найдена ✔' : 'Не найдено в SQL',
    });
  }

  const startMs = performance.now();
  try {
    const { PGlite } = await import('@electric-sql/pglite');
    const db = new PGlite();

    await db.exec(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        status TEXT NOT NULL,
        amount INTEGER NOT NULL
      );
      INSERT INTO orders (status, amount) VALUES
        ('paid', 100),
        ('paid', 250),
        ('pending', 80),
        ('cancelled', 0);
    `);

    const queryResult = await db.query<{
      status: string;
      total_count: number | string;
      total_amount: number | string;
    }>(sqlCode);

    const durationMs = Math.max(1, Math.round(performance.now() - startMs));
    const rows = queryResult.rows.map((r) => ({
      status: r.status,
      total_count: Number(r.total_count),
      total_amount: Number(r.total_amount),
    }));

    const expectedRows = [
      { status: 'paid', total_count: 2, total_amount: 350 },
      { status: 'pending', total_count: 1, total_amount: 80 },
    ];

    const passed = JSON.stringify(rows) === JSON.stringify(expectedRows);

    results.push({
      name: 'Выполнение запроса в движке PostgreSQL (PGlite)',
      passed,
      expected: JSON.stringify(expectedRows),
      received: JSON.stringify(rows),
      durationMs,
      logs: [`Строк возвращено: ${rows.length}`],
    });
  } catch (err) {
    const durationMs = Math.max(1, Math.round(performance.now() - startMs));
    const msg = err instanceof Error ? err.message : String(err);
    results.push({
      name: 'Выполнение запроса в движке PostgreSQL (PGlite)',
      passed: false,
      expected: 'Корректный SQL-запрос без синтаксических ошибок',
      received: `Ошибка PostgreSQL: ${msg}`,
      durationMs,
    });
  }

  return {
    results,
    allPassed: results.length > 0 && results.every((r) => r.passed),
  };
}