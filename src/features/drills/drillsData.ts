export type DrillCategory =
  | 'css-to-tailwind'
  | 'frontend'
  | 'backend-sql'
  | 'testing-devops';

export type DrillCard = {
  id: string;
  category: DrillCategory;
  tech: string;
  title: string;
  sourceCode: string;
  targetCode: string;
  tokens: string[];
  orderIndependent?: boolean;
  explanation: string;
};

export const DRILL_CATEGORIES: {
  id: DrillCategory | 'all';
  label: string;
}[] = [
  { id: 'all', label: 'Все карточки (40)' },
  { id: 'css-to-tailwind', label: 'CSS → Tailwind (16)' },
  { id: 'frontend', label: 'Frontend & TS (8)' },
  { id: 'backend-sql', label: 'Backend, SQL & Python (8)' },
  { id: 'testing-devops', label: 'Тесты, Git & DevOps (8)' },
];

export const ALL_DRILLS: DrillCard[] = [
  // ==================== 1. CSS -> TAILWIND (16 карточек) ====================
  {
    id: 'tw-01',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Горизонтальный флекс по центру с разносом по краям',
    sourceCode: `display: flex;\nalign-items: center;\njustify-content: space-between;\ngap: 16px;`,
    targetCode: 'flex items-center justify-between gap-4',
    tokens: ['flex', 'items-center', 'justify-between', 'gap-4'],
    orderIndependent: true,
    explanation: '1 шаг шкалы Tailwind = 4px, поэтому 16px — это gap-4.',
  },
  {
    id: 'tw-02',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Идеальное центрирование блока по обеим осям',
    sourceCode: `display: flex;\nalign-items: center;\njustify-content: center;\nheight: 100%;`,
    targetCode: 'flex items-center justify-center h-full',
    tokens: ['flex', 'items-center', 'justify-center', 'h-full'],
    orderIndependent: true,
    explanation: 'height: 100% в Tailwind записывается как h-full.',
  },
  {
    id: 'tw-03',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Вертикальная флекс-колонка с отступом 12px',
    sourceCode: `display: flex;\nflex-direction: column;\ngap: 12px;\npadding: 20px;`,
    targetCode: 'flex flex-col gap-3 p-5',
    tokens: ['flex', 'flex-col', 'gap-3', 'p-5'],
    orderIndependent: true,
    explanation: '12px / 4 = 3 (gap-3), 20px / 4 = 5 (p-5).',
  },
  {
    id: 'tw-04',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Сетка CSS Grid из 3 равных колонок',
    sourceCode: `display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: 24px;`,
    targetCode: 'grid grid-cols-3 gap-6',
    tokens: ['grid', 'grid-cols-3', 'gap-6'],
    orderIndependent: true,
    explanation: 'repeat(3, 1fr) — это grid-cols-3, а 24px — это gap-6.',
  },
  {
    id: 'tw-05',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Капсульный бейдж (Pill Badge)',
    sourceCode: `display: inline-flex;\nalign-items: center;\npadding: 4px 12px;\nborder-radius: 9999px;`,
    targetCode: 'inline-flex items-center py-1 px-3 rounded-full',
    tokens: ['inline-flex', 'items-center', 'py-1', 'px-3', 'rounded-full'],
    orderIndependent: true,
    explanation: 'py-1 (4px сверху/снизу), px-3 (12px слева/справа), rounded-full (капсула).',
  },
  {
    id: 'tw-06',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Кнопка точного размера со скруглением 8px',
    sourceCode: `width: 160px;\nheight: 40px;\nborder-radius: 8px;\nfont-weight: 600;`,
    targetCode: 'w-40 h-10 rounded-lg font-semibold',
    tokens: ['w-40', 'h-10', 'rounded-lg', 'font-semibold'],
    orderIndependent: true,
    explanation: '160px = w-40, 40px = h-10, 8px = rounded-lg, 600 = font-semibold.',
  },
  {
    id: 'tw-07',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Круглый аватар 48×48px без сжатия во флексе',
    sourceCode: `width: 48px;\nheight: 48px;\nborder-radius: 9999px;\nflex-shrink: 0;`,
    targetCode: 'w-12 h-12 rounded-full shrink-0',
    tokens: ['w-12', 'h-12', 'rounded-full', 'shrink-0'],
    orderIndependent: true,
    explanation: '48px = 12 (w-12 h-12), flex-shrink: 0 = shrink-0.',
  },
  {
    id: 'tw-08',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Липкая верхняя шапка сайта (Sticky Header)',
    sourceCode: `position: sticky;\ntop: 0px;\nz-index: 50;\nwidth: 100%;`,
    targetCode: 'sticky top-0 z-50 w-full',
    tokens: ['sticky', 'top-0', 'z-50', 'w-full'],
    orderIndependent: true,
    explanation: 'Позиционирование в Tailwind пишется без слова position: просто sticky, relative, absolute.',
  },
  {
    id: 'tw-09',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Абсолютное растягивание подложки во весь блок',
    sourceCode: `position: absolute;\ntop: 0; right: 0; bottom: 0; left: 0;\npointer-events: none;`,
    targetCode: 'absolute inset-0 pointer-events-none',
    tokens: ['absolute', 'inset-0', 'pointer-events-none'],
    orderIndependent: true,
    explanation: 'inset-0 заменяет сразу все четыре свойства top/right/bottom/left: 0.',
  },
  {
    id: 'tw-10',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Карточка с рамкой, скруглением 12px и скрытием переполнения',
    sourceCode: `border-width: 1px;\nborder-radius: 12px;\npadding: 16px;\noverflow: hidden;`,
    targetCode: 'border rounded-xl p-4 overflow-hidden',
    tokens: ['border', 'rounded-xl', 'p-4', 'overflow-hidden'],
    orderIndependent: true,
    explanation: '12px радиуса в Tailwind — это rounded-xl.',
  },
  {
    id: 'tw-11',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Обрезка длинного текста многоточием в одну строку',
    sourceCode: `overflow: hidden;\ntext-overflow: ellipsis;\nwhite-space: nowrap;\nfont-size: 14px;`,
    targetCode: 'truncate text-sm',
    tokens: ['truncate', 'text-sm'],
    orderIndependent: true,
    explanation: 'Один класс truncate заменяет сразу три CSS-свойства обрезки текста!',
  },
  {
    id: 'tw-12',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Центрированный контейнер максимальной ширины',
    sourceCode: `width: 100%;\nmax-width: 1024px;\nmargin-left: auto;\nmargin-right: auto;`,
    targetCode: 'w-full max-w-5xl mx-auto',
    tokens: ['w-full', 'max-w-5xl', 'mx-auto'],
    orderIndependent: true,
    explanation: 'margin-left/right: auto — это mx-auto, а 1024px — max-w-5xl.',
  },
  {
    id: 'tw-13',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Сетка с фиксированным сайдбаром 240px и контентом 1fr',
    sourceCode: `display: grid;\ngrid-template-columns: 240px 1fr;\ngap: 16px;`,
    targetCode: 'grid grid-cols-[240px_1fr] gap-4',
    tokens: ['grid', 'grid-cols-[240px_1fr]', 'gap-4'],
    orderIndependent: true,
    explanation: 'Произвольные колонки задаются в квадратных скобках через нижнее подчёркивание.',
  },
  {
    id: 'tw-14',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Сброс стиля списка и выстраивание ссылок в ряд',
    sourceCode: `list-style-type: none;\nmargin: 0px;\ndisplay: flex;\ngap: 8px;`,
    targetCode: 'list-none m-0 flex gap-2',
    tokens: ['list-none', 'm-0', 'flex', 'gap-2'],
    orderIndependent: true,
    explanation: 'list-none убирает точки у ul, m-0 обнуляет внешний отступ.',
  },
  {
    id: 'tw-15',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Прижатие кнопок футера к правому краю',
    sourceCode: `display: flex;\njustify-content: flex-end;\nalign-items: center;\ngap: 10px;`,
    targetCode: 'flex justify-end items-center gap-2.5',
    tokens: ['flex', 'justify-end', 'items-center', 'gap-2.5'],
    orderIndependent: true,
    explanation: '10px в Tailwind — это дробный шаг 2.5 (2.5 × 4 = 10).',
  },
  {
    id: 'tw-16',
    category: 'css-to-tailwind',
    tech: 'Tailwind CSS',
    title: 'Моноширинный жирный текст по центру',
    sourceCode: `font-family: monospace;\nfont-weight: 700;\nfont-size: 12px;\ntext-align: center;`,
    targetCode: 'font-mono font-bold text-xs text-center',
    tokens: ['font-mono', 'font-bold', 'text-xs', 'text-center'],
    orderIndependent: true,
    explanation: '12px — text-xs, 700 — font-bold, monospace — font-mono.',
  },

  // ==================== 2. FRONTEND & TYPESCRIPT (8 карточек) ====================
  {
    id: 'fe-01',
    category: 'frontend',
    tech: 'TypeScript',
    title: 'Утилитарный тип: сделать все поля интерфейса необязательными',
    sourceCode: `// Сигнатура функции патча настроек AppConfig`,
    targetCode: 'function patch(cfg: AppConfig, next: Partial<AppConfig>): AppConfig',
    tokens: ['function', 'patch(cfg:', 'AppConfig,', 'next:', 'Partial<AppConfig>):', 'AppConfig'],
    explanation: 'Partial<T> делает каждое свойство типа T опциональным (?).',
  },
  {
    id: 'fe-02',
    category: 'frontend',
    tech: 'React + TypeScript',
    title: 'Типизированный useState для пользователя или null',
    sourceCode: `// Объяви стейт user (начальное значение null) с типом User | null`,
    targetCode: 'const [user, setUser] = useState<User | null>(null);',
    tokens: ['const', '[user,', 'setUser]', '=', 'useState<User', '|', 'null>(null);'],
    explanation: 'Когда начальное значение null, дженерик <User | null> обязателен.',
  },
  {
    id: 'fe-03',
    category: 'frontend',
    tech: 'Zustand',
    title: 'Иммутабельный инкремент счётчика в сторе Zustand',
    sourceCode: `// Напиши метод inc внутри create((set) => ({ ... }))`,
    targetCode: 'inc: () => set((state) => ({ count: state.count + 1 }))',
    tokens: ['inc:', '()', '=>', 'set((state)', '=>', '({', 'count:', 'state.count', '+', '1', '}))'],
    explanation: 'При обновлении от прошлого значения в set передаётся функция (state) => ({ ... }).',
  },
  {
    id: 'fe-04',
    category: 'frontend',
    tech: 'TanStack Query',
    title: 'Хук useQuery с составным ключом кэша по id',
    sourceCode: `// Запрос профиля пользователя с ключом ["user", id]`,
    targetCode: 'const { data, isLoading } = useQuery({ queryKey: ["user", id], queryFn: () => fetchUser(id) });',
    tokens: ['const', '{', 'data,', 'isLoading', '}', '=', 'useQuery({', 'queryKey:', '["user",', 'id],', 'queryFn:', '()', '=>', 'fetchUser(id)', '});'],
    explanation: 'В TanStack Query v5 хук useQuery принимает единый объект с queryKey и queryFn.',
  },
  {
    id: 'fe-05',
    category: 'frontend',
    tech: 'Zod',
    title: 'Вывод TypeScript-типа из схемы Zod',
    sourceCode: `// Выведи тип UserFormValues из константы схемы UserSchema`,
    targetCode: 'type UserFormValues = z.infer<typeof UserSchema>;',
    tokens: ['type', 'UserFormValues', '=', 'z.infer<typeof', 'UserSchema>;'],
    explanation: 'z.infer<typeof Schema> избавляет от дублирования интерфейсов вручную.',
  },
  {
    id: 'fe-06',
    category: 'frontend',
    tech: 'React Hook Form + Zod',
    title: 'Инициализация useForm со связкой zodResolver',
    sourceCode: `// Подключи схему LoginSchema к хуку useForm<LoginValues>()`,
    targetCode: 'const form = useForm<LoginValues>({ resolver: zodResolver(LoginSchema) });',
    tokens: ['const', 'form', '=', 'useForm<LoginValues>({', 'resolver:', 'zodResolver(LoginSchema)', '});'],
    explanation: 'zodResolver соединяет схему Zod с валидацией React Hook Form.',
  },
  {
    id: 'fe-07',
    category: 'frontend',
    tech: 'Next.js App Router',
    title: 'Экспорт функции динамических метаданных страницы',
    sourceCode: `// Асинхронная функция метаданных в app/blog/[slug]/page.tsx`,
    targetCode: 'export async function generateMetadata({ params }: Props): Promise<Metadata>',
    tokens: ['export', 'async', 'function', 'generateMetadata({', 'params', '}:', 'Props):', 'Promise<Metadata>'],
    explanation: 'Next.js автоматически вызывает generateMetadata на сервере перед рендером страницы.',
  },
  {
    id: 'fe-08',
    category: 'frontend',
    tech: 'shadcn/ui',
    title: 'Хелпер склейки классов cn() с условием',
    sourceCode: `// Склей базовый класс "p-4" и условный "bg-sky-500" при active === true`,
    targetCode: 'className={cn("p-4", active && "bg-sky-500")}',
    tokens: ['className={cn("p-4",', 'active', '&&', '"bg-sky-500")}'],
    explanation: 'Функция cn() из shadcn/ui безопасно отбрасывает false и склеивает Tailwind-классы.',
  },

  // ==================== 3. BACKEND, SQL & PYTHON (8 карточек) ====================
  {
    id: 'be-01',
    category: 'backend-sql',
    tech: 'Express + Node.js',
    title: 'Асинхронный POST-роут со статусом 201 Created',
    sourceCode: `// Верни JSON { id: 1 } со статусом 201 на POST /api/users`,
    targetCode: 'app.post("/api/users", async (req, res) => { return res.status(201).json({ id: 1 }); });',
    tokens: ['app.post("/api/users",', 'async', '(req,', 'res)', '=>', '{', 'return', 'res.status(201).json({', 'id:', '1', '});', '});'],
    explanation: 'res.status(201).json(...) устанавливает HTTP-код и сериализует объект в JSON.',
  },
  {
    id: 'be-02',
    category: 'backend-sql',
    tech: 'Prisma ORM',
    title: 'Поиск уникальной записи по email через prisma.user.findUnique',
    sourceCode: `// Найди пользователя по уникальному полю email`,
    targetCode: 'const user = await prisma.user.findUnique({ where: { email } });',
    tokens: ['const', 'user', '=', 'await', 'prisma.user.findUnique({', 'where:', '{', 'email', '}', '});'],
    explanation: 'findUnique работает только по полям с атрибутом @id или @unique.',
  },
  {
    id: 'be-03',
    category: 'backend-sql',
    tech: 'PostgreSQL',
    title: 'Выборка активных пользователей с сортировкой и лимитом',
    sourceCode: `-- Выбери id, email из таблицы users, где active = true, новые сверху, лимит 10`,
    targetCode: 'SELECT id, email FROM users WHERE active = true ORDER BY created_at DESC LIMIT 10;',
    tokens: ['SELECT', 'id,', 'email', 'FROM', 'users', 'WHERE', 'active', '=', 'true', 'ORDER', 'BY', 'created_at', 'DESC', 'LIMIT', '10;'],
    explanation: 'DESC сортирует по убыванию (самые свежие записи первыми).',
  },
  {
    id: 'be-04',
    category: 'backend-sql',
    tech: 'Redis',
    title: 'Запись JSON-сессии в Redis с TTL 3600 секунд',
    sourceCode: `// Сохрани строку data по ключу "session:42" на 1 час (3600 сек)`,
    targetCode: 'await redis.set("session:42", data, "EX", 3600);',
    tokens: ['await', 'redis.set("session:42",', 'data,', '"EX",', '3600);'],
    explanation: 'Аргумент "EX" задаёт время жизни ключа в секундах.',
  },
  {
    id: 'be-05',
    category: 'backend-sql',
    tech: 'FastAPI + Python',
    title: 'Декоратор POST-эндпоинта с response_model и кодом 201',
    sourceCode: `# Объяви декоратор POST /users с моделью ответа UserOut и статусом 201`,
    targetCode: '@app.post("/users", response_model=UserOut, status_code=201)',
    tokens: ['@app.post("/users",', 'response_model=UserOut,', 'status_code=201)'],
    explanation: 'response_model автоматически отфильтрует секретные поля (например, password_hash).',
  },
  {
    id: 'be-06',
    category: 'backend-sql',
    tech: 'Pydantic',
    title: 'Поле модели Pydantic с ограничением длины строки',
    sourceCode: `# Обязательное строковое поле username от 3 до 20 символов`,
    targetCode: 'username: str = Field(min_length=3, max_length=20)',
    tokens: ['username:', 'str', '=', 'Field(min_length=3,', 'max_length=20)'],
    explanation: 'Field() в Pydantic v2 задаёт правила валидации и метаданные для OpenAPI.',
  },
  {
    id: 'be-07',
    category: 'backend-sql',
    tech: 'SQLAlchemy 2.0',
    title: 'Выполнение SELECT-запроса с получением списка объектов',
    sourceCode: `# Выполни select(User) через session.scalars().all()`,
    targetCode: 'users = session.scalars(select(User).where(User.is_active == True)).all()',
    tokens: ['users', '=', 'session.scalars(select(User).where(User.is_active', '==', 'True)).all()'],
    explanation: 'session.scalars() возвращает сразу ORM-объекты модели вместо кортежей Row.',
  },
  {
    id: 'be-08',
    category: 'backend-sql',
    tech: 'Alembic',
    title: 'Добавление новой колонки в миграции Alembic',
    sourceCode: `# Добавь строковую колонку "role" (длина 32) в таблицу "users"`,
    targetCode: 'op.add_column("users", sa.Column("role", sa.String(32), nullable=False))',
    tokens: ['op.add_column("users",', 'sa.Column("role",', 'sa.String(32),', 'nullable=False))'],
    explanation: 'op.add_column используется внутри функции upgrade() файла ревизии Alembic.',
  },

  // ==================== 4. ТЕСТЫ, GIT & DEVOPS (8 карточек) ====================
  {
    id: 'do-01',
    category: 'testing-devops',
    tech: 'Vitest + RTL',
    title: 'Поиск кнопки по роли и проверка текста в тесте',
    sourceCode: `// Найди кнопку "Сохранить" через screen.getByRole`,
    targetCode: 'expect(screen.getByRole("button", { name: /сохранить/i })).toBeInTheDocument();',
    tokens: ['expect(screen.getByRole("button",', '{', 'name:', '/сохранить/i', '})).toBeInTheDocument();'],
    explanation: 'Поиск по getByRole с регуляркой в name — золотой стандарт доступных тестов RTL.',
  },
  {
    id: 'do-02',
    category: 'testing-devops',
    tech: 'Playwright',
    title: 'Переход на страницу и клик по кнопке в E2E-тесте',
    sourceCode: `// Открой "/login" и кликни по кнопке "Войти"`,
    targetCode: 'await page.goto("/login"); await page.getByRole("button", { name: "Войти" }).click();',
    tokens: ['await', 'page.goto("/login");', 'await', 'page.getByRole("button",', '{', 'name:', '"Войти"', '}).click();'],
    explanation: 'Playwright автоматически ждёт появления элемента перед выполнением .click().',
  },
  {
    id: 'do-03',
    category: 'testing-devops',
    tech: 'pytest',
    title: 'Декоратор параметризации теста в pytest',
    sourceCode: `# Запусти тест для пар ("a,b", [(1, 2), (3, 4)])`,
    targetCode: '@pytest.mark.parametrize("a,b", [(1, 2), (3, 4)])',
    tokens: ['@pytest.mark.parametrize("a,b",', '[(1,', '2),', '(3,', '4)])'],
    explanation: '@pytest.mark.parametrize прогоняет одну тестовую функцию по всем наборам данных.',
  },
  {
    id: 'do-04',
    category: 'testing-devops',
    tech: 'Docker',
    title: 'Установка зависимостей pnpm в Dockerfile со строгим локфайлом',
    sourceCode: `# Слой установки пакетов без модификации pnpm-lock.yaml`,
    targetCode: 'RUN corepack enable && pnpm install --frozen-lockfile',
    tokens: ['RUN', 'corepack', 'enable', '&&', 'pnpm', 'install', '--frozen-lockfile'],
    explanation: '--frozen-lockfile гарантирует идентичные версии пакетов при сборке образа.',
  },
  {
    id: 'do-05',
    category: 'testing-devops',
    tech: 'Nginx + Linux',
    title: 'Проксирование трафика /api/ на контейнер бэкенда в nginx.conf',
    sourceCode: `# Внутри location /api/ перенаправь запросы на http://api:8000/`,
    targetCode: 'proxy_pass http://api:8000/; proxy_set_header Host $host;',
    tokens: ['proxy_pass', 'http://api:8000/;', 'proxy_set_header', 'Host', '$host;'],
    explanation: 'proxy_pass пересылает запросы во внутреннюю сеть Docker, сохраняя заголовок Host.',
  },
  {
    id: 'do-06',
    category: 'testing-devops',
    tech: 'GitHub Actions',
    title: 'Шаг чекаута репозитория и запуска тестов в CI YAML',
    sourceCode: `# Шаг использования actions/checkout@v4 и запуска pnpm test:run`,
    targetCode: '- uses: actions/checkout@v4\n- run: pnpm test:run',
    tokens: ['-', 'uses:', 'actions/checkout@v4', '-', 'run:', 'pnpm', 'test:run'],
    explanation: 'actions/checkout@v4 скачивает код репозитория на виртуальную машину ubuntu-latest.',
  },
  {
    id: 'do-07',
    category: 'testing-devops',
    tech: 'Sentry',
    title: 'Перехват и отправка исключения в Sentry вручную',
    sourceCode: `// Отправь пойманную ошибку err в мониторинг Sentry внутри блока catch`,
    targetCode: 'Sentry.captureException(err);',
    tokens: ['Sentry.captureException(err);'],
    explanation: 'Sentry.captureException отправляет полный стектрейс и контекст ошибки в дашборд.',
  },
  {
    id: 'do-08',
    category: 'testing-devops',
    tech: 'Git + GitHub',
    title: 'Создание новой ветки и первая отправка с привязкой upstream',
    sourceCode: `# Создай ветку feat/ui и запушь её в origin`,
    targetCode: 'git switch -c feat/ui && git push -u origin feat/ui',
    tokens: ['git', 'switch', '-c', 'feat/ui', '&&', 'git', 'push', '-u', 'origin', 'feat/ui'],
    explanation: 'Флаг -u (--set-upstream) связывает локальную ветку с удалённой.',
  },
];

function normalizeCodeString(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

export type DrillCheckResult = {
  matchedTokens: boolean[];
  allMatched: boolean;
  extraTokens: string[];
};

export function evaluateDrillInput(
  card: DrillCard,
  userInput: string,
): DrillCheckResult {
  const userTokens = userInput
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (card.orderIndependent) {
    const userSet = new Set(userTokens);
    const expectedSet = new Set(card.tokens);
    const matchedTokens = card.tokens.map((t) => userSet.has(t));
    const extraTokens = userTokens.filter((t) => !expectedSet.has(t));
    const allMatched =
      matchedTokens.every(Boolean) && extraTokens.length === 0;
    return { matchedTokens, allMatched, extraTokens };
  }

  const matchedTokens = card.tokens.map((tok, idx) => userTokens[idx] === tok);
  const exactMatch =
    normalizeCodeString(userInput) === normalizeCodeString(card.targetCode);

  return {
    matchedTokens: exactMatch
      ? card.tokens.map(() => true)
      : matchedTokens,
    allMatched: exactMatch,
    extraTokens: [],
  };
}