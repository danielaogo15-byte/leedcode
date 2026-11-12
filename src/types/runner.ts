export type TestResultItem = {
	name: string;
	passed: boolean;
	expected: string;
	received: string;
	logs?: string[];
	durationMs?: number;
 };
 
 export type RunOutcome = {
	results: TestResultItem[];
	allPassed: boolean;
	timedOut?: boolean;
 };
 
 export type CustomRunOutcome = {
	call: string;
	output: string;
	logs: string[];
	isError: boolean;
	durationMs: number;
	timedOut?: boolean;
 };