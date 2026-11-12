export const TRACKS = ['layout', 'logic'] as const;
export type TrackId = (typeof TRACKS)[number];

export const LEVELS = [1, 2, 3, 4, 5, 6, 7] as const;
export type Level = (typeof LEVELS)[number];

export type LevelMeta = {
  level: Level;
  title: string;
  stack: string[];
};

export const LEVEL_ROADMAP: Record<Level, LevelMeta> = {
  1: {
    level: 1,
    title: 'База веба и Git-ритуалы',
    stack: ['HTML', 'CSS', 'JavaScript', 'Git', 'GitHub', 'pnpm'],
  },
  2: {
    level: 2,
    title: 'Типизация, стилизация и сборка',
    stack: ['Tailwind CSS', 'TypeScript', 'Vite', 'ESLint', 'Prettier'],
  },
  3: {
    level: 3,
    title: 'React-экосистема и формы',
    stack: [
      'React',
      'shadcn/ui',
      'Zustand',
      'TanStack Query',
      'React Hook Form',
      'Zod',
    ],
  },
  4: {
    level: 4,
    title: 'Фреймворк Next.js и тестирование UI',
    stack: ['Next.js', 'Vitest', 'React Testing Library', 'Playwright'],
  },
  5: {
    level: 5,
    title: 'Node.js бэкенд и базы данных',
    stack: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Redis'],
  },
  6: {
    level: 6,
    title: 'Python-бэкенд и миграции',
    stack: [
      'Python',
      'FastAPI',
      'Pydantic',
      'SQLAlchemy',
      'Alembic',
      'pytest',
    ],
  },
  7: {
    level: 7,
    title: 'DevOps, Linux и продакшен',
    stack: [
      'Docker',
      'Linux',
      'Nginx',
      'GitHub Actions',
      'AWS',
      'Vercel',
      'Sentry',
    ],
  },
};