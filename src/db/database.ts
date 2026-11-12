import type { DailySlot } from '@/features/today/dailySession';
import Dexie, { type EntityTable } from 'dexie';

export type SubmissionRecord = {
  id: string;
  createdAt: number;
  codeSnapshot: string;
  durationMs: number;
  xpEarned: number;
};

export type TaskProgressRecord = {
  taskId: string;
  solved: boolean;
  attempts: number;
  bestXp: number;
  lastSolvedAt: number | null;
  inRepeatQueue: boolean;
  reviewStage: number; // 0 -> 2 дня, 1 -> 7 дней, 2 -> 21 день
  nextReviewAt: number | null;
  note?: string;
  submissions?: SubmissionRecord[];
};

export type UserStatsRecord = {
  id: 'main';
  totalXp: number;
  streakDays: number;
  streakFreezes?: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  activityByDate: Record<string, number>; // YYYY-MM-DD -> кол-во решённых задач
  dailyDate?: string | null;
  dailySlots?: DailySlot[];
  dailySolvedIds?: string[];
  dailyBonusClaimed?: boolean;
};

class DojoDatabase extends Dexie {
  taskProgress!: EntityTable<TaskProgressRecord, 'taskId'>;
  userStats!: EntityTable<UserStatsRecord, 'id'>;

  constructor() {
    super('VibeCodeDojoDB');
    this.version(1).stores({
      taskProgress: 'taskId, solved, inRepeatQueue, nextReviewAt',
      userStats: 'id',
    });
  }
}

export const db =
  typeof indexedDB !== 'undefined' ? new DojoDatabase() : null;

export function getTodayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function getYesterdayKey(date = new Date()): string {
  const copy = new Date(date);
  copy.setDate(copy.getDate() - 1);
  return copy.toISOString().slice(0, 10);
}