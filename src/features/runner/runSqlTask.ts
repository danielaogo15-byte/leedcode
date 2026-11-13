import type { RunOutcome, TestResultItem } from '@/types/runner';
import type { CodePatternCheck } from '@/types/task';

type OrderRow = {
  id: number;
  status: string;
  amount: number;
};

const SANDBOX_ORDERS: OrderRow[] = [
  { id: 1, status: 'paid', amount: 100 },
  { id: 2, status: 'paid', amount: 250 },
  { id: 3, status: 'pending', amount: 80 },
  { id: 4, status: 'cancelled', amount: 0 },
];

function executeSandboxPostgresQuery(sqlRaw: string): {
  status: string;
  total_count: number;
  total_amount: number;
}[] {
  const cleaned = sqlRaw
    .replace(/--.*$/gm, '')
    .trim()
    .replace(/;+\s*$/, '');

  if (!cleaned) {
    throw new Error('Пустой SQL-запрос');
  }

  if (!/^SELECT\b/i.test(cleaned)) {
    throw new Error('Запрос должен начинаться с ключевого слова SELECT');
  }

  if (!/\bFROM\s+orders\b/i.test(cleaned)) {
    throw new Error('Таблица не найдена: используй FROM orders');
  }

  let rows = [...SANDBOX_ORDERS];

  if (/\bWHERE\s+amount\s*>\s*0\b/i.test(cleaned)) {
    rows = rows.filter((r) => r.amount > 0);
  } else if (/\bWHERE\b/i.test(cleaned)) {
    throw new Error('Неверное условие WHERE: ожидается WHERE amount > 0');
  }

  if (!/\bGROUP\s+BY\s+status\b/i.test(cleaned)) {
    throw new Error(
      'При использовании COUNT/SUM необходима группировка GROUP BY status',
    );
  }

  const grouped = new Map<
    string,
    { status: string; total_count: number; total_amount: number }
  >();

  for (const row of rows) {
    const current = grouped.get(row.status) ?? {
      status: row.status,
      total_count: 0,
      total_amount: 0,
    };
    current.total_count += 1;
    current.total_amount += row.amount;
    grouped.set(row.status, current);
  }

  const result = Array.from(grouped.values());

  if (/\bORDER\s+BY\s+total_amount\s+DESC\b/i.test(cleaned)) {
    result.sort((a, b) => b.total_amount - a.total_amount);
  } else if (/\bORDER\s+BY\s+total_amount(?:\s+ASC)?\b/i.test(cleaned)) {
    result.sort((a, b) => a.total_amount - b.total_amount);
  }

  return result;
}

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
    const rows = executeSandboxPostgresQuery(sqlCode);
    const durationMs = Math.max(1, Math.round(performance.now() - startMs));

    const expectedRows = [
      { status: 'paid', total_count: 2, total_amount: 350 },
      { status: 'pending', total_count: 1, total_amount: 80 },
    ];

    const passed = JSON.stringify(rows) === JSON.stringify(expectedRows);

    results.push({
      name: 'Выполнение запроса на таблице orders (PostgreSQL Sandbox)',
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
      name: 'Выполнение запроса на таблице orders (PostgreSQL Sandbox)',
      passed: false,
      expected: 'Корректный SQL-запрос без синтаксических ошибок',
      received: `Ошибка SQL: ${msg}`,
      durationMs,
    });
  }

  return {
    results,
    allPassed: results.length > 0 && results.every((r) => r.passed),
  };
}