import { Eye, Sparkles, SunMoon } from 'lucide-react';
import { useMemo, useState } from 'react';

type Props = {
  html: string;
  css: string;
  js?: string;
  fixture?: string;
  targetHtml?: string;
  targetCss?: string;
};

function buildSrcDoc(
  markup: string,
  styles: string,
  script: string,
  darkCanvas: boolean,
) {
  const bg = darkCanvas ? '#090d16' : '#f8fafc';
  const dot = darkCanvas ? '#1e293b' : '#cbd5e1';
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: 'Geist Variable', system-ui, -apple-system, sans-serif;
      background-color: ${bg};
      background-image: radial-gradient(${dot} 1px, transparent 1px);
      background-size: 16px 16px;
      color: ${darkCanvas ? '#f8fafc' : '#0f172a'};
    }
    ${styles}
  </style>
</head>
<body>
  ${markup}
  <script>
    try {
      ${script}
    } catch (err) {
      console.error(err);
    }
  </script>
</body>
</html>`;
}

export function PreviewPane({
  html,
  css,
  js = '',
  fixture = '',
  targetHtml = '',
  targetCss = '',
}: Props) {
  const [darkCanvas, setDarkCanvas] = useState(false);

  const hasTarget = Boolean(targetHtml.trim() || targetCss.trim());

  const userSrcDoc = useMemo(
    () => buildSrcDoc(fixture ? fixture : html, css, js, darkCanvas),
    [html, css, js, fixture, darkCanvas],
  );

  const targetSrcDoc = useMemo(
    () => buildSrcDoc(targetHtml, targetCss, '', darkCanvas),
    [targetHtml, targetCss, darkCanvas],
  );

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3 lg:max-w-md">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Eye className="size-4 text-sky-400" />
          Визуальная проверка
        </span>
        <button
          type="button"
          onClick={() => setDarkCanvas((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <SunMoon className="size-3.5" />
          {darkCanvas ? 'Тёмный холст' : 'Светлый холст'}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {hasTarget ? (
          <div className="flex min-h-[10.5rem] flex-1 flex-col overflow-hidden rounded-xl border border-emerald-500/30 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <Sparkles className="size-3.5" />
                Эталон · Повтори этот образец
              </span>
              <span className="text-[11px] text-emerald-300/70">Образец</span>
            </div>
            <iframe
              title="Эталон задачи"
              sandbox="allow-scripts"
              srcDoc={targetSrcDoc}
              className="w-full flex-1 border-0"
            />
          </div>
        ) : null}

        <div className="flex min-h-[10.5rem] flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
            <span className="text-xs font-semibold text-foreground">
              Твой результат (живое превью)
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              sandbox
            </span>
          </div>
          <iframe
            title="Превью задачи"
            sandbox="allow-scripts"
            srcDoc={userSrcDoc}
            className="w-full flex-1 border-0"
          />
        </div>
      </div>
    </section>
  );
}