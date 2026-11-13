import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { computeUnlockedLevel } from '@/features/profile/xpCalculator';
import {
  STREAK_FREEZE_COST_XP,
  useProgressStore,
} from '@/stores/useProgressStore';
import type { Task } from '@/types/task';
import { LEVEL_ROADMAP, LEVELS, type Level, type TrackId } from '@/types/track';
import {
  Award,
  Brain,
  CalendarDays,
  CheckCircle2,
  Flame,
  Layers,
  RotateCcw,
  Snowflake,
  Trophy,
} from 'lucide-react';
import { useMemo } from 'react';

type Props = {
  tasks: Task[];
  onSelectTask: (
    track: TrackId,
    level: Level,
    taskId: string,
    memoryMode?: boolean,
  ) => void;
};

export function ProfileView({ tasks, onSelectTask }: Props) {
  const totalXp = useProgressStore((s) => s.totalXp);
  const streakDays = useProgressStore((s) => s.streakDays);
  const streakFreezes = useProgressStore((s) => s.streakFreezes);
  const progressByTask = useProgressStore((s) => s.progressByTask);
  const activityByDate = useProgressStore((s) => s.activityByDate);
  const buyStreakFreeze = useProgressStore((s) => s.buyStreakFreeze);

  const solvedMap: Record<string, boolean> = {};
  for (const [id, rec] of Object.entries(progressByTask)) {
    if (rec.solved) solvedMap[id] = true;
  }

  const totalSolved = tasks.filter((t) => solvedMap[t.id]).length;
  const layoutTasks = tasks.filter((t) => t.track === 'layout');
  const logicTasks = tasks.filter((t) => t.track === 'logic');
  const layoutSolved = layoutTasks.filter((t) => solvedMap[t.id]).length;
  const logicSolved = logicTasks.filter((t) => solvedMap[t.id]).length;

  const unlockedLayout = computeUnlockedLevel('layout', tasks, solvedMap);
  const unlockedLogic = computeUnlockedLevel('logic', tasks, solvedMap);

  const repeatQueue = tasks.filter((t) => progressByTask[t.id]?.inRepeatQueue);
  const now = Date.now();
  const memoryDueQueue = tasks.filter((t) => {
    const rec = progressByTask[t.id];
    return rec?.solved && rec.nextReviewAt !== null && rec.nextReviewAt <= now;
  });

  const heatmapWeeks = useMemo(() => {
    const weeks: { key: string; count: number; label: string }[][] = [];
    const today = new Date();
    const totalDays = 52 * 7;

    for (let w = 0; w < 52; w += 1) {
      const week: { key: string; count: number; label: string }[] = [];
      for (let d = 0; d < 7; d += 1) {
        const offset = totalDays - 1 - (w * 7 + d);
        const date = new Date(today);
        date.setDate(today.getDate() - offset);
        const key = date.toISOString().slice(0, 10);
        const count = activityByDate[key] ?? 0;
        week.push({
          key,
          count,
          label: `${date.toLocaleDateString('ru-RU')}: решено ${count}`,
        });
      }
      weeks.push(week);
    }
    return weeks;
  }, [activityByDate]);

  const activeDaysCount = Object.values(activityByDate).filter(
    (c) => c > 0,
  ).length;

  return (
    <div className="col-span-2 overflow-y-auto p-6">
      <div className="flex w-full flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Trophy className="size-4 text-amber-400" />
              Всего опыта (XP)
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {totalXp} XP
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Hardcore ×1.5 · Боссы ×3
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Flame className="size-4 text-orange-400" />
              Текущий стрик
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {streakDays} дн.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Надбавка к XP: +{Math.min(30, streakDays * 2)}%
            </p>
          </div>

          <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 text-sky-400">
                <Snowflake className="size-4" />
                Заморозка стрика
              </span>
              <Badge variant="secondary">{streakFreezes} шт.</Badge>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Спасает стрик при пропуске дня
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={totalXp < STREAK_FREEZE_COST_XP}
              onClick={() => {
                void buyStreakFreeze();
              }}
              className="mt-2.5 h-7 w-full text-xs"
            >
              Купить за {STREAK_FREEZE_COST_XP} XP
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Award className="size-4 text-emerald-400" />
              Решено задач
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {totalSolved} из {tasks.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Вёрстка: {layoutSolved}/{layoutTasks.length} · Логика:{' '}
              {logicSolved}/{logicTasks.length}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <CalendarDays className="size-4 text-emerald-400" />
              Годовая карта активности (52 недели)
            </h3>
            <span className="text-xs text-muted-foreground">
              Активных дней за год:{' '}
              <strong className="text-foreground">{activeDaysCount}</strong>
            </span>
          </div>

          <div className="mt-3 overflow-x-auto pb-1">
            <div className="flex justify-between gap-1">
              {heatmapWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day) => {
                    const cellColor =
                      day.count === 0
                        ? 'bg-muted/50 border-border/40'
                        : day.count === 1
                          ? 'bg-emerald-500/30 border-emerald-500/40'
                          : day.count <= 3
                            ? 'bg-emerald-500/60 border-emerald-500/70'
                            : 'bg-emerald-400 border-emerald-300';
                    return (
                      <div
                        key={day.key}
                        title={day.label}
                        className={`size-3.5 rounded-[3px] border ${cellColor}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
            <span>Меньше</span>
            <span className="size-2.5 rounded-[2px] bg-muted/50" />
            <span className="size-2.5 rounded-[2px] bg-emerald-500/30" />
            <span className="size-2.5 rounded-[2px] bg-emerald-500/60" />
            <span className="size-2.5 rounded-[2px] bg-emerald-400" />
            <span>Больше</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card/40 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <RotateCcw className="size-4 text-rose-400" />
              Очередь «Повторить» (после «Сдаюсь»)
            </h3>
            {repeatQueue.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Очередь пуста — ты не сдавалась ни на одной задаче!
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {repeatQueue.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs"
                  >
                    <span>{item.title}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        onSelectTask(item.track, item.level, item.id, false)
                      }
                    >
                      Решить
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card/40 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Brain className="size-4 text-sky-400" />
              Повтор «По памяти» (интервалы 2 / 7 / 21 день)
            </h3>
            {memoryDueQueue.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">
                На сегодня нет задач с подошедшим сроком повтора по памяти.
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {memoryDueQueue.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs"
                  >
                    <span>{item.title}</span>
                    <Button
                      size="sm"
                      onClick={() =>
                        onSelectTask(item.track, item.level, item.id, true)
                      }
                    >
                      По памяти (+50% XP)
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/40 p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Layers className="size-4 text-sky-400" />
            Карта уровней и 39 технологий твоего стека
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LEVELS.map((lvl) => {
              const info = LEVEL_ROADMAP[lvl];
              const isOpen = lvl <= Math.max(unlockedLayout, unlockedLogic);
              return (
                <div
                  key={lvl}
                  className="rounded-lg border border-border/80 bg-muted/20 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">
                      Уровень {lvl}: {info.title}
                    </span>
                    {isOpen ? (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    ) : (
                      <Badge variant="secondary">Закрыт</Badge>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {info.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-border/60 bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}