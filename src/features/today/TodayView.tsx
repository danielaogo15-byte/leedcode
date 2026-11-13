import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DAILY_SESSION_BONUS_XP } from '@/features/today/dailySession';
import { useProgressStore } from '@/stores/useProgressStore';
import type { Task } from '@/types/task';
import type { Level, TrackId } from '@/types/track';
import {
  CalendarCheck2,
  CheckCircle2,
  Circle,
  Code2,
  Layout,
  Play,
  Sparkles,
} from 'lucide-react';

type Props = {
  tasks: Task[];
  onStartTask: (
    track: TrackId,
    level: Level,
    taskId: string,
    memoryMode?: boolean,
  ) => void;
};

export function TodayView({ tasks, onStartTask }: Props) {
  const dailySlots = useProgressStore((s) => s.dailySlots);
  const dailySolvedIds = useProgressStore((s) => s.dailySolvedIds);
  const dailyBonusClaimed = useProgressStore((s) => s.dailyBonusClaimed);

  const completedCount = dailySolvedIds.length;
  const totalCount = dailySlots.length || 3;

  return (
    <div className="col-span-2 overflow-y-auto p-6">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-card to-card p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 px-3 py-0.5 text-xs font-semibold text-sky-300">
                <CalendarCheck2 className="size-3.5" />
                План на сегодня
              </span>
              <span className="text-xs text-muted-foreground">
                15–20 минут сфокусированной практики
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold">
              Ежедневная сессия ({completedCount} из {totalCount})
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Реши все 3 подобранные задачи сегодня, чтобы сохранить стрик и
              получить бонус <strong>+{DAILY_SESSION_BONUS_XP} XP</strong>.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {dailyBonusClaimed ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-xs font-bold text-emerald-300">
                <Sparkles className="size-4" />
                Сессия выполнена! Бонус +{DAILY_SESSION_BONUS_XP} XP получен
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card/80 px-4 py-2.5 text-right">
                <span className="text-[11px] text-muted-foreground uppercase">
                  Награда за 3/3
                </span>
                <p className="text-base font-bold text-amber-300">
                  +{DAILY_SESSION_BONUS_XP} XP
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {dailySlots.map((slot, idx) => {
            const task = tasks.find((t) => t.id === slot.taskId);
            if (!task) return null;

            const isDone = dailySolvedIds.includes(task.id);

            return (
              <div
                key={task.id}
                className={
                  isDone
                    ? 'flex flex-col justify-between gap-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-5'
                    : 'flex flex-col justify-between gap-4 rounded-xl border border-border bg-card/60 p-5 transition hover:border-sky-500/40'
                }
              >
                <div className="flex items-start gap-3.5">
                  {isDone ? (
                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="mt-1 size-5 shrink-0 text-muted-foreground" />
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-sky-400">
                        Шаг {idx + 1}: {slot.label}
                      </span>
                      <Badge variant="secondary" className="gap-1 text-[10px]">
                        {task.track === 'layout' ? (
                          <Layout className="size-3" />
                        ) : (
                          <Code2 className="size-3" />
                        )}
                        {task.track === 'layout'
                          ? 'Вёрстка / UI'
                          : 'Код / Логика'}{' '}
                        · Ур. {task.level}
                      </Badge>
                      {slot.isMemoryReview ? (
                        <Badge className="bg-amber-500/20 text-[10px] text-amber-300">
                          По памяти (+50% XP)
                        </Badge>
                      ) : null}
                    </div>

                    <h3 className="mt-1.5 text-base font-semibold text-foreground">
                      {task.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {task.prompt}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant={isDone ? 'outline' : 'default'}
                  onClick={() =>
                    onStartTask(
                      task.track,
                      task.level,
                      task.id,
                      slot.isMemoryReview,
                    )
                  }
                  className="w-full gap-1.5"
                >
                  <Play className="size-3.5" />
                  {isDone ? 'Открыть снова' : 'Начать'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}