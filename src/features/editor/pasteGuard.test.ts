import {
	canPasteInternal,
	createPasteGuardState,
	evaluateCodeChange,
 } from '@/features/editor/pasteGuard';
 import { describe, expect, it } from 'vitest';
 
 describe('pasteGuard', () => {
	it('blocks external paste that does not match internalClipboard', () => {
	  expect(canPasteInternal('const a = 1;', '')).toBe(false);
	  expect(canPasteInternal('const a = 1;', 'const a = 1;')).toBe(true);
	});
 
	it('rejects large single-change bulk insertions', () => {
	  const state = createPasteGuardState();
	  const prev = 'function sumEven(arr) {\n}';
	  const huge =
		 'function sumEven(arr) {\n  return arr.filter((x) => x % 2 === 0).reduce((a, b) => a + b, 0);\n}';
	  const result = evaluateCodeChange(prev, huge, state);
	  expect(result.allowed).toBe(false);
	  expect(result.nextState.blockedAttemptMessage).toBeTruthy();
	});
 });