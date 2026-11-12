import {
	calculateTaskXp,
	computeUnlockedLevel,
 } from '@/features/profile/xpCalculator';
 import { ALL_TASKS } from '@/features/tasks/loadTasks';
 import { describe, expect, it } from 'vitest';
 
 describe('xpCalculator', () => {
	it('awards +25% first try and +25% no paid hints on level 1', () => {
	  const res = calculateTaskXp({
		 level: 1,
		 isBoss: false,
		 attemptsOnCurrentRun: 1,
		 maxHintTierUsed: 0,
		 hardcore: false,
		 gaveUp: false,
		 suspiciousSpeed: false,
		 streakDays: 0,
	  });
	  // Base 10 * (1 + 0.25 + 0.25) = 15
	  expect(res.totalXp).toBe(15);
	});
 
	it('multiplies by 1.5 in hardcore and by 3 for boss', () => {
	  const res = calculateTaskXp({
		 level: 1,
		 isBoss: true,
		 attemptsOnCurrentRun: 1,
		 maxHintTierUsed: 1, // tier 1 is free
		 hardcore: true,
		 gaveUp: false,
		 suspiciousSpeed: false,
		 streakDays: 0,
	  });
	  // Base 10 * 1.5 (bonuses) * 1.5 (hardcore) * 3 (boss) = 67.5 -> 68
	  expect(res.totalXp).toBe(68);
	});
 
	it('unlocks level 2 when >=80% and boss are solved', () => {
	  const solved: Record<string, boolean> = {
		 'layout-01-card': true,
		 'layout-02-nav': true,
		 'layout-03-center': true,
		 'layout-04-button': false,
		 'layout-05-boss-header': true,
	  };
	  expect(computeUnlockedLevel('layout', ALL_TASKS, solved)).toBe(2);
	});
 });