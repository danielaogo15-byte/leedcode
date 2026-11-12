import type { Level, TrackId } from '@/types/track';

export type StubTask = {
  id: string;
  title: string;
  track: TrackId;
  level: Level;
  isBoss: boolean;
  /** Только для logic: нужен ли фиксированный HTML для DOM-проверок */
  needsDom: boolean;
  prompt: string;
  starterHtml: string;
  starterCss: string;
  starterJs: string;
  htmlFixture: string;
  solution: string;
  solved: boolean;
};

export const STUB_UNLOCKED_LEVEL: Level = 1;

export const STUB_TASKS: StubTask[] = [
  {
    id: 'layout-box-001',
    title: 'Карточка товара',
    track: 'layout',
    level: 1,
    isBoss: false,
    needsDom: true,
    prompt:
      'Сверстай карточку: картинка сверху, название и цена снизу. Это заглушка шага 2 — настоящие проверки появятся позже.',
    starterHtml: '<article class="card">\n  <h1>Товар</h1>\n</article>\n',
    starterCss: '.card {\n  padding: 16px;\n}\n',
    starterJs: '',
    htmlFixture: '',
    solution: 'Решение скрыто, пока задача не решена и не нажато «Сдаюсь».',
    solved: false,
  },
  {
    id: 'layout-nav-001',
    title: 'Горизонтальное меню',
    track: 'layout',
    level: 1,
    isBoss: false,
    needsDom: true,
    prompt: 'Сделай ряд ссылок в одну линию. Заглушка шага 2.',
    starterHtml: '<nav>\n  <a href="#">Главная</a>\n</nav>\n',
    starterCss: 'nav a {\n  margin-right: 8px;\n}\n',
    starterJs: '',
    htmlFixture: '',
    solution: 'Решение скрыто, пока задача не решена и не нажато «Сдаюсь».',
    solved: true,
  },
  {
    id: 'js-sum-001',
    title: 'Сумма чётных',
    track: 'logic',
    level: 1,
    isBoss: false,
    needsDom: false,
    prompt:
      'Напиши функцию sumEven(arr), которая складывает чётные числа. Заглушка шага 2 — раннер ещё не подключён.',
    starterHtml: '',
    starterCss: '',
    starterJs: 'function sumEven(arr) {\n  \n}\n',
    htmlFixture: '',
    solution: 'Решение скрыто, пока задача не решена и не нажато «Сдаюсь».',
    solved: false,
  },
  {
    id: 'js-dom-001',
    title: 'Переключить класс',
    track: 'logic',
    level: 1,
    isBoss: false,
    needsDom: true,
    prompt:
      'По клику на кнопку добавь класс active. HTML-заготовка фиксированная: её нельзя менять, редактируется только JS.',
    starterHtml: '',
    starterCss: '',
    starterJs: 'const button = document.querySelector("button");\n',
    htmlFixture: '<button type="button" id="toggle">Нажми</button>\n',
    solution: 'Решение скрыто, пока задача не решена и не нажато «Сдаюсь».',
    solved: false,
  },
];

export function tasksFor(track: TrackId, level: Level): StubTask[] {
  return STUB_TASKS.filter(
    (task) => task.track === track && task.level === level,
  );
}
