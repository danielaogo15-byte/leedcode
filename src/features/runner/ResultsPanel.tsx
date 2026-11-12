import { Button } from '@/components/ui/button';
import type { SubmissionRecord } from '@/db/database';
import type { CustomRunOutcome, TestResultItem } from '@/types/runner';
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Flag,
  FlaskConical,
  History,
  Lightbulb,
  NotebookPen,
  Play,
  RotateCcw,
  TerminalSquare,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  results: TestResultItem[] | null;
  hint: string | null;
  hintTier: number;
  solutionVisible: boolean;
  solution: string;
  canCustomTest?: boolean;
  defaultCustomCall?: string;
  customOutcome?: CustomRunOutcome | null;
  note?: string;
  submissions?: SubmissionRecord[];
  onRun: () => void;
  onRunCustom?: (customCall: string) => void;
  onNoteChange?: (nextNote: string) => void;
  onRestoreSubmission?: (codeSnapshot: string) => void;
  onHint: () => void;
  onGiveUp: () => void;
  onNext: () => void;
};

type ExtraPanel = 'none' | 'custom' | 'notes' | 'submissions' | 'solution';

export function ResultsPanel({
  results,
  hint,
  hintTier,
  solutionVisible,
  solution,
  canCustomTest = false,
  defaultCustomCall = '',
  customOutcome = null,
  note = '',
  submissions = [],
  onRun,
  onRunCustom,
  onNoteChange,
  onRestoreSubmission,
  onHint,
  onGiveUp,
  onNext,
}: Props) {
  const [activePanel, setActivePanel] = useState<ExtraPanel>('none');
  const [customCallInput, setCustomCallInput] = useState(defaultCustomCall);

  useEffect(() => {
    setCustomCallInput(defaultCustomCall);
    setActivePanel('none');
  }, [defaultCustomCall, solution]);

  const togglePanel = (panel: ExtraPanel) => {
    setActivePanel((prev) => (prev === panel ? 'none' : panel));
  };

  const passedCount = results?.filter((r) => r.passed).length ?? 0;

  return (
    <footer className="shrink-0 border-t border-border bg-card/80 px-5 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={onRun}
            title="Горячая клавиша: Ctrl + Enter"
            className="gap-1.5 bg-emerald-500 font-semibold text-slate-950 hover:bg-emerald-400"
          >
            <Play className="size-3.5 fill-current" />
            <span>Проверить</span>
            <kbd className="ml-1 rounded bg-slate-950/20 px-1.5 py-0.5 font-mono text-[10px]">
              Ctrl+↵
            </kbd>
          </Button>

          {canCustomTest && onRunCustom ? (
            <Button
              type="button"
              size="sm"
              variant={activePanel === 'custom' ? 'default' : 'outline'}
              onClick={() => togglePanel('custom')}
              className="gap-1.5"
            >
              <FlaskConical className="size-3.5 text-sky-400" />
              Свой тест-кейс
            </Button>
          ) : null}

          <Button
            type="button"
            size="sm"
            variant={activePanel === 'notes' ? 'default' : 'outline'}
            onClick={() => togglePanel('notes')}
            className="gap-1.5"
          >
            <NotebookPen className="size-3.5 text-emerald-400" />
            <span>Заметки</span>
            {note.trim().length > 0 ? (
              <span className="size-2 rounded-full bg-emerald-400" />
            ) : null}
          </Button>

          <Button
            type="button"
            size="sm"
            variant={activePanel === 'submissions' ? 'default' : 'outline'}
            onClick={() => togglePanel('submissions')}
            className="gap-1.5"
          >
            <History className="size-3.5 text-amber-400" />
            <span>История ({submissions.length})</span>
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
              setActivePanel('solution');
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
              onClick={() => togglePanel('solution')}
              className="gap-1.5 border-sky-500/40 text-sky-400 hover:bg-sky-500/10"
            >
              <Code2 className="size-3.5" />
              {activePanel === 'solution' ? 'Скрыть эталон' : 'Показать эталон'}
            </Button>
          ) : null}

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onNext}
            title="Горячая клавиша: Alt + Стрелка вправо"
            className="gap-1.5"
          >
            <span>Следующая</span>
            <ArrowRight className="size-3.5" />
            <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
              Alt+→
            </kbd>
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
            Запуск: <kbd className="font-mono">Ctrl+Enter</kbd> · Следующая:{' '}
            <kbd className="font-mono">Alt+→</kbd>
          </span>
        )}
      </div>

      {activePanel === 'custom' && canCustomTest && onRunCustom ? (
        <div className="mt-2.5 rounded-xl border border-sky-500/30 bg-sky-500/5 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-sky-400">
              Вызов функции (без траты попыток):
            </span>
            <input
              type="text"
              value={customCallInput}
              onChange={(e) => setCustomCallInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customCallInput.trim()) {
                  e.preventDefault();
                  onRunCustom(customCallInput.trim());
                }
              }}
              placeholder="Например: sumEven([2, 4, 7])"
              className="min-w-[16rem] flex-1 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-foreground outline-none focus:border-sky-500"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (customCallInput.trim()) {
                  onRunCustom(customCallInput.trim());
                }
              }}
              className="h-7 gap-1.5 text-xs"
            >
              <Play className="size-3" />
              Запустить
            </Button>
          </div>

          {customOutcome ? (
            <div className="mt-2 rounded-lg border border-border bg-background/80 p-2.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span
                  className={
                    customOutcome.isError
                      ? 'font-semibold text-destructive'
                      : 'font-semibold text-emerald-400'
                  }
                >
                  Результат: {customOutcome.output}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {customOutcome.durationMs} мс
                </span>
              </div>
              {customOutcome.logs.length > 0 ? (
                <div className="mt-1.5 border-t border-border/60 pt-1.5 text-[11px] text-sky-300">
                  <span className="text-muted-foreground">Stdout: </span>
                  {customOutcome.logs.join(' | ')}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {activePanel === 'notes' ? (
        <div className="mt-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
          <p className="mb-1.5 text-xs font-semibold text-emerald-400">
            Личный конспект по задаче (сохраняется автоматически):
          </p>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => onNoteChange?.(e.target.value)}
            placeholder="Запиши идею решения, полезный CSS-приём или шпаргалку..."
            className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground outline-none focus:border-emerald-500"
          />
        </div>
      ) : null}

      {activePanel === 'submissions' ? (
        <div className="mt-2.5 max-h-36 overflow-y-auto rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
          <p className="mb-2 text-xs font-semibold text-amber-400">
            История твоих успешных решений ({submissions.length}):
          </p>
          {submissions.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Пока нет успешных отправок по этой задаче.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {submissions.map((sub) => (
                <li
                  key={sub.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-emerald-400">
                      ✔ Принято
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleString('ru-RU')}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                      {sub.durationMs} мс
                    </span>
                    {sub.xpEarned > 0 ? (
                      <span className="text-[11px] font-semibold text-amber-400">
                        +{sub.xpEarned} XP
                      </span>
                    ) : null}
                  </div>
                  {onRestoreSubmission ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => onRestoreSubmission(sub.codeSnapshot)}
                      className="h-6 gap-1 px-2 text-[11px]"
                    >
                      <RotateCcw className="size-3" />В редактор
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {hint || (solutionVisible && activePanel === 'solution') || results ? (
        <div className="mt-2.5 max-h-44 overflow-y-auto pr-1">
          {hint ? (
            <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300">
              💡 {hint}
            </div>
          ) : null}

          {solutionVisible && activePanel === 'solution' ? (
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
                      ? 'flex flex-col justify-between gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs'
                      : 'flex flex-col justify-between gap-1.5 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs'
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-foreground">
                          {item.name}
                        </p>
                        {item.durationMs !== undefined ? (
                          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                            {item.durationMs} мс
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                        ожидали: {item.expected} · получили: {item.received}
                      </p>
                    </div>
                    {item.passed ? (
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                    ) : (
                      <XCircle className="size-4 shrink-0 text-destructive" />
                    )}
                  </div>

                  {item.logs && item.logs.length > 0 ? (
                    <div className="rounded border border-border/60 bg-background/70 px-2 py-1 font-mono text-[11px] text-sky-300">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <TerminalSquare className="size-3" />
                        console.log:
                      </span>{' '}
                      {item.logs.join(' · ')}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </footer>
  );
}