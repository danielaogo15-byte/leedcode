import { ALL_TASKS, tasksFor } from '@/features/tasks/loadTasks';
import type { Task } from '@/types/task';
import type { Level } from '@/types/track';

export type StubTask = Task;
export const STUB_UNLOCKED_LEVEL: Level = 1;
export const STUB_TASKS: Task[] = ALL_TASKS;
export { tasksFor };