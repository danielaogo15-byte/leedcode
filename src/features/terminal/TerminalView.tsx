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
  Eye,
  EyeOff,
  RotateCcw,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';

const LazyXtermShell = lazy(() => import('@/features/terminal/XtermShell'));

function parseStepHint(hint: string): { label: string; cmd: string } {
  const idx = hint.indexOf(':');
  if (idx === -1) {
    return { label: 'Введи команду', cmd: hint.trim() };
  }
  return {
    label: hint.slice(0, idx).trim(),
    cmd: hint.slice(idx + 1).trim(),
  };
}

export function TerminalView() {
  const [ritualId, setRitualId] = useState(ALL_RITUALS[0]?.id ?? '');
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showCommands, setShowCommands] = useState(true);
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
    setRunKey((k) => k + 1);
  };

  if (!ritual) {
    return null;
  }

  const currentStep = ritual.steps[stepIndex];
  const currentParsed = currentStep ? parseStepHint(currentStep.hint) : null;

  return (
    <div className="col-span-2 overflow-y-auto p-6">
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Выбери CLI-ритуал ({ALL_RITUALS.length} сценариев)
            </p>
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                size="sm"
                variant={showCommands ? 'secondary' : 'outline'}
                onClick={() => setShowCommands((prev) => !prev)}
                className="h-7 gap-1.5 text-xs"
              >
                {showCommands ? (
                  <>
                    <EyeOff className="size-3.5 text-sky-400" />
                    Скрыть команды (по памяти)
                  </>
                ) : (
                  <>
                    <Eye className="size-3.5 text-amber-400" />
                    Показать команды
                  </>
                )}
              </Button>

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

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
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
                        {item.steps.length} команд ·{' '}
                        {item.stack.slice(0, 3).join(', ')}
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

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {completed ? (
                <span className="font-semibold text-emerald-400">
                  ✅ Все {ritual.steps.length} шагов пройдены за {elapsedSec}{' '}
                  сек (ошибок: {errors})!
                </span>
              ) : (
                <>
                  <strong className="text-sky-400">
                    Шаг {stepIndex + 1} из {ritual.steps.length}:
                  </strong>
                  {showCommands && currentParsed ? (
                    <>
                      <span className="text-foreground">
                        {currentParsed.label}:
                      </span>
                      <code className="rounded-md border border-sky-500/40 bg-slate-950 px-2.5 py-1 font-mono text-xs font-bold text-sky-300">
                        {currentParsed.cmd}
                      </code>
                    </>
                  ) : (
                    <span>
                      Введи команду по памяти в терминал ниже (или включи
                      «Показать команды»)
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_28rem] xl:grid-cols-[1fr_34rem]">
          <Suspense
            fallback={
              <div className="flex h-[26rem] items-center justify-center rounded-xl border border-border bg-card text-sm text-muted-foreground">
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
                  maxHintTierUsed: showCommands ? 1 : 0,
                  hardcore: !showCommands,
                  suspiciousSpeed: false,
                });
              }}
            />
          </Suspense>

          <div className="flex flex-col gap-2.5 rounded-xl border border-border bg-card/40 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Чек-лист и команды ритуала ({stepIndex}/{ritual.steps.length})
              </h3>
              <span className="text-[11px] text-muted-foreground">
                {showCommands ? 'Шпаргалка включена' : 'Режим по памяти'}
              </span>
            </div>

            <ul className="flex flex-col gap-2">
              {ritual.steps.map((step, idx) => {
                const done = idx < stepIndex;
                const active = idx === stepIndex;
                const parsed = parseStepHint(step.hint);
                return (
                  <li
                    key={step.expect}
                    className={
                      done
                        ? 'flex flex-col gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300'
                        : active
                          ? 'flex flex-col gap-1 rounded-lg border border-sky-500 bg-sky-500/15 px-3 py-2 text-xs text-foreground shadow-sm'
                          : 'flex flex-col gap-1 rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-xs text-muted-foreground'
                    }
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-semibold">
                        {done ? (
                          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400" />
                        ) : (
                          <Circle
                            className={cn(
                              'size-3.5 shrink-0',
                              active ? 'text-sky-400' : '',
                            )}
                          />
                        )}
                        <span>
                          Шаг {idx + 1}. {parsed.label}
                        </span>
                      </div>
                      {active ? (
                        <Badge className="bg-sky-500 text-[10px] text-slate-950">
                          Сейчас
                        </Badge>
                      ) : null}
                    </div>

                    {showCommands || done ? (
                      <code
                        className={cn(
                          'mt-0.5 block rounded px-2 py-1 font-mono text-[11px]',
                          done
                            ? 'bg-emerald-950/50 text-emerald-300'
                            : active
                              ? 'bg-slate-950 font-bold text-sky-300'
                              : 'bg-background/70 text-muted-foreground',
                        )}
                      >
                        $ {parsed.cmd}
                      </code>
                    ) : null}
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