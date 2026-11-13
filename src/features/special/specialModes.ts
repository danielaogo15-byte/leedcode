import type { Task } from '@/types/task';

export const MOCK_DURATION_SEC = 30 * 60; // 30 минут
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

const LAYOUT_TAILWIND_RULES: BugRule[] = [
  {
    match: 'justify-between',
    replace: 'justify-start',
    hint: 'Баг в Tailwind: вместо разноса элементов по краям (justify-between) стоит прижатие к началу (justify-start).',
  },
  {
    match: 'justify-end',
    replace: 'justify-start',
    hint: 'Баг в Tailwind: кнопки прижаты влево (justify-start) вместо правого края (justify-end).',
  },
  {
    match: 'grid-cols-2',
    replace: 'grid-cols-1',
    hint: 'Баг в сетке Tailwind: вместо двух колонок указана одна (grid-cols-1).',
  },
  {
    match: 'grid-cols-3',
    replace: 'grid-cols-2',
    hint: 'Баг в сетке Tailwind: вместо трёх колонок указаны только две (grid-cols-2).',
  },
  {
    match: 'grid-cols-[120px_1fr]',
    replace: 'grid-cols-[70px_1fr]',
    hint: 'Баг ширины первой колонки в grid-cols-[...]: указано 70px вместо 120px по спецификации.',
  },
  {
    match: 'grid-cols-[140px_1fr]',
    replace: 'grid-cols-[90px_1fr]',
    hint: 'Баг ширины сайдбара в grid-cols-[...]: указано 90px вместо 140px.',
  },
  {
    match: 'grid-cols-[60px_1fr_90px]',
    replace: 'grid-cols-[40px_1fr_60px]',
    hint: 'Баг размеров колонок в grid-cols-[...]: проверь точные значения в пикселях по ТЗ.',
  },
  {
    match: 'grid-cols-[80px_1fr_100px]',
    replace: 'grid-cols-[50px_1fr_70px]',
    hint: 'Баг размеров колонок таблицы в grid-cols-[...]: сверь ширину колонок со спецификацией.',
  },
  {
    match: 'items-center',
    replace: 'items-start',
    hint: 'Баг выравнивания: вместо вертикального центрирования (items-center) стоит items-start.',
  },
  {
    match: 'flex-col',
    replace: 'flex-row',
    hint: 'Баг направления флекса: элементы выстроены в ряд (flex-row) вместо колонки (flex-col).',
  },
];

const LOGIC_RULES: BugRule[] = [
  // Уровень 1 (JS, DOM, Git, pnpm)
  {
    match: '% 2 === 0',
    replace: '% 2 !== 0',
    hint: 'Баг в условии чётности: оператор !== отбирает нечётные числа вместо чётных.',
  },
  {
    match: 'Math.min(max, Math.max(min, val))',
    replace: 'Math.max(max, Math.min(min, val))',
    hint: 'Перепутаны местами функции Math.min и Math.max при ограничении диапазона.',
  },
  {
    match: 'classList.toggle',
    replace: 'classList.remove',
    hint: 'DOM-баг: метод classList.remove только удаляет класс вместо переключения.',
  },
  {
    match: 'filePath === ".env"',
    replace: 'filePath === ".env.example"',
    hint: 'Баг безопасности Git: в проверке указан ".env.example" вместо секретного файла ".env".',
  },
  {
    match: '"pnpm@10.0.0"',
    replace: '"npm@10.0.0"',
    hint: 'Баг в поле packageManager: указан npm вместо требуемого pnpm@10.0.0.',
  },

  // Уровень 2 (TypeScript, Tailwind cn, Vite, ESLint, TSConfig)
  {
    match: '.join(" ")',
    replace: '.join(",")',
    hint: 'Баг склейки классов: метод join соединяет классы через запятую вместо пробела.',
  },
  {
    match: '{ ...config, ...patch }',
    replace: '{ ...patch, ...config }',
    hint: 'Баг иммутабельного патча: старый объект ...config идёт после ...patch и затирает новые поля!',
  },
  {
    match: '"@": "/src"',
    replace: '"@": "/public"',
    hint: 'Баг в конфиге Vite: алиас "@" указывает на "/public" вместо "/src".',
  },
  {
    match: '"@typescript-eslint/no-unused-vars": "error"',
    replace: '"@typescript-eslint/no-unused-vars": "off"',
    hint: 'Баг в конфиге ESLint: правило no-unused-vars отключено ("off") вместо "error".',
  },
  {
    match: 'noUncheckedIndexedAccess: true',
    replace: 'noUncheckedIndexedAccess: false',
    hint: 'Баг в tsconfig: строгий флаг noUncheckedIndexedAccess выключен (false).',
  },

  // Уровень 3 (Zustand, TanStack Query, RHF, Zod, React TSX)
  {
    match: 'state.count + 1',
    replace: 'state.count - 1',
    hint: 'Баг в сторе Zustand: экшен inc вычитает 1 вместо увеличения счётчика.',
  },
  {
    match: 'staleTime: 60000',
    replace: 'staleTime: 0',
    hint: 'Баг кэширования TanStack Query: staleTime выставлен в 0 вместо 60000.',
  },
  {
    match: 'mode: "onBlur"',
    replace: 'mode: "onSubmit"',
    hint: 'Баг конфигурации React Hook Form: в поле mode указано "onSubmit" вместо "onBlur".',
  },
  {
    match: 'z.string().min(8)',
    replace: 'z.string().min(4)',
    hint: 'Баг в схеме Zod: минимальная длина пароля .min(4) вместо требуемых 8 символов.',
  },
  {
    match: 'pro ? "default" : "secondary"',
    replace: 'pro ? "secondary" : "default"',
    hint: 'Баг в пропсах React-компонента: перепутаны местами варианты бейджа для pro.',
  },
  {
    match: 'zodResolver(LoginSchema)',
    replace: 'zodResolver( undefined as any )',
    hint: 'Баг интеграции RHF + Zod: внутрь zodResolver(...) забыли передать схему LoginSchema.',
  },

  // Уровень 4 (Next.js, Vitest, RTL, Playwright)
  {
    match: '"use server"',
    replace: '"use client"',
    hint: 'Баг в Server Action Next.js: указана директива "use client" вместо "use server".',
  },
  {
    match: '.toEqual(30)',
    replace: '.toEqual(0)',
    hint: 'Баг в тесте Vitest: в проверке toEqual указано неверное ожидаемое число.',
  },
  {
    match: 'screen.getByRole("button")',
    replace: 'screen.getByRole("heading")',
    hint: 'Баг в тесте Testing Library: поиск кнопки идёт по роли "heading" вместо "button".',
  },
  {
    match: '`${slug} | VibeDojo`',
    replace: '`${slug} - VibeDojo`',
    hint: 'Баг в generateMetadata: в шаблоне title стоит дефис вместо вертикальной черты "|".',
  },
  {
    match: 'await params',
    replace: 'params as any',
    hint: 'Баг Next.js 15: пропущено ключевое слово await перед чтением промиса params.',
  },
  {
    match: '.toHaveURL("/dashboard")',
    replace: '.toHaveURL("/login")',
    hint: 'Баг в E2E-тесте Playwright: проверяется старый адрес "/login" вместо редиректа на "/dashboard".',
  },

  // Уровень 5 (Express, Prisma, Redis, PostgreSQL, Node.js)
  {
    match: 'parts[0].toLowerCase() !== "bearer"',
    replace: 'parts[0].toLowerCase() !== "basic"',
    hint: 'Баг авторизации Express: проверяется схема "basic" вместо "bearer".',
  },
  {
    match: 'email     String   @unique',
    replace: 'email     String',
    hint: 'Баг в схеме Prisma: у поля email пропущен атрибут уникальности @unique.',
  },
  {
    match: '"EX"',
    replace: '"PX"',
    hint: 'Баг TTL в Redis: передан флаг миллисекунд "PX" вместо секунд "EX".',
  },
  {
    match: 'GROUP BY status',
    replace: 'GROUP BY amount',
    hint: 'Баг в SQL-запросе PostgreSQL: группировка GROUP BY идёт по колонке amount вместо status.',
  },
  {
    match: '"Missing DATABASE_URL"',
    replace: '"Database error"',
    hint: 'Баг валидации окружения Node.js: текст ошибки в new Error(...) не совпадает со спецификацией.',
  },
  {
    match: 'status: 429',
    replace: 'status: 500',
    hint: 'Баг в Rate Limiter: при превышении лимита возвращается статус 500 вместо 429.',
  },

  // Уровень 6 (Python, Pydantic, SQLAlchemy, Alembic, pytest, FastAPI)
  {
    match: 'Field(ge=18)',
    replace: 'Field(ge=21)',
    hint: 'Баг в модели Pydantic: для возраста указан порог ge=21 вместо ge=18.',
  },
  {
    match: 'User.role == "admin"',
    replace: 'User.role == "guest"',
    hint: 'Баг в запросе SQLAlchemy: фильтрация выбирает роль "guest" вместо "admin".',
  },
  {
    match: 'op.drop_column("users", "phone")',
    replace: 'op.drop_column("users", "id")',
    hint: 'Опасный баг в миграции Alembic: в downgrade() удаляется первичный ключ "id" вместо колонки "phone"!',
  },
  {
    match: '@pytest.mark.parametrize("price,expected"',
    replace: '@pytest.mark.parametrize("price"',
    hint: 'Баг в декораторе pytest: в строке имён параметров забыт второй аргумент ",expected".',
  },
  {
    match: '.lower()',
    replace: '.upper()',
    hint: 'Баг в списковом включении Python: метод .upper() переводит теги в верхний регистр вместо .lower().',
  },
  {
    match: 'status_code=201',
    replace: 'status_code=200',
    hint: 'Баг в декораторе FastAPI: указан status_code=200 вместо 201 Created.',
  },

  // Уровень 7 (Dockerfile, Nginx, GitHub Actions, Sentry, Linux systemd, Vercel)
  {
    match: '--frozen-lockfile',
    replace: '--no-frozen-lockfile',
    hint: 'Баг в CI/Docker: вместо строгого флага --frozen-lockfile указан --no-frozen-lockfile.',
  },
  {
    match: 'proxy_pass http://backend:8000/;',
    replace: 'proxy_pass http://backend:3000/;',
    hint: 'Баг в конфиге Nginx: в proxy_pass указан порт 3000 вместо 8000.',
  },
  {
    match: 'tracesSampleRate: env === "production" ? 0.2 : 1.0',
    replace: 'tracesSampleRate: env === "production" ? 1.0 : 0.2',
    hint: 'Баг в конфиге Sentry: перепутаны значения tracesSampleRate для production и staging.',
  },
  {
    match: 'Restart=always',
    replace: 'Restart=no',
    hint: 'Баг в юнит-файле Linux systemd: автоперезапуск сервиса отключён (Restart=no вместо Restart=always).',
  },
  {
    match: '"/api/:path*"',
    replace: '"/v1/:path*"',
    hint: 'Баг в конфиге Vercel rewrites: указан шаблон "/v1/:path*" вместо "/api/:path*".',
  },
  {
    match: '"MISSING_AWS_REGION"',
    replace: '"AWS_ERROR"',
    hint: 'Баг в аудиторе продакшена: при отсутствии региона добавляется неверный код ошибки.',
  },
  // Общие правила для оставшихся JS-задач 1 уровня
  {
    match: '+=',
    replace: '-=',
    hint: 'Арифметический баг: значение вычитается (-=) вместо накопления (+=).',
  },
  {
    match: '>=',
    replace: '>',
    hint: 'Пограничный баг (off-by-one): строгий оператор `>` вместо `>=`.',
  },
];

export function injectBugIntoTask(task: Task): BuggyCodePayload {
  if (task.track === 'layout') {
    const isTailwindOnly =
      task.codeLanguage === 'tailwind' && !task.starterCss.trim();

    if (isTailwindOnly) {
      const sourceHtml = task.targetHtml || task.solution;
      for (const rule of LAYOUT_TAILWIND_RULES) {
        if (
          typeof rule.match === 'string'
            ? sourceHtml.includes(rule.match)
            : rule.match.test(sourceHtml)
        ) {
          return {
            html: sourceHtml.replace(rule.match, rule.replace),
            css: '',
            js: task.starterJs,
            bugHint: rule.hint,
          };
        }
      }
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
        'Баг в сетке CSS Grid: вместо двух колонок осталась только одна.';
    } else if (buggyCss.includes('center')) {
      buggyCss = buggyCss.replace('center', 'flex-start');
      bugHint = 'Баг центрирования: сбилось свойство выравнивания по оси.';
    } else if (/\d+px/.test(buggyCss)) {
      buggyCss = buggyCss.replace(
        /(\d+)px/,
        (_, num) => `${Math.max(2, Number(num) - 10)}px`,
      );
      bugHint =
        'Баг в размерах/отступах: одно из значений в пикселях отличается от спецификации.';
    }

    return {
      html: baseHtml,
      css: buggyCss,
      js: task.starterJs,
      bugHint,
    };
  }

  const sourceJs = task.solution;
  for (const rule of LOGIC_RULES) {
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

  return {
    html: task.starterHtml,
    css: task.starterCss,
    js: task.starterJs,
    bugHint: 'Допиши недостающую часть кода, чтобы все проверки прошли.',
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