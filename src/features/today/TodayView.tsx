import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DAILY_SESSION_BONUS_XP } from '@/features/today/dailySession';
import { useProgressStore } from '@/stores/useProgressStore';
import type { Task } from '@/types/task';
import type { Level, TrackId } from '@/types/track';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Code2,
  Flame,
  Layout,
  Play,
  Sparkles,
  Trophy,
} from 'lucide-react';

type Props = {
  tasks: Task[];
  onStartTask: (
    track: TrackId,
    level: Level,
    taskId: string,
    memoryMode: boolean,
  ) => void;
};

export function TodayView({ tasks, onStartTask }: Props) {
  const dailySlots = useProgressStore((s) => s.dailySlots);
  const dailySolvedIds = useProgressStore((s) => s.dailySolvedIds);
  const dailyBonusClaimed = useProgressStore((s) => s.dailyBonusClaimed);
  const streakDays = useProgressStore((s) => s.streakDays);
  const totalXp = useProgressStore((s) => s.totalXp);

  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const completedCount = dailySolvedIds.length;
  const totalCount = dailySlots.length || 3;

  const firstPendingSlot = dailySlots.find(
    (slot) => !dailySolvedIds.includes(slot.taskId),
  );

  return (
    <div className="col-span-2 overflow-y-auto p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-card to-card p-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300">
                <CalendarCheck2 className="size-3.5" />
                Ежедневная сессия
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                20–30 минут
              </span>
            </div>
            <h2 className="mt-3 text-xl font-bold">
              План тренировки на сегодня
            </h2>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
              Система подобрала {totalCount} задачи: закрытие долгов после
              «Сдаюсь», интервальный повтор по памяти и продвижение по твоей
              карте тем.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            {firstPendingSlot ? (
              <Button
                onClick={() => {
                  const target = taskMap.get(firstPendingSlot.taskId);
                  if (target) {
                    onStartTask(
                      target.track,
                      target.level,
                      target.id,
                      firstPendingSlot.memoryMode,
                    );
                  }
                }}
                className="gap-2 bg-emerald-500 font-semibold text-slate-950 hover:bg-emerald-400"
              >
                <Play className="size-4 fill-current" />
                {completedCount === 0
                  ? 'Начать сессию'
                  : 'Продолжить сессию'}
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="size-4" />
                Все 3 задачи на сегодня решены!
              </div>
            )}
            <span className="text-[11px] text-muted-foreground">
              Награда за закрытие сессии:{' '}
              <strong className="text-amber-300">
                +{DAILY_SESSION_BONUS_XP} XP
              </strong>
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Прогресс за сегодня</span>
              <strong className="text-foreground">
                {completedCount} из {totalCount}
              </strong>
            </div>
            <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{
                  width: `${(completedCount / totalCount) * 100}%`,
                }}
              />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {dailyBonusClaimed
                ? `🎉 Бонус +${DAILY_SESSION_BONUS_XP} XP начислен!`
                : `Осталось решить: ${Math.max(0, totalCount - completedCount)}`}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/50 p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Flame className="size-4 text-orange-400" />
              Ударный стрик
            </div>
            <p className="mt-1.5 text-xl font-bold">{streakDays} дн. подряд</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Множитель опыта: +{Math.min(30, streakDays * 2)}% к каждой задаче
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/50 p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Trophy className="size-4 text-amber-400" />
              Общий опыт
            </div>
            <p className="mt-1.5 text-xl font-bold">{totalXp} XP</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Повтор по памяти даёт +50% базы с 1-й попытки
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">
            Задачи сегодняшней сессии ({completedCount}/{totalCount})
          </h3>

          {dailySlots.map((slot, index) => {
            const task = taskMap.get(slot.taskId);
            if (!task) return null;
            const doneToday = dailySolvedIds.includes(slot.taskId);

            return (
              <div
                key={slot.taskId}
                className={
                  doneToday
                    ? 'flex flex-col justify-between gap-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 sm:flex-row sm:items-center'
                    : 'flex flex-col justify-between gap-4 rounded-xl border border-border bg-card/40 p-4 transition hover:border-sky-500/40 sm:flex-row sm:items-center'
                }
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={
                      doneToday
                        ? 'flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-xs font-bold text-emerald-300'
                        : 'flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground'
                    }
                  >
                    {doneToday ? (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm">{task.title}</span>
                      <Badge variant="secondary" className="gap-1 text-[10px]">
                        {task.track === 'layout' ? (
                          <>
                            <Layout className="size-3" /> Вёрстка · Ур.{' '}
                            {task.level}
                          </>
                        ) : (
                          <>
                            <Code2 className="size-3" /> Логика · Ур.{' '}
                            {task.level}
                          </>
                        )}
                      </Badge>
                      {task.isBoss ? (
                        <Badge variant="destructive" className="text-[10px]">
                          БОСС x3
                        </Badge>
                      ) : null}
                      {slot.memoryMode ? (
                        <Badge className="bg-sky-500/20 text-[10px] text-sky-300">
                          По памяти (пустой редактор)
                        </Badge>
                      ) : null}
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {task.prompt}
                    </p>

                    <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-sky-400">
                      <Sparkles className="size-3" />
                      {slot.reasonLabel}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    size="sm"
                    variant={doneToday ? 'outline' : 'default'}
                    onClick={() =>
                      onStartTask(
                        task.track,
                        task.level,
                        task.id,
                        slot.memoryMode,
                      )
                    }
                  >
                    {doneToday
                      ? 'Открыть снова'
                      : slot.memoryMode
                        ? 'Решить по памяти'
                        : 'Решить задачу'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}