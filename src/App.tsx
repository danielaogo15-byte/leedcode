import { Button } from '@/components/ui/button';

function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-8 text-foreground">
      <div className="max-w-lg space-y-3 text-center">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Шаг 1 · каркас
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Личный тренажёр по программированию
        </h1>
        <p className="text-muted-foreground">
          Vite, React, TypeScript, Tailwind и shadcn/ui подключены. Дальше
          появятся список задач, редактор и тесты.
        </p>
      </div>
      <Button type="button">Каркас готов</Button>
    </main>
  );
}

export default App;
