import {
	db,
	getTodayKey,
	getYesterdayKey,
	type SubmissionRecord,
	type TaskProgressRecord,
	type UserStatsRecord,
 } from '@/db/database';
 import { loadSolvedMap, saveSolvedMap } from '@/features/editor/codeDrafts';
 import {
	calculateTaskXp,
	computeNextReviewDate,
 } from '@/features/profile/xpCalculator';
 import {
	DAILY_SESSION_BONUS_XP,
	pickDailyTasks,
	type DailySlot,
 } from '@/features/today/dailySession';
 import type { Task } from '@/types/task';
 import type { Level } from '@/types/track';
 import { create } from 'zustand';
 
 export const STREAK_FREEZE_COST_XP = 100;
 
 type RecordAttemptParams = {
	taskId: string;
	level: Level;
	isBoss: boolean;
	passed: boolean;
	attemptsOnCurrentRun: number;
	maxHintTierUsed: number;
	hardcore: boolean;
	suspiciousSpeed: boolean;
	isMemoryReview?: boolean;
	codeSnapshot?: string;
	durationMs?: number;
 };
 
 type ProgressState = {
	hydrated: boolean;
	totalXp: number;
	streakDays: number;
	streakFreezes: number;
	lastActiveDate: string | null;
	activityByDate: Record<string, number>;
	progressByTask: Record<string, TaskProgressRecord>;
	dailyDate: string | null;
	dailySlots: DailySlot[];
	dailySolvedIds: string[];
	dailyBonusClaimed: boolean;
	lastXpBanner: string | null;
	hydrate: () => Promise<void>;
	ensureDailySession: (allTasks: Task[]) => Promise<void>;
	recordAttempt: (params: RecordAttemptParams) => Promise<void>;
	recordGiveUp: (taskId: string) => Promise<void>;
	saveTaskNote: (taskId: string, note: string) => Promise<void>;
	buyStreakFreeze: () => Promise<boolean>;
	awardBonusXp: (amount: number, reason: string) => Promise<void>;
	clearXpBanner: () => void;
 };
 
 function createEmptyRecord(taskId: string): TaskProgressRecord {
	return {
	  taskId,
	  solved: false,
	  attempts: 0,
	  bestXp: 0,
	  lastSolvedAt: null,
	  inRepeatQueue: false,
	  reviewStage: 0,
	  nextReviewAt: null,
	  note: '',
	  submissions: [],
	};
 }
 
 export const useProgressStore = create<ProgressState>((set, get) => ({
	hydrated: false,
	totalXp: 0,
	streakDays: 0,
	streakFreezes: 0,
	lastActiveDate: null,
	activityByDate: {},
	progressByTask: {},
	dailyDate: null,
	dailySlots: [],
	dailySolvedIds: [],
	dailyBonusClaimed: false,
	lastXpBanner: null,
 
	hydrate: async () => {
	  if (get().hydrated) return;
 
	  const legacySolved = loadSolvedMap();
	  const initialMap: Record<string, TaskProgressRecord> = {};
 
	  for (const [taskId, isSolved] of Object.entries(legacySolved)) {
		 if (isSolved) {
			initialMap[taskId] = {
			  ...createEmptyRecord(taskId),
			  solved: true,
			  attempts: 1,
			  bestXp: 15,
			  lastSolvedAt: Date.now(),
			};
		 }
	  }
 
	  if (!db) {
		 const legacyXp = Object.keys(initialMap).length * 15;
		 set({
			hydrated: true,
			progressByTask: initialMap,
			totalXp: legacyXp,
			streakDays: legacyXp > 0 ? 1 : 0,
		 });
		 return;
	  }
 
	  try {
		 const [rows, stats] = await Promise.all([
			db.taskProgress.toArray(),
			db.userStats.get('main'),
		 ]);
 
		 for (const row of rows) {
			initialMap[row.taskId] = {
			  ...createEmptyRecord(row.taskId),
			  ...row,
			};
		 }
 
		 const calculatedXp =
			stats?.totalXp ??
			Object.values(initialMap).reduce((sum, r) => sum + r.bestXp, 0);
 
		 set({
			hydrated: true,
			progressByTask: initialMap,
			totalXp: calculatedXp,
			streakDays: stats?.streakDays ?? (calculatedXp > 0 ? 1 : 0),
			streakFreezes: stats?.streakFreezes ?? 0,
			lastActiveDate: stats?.lastActiveDate ?? null,
			activityByDate: stats?.activityByDate ?? {},
			dailyDate: stats?.dailyDate ?? null,
			dailySlots: stats?.dailySlots ?? [],
			dailySolvedIds: stats?.dailySolvedIds ?? [],
			dailyBonusClaimed: Boolean(stats?.dailyBonusClaimed),
		 });
	  } catch {
		 set({ hydrated: true, progressByTask: initialMap });
	  }
	},
 
	ensureDailySession: async (allTasks) => {
	  const state = get();
	  const today = getTodayKey();
 
	  if (state.dailyDate === today && state.dailySlots.length > 0) {
		 return;
	  }
 
	  const slots = pickDailyTasks(allTasks, state.progressByTask);
	  set({
		 dailyDate: today,
		 dailySlots: slots,
		 dailySolvedIds: [],
		 dailyBonusClaimed: false,
	  });
 
	  if (db) {
		 const nextStats: UserStatsRecord = {
			id: 'main',
			totalXp: state.totalXp,
			streakDays: state.streakDays,
			streakFreezes: state.streakFreezes,
			lastActiveDate: state.lastActiveDate,
			activityByDate: state.activityByDate,
			dailyDate: today,
			dailySlots: slots,
			dailySolvedIds: [],
			dailyBonusClaimed: false,
		 };
		 await db.userStats.put(nextStats);
	  }
	},
 
	recordAttempt: async (params) => {
	  const state = get();
	  const prev =
		 state.progressByTask[params.taskId] ?? createEmptyRecord(params.taskId);
 
	  if (!params.passed) {
		 const updated: TaskProgressRecord = {
			...prev,
			attempts: prev.attempts + 1,
		 };
		 set({
			progressByTask: { ...state.progressByTask, [params.taskId]: updated },
		 });
		 if (db) {
			await db.taskProgress.put(updated);
		 }
		 return;
	  }
 
	  const today = getTodayKey();
	  const yesterday = getYesterdayKey();
	  let nextStreak = state.streakDays;
	  let nextFreezes = state.streakFreezes;
	  let freezeUsed = false;
 
	  if (state.lastActiveDate !== today) {
		 if (state.lastActiveDate === yesterday) {
			nextStreak = state.streakDays + 1;
		 } else if (state.lastActiveDate && state.streakFreezes > 0 && state.streakDays > 0) {
			nextStreak = state.streakDays + 1;
			nextFreezes = state.streakFreezes - 1;
			freezeUsed = true;
		 } else {
			nextStreak = 1;
		 }
	  }
 
	  const breakdown = calculateTaskXp({
		 level: params.level,
		 isBoss: params.isBoss,
		 attemptsOnCurrentRun: params.attemptsOnCurrentRun,
		 maxHintTierUsed: params.maxHintTierUsed,
		 hardcore: params.hardcore,
		 gaveUp: false,
		 suspiciousSpeed: params.suspiciousSpeed,
		 streakDays: nextStreak,
		 isMemoryReview: params.isMemoryReview,
	  });
 
	  const earnedXp =
		 !prev.solved || params.isMemoryReview ? breakdown.totalXp : 0;
 
	  const { nextReviewAt, nextStage } = computeNextReviewDate(prev.reviewStage);
 
	  const newSubmission: SubmissionRecord | null = params.codeSnapshot
		 ? {
			  id: `sub-${Date.now()}`,
			  createdAt: Date.now(),
			  codeSnapshot: params.codeSnapshot,
			  durationMs: params.durationMs ?? 1,
			  xpEarned: earnedXp,
			}
		 : null;
 
	  const prevSubmissions = prev.submissions ?? [];
	  const nextSubmissions = newSubmission
		 ? [newSubmission, ...prevSubmissions].slice(0, 10)
		 : prevSubmissions;
 
	  const updatedRecord: TaskProgressRecord = {
		 ...prev,
		 solved: true,
		 attempts: prev.attempts + 1,
		 bestXp: Math.max(prev.bestXp, breakdown.totalXp),
		 lastSolvedAt: Date.now(),
		 inRepeatQueue: false,
		 reviewStage: nextStage,
		 nextReviewAt,
		 submissions: nextSubmissions,
	  };
 
	  const nextProgressMap = {
		 ...state.progressByTask,
		 [params.taskId]: updatedRecord,
	  };
 
	  const nextActivity = {
		 ...state.activityByDate,
		 [today]: (state.activityByDate[today] ?? 0) + 1,
	  };
 
	  const isInDaily = state.dailySlots.some((s) => s.taskId === params.taskId);
	  const nextDailySolvedIds =
		 isInDaily &&
		 !params.suspiciousSpeed &&
		 !state.dailySolvedIds.includes(params.taskId)
			? [...state.dailySolvedIds, params.taskId]
			: state.dailySolvedIds;
 
	  const justCompletedDaily =
		 !state.dailyBonusClaimed &&
		 state.dailySlots.length > 0 &&
		 nextDailySolvedIds.length >= state.dailySlots.length;
 
	  const dailyBonusXp = justCompletedDaily ? DAILY_SESSION_BONUS_XP : 0;
	  const nextBonusClaimed = state.dailyBonusClaimed || justCompletedDaily;
	  const nextTotalXp = state.totalXp + earnedXp + dailyBonusXp;
 
	  let bannerMessage =
		 earnedXp > 0
			? breakdown.reason
			: 'Задача уже была решена ранее (0 новых XP) · Решение сохранено в Историю';
 
	  if (freezeUsed) {
		 bannerMessage += ' · ❄️ Использована 1 заморозка стрика!';
	  }
	  if (justCompletedDaily) {
		 bannerMessage += ` · 🎉 +${DAILY_SESSION_BONUS_XP} XP за ежедневную сессию (3/3)!`;
	  }
 
	  set({
		 progressByTask: nextProgressMap,
		 totalXp: nextTotalXp,
		 streakDays: nextStreak,
		 streakFreezes: nextFreezes,
		 lastActiveDate: today,
		 activityByDate: nextActivity,
		 dailySolvedIds: nextDailySolvedIds,
		 dailyBonusClaimed: nextBonusClaimed,
		 lastXpBanner: bannerMessage,
	  });
 
	  const solvedBoolMap: Record<string, boolean> = {};
	  for (const [id, rec] of Object.entries(nextProgressMap)) {
		 if (rec.solved) solvedBoolMap[id] = true;
	  }
	  saveSolvedMap(solvedBoolMap);
 
	  if (db) {
		 const nextStats: UserStatsRecord = {
			id: 'main',
			totalXp: nextTotalXp,
			streakDays: nextStreak,
			streakFreezes: nextFreezes,
			lastActiveDate: today,
			activityByDate: nextActivity,
			dailyDate: state.dailyDate ?? today,
			dailySlots: state.dailySlots,
			dailySolvedIds: nextDailySolvedIds,
			dailyBonusClaimed: nextBonusClaimed,
		 };
		 await Promise.all([
			db.taskProgress.put(updatedRecord),
			db.userStats.put(nextStats),
		 ]);
	  }
	},
 
	recordGiveUp: async (taskId) => {
	  const state = get();
	  const prev = state.progressByTask[taskId] ?? createEmptyRecord(taskId);
	  const updated: TaskProgressRecord = {
		 ...prev,
		 inRepeatQueue: true,
	  };
 
	  set({
		 progressByTask: { ...state.progressByTask, [taskId]: updated },
		 lastXpBanner:
			'Нажато «Сдаюсь» — 0 XP, задача добавлена в очередь «Повторить»',
	  });
 
	  if (db) {
		 await db.taskProgress.put(updated);
	  }
	},
 
	saveTaskNote: async (taskId, note) => {
	  const state = get();
	  const prev = state.progressByTask[taskId] ?? createEmptyRecord(taskId);
	  const updated: TaskProgressRecord = {
		 ...prev,
		 note,
	  };
	  set({
		 progressByTask: { ...state.progressByTask, [taskId]: updated },
	  });
	  if (db) {
		 await db.taskProgress.put(updated);
	  }
	},
 
	buyStreakFreeze: async () => {
	  const state = get();
	  if (state.totalXp < STREAK_FREEZE_COST_XP) {
		 return false;
	  }
	  const nextXp = state.totalXp - STREAK_FREEZE_COST_XP;
	  const nextFreezes = state.streakFreezes + 1;
 
	  set({
		 totalXp: nextXp,
		 streakFreezes: nextFreezes,
		 lastXpBanner: `❄️ Куплена заморозка стрика (-${STREAK_FREEZE_COST_XP} XP). Запас: ${nextFreezes}`,
	  });
 
	  if (db) {
		 const nextStats: UserStatsRecord = {
			id: 'main',
			totalXp: nextXp,
			streakDays: state.streakDays,
			streakFreezes: nextFreezes,
			lastActiveDate: state.lastActiveDate,
			activityByDate: state.activityByDate,
			dailyDate: state.dailyDate,
			dailySlots: state.dailySlots,
			dailySolvedIds: state.dailySolvedIds,
			dailyBonusClaimed: state.dailyBonusClaimed,
		 };
		 await db.userStats.put(nextStats);
	  }
	  return true;
	},
 
	awardBonusXp: async (amount, reason) => {
	  const state = get();
	  const nextXp = state.totalXp + amount;
	  set({
		 totalXp: nextXp,
		 lastXpBanner: reason,
	  });
	  if (db) {
		 const nextStats: UserStatsRecord = {
			id: 'main',
			totalXp: nextXp,
			streakDays: state.streakDays,
			streakFreezes: state.streakFreezes,
			lastActiveDate: state.lastActiveDate,
			activityByDate: state.activityByDate,
			dailyDate: state.dailyDate,
			dailySlots: state.dailySlots,
			dailySolvedIds: state.dailySolvedIds,
			dailyBonusClaimed: state.dailyBonusClaimed,
		 };
		 await db.userStats.put(nextStats);
	  }
	},
 
	clearXpBanner: () => set({ lastXpBanner: null }),
 }));