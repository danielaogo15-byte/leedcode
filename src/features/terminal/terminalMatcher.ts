import type { TerminalRitual } from '@/types/terminal';

const rawRituals = import.meta.glob<{ default: TerminalRitual }>(
  '/content/terminal/*.json',
  { eager: true },
);

export const ALL_RITUALS: TerminalRitual[] = Object.values(rawRituals)
  .map((m) => m.default)
  .sort((a, b) => a.id.localeCompare(b.id));

export function matchTerminalCommand(
  userInput: string,
  expectPattern: string,
): boolean {
  const cleaned = userInput.trim().replace(/\s+/g, ' ');
  if (!cleaned) return false;

  const trimmedExpect = expectPattern.trim();

  // Если шаблон начинается с ^ или содержит регулярную конструкцию
  if (
    trimmedExpect.startsWith('^') ||
    trimmedExpect.includes('\\s') ||
    trimmedExpect.includes('(')
  ) {
    try {
      const regex = new RegExp(trimmedExpect);
      return regex.test(cleaned);
    } catch {
      return cleaned === trimmedExpect;
    }
  }

  return cleaned === trimmedExpect.replace(/\s+/g, ' ');
}