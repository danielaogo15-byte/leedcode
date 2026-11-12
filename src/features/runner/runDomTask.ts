import { compileTailwindFromHtml } from '@/features/runner/tailwindRuntime';
import type { RunOutcome, TestResultItem } from '@/types/runner';
import type { TaskCheck } from '@/types/task';

type Params = {
  html: string;
  css: string;
  js: string;
  checks: TaskCheck[];
  timeoutMs?: number;
};

export function runDomTask({
  html,
  css,
  js,
  checks,
  timeoutMs = 3000,
}: Params): Promise<RunOutcome> {
  return new Promise((resolve) => {
    const runId = `run-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.style.position = 'fixed';
    iframe.style.left = '0';
    iframe.style.top = '0';
    iframe.style.width = '1024px';
    iframe.style.height = '768px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-1';
    iframe.style.border = '0';

    const cleanup = () => {
      window.removeEventListener('message', onMessage);
      iframe.remove();
    };

    const timer = window.setTimeout(() => {
      cleanup();
      const results: TestResultItem[] = checks.map((c) => ({
        name: c.name,
        passed: false,
        expected: 'Выполнение до 3 сек',
        received: 'Таймаут проверки в iframe',
      }));
      resolve({ results, allPassed: false, timedOut: true });
    }, timeoutMs);

    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (!data || data.source !== 'dojo-iframe-runner' || data.runId !== runId) {
        return;
      }
      window.clearTimeout(timer);
      cleanup();
      const results: TestResultItem[] = data.results;
      const allPassed =
        results.length > 0 && results.every((item) => item.passed);
      resolve({ results, allPassed });
    }

    window.addEventListener('message', onMessage);

    const serializedChecks = JSON.stringify(checks);
    const escapedUserJs = JSON.stringify(js);
    const twCss = compileTailwindFromHtml(html);

    iframe.srcdoc = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 16px; padding: 0; font-family: system-ui, sans-serif; }
    ${twCss}
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    (function() {
      const runId = ${JSON.stringify(runId)};
      const checks = ${serializedChecks};
      const userJs = ${escapedUserJs};
      let runtimeError = null;

      if (userJs && userJs.trim().length > 0) {
        try {
          const fn = new Function(userJs);
          fn();
        } catch (err) {
          runtimeError = err && err.message ? err.message : String(err);
        }
      }

      function runChecks() {
        const results = checks.map((check) => {
          if (runtimeError) {
            return {
              name: check.name,
              passed: false,
              expected: 'Без ошибок JS',
              received: 'Ошибка: ' + runtimeError,
            };
          }

          if (check.type === 'selector') {
            const count = document.querySelectorAll(check.selector).length;
            const min = check.minCount || 1;
            return {
              name: check.name,
              passed: count >= min,
              expected: '>= ' + min + ' (' + check.selector + ')',
              received: 'Найдено: ' + count,
            };
          }

          if (check.type === 'computedStyle') {
            const el = document.querySelector(check.selector);
            if (!el) {
              return {
                name: check.name,
                passed: false,
                expected: check.expected,
                received: 'Элемент ' + check.selector + ' не найден',
              };
            }
            const actual = String(window.getComputedStyle(el)[check.property] || '').trim();
            return {
              name: check.name,
              passed: actual === check.expected,
              expected: check.expected,
              received: actual || 'пусто',
            };
          }

          if (check.type === 'boundingRect') {
            const el = document.querySelector(check.selector);
            if (!el) {
              return {
                name: check.name,
                passed: false,
                expected: String(check.expected) + 'px',
                received: 'Элемент ' + check.selector + ' не найден',
              };
            }
            const rect = el.getBoundingClientRect();
            const rawVal = rect[check.property] || el.offsetWidth || 0;
            const actual = Math.round(Number(rawVal));
            const diff = Math.abs(actual - check.expected);
            return {
              name: check.name,
              passed: diff <= check.tolerance,
              expected: check.expected + 'px (±' + check.tolerance + 'px)',
              received: actual + 'px',
            };
          }

          if (check.type === 'domAction') {
            const clickEl = document.querySelector(check.clickSelector);
            const targetEl = document.querySelector(check.targetSelector);
            if (!clickEl || !targetEl) {
              return {
                name: check.name,
                passed: false,
                expected: 'класс ' + check.expectHasClass,
                received: 'Элемент не найден',
              };
            }
            clickEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            const hasClass = targetEl.classList.contains(check.expectHasClass);
            return {
              name: check.name,
              passed: hasClass,
              expected: 'есть класс "' + check.expectHasClass + '"',
              received: hasClass
                ? 'есть класс "' + check.expectHasClass + '"'
                : 'классы: "' + targetEl.className + '"',
            };
          }

          return {
            name: 'Неизвестная проверка',
            passed: false,
            expected: '-',
            received: '-',
          };
        });

        parent.postMessage(
          { source: 'dojo-iframe-runner', runId: runId, results: results },
          '*'
        );
      }

      requestAnimationFrame(() => {
        setTimeout(runChecks, 20);
      });
    })();
  </script>
</body>
</html>`;

    document.body.appendChild(iframe);
  });
}