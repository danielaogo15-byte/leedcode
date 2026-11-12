import type { Task } from '@/types/task';

const DRAFTS_STORAGE_KEY = 'vibedojo:code-drafts:v1';
const SOLVED_STORAGE_KEY = 'vibedojo:solved-tasks:v1';

export type TaskDraft = {
  html: string;
  css: string;
  js: string;
  updatedAt: number;
};

type DraftMap = Record<string, TaskDraft>;

function readAllDrafts(): DraftMap {
  try {
    const raw = window.localStorage.getItem(DRAFTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DraftMap) : {};
  } catch {
    return {};
  }
}

export function loadTaskDraft(task: Task): TaskDraft {
  const all = readAllDrafts();
  const saved = all[task.id];
  if (saved) {
    return saved;
  }
  return {
    html: task.starterHtml,
    css: task.starterCss,
    js: task.starterJs,
    updatedAt: 0,
  };
}

export function saveTaskDraft(
  taskId: string,
  draft: Omit<TaskDraft, 'updatedAt'>,
): void {
  try {
    const all = readAllDrafts();
    all[taskId] = {
      ...draft,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Игнорируем переполнение квоты в приватном режиме
  }
}

export function clearTaskDraft(task: Task): TaskDraft {
  try {
    const all = readAllDrafts();
    delete all[task.id];
    window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
  return {
    html: task.starterHtml,
    css: task.starterCss,
    js: task.starterJs,
    updatedAt: 0,
  };
}

export function loadSolvedMap(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(SOLVED_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function saveSolvedMap(map: Record<string, boolean>): void {
  try {
    window.localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}