import fs from 'node:fs';
import path from 'node:path';

const layoutPack2 = [
  // ================= CSS УРОВЕНЬ 4: GRID И АДАПТИВНОСТЬ =================
  {
    id: 'layout-401-grid-featured-span',
    title: 'CSS #52 Витрина каталога с широкой карточкой',
    track: 'layout',
    level: 4,
    isBoss: false,
    topic: 'css-grid',
    mapTopics: ['CSS Grid', 'Grid Tracks'],
    learn: 'В Grid элемент растягивается на несколько колонок не фиксированной шириной в пикселях, а указанием числа занимаемых дорожек.',
    needsDom: true,
    codeLanguage: 'css',
    prompt: 'Разложи карточки товаров в три равные колонки. Первая карточка («Хит сезона») должна занимать сразу две колонки в первом ряду, а остальные — по одной ячейке.',
    specs: [
      'Контейнер .catalog шириной 632px раскладывает элементы в 3 равные колонки с промежутком 16px между строками и колонками',
      'Карточка .card-featured занимает 2 колонки по горизонтали',
      'Высота каждой карточки — 96px'
    ],
    starterHtml: '<div class="catalog">\n  <article class="card card-featured">Хит сезона</article>\n  <article class="card">Новинка</article>\n  <article class="card">Скидка</article>\n  <article class="card">Базовый</article>\n  <article class="card">Лимит</article>\n</div>\n',
    starterCss: '.catalog {\n  width: 632px;\n}\n\n.card {\n  height: 96px;\n  padding: 16px;\n  background: #1e293b;\n  color: #f8fafc;\n  border-radius: 10px;\n  font-weight: 600;\n}\n\n.card-featured {\n  background: #0284c7;\n}\n',
    targetHtml: '<div class="catalog">\n  <article class="card card-featured">Хит сезона</article>\n  <article class="card">Новинка</article>\n  <article class="card">Скидка</article>\n  <article class="card">Базовый</article>\n  <article class="card">Лимит</article>\n</div>',
    targetCss: '.catalog {\n  width: 632px;\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n.card {\n  height: 96px;\n  padding: 16px;\n  background: #1e293b;\n  color: #f8fafc;\n  border-radius: 10px;\n  font-weight: 600;\n}\n.card-featured {\n  background: #0284c7;\n  grid-column: span 2;\n}',
    hints: [
      { tier: 1, text: 'Гугли: CSS Grid растянуть элемент на 2 колонки' },
      { tier: 2, text: 'MDN: https://developer.mozilla.org/ru/docs/Web/CSS/grid-column' },
      { tier: 3, text: 'Контейнеру нужна трёхколоночная сетка с отступом 16px, а акцентной карточке — правило растяжения на две колонки.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.catalog использует Grid', selector: '.catalog', property: 'display', expected: 'grid' },
      { type: 'boundingRect', name: 'Акцентная карточка занимает 2 колонки + промежуток (416px)', selector: '.card-featured', property: 'width', expected: 416, tolerance: 2 },
      { type: 'boundingRect', name: 'Вторая карточка стоит в 3-й колонке первого ряда (left: 432px)', selector: '.catalog .card:nth-child(2)', property: 'left', expected: 432, tolerance: 2 },
      { type: 'boundingRect', name: 'Третья карточка перенеслась во второй ряд (top: 112px)', selector: '.catalog .card:nth-child(3)', property: 'top', expected: 112, tolerance: 2 }
    ],
    solution: '.catalog {\n  width: 632px;\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n\n.card {\n  height: 96px;\n  padding: 16px;\n  background: #1e293b;\n  color: #f8fafc;\n  border-radius: 10px;\n  font-weight: 600;\n}\n\n.card-featured {\n  background: #0284c7;\n  grid-column: span 2;\n}'
  },
  {
    id: 'layout-402-grid-sticky-footer',
    title: 'CSS #54 Каркас страницы с прижатым подвалом на Grid',
    track: 'layout',
    level: 4,
    isBoss: false,
    topic: 'css-grid',
    mapTopics: ['CSS Grid', 'Page Layout'],
    learn: 'Если задать строкам сетки шаблон auto 1fr auto, центральная область заберёт всё свободное место, а подвал прижмётся ко дну даже при пустом контенте.',
    needsDom: true,
    codeLanguage: 'css',
    prompt: 'Внутри контейнера .page мало текста, поэтому подвал .page-footer повис посередине. Прижми подвал к нижнему краю контейнера с помощью Grid-строк, сохранив естественную высоту шапки и подвала.',
    specs: [
      'Высота .page фиксирована: 280px, раскладка — CSS Grid',
      'Высота .page-header остаётся 48px, высота .page-footer — 44px',
      'Центральный блок .page-main растягивается на всё оставшееся место по вертикали'
    ],
    starterHtml: '<div class="page">\n  <header class="page-header">Шапка</header>\n  <main class="page-main">Короткая заметка</main>\n  <footer class="page-footer">Подвал 2026</footer>\n</div>\n',
    starterCss: '.page {\n  height: 280px;\n  background: #0f172a;\n  color: #f8fafc;\n}\n\n.page-header {\n  height: 48px;\n  padding: 12px 16px;\n  background: #1e293b;\n}\n\n.page-main {\n  padding: 16px;\n}\n\n.page-footer {\n  height: 44px;\n  padding: 12px 16px;\n  background: #1e293b;\n}\n',
    targetHtml: '<div class="page">\n  <header class="page-header">Шапка</header>\n  <main class="page-main">Короткая заметка</main>\n  <footer class="page-footer">Подвал 2026</footer>\n</div>',
    targetCss: '.page {\n  height: 280px;\n  background: #0f172a;\n  color: #f8fafc;\n  display: grid;\n  grid-template-rows: auto 1fr auto;\n}\n.page-header {\n  height: 48px;\n  padding: 12px 16px;\n  background: #1e293b;\n}\n.page-main {\n  padding: 16px;\n}\n.page-footer {\n  height: 44px;\n  padding: 12px 16px;\n  background: #1e293b;\n}',
    hints: [
      { tier: 1, text: 'Гугли: CSS Grid sticky footer grid-template-rows' },
      { tier: 2, text: 'MDN: https://developer.mozilla.org/ru/docs/Web/CSS/grid-template-rows' },
      { tier: 3, text: 'Задай контейнеру .page три строки: первая и третья по размеру содержимого, а средняя — на всю свободную долю экрана.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.page использует Grid', selector: '.page', property: 'display', expected: 'grid' },
      { type: 'boundingRect', name: 'Высота шапки не раздулась (48px)', selector: '.page-header', property: 'height', expected: 48, tolerance: 2 },
      { type: 'boundingRect', name: 'Центральный блок занял 188px (280 - 48 - 44)', selector: '.page-main', property: 'height', expected: 188, tolerance: 2 },
      { type: 'boundingRect', name: 'Подвал прижат к отметке top: 236px', selector: '.page-footer', property: 'top', expected: 236, tolerance: 2 }
    ],
    solution: '.page {\n  height: 280px;\n  background: #0f172a;\n  color: #f8fafc;\n  display: grid;\n  grid-template-rows: auto 1fr auto;\n}\n\n.page-header {\n  height: 48px;\n  padding: 12px 16px;\n  background: #1e293b;\n}\n\n.page-main {\n  padding: 16px;\n}\n\n.page-footer {\n  height: 44px;\n  padding: 12px 16px;\n  background: #1e293b;\n}'
  },
  {
    id: 'layout-403-grid-auto-fill',
    title: 'CSS #56 Адаптивная сетка карточек без медиазапросов',
    track: 'layout',
    level: 4,
    isBoss: false,
    topic: 'css-grid-responsive',
    mapTopics: ['CSS Grid', 'Responsive'],
    learn: 'Связка repeat(auto-fill, minmax(min, 1fr)) автоматически считает, сколько колонок помещается в контейнер, и переносит лишние карточки без единого @media.',
    needsDom: true,
    codeLanguage: 'css',
    prompt: 'Сделай так, чтобы сетка .auto-grid сама перестраивала число колонок в зависимости от ширины экрана: каждая карточка не должна сжиматься уже 180px, но должна равномерно растягиваться на свободное место в ряду.',
    specs: [
      'Отступ между карточками в .auto-grid: 16px',
      'Минимальная ширина колонки — 180px, максимальная — равная доля свободного места',
      'На экране 800px в ряд помещаются все 4 карточки, а на экране 420px — по 2 карточки в ряд'
    ],
    starterHtml: '<div class="auto-grid">\n  <div class="tile">1</div>\n  <div class="tile">2</div>\n  <div class="tile">3</div>\n  <div class="tile">4</div>\n</div>\n',
    starterCss: '.auto-grid {\n  \n}\n\n.tile {\n  height: 72px;\n  background: #1e293b;\n  color: #38bdf8;\n  border-radius: 10px;\n  padding: 16px;\n  font-weight: 700;\n}\n',
    targetHtml: '<div class="auto-grid">\n  <div class="tile">1</div>\n  <div class="tile">2</div>\n  <div class="tile">3</div>\n  <div class="tile">4</div>\n</div>',
    targetCss: '.auto-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));\n  gap: 16px;\n}\n.tile {\n  height: 72px;\n  background: #1e293b;\n  color: #38bdf8;\n  border-radius: 10px;\n  padding: 16px;\n  font-weight: 700;\n}',
    hints: [
      { tier: 1, text: 'Гугли: CSS Grid auto-fill minmax без медиазапросов' },
      { tier: 2, text: 'MDN: https://developer.mozilla.org/ru/docs/Web/CSS/minmax' },
      { tier: 3, text: 'Используй функцию автоматического повторения колонок с диапазоном размера от 180px до одной свободной доли.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.auto-grid использует Grid', selector: '.auto-grid', property: 'display', expected: 'grid' },
      { type: 'boundingRect', name: 'На ширине 800px 4-я карточка стоит в первом ряду (top: 0)', selector: '.tile:nth-child(4)', property: 'top', expected: 0, tolerance: 2, viewportWidth: 800 },
      { type: 'boundingRect', name: 'На ширине 800px ширина карточки равна 188px', selector: '.tile:nth-child(1)', property: 'width', expected: 188, tolerance: 2, viewportWidth: 800 },
      { type: 'boundingRect', name: 'На ширине 420px 3-я карточка переносится во второй ряд (top: 88px)', selector: '.tile:nth-child(3)', property: 'top', expected: 88, tolerance: 2, viewportWidth: 420 }
    ],
    solution: '.auto-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));\n  gap: 16px;\n}\n\n.tile {\n  height: 72px;\n  background: #1e293b;\n  color: #38bdf8;\n  border-radius: 10px;\n  padding: 16px;\n  font-weight: 700;\n}'
  },
  {
    id: 'layout-404-grid-layer-overlap',
    title: 'CSS #58 Наложение текста поверх баннера через одну ячейку Grid',
    track: 'layout',
    level: 4,
    isBoss: false,
    topic: 'css-grid-overlap',
    mapTopics: ['CSS Grid', 'Stacking'],
    learn: 'Если назначить двум дочерним элементам одну и ту же ячейку сетки (1 / 1), они наложатся друг на друга без использования position: absolute.',
    needsDom: true,
    codeLanguage: 'css',
    prompt: 'Наложи текстовый блок .hero-content поверх фонового блока .hero-bg, используя только возможности CSS Grid (без position: absolute).',
    specs: [
      'Контейнер .hero размером 480×180px работает в режиме Grid',
      'Оба дочерних элемента (.hero-bg и .hero-content) размещены в первой строке и первой колонке сетки',
      'Свойство position у .hero-content должно оставаться static'
    ],
    starterHtml: '<section class="hero">\n  <div class="hero-bg"></div>\n  <div class="hero-content">\n    <h2>Ночной релиз</h2>\n  </div>\n</section>\n',
    starterCss: '.hero {\n  width: 480px;\n  height: 180px;\n  border-radius: 12px;\n  overflow: hidden;\n}\n\n.hero-bg {\n  width: 100%;\n  height: 100%;\n  background: linear-gradient(135deg, #0284c7, #1e1b4b);\n}\n\n.hero-content {\n  padding: 24px;\n  color: #ffffff;\n}\n',
    targetHtml: '<section class="hero">\n  <div class="hero-bg"></div>\n  <div class="hero-content">\n    <h2>Ночной релиз</h2>\n  </div>\n</section>',
    targetCss: '.hero {\n  width: 480px;\n  height: 180px;\n  border-radius: 12px;\n  overflow: hidden;\n  display: grid;\n}\n.hero-bg,\n.hero-content {\n  grid-area: 1 / 1;\n}\n.hero-bg {\n  width: 100%;\n  height: 100%;\n  background: linear-gradient(135deg, #0284c7, #1e1b4b);\n}\n.hero-content {\n  padding: 24px;\n  color: #ffffff;\n}',
    hints: [
      { tier: 1, text: 'Гугли: CSS Grid overlap elements same cell grid-area 1 / 1' },
      { tier: 2, text: 'MDN: https://developer.mozilla.org/ru/docs/Web/CSS/grid-area' },
      { tier: 3, text: 'Включи Grid у родителя и отправь оба дочерних блока в пересечение первой строки и первой колонки.' }
    ],
    checks: [
      { type: 'computedStyle', name: '.hero использует Grid', selector: '.hero', property: 'display', expected: 'grid' },
      { type: 'computedStyle', name: '.hero-content не использует position: absolute', selector: '.hero-content', property: 'position', expected: 'static' },
      { type: 'boundingRect', name: '.hero-content начинается с верхней границы баннера (top: 0)', selector: '.hero-content', property: 'top', expected: 0, tolerance: 2 },
      { type: 'boundingRect', name: '.hero-bg и .hero-content совпадают по левому краю (left: 0)', selector: '.hero-content', property: 'left', expected: 0, tolerance: 2 }
    ],
    solution: '.hero {\n  width: 480px;\n  height: 180px;\n  border-radius: 12px;\n  overflow: hidden;\n  display: grid;\n}\n\n.hero-bg,\n.hero-content {\n  grid-area: 1 / 1;\n}\n\n.hero-bg {\n  width: 100%;\n  height: 100%;\n  background: linear-gradient(135deg, #0284c7, #1e1b4b);\n}\n\n.hero-content {\n  padding: 24px;\n  color: #ffffff;\n}'
  },
  {
    id: 'layout-405-media-query-stack',
    title: 'CSS #61 Медиазапрос: перестройка тулбара на узком экране',
    track: 'layout',
    level: 4,
    isBoss: false,
    topic: 'media-queries',
    mapTopics: ['Media Queries', 'Responsive'],
    learn: 'Директива @media (max-width: ...) позволяет переопределить направление флекса и скрыть второстепенные блоки на мобильных экранах.',
    needsDom: true,
    codeLanguage: 'css',
    prompt: 'На широком экране панель .toolbar выстроена в ряд. Добавь адаптивное правило для экранов шириной 600px и меньше: перестрой .toolbar в вертикальную колонку и полностью скрой подсказку .desktop-hint.',
    specs: [
      'На широком экране (1024px) .toolbar остаётся строкой (flex-direction: row), а .desktop-hint виден',
      'При ширине экрана <= 600px .toolbar переходит в колонку (column)',
      'При ширине экрана <= 600px элемент .desktop-hint скрыт со страницы (display: none)'
    ],
    starterHtml: '<header class="toolbar">\n  <strong>Панель проектов</strong>\n  <span class="desktop-hint">Нажми Ctrl+K для поиска</span>\n  <button type="button">Создать</button>\n</header>\n',
    starterCss: '.toolbar {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n  padding: 16px;\n  background: #1e293b;\n  color: #f8fafc;\n  border-radius: 10px;\n}\n\n.desktop-hint {\n  font-size: 12px;\n  color: #94a3b8;\n}\n\n/* Добавь медиазапрос для экранов <= 600px ниже */\n',
    targetHtml: '<header class="toolbar">\n  <strong>Панель проектов</strong>\n  <span class="desktop-hint">Нажми Ctrl+K для поиска</span>\n  <button type="button">Создать</button>\n</header>',
    targetCss: '.toolbar {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n  padding: 16px;\n  background: #1e293b;\n  color: #f8fafc;\n  border-radius: 10px;\n}\n.desktop-hint {\n  font-size: 12px;\n  color: #94a3b8;\n}\n@media (max-width: 600px) {\n  .toolbar {\n    flex-direction: column;\n  }\n  .desktop-hint {\n    display: none;\n  }\n}',
    hints: [
      { tier: 1, text: 'Гугли: CSS @media max-width 600px' },
      { tier: 2, text: 'MDN: https://developer.mozilla.org/ru/docs/Web/CSS/CSS_media_queries/Using_media_queries' },
      { tier: 3, text: 'Оберни правила смены направления .toolbar и скрытия .desktop-hint в медиазапрос с максимальной шириной 600px.' }
    ],
    checks: [
      { type: 'computedStyle', name: 'На десктопе (1024px) .toolbar остаётся строкой', selector: '.toolbar', property: 'flexDirection', expected: 'row', viewportWidth: 1024 },
      { type: 'computedStyle', name: 'На мобильном (480px) .toolbar выстраивается в колонку', selector: '.toolbar', property: 'flexDirection', expected: 'column', viewportWidth: 480 },
      { type: 'computedStyle', name: 'На мобильном (480px) .desktop-hint скрыт', selector: '.desktop-hint', property: 'display', expected: 'none', viewportWidth: 480 }
    ],
    solution: '.toolbar {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n  padding: 16px;\n  background: #1e293b;\n  color: #f8fafc;\n  border-radius: 10px;\n}\n\n.desktop-hint {\n  font-size: 12px;\n  color: #94a3b8;\n}\n\n@media (max-width: 600px) {\n  .toolbar {\n    flex-direction: column;\n  }\n  .desktop-hint {\n    display: none;\n  }\n}'
  },
  {
    id: 'layout-406-boss-bento-grid',
    title: 'Босс: Адаптивная Bento-сетка аналитики',
    track: 'layout',
    level: 4,
    isBoss: true,
    topic: 'css-grid-boss',
    mapTopics: ['CSS Grid', 'Media Queries', 'Bento Layout'],
    learn: 'Комбинирование двумерного растяжения ячеек (по колонкам и строкам одновременно) со сбросом в одноколоночную сетку на узком экране.',
    needsDom: true,
    codeLanguage: 'css',
    prompt: 'Собери Bento-сетку .bento из 3 равных колонок и 2 строк по 100px (отступ 12px). Главный график .bento-main должен занимать 2 колонки в ширину и 2 строки в высоту, а на экранах <= 600px вся сетка должна перестраиваться в 1 колонку.',
    specs: [
      'На десктопе .bento: 3 равные колонки, 2 строки по 100px, промежуток 12px',
      'Блок .bento-main на десктопе растянут на 2 колонки и 2 строки',
      'На экранах <= 600px у .bento остаётся 1 колонка, а .bento-main занимает 1 колонку и 1 строку'
    ],
    starterHtml: '<section class="bento">\n  <div class="box bento-main">Выручка за год</div>\n  <div class="box">Конверсия 4.8%</div>\n  <div class="box">Новых: 142</div>\n</section>\n',
    starterCss: '.bento {\n  width: 100%;\n  max-width: 624px;\n}\n\n.box {\n  background: #1e293b;\n  color: #f8fafc;\n  padding: 16px;\n  border-radius: 12px;\n  font-weight: 600;\n}\n\n.bento-main {\n  background: #0284c7;\n}\n',
    targetHtml: '<section class="bento">\n  <div class="box bento-main">Выручка за год</div>\n  <div class="box">Конверсия 4.8%</div>\n  <div class="box">Новых: 142</div>\n</section>',
    targetCss: '.bento {\n  width: 100%;\n  max-width: 624px;\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-auto-rows: 100px;\n  gap: 12px;\n}\n.box {\n  background: #1e293b;\n  color: #f8fafc;\n  padding: 16px;\n  border-radius: 12px;\n  font-weight: 600;\n}\n.bento-main {\n  background: #0284c7;\n  grid-column: span 2;\n  grid-row: span 2;\n}\n@media (max-width: 600px) {\n  .bento {\n    grid-template-columns: 1fr;\n  }\n  .bento-main {\n    grid-column: span 1;\n    grid-row: span 1;\n  }\n}',
    hints: [
      { tier: 1, text: 'Гугли: CSS Grid bento layout grid-column span 2 grid-row span 2' },
      { tier: 2, text: 'MDN: https://developer.mozilla.org/ru/docs/Web/CSS/grid-row' },
      { tier: 3, text: 'Задай .bento три колонки, авто-высоту строк 100px и gap 12px. Главному блоку дай растяжение на 2 дорожки по обеим осям, а в медиазапросе до 600px сбрось сетку и растяжение в 1 дорожку.' }
    ],
    checks: [
      { type: 'boundingRect', name: 'На десктопе .bento-main имеет ширину 412px (2 колонки + gap)', selector: '.bento-main', property: 'width', expected: 412, tolerance: 2, viewportWidth: 1024 },
      { type: 'boundingRect', name: 'На десктопе .bento-main имеет высоту 212px (2 строки по 100px + gap)', selector: '.bento-main', property: 'height', expected: 212, tolerance: 2, viewportWidth: 1024 },
      { type: 'boundingRect', name: 'Третья карточка стоит под второй в 3-й колонке (left: 424px, top: 112px)', selector: '.bento .box:nth-child(3)', property: 'left', expected: 424, tolerance: 2, viewportWidth: 1024 },
      { type: 'boundingRect', name: 'На мобильном (480px) все карточки выстраиваются в 1 колонку (left: 0 у второй карточки)', selector: '.bento .box:nth-child(2)', property: 'left', expected: 0, tolerance: 2, viewportWidth: 480 }
    ],
    solution: '.bento {\n  width: 100%;\n  max-width: 624px;\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-auto-rows: 100px;\n  gap: 12px;\n}\n\n.box {\n  background: #1e293b;\n  color: #f8fafc;\n  padding: 16px;\n  border-radius: 12px;\n  font-weight: 600;\n}\n\n.bento-main {\n  background: #0284c7;\n  grid-column: span 2;\n  grid-row: span 2;\n}\n\n@media (max-width: 600px) {\n  .bento {\n    grid-template-columns: 1fr;\n  }\n  .bento-main {\n    grid-column: span 1;\n    grid-row: span 1;\n  }\n}'
  }
];

const logicPack2 = [
  // ================= JS УРОВЕНЬ 3: ЗАМЫКАНИЯ, ФВП И КОЛЛЕКЦИИ =================
  {
    id: 'js-301-closure-step-counter',
    title: 'JS #31 Счётчик с приватным состоянием и сбросом',
    track: 'logic',
    level: 3,
    isBoss: false,
    topic: 'closures',
    mapTopics: ['Closures', 'Lexical Scope'],
    learn: 'Замыкание позволяет методам объекта обращаться к переменным внешней функции, при этом снаружи изменить счётчик напрямую невозможно.',
    needsDom: false,
    codeLanguage: 'javascript',
    prompt: 'Напиши функцию `createStepCounter(initial = 0, step = 1)`, которая возвращает объект с тремя методами: `next()` увеличивает текущее значение на `step` и возвращает новое число, `peek()` возвращает текущее значение без изменения, а `reset()` сбрасывает значение обратно к исходному `initial` и возвращает его.',
    specs: [
      'Два разных счётчика не должны делить одну глобальную переменную',
      'Метод reset() возвращает счётчик к переданному initial (даже если initial не равен 0)',
      'На самом возвращаемом объекте не должно быть публичного поля count или value'
    ],
    starterJs: 'function createStepCounter(initial = 0, step = 1) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Гугли: JavaScript замыкания приватный счётчик' },
      { tier: 2, text: 'MDN: https://developer.mozilla.org/ru/docs/Web/JavaScript/Closures' },
      { tier: 3, text: 'Храни текущее число в локальной переменной внутри функции, а при сбросе присваивай ей стартовый аргумент.' }
    ],
    tests: [
      { name: 'шаг по умолчанию и чтение peek()', call: '(() => { const c = createStepCounter(10, 5); return [c.peek(), c.next(), c.next(), c.peek()]; })()', expected: [10, 15, 20, 20] },
      { name: 'сброс возвращает к initial, а не к нулю', call: '(() => { const c = createStepCounter(10, 5); c.next(); return [c.reset(), c.next()]; })()', expected: [10, 15] },
      { name: 'состояние изолировано в замыкании', call: '(() => { const c = createStepCounter(5, 2); return Object.keys(c).sort(); })()', expected: ['next', 'peek', 'reset'] }
    ],
    solution: 'function createStepCounter(initial = 0, step = 1) {\n  let current = initial;\n  return {\n    next() {\n      current += step;\n      return current;\n    },\n    peek() {\n      return current;\n    },\n    reset() {\n      current = initial;\n      return current;\n    },\n  };\n}'
  },
  {
    id: 'js-302-once-wrapper',
    title: 'JS #33 Обёртка однократного вызова (once)',
    track: 'logic',
    level: 3,
    isBoss: false,
    topic: 'higher-order-functions',
    mapTopics: ['Closures', 'Higher-Order Functions'],
    learn: 'При кэшировании первого вызова нельзя проверять `if (!result)`, потому что целевая функция может законно вернуть `undefined`, `0` или `false`.',
    needsDom: false,
    codeLanguage: 'javascript',
    prompt: 'Напиши функцию `once(fn)`, которая возвращает новую функцию-обёртку. При первом вызове обёртка вызывает `fn` со всеми переданными аргументами и запоминает результат, а при всех последующих вызовах возвращает этот сохранённый результат, больше не вызывая `fn`.',
    specs: [
      'Если fn в первый раз вернула undefined, false или 0, повторно вызывать fn всё равно нельзя',
      'Все аргументы первого вызова должны передаваться в fn'
    ],
    starterJs: 'function once(fn) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Гугли: JavaScript implement once function closure' },
      { tier: 2, text: 'MDN: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/rest_parameters' },
      { tier: 3, text: 'Заведи отдельный булев флаг для проверки того, состоялся ли уже первый вызов, вместо проверки самого сохранённого результата.' }
    ],
    tests: [
      { name: 'вызывает функцию только один раз и хранит первый результат', call: '(() => { let calls = 0; const init = once((x, y) => { calls++; return x + y; }); return [init(2, 3), init(10, 20), calls]; })()', expected: [5, 5, 1] },
      { name: 'не вызывает повторно, даже если первый вызов вернул undefined', call: '(() => { let calls = 0; const noop = once(() => { calls++; return undefined; }); noop(); noop(); return calls; })()', expected: 1 },
      { name: 'корректно работает, если первый вызов вернул 0', call: '(() => { let calls = 0; const zero = once(() => { calls++; return 0; }); return [zero(), zero(), calls]; })()', expected: [0, 0, 1] }
    ],
    solution: 'function once(fn) {\n  let called = false;\n  let cached;\n  return function (...args) {\n    if (!called) {\n      called = true;\n      cached = fn.apply(this, args);\n    }\n    return cached;\n  };\n}'
  },
  {
    id: 'js-303-group-by-safe',
    title: 'JS #35 Безопасная группировка элементов по признаку',
    track: 'logic',
    level: 3,
    isBoss: false,
    topic: 'objects-collections',
    mapTopics: ['Objects', 'Prototypes', 'Higher-Order Functions'],
    learn: 'У обычного объекта `{}` уже есть свойства прототипа вроде `toString` и `constructor`, поэтому проверка `if (!acc[key])` ломается на таких ключах.',
    needsDom: false,
    codeLanguage: 'javascript',
    prompt: 'Напиши функцию `groupBy(items, getKey)`, которая группирует элементы массива `items` в объект по строковому ключу, возвращаемому функцией `getKey(item)`. Функция должна корректно работать с любыми именами ключей, включая зарезервированные имена методов объекта (например, `"toString"`).',
    specs: [
      'Для каждого элемента вызывается getKey(item)',
      'Элементы внутри каждой группы сохраняют исходный порядок',
      'Ключ "toString" или "valueOf" не должен приводить к ошибке'
    ],
    starterJs: 'function groupBy(items, getKey) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Гугли: JavaScript Object.hasOwn vs in operator prototype pollution' },
      { tier: 2, text: 'MDN: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn' },
      { tier: 3, text: 'Проверяй наличие собственного ключа на объекте-аккумуляторе или создавай аккумулятор без прототипа.' }
    ],
    tests: [
      { name: 'группировка по роли', call: 'groupBy([{ name: "Ada", role: "admin" }, { name: "Bob", role: "user" }, { name: "Eve", role: "admin" }], (u) => u.role)', expected: { admin: [{ name: 'Ada', role: 'admin' }, { name: 'Eve', role: 'admin' }], user: [{ name: 'Bob', role: 'user' }] } },
      { name: 'не падает на ключе "toString"', call: 'groupBy(["toString", "map"], (s) => s)', expected: { toString: ['toString'], map: ['map'] } }
    ],
    solution: 'function groupBy(items, getKey) {\n  const out = {};\n  for (const item of items) {\n    const key = String(getKey(item));\n    if (!Object.hasOwn(out, key)) {\n      out[key] = [];\n    }\n    out[key].push(item);\n  }\n  return out;\n}'
  },
  {
    id: 'js-304-memoize-single',
    title: 'JS #37 Кэширующая обёртка (memoize)',
    track: 'logic',
    level: 3,
    isBoss: false,
    topic: 'memoization',
    mapTopics: ['Closures', 'Map', 'Performance'],
    learn: 'Коллекция Map или проверка собственного ключа позволяет отличить «ключа ещё нет в кэше» от «ключ есть, но его значение равно undefined или null».',
    needsDom: false,
    codeLanguage: 'javascript',
    prompt: 'Напиши функцию `memoize(fn)`, которая кэширует результаты вызовов функции одного аргумента `fn(arg)`. Если обёртка вызывается повторно с тем же аргументом, она должна вернуть значение из кэша без повторного запуска `fn`.',
    specs: [
      'Кэш должен работать в том числе когда fn(arg) возвращает null, false, 0 или undefined',
      'Разные аргументы кэшируются независимо'
    ],
    starterJs: 'function memoize(fn) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Гугли: JavaScript Map has get set memoization' },
      { tier: 2, text: 'MDN: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Map' },
      { tier: 3, text: 'Храни кэш в коллекции ключ-значение и перед вычислением проверяй наличие ключа в коллекции, а не истинность сохранённого значения.' }
    ],
    tests: [
      { name: 'считает каждое значение только один раз', call: '(() => { let calls = 0; const sq = memoize((n) => { calls++; return n * n; }); return [sq(4), sq(4), sq(5), calls]; })()', expected: [16, 16, 25, 2] },
      { name: 'кэширует возвращённый undefined без повторного вызова', call: '(() => { let calls = 0; const find = memoize(() => { calls++; return undefined; }); find("x"); find("x"); return calls; })()', expected: 1 }
    ],
    solution: 'function memoize(fn) {\n  const cache = new Map();\n  return function (arg) {\n    if (cache.has(arg)) {\n      return cache.get(arg);\n    }\n    const result = fn(arg);\n    cache.set(arg, result);\n    return result;\n  };\n}'
  },
  {
    id: 'js-305-context-bind-method',
    title: 'JS #39 Потеря контекста this при передаче метода в колбэк',
    track: 'logic',
    level: 3,
    isBoss: false,
    topic: 'this-context',
    mapTopics: ['this', 'bind', 'Closures'],
    learn: 'Когда метод объекта передаётся отдельно как функция `const fn = obj.method`, при вызове `fn()` его `this` теряется и становится `undefined`.',
    needsDom: false,
    codeLanguage: 'javascript',
    prompt: 'Напиши функцию `bindAllMethods(service, methodNames)`, которая принимает объект `service` и массив имён его методов `methodNames` и навсегда привязывает контекст `this` каждого указанного метода к самому объекту `service`, чтобы методы работали даже при отделении от объекта.',
    specs: [
      'Функция возвращает тот же объект service с привязанными методами из списка methodNames',
      'Отделённый метод const fn = service.run; fn() должен сохранять доступ к полям service'
    ],
    starterJs: 'function bindAllMethods(service, methodNames) {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Гугли: JavaScript Function.prototype.bind потеря контекста this' },
      { tier: 2, text: 'MDN: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/bind' },
      { tier: 3, text: 'Пройдись по именам методов и перезапиши каждый метод на объекте его привязанной к этому объекту копией.' }
    ],
    tests: [
      { name: 'сохраняет this после отделения метода в переменную', call: '(() => { const svc = { prefix: "ID:", format(n) { return this.prefix + n; } }; bindAllMethods(svc, ["format"]); const fn = svc.format; return fn(42); })()', expected: 'ID:42' }
    ],
    solution: 'function bindAllMethods(service, methodNames) {\n  for (const name of methodNames) {\n    if (typeof service[name] === "function") {\n      service[name] = service[name].bind(service);\n    }\n  }\n  return service;\n}'
  },
  {
    id: 'js-306-boss-event-emitter',
    title: 'Босс: Шина событий с безопасной отпиской (EventEmitter)',
    track: 'logic',
    level: 3,
    isBoss: true,
    topic: 'closures-boss',
    mapTopics: ['Closures', 'EventEmitter', 'Immutability'],
    learn: 'Если во время перебора массива подписчиков в `emit` один из них отписывается и мутирует массив через `splice`, следующий за ним подписчик пропускается — поэтому перебирать нужно копию списка.',
    needsDom: false,
    codeLanguage: 'javascript',
    prompt: 'Напиши функцию `createEmitter()`, возвращающую шину событий с тремя методами: `on(event, handler)` подписывает функцию и возвращает функцию отписки `unsubscribe()`, `once(event, handler)` подписывает обработчик только на одно следующее срабатывание, а `emit(event, payload)` вызывает все текущие обработчики события по порядку.',
    specs: [
      'Вызов функции, возвращённой из on(event, fn), удаляет только этот обработчик',
      'Обработчик, добавленный через once(event, fn), срабатывает ровно один раз и сам удаляется до следующего emit',
      'Если обработчик удаляется прямо во время emit (например, через once), соседние обработчики того же события не должны быть пропущены'
    ],
    starterJs: 'function createEmitter() {\n  \n}\n',
    hints: [
      { tier: 1, text: 'Гугли: JavaScript EventEmitter on once emit implementation' },
      { tier: 2, text: 'MDN: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/slice' },
      { tier: 3, text: 'Храни списки подписчиков по имени события. При испускании события итерируйся по поверхностной копии массива подписчиков, чтобы удаление одноразового слушателя не сбивало индексы цикла.' }
    ],
    tests: [
      { name: 'подписка on и отписка через возвращённую функцию', call: '(() => { const bus = createEmitter(); const log = []; const off = bus.on("msg", (x) => log.push(x)); bus.emit("msg", 1); off(); bus.emit("msg", 2); return log; })()', expected: [1] },
      { name: 'once срабатывает ровно один раз', call: '(() => { const bus = createEmitter(); const log = []; bus.once("ping", (v) => log.push(v)); bus.emit("ping", "a"); bus.emit("ping", "b"); return log; })()', expected: ['a'] },
      { name: 'удаление once во время emit не пропускает следующий за ним обработчик', call: '(() => { const bus = createEmitter(); const log = []; bus.once("hit", () => log.push("first")); bus.on("hit", () => log.push("second")); bus.emit("hit"); return log; })()', expected: ['first', 'second'] }
    ],
    solution: 'function createEmitter() {\n  const events = new Map();\n\n  function on(event, handler) {\n    const list = events.get(event) ?? [];\n    list.push(handler);\n    events.set(event, list);\n    return function unsubscribe() {\n      const current = events.get(event);\n      if (!current) return;\n      const idx = current.indexOf(handler);\n      if (idx !== -1) current.splice(idx, 1);\n    };\n  }\n\n  function once(event, handler) {\n    const off = on(event, (payload) => {\n      off();\n      handler(payload);\n    });\n    return off;\n  }\n\n  function emit(event, payload) {\n    const list = events.get(event);\n    if (!list) return;\n    for (const handler of [...list]) {\n      handler(payload);\n    }\n  }\n\n  return { on, once, emit };\n}'
  }
];

const layoutDir = path.resolve('content/layout');
const logicDir = path.resolve('content/logic');

fs.mkdirSync(layoutDir, { recursive: true });
fs.mkdirSync(logicDir, { recursive: true });

for (const task of layoutPack2) {
  fs.writeFileSync(
    path.join(layoutDir, `${task.id}.json`),
    JSON.stringify(task, null, 2) + '\n',
    'utf8',
  );
}

for (const task of logicPack2) {
  fs.writeFileSync(
    path.join(logicDir, `${task.id}.json`),
    JSON.stringify(task, null, 2) + '\n',
    'utf8',
  );
}

console.log(
  `✅ Пакет 2 записан: ${layoutPack2.length} задач вёрстки (CSS Ур. 4) и ${logicPack2.length} задач логики (JS Ур. 3).`,
);