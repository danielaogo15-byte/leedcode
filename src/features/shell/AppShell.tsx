import { Switch } from '@/components/ui/switch';
import { EditorPane } from '@/features/editor/EditorPane';
import { PreviewPane } from '@/features/editor/PreviewPane';
import { ResultsPanel } from '@/features/runner/ResultsPanel';
import { Sidebar } from '@/features/shell/Sidebar';
import { STUB_TASKS, tasksFor } from '@/features/tasks/stubTasks';
import type { Level, TrackId } from '@/types/track';
import { useEffect, useMemo, useState } from 'react';

const HINTS = [
  'что загуглить: flexbox, card layout',
  'MDN: CSS Flexible Box Layout',
  'Идея словами: выстрой блоки колонкой, отступы задай через padding.',
];

const STUB_RESULTS = [
  {
    name: 'есть заголовок',
    passed: true,
    expected: 'h1',
    received: 'h1',
  },
  {
    name: 'цена справа',
    passed: false,
    expected: 'right: 16px',
    received: 'не найдено',
  },
];

export function AppShell() {
  const [track, setTrack] = useState<TrackId>('layout');
  const [level, setLevel] = useState<Level>(1);
  const [taskId, setTaskId] = useState(STUB_TASKS[0]?.id ?? '');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [hardcore, setHardcore] = useState(false);
  const [hintTier, setHintTier] = useState(0);
  const [gaveUp, setGaveUp] = useState(false);
  const [ran, setRan] = useState(false);

  const tasks = useMemo(() => tasksFor(track, level), [track, level]);
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
    setHtml(task.starterHtml);
    setCss(task.starterCss);
    setJs(task.starterJs);
    setHintTier(0);
    setGaveUp(false);
    setRan(false);
  }, [task]);

  const showPreview = Boolean(
    task && (task.track === 'layout' || task.needsDom),
  );

  return (
    <div className="grid h-svh grid-cols-[18rem_1fr] grid-rows-[auto_1fr_auto] bg-background text-foreground">
      <header className="col-span-2 flex items-center justify-between gap-4 border-b border-border px-4 py-2">
        <div>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            Шаг 2 · экран задачи
          </p>
          <h1 className="text-lg font-semibold">Тренажёр</h1>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <span className="font-medium">Задачи</span>
          <span className="text-muted-foreground" title="Появится на шаге 6">
            Сегодня
          </span>
          <span className="text-muted-foreground" title="Появится на шаге 5">
            Профиль
          </span>
        </nav>
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={hardcore}
            onCheckedChange={(checked) => setHardcore(checked === true)}
            aria-label="Hardcore"
          />
          Hardcore
        </label>
      </header>

      <Sidebar
        track={track}
        level={level}
        taskId={task?.id ?? ''}
        tasks={tasks}
        onTrackChange={(next) => {
          setTrack(next);
          setLevel(1);
        }}
        onLevelChange={setLevel}
        onTaskChange={setTaskId}
      />

      <main className="flex min-h-0 flex-col overflow-hidden">
        {task ? (
          <>
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-base font-semibold">{task.title}</h2>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                {task.prompt}
              </p>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 lg:flex-row">
              <EditorPane
                task={task}
                html={html}
                css={css}
                js={js}
                hardcore={hardcore}
                onHtmlChange={setHtml}
                onCssChange={setCss}
                onJsChange={setJs}
              />
              {showPreview ? (
                <PreviewPane
                  html={html}
                  css={css}
                  fixture={task.track === 'logic' ? task.htmlFixture : ''}
                />
              ) : null}
            </div>
          </>
        ) : (
          <p className="p-4 text-sm text-muted-foreground">
            Выбери задачу слева.
          </p>
        )}
      </main>

      <div className="col-start-2">
        <ResultsPanel
          results={ran ? STUB_RESULTS : null}
          hint={hintTier > 0 ? (HINTS[hintTier - 1] ?? null) : null}
          hintTier={hintTier}
          solutionVisible={gaveUp || Boolean(task?.solved)}
          solution={
            task?.solved
              ? 'Задача уже помечена решённой — эталон можно смотреть.'
              : 'Это заглушка эталона. Настоящее решение придёт вместе с JSON задач.'
          }
          onRun={() => setRan(true)}
          onHint={() => setHintTier((tier) => Math.min(3, tier + 1))}
          onGiveUp={() => setGaveUp(true)}
          onNext={() => {
            if (!task || tasks.length === 0) {
              return;
            }
            const index = tasks.findIndex((item) => item.id === task.id);
            const next = tasks[(index + 1) % tasks.length];
            if (next) {
              setTaskId(next.id);
            }
          }}
        />
      </div>
    </div>
  );
}
