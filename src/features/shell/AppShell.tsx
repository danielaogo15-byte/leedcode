import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { EditorPane } from '@/features/editor/EditorPane';
import { PreviewPane } from '@/features/editor/PreviewPane';
import { TerminalView } from '@/features/terminal/TerminalView';
import {
  clearTaskDraft,
  loadTaskDraft,
  saveTaskDraft,
} from '@/features/editor/codeDrafts';
import { ProfileView } from '@/features/profile/ProfileView';
import { computeUnlockedLevel } from '@/features/profile/xpCalculator';
import { ResultsPanel } from '@/features/runner/ResultsPanel';
import { runDomTask } from '@/features/runner/runDomTask';
import { runLogicTask } from '@/features/runner/runLogicTask';
import { Sidebar } from '@/features/shell/Sidebar';
import { ALL_TASKS, tasksFor } from '@/features/tasks/loadTasks';
import { TodayView } from '@/features/today/TodayView';
import { useProgressStore } from '@/stores/useProgressStore';
import type { TestResultItem } from '@/types/runner';
import type { Level, TrackId } from '@/types/track';
import {
  BookOpen,
  CheckSquare,
  Flame,
  Moon,
  Sparkles,
  Sun,
  Terminal,
  Trophy,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type ActiveScreen = 'trainer' | 'today' | 'terminal' | 'profile';

export function AppShell() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = window.localStorage.getItem('vibedojo:theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('vibedojo:theme', theme);
  }, [theme]);

  const [screen, setScreen] = useState<ActiveScreen>('trainer');
  const [track, setTrack] = useState<TrackId>('layout');
  const [level, setLevel] = useState<Level>(1);
  const [taskId, setTaskId] = useState(ALL_TASKS[0]?.id ?? '');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [hardcore, setHardcore] = useState(false);
  const [hintTier, setHintTier] = useState(0);
  const [gaveUp, setGaveUp] = useState(false);
  const [results, setResults] = useState<TestResultItem[] | null>(null);
  const [suspiciousSpeed, setSuspiciousSpeed] = useState(false);
  const [attemptsOnRun, setAttemptsOnRun] = useState(0);
  const [memoryMode, setMemoryMode] = useState(false);

  const hydrated = useProgressStore((s) => s.hydrated);
  const hydrate = useProgressStore((s) => s.hydrate);
  const ensureDailySession = useProgressStore((s) => s.ensureDailySession);
  const totalXp = useProgressStore((s) => s.totalXp);
  const streakDays = useProgressStore((s) => s.streakDays);
  const progressByTask = useProgressStore((s) => s.progressByTask);
  const dailySlots = useProgressStore((s) => s.dailySlots);
  const dailySolvedIds = useProgressStore((s) => s.dailySolvedIds);
  const lastXpBanner = useProgressStore((s) => s.lastXpBanner);
  const recordAttempt = useProgressStore((s) => s.recordAttempt);
  const recordGiveUp = useProgressStore((s) => s.recordGiveUp);
  const clearXpBanner = useProgressStore((s) => s.clearXpBanner);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (hydrated) {
      void ensureDailySession(ALL_TASKS);
    }
  }, [hydrated, ensureDailySession]);

  const solvedMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const [id, rec] of Object.entries(progressByTask)) {
      if (rec.solved) map[id] = true;
    }
    return map;
  }, [progressByTask]);

  const unlockedLevel = useMemo(
    () => computeUnlockedLevel(track, ALL_TASKS, solvedMap),
    [track, solvedMap],
  );

  const tasks = useMemo(
    () =>
      tasksFor(track, level).map((item) => ({
        ...item,
        solved: Boolean(solvedMap[item.id]),
      })),
    [track, level, solvedMap],
  );
  const task = tasks.find((item) => item.id === taskId) ?? tasks[0];

  useEffect(() => {
    const first = tasks[0];
    if (!first) {
      return;
    }
    if (!tasks.some((item) => item.id === taskId)) {
      setTaskId(first.id);
    }
  }, [taskId, tasks]);

  useEffect(() => {
    if (!task) {
      return;
    }
    if (memoryMode) {
      setHtml('');
      setCss('');
      setJs('');
    } else {
      const draft = loadTaskDraft(task);
      setHtml(draft.html);
      setCss(draft.css);
      setJs(draft.js);
    }
    setHintTier(0);
    setGaveUp(false);
    setResults(null);
    setSuspiciousSpeed(false);
    setAttemptsOnRun(0);
    clearXpBanner();
  }, [task?.id, memoryMode, clearXpBanner]);

  const handleHtmlChange = (nextHtml: string) => {
    setHtml(nextHtml);
    if (task && !memoryMode) {
      saveTaskDraft(task.id, { html: nextHtml, css, js });
    }
  };

  const handleCssChange = (nextCss: string) => {
    setCss(nextCss);
    if (task && !memoryMode) {
      saveTaskDraft(task.id, { html, css: nextCss, js });
    }
  };

  const handleJsChange = (nextJs: string) => {
    setJs(nextJs);
    if (task && !memoryMode) {
      saveTaskDraft(task.id, { html, css, js: nextJs });
    }
  };

  const handleResetCode = () => {
    if (!task) return;
    const fresh = clearTaskDraft(task);
    setHtml(fresh.html);
    setCss(fresh.css);
    setJs(fresh.js);
    setResults(null);
  };

  const showPreview = Boolean(
    task && (task.track === 'layout' || task.needsDom),
  );

  const currentHint = useMemo(() => {
    if (!task || hintTier === 0) return null;
    const found = task.hints.find((h) => h.tier === hintTier);
    return found ? `Уровень ${found.tier}: ${found.text}` : null;
  }, [task, hintTier]);

  const handleRun = async () => {
    if (!task) return;

    const currentAttemptNumber = attemptsOnRun + 1;
    setAttemptsOnRun(currentAttemptNumber);

    const outcome =
      task.track === 'logic' && !task.needsDom
        ? await runLogicTask(js, task.tests)
        : await runDomTask({
            html: task.track === 'logic' ? task.htmlFixture : html,
            css,
            js,
            checks: task.checks,
          });

    setResults(outcome.results);

    if (!gaveUp) {
      await recordAttempt({
        taskId: task.id,
        level: task.level,
        isBoss: task.isBoss,
        passed: outcome.allPassed,
        attemptsOnCurrentRun: currentAttemptNumber,
        maxHintTierUsed: hintTier,
        hardcore,
        suspiciousSpeed,
        isMemoryReview: memoryMode,
      });
    }
  };

  const handleGiveUp = async () => {
    setGaveUp(true);
    if (task) {
      await recordGiveUp(task.id);
    }
  };

  const openTaskFromDashboard = (
    nextTrack: TrackId,
    nextLevel: Level,
    nextTaskId: string,
    isMemory = false,
  ) => {
    setTrack(nextTrack);
    setLevel(nextLevel);
    setTaskId(nextTaskId);
    setMemoryMode(isMemory);
    setScreen('trainer');
  };

  return (
    <div className="grid h-svh grid-cols-[19rem_1fr] grid-rows-[auto_1fr] overflow-hidden bg-background text-foreground">
      <header className="col-span-2 flex items-center justify-between gap-4 border-b border-border/80 bg-card/60 px-5 py-2.5 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30">
            <Terminal className="size-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">VibeCode Dojo</h1>
            <p className="text-[11px] text-muted-foreground">
              Full-Stack Тренажёр · 39 технологий (Уровни 1–7)
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1 text-xs">
          <button
            type="button"
            onClick={() => setScreen('trainer')}
            className={
              screen === 'trainer'
                ? 'rounded-md bg-background px-3 py-1 font-medium text-foreground shadow-sm'
                : 'px-3 py-1 text-muted-foreground hover:text-foreground'
            }
          >
            Тренажёр
          </button>
          <button
            type="button"
            onClick={() => setScreen('today')}
            className={
              screen === 'today'
                ? 'flex items-center gap-1.5 rounded-md bg-background px-3 py-1 font-medium text-foreground shadow-sm'
                : 'flex items-center gap-1.5 px-3 py-1 text-muted-foreground hover:text-foreground'
            }
          >
            <span>Сегодня</span>
            <span className="rounded bg-sky-500/20 px-1.5 py-0.2 text-[10px] font-bold text-sky-400">
              {dailySolvedIds.length}/{dailySlots.length || 3}
            </span>
          </button>
			 <button
            type="button"
            onClick={() => setScreen('terminal')}
            className={
              screen === 'terminal'
                ? 'rounded-md bg-background px-3 py-1 font-medium text-foreground shadow-sm'
                : 'px-3 py-1 text-muted-foreground hover:text-foreground'
            }
          >
            Терминал
          </button>
          <button
            type="button"
            onClick={() => setScreen('profile')}
            className={
              screen === 'profile'
                ? 'rounded-md bg-background px-3 py-1 font-medium text-foreground shadow-sm'
                : 'px-3 py-1 text-muted-foreground hover:text-foreground'
            }
          >
            Профиль
          </button>
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-500 dark:text-amber-300">
            <Trophy className="size-3.5" />
            <span>{totalXp} XP</span>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-500 dark:text-orange-300">
            <Flame className="size-3.5" />
            <span>{streakDays} дн.</span>
          </div>

          <button
            type="button"
            onClick={() =>
              setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
            }
            className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
            title="Переключить тему оформления"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="size-3.5 text-amber-400" />
                <span>Светлая</span>
              </>
            ) : (
              <>
                <Moon className="size-3.5 text-sky-600" />
                <span>Графит</span>
              </>
            )}
          </button>

          <label
            className={
              hardcore
                ? 'flex cursor-pointer items-center gap-2 rounded-lg border border-orange-500/50 bg-orange-500/15 px-3 py-1.5 text-xs font-semibold text-orange-400'
                : 'flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground'
            }
          >
            <Switch
              checked={hardcore}
              onCheckedChange={(checked) => setHardcore(checked === true)}
              aria-label="Hardcore"
            />
            <span>Hardcore x1.5</span>
          </label>
        </div>
      </header>

		{screen === 'profile' ? (
        <ProfileView
          tasks={ALL_TASKS}
          onSelectTask={openTaskFromDashboard}
        />
      ) : screen === 'today' ? (
        <TodayView
          tasks={ALL_TASKS}
          onStartTask={openTaskFromDashboard}
        />
      ) : screen === 'terminal' ? (
        <TerminalView />
      ) : (
        <>
          <Sidebar
            track={track}
            level={level}
            unlockedLevel={unlockedLevel}
            taskId={task?.id ?? ''}
            tasks={tasks}
            onTrackChange={(next) => {
              setTrack(next);
              setLevel(1);
              setMemoryMode(false);
            }}
            onLevelChange={(nextLvl) => {
              setLevel(nextLvl);
              setMemoryMode(false);
            }}
            onTaskChange={(nextId) => {
              setTaskId(nextId);
              setMemoryMode(false);
            }}
          />

          <div className="flex min-h-0 flex-col overflow-hidden">
            <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              {task ? (
                <>
                  <div className="border-b border-border/80 bg-card/20 px-5 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold">{task.title}</h2>
                        {task.isBoss ? (
                          <Badge variant="destructive">БОСС x3 XP</Badge>
                        ) : null}
                        {memoryMode ? (
                          <Badge className="bg-sky-500 text-slate-950">
                            Режим «По памяти» (пустой редактор)
                          </Badge>
                        ) : null}
                        {task.mapTopics.map((topic) => (
                          <Badge key={topic} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>

                      {lastXpBanner ? (
                        <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500 dark:text-emerald-300">
                          <Sparkles className="size-3.5 shrink-0" />
                          <span>{lastXpBanner}</span>
                        </div>
                      ) : null}
                    </div>

                    <p className="mt-1 max-w-3xl text-sm text-foreground/90">
                      {task.prompt}
                    </p>

                    {task.specs.length > 0 ? (
                      <div className="mt-2.5 rounded-xl border border-border bg-muted/25 p-2.5">
                        <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-sky-500 dark:text-sky-400">
                          <CheckSquare className="size-3.5" />
                          Параметры макета (размеры, селекторы, контент):
                        </p>
                        <ul className="grid gap-1 sm:grid-cols-2">
                          {task.specs.map((spec) => (
                            <li
                              key={spec}
                              className="flex items-start gap-2 text-xs text-muted-foreground"
                            >
                              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-sky-400" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <BookOpen className="size-3.5 shrink-0 text-amber-500 dark:text-amber-400" />
                      <span>
                        <strong className="text-foreground">
                          Тема на изучение:
                        </strong>{' '}
                        {task.learn}
                      </span>
                    </div>
                  </div>

                  <div className="flex min-h-[22rem] flex-1 flex-col gap-4 p-4 lg:flex-row">
                    <EditorPane
                      task={task}
                      html={html}
                      css={css}
                      js={js}
                      hardcore={hardcore}
                      onHtmlChange={handleHtmlChange}
                      onCssChange={handleCssChange}
                      onJsChange={handleJsChange}
                      onResetCode={handleResetCode}
                      onSuspiciousSpeedChange={setSuspiciousSpeed}
                    />
                    {showPreview ? (
                      <PreviewPane
                        html={html}
                        css={css}
                        js={js}
                        fixture={task.track === 'logic' ? task.htmlFixture : ''}
                        targetHtml={task.targetHtml}
                        targetCss={task.targetCss}
                      />
                    ) : null}
                  </div>
                </>
              ) : (
                <p className="p-4 text-sm text-muted-foreground">
                  На этом уровне пока нет задач. Выбери другой уровень слева.
                </p>
              )}
            </main>

            <ResultsPanel
              results={results}
              hint={currentHint}
              hintTier={hintTier}
              solutionVisible={gaveUp || Boolean(task?.solved)}
              solution={task?.solution ?? ''}
              onRun={() => {
                void handleRun();
              }}
              onHint={() => setHintTier((tier) => Math.min(3, tier + 1))}
              onGiveUp={() => {
                void handleGiveUp();
              }}
              onNext={() => {
                if (!task || tasks.length === 0) {
                  return;
                }
                const index = tasks.findIndex((item) => item.id === task.id);
                const next = tasks[(index + 1) % tasks.length];
                if (next) {
                  setTaskId(next.id);
                  setMemoryMode(false);
                }
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}