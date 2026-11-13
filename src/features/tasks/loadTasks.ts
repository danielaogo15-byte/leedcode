import type { Task, TaskJson } from '@/types/task';
import type { Level, TrackId } from '@/types/track';

const rawModules = import.meta.glob<{ default: TaskJson }>(
  ['/content/layout/*.json', '/content/logic/*.json'],
  { eager: true },
);

function normalizeTask(raw: TaskJson): Task {
  return {
    id: raw.id,
    title: raw.title,
    track: raw.track,
    level: raw.level,
    isBoss: raw.isBoss,
    topic: raw.topic,
    mapTopics: raw.mapTopics,
    learn: raw.learn,
    needsDom: raw.track === 'layout' ? true : Boolean(raw.needsDom),
    codeLanguage:
      raw.codeLanguage ?? (raw.track === 'layout' ? 'css' : 'javascript'),
    prompt: raw.prompt,
    specs: raw.specs ?? [],
    starterHtml: raw.starterHtml ?? '',
    starterCss: raw.starterCss ?? '',
    starterJs: raw.starterJs ?? '',
    targetHtml: raw.targetHtml ?? '',
    targetCss: raw.targetCss ?? '',
    htmlFixture: raw.htmlFixture ?? '',
    hints: raw.hints,
    tests: raw.tests ?? [],
    codeChecks: raw.codeChecks ?? [],
    checks: raw.checks ?? [],
    solution: raw.solution,
    solved: false,
  };
}

export const ALL_TASKS: Task[] = Object.values(rawModules)
  .map((mod) => normalizeTask(mod.default))
  .sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    if (a.isBoss !== b.isBoss) return a.isBoss ? 1 : -1;
    return a.id.localeCompare(b.id);
  });

export function tasksFor(track: TrackId, level: Level): Task[] {
  return ALL_TASKS.filter(
    (task) => task.track === track && task.level === level,
  );
}