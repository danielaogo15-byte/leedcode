import type { Task } from '@/types/task';

export const MOCK_DURATION_SEC = 30 * 60; // 30 минут
export const MOCK_BONUS_XP = 75;

export type BuggyCodePayload = {
  html: string;
  css: string;
  js: string;
  bugHint: string;
};

export function injectBugIntoTask(task: Task): BuggyCodePayload {
  if (task.track === 'layout') {
    const isTailwindOnly =
      task.codeLanguage === 'tailwind' && !task.starterCss.trim();

    if (isTailwindOnly) {
      let buggyHtml = task.targetHtml || task.solution;
      let bugHint =
        'В разметке Tailwind CSS допущена ошибка в одном из утилитарных классов.';

      if (buggyHtml.includes('justify-between')) {
        buggyHtml = buggyHtml.replace('justify-between', 'justify-start');
        bugHint =
          'Баг в Tailwind: вместо разноса элементов по краям стоит класс прижатия к началу.';
      } else if (buggyHtml.includes('grid-cols-2')) {
        buggyHtml = buggyHtml.replace('grid-cols-2', 'grid-cols-1');
        bugHint =
          'Баг в сетке Tailwind: вместо двух колонок указана одна (grid-cols-1).';
      } else if (buggyHtml.includes('grid-cols-3')) {
        buggyHtml = buggyHtml.replace('grid-cols-3', 'grid-cols-2');
        bugHint =
          'Баг в сетке Tailwind: неверное число колонок в классе grid-cols-*.';
      } else if (buggyHtml.includes('items-center')) {
        buggyHtml = buggyHtml.replace('items-center', 'items-start');
        bugHint =
          'Баг выравнивания: вместо центрирования по поперечной оси стоит items-start.';
      }

      return {
        html: buggyHtml,
        css: '',
        js: task.starterJs,
        bugHint,
      };
    }

    const baseHtml = task.targetHtml || task.starterHtml;
    let buggyCss = task.targetCss || task.solution;
    let bugHint =
      'Найди и исправь сломанное CSS-свойство или размер в макете.';

    if (buggyCss.includes('space-between')) {
      buggyCss = buggyCss.replace('space-between', 'flex-start');
      bugHint =
        'Баг в выравнивании: элементы сбились к началу контейнера вместо разноса по краям.';
    } else if (buggyCss.includes('1fr 1fr')) {
      buggyCss = buggyCss.replace('1fr 1fr', '1fr');
      bugHint =
        'Баг в сетке CSS Grid: вместо нескольких колонок осталась только одна.';
    } else if (buggyCss.includes('center')) {
      buggyCss = buggyCss.replace('center', 'flex-start');
      bugHint = 'Баг центрирования: сбилось свойство выравнивания по оси.';
    } else if (/\d+px/.test(buggyCss)) {
      buggyCss = buggyCss.replace(
        /(\d+)px/,
        (_, num) => `${Math.max(2, Number(num) - 10)}px`,
      );
      bugHint =
        'Баг в размерах/отступах: одно из значений в пикселях отличается от спецификации на 10px.';
    }

    return {
      html: baseHtml,
      css: buggyCss,
      js: task.starterJs,
      bugHint,
    };
  }

  let buggyJs = task.solution;
  let bugHint =
    'В коде допущена ошибка в синтаксисе, условии или параметре конфигурации — найди и исправь её.';

  if (buggyJs.includes('=== 0')) {
    buggyJs = buggyJs.replace('=== 0', '!== 0');
    bugHint =
      'Баг в условии проверки: инвертирован оператор сравнения с нулём.';
  } else if (buggyJs.includes('>=')) {
    buggyJs = buggyJs.replace('>=', '>');
    bugHint = 'Пограничный баг (off-by-one): строгий оператор `>` вместо `>=`.';
  } else if (buggyJs.includes('status_code=201')) {
    buggyJs = buggyJs.replace('status_code=201', 'status_code=200');
    bugHint =
      'Баг в декораторе FastAPI: указан неверный HTTP-код успешного создания ресурса.';
  } else if (buggyJs.includes('--frozen-lockfile')) {
    buggyJs = buggyJs.replace('--frozen-lockfile', '--no-frozen-lockfile');
    bugHint =
      'Баг в CI/Docker: отключён строгий режим проверки pnpm-lock.yaml.';
  } else if (buggyJs.includes('GROUP BY status')) {
    buggyJs = buggyJs.replace('GROUP BY status', 'GROUP BY amount');
    bugHint = 'Баг в SQL-запросе: группировка идёт по неверной колонке.';
  } else if (buggyJs.includes('return ')) {
    buggyJs = buggyJs.replace(
      /return\s+([^;\n]+);?/,
      'return null; // Баг: исправь возвращаемое значение ($1)',
    );
    bugHint = 'Функция возвращает null вместо ожидаемого результата.';
  }

  return {
    html: task.starterHtml,
    css: task.starterCss,
    js: buggyJs,
    bugHint,
  };
}

export function pickMockAssessmentTasks(allTasks: Task[]): Task[] {
  const layouts = allTasks.filter((t) => t.track === 'layout');
  const logics = allTasks.filter((t) => t.track === 'logic');

  const shuffle = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i]!;
      copy[i] = copy[j]!;
      copy[j] = tmp;
    }
    return copy;
  };

  const pickedLayouts = shuffle(layouts).slice(0, 1);
  const pickedLogics = shuffle(logics).slice(0, 2);
  return [...pickedLayouts, ...pickedLogics];
}