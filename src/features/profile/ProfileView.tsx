import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { computeUnlockedLevel } from '@/features/profile/xpCalculator';
import { useProgressStore } from '@/stores/useProgressStore';
import type { Task } from '@/types/task';
import { LEVEL_ROADMAP, LEVELS, type Level, type TrackId } from '@/types/track';
import {
  Award,
  Brain,
  CheckCircle2,
  Flame,
  Layers,
  RotateCcw,
  Trophy,
} from 'lucide-react';

type Props = {
  tasks: Task[];
  onSelectTask: (track: TrackId, level: Level, taskId: string, memoryMode?: boolean) => void;
};

export function ProfileView({ tasks, onSelectTask }: Props) {
  const totalXp = useProgressStore((s) => s.totalXp);
  const streakDays = useProgressStore((s) => s.streakDays);
  const progressByTask = useProgressStore((s) => s.progressByTask);
  const activityByDate = useProgressStore((s) => s.activityByDate);

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

  // Последние 7 дней для мини-графика стрика
  const last7Days = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - idx));
    const key = d.toISOString().slice(0, 10);
    return {
      key,
      label: d.toLocaleDateString('ru-RU', { weekday: 'short' }),
      count: activityByDate[key] ?? 0,
    };
  });

  return (
    <div className="col-span-2 overflow-y-auto p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Trophy className="size-4 text-amber-400" />
              Всего опыта (XP)
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {totalXp} XP
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Бонус за Hardcore ×1.5 · Боссы ×3
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
              Надбавка к XP: +{Math.min(30, streakDays * 2)}% (макс. +30%)
            </p>
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

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card/40 p-4">
            <h3 className="text-sm font-semibold">Прогресс по трекам</h3>
            <div className="mt-3 flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs">
                  <span>Вёрстка / UI (открыт ур. {unlockedLayout})</span>
                  <span>
                    {layoutSolved}/{layoutTasks.length}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-sky-500 transition-all"
                    style={{
                      width: `${layoutTasks.length ? (layoutSolved / layoutTasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs">
                  <span>Код / Логика (открыт ур. {unlockedLogic})</span>
                  <span>
                    {logicSolved}/{logicTasks.length}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{
                      width: `${logicTasks.length ? (logicSolved / logicTasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card/40 p-4">
            <h3 className="text-sm font-semibold">Активность за 7 дней</h3>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {last7Days.map((day) => (
                <div
                  key={day.key}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2"
                >
                  <span className="text-[10px] text-muted-foreground uppercase">
                    {day.label}
                  </span>
                  <span
                    className={
                      day.count > 0
                        ? 'flex size-7 items-center justify-center rounded-md bg-emerald-500/20 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/40'
                        : 'flex size-7 items-center justify-center rounded-md bg-muted/40 text-xs text-muted-foreground'
                    }
                  >
                    {day.count}
                  </span>
                </div>
              ))}
            </div>
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
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LEVELS.map((lvl) => {
              const info = LEVEL_ROADMAP[lvl];
              const isOpen =
                lvl <= Math.max(unlockedLayout, unlockedLogic);
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