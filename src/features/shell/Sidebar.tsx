import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/task';
import {
  LEVEL_ROADMAP,
  LEVELS,
  type Level,
  type TrackId,
} from '@/types/track';
import {
  CheckCircle2,
  Circle,
  Code2,
  Crown,
  Layers,
  Layout,
  Lock,
} from 'lucide-react';
import { useState } from 'react';

type Props = {
  track: TrackId;
  level: Level;
  unlockedLevel: Level;
  taskId: string;
  tasks: Task[];
  onTrackChange: (track: TrackId) => void;
  onLevelChange: (level: Level) => void;
  onTaskChange: (taskId: string) => void;
};

export function Sidebar({
  track,
  level,
  unlockedLevel,
  taskId,
  tasks,
  onTrackChange,
  onLevelChange,
  onTaskChange,
}: Props) {
  const [previewLevel, setPreviewLevel] = useState<Level>(level);
  const solvedCount = tasks.filter((t) => t.solved).length;
  const roadmap = LEVEL_ROADMAP[previewLevel];

  return (
    <aside className="flex flex-col gap-5 overflow-y-auto border-r border-border/80 bg-card/40 p-4">
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Трек обучения
        </p>
        <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-border bg-muted/30 p-1">
          <Button
            type="button"
            size="sm"
            variant={track === 'layout' ? 'default' : 'ghost'}
            className="gap-1.5 text-xs"
            onClick={() => onTrackChange('layout')}
          >
            <Layout className="size-3.5" />
            Вёрстка / UI
          </Button>
          <Button
            type="button"
            size="sm"
            variant={track === 'logic' ? 'default' : 'ghost'}
            className="gap-1.5 text-xs"
            onClick={() => onTrackChange('logic')}
          >
            <Code2 className="size-3.5" />
            Код / Логика
          </Button>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Уровень (открыт 1–{unlockedLevel})
          </p>
          <span className="text-xs text-muted-foreground">
            {solvedCount}/{tasks.length} решено
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {LEVELS.map((item) => {
            const unlocked = item <= unlockedLevel;
            const active = item === level;
            return (
              <button
                key={item}
                type="button"
                onMouseEnter={() => setPreviewLevel(item)}
                onMouseLeave={() => setPreviewLevel(level)}
                onClick={() => {
                  setPreviewLevel(item);
                  if (unlocked) {
                    onLevelChange(item);
                  }
                }}
                title={`Уровень ${item}: ${LEVEL_ROADMAP[item].stack.join(', ')}`}
                className={cn(
                  'flex h-8 items-center justify-center rounded-md border text-xs font-semibold transition',
                  active
                    ? 'border-sky-500 bg-sky-500 text-slate-950 shadow-sm'
                    : unlocked
                      ? 'border-border bg-muted/40 text-foreground hover:bg-muted'
                      : 'border-border/40 bg-muted/10 text-muted-foreground/50 hover:border-border',
                )}
              >
                {unlocked ? item : <Lock className="size-3" />}
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 rounded-lg border border-border/70 bg-muted/20 p-2.5">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
            <Layers className="size-3.5 text-sky-400" />
            Ур. {roadmap.level}: {roadmap.title}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {roadmap.stack.map((tech) => (
              <span
                key={tech}
                className="rounded border border-border/60 bg-background/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Задачи уровня {level}
        </p>
        <ul className="flex flex-col gap-1.5">
          {tasks.map((item) => {
            const active = item.id === taskId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onTaskChange(item.id)}
                  className={cn(
                    'group flex w-full items-start justify-between gap-2 rounded-xl border p-2.5 text-left text-xs transition',
                    active
                      ? 'border-sky-500/60 bg-sky-500/10 text-foreground shadow-sm'
                      : 'border-transparent bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  <div className="flex items-start gap-2">
                    {item.solved ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    ) : item.isBoss ? (
                      <Crown className="mt-0.5 size-4 shrink-0 text-amber-400" />
                    ) : (
                      <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
                    )}
                    <span className="font-medium leading-snug">
                      {item.title}
                    </span>
                  </div>
                  {item.isBoss ? (
                    <span className="shrink-0 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-300 uppercase">
                      Босс
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}