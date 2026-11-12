import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { StubTask } from '@/features/tasks/stubTasks';
import { STUB_UNLOCKED_LEVEL } from '@/features/tasks/stubTasks';
import { LEVELS, type Level, type TrackId } from '@/types/track';
import { Lock } from 'lucide-react';

const TRACK_LABEL: Record<TrackId, string> = {
  layout: 'Вёрстка',
  logic: 'Логика',
};

type SidebarProps = {
  track: TrackId;
  level: Level;
  taskId: string;
  tasks: StubTask[];
  onTrackChange: (track: TrackId) => void;
  onLevelChange: (level: Level) => void;
  onTaskChange: (taskId: string) => void;
};

export function Sidebar({
  track,
  level,
  taskId,
  tasks,
  onTrackChange,
  onLevelChange,
  onTaskChange,
}: SidebarProps) {
  return (
    <aside className="flex h-full min-h-0 w-72 shrink-0 flex-col gap-4 overflow-y-auto border-r border-border bg-sidebar p-3 text-sidebar-foreground">
      <div>
        <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Трек
        </p>
        <div className="grid grid-cols-2 gap-1">
          {(['layout', 'logic'] as const).map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={track === item ? 'default' : 'outline'}
              onClick={() => onTrackChange(item)}
            >
              {TRACK_LABEL[item]}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Уровень
        </p>
        <div className="flex flex-wrap gap-1">
          {LEVELS.map((item) => {
            const locked = item > STUB_UNLOCKED_LEVEL;
            return (
              <Button
                key={item}
                type="button"
                size="icon-sm"
                variant={level === item ? 'default' : 'outline'}
                disabled={locked}
                aria-label={
                  locked ? `Уровень ${item}, закрыт` : `Уровень ${item}`
                }
                onClick={() => onLevelChange(item)}
              >
                {locked ? <Lock /> : item}
              </Button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Следующий уровень откроется при 80% решённых задач и боссе. Сейчас
          открыт только 1-й — это заглушка.
        </p>
      </div>

      <Separator />

      <div className="flex min-h-0 flex-1 flex-col">
        <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Задачи
        </p>
        <ul className="flex flex-col gap-1">
          {tasks.map((task) => {
            const selected = task.id === taskId;
            return (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => onTaskChange(task.id)}
                  className={`flex w-full items-start justify-between gap-2 rounded-lg border px-2.5 py-2 text-left text-sm transition-colors ${
                    selected
                      ? 'border-ring bg-sidebar-accent'
                      : 'border-transparent hover:bg-sidebar-accent/70'
                  }`}
                >
                  <span>
                    {task.title}
                    {task.isBoss ? (
                      <Badge className="ml-2" variant="secondary">
                        босс
                      </Badge>
                    ) : null}
                  </span>
                  <Badge variant={task.solved ? 'default' : 'outline'}>
                    {task.solved ? 'решено' : 'не решено'}
                  </Badge>
                </button>
              </li>
            );
          })}
        </ul>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            На этом уровне пока нет задач.
          </p>
        ) : null}
      </div>
    </aside>
  );
}
