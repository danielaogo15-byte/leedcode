type PreviewPaneProps = {
  html: string;
  css: string;
  fixture: string;
};

export function PreviewPane({ html, css, fixture }: PreviewPaneProps) {
  const markup = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>${css}</style>
  </head>
  <body>
    ${fixture || html}
  </body>
</html>`;

  return (
    <section className="flex min-h-0 w-full flex-col gap-2 lg:w-[min(40%,28rem)]">
      <h2 className="text-sm font-medium">Превью</h2>
      <iframe
        title="Превью задачи"
        sandbox=""
        srcDoc={markup}
        className="min-h-48 flex-1 rounded-lg border border-border bg-white"
      />
      <p className="text-xs text-muted-foreground">
        iframe без allow-same-origin: страница видна, доступ к ней из приложения
        закрыт. Проверки через postMessage появятся в шаге 4.
      </p>
    </section>
  );
}
