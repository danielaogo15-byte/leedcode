import { Button } from '@/components/ui/button';
import type { TestResultItem } from '@/types/runner';
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Flag,
  Lightbulb,
  Play,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  results: TestResultItem[] | null;
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
}: Props) {
  const [showSolutionCode, setShowSolutionCode] = useState(false);

  // Скрываем раскрытый код эталона при переходе к новой задаче
  useEffect(() => {
    if (!solutionVisible) {
      setShowSolutionCode(false);
    }
  }, [solutionVisible, solution]);

  const passedCount = results?.filter((r) => r.passed).length ?? 0;

  return (
    <footer className="shrink-0 border-t border-border bg-card/80 px-5 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={onRun}
            className="gap-1.5 bg-emerald-500 font-semibold text-slate-950 hover:bg-emerald-400"
          >
            <Play className="size-3.5 fill-current" />
            Проверить (Run)
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onHint}
            disabled={hintTier >= 3}
            className="gap-1.5"
          >
            <Lightbulb className="size-3.5 text-amber-400" />
            Подсказка ({hintTier}/3)
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => {
              onGiveUp();
              setShowSolutionCode(true);
            }}
            className="gap-1.5"
          >
            <Flag className="size-3.5" />
            Сдаюсь
          </Button>
          {solutionVisible ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowSolutionCode((prev) => !prev)}
              className="gap-1.5 border-sky-500/40 text-sky-400 hover:bg-sky-500/10"
            >
              <Code2 className="size-3.5" />
              {showSolutionCode ? 'Скрыть эталон' : 'Показать эталон'}
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onNext}
            className="gap-1.5"
          >
            Следующая
            <ArrowRight className="size-3.5" />
          </Button>
        </div>

        {results ? (
          <span className="text-xs font-medium text-muted-foreground">
            Пройдено проверок:{' '}
            <strong className="text-foreground">
              {passedCount} из {results.length}
            </strong>
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            Эталон откроется после решения или кнопки «Сдаюсь»
          </span>
        )}
      </div>

      {hint || (solutionVisible && showSolutionCode) || results ? (
        <div className="mt-2.5 max-h-40 overflow-y-auto pr-1">
          {hint ? (
            <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300">
              💡 {hint}
            </div>
          ) : null}

          {solutionVisible && showSolutionCode ? (
            <pre className="mb-2 overflow-x-auto rounded-lg border border-sky-500/30 bg-sky-500/10 p-2.5 font-mono text-xs text-sky-200">
              {solution}
            </pre>
          ) : null}

          {results ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {results.map((item) => (
                <li
                  key={item.name}
                  className={
                    item.passed
                      ? 'flex items-center justify-between gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs'
                      : 'flex items-center justify-between gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs'
                  }
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {item.name}
                    </p>
                    <p className="truncate font-mono text-[11px] text-muted-foreground">
                      ожидали: {item.expected} · получили: {item.received}
                    </p>
                  </div>
                  {item.passed ? (
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="size-4 shrink-0 text-destructive" />
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </footer>
  );
}