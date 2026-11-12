import type { Level } from '@/types/track';

export type TerminalStep = {
  expect: string;
  output: string;
  hint: string;
  promptDir?: string;
};

export type TerminalRitual = {
  id: string;
  title: string;
  level: Level;
  description: string;
  stack: string[];
  steps: TerminalStep[];
};