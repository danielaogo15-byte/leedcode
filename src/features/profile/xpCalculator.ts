import type { Task } from '@/types/task';
import { LEVELS, type Level, type TrackId } from '@/types/track';

export type XpCalculationInput = {
  level: Level;
  isBoss: boolean;
  attemptsOnCurrentRun: number;
  maxHintTierUsed: number;
  hardcore: boolean;
  gaveUp: boolean;
  suspiciousSpeed: boolean;
  streakDays: number;
  isMemoryReview?: boolean;
};

export type XpBreakdown = {
  totalXp: number;
  baseXp: number;
  reason: string;
};

const REVIEW_INTERVALS_DAYS = [2, 7, 21] as const;

export function calculateTaskXp(input: XpCalculationInput): XpBreakdown {
  if (input.gaveUp) {
    return {
      totalXp: 0,
      baseXp: 0,
      reason: 'Нажато «Сдаюсь» — 0 XP, задача добавлена в очередь повторения',
    };
  }

  if (input.suspiciousSpeed) {
    return {
      totalXp: 0,
      baseXp: 0,
      reason: 'Подозрительно быстрый ввод — 0 XP',
    };
  }

  const baseXp = 10 * input.level;

  // Повтор «по памяти» через 2/7/21 день: 50% базы только с первой попытки
  if (input.isMemoryReview) {
    if (input.attemptsOnCurrentRun > 1) {
      return {
        totalXp: 0,
        baseXp,
        reason: 'Повтор по памяти даёт XP только с 1-й попытки',
      };
    }
    const reviewXp = Math.round(baseXp * 0.5);
    return {
      totalXp: reviewXp,
      baseXp,
      reason: `+${reviewXp} XP (повтор по памяти: 50% базы с 1-й попытки)`,
    };
  }

  // Надбавки и штрафы к базе
  let additiveBonus = 1;

  if (input.attemptsOnCurrentRun === 1) {
    additiveBonus += 0.25; // +25% первая попытка
  }

  if (input.maxHintTierUsed <= 1) {
    additiveBonus += 0.25; // +25% без платных подсказок (tier 1 бесплатна)
  } else if (input.maxHintTierUsed === 2) {
    additiveBonus -= 0.1; // подсказка 2 = -10%
  } else if (input.maxHintTierUsed >= 3) {
    additiveBonus -= 0.3; // подсказка 3 = -30%
  }

  let xp = baseXp * Math.max(0.2, additiveBonus);

  if (input.hardcore) {
    xp *= 1.5;
  }

  if (input.isBoss) {
    xp *= 3;
  }

  const streakMultiplier = 1 + Math.min(0.3, Math.max(0, input.streakDays) * 0.02);
  xp *= streakMultiplier;

  const totalXp = Math.round(xp);
  const tags: string[] = [`база ${baseXp}`];
  if (input.attemptsOnCurrentRun === 1) tags.push('+25% 1-я попытка');
  if (input.maxHintTierUsed <= 1) tags.push('+25% без платных подсказок');
  if (input.maxHintTierUsed === 2) tags.push('-10% подсказка 2');
  if (input.maxHintTierUsed >= 3) tags.push('-30% подсказка 3');
  if (input.hardcore) tags.push('×1.5 Hardcore');
  if (input.isBoss) tags.push('×3 Босс');
  if (input.streakDays > 0) {
    tags.push(`+${Math.min(30, input.streakDays * 2)}% стрик`);
  }

  return {
    totalXp,
    baseXp,
    reason: `+${totalXp} XP (${tags.join(', ')})`,
  };
}

export function computeNextReviewDate(
  reviewStage: number,
  now = Date.now(),
): { nextReviewAt: number; nextStage: number } {
  const index = Math.min(reviewStage, REVIEW_INTERVALS_DAYS.length - 1);
  const days = REVIEW_INTERVALS_DAYS[index] ?? 21;
  const nextReviewAt = now + days * 24 * 60 * 60 * 1000;
  return {
    nextReviewAt,
    nextStage: Math.min(reviewStage + 1, REVIEW_INTERVALS_DAYS.length),
  };
}

export function computeUnlockedLevel(
  track: TrackId,
  allTasks: Task[],
  solvedMap: Record<string, boolean>,
): Level {
  let unlocked: Level = 1;

  for (const lvl of LEVELS) {
    const levelTasks = allTasks.filter(
      (t) => t.track === track && t.level === lvl,
    );
    if (levelTasks.length === 0) {
      break;
    }

    const solvedCount = levelTasks.filter((t) => solvedMap[t.id]).length;
    const ratio = solvedCount / levelTasks.length;
    const bossTasks = levelTasks.filter((t) => t.isBoss);
    const bossSolved =
      bossTasks.length === 0 || bossTasks.every((b) => solvedMap[b.id]);

    if (ratio >= 0.8 && bossSolved && lvl < 7) {
      unlocked = (lvl + 1) as Level;
    } else {
      break;
    }
  }

  return unlocked;
}