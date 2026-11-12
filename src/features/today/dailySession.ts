import type { TaskProgressRecord } from '@/db/database';
import { computeUnlockedLevel } from '@/features/profile/xpCalculator';
import type { Task } from '@/types/task';

export const DAILY_SESSION_SIZE = 3;
export const DAILY_SESSION_BONUS_XP = 30;

export type DailySlotReason = 'repeat' | 'memory' | 'unsolved' | 'practice';

export type DailySlot = {
  taskId: string;
  reason: DailySlotReason;
  reasonLabel: string;
  memoryMode: boolean;
};

export function pickDailyTasks(
  allTasks: Task[],
  progressByTask: Record<string, TaskProgressRecord>,
  now = Date.now(),
): DailySlot[] {
  const pickedIds = new Set<string>();
  const slots: DailySlot[] = [];

  const solvedMap: Record<string, boolean> = {};
  for (const [id, rec] of Object.entries(progressByTask)) {
    if (rec.solved) solvedMap[id] = true;
  }

  const unlockedLayout = computeUnlockedLevel('layout', allTasks, solvedMap);
  const unlockedLogic = computeUnlockedLevel('logic', allTasks, solvedMap);

  const isUnlocked = (task: Task) =>
    task.track === 'layout'
      ? task.level <= unlockedLayout
      : task.level <= unlockedLogic;

  // 1. Задача из очереди «Повторить» (после «Сдаюсь»)
  const repeatCandidates = allTasks.filter(
    (t) => progressByTask[t.id]?.inRepeatQueue && isUnlocked(t),
  );
  const firstRepeat = repeatCandidates[0];
  if (firstRepeat) {
    pickedIds.add(firstRepeat.id);
    slots.push({
      taskId: firstRepeat.id,
      reason: 'repeat',
      reasonLabel: 'Работа над ошибками (после «Сдаюсь»)',
      memoryMode: false,
    });
  }

  // 2. Задача, у которой подошёл срок повтора «По памяти» (2 / 7 / 21 день)
  const memoryCandidates = allTasks.filter((t) => {
    if (pickedIds.has(t.id)) return false;
    const rec = progressByTask[t.id];
    return Boolean(
      rec?.solved && rec.nextReviewAt !== null && rec.nextReviewAt <= now,
    );
  });
  const firstMemory = memoryCandidates[0];
  if (firstMemory && slots.length < DAILY_SESSION_SIZE) {
    pickedIds.add(firstMemory.id);
    slots.push({
      taskId: firstMemory.id,
      reason: 'memory',
      reasonLabel: 'Повтор по памяти (интервал 2/7/21 дн.)',
      memoryMode: true,
    });
  }

  // 3. Нерешённые задачи из открытых уровней (чередуем layout и logic)
  const unsolvedLayout = allTasks.filter(
    (t) =>
      t.track === 'layout' &&
      isUnlocked(t) &&
      !solvedMap[t.id] &&
      !pickedIds.has(t.id),
  );
  const unsolvedLogic = allTasks.filter(
    (t) =>
      t.track === 'logic' &&
      isUnlocked(t) &&
      !solvedMap[t.id] &&
      !pickedIds.has(t.id),
  );

  const balancedUnsolved: Task[] = [];
  const maxLen = Math.max(unsolvedLayout.length, unsolvedLogic.length);
  for (let i = 0; i < maxLen; i += 1) {
    const lTask = unsolvedLayout[i];
    const jTask = unsolvedLogic[i];
    if (lTask) balancedUnsolved.push(lTask);
    if (jTask) balancedUnsolved.push(jTask);
  }

  for (const candidate of balancedUnsolved) {
    if (slots.length >= DAILY_SESSION_SIZE) break;
    if (!pickedIds.has(candidate.id)) {
      pickedIds.add(candidate.id);
      slots.push({
        taskId: candidate.id,
        reason: 'unsolved',
        reasonLabel: candidate.isBoss
          ? 'Босс текущего уровня'
          : 'Новая задача по карте',
        memoryMode: false,
      });
    }
  }

  // 4. Если нерешённых не хватило — берём самые давно решённые задачи
  if (slots.length < DAILY_SESSION_SIZE) {
    const oldestSolved = allTasks
      .filter((t) => !pickedIds.has(t.id) && isUnlocked(t))
      .sort((a, b) => {
        const aTime = progressByTask[a.id]?.lastSolvedAt ?? 0;
        const bTime = progressByTask[b.id]?.lastSolvedAt ?? 0;
        return aTime - bTime;
      });

    for (const candidate of oldestSolved) {
      if (slots.length >= DAILY_SESSION_SIZE) break;
      pickedIds.add(candidate.id);
      slots.push({
        taskId: candidate.id,
        reason: 'practice',
        reasonLabel: 'Давно не решалась · повтор по памяти',
        memoryMode: true,
      });
    }
  }

  return slots;
}