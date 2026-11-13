import { compileTailwindFromHtml } from '@/features/runner/tailwindRuntime';
import { Columns2, Eye, Layers, Sparkles, SunMoon } from 'lucide-react';
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
  const twCss = compileTailwindFromHtml(markup);
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
    ${twCss}
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
  const [diffMode, setDiffMode] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [onionSkin, setOnionSkin] = useState(false);

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
    <section className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Eye className="size-4 text-sky-400" />
          Визуальная проверка
        </span>

        <div className="flex items-center gap-1.5">
          {hasTarget ? (
            <button
              type="button"
              onClick={() => setDiffMode((prev) => !prev)}
              className={
                diffMode
                  ? 'inline-flex items-center gap-1.5 rounded-md border border-sky-500 bg-sky-500/15 px-2.5 py-1 text-xs font-semibold text-sky-400'
                  : 'inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground'
              }
              title="Сравнить твой результат с эталоном наложением (как в CSSBattle)"
            >
              <Columns2 className="size-3.5" />
              {diffMode ? 'Раздельно' : 'Шторка Diff'}
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setDarkCanvas((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <SunMoon className="size-3.5" />
            {darkCanvas ? 'Тёмный холст' : 'Светлый холст'}
          </button>
        </div>
      </div>

      {hasTarget && diffMode ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-sky-500/40 bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sky-400">
                Шторка: {sliderPos}%
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="h-1.5 w-28 cursor-pointer accent-sky-400"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnionSkin((prev) => !prev)}
              className={
                onionSkin
                  ? 'inline-flex items-center gap-1 rounded border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300'
                  : 'inline-flex items-center gap-1 rounded border border-border bg-background/60 px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground'
              }
            >
              <Layers className="size-3" />
              {onionSkin ? 'Прозрачность 50%' : 'Прозрачность 100%'}
            </button>
          </div>

          <div className="relative min-h-[20rem] flex-1 overflow-hidden">
            <iframe
              title="Эталон подложка"
              sandbox="allow-scripts"
              srcDoc={targetSrcDoc}
              className="absolute inset-0 h-full w-full border-0"
            />
            <iframe
              title="Твой результат поверх эталона"
              sandbox="allow-scripts"
              srcDoc={userSrcDoc}
              style={{
                clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                opacity: onionSkin ? 0.55 : 1,
              }}
              className="absolute inset-0 h-full w-full border-0 transition-opacity"
            />
            <div
              style={{ left: `${sliderPos}%` }}
              className="pointer-events-none absolute inset-y-0 w-0.5 bg-sky-400 shadow-[0_0_8px_#38bdf8]"
            />
          </div>

          <div className="flex justify-between border-t border-border bg-muted/20 px-3 py-1 text-[11px] text-muted-foreground">
            <span>← Слева: Твой результат</span>
            <span>Справа: Эталон →</span>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          {hasTarget ? (
            <div className="flex min-h-[10.5rem] flex-1 flex-col overflow-hidden rounded-xl border border-emerald-500/30 bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 dark:text-emerald-300">
                  <Sparkles className="size-3.5" />
                  Эталон · Повтори этот образец
                </span>
                <span className="text-[11px] text-emerald-500/70 dark:text-emerald-300/70">
                  Образец
                </span>
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
      )}
    </section>
  );
}