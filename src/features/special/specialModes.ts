import type { Task } from '@/types/task';

export const MOCK_DURATION_SEC = 30 * 60;
export const MOCK_BONUS_XP = 75;

export type BuggyCodePayload = {
  html: string;
  css: string;
  js: string;
  bugHint: string;
};

type BugRule = {
  match: string | RegExp;
  replace: string;
  hint: string;
};

const CSS_RULES: BugRule[] = [
  {
    match: 'position: relative',
    replace: 'position: static',
    hint: 'Абсолютно спозиционированный элемент «улетел» к краю страницы — проверь позиционирование родителя.',
  },
  {
    match: 'min-width: 0',
    replace: 'min-width: auto',
    hint: 'Элемент внутри флекс-контейнера отказывается сжиматься меньше своего содержимого.',
  },
  {
    match: 'grid-column: span 2',
    replace: 'grid-column: span 1',
    hint: 'Акцентная карточка занимает одну колонку сетки вместо двух.',
  },
  {
    match: 'grid-template-rows: auto 1fr auto',
    replace: 'grid-template-rows: auto auto auto',
    hint: 'Центральная строка сетки не растягивается на всю свободную высоту контейнера.',
  },
  {
    match: 'space-between',
    replace: 'flex-start',
    hint: 'Элементы сбились к началу контейнера вместо разноса по краям.',
  },
  {
    match: '1fr 1fr',
    replace: '1fr',
    hint: 'В сетке CSS Grid вместо нескольких колонок осталась только одна.',
  },
  {
    match: 'center',
    replace: 'flex-start',
    hint: 'Сбилось выравнивание элементов по центру оси.',
  },
];

const JS_RULES: BugRule[] = [
  {
    match: '??',
    replace: '||',
    hint: 'Оператор || считает число 0 или пустую строку ложными и подменяет их значением по умолчанию.',
  },
  {
    match: '[...items]',
    replace: 'items',
    hint: 'Операция мутирует исходный массив напрямую вместо создания копии.',
  },
  {
    match: '[...list]',
    replace: 'list',
    hint: 'Удаление элемента во время итерации по живому массиву сбивает индексы соседних элементов.',
  },
  {
    match: 'Object.hasOwn(out, key)',
    replace: 'Boolean(out[key])',
    hint: 'Проверка через out[key] находит унаследованные методы прототипа вроде "toString".',
  },
  {
    match: 'cache.has(arg)',
    replace: 'Boolean(cache.get(arg))',
    hint: 'Проверка значения вместо наличия ключа не кэширует вызовы, вернувшие undefined или 0.',
  },
  {
    match: '!called',
    replace: 'cached === undefined',
    hint: 'Если функция в первый раз вернула undefined, проверка cached === undefined запустит её повторно.',
  },
  {
    match: 'current = initial',
    replace: 'current = 0',
    hint: 'При сбросе возвращается 0 вместо переданного начального значения initial.',
  },
  {
    match: '% 2 === 0',
    replace: '% 2 !== 0',
    hint: 'Инвертировано условие проверки чётности.',
  },
  {
    match: 'classList.toggle',
    replace: 'classList.remove',
    hint: 'Класс только удаляется вместо переключения.',
  },
  {
    match: '+=',
    replace: '-=',
    hint: 'Арифметический баг: значение вычитается вместо сложения.',
  },
  {
    match: '>=',
    replace: '>',
    hint: 'Пограничный баг (off-by-one): строгий оператор `>` вместо `>=`.',
  },
];

export function injectBugIntoTask(task: Task): BuggyCodePayload {
  if (task.track === 'layout') {
    const baseHtml = task.targetHtml || task.starterHtml;
    const sourceCss = task.solution || task.targetCss;

    for (const rule of CSS_RULES) {
      if (
        typeof rule.match === 'string'
          ? sourceCss.includes(rule.match)
          : rule.match.test(sourceCss)
      ) {
        return {
          html: baseHtml,
          css: sourceCss.replace(rule.match, rule.replace),
          js: task.starterJs,
          bugHint: rule.hint,
        };
      }
    }

    if (/\d+px/.test(sourceCss)) {
      return {
        html: baseHtml,
        css: sourceCss.replace(
          /(\d+)px/,
          (_, num) => `${Math.max(2, Number(num) + 14)}px`,
        ),
        js: task.starterJs,
        bugHint:
          'Одно из числовых значений в пикселях или специфичность селектора не совпадает с макетом.',
      };
    }

    return {
      html: baseHtml,
      css: task.starterCss,
      js: task.starterJs,
      bugHint: 'Исправь CSS-правила, чтобы вёрстка совпала с эталоном.',
    };
  }

  const sourceJs = task.solution;
  for (const rule of JS_RULES) {
    if (
      typeof rule.match === 'string'
        ? sourceJs.includes(rule.match)
        : rule.match.test(sourceJs)
    ) {
      return {
        html: task.starterHtml,
        css: task.starterCss,
        js: sourceJs.replace(rule.match, rule.replace),
        bugHint: rule.hint,
      };
    }
  }

  if (sourceJs.includes('===')) {
    return {
      html: task.starterHtml,
      css: task.starterCss,
      js: sourceJs.replace('===', '!=='),
      bugHint: 'В одном из условий инвертировано строгое сравнение.',
    };
  }

  return {
    html: task.starterHtml,
    css: task.starterCss,
    js: task.starterJs,
    bugHint: 'Найди логическую ошибку в функции.',
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

  return [...shuffle(layouts).slice(0, 1), ...shuffle(logics).slice(0, 2)];
}