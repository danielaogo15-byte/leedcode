import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LazyMonaco } from '@/features/editor/LazyMonaco';
import {
  createPasteGuardState,
  type PasteGuardState,
} from '@/features/editor/pasteGuard';
import type { Task } from '@/types/task';
import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  task: Task;
  html: string;
  css: string;
  js: string;
  hardcore: boolean;
  onHtmlChange: (value: string) => void;
  onCssChange: (value: string) => void;
  onJsChange: (value: string) => void;
  onResetCode?: () => void;
  onSuspiciousSpeedChange?: (suspicious: boolean) => void;
};

export function EditorPane({
  task,
  html,
  css,
  js,
  hardcore,
  onHtmlChange,
  onCssChange,
  onJsChange,
  onResetCode,
  onSuspiciousSpeedChange,
}: Props) {
  const [guardState, setGuardState] = useState<PasteGuardState>(() =>
    createPasteGuardState(),
  );

  useEffect(() => {
    const fresh = createPasteGuardState();
    setGuardState(fresh);
    onSuspiciousSpeedChange?.(false);
  }, [task.id, onSuspiciousSpeedChange]);

  const handleGuardUpdate = (next: PasteGuardState) => {
    setGuardState(next);
    onSuspiciousSpeedChange?.(next.suspiciousSpeed);
  };

  return (
    <section className="mt-2 flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Редактор</h3>
          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
            Автосохранение включено
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {hardcore
              ? 'Hardcore: без подсказок'
              : 'Monaco · внешняя вставка заблокирована'}
          </span>
          {onResetCode ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResetCode}
              className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
              title="Вернуть стартовый код задачи"
            >
              <RotateCcw className="size-3.5" />
              Сбросить код
            </Button>
          ) : null}
        </div>
      </div>

      {guardState.blockedAttemptMessage ? (
        <p className="rounded border border-destructive/50 bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
          {guardState.blockedAttemptMessage}
        </p>
      ) : null}

      {guardState.suspiciousSpeed ? (
        <p className="rounded border border-amber-500/50 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300">
          Подозрительно высокая скорость ввода — XP за эту попытку не начислится.
        </p>
      ) : null}

      {task.track === 'layout' ? (
        <Tabs defaultValue="html" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="w-fit">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
          </TabsList>
          <TabsContent value="html" className="mt-3.5 flex min-h-0 flex-1">
            <LazyMonaco
              language="html"
              value={html}
              hardcore={hardcore}
              guardState={guardState}
              onGuardStateChange={handleGuardUpdate}
              onChange={onHtmlChange}
            />
          </TabsContent>
          <TabsContent value="css" className="mt-3.5 flex min-h-0 flex-1">
            <LazyMonaco
              language="css"
              value={css}
              hardcore={hardcore}
              guardState={guardState}
              onGuardStateChange={handleGuardUpdate}
              onChange={onCssChange}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="mt-2 flex min-h-0 flex-1 flex-col gap-3">
          {task.needsDom && task.htmlFixture ? (
            <div className="rounded border border-border bg-muted/30 p-2 font-mono text-xs text-muted-foreground">
              <span className="mb-1 block font-sans text-[11px] uppercase">
                Фиксированный HTML (только для чтения):
              </span>
              {task.htmlFixture.trim()}
            </div>
          ) : null}
          <LazyMonaco
            language="javascript"
            value={js}
            hardcore={hardcore}
            guardState={guardState}
            onGuardStateChange={handleGuardUpdate}
            onChange={onJsChange}
          />
        </div>
      )}
    </section>
  );
}