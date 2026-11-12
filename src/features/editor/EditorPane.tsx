import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { StubTask } from '@/features/tasks/stubTasks';

type EditorPaneProps = {
  task: StubTask;
  html: string;
  css: string;
  js: string;
  hardcore: boolean;
  onHtmlChange: (value: string) => void;
  onCssChange: (value: string) => void;
  onJsChange: (value: string) => void;
};

const editorClassName =
  'min-h-48 w-full flex-1 resize-none rounded-lg border border-input bg-zinc-950 p-3 font-mono text-sm text-zinc-100 outline-none focus-visible:ring-3 focus-visible:ring-ring/50';

export function EditorPane({
  task,
  html,
  css,
  js,
  hardcore,
  onHtmlChange,
  onCssChange,
  onJsChange,
}: EditorPaneProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Редактор</h2>
        {hardcore ? (
          <p className="text-xs text-amber-400">
            Hardcore: без автодополнения и подсказок редактора
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Пока textarea. Monaco подключим вместе с запуском кода.
          </p>
        )}
      </div>

      {task.track === 'layout' ? (
        <Tabs defaultValue="html" className="flex min-h-0 flex-1">
          <TabsList>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
          </TabsList>
          <TabsContent value="html" className="flex min-h-0 flex-col">
            <label className="sr-only" htmlFor="editor-html">
              HTML
            </label>
            <textarea
              id="editor-html"
              className={editorClassName}
              spellCheck={false}
              value={html}
              onChange={(event) => onHtmlChange(event.target.value)}
            />
          </TabsContent>
          <TabsContent value="css" className="flex min-h-0 flex-col">
            <label className="sr-only" htmlFor="editor-css">
              CSS
            </label>
            <textarea
              id="editor-css"
              className={editorClassName}
              spellCheck={false}
              value={css}
              onChange={(event) => onCssChange(event.target.value)}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          {task.needsDom ? (
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                HTML-заготовка · только чтение
              </p>
              <pre className="max-h-28 overflow-auto rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs">
                {task.htmlFixture}
              </pre>
            </div>
          ) : null}
          <label className="sr-only" htmlFor="editor-js">
            JavaScript
          </label>
          <textarea
            id="editor-js"
            className={editorClassName}
            spellCheck={false}
            value={js}
            onChange={(event) => onJsChange(event.target.value)}
          />
        </div>
      )}
    </section>
  );
}
