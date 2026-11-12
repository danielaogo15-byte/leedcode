import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type StubResult = {
  name: string;
  passed: boolean;
  expected: string;
  received: string;
};

type ResultsPanelProps = {
  results: StubResult[] | null;
  hint: string | null;
  hintTier: number;
  solutionVisible: boolean;
  solution: string;
  onRun: () => void;
  onHint: () => void;
  onGiveUp: () => void;
  onNext: () => void;
};

export function ResultsPanel({
  results,
  hint,
  hintTier,
  solutionVisible,
  solution,
  onRun,
  onHint,
  onGiveUp,
  onNext,
}: ResultsPanelProps) {
  return (
    <footer className="border-t border-border bg-background/80 px-4 py-3">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button type="button" onClick={onRun}>
          Run
        </Button>
        <Button type="button" variant="outline" onClick={onHint}>
          Hint {hintTier > 0 ? `(уровень ${hintTier}/3)` : ''}
        </Button>
        <Button type="button" variant="destructive" onClick={onGiveUp}>
          Сдаюсь
        </Button>
        <Button type="button" variant="secondary" onClick={onNext}>
          Next
        </Button>
      </div>

      {hint ? (
        <p className="mb-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
          <span className="font-medium">Подсказка {hintTier}: </span>
          {hint}
        </p>
      ) : null}

      {solutionVisible ? (
        <p className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
          <span className="font-medium">Решение: </span>
          {solution}
        </p>
      ) : (
        <p className="mb-3 text-xs text-muted-foreground">
          Эталон скрыт, пока задача не решена или не нажато «Сдаюсь».
        </p>
      )}

      {results ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {results.map((result) => (
            <li
              key={result.name}
              className={`rounded-lg border px-3 py-2 text-sm ${
                result.passed
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-destructive/40 bg-destructive/10'
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-medium">{result.name}</span>
                <Badge variant={result.passed ? 'default' : 'destructive'}>
                  {result.passed ? 'ок' : 'ошибка'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                ждали: {result.expected}
              </p>
              <p className="text-xs text-muted-foreground">
                получили: {result.received}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Нажми Run — здесь появятся результаты тестов (пока это заглушка).
        </p>
      )}
    </footer>
  );
}
