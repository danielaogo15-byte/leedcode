import {
	ALL_RITUALS,
	matchTerminalCommand,
 } from '@/features/terminal/terminalMatcher';
 import { describe, expect, it } from 'vitest';
 
 describe('terminalMatcher', () => {
	it('loads terminal rituals from /content/terminal', () => {
	  expect(ALL_RITUALS.length).toBeGreaterThanOrEqual(2);
	});
 
	it('matches regex and exact commands in the Vite + Git ritual', () => {
	  expect(
		 matchTerminalCommand(
			'pnpm create vite my-app',
			'^pnpm create vite(\\s+[\\w-]+)?$',
		 ),
	  ).toBe(true);
	  expect(
		 matchTerminalCommand(
			'git commit -m "initial commit"',
			'^git commit -m [\"\'].+[\"\']$',
		 ),
	  ).toBe(true);
	  expect(matchTerminalCommand('git init', 'git init')).toBe(true);
	  expect(matchTerminalCommand('npm install', '^pnpm\\s+(i|install)$')).toBe(
		 false,
	  );
	});
 });