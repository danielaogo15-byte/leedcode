import fs from 'node:fs';
import path from 'node:path';

const layoutTasks = [
  // ================= LEVEL 2 (Tailwind CSS Basics & Grid) =================
  {
    id: 'layout-201-grid-two-cols',
    title: 'Tailwind Grid: сетка из двух карточек',
    track: 'layout',
    level: 2,
    isBoss: false,
    topic: 'tailwind-grid',
    mapTopics: ['Tailwind CSS', 'CSS Grid'],
    learn: 'Классы Tailwind для Grid-раскладки: grid, grid-cols-2 и gap-4 (16px).',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'С помощью классов Tailwind CSS преврати контейнер .grid-box в сетку из 2 равных колонок с отступом 16px.',
    specs: [
      'Добавь на .grid-box классы: grid grid-cols-2 gap-4',
      'Не удаляй базовый класс grid-box (по нему идёт проверка)'
    ],
    starterHtml: '<div class="grid-box">\n  <div class="bg-slate-800 text-slate-50 p-4 rounded-xl font-semibold">Frontend</div>\n  <div class="bg-slate-800 text-slate-50 p-4 rounded-xl font-semibold">Backend</div>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="grid-box grid grid-cols-2 gap-4">\n  <div class="bg-slate-800 text-slate-50 p-4 rounded-xl font-semibold">Frontend</div>\n  <div class="bg-slate-800 text-slate-50 p-4 rounded-xl font-semibold">Backend</div>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'В Tailwind 16px — это шаг 4 (4 × 4px).' },
      { tier: 2, text: 'Документация: https://tailwindcss.com/docs/grid-template-columns' },
      { tier: 3, text: 'Пропиши class="grid-box grid grid-cols-2 gap-4".' }
    ],
    checks: [
      { type: 'selector', name: 'Внутри .grid-box 2 карточки', selector: '.grid-box > div', minCount: 2 },
      { type: 'computedStyle', name: '.grid-box использует display: grid', selector: '.grid-box', property: 'display', expected: 'grid' },
      { type: 'computedStyle', name: 'Отступ gap-4 равен 16px', selector: '.grid-box', property: 'columnGap', expected: '16px' }
    ],
    solution: '<div class="grid-box grid grid-cols-2 gap-4">\n  <div class="bg-slate-800 text-slate-50 p-4 rounded-xl font-semibold">Frontend</div>\n  <div class="bg-slate-800 text-slate-50 p-4 rounded-xl font-semibold">Backend</div>\n</div>'
  },
  {
    id: 'layout-202-pill-badge',
    title: 'Tailwind Pill Badge: капсульный бейдж версии',
    track: 'layout',
    level: 2,
    isBoss: false,
    topic: 'tailwind-badges',
    mapTopics: ['Tailwind CSS', 'TypeScript'],
    learn: 'Утилиты inline-flex, items-center, gap-2, px-3, py-1.5 и rounded-full.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Оформи бейдж .pill классами Tailwind: строчный флекс, выравнивание по центру, gap 8px, паддинги 6px по вертикали и 12px по горизонтали, полное скругление.',
    specs: [
      'Добавь на .pill классы: inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
      'gap-2 = 8px, px-3 = 12px, py-1.5 = 6px, rounded-full = 999px'
    ],
    starterHtml: '<div class="pill bg-slate-900 text-sky-400 border border-sky-500 text-xs font-semibold">\n  <span>TypeScript</span>\n  <span class="bg-sky-500 text-white px-1.5 py-0.5 rounded-full">5.9</span>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="pill inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-sky-400 border border-sky-500 text-xs font-semibold">\n  <span>TypeScript</span>\n  <span class="bg-sky-500 text-white px-1.5 py-0.5 rounded-full">5.9</span>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'Для капсульного скругления в Tailwind используется класс rounded-full.' },
      { tier: 2, text: 'Документация: https://tailwindcss.com/docs/border-radius' },
      { tier: 3, text: 'Добавь к .pill классы: inline-flex items-center gap-2 px-3 py-1.5 rounded-full.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.pill использует inline-flex', selector: '.pill', property: 'display', expected: 'inline-flex' },
      { type: 'computedStyle', name: 'Выравнивание items-center', selector: '.pill', property: 'alignItems', expected: 'center' },
      { type: 'computedStyle', name: 'Промежуток gap-2 (8px)', selector: '.pill', property: 'columnGap', expected: '8px' },
      { type: 'computedStyle', name: 'Скругление rounded-full (999px)', selector: '.pill', property: 'borderTopLeftRadius', expected: '999px' }
    ],
    solution: '<div class="pill inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-sky-400 border border-sky-500 text-xs font-semibold">\n  <span>TypeScript</span>\n  <span class="bg-sky-500 text-white px-1.5 py-0.5 rounded-full">5.9</span>\n</div>'
  },
  {
    id: 'layout-203-pricing-card',
    title: 'Tailwind Flex Column: карточка тарифа',
    track: 'layout',
    level: 2,
    isBoss: false,
    topic: 'tailwind-flex',
    mapTopics: ['Tailwind CSS', 'Flexbox'],
    learn: 'Вертикальная колонка flex flex-col justify-between и произвольная высота h-[200px].',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Задай карточке .plan-card высоту 200px, внутренний отступ 20px и вертикальную флекс-колонку с разносом элементов по краям.',
    specs: [
      'Добавь на .plan-card классы: h-[200px] p-5 flex flex-col justify-between',
      'p-5 в Tailwind даёт 20px отступа со всех сторон'
    ],
    starterHtml: '<article class="plan-card bg-slate-800 text-slate-50 rounded-xl">\n  <div>\n    <h3 class="m-0 mb-1.5 text-lg font-bold">Pro Stack</h3>\n    <p class="m-0 text-xs text-slate-400">Полный доступ к 39 технологиям</p>\n  </div>\n  <button class="bg-sky-400 text-slate-900 border-none p-2.5 rounded-lg font-bold" type="button">Выбрать тариф</button>\n</article>\n',
    starterCss: '',
    targetHtml: '<article class="plan-card h-[200px] p-5 flex flex-col justify-between bg-slate-800 text-slate-50 rounded-xl">\n  <div>\n    <h3 class="m-0 mb-1.5 text-lg font-bold">Pro Stack</h3>\n    <p class="m-0 text-xs text-slate-400">Полный доступ к 39 технологиям</p>\n  </div>\n  <button class="bg-sky-400 text-slate-900 border-none p-2.5 rounded-lg font-bold" type="button">Выбрать тариф</button>\n</article>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'Arbitrary value в Tailwind пишется в квадратных скобках: h-[200px].' },
      { tier: 2, text: 'Документация: https://tailwindcss.com/docs/flex-direction' },
      { tier: 3, text: 'Добавь к .plan-card классы: h-[200px] p-5 flex flex-col justify-between.' }
    ],
    checks: [
      { type: 'boundingRect', name: 'Высота карточки 200px (±2px)', selector: '.plan-card', property: 'height', expected: 200, tolerance: 2 },
      { type: 'computedStyle', name: 'Направление flex-col', selector: '.plan-card', property: 'flexDirection', expected: 'column' },
      { type: 'computedStyle', name: 'Разнос justify-between', selector: '.plan-card', property: 'justifyContent', expected: 'space-between' }
    ],
    solution: '<article class="plan-card h-[200px] p-5 flex flex-col justify-between bg-slate-800 text-slate-50 rounded-xl">\n  <div>\n    <h3 class="m-0 mb-1.5 text-lg font-bold">Pro Stack</h3>\n    <p class="m-0 text-xs text-slate-400">Полный доступ к 39 технологиям</p>\n  </div>\n  <button class="bg-sky-400 text-slate-900 border-none p-2.5 rounded-lg font-bold" type="button">Выбрать тариф</button>\n</article>'
  },
  {
    id: 'layout-204-boss-dashboard',
    title: 'Босс: Адаптивный каркас дашборда на Tailwind Grid',
    track: 'layout',
    level: 2,
    isBoss: true,
    topic: 'tailwind-boss',
    mapTopics: ['Tailwind CSS', 'Vite', 'Layouts'],
    learn: 'Произвольный шаблон колонок grid-cols-[120px_1fr] и вложенная сетка grid-cols-2.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Собери макет дашборда только классами Tailwind: у .dashboard сетка с колонками 120px и 1fr (gap 16px), а у .stats — сетка из 2 равных колонок (gap 12px).',
    specs: [
      'Добавь на .dashboard классы: grid grid-cols-[120px_1fr] gap-4',
      'Добавь на .stats классы: grid grid-cols-2 gap-3'
    ],
    starterHtml: '<div class="dashboard">\n  <aside class="side bg-slate-900 text-slate-400 p-3.5 rounded-xl text-xs">Меню</aside>\n  <main class="stats">\n    <div class="bg-slate-800 text-slate-50 p-3.5 rounded-xl font-bold">XP: 450</div>\n    <div class="bg-slate-800 text-slate-50 p-3.5 rounded-xl font-bold">Streak: 7</div>\n  </main>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="dashboard grid grid-cols-[120px_1fr] gap-4">\n  <aside class="side bg-slate-900 text-slate-400 p-3.5 rounded-xl text-xs">Меню</aside>\n  <main class="stats grid grid-cols-2 gap-3">\n    <div class="bg-slate-800 text-slate-50 p-3.5 rounded-xl font-bold">XP: 450</div>\n    <div class="bg-slate-800 text-slate-50 p-3.5 rounded-xl font-bold">Streak: 7</div>\n  </main>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'В Tailwind пробел внутри квадратных скобок заменяется на подчёркивание: grid-cols-[120px_1fr].' },
      { tier: 2, text: 'gap-4 равен 16px, а gap-3 равен 12px.' },
      { tier: 3, text: 'На .dashboard добавь grid grid-cols-[120px_1fr] gap-4, а на .stats — grid grid-cols-2 gap-3.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.dashboard использует grid', selector: '.dashboard', property: 'display', expected: 'grid' },
      { type: 'boundingRect', name: 'Ширина .side равна 120px (±2px)', selector: '.side', property: 'width', expected: 120, tolerance: 2 },
      { type: 'computedStyle', name: '.stats использует grid', selector: '.stats', property: 'display', expected: 'grid' },
      { type: 'computedStyle', name: 'Отступ в .stats равен 12px (gap-3)', selector: '.stats', property: 'columnGap', expected: '12px' }
    ],
    solution: '<div class="dashboard grid grid-cols-[120px_1fr] gap-4">\n  <aside class="side bg-slate-900 text-slate-400 p-3.5 rounded-xl text-xs">Меню</aside>\n  <main class="stats grid grid-cols-2 gap-3">\n    <div class="bg-slate-800 text-slate-50 p-3.5 rounded-xl font-bold">XP: 450</div>\n    <div class="bg-slate-800 text-slate-50 p-3.5 rounded-xl font-bold">Streak: 7</div>\n  </main>\n</div>'
  },

  // ================= LEVEL 3 (shadcn/ui + React Ecosystem) =================
  {
    id: 'layout-301-shadcn-input',
    title: 'shadcn/ui FormItem: поле ввода с ошибкой валидации Zod',
    track: 'layout',
    level: 3,
    isBoss: false,
    topic: 'shadcn-forms',
    mapTopics: ['shadcn/ui', 'React Hook Form', 'Zod', 'Tailwind CSS'],
    learn: 'Стилизация FormItem и Input в shadcn/ui через утилиты Tailwind.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Оформи блок поля формы .field и само поле .input классами Tailwind по спецификации shadcn/ui.',
    specs: [
      'Добавь на .field классы: flex flex-col gap-1.5',
      'Добавь на .input классы: h-10 px-3 rounded-lg (высота 40px, горизонтальный паддинг 12px, скругление 8px)'
    ],
    starterHtml: '<div class="field">\n  <label class="text-xs font-semibold text-slate-900">Email</label>\n  <input class="input border border-red-500 bg-white text-sm" value="not-an-email" />\n  <p class="m-0 text-xs text-red-500">Некорректный формат email (Zod)</p>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="field flex flex-col gap-1.5">\n  <label class="text-xs font-semibold text-slate-900">Email</label>\n  <input class="input h-10 px-3 rounded-lg border border-red-500 bg-white text-sm" value="not-an-email" />\n  <p class="m-0 text-xs text-red-500">Некорректный формат email (Zod)</p>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'В Tailwind gap-1.5 = 6px, h-10 = 40px, px-3 = 12px, rounded-lg = 8px.' },
      { tier: 2, text: 'Документация shadcn/ui Input: https://ui.shadcn.com/docs/components/input' },
      { tier: 3, text: 'На .field добавь flex flex-col gap-1.5, на .input добавь h-10 px-3 rounded-lg.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.field выстроен колонкой (flex-col)', selector: '.field', property: 'flexDirection', expected: 'column' },
      { type: 'computedStyle', name: 'Отступ gap-1.5 равен 6px', selector: '.field', property: 'rowGap', expected: '6px' },
      { type: 'boundingRect', name: 'Высота .input равна 40px (h-10)', selector: '.input', property: 'height', expected: 40, tolerance: 2 }
    ],
    solution: '<div class="field flex flex-col gap-1.5">\n  <label class="text-xs font-semibold text-slate-900">Email</label>\n  <input class="input h-10 px-3 rounded-lg border border-red-500 bg-white text-sm" value="not-an-email" />\n  <p class="m-0 text-xs text-red-500">Некорректный формат email (Zod)</p>\n</div>'
  },
  {
    id: 'layout-302-shadcn-tabs',
    title: 'shadcn/ui TabsList: переключатель вкладок',
    track: 'layout',
    level: 3,
    isBoss: false,
    topic: 'shadcn-tabs',
    mapTopics: ['shadcn/ui', 'React', 'Tailwind CSS'],
    learn: 'Контейнер TabsList на Tailwind Grid: grid grid-cols-2 gap-1 p-1 rounded-[10px].',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Оформи контейнер вкладок .tabs-list классами Tailwind: сетка из 2 колонок, промежуток 4px, паддинг 4px и скругление 10px.',
    specs: [
      'Добавь на .tabs-list классы: grid grid-cols-2 gap-1 p-1 rounded-[10px]',
      'gap-1 = 4px, p-1 = 4px'
    ],
    starterHtml: '<div class="tabs-list bg-slate-200">\n  <button class="border-none bg-white text-slate-900 py-2 px-3 rounded-md font-semibold text-xs" type="button">Превью</button>\n  <button class="border-none bg-transparent text-slate-600 py-2 px-3 rounded-md font-semibold text-xs" type="button">Код</button>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="tabs-list grid grid-cols-2 gap-1 p-1 rounded-[10px] bg-slate-200">\n  <button class="border-none bg-white text-slate-900 py-2 px-3 rounded-md font-semibold text-xs" type="button">Превью</button>\n  <button class="border-none bg-transparent text-slate-600 py-2 px-3 rounded-md font-semibold text-xs" type="button">Код</button>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'Для 4px в Tailwind используется единица 1 (gap-1, p-1).' },
      { tier: 2, text: 'Для точного скругления 10px используй rounded-[10px].' },
      { tier: 3, text: 'Добавь к .tabs-list классы: grid grid-cols-2 gap-1 p-1 rounded-[10px].' }
    ],
    checks: [
      { type: 'computedStyle', name: '.tabs-list использует grid', selector: '.tabs-list', property: 'display', expected: 'grid' },
      { type: 'computedStyle', name: 'Внутренний отступ p-1 равен 4px', selector: '.tabs-list', property: 'paddingTop', expected: '4px' },
      { type: 'computedStyle', name: 'Скругление 10px', selector: '.tabs-list', property: 'borderTopLeftRadius', expected: '10px' }
    ],
    solution: '<div class="tabs-list grid grid-cols-2 gap-1 p-1 rounded-[10px] bg-slate-200">\n  <button class="border-none bg-white text-slate-900 py-2 px-3 rounded-md font-semibold text-xs" type="button">Превью</button>\n  <button class="border-none bg-transparent text-slate-600 py-2 px-3 rounded-md font-semibold text-xs" type="button">Код</button>\n</div>'
  },
  {
    id: 'layout-303-toast-card',
    title: 'shadcn/ui Toast: всплывающее уведомление',
    track: 'layout',
    level: 3,
    isBoss: false,
    topic: 'shadcn-toast',
    mapTopics: ['shadcn/ui', 'Zustand', 'Tailwind CSS'],
    learn: 'Горизонтальный флекс-контейнер flex justify-between items-center p-3.5 rounded-[10px].',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Оформи уведомление .toast классами Tailwind: флекс с разносом по краям, вертикальное центрирование, паддинг 14px и скругление 10px.',
    specs: [
      'Добавь на .toast классы: flex justify-between items-center p-3.5 rounded-[10px]',
      'p-3.5 в Tailwind равен 14px (3.5 × 4px)'
    ],
    starterHtml: '<div class="toast bg-slate-900 text-slate-50 border border-slate-700">\n  <div>\n    <strong class="text-sm">Прогресс сохранён</strong>\n    <p class="m-0 mt-1 text-xs text-slate-400">Начислено +25 XP</p>\n  </div>\n  <button class="bg-transparent border-none text-slate-400 text-sm" type="button">✕</button>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="toast flex justify-between items-center p-3.5 rounded-[10px] bg-slate-900 text-slate-50 border border-slate-700">\n  <div>\n    <strong class="text-sm">Прогресс сохранён</strong>\n    <p class="m-0 mt-1 text-xs text-slate-400">Начислено +25 XP</p>\n  </div>\n  <button class="bg-transparent border-none text-slate-400 text-sm" type="button">✕</button>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'Для отступа 14px используй класс p-3.5.' },
      { tier: 2, text: 'Для разноса по краям и центрирования: flex justify-between items-center.' },
      { tier: 3, text: 'Добавь к .toast: flex justify-between items-center p-3.5 rounded-[10px].' }
    ],
    checks: [
      { type: 'computedStyle', name: 'Разнос justify-between', selector: '.toast', property: 'justifyContent', expected: 'space-between' },
      { type: 'computedStyle', name: 'Выравнивание items-center', selector: '.toast', property: 'alignItems', expected: 'center' },
      { type: 'computedStyle', name: 'Отступ p-3.5 равен 14px', selector: '.toast', property: 'paddingTop', expected: '14px' }
    ],
    solution: '<div class="toast flex justify-between items-center p-3.5 rounded-[10px] bg-slate-900 text-slate-50 border border-slate-700">\n  <div>\n    <strong class="text-sm">Прогресс сохранён</strong>\n    <p class="m-0 mt-1 text-xs text-slate-400">Начислено +25 XP</p>\n  </div>\n  <button class="bg-transparent border-none text-slate-400 text-sm" type="button">✕</button>\n</div>'
  },
  {
    id: 'layout-304-boss-auth-card',
    title: 'Босс: Карточка авторизации shadcn/ui Card + Footer',
    track: 'layout',
    level: 3,
    isBoss: true,
    topic: 'shadcn-boss',
    mapTopics: ['shadcn/ui', 'React Hook Form', 'Zod', 'Tailwind CSS'],
    learn: 'Сборка компонента Card с вертикальным стеком gap-4 и CardFooter с выравниванием кнопок вправо justify-end.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Оформи карточку входа .auth-card и её футер .auth-footer классами Tailwind.',
    specs: [
      'Добавь на .auth-card классы: p-5 rounded-xl flex flex-col gap-4',
      'Добавь на .auth-footer классы: flex justify-end gap-2'
    ],
    starterHtml: '<section class="auth-card bg-slate-800 text-slate-50">\n  <h3 class="m-0 text-base font-bold">Вход в VibeDojo</h3>\n  <div>\n    <input class="w-full px-2.5 py-2 rounded-md border border-slate-600 bg-slate-900 text-white" placeholder="Email" />\n  </div>\n  <footer class="auth-footer">\n    <button class="px-3 py-2 rounded-md border border-slate-600 bg-transparent text-slate-200" type="button">Отмена</button>\n    <button class="px-3 py-2 rounded-md border-none bg-sky-400 text-slate-900 font-bold" type="button">Войти</button>\n  </footer>\n</section>\n',
    starterCss: '',
    targetHtml: '<section class="auth-card p-5 rounded-xl flex flex-col gap-4 bg-slate-800 text-slate-50">\n  <h3 class="m-0 text-base font-bold">Вход в VibeDojo</h3>\n  <div>\n    <input class="w-full px-2.5 py-2 rounded-md border border-slate-600 bg-slate-900 text-white" placeholder="Email" />\n  </div>\n  <footer class="auth-footer flex justify-end gap-2">\n    <button class="px-3 py-2 rounded-md border border-slate-600 bg-transparent text-slate-200" type="button">Отмена</button>\n    <button class="px-3 py-2 rounded-md border-none bg-sky-400 text-slate-900 font-bold" type="button">Войти</button>\n  </footer>\n</section>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'p-5 = 20px, rounded-xl = 12px, gap-4 = 16px, gap-2 = 8px.' },
      { tier: 2, text: 'Прижатие кнопок вправо во флексе: justify-end.' },
      { tier: 3, text: 'На .auth-card добавь p-5 rounded-xl flex flex-col gap-4, а на .auth-footer — flex justify-end gap-2.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.auth-card выстроен колонкой', selector: '.auth-card', property: 'flexDirection', expected: 'column' },
      { type: 'computedStyle', name: 'Шаг между блоками 16px (gap-4)', selector: '.auth-card', property: 'rowGap', expected: '16px' },
      { type: 'computedStyle', name: 'Кнопки в .auth-footer прижаты вправо (justify-end)', selector: '.auth-footer', property: 'justifyContent', expected: 'flex-end' },
      { type: 'computedStyle', name: 'Отступ между кнопками 8px (gap-2)', selector: '.auth-footer', property: 'columnGap', expected: '8px' }
    ],
    solution: '<section class="auth-card p-5 rounded-xl flex flex-col gap-4 bg-slate-800 text-slate-50">\n  <h3 class="m-0 text-base font-bold">Вход в VibeDojo</h3>\n  <div>\n    <input class="w-full px-2.5 py-2 rounded-md border border-slate-600 bg-slate-900 text-white" placeholder="Email" />\n  </div>\n  <footer class="auth-footer flex justify-end gap-2">\n    <button class="px-3 py-2 rounded-md border border-slate-600 bg-transparent text-slate-200" type="button">Отмена</button>\n    <button class="px-3 py-2 rounded-md border-none bg-sky-400 text-slate-900 font-bold" type="button">Войти</button>\n  </footer>\n</section>'
  },

  // ================= LEVEL 4 (Next.js, Vitest, Playwright UI) =================
  {
    id: 'layout-401-skeleton-card',
    title: 'Next.js Loading UI: Skeleton-карточка на Tailwind',
    track: 'layout',
    level: 4,
    isBoss: false,
    topic: 'nextjs-skeleton',
    mapTopics: ['Next.js', 'Tailwind CSS'],
    learn: 'Круглый аватар w-12 h-12 rounded-full и флекс-ряд скелетона для loading.tsx в Next.js.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Задай контейнеру .skeleton-row флекс-выравнивание с шагом 12px, а блоку .avatar — размер 48×48px и круглое скругление.',
    specs: [
      'Добавь на .skeleton-row классы: flex items-center gap-3',
      'Добавь на .avatar классы: w-12 h-12 rounded-full (12 × 4px = 48px)'
    ],
    starterHtml: '<div class="skeleton-row bg-slate-900 p-3.5 rounded-xl">\n  <div class="avatar bg-slate-700"></div>\n  <div class="flex-1 flex flex-col gap-2">\n    <div class="h-2.5 w-[70%] bg-slate-700 rounded"></div>\n    <div class="h-2.5 w-[45%] bg-slate-700 rounded"></div>\n  </div>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="skeleton-row flex items-center gap-3 bg-slate-900 p-3.5 rounded-xl">\n  <div class="avatar w-12 h-12 rounded-full bg-slate-700"></div>\n  <div class="flex-1 flex flex-col gap-2">\n    <div class="h-2.5 w-[70%] bg-slate-700 rounded"></div>\n    <div class="h-2.5 w-[45%] bg-slate-700 rounded"></div>\n  </div>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: '48px в шкале Tailwind — это 12 (w-12 h-12).' },
      { tier: 2, text: 'Для отступа 12px используй gap-3.' },
      { tier: 3, text: 'На .skeleton-row добавь flex items-center gap-3, на .avatar — w-12 h-12 rounded-full.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.skeleton-row использует flex', selector: '.skeleton-row', property: 'display', expected: 'flex' },
      { type: 'boundingRect', name: 'Ширина .avatar 48px (w-12)', selector: '.avatar', property: 'width', expected: 48, tolerance: 2 },
      { type: 'boundingRect', name: 'Высота .avatar 48px (h-12)', selector: '.avatar', property: 'height', expected: 48, tolerance: 2 }
    ],
    solution: '<div class="skeleton-row flex items-center gap-3 bg-slate-900 p-3.5 rounded-xl">\n  <div class="avatar w-12 h-12 rounded-full bg-slate-700"></div>\n  <div class="flex-1 flex flex-col gap-2">\n    <div class="h-2.5 w-[70%] bg-slate-700 rounded"></div>\n    <div class="h-2.5 w-[45%] bg-slate-700 rounded"></div>\n  </div>\n</div>'
  },
  {
    id: 'layout-402-breadcrumbs',
    title: 'Next.js Breadcrumbs: навигационная цепочка на Tailwind',
    track: 'layout',
    level: 4,
    isBoss: false,
    topic: 'nextjs-navigation',
    mapTopics: ['Next.js', 'Tailwind CSS'],
    learn: 'Сброс маркеров списка list-none m-0 и выстраивание хлебных крошек через flex items-center gap-2.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Оформи список хлебных крошек ul.crumbs классами Tailwind: без маркеров списка, без внешних отступов, в ряд по центру с шагом 8px.',
    specs: [
      'Добавь на ul.crumbs классы: list-none m-0 flex items-center gap-2'
    ],
    starterHtml: '<ul class="crumbs bg-slate-800 text-slate-400 px-3.5 py-2.5 rounded-lg text-xs">\n  <li>Главная</li>\n  <li>/</li>\n  <li>Курсы</li>\n  <li>/</li>\n  <li class="text-sky-400 font-bold">Next.js 15</li>\n</ul>\n',
    starterCss: '',
    targetHtml: '<ul class="crumbs list-none m-0 flex items-center gap-2 bg-slate-800 text-slate-400 px-3.5 py-2.5 rounded-lg text-xs">\n  <li>Главная</li>\n  <li>/</li>\n  <li>Курсы</li>\n  <li>/</li>\n  <li class="text-sky-400 font-bold">Next.js 15</li>\n</ul>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'Класс list-none отключает точки у списка ul.' },
      { tier: 2, text: 'Для отступа 8px между элементами используй gap-2.' },
      { tier: 3, text: 'Добавь к .crumbs: list-none m-0 flex items-center gap-2.' }
    ],
    checks: [
      { type: 'computedStyle', name: 'Маркеры списка отключены (list-none)', selector: '.crumbs', property: 'listStyleType', expected: 'none' },
      { type: 'computedStyle', name: 'Элементы в ряд (flex)', selector: '.crumbs', property: 'display', expected: 'flex' },
      { type: 'computedStyle', name: 'Промежуток gap-2 равен 8px', selector: '.crumbs', property: 'columnGap', expected: '8px' }
    ],
    solution: '<ul class="crumbs list-none m-0 flex items-center gap-2 bg-slate-800 text-slate-400 px-3.5 py-2.5 rounded-lg text-xs">\n  <li>Главная</li>\n  <li>/</li>\n  <li>Курсы</li>\n  <li>/</li>\n  <li class="text-sky-400 font-bold">Next.js 15</li>\n</ul>'
  },
  {
    id: 'layout-403-vitest-summary',
    title: 'Vitest UI: статус-бар тестового прогона',
    track: 'layout',
    level: 4,
    isBoss: false,
    topic: 'vitest-ui',
    mapTopics: ['Vitest', 'React Testing Library', 'Tailwind CSS'],
    learn: 'Комбинирование высоты h-12 (48px), горизонтального паддинга px-4 и вложенного флекс-ряда.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Оформи плашку .test-bar и блок счётчиков .counters классами Tailwind.',
    specs: [
      'Добавь на .test-bar классы: h-12 px-4 flex justify-between items-center',
      'Добавь на .counters классы: flex gap-3'
    ],
    starterHtml: '<div class="test-bar bg-emerald-900 text-slate-50 rounded-[10px]">\n  <span class="bg-emerald-500 text-emerald-950 px-2 py-1 rounded font-bold text-xs">PASS</span>\n  <div class="counters text-xs">\n    <span>12 passed</span>\n    <span>180ms</span>\n  </div>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="test-bar h-12 px-4 flex justify-between items-center bg-emerald-900 text-slate-50 rounded-[10px]">\n  <span class="bg-emerald-500 text-emerald-950 px-2 py-1 rounded font-bold text-xs">PASS</span>\n  <div class="counters flex gap-3 text-xs">\n    <span>12 passed</span>\n    <span>180ms</span>\n  </div>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'Высота 48px в Tailwind — это h-12.' },
      { tier: 2, text: 'Горизонтальный отступ 16px — это px-4, а промежуток 12px — gap-3.' },
      { tier: 3, text: 'На .test-bar добавь h-12 px-4 flex justify-between items-center, на .counters — flex gap-3.' }
    ],
    checks: [
      { type: 'boundingRect', name: 'Высота .test-bar равна 48px (h-12)', selector: '.test-bar', property: 'height', expected: 48, tolerance: 2 },
      { type: 'computedStyle', name: 'Разнос по краям в .test-bar', selector: '.test-bar', property: 'justifyContent', expected: 'space-between' },
      { type: 'computedStyle', name: 'Промежуток в .counters равен 12px (gap-3)', selector: '.counters', property: 'columnGap', expected: '12px' }
    ],
    solution: '<div class="test-bar h-12 px-4 flex justify-between items-center bg-emerald-900 text-slate-50 rounded-[10px]">\n  <span class="bg-emerald-500 text-emerald-950 px-2 py-1 rounded font-bold text-xs">PASS</span>\n  <div class="counters flex gap-3 text-xs">\n    <span>12 passed</span>\n    <span>180ms</span>\n  </div>\n</div>'
  },
  {
    id: 'layout-404-boss-playwright-report',
    title: 'Босс: Инспектор трассировки Playwright Trace Viewer',
    track: 'layout',
    level: 4,
    isBoss: true,
    topic: 'playwright-boss',
    mapTopics: ['Playwright', 'Vitest', 'Tailwind CSS'],
    learn: 'Сборка интерфейса отчёта E2E-тестов с шапкой h-11 (44px) и сеткой grid-cols-[140px_1fr].',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Собери макет Playwright Trace Viewer классами Tailwind: шапка .pw-header высотой 44px со space-between и тело .pw-body с колонками 140px и 1fr (gap 12px).',
    specs: [
      'Добавь на .pw-header классы: h-11 flex justify-between items-center',
      'Добавь на .pw-body классы: grid grid-cols-[140px_1fr] gap-3'
    ],
    starterHtml: '<div class="pw-report bg-slate-900 text-slate-50 p-3 rounded-xl">\n  <header class="pw-header border-b border-slate-700 mb-3 text-xs">\n    <strong>checkout.spec.ts</strong>\n    <span>3 passed (1.2s)</span>\n  </header>\n  <div class="pw-body">\n    <aside class="pw-steps bg-slate-800 p-3 rounded-lg text-xs">1. page.goto<br/>2. click #pay</aside>\n    <section class="pw-screen bg-slate-800 p-3 rounded-lg text-xs">Скриншот 1280×720</section>\n  </div>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="pw-report bg-slate-900 text-slate-50 p-3 rounded-xl">\n  <header class="pw-header h-11 flex justify-between items-center border-b border-slate-700 mb-3 text-xs">\n    <strong>checkout.spec.ts</strong>\n    <span>3 passed (1.2s)</span>\n  </header>\n  <div class="pw-body grid grid-cols-[140px_1fr] gap-3">\n    <aside class="pw-steps bg-slate-800 p-3 rounded-lg text-xs">1. page.goto<br/>2. click #pay</aside>\n    <section class="pw-screen bg-slate-800 p-3 rounded-lg text-xs">Скриншот 1280×720</section>\n  </div>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: '44px в Tailwind — это класс h-11.' },
      { tier: 2, text: 'Для сетки 140px и 1fr используй grid grid-cols-[140px_1fr] gap-3.' },
      { tier: 3, text: 'На .pw-header добавь h-11 flex justify-between items-center, на .pw-body — grid grid-cols-[140px_1fr] gap-3.' }
    ],
    checks: [
      { type: 'boundingRect', name: 'Высота .pw-header равна 44px (h-11)', selector: '.pw-header', property: 'height', expected: 44, tolerance: 2 },
      { type: 'computedStyle', name: '.pw-body использует grid', selector: '.pw-body', property: 'display', expected: 'grid' },
      { type: 'boundingRect', name: 'Ширина .pw-steps равна 140px', selector: '.pw-steps', property: 'width', expected: 140, tolerance: 2 }
    ],
    solution: '<div class="pw-report bg-slate-900 text-slate-50 p-3 rounded-xl">\n  <header class="pw-header h-11 flex justify-between items-center border-b border-slate-700 mb-3 text-xs">\n    <strong>checkout.spec.ts</strong>\n    <span>3 passed (1.2s)</span>\n  </header>\n  <div class="pw-body grid grid-cols-[140px_1fr] gap-3">\n    <aside class="pw-steps bg-slate-800 p-3 rounded-lg text-xs">1. page.goto<br/>2. click #pay</aside>\n    <section class="pw-screen bg-slate-800 p-3 rounded-lg text-xs">Скриншот 1280×720</section>\n  </div>\n</div>'
  },

  // ================= LEVEL 5 (Prisma Studio, Redis, Express UI) =================
  {
    id: 'layout-501-prisma-row',
    title: 'Prisma Studio: строка записи PostgreSQL на Tailwind Grid',
    track: 'layout',
    level: 5,
    isBoss: false,
    topic: 'prisma-studio',
    mapTopics: ['Prisma', 'PostgreSQL', 'Tailwind CSS'],
    learn: 'Табличная сетка с фиксированными и резиновыми колонками grid-cols-[60px_1fr_90px].',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Выстрой строку БД .db-row в 3 колонки (60px, 1fr, 90px) с отступом 12px и выравниванием по центру.',
    specs: [
      'Добавь на .db-row классы: grid grid-cols-[60px_1fr_90px] gap-3 items-center'
    ],
    starterHtml: '<div class="db-row bg-slate-800 text-slate-50 p-3 rounded-lg text-xs">\n  <span class="id text-slate-400 font-mono">#42</span>\n  <span class="email">daniela@dojo.dev</span>\n  <span class="role bg-sky-400 text-slate-900 text-center py-1 px-1.5 rounded font-bold">ADMIN</span>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="db-row grid grid-cols-[60px_1fr_90px] gap-3 items-center bg-slate-800 text-slate-50 p-3 rounded-lg text-xs">\n  <span class="id text-slate-400 font-mono">#42</span>\n  <span class="email">daniela@dojo.dev</span>\n  <span class="role bg-sky-400 text-slate-900 text-center py-1 px-1.5 rounded font-bold">ADMIN</span>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'Три колонки задаются через grid-cols-[60px_1fr_90px].' },
      { tier: 2, text: 'Промежуток 12px — это gap-3.' },
      { tier: 3, text: 'Добавь к .db-row: grid grid-cols-[60px_1fr_90px] gap-3 items-center.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.db-row использует grid', selector: '.db-row', property: 'display', expected: 'grid' },
      { type: 'boundingRect', name: 'Ширина колонки .id 60px', selector: '.id', property: 'width', expected: 60, tolerance: 2 },
      { type: 'boundingRect', name: 'Ширина колонки .role 90px', selector: '.role', property: 'width', expected: 90, tolerance: 2 }
    ],
    solution: '<div class="db-row grid grid-cols-[60px_1fr_90px] gap-3 items-center bg-slate-800 text-slate-50 p-3 rounded-lg text-xs">\n  <span class="id text-slate-400 font-mono">#42</span>\n  <span class="email">daniela@dojo.dev</span>\n  <span class="role bg-sky-400 text-slate-900 text-center py-1 px-1.5 rounded font-bold">ADMIN</span>\n</div>'
  },
  {
    id: 'layout-502-redis-ttl-card',
    title: 'Redis Insight: карточка кэш-ключа с TTL',
    track: 'layout',
    level: 5,
    isBoss: false,
    topic: 'redis-ui',
    mapTopics: ['Redis', 'Node.js', 'Tailwind CSS'],
    learn: 'Оформление инспектора ключей Redis через p-3.5 flex flex-col gap-2.5.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Оформи карточку .redis-card и шапку .redis-head классами Tailwind.',
    specs: [
      'Добавь на .redis-card классы: p-3.5 flex flex-col gap-2.5 (паддинг 14px, шаг 10px)',
      'Добавь на .redis-head классы: flex justify-between items-center'
    ],
    starterHtml: '<div class="redis-card bg-slate-900 text-slate-50 rounded-[10px]">\n  <div class="redis-head text-xs">\n    <code>session:user:42</code>\n    <span class="text-amber-500 font-bold">TTL: 3600s</span>\n  </div>\n  <div class="bg-slate-800 p-2.5 rounded font-mono text-xs text-sky-400">{"role":"admin","xp":950}</div>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="redis-card p-3.5 flex flex-col gap-2.5 bg-slate-900 text-slate-50 rounded-[10px]">\n  <div class="redis-head flex justify-between items-center text-xs">\n    <code>session:user:42</code>\n    <span class="text-amber-500 font-bold">TTL: 3600s</span>\n  </div>\n  <div class="bg-slate-800 p-2.5 rounded font-mono text-xs text-sky-400">{"role":"admin","xp":950}</div>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: '10px в Tailwind — это 2.5 (gap-2.5), а 14px — это 3.5 (p-3.5).' },
      { tier: 2, text: 'Для разноса в шапке используй flex justify-between items-center.' },
      { tier: 3, text: 'На .redis-card добавь p-3.5 flex flex-col gap-2.5, на .redis-head — flex justify-between items-center.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.redis-card выстроен колонкой', selector: '.redis-card', property: 'flexDirection', expected: 'column' },
      { type: 'computedStyle', name: 'Шаг внутри .redis-card равен 10px (gap-2.5)', selector: '.redis-card', property: 'rowGap', expected: '10px' },
      { type: 'computedStyle', name: 'Разнос в .redis-head', selector: '.redis-head', property: 'justifyContent', expected: 'space-between' }
    ],
    solution: '<div class="redis-card p-3.5 flex flex-col gap-2.5 bg-slate-900 text-slate-50 rounded-[10px]">\n  <div class="redis-head flex justify-between items-center text-xs">\n    <code>session:user:42</code>\n    <span class="text-amber-500 font-bold">TTL: 3600s</span>\n  </div>\n  <div class="bg-slate-800 p-2.5 rounded font-mono text-xs text-sky-400">{"role":"admin","xp":950}</div>\n</div>'
  },
  {
    id: 'layout-503-express-route-badge',
    title: 'Express API: плашка HTTP-эндпоинта',
    track: 'layout',
    level: 5,
    isBoss: false,
    topic: 'express-ui',
    mapTopics: ['Express', 'Node.js', 'Tailwind CSS'],
    learn: 'Фиксированная ширина бейджа метода w-16 (64px) внутри флекс-строки роута.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Оформи строку роута .route-item и бейдж метода .method классами Tailwind.',
    specs: [
      'Добавь на .route-item классы: flex items-center gap-3 p-3',
      'Добавь на .method класс: w-16 (64px)'
    ],
    starterHtml: '<div class="route-item bg-slate-800 text-slate-50 rounded-[10px]">\n  <span class="method bg-emerald-500 text-emerald-950 text-center py-1 rounded font-bold text-xs">POST</span>\n  <code class="flex-1 text-xs">/api/v1/tasks</code>\n  <span class="text-emerald-500 font-bold text-xs">201</span>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="route-item flex items-center gap-3 p-3 bg-slate-800 text-slate-50 rounded-[10px]">\n  <span class="method w-16 bg-emerald-500 text-emerald-950 text-center py-1 rounded font-bold text-xs">POST</span>\n  <code class="flex-1 text-xs">/api/v1/tasks</code>\n  <span class="text-emerald-500 font-bold text-xs">201</span>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: '64px в Tailwind — это w-16 (16 × 4px).' },
      { tier: 2, text: 'Отступ и паддинг по 12px — это gap-3 и p-3.' },
      { tier: 3, text: 'На .route-item добавь flex items-center gap-3 p-3, на .method — w-16.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.route-item использует flex', selector: '.route-item', property: 'display', expected: 'flex' },
      { type: 'computedStyle', name: 'Отступ gap-3 равен 12px', selector: '.route-item', property: 'columnGap', expected: '12px' },
      { type: 'boundingRect', name: 'Ширина .method равна 64px (w-16)', selector: '.method', property: 'width', expected: 64, tolerance: 2 }
    ],
    solution: '<div class="route-item flex items-center gap-3 p-3 bg-slate-800 text-slate-50 rounded-[10px]">\n  <span class="method w-16 bg-emerald-500 text-emerald-950 text-center py-1 rounded font-bold text-xs">POST</span>\n  <code class="flex-1 text-xs">/api/v1/tasks</code>\n  <span class="text-emerald-500 font-bold text-xs">201</span>\n</div>'
  },
  {
    id: 'layout-504-boss-prisma-explorer',
    title: 'Босс: Панель Prisma Studio (Toolbar + Data Grid)',
    track: 'layout',
    level: 5,
    isBoss: true,
    topic: 'prisma-boss',
    mapTopics: ['Prisma', 'PostgreSQL', 'Tailwind CSS'],
    learn: 'Комбинирование тулбара h-12 и трёхколоночной сетки БД grid-cols-[80px_1fr_100px].',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Собери интерфейс Prisma Studio классами Tailwind: шапка .studio-bar высотой 48px со space-between и сетка .studio-grid с колонками 80px, 1fr, 100px и шагом 8px.',
    specs: [
      'Добавь на .studio-bar классы: h-12 flex justify-between items-center',
      'Добавь на .studio-grid классы: grid grid-cols-[80px_1fr_100px] gap-2'
    ],
    starterHtml: '<div class="studio bg-slate-900 text-slate-50 p-3.5 rounded-xl">\n  <header class="studio-bar text-xs">\n    <strong>Table: User</strong>\n    <span>Rows: 128</span>\n  </header>\n  <div class="studio-grid">\n    <div class="bg-slate-800 p-2 rounded text-xs font-mono">id</div>\n    <div class="bg-slate-800 p-2 rounded text-xs font-mono">email</div>\n    <div class="bg-slate-800 p-2 rounded text-xs font-mono">status</div>\n  </div>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="studio bg-slate-900 text-slate-50 p-3.5 rounded-xl">\n  <header class="studio-bar h-12 flex justify-between items-center text-xs">\n    <strong>Table: User</strong>\n    <span>Rows: 128</span>\n  </header>\n  <div class="studio-grid grid grid-cols-[80px_1fr_100px] gap-2">\n    <div class="bg-slate-800 p-2 rounded text-xs font-mono">id</div>\n    <div class="bg-slate-800 p-2 rounded text-xs font-mono">email</div>\n    <div class="bg-slate-800 p-2 rounded text-xs font-mono">status</div>\n  </div>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'Высота 48px — это h-12, а шаг 8px — это gap-2.' },
      { tier: 2, text: 'Колонки таблицы: grid-cols-[80px_1fr_100px].' },
      { tier: 3, text: 'На .studio-bar добавь h-12 flex justify-between items-center, на .studio-grid — grid grid-cols-[80px_1fr_100px] gap-2.' }
    ],
    checks: [
      { type: 'boundingRect', name: 'Высота .studio-bar 48px (h-12)', selector: '.studio-bar', property: 'height', expected: 48, tolerance: 2 },
      { type: 'computedStyle', name: '.studio-grid использует grid', selector: '.studio-grid', property: 'display', expected: 'grid' },
      { type: 'computedStyle', name: 'Промежуток в .studio-grid равен 8px (gap-2)', selector: '.studio-grid', property: 'columnGap', expected: '8px' }
    ],
    solution: '<div class="studio bg-slate-900 text-slate-50 p-3.5 rounded-xl">\n  <header class="studio-bar h-12 flex justify-between items-center text-xs">\n    <strong>Table: User</strong>\n    <span>Rows: 128</span>\n  </header>\n  <div class="studio-grid grid grid-cols-[80px_1fr_100px] gap-2">\n    <div class="bg-slate-800 p-2 rounded text-xs font-mono">id</div>\n    <div class="bg-slate-800 p-2 rounded text-xs font-mono">email</div>\n    <div class="bg-slate-800 p-2 rounded text-xs font-mono">status</div>\n  </div>\n</div>'
  },

  // ================= LEVEL 6 (FastAPI, Pydantic, Alembic UI) =================
  {
    id: 'layout-601-fastapi-swagger',
    title: 'FastAPI Swagger UI: строка GET-эндпоинта',
    track: 'layout',
    level: 6,
    isBoss: false,
    topic: 'fastapi-ui',
    mapTopics: ['FastAPI', 'Python', 'Tailwind CSS'],
    learn: 'Оформление плашки OpenAPI-операции через flex items-center gap-3 p-2.5 rounded-lg.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Оформи блок эндпоинта .swagger-op классами Tailwind: флекс по центру, шаг 12px, паддинг 10px и скругление 8px.',
    specs: [
      'Добавь на .swagger-op классы: flex items-center gap-3 p-2.5 rounded-lg'
    ],
    starterHtml: '<div class="swagger-op bg-emerald-900 border border-emerald-500 text-slate-50">\n  <span class="bg-emerald-500 text-emerald-950 px-2.5 py-1 rounded font-bold text-xs">GET</span>\n  <code class="text-xs">/items/{item_id}</code>\n  <span class="text-emerald-300 text-xs">Read Item</span>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="swagger-op flex items-center gap-3 p-2.5 rounded-lg bg-emerald-900 border border-emerald-500 text-slate-50">\n  <span class="bg-emerald-500 text-emerald-950 px-2.5 py-1 rounded font-bold text-xs">GET</span>\n  <code class="text-xs">/items/{item_id}</code>\n  <span class="text-emerald-300 text-xs">Read Item</span>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: '10px в Tailwind — это p-2.5, а 8px скругления — rounded-lg.' },
      { tier: 2, text: 'Отступ 12px между элементами — gap-3.' },
      { tier: 3, text: 'Добавь к .swagger-op: flex items-center gap-3 p-2.5 rounded-lg.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.swagger-op использует flex', selector: '.swagger-op', property: 'display', expected: 'flex' },
      { type: 'computedStyle', name: 'Промежуток gap-3 равен 12px', selector: '.swagger-op', property: 'columnGap', expected: '12px' },
      { type: 'computedStyle', name: 'Скругление rounded-lg (8px)', selector: '.swagger-op', property: 'borderTopLeftRadius', expected: '8px' }
    ],
    solution: '<div class="swagger-op flex items-center gap-3 p-2.5 rounded-lg bg-emerald-900 border border-emerald-500 text-slate-50">\n  <span class="bg-emerald-500 text-emerald-950 px-2.5 py-1 rounded font-bold text-xs">GET</span>\n  <code class="text-xs">/items/{item_id}</code>\n  <span class="text-emerald-300 text-xs">Read Item</span>\n</div>'
  },
  {
    id: 'layout-602-pydantic-schema',
    title: 'Pydantic BaseModel: сетка полей JSON-схемы',
    track: 'layout',
    level: 6,
    isBoss: false,
    topic: 'pydantic-ui',
    mapTopics: ['Pydantic', 'FastAPI', 'Tailwind CSS'],
    learn: 'Двухколоночная сетка для схемы данных grid grid-cols-[120px_1fr] gap-2 p-3.5.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Выстрой поля модели Pydantic в сетку .schema-grid из 2 колонок (120px и 1fr) с отступом 8px и паддингом 14px.',
    specs: [
      'Добавь на .schema-grid классы: grid grid-cols-[120px_1fr] gap-2 p-3.5'
    ],
    starterHtml: '<div class="schema-grid bg-slate-800 text-slate-50 rounded-[10px] text-xs">\n  <div class="field-name font-mono text-sky-400 font-bold">username*</div>\n  <div class="text-slate-300">str (min_length=3)</div>\n  <div class="field-name font-mono text-sky-400 font-bold">is_active</div>\n  <div class="text-slate-300">bool = True</div>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="schema-grid grid grid-cols-[120px_1fr] gap-2 p-3.5 bg-slate-800 text-slate-50 rounded-[10px] text-xs">\n  <div class="field-name font-mono text-sky-400 font-bold">username*</div>\n  <div class="text-slate-300">str (min_length=3)</div>\n  <div class="field-name font-mono text-sky-400 font-bold">is_active</div>\n  <div class="text-slate-300">bool = True</div>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'Колонки 120px и 1fr задаются классом grid-cols-[120px_1fr].' },
      { tier: 2, text: 'gap-2 = 8px, p-3.5 = 14px.' },
      { tier: 3, text: 'Добавь к .schema-grid: grid grid-cols-[120px_1fr] gap-2 p-3.5.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.schema-grid использует grid', selector: '.schema-grid', property: 'display', expected: 'grid' },
      { type: 'boundingRect', name: 'Первая колонка шириной 120px', selector: '.field-name', property: 'width', expected: 120, tolerance: 2 },
      { type: 'computedStyle', name: 'Внутренний отступ p-3.5 (14px)', selector: '.schema-grid', property: 'paddingTop', expected: '14px' }
    ],
    solution: '<div class="schema-grid grid grid-cols-[120px_1fr] gap-2 p-3.5 bg-slate-800 text-slate-50 rounded-[10px] text-xs">\n  <div class="field-name font-mono text-sky-400 font-bold">username*</div>\n  <div class="text-slate-300">str (min_length=3)</div>\n  <div class="field-name font-mono text-sky-400 font-bold">is_active</div>\n  <div class="text-slate-300">bool = True</div>\n</div>'
  },
  {
    id: 'layout-603-alembic-revision',
    title: 'Alembic Migration: карточка ревизии БД',
    track: 'layout',
    level: 6,
    isBoss: false,
    topic: 'alembic-ui',
    mapTopics: ['Alembic', 'SQLAlchemy', 'Tailwind CSS'],
    learn: 'Оформление плашки ревизии миграции p-3 rounded-lg flex justify-between items-center.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Оформи карточку миграции .rev-card классами Tailwind: паддинг 12px, скругление 8px, флекс с разносом по краям и центрированием.',
    specs: [
      'Добавь на .rev-card классы: p-3 rounded-lg flex justify-between items-center'
    ],
    starterHtml: '<div class="rev-card bg-slate-900 text-slate-50 border-l-4 border-sky-400">\n  <div>\n    <strong class="text-xs">add_users_table</strong>\n    <div class="text-xs text-slate-400 font-mono mt-1">rev: 8f1a2b3c -> head</div>\n  </div>\n  <span class="bg-sky-500 text-white px-2 py-1 rounded text-xs font-bold">APPLIED</span>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="rev-card p-3 rounded-lg flex justify-between items-center bg-slate-900 text-slate-50 border-l-4 border-sky-400">\n  <div>\n    <strong class="text-xs">add_users_table</strong>\n    <div class="text-xs text-slate-400 font-mono mt-1">rev: 8f1a2b3c -> head</div>\n  </div>\n  <span class="bg-sky-500 text-white px-2 py-1 rounded text-xs font-bold">APPLIED</span>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'p-3 = 12px, rounded-lg = 8px.' },
      { tier: 2, text: 'Разнос по краям: flex justify-between items-center.' },
      { tier: 3, text: 'Добавь к .rev-card: p-3 rounded-lg flex justify-between items-center.' }
    ],
    checks: [
      { type: 'computedStyle', name: 'Разнос justify-between', selector: '.rev-card', property: 'justifyContent', expected: 'space-between' },
      { type: 'computedStyle', name: 'Выравнивание items-center', selector: '.rev-card', property: 'alignItems', expected: 'center' },
      { type: 'computedStyle', name: 'Отступ p-3 равен 12px', selector: '.rev-card', property: 'paddingTop', expected: '12px' }
    ],
    solution: '<div class="rev-card p-3 rounded-lg flex justify-between items-center bg-slate-900 text-slate-50 border-l-4 border-sky-400">\n  <div>\n    <strong class="text-xs">add_users_table</strong>\n    <div class="text-xs text-slate-400 font-mono mt-1">rev: 8f1a2b3c -> head</div>\n  </div>\n  <span class="bg-sky-500 text-white px-2 py-1 rounded text-xs font-bold">APPLIED</span>\n</div>'
  },
  {
    id: 'layout-604-boss-fastapi-inspector',
    title: 'Босс: Документация эндпоинта FastAPI (200 OK / 422 Error)',
    track: 'layout',
    level: 6,
    isBoss: true,
    topic: 'fastapi-boss',
    mapTopics: ['FastAPI', 'Pydantic', 'Tailwind CSS'],
    learn: 'Сборка карточки документации API с флекс-колонкой и двухколоночным блоком кодов ответа.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Оформи карточку .api-doc и секцию ответов .responses классами Tailwind.',
    specs: [
      'Добавь на .api-doc классы: p-4 flex flex-col gap-3',
      'Добавь на .responses классы: grid grid-cols-2 gap-2.5'
    ],
    starterHtml: '<section class="api-doc bg-slate-900 text-slate-50 rounded-xl">\n  <header class="font-mono font-bold text-xs">POST /api/users (UserCreate)</header>\n  <div class="responses">\n    <div class="p-2.5 rounded-lg text-xs font-semibold bg-emerald-900 text-emerald-300">200 OK · UserOut</div>\n    <div class="p-2.5 rounded-lg text-xs font-semibold bg-red-900 text-red-300">422 Validation Error</div>\n  </div>\n</section>\n',
    starterCss: '',
    targetHtml: '<section class="api-doc p-4 flex flex-col gap-3 bg-slate-900 text-slate-50 rounded-xl">\n  <header class="font-mono font-bold text-xs">POST /api/users (UserCreate)</header>\n  <div class="responses grid grid-cols-2 gap-2.5">\n    <div class="p-2.5 rounded-lg text-xs font-semibold bg-emerald-900 text-emerald-300">200 OK · UserOut</div>\n    <div class="p-2.5 rounded-lg text-xs font-semibold bg-red-900 text-red-300">422 Validation Error</div>\n  </div>\n</section>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'p-4 = 16px, gap-3 = 12px, gap-2.5 = 10px.' },
      { tier: 2, text: 'Две равные колонки: grid grid-cols-2.' },
      { tier: 3, text: 'На .api-doc добавь p-4 flex flex-col gap-3, на .responses — grid grid-cols-2 gap-2.5.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.api-doc выстроен колонкой', selector: '.api-doc', property: 'flexDirection', expected: 'column' },
      { type: 'computedStyle', name: 'Шаг внутри .api-doc равен 12px (gap-3)', selector: '.api-doc', property: 'rowGap', expected: '12px' },
      { type: 'computedStyle', name: '.responses использует grid', selector: '.responses', property: 'display', expected: 'grid' },
      { type: 'computedStyle', name: 'Промежуток в .responses равен 10px (gap-2.5)', selector: '.responses', property: 'columnGap', expected: '10px' }
    ],
    solution: '<section class="api-doc p-4 flex flex-col gap-3 bg-slate-900 text-slate-50 rounded-xl">\n  <header class="font-mono font-bold text-xs">POST /api/users (UserCreate)</header>\n  <div class="responses grid grid-cols-2 gap-2.5">\n    <div class="p-2.5 rounded-lg text-xs font-semibold bg-emerald-900 text-emerald-300">200 OK · UserOut</div>\n    <div class="p-2.5 rounded-lg text-xs font-semibold bg-red-900 text-red-300">422 Validation Error</div>\n  </div>\n</section>'
  },

  // ================= LEVEL 7 (GitHub Actions, Sentry, Docker, AWS/Vercel UI) =================
  {
    id: 'layout-701-gh-actions-pipeline',
    title: 'GitHub Actions: пайплайн из 3 джобов на Tailwind Grid',
    track: 'layout',
    level: 7,
    isBoss: false,
    topic: 'ci-cd-ui',
    mapTopics: ['GitHub Actions', 'Docker', 'Tailwind CSS'],
    learn: 'Сетка из 3 равных колонок grid grid-cols-3 gap-2.5.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Выстрой 3 шага пайплайна .pipeline в 3 равные колонки с промежутком 10px классами Tailwind.',
    specs: [
      'Добавь на .pipeline классы: grid grid-cols-3 gap-2.5'
    ],
    starterHtml: '<div class="pipeline">\n  <div class="job bg-emerald-900 text-emerald-300 p-3 rounded-lg text-center font-bold text-xs">1. Lint ✔</div>\n  <div class="job bg-emerald-900 text-emerald-300 p-3 rounded-lg text-center font-bold text-xs">2. Vitest ✔</div>\n  <div class="job bg-emerald-900 text-emerald-300 p-3 rounded-lg text-center font-bold text-xs">3. Deploy ✔</div>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="pipeline grid grid-cols-3 gap-2.5">\n  <div class="job bg-emerald-900 text-emerald-300 p-3 rounded-lg text-center font-bold text-xs">1. Lint ✔</div>\n  <div class="job bg-emerald-900 text-emerald-300 p-3 rounded-lg text-center font-bold text-xs">2. Vitest ✔</div>\n  <div class="job bg-emerald-900 text-emerald-300 p-3 rounded-lg text-center font-bold text-xs">3. Deploy ✔</div>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'Три равные колонки в Tailwind — это grid-cols-3.' },
      { tier: 2, text: 'Отступ 10px — это gap-2.5.' },
      { tier: 3, text: 'Добавь к .pipeline: grid grid-cols-3 gap-2.5.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.pipeline использует grid', selector: '.pipeline', property: 'display', expected: 'grid' },
      { type: 'computedStyle', name: 'Отступ gap-2.5 равен 10px', selector: '.pipeline', property: 'columnGap', expected: '10px' },
      { type: 'selector', name: 'Три шага .job внутри .pipeline', selector: '.pipeline .job', minCount: 3 }
    ],
    solution: '<div class="pipeline grid grid-cols-3 gap-2.5">\n  <div class="job bg-emerald-900 text-emerald-300 p-3 rounded-lg text-center font-bold text-xs">1. Lint ✔</div>\n  <div class="job bg-emerald-900 text-emerald-300 p-3 rounded-lg text-center font-bold text-xs">2. Vitest ✔</div>\n  <div class="job bg-emerald-900 text-emerald-300 p-3 rounded-lg text-center font-bold text-xs">3. Deploy ✔</div>\n</div>'
  },
  {
    id: 'layout-702-sentry-issue-card',
    title: 'Sentry Issue: карточка перехваченного исключения',
    track: 'layout',
    level: 7,
    isBoss: false,
    topic: 'sentry-ui',
    mapTopics: ['Sentry', 'Tailwind CSS'],
    learn: 'Оформление карточки инцидента p-3.5 flex flex-col gap-2 и шапки со space-between.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Оформи карточку инцидента .sentry-card и верхнюю строку .sentry-top классами Tailwind.',
    specs: [
      'Добавь на .sentry-card классы: p-3.5 flex flex-col gap-2',
      'Добавь на .sentry-top классы: flex justify-between items-center'
    ],
    starterHtml: '<div class="sentry-card bg-indigo-950 text-slate-50 border border-indigo-500 rounded-[10px]">\n  <div class="sentry-top text-xs">\n    <strong>TypeError: Cannot read properties</strong>\n    <span class="bg-red-500 px-2 py-0.5 rounded-full text-xs font-bold">42 events</span>\n  </div>\n  <pre class="m-0 bg-slate-900 p-2 rounded text-xs text-slate-300">at AppShell (AppShell.tsx:142:18)</pre>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="sentry-card p-3.5 flex flex-col gap-2 bg-indigo-950 text-slate-50 border border-indigo-500 rounded-[10px]">\n  <div class="sentry-top flex justify-between items-center text-xs">\n    <strong>TypeError: Cannot read properties</strong>\n    <span class="bg-red-500 px-2 py-0.5 rounded-full text-xs font-bold">42 events</span>\n  </div>\n  <pre class="m-0 bg-slate-900 p-2 rounded text-xs text-slate-300">at AppShell (AppShell.tsx:142:18)</pre>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'p-3.5 = 14px, gap-2 = 8px.' },
      { tier: 2, text: 'Для верхней строки используй flex justify-between items-center.' },
      { tier: 3, text: 'На .sentry-card добавь p-3.5 flex flex-col gap-2, на .sentry-top — flex justify-between items-center.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.sentry-card выстроен колонкой', selector: '.sentry-card', property: 'flexDirection', expected: 'column' },
      { type: 'computedStyle', name: 'Шаг внутри .sentry-card равен 8px (gap-2)', selector: '.sentry-card', property: 'rowGap', expected: '8px' },
      { type: 'computedStyle', name: 'Разнос в .sentry-top', selector: '.sentry-top', property: 'justifyContent', expected: 'space-between' }
    ],
    solution: '<div class="sentry-card p-3.5 flex flex-col gap-2 bg-indigo-950 text-slate-50 border border-indigo-500 rounded-[10px]">\n  <div class="sentry-top flex justify-between items-center text-xs">\n    <strong>TypeError: Cannot read properties</strong>\n    <span class="bg-red-500 px-2 py-0.5 rounded-full text-xs font-bold">42 events</span>\n  </div>\n  <pre class="m-0 bg-slate-900 p-2 rounded text-xs text-slate-300">at AppShell (AppShell.tsx:142:18)</pre>\n</div>'
  },
  {
    id: 'layout-703-docker-metrics',
    title: 'Docker & AWS: виджет нагрузки контейнера',
    track: 'layout',
    level: 7,
    isBoss: false,
    topic: 'docker-ui',
    mapTopics: ['Docker', 'AWS', 'Linux', 'Tailwind CSS'],
    learn: 'Фиксированная высота h-[84px] с вертикальным разносом flex flex-col justify-between.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Задай карточке .container-metric высоту 84px, паддинг 14px и флекс-колонку со space-between.',
    specs: [
      'Добавь на .container-metric классы: h-[84px] p-3.5 flex flex-col justify-between'
    ],
    starterHtml: '<div class="container-metric bg-slate-900 text-slate-50 rounded-[10px]">\n  <div class="text-xs font-semibold">nginx-proxy · CPU 35%</div>\n  <div class="h-2 bg-slate-700 rounded-full overflow-hidden">\n    <div class="w-[35%] h-full bg-sky-400"></div>\n  </div>\n</div>\n',
    starterCss: '',
    targetHtml: '<div class="container-metric h-[84px] p-3.5 flex flex-col justify-between bg-slate-900 text-slate-50 rounded-[10px]">\n  <div class="text-xs font-semibold">nginx-proxy · CPU 35%</div>\n  <div class="h-2 bg-slate-700 rounded-full overflow-hidden">\n    <div class="w-[35%] h-full bg-sky-400"></div>\n  </div>\n</div>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'Нестандартная высота 84px пишется как h-[84px].' },
      { tier: 2, text: 'Паддинг 14px — это p-3.5.' },
      { tier: 3, text: 'Добавь к .container-metric: h-[84px] p-3.5 flex flex-col justify-between.' }
    ],
    checks: [
      { type: 'boundingRect', name: 'Высота .container-metric 84px', selector: '.container-metric', property: 'height', expected: 84, tolerance: 2 },
      { type: 'computedStyle', name: 'Флекс-колонка (flex-col)', selector: '.container-metric', property: 'flexDirection', expected: 'column' },
      { type: 'computedStyle', name: 'Разнос по краям (justify-between)', selector: '.container-metric', property: 'justifyContent', expected: 'space-between' }
    ],
    solution: '<div class="container-metric h-[84px] p-3.5 flex flex-col justify-between bg-slate-900 text-slate-50 rounded-[10px]">\n  <div class="text-xs font-semibold">nginx-proxy · CPU 35%</div>\n  <div class="h-2 bg-slate-700 rounded-full overflow-hidden">\n    <div class="w-[35%] h-full bg-sky-400"></div>\n  </div>\n</div>'
  },
  {
    id: 'layout-704-boss-devops-center',
    title: 'Босс: Production Control Center (AWS + Vercel + Docker + Sentry)',
    track: 'layout',
    level: 7,
    isBoss: true,
    topic: 'devops-boss',
    mapTopics: ['Docker', 'Nginx', 'AWS', 'Vercel', 'Sentry', 'Tailwind CSS'],
    learn: 'Финальный босс Tailwind-вёрстки: дашборд мониторинга кластера с шапкой h-12 и сеткой узлов grid-cols-2.',
    needsDom: true,
    codeLanguage: 'tailwind',
    prompt: 'Собери дашборд продакшена классами Tailwind: шапка .ops-bar высотой 48px со space-between и сетка .cluster-grid из 2 колонок с отступом 12px.',
    specs: [
      'Добавь на .ops-bar классы: h-12 flex justify-between items-center',
      'Добавь на .cluster-grid классы: grid grid-cols-2 gap-3'
    ],
    starterHtml: '<section class="ops-center bg-slate-900 text-slate-50 p-3.5 rounded-xl">\n  <header class="ops-bar text-xs">\n    <strong>⚡ Production Cluster (AWS eu-central-1)</strong>\n    <span class="text-emerald-400 font-bold">99.98% Uptime</span>\n  </header>\n  <div class="cluster-grid">\n    <div class="bg-slate-800 p-3 rounded-lg text-xs font-semibold">Vercel Edge · OK</div>\n    <div class="bg-slate-800 p-3 rounded-lg text-xs font-semibold">Docker API · OK</div>\n    <div class="bg-slate-800 p-3 rounded-lg text-xs font-semibold">Postgres Primary · OK</div>\n    <div class="bg-slate-800 p-3 rounded-lg text-xs font-semibold">Sentry 0 unresolved</div>\n  </div>\n</section>\n',
    starterCss: '',
    targetHtml: '<section class="ops-center bg-slate-900 text-slate-50 p-3.5 rounded-xl">\n  <header class="ops-bar h-12 flex justify-between items-center text-xs">\n    <strong>⚡ Production Cluster (AWS eu-central-1)</strong>\n    <span class="text-emerald-400 font-bold">99.98% Uptime</span>\n  </header>\n  <div class="cluster-grid grid grid-cols-2 gap-3">\n    <div class="bg-slate-800 p-3 rounded-lg text-xs font-semibold">Vercel Edge · OK</div>\n    <div class="bg-slate-800 p-3 rounded-lg text-xs font-semibold">Docker API · OK</div>\n    <div class="bg-slate-800 p-3 rounded-lg text-xs font-semibold">Postgres Primary · OK</div>\n    <div class="bg-slate-800 p-3 rounded-lg text-xs font-semibold">Sentry 0 unresolved</div>\n  </div>\n</section>',
    targetCss: '',
    hints: [
      { tier: 1, text: 'Высота 48px — это h-12, а шаг 12px — это gap-3.' },
      { tier: 2, text: 'Две равные колонки: grid grid-cols-2.' },
      { tier: 3, text: 'На .ops-bar добавь h-12 flex justify-between items-center, на .cluster-grid — grid grid-cols-2 gap-3.' }
    ],
    checks: [
      { type: 'boundingRect', name: 'Высота .ops-bar равна 48px (h-12)', selector: '.ops-bar', property: 'height', expected: 48, tolerance: 2 },
      { type: 'computedStyle', name: '.cluster-grid использует grid', selector: '.cluster-grid', property: 'display', expected: 'grid' },
      { type: 'computedStyle', name: 'Промежуток в .cluster-grid равен 12px (gap-3)', selector: '.cluster-grid', property: 'columnGap', expected: '12px' }
    ],
    solution: '<section class="ops-center bg-slate-900 text-slate-50 p-3.5 rounded-xl">\n  <header class="ops-bar h-12 flex justify-between items-center text-xs">\n    <strong>⚡ Production Cluster (AWS eu-central-1)</strong>\n    <span class="text-emerald-400 font-bold">99.98% Uptime</span>\n  </header>\n  <div class="cluster-grid grid grid-cols-2 gap-3">\n    <div class="bg-slate-800 p-3 rounded-lg text-xs font-semibold">Vercel Edge · OK</div>\n    <div class="bg-slate-800 p-3 rounded-lg text-xs font-semibold">Docker API · OK</div>\n    <div class="bg-slate-800 p-3 rounded-lg text-xs font-semibold">Postgres Primary · OK</div>\n    <div class="bg-slate-800 p-3 rounded-lg text-xs font-semibold">Sentry 0 unresolved</div>\n  </div>\n</section>'
  }
];

const logicTasks = [
  // ================= LEVEL 2 (TypeScript, Tailwind cn, Vite, ESLint, Prettier) =================
  {
    id: 'js-201-cn-helper',
    title: 'TypeScript + Tailwind: типизированный хелпер cn()',
    track: 'logic',
    level: 2,
    isBoss: false,
    topic: 'tailwind-utils',
    mapTopics: ['TypeScript', 'Tailwind CSS', 'shadcn/ui'],
    learn: 'Типизация union-массива ClassValue[] в TypeScript и фильтрация классов для Tailwind.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Объяви тип `type ClassValue = string | false | null | undefined;` и напиши типизированную функцию `function cn(inputs: ClassValue[]): string`, которая склеивает только непустые строковые классы через пробел.',
    specs: [
      'Обязательно объяви type ClassValue и типизируй параметр inputs: ClassValue[] и возврат : string',
      'Пустые строки, false, null и undefined должны отфильтровываться'
    ],
    starterJs: 'type ClassValue = string | false | null | undefined;\n\nfunction cn(inputs: ClassValue[]): string {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Используй inputs.filter(...) и join(" ").' },
      { tier: 2, text: 'Проверяй typeof x === "string" && x.trim().length > 0.' },
      { tier: 3, text: 'return inputs.filter((x) => typeof x === "string" && x.trim().length > 0).join(" ");' }
    ],
    codeChecks: [
      { name: 'Объявлен union-тип ClassValue', pattern: 'type\\s+ClassValue\\s*=', expectedHint: 'type ClassValue = ...' },
      { name: 'Типизирована сигнатура cn(inputs: ClassValue[]): string', pattern: 'function\\s+cn\\s*\\(\\s*\\w+\\s*:\\s*ClassValue\\[\\]\\s*\\)\\s*:\\s*string', expectedHint: 'function cn(inputs: ClassValue[]): string' }
    ],
    tests: [
      { name: 'склейка классов Tailwind', call: 'cn(["px-4", false, "py-2", null, "bg-sky-500"])', expected: 'px-4 py-2 bg-sky-500' },
      { name: 'все значения пустые', call: 'cn([false, null, undefined, ""])', expected: '' }
    ],
    solution: 'type ClassValue = string | false | null | undefined;\n\nfunction cn(inputs: ClassValue[]): string {\n  return inputs.filter((x) => typeof x === "string" && x.trim().length > 0).join(" ");\n}'
  },
  {
    id: 'js-202-immutable-patch',
    title: 'TypeScript Interfaces & Partial<T>: обновление конфига',
    track: 'logic',
    level: 2,
    isBoss: false,
    topic: 'ts-interfaces',
    mapTopics: ['TypeScript', 'Immutability'],
    learn: 'Объявление interface в TypeScript и использование встроенного утилитарного типа Partial<T>.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Объяви `interface AppConfig { port: number; host: string; }` и напиши функцию `function patchConfig(config: AppConfig, patch: Partial<AppConfig>): AppConfig`, возвращающую новый объект с применённым патчем.',
    specs: [
      'Используй interface AppConfig и тип Partial<AppConfig>',
      'Верни новый объект через spread-оператор { ...config, ...patch }'
    ],
    starterJs: 'interface AppConfig {\n  port: number;\n  host: string;\n}\n\nfunction patchConfig(config: AppConfig, patch: Partial<AppConfig>): AppConfig {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Утилита Partial<AppConfig> делает все поля интерфейса необязательными.' },
      { tier: 2, text: 'MDN / TS Handbook: https://www.typescriptlang.org/docs/handbook/utility-types.html' },
      { tier: 3, text: 'Верни { ...config, ...patch }.' }
    ],
    codeChecks: [
      { name: 'Объявлен interface AppConfig', pattern: 'interface\\s+AppConfig\\s*\\{', expectedHint: 'interface AppConfig { ... }' },
      { name: 'Использован утилитарный тип Partial<AppConfig>', pattern: 'Partial<AppConfig>', expectedHint: 'patch: Partial<AppConfig>' }
    ],
    tests: [
      { name: 'обновление порта', call: 'patchConfig({ port: 3000, host: "localhost" }, { port: 5173 })', expected: { port: 5173, host: 'localhost' } }
    ],
    solution: 'interface AppConfig {\n  port: number;\n  host: string;\n}\n\nfunction patchConfig(config: AppConfig, patch: Partial<AppConfig>): AppConfig {\n  return { ...config, ...patch };\n}'
  },
  {
    id: 'js-203-vite-cli-flags',
    title: 'Vite Config: настройка алиаса @ и сервера в vite.config.ts',
    track: 'logic',
    level: 2,
    isBoss: false,
    topic: 'vite-config',
    mapTopics: ['Vite', 'TypeScript', 'pnpm'],
    learn: 'Написание функции генерации конфига Vite с секциями server.port и resolve.alias.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши функцию `function createViteConfig(port: number = 5173)`, которая возвращает объект конфига Vite со структурой `{ server: { port, strictPort: true }, resolve: { alias: { "@": "/src" } } }`.',
    specs: [
      'Параметр port типизирован как number и по умолчанию равен 5173',
      'Внутри resolve.alias ключ "@" должен указывать на "/src"'
    ],
    starterJs: 'function createViteConfig(port: number = 5173) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'В Vite алиас настраивается в секции resolve: { alias: { "@": "/src" } }.' },
      { tier: 2, text: 'Документация Vite: https://vite.dev/config/shared-options.html#resolve-alias' },
      { tier: 3, text: 'Верни объект { server: { port, strictPort: true }, resolve: { alias: { "@": "/src" } } }.' }
    ],
    codeChecks: [
      { name: 'Типизирован аргумент port: number', pattern: 'port\\s*:\\s*number', expectedHint: 'port: number = 5173' },
      { name: 'Настроен алиас "@": "/src"', pattern: '["\']@["\']\\s*:\\s*["\']/src["\']', expectedHint: '"@": "/src"' }
    ],
    tests: [
      { name: 'конфиг по умолчанию (5173)', call: 'createViteConfig()', expected: { server: { port: 5173, strictPort: true }, resolve: { alias: { '@': '/src' } } } },
      { name: 'кастомный порт 3000', call: 'createViteConfig(3000)', expected: { server: { port: 3000, strictPort: true }, resolve: { alias: { '@': '/src' } } } }
    ],
    solution: 'function createViteConfig(port: number = 5173) {\n  return {\n    server: { port, strictPort: true },\n    resolve: { alias: { "@": "/src" } },\n  };\n}'
  },
  {
    id: 'js-204-eslint-camelcase',
    title: 'ESLint + Prettier: генератор правил eslint.config.js',
    track: 'logic',
    level: 2,
    isBoss: false,
    topic: 'eslint-rules',
    mapTopics: ['ESLint', 'Prettier', 'TypeScript'],
    learn: 'Настройка правил @typescript-eslint/no-unused-vars и eqeqeq в Flat Config ESLint.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши функцию `function buildEslintRules(isProd: boolean)`, которая возвращает объект правил ESLint: `eqeqeq: "error"`, `"no-console": isProd ? "error" : "warn"` и `"@typescript-eslint/no-unused-vars": "error"`.',
    specs: [
      'В режиме isProd === true правило "no-console" должно быть "error", иначе "warn"',
      'Правила eqeqeq и @typescript-eslint/no-unused-vars всегда равны "error"'
    ],
    starterJs: 'function buildEslintRules(isProd: boolean) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Используй тернарный оператор isProd ? "error" : "warn" для ключа "no-console".' },
      { tier: 2, text: 'Документация ESLint Rules: https://eslint.org/docs/latest/use/configure/rules' },
      { tier: 3, text: 'Верни { eqeqeq: "error", "no-console": isProd ? "error" : "warn", "@typescript-eslint/no-unused-vars": "error" }.' }
    ],
    codeChecks: [
      { name: 'Включено правило @typescript-eslint/no-unused-vars', pattern: '@typescript-eslint/no-unused-vars', expectedHint: '"@typescript-eslint/no-unused-vars": "error"' }
    ],
    tests: [
      { name: 'правила для продакшена', call: 'buildEslintRules(true)', expected: { eqeqeq: 'error', 'no-console': 'error', '@typescript-eslint/no-unused-vars': 'error' } },
      { name: 'правила для разработки', call: 'buildEslintRules(false)', expected: { eqeqeq: 'error', 'no-console': 'warn', '@typescript-eslint/no-unused-vars': 'error' } }
    ],
    solution: 'function buildEslintRules(isProd: boolean) {\n  return {\n    eqeqeq: "error",\n    "no-console": isProd ? "error" : "warn",\n    "@typescript-eslint/no-unused-vars": "error",\n  };\n}'
  },
  {
    id: 'js-205-boss-tsconfig-normalizer',
    title: 'Босс: Строгий tsconfig.json + Prettier конфиг на TypeScript',
    track: 'logic',
    level: 2,
    isBoss: true,
    topic: 'ts-config-boss',
    mapTopics: ['TypeScript', 'Vite', 'ESLint', 'Prettier'],
    learn: 'Конфигурация строгого режима компилятора TypeScript (strict, noUncheckedIndexedAccess) и форматирования Prettier.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши функцию `function createToolingConfig(singleQuote: boolean = true)`, которая возвращает `{ tsconfig: { strict: true, noUncheckedIndexedAccess: true, target: "ES2022" }, prettier: { semi: true, singleQuote, tabWidth: 2 } }`.',
    specs: [
      'В tsconfig обязательно включены strict: true и noUncheckedIndexedAccess: true',
      'В prettier передаётся флаг singleQuote и tabWidth: 2'
    ],
    starterJs: 'function createToolingConfig(singleQuote: boolean = true) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'noUncheckedIndexedAccess защищает от обращения к массиву по несуществующему индексу.' },
      { tier: 2, text: 'Документация TSConfig: https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess' },
      { tier: 3, text: 'Верни вложенный объект с ключами tsconfig и prettier точно по спецификации.' }
    ],
    codeChecks: [
      { name: 'Включён флаг noUncheckedIndexedAccess: true', pattern: 'noUncheckedIndexedAccess\\s*:\\s*true', expectedHint: 'noUncheckedIndexedAccess: true' },
      { name: 'Включён флаг strict: true', pattern: 'strict\\s*:\\s*true', expectedHint: 'strict: true' }
    ],
    tests: [
      { name: 'конфиг по умолчанию', call: 'createToolingConfig()', expected: { tsconfig: { strict: true, noUncheckedIndexedAccess: true, target: 'ES2022' }, prettier: { semi: true, singleQuote: true, tabWidth: 2 } } },
      { name: 'двойные кавычки', call: 'createToolingConfig(false)', expected: { tsconfig: { strict: true, noUncheckedIndexedAccess: true, target: 'ES2022' }, prettier: { semi: true, singleQuote: false, tabWidth: 2 } } }
    ],
    solution: 'function createToolingConfig(singleQuote: boolean = true) {\n  return {\n    tsconfig: {\n      strict: true,\n      noUncheckedIndexedAccess: true,\n      target: "ES2022",\n    },\n    prettier: {\n      semi: true,\n      singleQuote,\n      tabWidth: 2,\n    },\n  };\n}'
  },

  // ================= LEVEL 3 (React, Zustand, TanStack Query, React Hook Form, Zod) =================
  {
    id: 'js-301-zustand-reducer',
    title: 'Zustand: создание типизированного стора create<State>()',
    track: 'logic',
    level: 3,
    isBoss: false,
    topic: 'zustand-store',
    mapTopics: ['Zustand', 'React', 'TypeScript'],
    learn: 'Паттерн create<CounterState>((set) => ({ ... })) в Zustand с иммутабельным обновлением через колбэк set((state) => ...).',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши фабрику стора в стиле Zustand `createCounterStore(set)`, которая возвращает начальное состояние `count: 0` и экшены `inc: () => set((state) => ({ count: state.count + 1 }))` и `reset: () => set({ count: 0 })`.',
    specs: [
      'Внутри inc обязательно используй функциональный апдейт set((state) => ({ count: state.count + 1 }))',
      'Внутри reset вызывай set({ count: 0 })'
    ],
    starterJs: 'interface CounterState {\n  count: number;\n  inc: () => void;\n  reset: () => void;\n}\n\nfunction createCounterStore(set: ( updater: any ) => void): CounterState {\n  return {\n    count: 0,\n    \n  };\n}\n',
    hints: [
      { tier: 1, text: 'В Zustand обновление от предыдущего стейта пишется через set((state) => ({ count: state.count + 1 })).' },
      { tier: 2, text: 'Документация Zustand: https://zustand.docs.pmnd.rs/guides/updating-state' },
      { tier: 3, text: 'Верни { count: 0, inc: () => set((state) => ({ count: state.count + 1 })), reset: () => set({ count: 0 }) }.' }
    ],
    codeChecks: [
      { name: 'Использован колбэк set((state) => ...)', pattern: 'set\\(\\s*\\(?\\s*state\\s*\\)?\\s*=>', expectedHint: 'set((state) => ({ count: state.count + 1 }))' },
      { name: 'Реализован сброс set({ count: 0 })', pattern: 'set\\(\\s*\\{\\s*count\\s*:\\s*0\\s*\\}\\s*\\)', expectedHint: 'set({ count: 0 })' }
    ],
    tests: [
      { name: 'начальный count равен 0', call: 'createCounterStore(() => {}).count', expected: 0 }
    ],
    solution: 'interface CounterState {\n  count: number;\n  inc: () => void;\n  reset: () => void;\n}\n\nfunction createCounterStore(set: (updater: any) => void): CounterState {\n  return {\n    count: 0,\n    inc: () => set((state: CounterState) => ({ count: state.count + 1 })),\n    reset: () => set({ count: 0 }),\n  };\n}'
  },
  {
    id: 'js-302-tanstack-stale',
    title: 'TanStack Query: фабрика queryOptions с queryKey и staleTime',
    track: 'logic',
    level: 3,
    isBoss: false,
    topic: 'tanstack-query',
    mapTopics: ['TanStack Query', 'React', 'TypeScript'],
    learn: 'Формирование объекта конфигурации для useQuery: массив ключей кэша queryKey и время жизни staleTime.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши функцию `function userQueryOptions(userId: string)`, которая возвращает конфигурацию для `useQuery`: `{ queryKey: ["users", userId], staleTime: 60000, enabled: Boolean(userId) }`.',
    specs: [
      'Ключ кэша queryKey должен быть массивом ["users", userId]',
      'Поле enabled должно быть true только если userId не пустой'
    ],
    starterJs: 'function userQueryOptions(userId: string) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'В TanStack Query v5 параметры запроса передаются вторым элементом массива queryKey.' },
      { tier: 2, text: 'Документация TanStack Query: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys' },
      { tier: 3, text: 'Верни { queryKey: ["users", userId], staleTime: 60000, enabled: Boolean(userId) }.' }
    ],
    codeChecks: [
      { name: 'Массив queryKey: ["users", userId]', pattern: 'queryKey\\s*:\\s*\\[\\s*["\']users["\']\\s*,\\s*userId\\s*\\]', expectedHint: 'queryKey: ["users", userId]' },
      { name: 'Задан staleTime: 60000', pattern: 'staleTime\\s*:\\s*60000', expectedHint: 'staleTime: 60000' }
    ],
    tests: [
      { name: 'опции для активного userId', call: 'userQueryOptions("u-42")', expected: { queryKey: ['users', 'u-42'], staleTime: 60000, enabled: true } },
      { name: 'отключён при пустом userId', call: 'userQueryOptions("")', expected: { queryKey: ['users', ''], staleTime: 60000, enabled: false } }
    ],
    solution: 'function userQueryOptions(userId: string) {\n  return {\n    queryKey: ["users", userId],\n    staleTime: 60000,\n    enabled: Boolean(userId),\n  };\n}'
  },
  {
    id: 'js-303-rhf-dirty-fields',
    title: 'React Hook Form: конфигурация useForm с defaultValues и mode',
    track: 'logic',
    level: 3,
    isBoss: false,
    topic: 'react-hook-form',
    mapTopics: ['React Hook Form', 'React', 'TypeScript'],
    learn: 'Настройка хука useForm({ mode: "onBlur", defaultValues }) для контролируемой валидации.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши функцию `function createLoginFormConfig(initialEmail: string = "")`, которая возвращает конфиг для `useForm`: `{ mode: "onBlur", reValidateMode: "onChange", defaultValues: { email: initialEmail, remember: true } }`.',
    specs: [
      'Поле mode должно быть "onBlur", а reValidateMode — "onChange"',
      'Внутри defaultValues задай email и remember: true'
    ],
    starterJs: 'function createLoginFormConfig(initialEmail: string = "") {\n  \n}\n',
    hints: [
      { tier: 1, text: 'React Hook Form требует явных defaultValues для корректного отслеживания dirtyFields.' },
      { tier: 2, text: 'Документация RHF: https://react-hook-form.com/docs/useform' },
      { tier: 3, text: 'Верни { mode: "onBlur", reValidateMode: "onChange", defaultValues: { email: initialEmail, remember: true } }.' }
    ],
    codeChecks: [
      { name: 'Указан mode: "onBlur"', pattern: 'mode\\s*:\\s*["\']onBlur["\']', expectedHint: 'mode: "onBlur"' },
      { name: 'Указан объект defaultValues', pattern: 'defaultValues\\s*:', expectedHint: 'defaultValues: { ... }' }
    ],
    tests: [
      { name: 'конфиг по умолчанию', call: 'createLoginFormConfig()', expected: { mode: 'onBlur', reValidateMode: 'onChange', defaultValues: { email: '', remember: true } } },
      { name: 'с предзаполненным email', call: 'createLoginFormConfig("a@b.c")', expected: { mode: 'onBlur', reValidateMode: 'onChange', defaultValues: { email: 'a@b.c', remember: true } } }
    ],
    solution: 'function createLoginFormConfig(initialEmail: string = "") {\n  return {\n    mode: "onBlur",\n    reValidateMode: "onChange",\n    defaultValues: {\n      email: initialEmail,\n      remember: true,\n    },\n  };\n}'
  },
  {
    id: 'js-304-zod-string-rule',
    title: 'Zod: объявление схемы пользователя z.object()',
    track: 'logic',
    level: 3,
    isBoss: false,
    topic: 'zod-schema',
    mapTopics: ['Zod', 'TypeScript'],
    learn: 'Цепочки валидации в Zod: z.object, z.string().email(), z.string().min(8) и z.number().int().min(18).',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши схему `const RegisterSchema = z.object({ ... })` с тремя полями: `email: z.string().email()`, `password: z.string().min(8)` и `age: z.number().int().min(18)`.',
    specs: [
      'Используй синтаксис z.object({ ... })',
      'Поле email проверяется через .email(), password через .min(8), age через .min(18)'
    ],
    starterJs: 'const RegisterSchema = z.object({\n  \n});\n',
    hints: [
      { tier: 1, text: 'В Zod строковые правила соединяются в цепочку: z.string().email().' },
      { tier: 2, text: 'Документация Zod: https://zod.dev/?id=objects' },
      { tier: 3, text: 'Объяви поля email: z.string().email(), password: z.string().min(8), age: z.number().int().min(18).' }
    ],
    codeChecks: [
      { name: 'Использован конструктор z.object', pattern: 'z\\.object\\s*\\(', expectedHint: 'z.object({ ... })' },
      { name: 'Валидация email: z.string().email()', pattern: 'email\\s*:\\s*z\\.string\\(\\)\\.email\\(\\)', expectedHint: 'email: z.string().email()' },
      { name: 'Валидация password: z.string().min(8)', pattern: 'password\\s*:\\s*z\\.string\\(\\)\\.min\\(8\\)', expectedHint: 'password: z.string().min(8)' },
      { name: 'Валидация age: .min(18)', pattern: 'age\\s*:\\s*z\\.number\\(\\).*\\.min\\(18\\)', expectedHint: 'age: z.number().int().min(18)' }
    ],
    tests: [],
    solution: 'const RegisterSchema = z.object({\n  email: z.string().email(),\n  password: z.string().min(8),\n  age: z.number().int().min(18),\n});'
  },
  {
    id: 'js-305-boss-form-validator',
    title: 'Босс: Связка React Hook Form + Zod (z.infer и zodResolver)',
    track: 'logic',
    level: 3,
    isBoss: true,
    topic: 'rhf-zod-boss',
    mapTopics: ['React Hook Form', 'Zod', 'React', 'TypeScript'],
    learn: 'Вывод TypeScript-типа из схемы через z.infer<typeof Schema> и подключение zodResolver в useForm.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Объяви схему `LoginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })`, выведи тип `type LoginValues = z.infer<typeof LoginSchema>;` и передай `resolver: zodResolver(LoginSchema)` внутрь вызова `useForm<LoginValues>({ ... })`.',
    specs: [
      'Обязательно объяви type LoginValues = z.infer<typeof LoginSchema>;',
      'Передай resolver: zodResolver(LoginSchema) в useForm'
    ],
    starterJs: 'const LoginSchema = z.object({\n  email: z.string().email(),\n  password: z.string().min(6),\n});\n\n// 1. Выведи тип LoginValues через z.infer\n\n// 2. Инициализируй form через useForm<LoginValues> с zodResolver\n',
    hints: [
      { tier: 1, text: 'Тип из схемы Zod выводится конструкцией type LoginValues = z.infer<typeof LoginSchema>;' },
      { tier: 2, text: 'Внутри useForm<LoginValues>({ resolver: zodResolver(LoginSchema) }) подключается валидатор.' },
      { tier: 3, text: 'Напиши type LoginValues = z.infer<typeof LoginSchema>; и const form = useForm<LoginValues>({ resolver: zodResolver(LoginSchema) });' }
    ],
    codeChecks: [
      { name: 'Объявлена схема LoginSchema', pattern: 'LoginSchema\\s*=\\s*z\\.object', expectedHint: 'const LoginSchema = z.object(...)' },
      { name: 'Выведен тип через z.infer<typeof LoginSchema>', pattern: 'type\\s+LoginValues\\s*=\\s*z\\.infer<\\s*typeof\\s+LoginSchema\\s*>', expectedHint: 'type LoginValues = z.infer<typeof LoginSchema>' },
      { name: 'Подключён zodResolver(LoginSchema)', pattern: 'resolver\\s*:\\s*zodResolver\\(\\s*LoginSchema\\s*\\)', expectedHint: 'resolver: zodResolver(LoginSchema)' }
    ],
    tests: [],
    solution: 'const LoginSchema = z.object({\n  email: z.string().email(),\n  password: z.string().min(6),\n});\n\ntype LoginValues = z.infer<typeof LoginSchema>;\n\nconst form = useForm<LoginValues>({\n  resolver: zodResolver(LoginSchema),\n});'
  },

  // ================= LEVEL 4 (Next.js, Vitest, React Testing Library, Playwright) =================
  {
    id: 'js-401-nextjs-route-params',
    title: 'Next.js App Router: Server Action с revalidatePath',
    track: 'logic',
    level: 4,
    isBoss: false,
    topic: 'nextjs-actions',
    mapTopics: ['Next.js', 'React', 'TypeScript'],
    learn: 'Директива "use server" и сброс кэша маршрута через revalidatePath() в Next.js App Router.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши асинхронный Server Action `async function createPostAction(title: string)`: первой строкой внутри функции укажи директиву `"use server";`, затем вызови `revalidatePath("/blog")` и верни `{ ok: true, title }`.',
    specs: [
      'Внутри функции обязательно должна быть директива "use server"',
      'Обязательно вызови revalidatePath("/blog")'
    ],
    starterJs: 'async function createPostAction(title: string) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Server Action в Next.js начинается со строки "use server";' },
      { tier: 2, text: 'Документация Next.js: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations' },
      { tier: 3, text: 'Вставь "use server"; затем revalidatePath("/blog"); и return { ok: true, title };' }
    ],
    codeChecks: [
      { name: 'Указана директива "use server"', pattern: '["\']use server["\']', expectedHint: '"use server";' },
      { name: 'Вызван revalidatePath("/blog")', pattern: 'revalidatePath\\(\\s*["\']/blog["\']\\s*\\)', expectedHint: 'revalidatePath("/blog")' },
      { name: 'Функция объявлена как async', pattern: 'async\\s+function\\s+createPostAction', expectedHint: 'async function createPostAction' }
    ],
    tests: [],
    solution: 'async function createPostAction(title: string) {\n  "use server";\n  revalidatePath("/blog");\n  return { ok: true, title };\n}'
  },
  {
    id: 'js-402-vitest-deep-equal',
    title: 'Vitest: написание юнит-теста describe / it / expect',
    track: 'logic',
    level: 4,
    isBoss: false,
    topic: 'vitest-syntax',
    mapTopics: ['Vitest', 'TypeScript'],
    learn: 'Структура теста в Vitest: блок describe, тест-кейс it и проверка глубокого равенства expect().toEqual().',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши юнит-тест Vitest: оберни его в `describe("cart", () => { ... })`, внутри создай тест `it("calculates total", () => { ... })` и проверь через `expect(calcTotal([10, 20])).toEqual(30)`.',
    specs: [
      'Используй блок describe("cart", ...)',
      'Используй проверку expect(calcTotal([10, 20])).toEqual(30)'
    ],
    starterJs: '// Напиши тест-сьют Vitest для функции calcTotal\n',
    hints: [
      { tier: 1, text: 'Синтаксис Vitest: describe("имя", () => { it("тест", () => { expect(...).toEqual(...); }); });' },
      { tier: 2, text: 'Документация Vitest: https://vitest.dev/api/' },
      { tier: 3, text: 'describe("cart", () => { it("calculates total", () => { expect(calcTotal([10, 20])).toEqual(30); }); });' }
    ],
    codeChecks: [
      { name: 'Использован блок describe("cart", ...)', pattern: 'describe\\(\\s*["\']cart["\']', expectedHint: 'describe("cart", () => ...)' },
      { name: 'Использован блок it(...) или test(...)', pattern: '\\b(it|test)\\(\\s*["\']', expectedHint: 'it("calculates total", () => ...)' },
      { name: 'Проверка expect(calcTotal([10, 20])).toEqual(30)', pattern: 'expect\\(\\s*calcTotal\\(\\s*\\[\\s*10\\s*,\\s*20\\s*\\]\\s*\\)\\s*\\)\\.toEqual\\(\\s*30\\s*\\)', expectedHint: 'expect(calcTotal([10, 20])).toEqual(30)' }
    ],
    tests: [],
    solution: 'describe("cart", () => {\n  it("calculates total", () => {\n    expect(calcTotal([10, 20])).toEqual(30);\n  });\n});'
  },
  {
    id: 'js-403-rtl-query-by-role',
    title: 'React Testing Library: render, screen.getByRole и fireEvent',
    track: 'logic',
    level: 4,
    isBoss: false,
    topic: 'rtl-testing',
    mapTopics: ['React Testing Library', 'Vitest', 'React'],
    learn: 'Тестирование React-компонента: рендер через render(<Counter />), поиск кнопки по роли и клик через fireEvent.click.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши тело компонентного теста RTL: отрендери компонент `render(<Counter />)`, найди кнопку `const btn = screen.getByRole("button")` и симулируй клик `fireEvent.click(btn)`.',
    specs: [
      'Вызови render(<Counter />)',
      'Найди кнопку через screen.getByRole("button") и вызови fireEvent.click(...)'
    ],
    starterJs: '// Напиши шаги теста React Testing Library\n',
    hints: [
      { tier: 1, text: 'В RTL элементы ищутся через объект screen: screen.getByRole("button").' },
      { tier: 2, text: 'Документация RTL: https://testing-library.com/docs/react-testing-library/example-intro' },
      { tier: 3, text: 'render(<Counter />);\nconst btn = screen.getByRole("button");\nfireEvent.click(btn);' }
    ],
    codeChecks: [
      { name: 'Вызван render(<Counter />)', pattern: 'render\\(\\s*<Counter\\s*\\/>\\s*\\)', expectedHint: 'render(<Counter />)' },
      { name: 'Поиск кнопки screen.getByRole("button")', pattern: 'screen\\.getByRole\\(\\s*["\']button["\']', expectedHint: 'screen.getByRole("button")' },
      { name: 'Симуляция клика fireEvent.click(...)', pattern: 'fireEvent\\.click\\(', expectedHint: 'fireEvent.click(btn)' }
    ],
    tests: [],
    solution: 'render(<Counter />);\nconst btn = screen.getByRole("button");\nfireEvent.click(btn);'
  },
  {
    id: 'js-404-nextjs-search-params',
    title: 'Next.js Metadata API: функция generateMetadata',
    track: 'logic',
    level: 4,
    isBoss: false,
    topic: 'nextjs-metadata',
    mapTopics: ['Next.js', 'TypeScript'],
    learn: 'Формирование динамических SEO-метатегов страницы в Next.js через generateMetadata.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши функцию `function generateMetadata(slug: string)`, которая возвращает объект метаданных Next.js: `{ title: `${slug} | VibeDojo`, openGraph: { title: slug } }`.',
    specs: [
      'Поле title должно иметь формат "<slug> | VibeDojo"',
      'Вложенный объект openGraph должен содержать поле title: slug'
    ],
    starterJs: 'function generateMetadata(slug: string) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Используй шаблонную строку `${slug} | VibeDojo`.' },
      { tier: 2, text: 'Документация Next.js Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata' },
      { tier: 3, text: 'return { title: `${slug} | VibeDojo`, openGraph: { title: slug } };' }
    ],
    codeChecks: [
      { name: 'Типизирован параметр slug: string', pattern: 'slug\\s*:\\s*string', expectedHint: 'slug: string' },
      { name: 'Задана секция openGraph', pattern: 'openGraph\\s*:', expectedHint: 'openGraph: { title: slug }' }
    ],
    tests: [
      { name: 'генерация SEO для страницы курса', call: 'generateMetadata("nextjs-15")', expected: { title: 'nextjs-15 | VibeDojo', openGraph: { title: 'nextjs-15' } } }
    ],
    solution: 'function generateMetadata(slug: string) {\n  return {\n    title: `${slug} | VibeDojo`,\n    openGraph: { title: slug },\n  };\n}'
  },
  {
    id: 'js-405-boss-test-suite-summary',
    title: 'Босс: E2E-тест авторизации на Playwright (test / page / expect)',
    track: 'logic',
    level: 4,
    isBoss: true,
    topic: 'playwright-boss',
    mapTopics: ['Playwright', 'Next.js', 'TypeScript'],
    learn: 'Написание полного E2E-сценария Playwright: переход page.goto, клик по локатору и проверка URL.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши E2E-тест Playwright `test("login flow", async ({ page }) => { ... })`: перейди на `await page.goto("/login")`, кликни по кнопке `await page.getByRole("button").click()` и проверь редирект `await expect(page).toHaveURL("/dashboard")`.',
    specs: [
      'Используй сигнатуру test("login flow", async ({ page }) => { ... })',
      'Обязательно используй await перед page.goto, .click() и expect(page).toHaveURL("/dashboard")'
    ],
    starterJs: 'test("login flow", async ({ page }) => {\n  \n});\n',
    hints: [
      { tier: 1, text: 'Все действия браузера в Playwright асинхронные и требуют await.' },
      { tier: 2, text: 'Документация Playwright: https://playwright.dev/docs/writing-tests' },
      { tier: 3, text: 'await page.goto("/login");\nawait page.getByRole("button").click();\nawait expect(page).toHaveURL("/dashboard");' }
    ],
    codeChecks: [
      { name: 'Переход await page.goto("/login")', pattern: 'await\\s+page\\.goto\\(\\s*["\']/login["\']\\s*\\)', expectedHint: 'await page.goto("/login")' },
      { name: 'Клик по кнопке page.getByRole("button").click()', pattern: 'await\\s+page\\.getByRole\\(\\s*["\']button["\']\\s*\\)\\.click\\(\\)', expectedHint: 'await page.getByRole("button").click()' },
      { name: 'Проверка URL await expect(page).toHaveURL("/dashboard")', pattern: 'await\\s+expect\\(\\s*page\\s*\\)\\.toHaveURL\\(\\s*["\']/dashboard["\']\\s*\\)', expectedHint: 'await expect(page).toHaveURL("/dashboard")' }
    ],
    tests: [],
    solution: 'test("login flow", async ({ page }) => {\n  await page.goto("/login");\n  await page.getByRole("button").click();\n  await expect(page).toHaveURL("/dashboard");\n});'
  },

  // ================= LEVEL 5 (Node.js, Express, Prisma, PostgreSQL, Redis) =================
  {
    id: 'js-501-express-bearer',
    title: 'Express Middleware: проверка Bearer-токена',
    track: 'logic',
    level: 5,
    isBoss: false,
    topic: 'express-middleware',
    mapTopics: ['Express', 'Node.js', 'TypeScript'],
    learn: 'Архитектура middleware в Express (req, res, next) и извлечение заголовка Authorization.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши функцию `function extractBearerToken(headerValue?: string): string | null`, которая проверяет заголовок `Authorization`: если он начинается с `"Bearer "`, возвращает сам токен, иначе `null`.',
    specs: [
      'Типизируй параметр headerValue?: string и возврат : string | null',
      'Если после "Bearer " пусто или схема другая (Basic) -> верни null'
    ],
    starterJs: 'function extractBearerToken(headerValue?: string): string | null {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Разбей строку по пробелам через trim().split(/\\s+/).' },
      { tier: 2, text: 'Проверь, что частей ровно 2 и первая равна "bearer" в нижнем регистре.' },
      { tier: 3, text: 'if (!headerValue) return null; const parts = headerValue.trim().split(/\\s+/); return parts.length === 2 && parts[0].toLowerCase() === "bearer" ? parts[1] : null;' }
    ],
    codeChecks: [
      { name: 'Типизирован возврат : string | null', pattern: ':\\s*string\\s*\\|\\s*null', expectedHint: ': string | null' }
    ],
    tests: [
      { name: 'корректный JWT', call: 'extractBearerToken("Bearer eyJhbGciOi")', expected: 'eyJhbGciOi' },
      { name: 'неверная схема Basic', call: 'extractBearerToken("Basic 12345")', expected: null },
      { name: 'пустой заголовок', call: 'extractBearerToken("")', expected: null }
    ],
    solution: 'function extractBearerToken(headerValue?: string): string | null {\n  if (typeof headerValue !== "string") return null;\n  const parts = headerValue.trim().split(/\\s+/);\n  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer" || !parts[1]) return null;\n  return parts[1];\n}'
  },
  {
    id: 'js-502-prisma-paginate',
    title: 'Prisma ORM: описание модели User в schema.prisma',
    track: 'logic',
    level: 5,
    isBoss: false,
    topic: 'prisma-schema',
    mapTopics: ['Prisma', 'PostgreSQL'],
    learn: 'Синтаксис декларативной схемы Prisma: model, @id, @default(autoincrement()), @unique и @default(now()).',
    needsDom: false,
    codeLanguage: 'prisma',
    prompt: 'Напиши декларацию `model User { ... }` для `schema.prisma` с полями: `id Int @id @default(autoincrement())`, `email String @unique` и `createdAt DateTime @default(now())`.',
    specs: [
      'Поле id: Int с атрибутами @id и @default(autoincrement())',
      'Поле email: String с атрибутом @unique',
      'Поле createdAt: DateTime с атрибутом @default(now())'
    ],
    starterJs: 'model User {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Первичный ключ в Prisma помечается атрибутом @id.' },
      { tier: 2, text: 'Документация Prisma Schema: https://www.prisma.io/docs/orm/prisma-schema/data-model/models' },
      { tier: 3, text: 'model User {\n  id Int @id @default(autoincrement())\n  email String @unique\n  createdAt DateTime @default(now())\n}' }
    ],
    codeChecks: [
      { name: 'Объявлена модель model User', pattern: 'model\\s+User\\s*\\{', expectedHint: 'model User { ... }' },
      { name: 'Первичный ключ id Int @id @default(autoincrement())', pattern: 'id\\s+Int\\s+@id\\s+@default\\(autoincrement\\(\\)\\)', expectedHint: 'id Int @id @default(autoincrement())' },
      { name: 'Уникальное поле email String @unique', pattern: 'email\\s+String\\s+@unique', expectedHint: 'email String @unique' },
      { name: 'Таймстамп createdAt DateTime @default(now())', pattern: 'createdAt\\s+DateTime\\s+@default\\(now\\(\\)\\)', expectedHint: 'createdAt DateTime @default(now())' }
    ],
    tests: [],
    solution: 'model User {\n  id        Int      @id @default(autoincrement())\n  email     String   @unique\n  createdAt DateTime @default(now())\n}'
  },
  {
    id: 'js-503-redis-ttl-lookup',
    title: 'Redis + Node.js: формирование команды SET с EX (TTL)',
    track: 'logic',
    level: 5,
    isBoss: false,
    topic: 'redis-cache',
    mapTopics: ['Redis', 'Node.js', 'TypeScript'],
    learn: 'Стандартизация ключей с неймспейсом (session:user:id) и передача флага EX для TTL в секундах.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши функцию `function buildRedisSetArgs(userId: number, payload: object, ttlSeconds: number = 3600)`, которая возвращает кортеж аргументов для `redis.set`: `[\`session:user:\${userId}\`, JSON.stringify(payload), "EX", ttlSeconds]`.',
    specs: [
      'Ключ должен иметь формат "session:user:<userId>"',
      'Третий элемент массива — строка "EX", четвёртый — число ttlSeconds'
    ],
    starterJs: 'function buildRedisSetArgs(userId: number, payload: object, ttlSeconds: number = 3600) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'В ioredis / node-redis TTL в секундах задаётся аргументами "EX", ttlSeconds.' },
      { tier: 2, text: 'Документация Redis SET: https://redis.io/docs/latest/commands/set/' },
      { tier: 3, text: 'return [`session:user:${userId}`, JSON.stringify(payload), "EX", ttlSeconds];' }
    ],
    codeChecks: [
      { name: 'Сериализация через JSON.stringify', pattern: 'JSON\\.stringify\\(\\s*payload\\s*\\)', expectedHint: 'JSON.stringify(payload)' },
      { name: 'Передан флаг TTL "EX"', pattern: '["\']EX["\']', expectedHint: '"EX", ttlSeconds' }
    ],
    tests: [
      { name: 'формирует аргументы Redis SET с EX', call: 'buildRedisSetArgs(42, { role: "admin" }, 1800)', expected: ['session:user:42', '{"role":"admin"}', 'EX', 1800] }
    ],
    solution: 'function buildRedisSetArgs(userId: number, payload: object, ttlSeconds: number = 3600) {\n  return [`session:user:${userId}`, JSON.stringify(payload), "EX", ttlSeconds];\n}'
  },
  {
    id: 'js-504-postgres-group-by',
    title: 'PostgreSQL: SQL-запрос с GROUP BY, COUNT и HAVING',
    track: 'logic',
    level: 5,
    isBoss: false,
    topic: 'postgresql-sql',
    mapTopics: ['PostgreSQL', 'SQL'],
    learn: 'Написание аналитического SQL-запроса с фильтрацией WHERE, группировкой GROUP BY и агрегацией COUNT / SUM.',
    needsDom: false,
    codeLanguage: 'sql',
    prompt: 'Напиши SQL-запрос для PostgreSQL: выбери `status`, `COUNT(*) AS total_count` и `SUM(amount) AS total_amount` из таблицы `orders`, где `amount > 0`, сгруппируй по `status` (`GROUP BY status`) и отсортируй по `total_amount DESC`.',
    specs: [
      'Используй SELECT status, COUNT(*) AS total_count, SUM(amount) AS total_amount',
      'Укажи FROM orders, WHERE amount > 0, GROUP BY status и ORDER BY total_amount DESC'
    ],
    starterJs: '-- Напиши SQL-запрос для PostgreSQL\nSELECT \n',
    hints: [
      { tier: 1, text: 'Порядок секций в SQL: SELECT -> FROM -> WHERE -> GROUP BY -> ORDER BY.' },
      { tier: 2, text: 'Документация PostgreSQL GROUP BY: https://www.postgresql.org/docs/current/queries-table-expressions.html' },
      { tier: 3, text: 'SELECT status, COUNT(*) AS total_count, SUM(amount) AS total_amount FROM orders WHERE amount > 0 GROUP BY status ORDER BY total_amount DESC;' }
    ],
    codeChecks: [
      { name: 'Агрегации COUNT(*) AS total_count и SUM(amount) AS total_amount', pattern: 'COUNT\\(\\*\\)\\s+AS\\s+total_count.*SUM\\(amount\\)\\s+AS\\s+total_amount', flags: 'is', expectedHint: 'COUNT(*) AS total_count, SUM(amount) AS total_amount' },
      { name: 'Фильтрация FROM orders WHERE amount > 0', pattern: 'FROM\\s+orders\\s+WHERE\\s+amount\\s*>\\s*0', flags: 'is', expectedHint: 'FROM orders WHERE amount > 0' },
      { name: 'Группировка GROUP BY status', pattern: 'GROUP\\s+BY\\s+status', flags: 'is', expectedHint: 'GROUP BY status' },
      { name: 'Сортировка ORDER BY total_amount DESC', pattern: 'ORDER\\s+BY\\s+total_amount\\s+DESC', flags: 'is', expectedHint: 'ORDER BY total_amount DESC' }
    ],
    tests: [],
    solution: 'SELECT status, COUNT(*) AS total_count, SUM(amount) AS total_amount\nFROM orders\nWHERE amount > 0\nGROUP BY status\nORDER BY total_amount DESC;'
  },
  {
    id: 'js-505-boss-rate-limiter',
    title: 'Босс: Sliding Window Rate Limiter для Express + Redis',
    track: 'logic',
    level: 5,
    isBoss: true,
    topic: 'backend-boss',
    mapTopics: ['Node.js', 'Express', 'Redis', 'TypeScript'],
    learn: 'Реализация алгоритма защиты API от DDoS/брутфорса с возвратом HTTP 429 Too Many Requests.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши типизированную функцию `function checkRateLimit(timestamps: number[], now: number, windowMs: number, maxRequests: number)`, которая оставляет только запросы новее `now - windowMs` и возвращает `{ allowed: true, status: 200, remaining }` либо `{ allowed: false, status: 429, remaining: 0 }`.',
    specs: [
      'Типизируй все 4 параметра в сигнатуре функции',
      'При превышении лимита возвращай статус 429 и remaining: 0'
    ],
    starterJs: 'function checkRateLimit(timestamps: number[], now: number, windowMs: number, maxRequests: number) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Отфильтруй массив: const recent = timestamps.filter((t) => t > now - windowMs);' },
      { tier: 2, text: 'Если recent.length >= maxRequests — лимит исчерпан (status: 429).' },
      { tier: 3, text: 'Иначе верни { allowed: true, status: 200, remaining: maxRequests - recent.length - 1 }.' }
    ],
    codeChecks: [
      { name: 'Типизирован массив timestamps: number[]', pattern: 'timestamps\\s*:\\s*number\\[\\]', expectedHint: 'timestamps: number[]' }
    ],
    tests: [
      { name: 'запрос разрешён (200)', call: 'checkRateLimit([1000, 2000], 2500, 1000, 3)', expected: { allowed: true, status: 200, remaining: 1 } },
      { name: 'превышен лимит (429)', call: 'checkRateLimit([1800, 2000, 2200], 2500, 1000, 3)', expected: { allowed: false, status: 429, remaining: 0 } }
    ],
    solution: 'function checkRateLimit(timestamps: number[], now: number, windowMs: number, maxRequests: number) {\n  const recent = timestamps.filter((t) => t > now - windowMs);\n  if (recent.length >= maxRequests) {\n    return { allowed: false, status: 429, remaining: 0 };\n  }\n  return { allowed: true, status: 200, remaining: maxRequests - recent.length - 1 };\n}'
  },

  // ================= LEVEL 6 (Python, FastAPI, Pydantic, SQLAlchemy, Alembic, pytest) =================
  {
    id: 'js-601-pydantic-coercion',
    title: 'Python + Pydantic: схема UserCreate(BaseModel) с Field',
    track: 'logic',
    level: 6,
    isBoss: false,
    topic: 'pydantic-models',
    mapTopics: ['Python', 'Pydantic', 'FastAPI'],
    learn: 'Объявление класса модели Pydantic с аннотациями типов Python и валидацией через Field().',
    needsDom: false,
    codeLanguage: 'python',
    prompt: 'Напиши на Python модель Pydantic `class UserCreate(BaseModel):` с тремя полями: `username: str = Field(min_length=3, max_length=20)`, `age: int = Field(ge=18)` и `is_active: bool = True`.',
    specs: [
      'Наследуй класс от BaseModel: class UserCreate(BaseModel):',
      'Используй Field(min_length=3, max_length=20) для username и Field(ge=18) для age'
    ],
    starterJs: 'from pydantic import BaseModel, Field\n\nclass UserCreate(BaseModel):\n    \n',
    hints: [
      { tier: 1, text: 'В Pydantic ограничение >= 18 задаётся через Field(ge=18).' },
      { tier: 2, text: 'Документация Pydantic Fields: https://docs.pydantic.dev/latest/concepts/fields/' },
      { tier: 3, text: 'class UserCreate(BaseModel):\n    username: str = Field(min_length=3, max_length=20)\n    age: int = Field(ge=18)\n    is_active: bool = True' }
    ],
    codeChecks: [
      { name: 'Объявлен класс class UserCreate(BaseModel):', pattern: 'class\\s+UserCreate\\(\\s*BaseModel\\s*\\)\\s*:', expectedHint: 'class UserCreate(BaseModel):' },
      { name: 'Поле username с Field(min_length=3, max_length=20)', pattern: 'username\\s*:\\s*str\\s*=\\s*Field\\(.*min_length\\s*=\\s*3.*max_length\\s*=\\s*20', expectedHint: 'username: str = Field(min_length=3, max_length=20)' },
      { name: 'Поле age: int = Field(ge=18)', pattern: 'age\\s*:\\s*int\\s*=\\s*Field\\(\\s*ge\\s*=\\s*18\\s*\\)', expectedHint: 'age: int = Field(ge=18)' },
      { name: 'Поле is_active: bool = True', pattern: 'is_active\\s*:\\s*bool\\s*=\\s*True', expectedHint: 'is_active: bool = True' }
    ],
    tests: [],
    solution: 'from pydantic import BaseModel, Field\n\nclass UserCreate(BaseModel):\n    username: str = Field(min_length=3, max_length=20)\n    age: int = Field(ge=18)\n    is_active: bool = True'
  },
  {
    id: 'js-602-sqlalchemy-where',
    title: 'Python + SQLAlchemy 2.0: запрос select(User).where()',
    track: 'logic',
    level: 6,
    isBoss: false,
    topic: 'sqlalchemy-orm',
    mapTopics: ['SQLAlchemy', 'Python', 'PostgreSQL'],
    learn: 'Современный синтаксис SQLAlchemy 2.0: построение запроса через select(), .where() и .order_by().',
    needsDom: false,
    codeLanguage: 'python',
    prompt: 'Напиши на Python функцию `def get_active_admins_stmt():`, которая возвращает выражение SQLAlchemy 2.0: `select(User).where(User.is_active == True, User.role == "admin").order_by(User.id.desc())`.',
    specs: [
      'Используй функцию select(User)',
      'Добавь фильтрацию .where(User.is_active == True, User.role == "admin") и сортировку .order_by(User.id.desc())'
    ],
    starterJs: 'from sqlalchemy import select\n\ndef get_active_admins_stmt():\n    \n',
    hints: [
      { tier: 1, text: 'В SQLAlchemy 2.0 вместо session.query() используется select(Model).' },
      { tier: 2, text: 'Документация SQLAlchemy 2.0: https://docs.sqlalchemy.org/en/20/tutorial/data_select.html' },
      { tier: 3, text: 'return select(User).where(User.is_active == True, User.role == "admin").order_by(User.id.desc())' }
    ],
    codeChecks: [
      { name: 'Объявлена функция def get_active_admins_stmt():', pattern: 'def\\s+get_active_admins_stmt\\(\\)\\s*:', expectedHint: 'def get_active_admins_stmt():' },
      { name: 'Вызов select(User).where(...)', pattern: 'select\\(\\s*User\\s*\\)\\.where\\(', expectedHint: 'select(User).where(...)' },
      { name: 'Условие User.role == "admin"', pattern: 'User\\.role\\s*==\\s*["\']admin["\']', expectedHint: 'User.role == "admin"' },
      { name: 'Сортировка .order_by(User.id.desc())', pattern: '\\.order_by\\(\\s*User\\.id\\.desc\\(\\)\\s*\\)', expectedHint: '.order_by(User.id.desc())' }
    ],
    tests: [],
    solution: 'from sqlalchemy import select\n\ndef get_active_admins_stmt():\n    return select(User).where(User.is_active == True, User.role == "admin").order_by(User.id.desc())'
  },
  {
    id: 'js-603-alembic-autogenerate-diff',
    title: 'Python + Alembic: функции upgrade() и downgrade() миграции',
    track: 'logic',
    level: 6,
    isBoss: false,
    topic: 'alembic-migrations',
    mapTopics: ['Alembic', 'SQLAlchemy', 'Python'],
    learn: 'Написание обратимой миграции БД в Alembic с помощью op.add_column и op.drop_column.',
    needsDom: false,
    codeLanguage: 'python',
    prompt: 'Допиши миграцию Alembic на Python: в `def upgrade() -> None:` добавь колонку `op.add_column("users", sa.Column("phone", sa.String(20), nullable=True))`, а в `def downgrade() -> None:` удали её через `op.drop_column("users", "phone")`.',
    specs: [
      'В upgrade() вызови op.add_column("users", sa.Column("phone", sa.String(20), nullable=True))',
      'В downgrade() вызови op.drop_column("users", "phone")'
    ],
    starterJs: 'from alembic import op\nimport sqlalchemy as sa\n\ndef upgrade() -> None:\n    pass\n\ndef downgrade() -> None:\n    pass\n',
    hints: [
      { tier: 1, text: 'Каждая операция в upgrade() должна иметь зеркальную отмену в downgrade().' },
      { tier: 2, text: 'Документация Alembic Operations: https://alembic.sqlalchemy.org/en/latest/ops.html' },
      { tier: 3, text: 'В upgrade: op.add_column("users", sa.Column("phone", sa.String(20), nullable=True)), в downgrade: op.drop_column("users", "phone").' }
    ],
    codeChecks: [
      { name: 'Вызов op.add_column("users", sa.Column("phone", ...))', pattern: 'op\\.add_column\\(\\s*["\']users["\']\\s*,\\s*sa\\.Column\\(\\s*["\']phone["\']', expectedHint: 'op.add_column("users", sa.Column("phone", ...))' },
      { name: 'Тип колонки sa.String(20)', pattern: 'sa\\.String\\(\\s*20\\s*\\)', expectedHint: 'sa.String(20)' },
      { name: 'Откат op.drop_column("users", "phone")', pattern: 'op\\.drop_column\\(\\s*["\']users["\']\\s*,\\s*["\']phone["\']\\s*\\)', expectedHint: 'op.drop_column("users", "phone")' }
    ],
    tests: [],
    solution: 'from alembic import op\nimport sqlalchemy as sa\n\ndef upgrade() -> None:\n    op.add_column("users", sa.Column("phone", sa.String(20), nullable=True))\n\ndef downgrade() -> None:\n    op.drop_column("users", "phone")'
  },
  {
    id: 'js-604-pytest-parametrize',
    title: 'Python + pytest: параметризованный тест @pytest.mark.parametrize',
    track: 'logic',
    level: 6,
    isBoss: false,
    topic: 'pytest-runner',
    mapTopics: ['pytest', 'Python'],
    learn: 'Декоратор @pytest.mark.parametrize для проверки функции на наборе входных и ожидаемых значений.',
    needsDom: false,
    codeLanguage: 'python',
    prompt: 'Напиши тест на Python с использованием `@pytest.mark.parametrize("price,expected", [(100, 90), (200, 180)])` для тестовой функции `def test_discount(price, expected):` с проверкой `assert apply_discount(price) == expected`.',
    specs: [
      'Используй декоратор @pytest.mark.parametrize("price,expected", ...)',
      'Внутри test_discount(price, expected) напиши assert apply_discount(price) == expected'
    ],
    starterJs: 'import pytest\n\n# Добавь декоратор @pytest.mark.parametrize и функцию test_discount\n',
    hints: [
      { tier: 1, text: 'Первый аргумент parametrize — строка с именами параметров через запятую: "price,expected".' },
      { tier: 2, text: 'Документация pytest: https://docs.pytest.org/en/stable/how-to/parametrize.html' },
      { tier: 3, text: '@pytest.mark.parametrize("price,expected", [(100, 90), (200, 180)])\ndef test_discount(price, expected):\n    assert apply_discount(price) == expected' }
    ],
    codeChecks: [
      { name: 'Декоратор @pytest.mark.parametrize("price,expected", ...)', pattern: '@pytest\\.mark\\.parametrize\\(\\s*["\']price\\s*,\\s*expected["\']', expectedHint: '@pytest.mark.parametrize("price,expected", ...)' },
      { name: 'Функция def test_discount(price, expected):', pattern: 'def\\s+test_discount\\(\\s*price\\s*,\\s*expected\\s*\\)\\s*:', expectedHint: 'def test_discount(price, expected):' },
      { name: 'Проверка assert apply_discount(price) == expected', pattern: 'assert\\s+apply_discount\\(\\s*price\\s*\\)\\s*==\\s*expected', expectedHint: 'assert apply_discount(price) == expected' }
    ],
    tests: [],
    solution: 'import pytest\n\n@pytest.mark.parametrize("price,expected", [(100, 90), (200, 180)])\ndef test_discount(price, expected):\n    assert apply_discount(price) == expected'
  },
  {
    id: 'js-605-boss-fastapi-endpoint',
    title: 'Босс: Эндпоинт FastAPI с response_model, status_code=201 и HTTPException',
    track: 'logic',
    level: 6,
    isBoss: true,
    topic: 'fastapi-boss',
    mapTopics: ['FastAPI', 'Pydantic', 'Python'],
    learn: 'Создание POST-роута в FastAPI с декларацией response_model, кода 201 и выбросом HTTPException(status_code=400).',
    needsDom: false,
    codeLanguage: 'python',
    prompt: 'Напиши эндпоинт FastAPI на Python: декоратор `@app.post("/users", response_model=UserOut, status_code=201)`, функция `async def create_user(payload: UserCreate):`. Если `payload.username == "root"`, выброси `raise HTTPException(status_code=400, detail="Reserved username")`, иначе верни `payload`.',
    specs: [
      'Декоратор: @app.post("/users", response_model=UserOut, status_code=201)',
      'Сигнатура: async def create_user(payload: UserCreate):',
      'Проверка на "root" с raise HTTPException(status_code=400, ...)'
    ],
    starterJs: 'from fastapi import FastAPI, HTTPException\n\napp = FastAPI()\n\n# Напиши роут @app.post("/users", ...)\n',
    hints: [
      { tier: 1, text: 'В FastAPI фильтрация выходных данных (чтобы не утёк пароль) делается через response_model=UserOut.' },
      { tier: 2, text: 'Документация FastAPI: https://fastapi.tiangolo.com/tutorial/response-model/' },
      { tier: 3, text: '@app.post("/users", response_model=UserOut, status_code=201)\nasync def create_user(payload: UserCreate):\n    if payload.username == "root":\n        raise HTTPException(status_code=400, detail="Reserved username")\n    return payload' }
    ],
    codeChecks: [
      { name: 'Декоратор @app.post("/users", response_model=UserOut, status_code=201)', pattern: '@app\\.post\\(\\s*["\']/users["\']\\s*,.*response_model\\s*=\\s*UserOut.*status_code\\s*=\\s*201', expectedHint: '@app.post("/users", response_model=UserOut, status_code=201)' },
      { name: 'Асинхронный обработчик async def create_user(payload: UserCreate):', pattern: 'async\\s+def\\s+create_user\\(\\s*payload\\s*:\\s*UserCreate\\s*\\)\\s*:', expectedHint: 'async def create_user(payload: UserCreate):' },
      { name: 'Выброс исключения raise HTTPException(status_code=400, ...)', pattern: 'raise\\s+HTTPException\\(\\s*status_code\\s*=\\s*400', expectedHint: 'raise HTTPException(status_code=400, ...)' }
    ],
    tests: [],
    solution: 'from fastapi import FastAPI, HTTPException\n\napp = FastAPI()\n\n@app.post("/users", response_model=UserOut, status_code=201)\nasync def create_user(payload: UserCreate):\n    if payload.username == "root":\n        raise HTTPException(status_code=400, detail="Reserved username")\n    return payload'
  },

  // ================= LEVEL 7 (Docker, Linux, Nginx, GitHub Actions, AWS, Vercel, Sentry) =================
  {
    id: 'js-701-docker-env-parser',
    title: 'Docker: написание боевого Dockerfile для Node.js + pnpm',
    track: 'logic',
    level: 7,
    isBoss: false,
    topic: 'dockerfile',
    mapTopics: ['Docker', 'pnpm', 'Node.js', 'Linux'],
    learn: 'Инструкции Dockerfile: базовый образ FROM node:22-alpine, WORKDIR, кэширование слоёв COPY, RUN pnpm install --frozen-lockfile, EXPOSE и CMD.',
    needsDom: false,
    codeLanguage: 'dockerfile',
    prompt: 'Напиши `Dockerfile` для продакшен-сервиса: базовый образ `FROM node:22-alpine`, рабочая папка `WORKDIR /app`, копирование `COPY package.json pnpm-lock.yaml ./`, установка `RUN corepack enable && pnpm install --frozen-lockfile`, копирование кода `COPY . .`, порт `EXPOSE 3000` и запуск `CMD ["node", "dist/server.js"]`.',
    specs: [
      'Обязательно используй FROM node:22-alpine и WORKDIR /app',
      'Установка зависимостей должна использовать флаг --frozen-lockfile',
      'Финальная команда: CMD ["node", "dist/server.js"]'
    ],
    starterJs: '# Напиши Dockerfile для Node.js + pnpm\nFROM node:22-alpine\n',
    hints: [
      { tier: 1, text: 'Сначала копируются только package.json и pnpm-lock.yaml, чтобы Docker кэшировал слой зависимостей.' },
      { tier: 2, text: 'Документация Dockerfile: https://docs.docker.com/reference/dockerfile/' },
      { tier: 3, text: 'FROM node:22-alpine\nWORKDIR /app\nCOPY package.json pnpm-lock.yaml ./\nRUN corepack enable && pnpm install --frozen-lockfile\nCOPY . .\nEXPOSE 3000\nCMD ["node", "dist/server.js"]' }
    ],
    codeChecks: [
      { name: 'Базовый образ FROM node:22-alpine', pattern: '^FROM\\s+node:22-alpine', flags: 'm', expectedHint: 'FROM node:22-alpine' },
      { name: 'Рабочая директория WORKDIR /app', pattern: '^WORKDIR\\s+/app', flags: 'm', expectedHint: 'WORKDIR /app' },
      { name: 'Установка с --frozen-lockfile', pattern: 'pnpm\\s+install\\s+--frozen-lockfile', expectedHint: 'pnpm install --frozen-lockfile' },
      { name: 'Открыт порт EXPOSE 3000', pattern: '^EXPOSE\\s+3000', flags: 'm', expectedHint: 'EXPOSE 3000' },
      { name: 'Запуск CMD ["node", "dist/server.js"]', pattern: 'CMD\\s*\\[\\s*"node"\\s*,\\s*"dist/server\\.js"\\s*\\]', expectedHint: 'CMD ["node", "dist/server.js"]' }
    ],
    tests: [],
    solution: 'FROM node:22-alpine\nWORKDIR /app\nCOPY package.json pnpm-lock.yaml ./\nRUN corepack enable && pnpm install --frozen-lockfile\nCOPY . .\nEXPOSE 3000\nCMD ["node", "dist/server.js"]'
  },
  {
    id: 'js-702-nginx-location-matcher',
    title: 'Nginx: конфиг reverse proxy (proxy_pass и заголовки)',
    track: 'logic',
    level: 7,
    isBoss: false,
    topic: 'nginx-config',
    mapTopics: ['Nginx', 'Linux', 'Docker'],
    learn: 'Конфигурация блока server и location /api/ в nginx.conf для проксирования запросов на бэкенд.',
    needsDom: false,
    codeLanguage: 'nginx',
    prompt: 'Напиши блок `server { ... }` для `nginx.conf`: слушай порт `listen 80;`, а внутри `location /api/ { ... }` пропиши `proxy_pass http://backend:8000/;` и передачу реального IP клиента `proxy_set_header X-Real-IP $remote_addr;`.',
    specs: [
      'Внутри server укажи listen 80;',
      'Внутри location /api/ укажи proxy_pass http://backend:8000/; и proxy_set_header X-Real-IP $remote_addr;'
    ],
    starterJs: 'server {\n    listen 80;\n\n    location /api/ {\n        \n    }\n}\n',
    hints: [
      { tier: 1, text: 'Каждая директива в nginx.conf заканчивается точкой с запятой (;).' },
      { tier: 2, text: 'Документация Nginx Reverse Proxy: https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/' },
      { tier: 3, text: 'Внутри location /api/ напиши:\nproxy_pass http://backend:8000/;\nproxy_set_header X-Real-IP $remote_addr;' }
    ],
    codeChecks: [
      { name: 'Директива listen 80;', pattern: 'listen\\s+80\\s*;', expectedHint: 'listen 80;' },
      { name: 'Блок location /api/', pattern: 'location\\s+/api/\\s*\\{', expectedHint: 'location /api/ { ... }' },
      { name: 'Проксирование proxy_pass http://backend:8000/;', pattern: 'proxy_pass\\s+http://backend:8000/\\s*;', expectedHint: 'proxy_pass http://backend:8000/;' },
      { name: 'Заголовок proxy_set_header X-Real-IP $remote_addr;', pattern: 'proxy_set_header\\s+X-Real-IP\\s+\\$remote_addr\\s*;', expectedHint: 'proxy_set_header X-Real-IP $remote_addr;' }
    ],
    tests: [],
    solution: 'server {\n    listen 80;\n\n    location /api/ {\n        proxy_pass http://backend:8000/;\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n}'
  },
  {
    id: 'js-703-gh-actions-needs',
    title: 'GitHub Actions: YAML-воркфлоу CI для проверки кода и тестов',
    track: 'logic',
    level: 7,
    isBoss: false,
    topic: 'github-actions',
    mapTopics: ['GitHub Actions', 'Git', 'GitHub', 'pnpm'],
    learn: 'Структура файла .github/workflows/ci.yml: триггеры on, окружение runs-on: ubuntu-latest и шаги steps.',
    needsDom: false,
    codeLanguage: 'yaml',
    prompt: 'Допиши YAML-файл `.github/workflows/ci.yml`: триггер `on: [push, pull_request]`, джоб `test` на `runs-on: ubuntu-latest`, шаг чекаута `uses: actions/checkout@v4` и команды `run: pnpm install --frozen-lockfile` и `run: pnpm test:run`.',
    specs: [
      'Укажи триггер on: [push, pull_request]',
      'Укажи runs-on: ubuntu-latest, шаг uses: actions/checkout@v4 и запуск pnpm test:run'
    ],
    starterJs: 'name: CI\non: [push, pull_request]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n',
    hints: [
      { tier: 1, text: 'Каждый шаг с командой в GitHub Actions пишется через дефис: - run: <команда>.' },
      { tier: 2, text: 'Документация GitHub Actions: https://docs.github.com/en/actions/writing-workflows' },
      { tier: 3, text: 'Добавь два шага:\n      - run: pnpm install --frozen-lockfile\n      - run: pnpm test:run' }
    ],
    codeChecks: [
      { name: 'Триггер on: [push, pull_request]', pattern: 'on:\\s*\\[\\s*push\\s*,\\s*pull_request\\s*\\]', expectedHint: 'on: [push, pull_request]' },
      { name: 'Окружение runs-on: ubuntu-latest', pattern: 'runs-on:\\s*ubuntu-latest', expectedHint: 'runs-on: ubuntu-latest' },
      { name: 'Экшен uses: actions/checkout@v4', pattern: 'uses:\\s*actions/checkout@v4', expectedHint: 'uses: actions/checkout@v4' },
      { name: 'Установка зависимостей pnpm install --frozen-lockfile', pattern: 'run:\\s*pnpm\\s+install\\s+--frozen-lockfile', expectedHint: '- run: pnpm install --frozen-lockfile' },
      { name: 'Запуск тестов pnpm test:run', pattern: 'run:\\s*pnpm\\s+test:run', expectedHint: '- run: pnpm test:run' }
    ],
    tests: [],
    solution: 'name: CI\non: [push, pull_request]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pnpm install --frozen-lockfile\n      - run: pnpm test:run'
  },
  {
    id: 'js-704-sentry-fingerprint',
    title: 'Sentry SDK: конфигурация Sentry.init() для продакшена',
    track: 'logic',
    level: 7,
    isBoss: false,
    topic: 'sentry-monitoring',
    mapTopics: ['Sentry', 'TypeScript'],
    learn: 'Инициализация мониторинга ошибок Sentry с dsn, environment и tracesSampleRate.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши функцию `function createSentryConfig(dsn: string, env: string = "production")`, которая возвращает объект настроек для `Sentry.init`: `{ dsn, environment: env, tracesSampleRate: env === "production" ? 0.2 : 1.0, enabled: Boolean(dsn) }`.',
    specs: [
      'В продакшене tracesSampleRate должен быть равен 0.2 (20% транзакций), иначе 1.0',
      'Поле enabled равно Boolean(dsn)'
    ],
    starterJs: 'function createSentryConfig(dsn: string, env: string = "production") {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Используй тернарный оператор env === "production" ? 0.2 : 1.0.' },
      { tier: 2, text: 'Документация Sentry JS: https://docs.sentry.io/platforms/javascript/configuration/options/' },
      { tier: 3, text: 'return { dsn, environment: env, tracesSampleRate: env === "production" ? 0.2 : 1.0, enabled: Boolean(dsn) };' }
    ],
    codeChecks: [
      { name: 'Настроен параметр tracesSampleRate', pattern: 'tracesSampleRate\\s*:', expectedHint: 'tracesSampleRate: ...' }
    ],
    tests: [
      { name: 'настройки для production (0.2)', call: 'createSentryConfig("https://key@sentry.io/1", "production")', expected: { dsn: 'https://key@sentry.io/1', environment: 'production', tracesSampleRate: 0.2, enabled: true } },
      { name: 'настройки для staging (1.0)', call: 'createSentryConfig("https://key@sentry.io/1", "staging")', expected: { dsn: 'https://key@sentry.io/1', environment: 'staging', tracesSampleRate: 1.0, enabled: true } }
    ],
    solution: 'function createSentryConfig(dsn: string, env: string = "production") {\n  return {\n    dsn,\n    environment: env,\n    tracesSampleRate: env === "production" ? 0.2 : 1.0,\n    enabled: Boolean(dsn),\n  };\n}'
  },
  {
    id: 'js-705-boss-prod-readiness',
    title: 'Босс: Аудитор инфраструктуры (AWS S3 + Vercel + Docker + Sentry)',
    track: 'logic',
    level: 7,
    isBoss: true,
    topic: 'devops-boss',
    mapTopics: ['AWS', 'Vercel', 'Docker', 'Nginx', 'Sentry', 'TypeScript'],
    learn: 'Комплексная проверка готовности облачного деплоя: HTTPS, регион AWS, Sentry DSN и отсутствие отладочного режима.',
    needsDom: false,
    codeLanguage: 'typescript',
    prompt: 'Напиши функцию `function auditProdConfig(cfg: any = {})`, которая проверяет 4 условия: 1) `cfg.https === true` (`"HTTPS_REQUIRED"`), 2) `cfg.sentryDsn` начинается с `"https://"` (`"MISSING_SENTRY"`), 3) `cfg.awsRegion` — непустая строка (`"MISSING_AWS_REGION"`), 4) `cfg.debug !== true` (`"DEBUG_ENABLED"`). Верни `{ ready: issues.length === 0, issues }`.',
    specs: [
      'Проверяй все 4 условия строго в порядке 1..4',
      'Поле ready равно true только когда массив issues пуст'
    ],
    starterJs: 'function auditProdConfig(cfg: any = {}) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Создай массив const issues: string[] = []; и пушь коды ошибок по очереди.' },
      { tier: 2, text: 'Проверяй строковые поля через typeof ... === "string".' },
      { tier: 3, text: 'Проверь все 4 правила и в конце верни { ready: issues.length === 0, issues }.' }
    ],
    codeChecks: [
      { name: 'Проверка региона AWS (MISSING_AWS_REGION)', pattern: 'MISSING_AWS_REGION', expectedHint: 'issues.push("MISSING_AWS_REGION")' },
      { name: 'Проверка Sentry DSN (MISSING_SENTRY)', pattern: 'MISSING_SENTRY', expectedHint: 'issues.push("MISSING_SENTRY")' }
    ],
    tests: [
      { name: 'инфраструктура полностью готова к релизу', call: 'auditProdConfig({ https: true, sentryDsn: "https://sentry.io/1", awsRegion: "eu-central-1", debug: false })', expected: { ready: true, issues: [] } },
      { name: 'обнаружены все 4 проблемы', call: 'auditProdConfig({ https: false, sentryDsn: "", awsRegion: "", debug: true })', expected: { ready: false, issues: ['HTTPS_REQUIRED', 'MISSING_SENTRY', 'MISSING_AWS_REGION', 'DEBUG_ENABLED'] } }
    ],
    solution: 'function auditProdConfig(cfg: any = {}) {\n  const issues: string[] = [];\n  if (cfg.https !== true) issues.push("HTTPS_REQUIRED");\n  if (typeof cfg.sentryDsn !== "string" || !cfg.sentryDsn.startsWith("https://")) issues.push("MISSING_SENTRY");\n  if (typeof cfg.awsRegion !== "string" || !cfg.awsRegion.trim()) issues.push("MISSING_AWS_REGION");\n  if (cfg.debug === true) issues.push("DEBUG_ENABLED");\n  return { ready: issues.length === 0, issues };\n}'
  }
];

const layoutDir = path.resolve('content/layout');
const logicDir = path.resolve('content/logic');

fs.mkdirSync(layoutDir, { recursive: true });
fs.mkdirSync(logicDir, { recursive: true });

for (const task of layoutTasks) {
  fs.writeFileSync(
    path.join(layoutDir, `${task.id}.json`),
    JSON.stringify(task, null, 2) + '\n',
    'utf8',
  );
}

for (const task of logicTasks) {
  fs.writeFileSync(
    path.join(logicDir, `${task.id}.json`),
    JSON.stringify(task, null, 2) + '\n',
    'utf8',
  );
}

console.log(
  `✅ Готово! Обновлено ${layoutTasks.length} Tailwind-задач и ${logicTasks.length} задач реального стека (Уровни 2–7).`,
);