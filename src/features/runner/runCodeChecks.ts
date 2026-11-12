import {
	runCustomLogicCall,
	runLogicTask,
 } from '@/features/runner/runLogicTask';
 import type {
	CustomRunOutcome,
	RunOutcome,
	TestResultItem,
 } from '@/types/runner';
 import type { CodePatternCheck, LogicTest } from '@/types/task';
 
 export function stripTypeScriptAnnotations(tsCode: string): string {
	return tsCode
	  .replace(/^\s*export\s+/gm, '')
	  .replace(/^\s*interface\s+\w+\s*\{[\s\S]*?\}\s*/gm, '')
	  .replace(/^\s*type\s+\w+\s*=\s*[^;]+;\s*/gm, '')
	  .replace(/<\s*[A-Za-z0-9_,\s]+\s*>(?=\s*\()/g, '')
	  .replace(
		 /(\b(?:const|let|var)\s+[A-Za-z_$][\w$]*)\s*:\s*[^=;]+(?=\s*=)/g,
		 '$1',
	  )
	  .replace(/\)\s*:\s*[A-Za-z0-9_<>\[\]|&\s{}.,]+(?=\s*\{)/g, ')')
	  .replace(
		 /([(\s,][A-Za-z_$][\w$]*\??)\s*:\s*[A-Za-z0-9_<>\[\]|&\s{}'".,]+(?=[,)=])/g,
		 '$1',
	  )
	  .replace(/\?\s*(?=[,)=])/g, '');
 }
 
 export async function runCodeAndLogicTask(
	code: string,
	codeChecks: CodePatternCheck[],
	tests: LogicTest[],
	isTypeScript = false,
 ): Promise<RunOutcome> {
	const patternResults: TestResultItem[] = codeChecks.map((chk) => {
	  try {
		 const regex = new RegExp(chk.pattern, chk.flags ?? 'm');
		 const matched = regex.test(code);
		 const passed = chk.mustNotMatch ? !matched : matched;
		 return {
			name: chk.name,
			passed,
			expected: chk.expectedHint,
			received: passed ? 'Найдено в коде ✔' : 'Не найдено в коде',
		 };
	  } catch {
		 return {
			name: chk.name,
			passed: false,
			expected: chk.expectedHint,
			received: 'Ошибка шаблона',
		 };
	  }
	});
 
	if (tests.length === 0) {
	  const allPassed =
		 patternResults.length > 0 && patternResults.every((r) => r.passed);
	  return { results: patternResults, allPassed };
	}
 
	const executableJs = isTypeScript ? stripTypeScriptAnnotations(code) : code;
	const workerOutcome = await runLogicTask(executableJs, tests);
	const combined = [...patternResults, ...workerOutcome.results];
	const allPassed = combined.length > 0 && combined.every((r) => r.passed);
 
	return {
	  results: combined,
	  allPassed,
	  timedOut: workerOutcome.timedOut,
	};
 }
 
 export async function runCustomTaskCall(
	code: string,
	customCall: string,
	isTypeScript = false,
 ): Promise<CustomRunOutcome> {
	const executableJs = isTypeScript ? stripTypeScriptAnnotations(code) : code;
	return runCustomLogicCall(executableJs, customCall);
 }