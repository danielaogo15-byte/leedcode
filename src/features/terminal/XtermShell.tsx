import { matchTerminalCommand } from '@/features/terminal/terminalMatcher';
import type { TerminalRitual } from '@/types/terminal';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { useEffect, useRef } from 'react';

type Props = {
  ritual: TerminalRitual;
  stepIndex: number;
  onStepIndexChange: (nextIndex: number) => void;
  onFirstInput: () => void;
  onErrorIncrement: () => void;
  onComplete: () => void;
};

export default function XtermShell({
  ritual,
  stepIndex,
  onStepIndexChange,
  onFirstInput,
  onErrorIncrement,
  onComplete,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stepRef = useRef(stepIndex);
  const startedRef = useRef(false);

  const callbacksRef = useRef({
    onStepIndexChange,
    onFirstInput,
    onErrorIncrement,
    onComplete,
  });

  useEffect(() => {
    stepRef.current = stepIndex;
  }, [stepIndex]);

  useEffect(() => {
    callbacksRef.current = {
      onStepIndexChange,
      onFirstInput,
      onErrorIncrement,
      onComplete,
    };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    startedRef.current = false;

    const term = new Terminal({
      rows: 16,
      cols: 85,
      scrollback: 1000,
      cursorBlink: true,
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      fontSize: 14,
      lineHeight: 1.3,
      theme: {
        background: '#161b26',
        foreground: '#e2e8f0',
        cursor: '#38bdf8',
        selectionBackground: '#334155',
      },
    });

    term.open(container);
    term.focus();

    let currentLine = '';

    const writePrompt = (idx: number) => {
      const step = ritual.steps[idx];
      const dir = step?.promptDir ?? '~/project';
      term.write(`\r\n\x1b[36m${dir}\x1b[0m \x1b[32m❯\x1b[0m `);
      term.scrollToBottom();
    };

    term.writeln(
      `\x1b[1;34m=== VibeCode Dojo CLI · ${ritual.title} ===\x1b[0m`,
    );
    term.writeln(
      `\x1b[90mВводи команды по шагам и нажимай Enter. Подсказка: введи ? для помощи.\x1b[0m`,
    );
    writePrompt(0);

    const disposable = term.onData((data) => {
      const idx = stepRef.current;
      if (idx >= ritual.steps.length) {
        return;
      }

      if (!startedRef.current && data.trim().length > 0) {
        startedRef.current = true;
        callbacksRef.current.onFirstInput();
      }

      for (const ch of data) {
        const code = ch.charCodeAt(0);

        if (ch === '\r') {
          term.write('\r\n');
          const trimmed = currentLine.trim();
          const currentStep = ritual.steps[idx];
          currentLine = '';

          if (!trimmed) {
            writePrompt(idx);
            continue;
          }

          if (trimmed === '?' || trimmed === 'help') {
            if (currentStep) {
              term.writeln(
                `\x1b[33m💡 Подсказка: ${currentStep.hint}\x1b[0m`,
              );
            }
            writePrompt(idx);
            continue;
          }

          if (trimmed === 'clear') {
            term.clear();
            writePrompt(idx);
            continue;
          }

          if (
            currentStep &&
            matchTerminalCommand(trimmed, currentStep.expect)
          ) {
            if (currentStep.output) {
              for (const line of currentStep.output.split('\n')) {
                term.writeln(`\x1b[37m${line}\x1b[0m`);
              }
            }
            const nextIdx = idx + 1;
            stepRef.current = nextIdx;
            callbacksRef.current.onStepIndexChange(nextIdx);

            if (nextIdx >= ritual.steps.length) {
              term.writeln(
                '\r\n\x1b[1;32m🎉 Ритуал успешно завершён! Отличная мышечная память.\x1b[0m',
              );
              term.scrollToBottom();
              callbacksRef.current.onComplete();
            } else {
              writePrompt(nextIdx);
            }
          } else {
            callbacksRef.current.onErrorIncrement();
            term.writeln(
              `\x1b[31m✖ Команда «${trimmed}» не подходит для шага ${idx + 1}/${ritual.steps.length}. Введи ? для подсказки.\x1b[0m`,
            );
            writePrompt(idx);
          }
        } else if (code === 127 || ch === '\b') {
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            term.write('\b \b');
          }
        } else if (code === 3) {
          currentLine = '';
          term.write('^C');
          writePrompt(idx);
        } else if (code >= 32) {
          currentLine += ch;
          term.write(ch);
          term.scrollToBottom();
        }
      }
    });

    return () => {
      disposable.dispose();
      term.dispose();
    };
  }, [ritual]);

  return (
    <div
      onClick={() => containerRef.current?.querySelector('textarea')?.focus()}
      className="w-full overflow-x-auto rounded-xl border border-border bg-[#161b26] p-3 shadow-inner"
    >
      <div ref={containerRef} className="w-full" />
    </div>
  );
}