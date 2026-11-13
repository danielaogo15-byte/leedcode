import type { Level, TrackId } from '@/types/track';

export type HintTier = 1 | 2 | 3;

export type TaskHint = {
  tier: HintTier;
  text: string;
};

export type CodeLanguage =
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'sql'
  | 'dockerfile'
  | 'yaml'
  | 'prisma'
  | 'nginx'
  | 'tailwind';

export type LogicTest = {
  name: string;
  call: string;
  expected: unknown;
};

export type CodePatternCheck = {
  name: string;
  pattern: string;
  flags?: string;
  mustNotMatch?: boolean;
  expectedHint: string;
};

export type SelectorCheck = {
  type: 'selector';
  name: string;
  selector: string;
  minCount?: number;
};

export type ComputedStyleCheck = {
  type: 'computedStyle';
  name: string;
  selector: string;
  property: string;
  expected: string;
  viewportWidth?: number;
};

export type BoundingRectCheck = {
  type: 'boundingRect';
  name: string;
  selector: string;
  property: 'width' | 'height' | 'top' | 'left' | 'right' | 'bottom';
  expected: number;
  tolerance: number;
  viewportWidth?: number;
};

export type DomActionCheck = {
  type: 'domAction';
  name: string;
  clickSelector: string;
  targetSelector: string;
  expectHasClass: string;
};

export type TaskCheck =
  | SelectorCheck
  | ComputedStyleCheck
  | BoundingRectCheck
  | DomActionCheck;

export type TaskJson = {
  id: string;
  title: string;
  track: TrackId;
  level: Level;
  isBoss: boolean;
  topic: string;
  mapTopics: string[];
  learn: string;
  needsDom: boolean;
  codeLanguage?: CodeLanguage;
  prompt: string;
  specs?: string[];
  starterHtml?: string;
  starterCss?: string;
  starterJs?: string;
  targetHtml?: string;
  targetCss?: string;
  htmlFixture?: string;
  hints: [TaskHint, TaskHint, TaskHint];
  tests?: LogicTest[];
  codeChecks?: CodePatternCheck[];
  checks?: TaskCheck[];
  solution: string;
};

export type Task = Required<
  Pick<
    TaskJson,
    | 'id'
    | 'title'
    | 'track'
    | 'level'
    | 'isBoss'
    | 'topic'
    | 'mapTopics'
    | 'learn'
    | 'needsDom'
    | 'codeLanguage'
    | 'prompt'
    | 'specs'
    | 'starterHtml'
    | 'starterCss'
    | 'starterJs'
    | 'targetHtml'
    | 'targetCss'
    | 'htmlFixture'
    | 'hints'
    | 'solution'
  >
> & {
  tests: LogicTest[];
  codeChecks: CodePatternCheck[];
  checks: TaskCheck[];
  solved: boolean;
};