import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ALL_RITUALS } from '@/features/terminal/terminalMatcher';
import { cn } from '@/lib/utils';
import { useProgressStore } from '@/stores/useProgressStore';
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock,
  Lightbulb,
  RotateCcw,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';

const LazyXtermShell = lazy(() => import('@/features/terminal/XtermShell'));

export function TerminalView() {
  const [ritualId, setRitualId] = useState(ALL_RITUALS[0]?.id ?? '');
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const progressByTask = useProgressStore((s) => s.progressByTask);
  const recordAttempt = useProgressStore((s) => s.recordAttempt);

  const ritual =
    ALL_RITUALS.find((item) => item.id === ritualId) ?? ALL_RITUALS[0];

  useEffect(() => {
    if (!startedAt || completed) return;
    const interval = window.setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);
    return () => window.clearInterval(interval);
  }, [startedAt, completed]);

  const handleRestart = () => {
    setStepIndex(0);
    setErrors(0);
    setStartedAt(null);
    setElapsedSec(0);
    setCompleted(false);
    setShowHint(false);
    setRunKey((k) => k + 1);
  };

  if (!ritual) {
    return null;
  }

  const currentStep = ritual.steps[stepIndex];

  return (
    <div className="col-span-2 overflow-y-auto p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Выбери CLI-ритуал ({ALL_RITUALS.length} сценариев)
            </p>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1 text-xs font-semibold">
                <Clock className="size-3.5 text-sky-400" />
                <span>{elapsedSec} сек</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1 text-xs font-semibold">
                <AlertTriangle className="size-3.5 text-rose-400" />
                <span>Ошибок: {errors}</span>
              </div>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleRestart}
                className="h-7 gap-1.5 text-xs"
              >
                <RotateCcw className="size-3.5" />
                Сначала
              </Button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_RITUALS.map((item, idx) => {
              const active = item.id === ritual.id;
              const isSolved = Boolean(progressByTask[item.id]?.solved);
              const shortTitle = item.title.replace(/^Ритуал:\s*/i, '');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setRitualId(item.id);
                    handleRestart();
                  }}
                  className={cn(
                    'flex items-start justify-between gap-2 rounded-xl border p-3 text-left text-xs transition',
                    active
                      ? 'border-sky-500 bg-sky-500/15 text-foreground shadow-sm'
                      : 'border-border/80 bg-card/40 text-muted-foreground hover:border-border hover:bg-card hover:text-foreground',
                  )}
                >
                  <div className="flex items-start gap-2">
                    {isSolved ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    ) : (
                      <TerminalIcon className="mt-0.5 size-4 shrink-0 text-sky-400" />
                    )}
                    <div>
                      <p className="font-semibold leading-snug text-foreground">
                        {idx + 1}. {shortTitle}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {item.steps.length} команд · {item.stack.slice(0, 3).join(', ')}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold">{ritual.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {ritual.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {ritual.stack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-[10px]">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3.5 py-2.5">
            <div className="text-xs">
              {completed ? (
                <span className="font-semibold text-emerald-400">
                  ✅ Все {ritual.steps.length} шагов пройдены за {elapsedSec}{' '}
                  сек (ошибок: {errors})!
                </span>
              ) : (
                <span>
                  <strong className="text-sky-400">
                    Шаг {stepIndex + 1} из {ritual.steps.length}:
                  </strong>{' '}
                  {showHint && currentStep
                    ? currentStep.hint
                    : 'Введи следующую команду ритуала в терминал ниже (или нажми «Подсказка»)'}
                </span>
              )}
            </div>

            {!completed ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setShowHint((prev) => !prev)}
                className="h-7 gap-1.5 text-xs"
              >
                <Lightbulb className="size-3.5 text-amber-400" />
                {showHint ? 'Скрыть подсказку' : 'Подсказка'}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
          <Suspense
            fallback={
              <div className="flex h-[22rem] items-center justify-center rounded-xl border border-border bg-card text-sm text-muted-foreground">
                Ленивая загрузка xterm.js…
              </div>
            }
          >
            <LazyXtermShell
              key={`${ritual.id}-${runKey}`}
              ritual={ritual}
              stepIndex={stepIndex}
              onStepIndexChange={(next) => {
                setStepIndex(next);
                setShowHint(false);
              }}
              onFirstInput={() => {
                setStartedAt((prev) => prev ?? Date.now());
              }}
              onErrorIncrement={() => setErrors((e) => e + 1)}
              onComplete={() => {
                setCompleted(true);
                void recordAttempt({
                  taskId: ritual.id,
                  level: ritual.level,
                  isBoss: false,
                  passed: true,
                  attemptsOnCurrentRun: errors + 1,
                  maxHintTierUsed: showHint ? 2 : 0,
                  hardcore: false,
                  suspiciousSpeed: false,
                });
              }}
            />
          </Suspense>

          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card/40 p-4">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Чек-лист ритуала ({stepIndex}/{ritual.steps.length})
            </h3>
            <ul className="flex flex-col gap-2">
              {ritual.steps.map((step, idx) => {
                const done = idx < stepIndex;
                const active = idx === stepIndex;
                return (
                  <li
                    key={step.expect}
                    className={
                      done
                        ? 'flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs text-emerald-300'
                        : active
                          ? 'flex items-center gap-2 rounded-lg border border-sky-500/50 bg-sky-500/10 px-2.5 py-1.5 text-xs font-semibold text-foreground'
                          : 'flex items-center gap-2 rounded-lg border border-transparent bg-muted/20 px-2.5 py-1.5 text-xs text-muted-foreground'
                    }
                  >
                    {done ? (
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400" />
                    ) : (
                      <Circle className="size-3.5 shrink-0" />
                    )}
                    <span className="truncate">Шаг {idx + 1}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}