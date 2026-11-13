import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Пакет 1: вёрстка (CSS уровни 2 и 3 по карте) и логика (JS уровень 2 по карте).
// Правила, по которым написаны все задачи:
//  1. В условии описан РЕЗУЛЬТАТ, а не код: нет названий свойств и готовых классов.
//  2. Подсказки: 1 = что гуглить, 2 = ссылка на документацию, 3 = идея словами (без кода).
//  3. Поле learn = одна вещь, которую придётся узнать по ходу.
//  4. Проверки не зависят от шрифтов и ширины окна (размеры заданы в стартовом коде).
//  5. Каждая задача проверена: эталон проходит все проверки, стартовый код — нет.
// ---------------------------------------------------------------------------

const MDN = 'https://developer.mozilla.org/en-US/docs/Web';

const solutionText = (html, css) =>
  `/* HTML */\n${html.trim()}\n\n/* CSS */\n${css.trim()}`;

function layoutTask(t) {
  return {
    track: 'layout',
    isBoss: false,
    needsDom: true,
    codeLanguage: 'css',
    starterJs: '',
    targetHtml: t.solutionHtml.trim(),
    targetCss: t.solutionCss.trim(),
    solution: solutionText(t.solutionHtml, t.solutionCss),
    ...t,
    starterHtml: t.starterHtml.trim() + '\n',
    starterCss: t.starterCss.trim() + '\n',
    solutionHtml: undefined,
    solutionCss: undefined,
  };
}

function logicTask(t) {
  return {
    track: 'logic',
    isBoss: false,
    needsDom: false,
    codeLanguage: 'javascript',
    starterHtml: '',
    starterCss: '',
    codeChecks: [],
    ...t,
    starterJs: t.starterJs.trim() + '\n',
    solution: t.solution.trim(),
  };
}

const rect = (name, selector, property, expected, tolerance = 1) => ({
  type: 'boundingRect',
  name,
  selector,
  property,
  expected,
  tolerance,
});
const style = (name, selector, property, expected) => ({
  type: 'computedStyle',
  name,
  selector,
  property,
  expected,
});

// ============================ ВЁРСТКА ======================================
const layoutTasks = [
  // ---------- CSS уровень 2: каскад и наследование ----------
  layoutTask({
    id: 'layout-201-cascade-fight',
    title: 'Кнопка, которая не слушается',
    level: 2,
    topic: 'cascade-specificity',
    mapTopics: ['CSS #21 Каскад', 'CSS #22 Подсчёт специфичности', 'CSS #23 !important и почему его избегают'],
    learn: 'Почему правило, написанное ниже, иногда проигрывает правилу, написанному выше.',
    prompt:
      'У кнопки «Купить» текст красный, хотя тебе нужен белый. Сделай текст кнопки «Купить» белым, а у кнопки «Подробнее» он должен остаться бирюзовым.',
    specs: [
      'Готовые правила в CSS не редактируй и не удаляй: только добавляй новые',
      'Слово !important использовать нельзя',
      'HTML не меняй',
    ],
    starterHtml: `<button class="btn" id="cta">Купить</button>
<button class="btn">Подробнее</button>`,
    starterCss: `body { margin: 0; padding: 24px; }
.btn { padding: 10px 20px; border: 0; border-radius: 8px; background: #0f172a; color: teal; }
#cta { color: crimson; }`,
    solutionHtml: `<button class="btn" id="cta">Купить</button>
<button class="btn">Подробнее</button>`,
    solutionCss: `body { margin: 0; padding: 24px; }
.btn { padding: 10px 20px; border: 0; border-radius: 8px; background: #0f172a; color: teal; }
#cta { color: crimson; }
.btn#cta { color: white; }`,
    hints: [
      { tier: 1, text: 'Загугли: css specificity, id против class, как посчитать специфичность селектора.' },
      { tier: 2, text: `${MDN}/CSS/Specificity` },
      { tier: 3, text: 'Идея: браузер выбирает правило не по порядку, а по «весу» селектора. Нужен селектор тяжелее, чем у правила, которое мешает, но он всё ещё должен целиться только в одну кнопку.' },
    ],
    checks: [
      style('Текст кнопки «Купить» белый', '#cta', 'color', 'rgb(255, 255, 255)'),
      style('Текст кнопки «Подробнее» остался бирюзовым', 'button.btn:not(#cta)', 'color', 'rgb(0, 128, 128)'),
    ],
  }),
  layoutTask({
    id: 'layout-202-inherit-trap',
    title: 'Ссылка и кнопка в чужом оформлении',
    level: 2,
    topic: 'inheritance',
    mapTopics: ['CSS #24 Наследование', 'CSS #25 inherit, initial, unset, revert'],
    learn: 'Не всё наследуется само: ссылки и кнопки живут по своим правилам.',
    prompt:
      'Внутри блока с примечанием ссылка и кнопка выглядят чужими: у ссылки свой цвет, у кнопки свой шрифт. Сделай так, чтобы они выглядели как остальной текст блока: тот же цвет текста, тот же шрифт и размер.',
    specs: [
      'Менять оформление самого блока .note нельзя, он уже настроен',
      'Не копируй значения цвета и шрифта вручную: нужно, чтобы они брались от блока',
    ],
    starterHtml: `<div class="note">
  <p>Нужна помощь? <a href="#help">Напишите нам</a> или нажмите:</p>
  <button type="button">Связаться</button>
</div>`,
    starterCss: `body { margin: 24px; }
.note { color: #1f6f43; font-family: Georgia, serif; font-size: 18px; line-height: 1.5; }`,
    solutionHtml: `<div class="note">
  <p>Нужна помощь? <a href="#help">Напишите нам</a> или нажмите:</p>
  <button type="button">Связаться</button>
</div>`,
    solutionCss: `body { margin: 24px; }
.note { color: #1f6f43; font-family: Georgia, serif; font-size: 18px; line-height: 1.5; }
.note a, .note button { color: inherit; font: inherit; }`,
    hints: [
      { tier: 1, text: 'Загугли: css inherit keyword, почему button не наследует font-family.' },
      { tier: 2, text: `${MDN}/CSS/inherit` },
      { tier: 3, text: 'Идея: для нужных элементов можно прямо сказать «возьми значение у родителя». Для шрифта есть сокращённая запись, которая забирает сразу и семейство, и размер.' },
    ],
    checks: [
      style('Ссылка того же цвета, что и текст блока', '.note a', 'color', 'rgb(31, 111, 67)'),
      style('Кнопка того же цвета', '.note button', 'color', 'rgb(31, 111, 67)'),
      style('Кнопка того же шрифта', '.note button', 'fontFamily', 'Georgia, serif'),
      style('Кнопка того же размера шрифта', '.note button', 'fontSize', '18px'),
    ],
  }),
  layoutTask({
    id: 'layout-203-attribute-selectors',
    title: 'Форма: стили по атрибутам',
    level: 2,
    topic: 'attribute-selectors',
    mapTopics: ['CSS #26 Селекторы атрибутов', 'CSS #22 Подсчёт специфичности'],
    learn: 'Выбирать элементы по атрибутам, не добавляя им классы.',
    prompt:
      'Оформи поля формы, не трогая HTML. Все обязательные поля получают красную рамку толщиной 2px (цвет #dc2626). Все поля, у которых имя начинается с «billing-», получают светло-серый фон (#f1f5f9). Остальные поля остаются как есть.',
    specs: [
      'HTML не меняй: ни классов, ни id добавлять нельзя',
      'Поле может попасть под оба правила сразу',
    ],
    starterHtml: `<form>
  <input type="text" name="nickname" placeholder="Ник">
  <input type="email" name="billing-email" placeholder="Email" required>
  <input type="text" name="billing-city" placeholder="Город">
  <input type="text" name="shipping-city" placeholder="Город доставки" required>
</form>`,
    starterCss: `body { margin: 24px; }
input { display: block; margin-bottom: 8px; padding: 8px; border: 1px solid #94a3b8; background: #ffffff; }`,
    solutionHtml: `<form>
  <input type="text" name="nickname" placeholder="Ник">
  <input type="email" name="billing-email" placeholder="Email" required>
  <input type="text" name="billing-city" placeholder="Город">
  <input type="text" name="shipping-city" placeholder="Город доставки" required>
</form>`,
    solutionCss: `body { margin: 24px; }
input { display: block; margin-bottom: 8px; padding: 8px; border: 1px solid #94a3b8; background: #ffffff; }
input[required] { border: 2px solid #dc2626; }
input[name^="billing-"] { background: #f1f5f9; }`,
    hints: [
      { tier: 1, text: 'Загугли: css attribute selector, начинается с, атрибут required.' },
      { tier: 2, text: `${MDN}/CSS/Attribute_selectors` },
      { tier: 3, text: 'Идея: в квадратных скобках можно проверять не только наличие атрибута, но и то, с чего начинается его значение. Два независимых правила, каждое про свой признак.' },
    ],
    checks: [
      style('Обязательное поле: рамка 2px', 'input[name="billing-email"]', 'borderTopWidth', '2px'),
      style('Обязательное поле: красный цвет рамки', 'input[name="billing-email"]', 'borderTopColor', 'rgb(220, 38, 38)'),
      style('Обязательное поле «shipping-city» тоже с рамкой 2px', 'input[name="shipping-city"]', 'borderTopWidth', '2px'),
      style('Необязательное поле «nickname» осталось с рамкой 1px', 'input[name="nickname"]', 'borderTopWidth', '1px'),
      style('Поле «billing-email» с серым фоном', 'input[name="billing-email"]', 'backgroundColor', 'rgb(241, 245, 249)'),
      style('Поле «billing-city» с серым фоном', 'input[name="billing-city"]', 'backgroundColor', 'rgb(241, 245, 249)'),
      style('Поле «shipping-city» осталось белым', 'input[name="shipping-city"]', 'backgroundColor', 'rgb(255, 255, 255)'),
    ],
  }),
  layoutTask({
    id: 'layout-204-zebra-table',
    title: 'Таблица-зебра',
    level: 2,
    topic: 'structural-pseudo-classes',
    mapTopics: ['CSS #29 Структурные: :first-child, :nth-child(), :nth-of-type()'],
    learn: 'Выбирать чётные строки и крайние элементы одним правилом.',
    prompt:
      'Оформи таблицу заказов: чётные строки тела таблицы закрашены светло-серым (#f1f5f9), нечётные без фона. Последняя строка (итого) выделена жирным. Текст в первой колонке приглушённый: цвет #64748b.',
    specs: [
      'Фон задаётся самим строкам (tr), не ячейкам',
      'HTML не меняй: ни классов, ни id добавлять нельзя',
    ],
    starterHtml: `<table>
  <thead>
    <tr><th>№</th><th>Товар</th><th>Сумма</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Клавиатура</td><td>4 900</td></tr>
    <tr><td>2</td><td>Мышь</td><td>2 300</td></tr>
    <tr><td>3</td><td>Коврик</td><td>900</td></tr>
    <tr><td>4</td><td>Кабель</td><td>450</td></tr>
    <tr><td>5</td><td>Итого</td><td>8 550</td></tr>
  </tbody>
</table>`,
    starterCss: `body { margin: 24px; }
table { border-collapse: collapse; }
th, td { padding: 8px 12px; text-align: left; color: #0f172a; }`,
    solutionHtml: `<table>
  <thead>
    <tr><th>№</th><th>Товар</th><th>Сумма</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Клавиатура</td><td>4 900</td></tr>
    <tr><td>2</td><td>Мышь</td><td>2 300</td></tr>
    <tr><td>3</td><td>Коврик</td><td>900</td></tr>
    <tr><td>4</td><td>Кабель</td><td>450</td></tr>
    <tr><td>5</td><td>Итого</td><td>8 550</td></tr>
  </tbody>
</table>`,
    solutionCss: `body { margin: 24px; }
table { border-collapse: collapse; }
th, td { padding: 8px 12px; text-align: left; color: #0f172a; }
tbody tr:nth-child(even) { background: #f1f5f9; }
tbody tr:last-child { font-weight: bold; }
tbody td:first-child { color: #64748b; }`,
    hints: [
      { tier: 1, text: 'Загугли: css nth-child even odd, css last-child, css first-child.' },
      { tier: 2, text: `${MDN}/CSS/:nth-child` },
      { tier: 3, text: 'Идея: три правила. В одном селектор выбирает «каждую вторую» строку, в другом «последнюю», в третьем «первую ячейку в каждой строке». Ключевое слово для чётных есть прямо в языке.' },
    ],
    checks: [
      style('Строка 2 закрашена', 'tbody tr:nth-child(2)', 'backgroundColor', 'rgb(241, 245, 249)'),
      style('Строка 4 закрашена', 'tbody tr:nth-child(4)', 'backgroundColor', 'rgb(241, 245, 249)'),
      style('Строка 1 без фона', 'tbody tr:nth-child(1)', 'backgroundColor', 'rgba(0, 0, 0, 0)'),
      style('Строка 3 без фона', 'tbody tr:nth-child(3)', 'backgroundColor', 'rgba(0, 0, 0, 0)'),
      style('Последняя строка жирная', 'tbody tr:last-child', 'fontWeight', '700'),
      style('Первая колонка приглушена', 'tbody tr:nth-child(2) td:first-child', 'color', 'rgb(100, 116, 139)'),
      style('Вторая колонка остаётся тёмной', 'tbody tr:nth-child(2) td:nth-child(2)', 'color', 'rgb(15, 23, 42)'),
    ],
  }),
  layoutTask({
    id: 'layout-205-boss-inbox',
    title: 'Босс: входящие без !important',
    level: 2,
    isBoss: true,
    topic: 'cascade-boss',
    mapTopics: ['CSS #21 Каскад', 'CSS #22 Подсчёт специфичности', 'CSS #29 Структурные', 'CSS #30 :not(), :is(), :where()'],
    learn: 'Как выиграть битву селекторов, не прибегая к !important.',
    prompt:
      'Оформи список уведомлений. Непрочитанные (без класса read) выделены жирным и синей полосой слева шириной 4px (#2563eb). Прочитанные остаются серыми и обычной толщины. Ошибка (класс error) всегда красная (#dc2626), даже если она прочитана. У первого пункта нет верхнего отступа, у последнего нет нижней линии.',
    specs: [
      'Готовые правила не редактируй и не удаляй, только добавляй новые',
      'Слово !important использовать нельзя',
      'HTML не меняй',
    ],
    starterHtml: `<ul id="inbox">
  <li class="item">Новый комментарий к вашему посту</li>
  <li class="item read">Вас упомянули в обсуждении</li>
  <li class="item read error">Не удалось отправить файл</li>
  <li class="item">Пришло приглашение в команду</li>
  <li class="item read">Еженедельный отчёт готов</li>
</ul>`,
    starterCss: `body { margin: 24px; }
#inbox { list-style: none; margin: 0; padding: 0; width: 360px; }
#inbox .item { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #0f172a; margin-top: 8px; }
#inbox .read { color: #94a3b8; }
.error { color: #dc2626; }`,
    solutionHtml: `<ul id="inbox">
  <li class="item">Новый комментарий к вашему посту</li>
  <li class="item read">Вас упомянули в обсуждении</li>
  <li class="item read error">Не удалось отправить файл</li>
  <li class="item">Пришло приглашение в команду</li>
  <li class="item read">Еженедельный отчёт готов</li>
</ul>`,
    solutionCss: `body { margin: 24px; }
#inbox { list-style: none; margin: 0; padding: 0; width: 360px; }
#inbox .item { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #0f172a; margin-top: 8px; }
#inbox .read { color: #94a3b8; }
.error { color: #dc2626; }
#inbox .item:not(.read) { font-weight: 700; border-left: 4px solid #2563eb; }
#inbox .read.error { color: #dc2626; }
#inbox .item:first-child { margin-top: 0; }
#inbox .item:last-child { border-bottom: 0; }`,
    hints: [
      { tier: 1, text: 'Загугли: css :not() selector, css specificity id class, почему margin не перебивается.' },
      { tier: 2, text: `${MDN}/CSS/:not` },
      { tier: 3, text: 'Идея: у существующих правил в селекторе есть id, а значит новые правила тоже должны «весить» не меньше. Для «не прочитано» нужен селектор с отрицанием, для «красная ошибка» нужно перевесить серый цвет прочитанных.' },
    ],
    checks: [
      style('Непрочитанное: жирный шрифт', '#inbox li:nth-child(1)', 'fontWeight', '700'),
      style('Непрочитанное: синяя полоса 4px слева', '#inbox li:nth-child(1)', 'borderLeftWidth', '4px'),
      style('Цвет полосы синий', '#inbox li:nth-child(1)', 'borderLeftColor', 'rgb(37, 99, 235)'),
      style('У первого пункта нет верхнего отступа', '#inbox li:nth-child(1)', 'marginTop', '0px'),
      style('Прочитанное: серый текст', '#inbox li:nth-child(2)', 'color', 'rgb(148, 163, 184)'),
      style('Прочитанное: обычная толщина', '#inbox li:nth-child(2)', 'fontWeight', '400'),
      style('Прочитанное: без полосы слева', '#inbox li:nth-child(2)', 'borderLeftWidth', '0px'),
      style('Прочитанная ошибка красная', '#inbox li:nth-child(3)', 'color', 'rgb(220, 38, 38)'),
      style('Второе непрочитанное тоже жирное', '#inbox li:nth-child(4)', 'fontWeight', '700'),
      style('У последнего пункта нет нижней линии', '#inbox li:last-child', 'borderBottomWidth', '0px'),
    ],
  }),

  // ---------- CSS уровень 3: позиционирование и flexbox ----------
  layoutTask({
    id: 'layout-301-corner-badge',
    title: 'Бейдж в углу карточки',
    level: 3,
    topic: 'positioning',
    mapTopics: ['CSS #35 position', 'CSS #36 top/right/bottom/left и inset', 'CSS #37 Containing block'],
    learn: 'Элемент с абсолютным позиционированием считает отступы не от страницы, а от ближайшего «позиционированного» предка.',
    prompt:
      'Поставь бейдж «NEW» в правый верхний угол карточки: 12px от верхнего края и 12px от правого. Сама карточка не должна поменять размер, а остальной текст остаться на своих местах.',
    specs: [
      'Размер карточки 240×160 менять нельзя',
      'Карточка стоит на странице не в углу, а с отступом, поэтому бейдж нельзя «приколотить» к странице',
    ],
    starterHtml: `<div class="card">
  <span class="badge">NEW</span>
  <h3>Командный план</h3>
  <p>Безлимитные проекты</p>
</div>`,
    starterCss: `body { margin: 0; font: 16px/1.4 system-ui, sans-serif; }
.card { width: 240px; height: 160px; margin: 40px; padding: 16px; box-sizing: border-box; background: #e2e8f0; }
.card h3 { margin: 0 0 8px; }
.card p { margin: 0; }
.badge { background: #f59e0b; color: #fff; padding: 4px 8px; font-size: 12px; border-radius: 999px; }`,
    solutionHtml: `<div class="card">
  <span class="badge">NEW</span>
  <h3>Командный план</h3>
  <p>Безлимитные проекты</p>
</div>`,
    solutionCss: `body { margin: 0; font: 16px/1.4 system-ui, sans-serif; }
.card { position: relative; width: 240px; height: 160px; margin: 40px; padding: 16px; box-sizing: border-box; background: #e2e8f0; }
.card h3 { margin: 0 0 8px; }
.card p { margin: 0; }
.badge { position: absolute; top: 12px; right: 12px; background: #f59e0b; color: #fff; padding: 4px 8px; font-size: 12px; border-radius: 999px; }`,
    hints: [
      { tier: 1, text: 'Загугли: css position absolute относительно родителя, containing block.' },
      { tier: 2, text: `${MDN}/CSS/position` },
      { tier: 3, text: 'Идея: бейдж нужно «вынуть» из обычного потока и задать ему отступы от краёв. Но отсчитываться они будут от того предка, у которого тоже задано позиционирование. Значит, одно правило нужно не бейджу, а карточке.' },
    ],
    checks: [
      rect('Бейдж на 12px ниже верхнего края карточки', '.badge', 'top', 52),
      rect('Бейдж на 12px левее правого края карточки', '.badge', 'right', 268),
      rect('Высота карточки не изменилась', '.card', 'height', 160),
      rect('Ширина карточки не изменилась', '.card', 'width', 240),
    ],
  }),
  layoutTask({
    id: 'layout-302-navbar',
    title: 'Навигация: логотип слева, ссылки справа',
    level: 3,
    topic: 'flexbox-basics',
    mapTopics: ['CSS #41 Flexbox: контейнер и элементы', 'CSS #42 justify-content и align-items', 'CSS #44 gap'],
    learn: 'Одной строкой выстроить элементы по разным краям и по центру высоты.',
    prompt:
      'Собери шапку 800px шириной и 64px высотой. Логотип прижат влево, ссылки прижаты вправо, между ссылками промежуток 24px. По бокам отступ 24px, всё выровнено по центру шапки по вертикали.',
    specs: [
      'Размеры логотипа (80×32) и ссылок (72×24) уже заданы, менять их не нужно',
      'Ссылки должны идти в ряд, тремя блоками одинаковой ширины',
    ],
    starterHtml: `<header class="nav">
  <div class="logo">Logo</div>
  <nav class="links">
    <a href="#catalog">Каталог</a>
    <a href="#prices">Цены</a>
    <a href="#login">Войти</a>
  </nav>
</header>`,
    starterCss: `body { margin: 0; font: 16px/24px system-ui, sans-serif; }
.nav { width: 800px; height: 64px; padding: 0 24px; box-sizing: border-box; background: #0f172a; color: #fff; }
.logo { width: 80px; height: 32px; background: #38bdf8; }
.links a { width: 72px; height: 24px; text-align: center; color: #fff; }`,
    solutionHtml: `<header class="nav">
  <div class="logo">Logo</div>
  <nav class="links">
    <a href="#catalog">Каталог</a>
    <a href="#prices">Цены</a>
    <a href="#login">Войти</a>
  </nav>
</header>`,
    solutionCss: `body { margin: 0; font: 16px/24px system-ui, sans-serif; }
.nav { display: flex; justify-content: space-between; align-items: center; width: 800px; height: 64px; padding: 0 24px; box-sizing: border-box; background: #0f172a; color: #fff; }
.logo { width: 80px; height: 32px; background: #38bdf8; }
.links { display: flex; gap: 24px; }
.links a { width: 72px; height: 24px; text-align: center; color: #fff; }`,
    hints: [
      { tier: 1, text: 'Загугли: flexbox space-between, flex gap, align-items center, вложенный flex.' },
      { tier: 2, text: `${MDN}/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox` },
      { tier: 3, text: 'Идея: «флексом» нужно сделать и саму шапку, и блок со ссылками. У шапки есть способ раздвинуть двух детей по краям и общий способ выровнять их по центру высоты. У блока со ссылками есть свойство для промежутка.' },
    ],
    checks: [
      rect('Логотип прижат влево с отступом 24px', '.logo', 'left', 24),
      rect('Логотип по центру высоты шапки', '.logo', 'top', 16),
      rect('Первая ссылка на своём месте', '.links a:nth-child(1)', 'left', 512),
      rect('Вторая ссылка: промежуток 24px', '.links a:nth-child(2)', 'left', 608),
      rect('Последняя ссылка прижата вправо с отступом 24px', '.links a:nth-child(3)', 'right', 776),
      rect('Ссылки по центру высоты шапки', '.links a:nth-child(1)', 'top', 20),
    ],
  }),
  layoutTask({
    id: 'layout-303-center-everything',
    title: 'Центрирование, которое переживёт любой размер',
    level: 3,
    topic: 'centering',
    mapTopics: ['CSS #42 justify-content и align-items', 'CSS #49 Центрирование всеми способами'],
    learn: 'Центрировать без подсчёта пикселей вручную.',
    prompt:
      'Поставь синий квадрат .box ровно в центр каждой из трёх серых сцен. Сцены разного размера, а оформляться все должны одним общим правилом: если завтра сцена изменится, квадрат должен остаться по центру.',
    specs: [
      'Размер квадрата (100×60) и сцен менять нельзя',
      'Правила для отдельных сцен по id писать не нужно: проверка поймает любой «ручной» расчёт',
    ],
    starterHtml: `<div class="stage" id="s1"><div class="box"></div></div>
<div class="stage" id="s2"><div class="box"></div></div>
<div class="stage" id="s3"><div class="box"></div></div>`,
    starterCss: `body { margin: 0; }
.stage { background: #e2e8f0; margin: 0 0 20px; }
#s1 { width: 300px; height: 200px; }
#s2 { width: 480px; height: 300px; }
#s3 { width: 200px; height: 200px; }
.box { width: 100px; height: 60px; background: #2563eb; }`,
    solutionHtml: `<div class="stage" id="s1"><div class="box"></div></div>
<div class="stage" id="s2"><div class="box"></div></div>
<div class="stage" id="s3"><div class="box"></div></div>`,
    solutionCss: `body { margin: 0; }
.stage { display: grid; place-items: center; background: #e2e8f0; margin: 0 0 20px; }
#s1 { width: 300px; height: 200px; }
#s2 { width: 480px; height: 300px; }
#s3 { width: 200px; height: 200px; }
.box { width: 100px; height: 60px; background: #2563eb; }`,
    hints: [
      { tier: 1, text: 'Загугли: как отцентрировать div по вертикали и горизонтали, flexbox center, grid place-items.' },
      { tier: 2, text: `${MDN}/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container` },
      { tier: 3, text: 'Идея: достаточно одного правила на общий класс сцены. Есть два современных способа (на разных системах раскладки), у каждого для этого хватает двух-трёх свойств.' },
    ],
    checks: [
      rect('Сцена 1: квадрат по центру по горизонтали', '#s1 .box', 'left', 100),
      rect('Сцена 1: квадрат по центру по вертикали', '#s1 .box', 'top', 70),
      rect('Сцена 2: квадрат по центру по горизонтали', '#s2 .box', 'left', 190),
      rect('Сцена 2: квадрат по центру по вертикали', '#s2 .box', 'top', 340),
      rect('Сцена 3: квадрат по центру по горизонтали', '#s3 .box', 'left', 50),
      rect('Сцена 3: квадрат по центру по вертикали', '#s3 .box', 'top', 610),
    ],
  }),
  layoutTask({
    id: 'layout-304-search-bar',
    title: 'Строка поиска, которая не ломается',
    level: 3,
    topic: 'flex-grow-shrink',
    mapTopics: ['CSS #45 flex-grow, flex-shrink, flex-basis', 'CSS #46 Сокращение flex: 1', 'CSS #48 min-width: 0 и переполнение во флексе'],
    learn: 'Почему поле ввода не сжимается так, как ты ожидаешь, и как ему это разрешить.',
    prompt:
      'Сделай строку поиска: иконка 40px слева, кнопка 100px справа, между ними промежуток 8px и поле ввода, которое занимает всё оставшееся место. Это должно работать и в широкой строке (600px), и в узкой (200px): в узкой кнопка и иконка не должны сплющиться, пусть сжимается только поле.',
    specs: [
      'Размеры иконки (40px) и кнопки (100px) уже заданы в стартовом коде',
      'Проверяются обе строки: #wide и #narrow',
    ],
    starterHtml: `<div class="search" id="wide">
  <span class="icon">🔍</span>
  <input class="query" type="text" placeholder="Поиск по тренажёру">
  <button class="go" type="button">Найти</button>
</div>
<div class="search" id="narrow">
  <span class="icon">🔍</span>
  <input class="query" type="text" placeholder="Поиск">
  <button class="go" type="button">Найти</button>
</div>`,
    starterCss: `body { margin: 0; font: 16px system-ui, sans-serif; }
.search { background: #f1f5f9; margin-bottom: 20px; }
#wide { width: 600px; }
#narrow { width: 200px; }
.icon { width: 40px; height: 40px; text-align: center; line-height: 40px; background: #cbd5e1; }
.query { height: 40px; box-sizing: border-box; border: 1px solid #94a3b8; }
.go { width: 100px; height: 40px; border: 0; background: #2563eb; color: #fff; }`,
    solutionHtml: `<div class="search" id="wide">
  <span class="icon">🔍</span>
  <input class="query" type="text" placeholder="Поиск по тренажёру">
  <button class="go" type="button">Найти</button>
</div>
<div class="search" id="narrow">
  <span class="icon">🔍</span>
  <input class="query" type="text" placeholder="Поиск">
  <button class="go" type="button">Найти</button>
</div>`,
    solutionCss: `body { margin: 0; font: 16px system-ui, sans-serif; }
.search { display: flex; gap: 8px; background: #f1f5f9; margin-bottom: 20px; }
#wide { width: 600px; }
#narrow { width: 200px; }
.icon { flex: none; width: 40px; height: 40px; text-align: center; line-height: 40px; background: #cbd5e1; }
.query { flex: 1; min-width: 0; height: 40px; box-sizing: border-box; border: 1px solid #94a3b8; }
.go { flex: none; width: 100px; height: 40px; border: 0; background: #2563eb; color: #fff; }`,
    hints: [
      { tier: 1, text: 'Загугли: flex 1 растянуть input, flex-shrink 0, почему input не сжимается во flex, min-width 0.' },
      { tier: 2, text: `${MDN}/CSS/flex` },
      { tier: 3, text: 'Идея: поле должно уметь расти и уметь сжиматься, но у поля ввода есть «минимальная ширина по умолчанию», которая мешает сжатию. Иконке и кнопке нужно, наоборот, запретить сжиматься.' },
    ],
    checks: [
      rect('Широкая строка: поле занимает всё свободное место', '#wide .query', 'width', 444),
      rect('Широкая строка: кнопка прижата вправо', '#wide .go', 'left', 500),
      rect('Узкая строка: поле сжалось до остатка', '#narrow .query', 'width', 44),
      rect('Узкая строка: кнопка не сплющилась', '#narrow .go', 'width', 100),
      rect('Узкая строка: иконка не сплющилась', '#narrow .icon', 'width', 40),
    ],
  }),
  layoutTask({
    id: 'layout-305-boss-app-layout',
    title: 'Босс: каркас приложения с прокруткой внутри',
    level: 3,
    isBoss: true,
    topic: 'flex-layout-boss',
    mapTopics: ['CSS #41 Flexbox', 'CSS #45 flex-grow, flex-shrink, flex-basis', 'CSS #48 min-width: 0 и переполнение', 'CSS #18 overflow'],
    learn: 'Как заставить длинное содержимое прокручиваться внутри области, а не растягивать всю страницу.',
    prompt:
      'Собери каркас приложения 600×400: сверху шапка 56px, снизу подвал 40px, слева меню 160px, справа основная область занимает всё остальное. Основной контент очень длинный, но страница расти не должна: прокручиваться должна только основная область.',
    specs: [
      'Размеры шапки, подвала и меню уже заданы в стартовом коде',
      'Общая высота .app остаётся 400px',
      'Можно менять HTML: обёртка .middle уже стоит на своём месте',
    ],
    starterHtml: `<div class="app">
  <header class="top">Тренажёр</header>
  <div class="middle">
    <aside class="side">Меню</aside>
    <main class="main">
${Array.from({ length: 24 }, (_, i) => `      <p>Строка ${i + 1}</p>`).join('\n')}
    </main>
  </div>
  <footer class="foot">© 2026</footer>
</div>`,
    starterCss: `body { margin: 0; font: 14px/20px system-ui, sans-serif; }
.app { width: 600px; height: 400px; background: #f8fafc; }
.top { height: 56px; background: #0f172a; color: #fff; }
.side { width: 160px; background: #e2e8f0; }
.foot { height: 40px; background: #0f172a; color: #fff; }`,
    solutionHtml: `<div class="app">
  <header class="top">Тренажёр</header>
  <div class="middle">
    <aside class="side">Меню</aside>
    <main class="main">
${Array.from({ length: 24 }, (_, i) => `      <p>Строка ${i + 1}</p>`).join('\n')}
    </main>
  </div>
  <footer class="foot">© 2026</footer>
</div>`,
    solutionCss: `body { margin: 0; font: 14px/20px system-ui, sans-serif; }
.app { display: flex; flex-direction: column; width: 600px; height: 400px; background: #f8fafc; }
.top { flex: none; height: 56px; background: #0f172a; color: #fff; }
.middle { flex: 1; display: flex; min-height: 0; }
.side { flex: none; width: 160px; background: #e2e8f0; }
.main { flex: 1; overflow: auto; }
.foot { flex: none; height: 40px; background: #0f172a; color: #fff; }`,
    hints: [
      { tier: 1, text: 'Загугли: flexbox sticky footer, flex column height 100%, min-height 0 flex scroll, overflow auto.' },
      { tier: 2, text: `${MDN}/CSS/min-width` },
      { tier: 3, text: 'Идея: два уровня флекса, внешний вертикальный и внутренний горизонтальный. Средняя часть должна занять оставшуюся высоту, но по умолчанию её «минимальная высота» равна высоте всего контента, и страница растёт. Это поведение надо отключить, а прокрутку включить на основной области.' },
    ],
    checks: [
      rect('Общая высота каркаса осталась 400px', '.app', 'height', 400),
      rect('Подвал прижат к низу', '.foot', 'top', 360),
      rect('Меню начинается под шапкой', '.side', 'top', 56),
      rect('Ширина меню 160px', '.side', 'width', 160),
      rect('Меню занимает всю высоту между шапкой и подвалом', '.side', 'height', 304),
      rect('Основная область начинается после меню', '.main', 'left', 160),
      rect('Основная область занимает остаток ширины', '.main', 'width', 440),
      rect('Основная область не растёт вместе с контентом', '.main', 'height', 304),
    ],
  }),
];

// ============================ ЛОГИКА =======================================
const logicTasks = [
  // ---------- JS уровень 2: структуры данных ----------
  logicTask({
    id: 'js-201-unique-by-id',
    title: 'Дубликаты в корзине',
    level: 2,
    topic: 'arrays-set',
    mapTopics: ['JS #25 find, some, every, includes', 'JS #37 Map и Set'],
    learn: 'Как быстро запоминать «уже видел» и не писать цикл в цикле.',
    prompt:
      'В корзине один и тот же товар оказался несколько раз. Напиши функцию uniqueById(items): она принимает массив объектов с полем id и возвращает новый массив без повторов по id. Из повторяющихся остаётся первый объект, порядок сохраняется. Исходный массив менять нельзя.',
    specs: [
      'Функция называется uniqueById и принимает один аргумент',
      'Возвращает новый массив, исходный остаётся нетронутым',
    ],
    starterJs: `// items: массив объектов вида { id, ... }
function uniqueById(items) {

}`,
    hints: [
      { tier: 1, text: 'Загугли: javascript убрать дубликаты в массиве объектов по полю, структура Set.' },
      { tier: 2, text: `${MDN}/JavaScript/Reference/Global_Objects/Set` },
      { tier: 3, text: 'Идея: идёшь по массиву и ведёшь «список уже встреченных id» в структуре, где проверка наличия мгновенная. Пропускаешь элемент, если его id уже встречался.' },
    ],
    tests: [
      { name: 'повтор в середине', call: "uniqueById([{ id: 1, n: 'a' }, { id: 2, n: 'b' }, { id: 1, n: 'c' }])", expected: [{ id: 1, n: 'a' }, { id: 2, n: 'b' }] },
      { name: 'пустой массив', call: 'uniqueById([])', expected: [] },
      { name: 'все одинаковые', call: 'uniqueById([{ id: 5 }, { id: 5 }, { id: 5 }])', expected: [{ id: 5 }] },
      { name: 'порядок сохраняется', call: 'uniqueById([{ id: 3 }, { id: 1 }, { id: 3 }, { id: 2 }, { id: 1 }])', expected: [{ id: 3 }, { id: 1 }, { id: 2 }] },
      { name: 'исходный массив не изменён', call: "(() => { const a = [{ id: 1 }, { id: 1 }]; uniqueById(a); return a.length; })()", expected: 2 },
    ],
    solution: `function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}`,
  }),
  logicTask({
    id: 'js-202-count-by',
    title: 'Сколько кого',
    level: 2,
    topic: 'reduce-objects',
    mapTopics: ['JS #26 reduce', 'JS #30 Вычисляемые ключи'],
    learn: 'reduce с объектом в роли накопителя и ключи, которые вычисляются на лету.',
    prompt:
      'Напиши функцию countBy(items, key): она принимает массив объектов и название поля, а возвращает объект, где для каждого встретившегося значения этого поля записано, сколько раз оно встретилось.',
    specs: [
      'Функция называется countBy и принимает два аргумента: массив и название поля',
      'Результат — обычный объект вида { значение: количество }',
    ],
    starterJs: `// items: массив объектов, key: строка с названием поля
function countBy(items, key) {

}`,
    hints: [
      { tier: 1, text: 'Загугли: javascript reduce объект как аккумулятор, квадратные скобки вместо точки для ключа из переменной.' },
      { tier: 2, text: `${MDN}/JavaScript/Reference/Global_Objects/Array/reduce` },
      { tier: 3, text: 'Идея: начни с пустого объекта и для каждого элемента увеличивай счётчик под нужным ключом. Для нового ключа счётчик ещё не существует, об этом надо позаботиться.' },
    ],
    tests: [
      { name: 'роли пользователей', call: "countBy([{ role: 'admin' }, { role: 'user' }, { role: 'user' }], 'role')", expected: { admin: 1, user: 2 } },
      { name: 'пустой массив', call: "countBy([], 'role')", expected: {} },
      { name: 'числовые значения', call: "countBy([{ n: 1 }, { n: 1 }, { n: 2 }], 'n')", expected: { 1: 2, 2: 1 } },
      { name: 'другое поле', call: "countBy([{ city: 'Москва', age: 20 }, { city: 'Казань', age: 20 }], 'age')", expected: { 20: 2 } },
    ],
    solution: `function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key];
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}`,
  }),
  logicTask({
    id: 'js-203-word-frequency',
    title: 'Частота слов',
    level: 2,
    topic: 'strings-regex',
    mapTopics: ['JS #7 Строки: методы', 'JS #30 Вычисляемые ключи', 'JS #31 Object.keys, values, entries, fromEntries'],
    learn: 'Как разрезать текст на слова и убрать знаки препинания, включая русские буквы.',
    prompt:
      'Напиши функцию wordFrequency(text): она считает, сколько раз встречается каждое слово. Регистр не важен («Привет» и «привет» одно слово), знаки препинания не считаются частью слова, лишние пробелы игнорируются.',
    specs: [
      'Функция называется wordFrequency и принимает строку',
      'Работает с русскими и английскими словами',
      'Результат — объект вида { слово: количество }, слова в нижнем регистре',
    ],
    starterJs: `function wordFrequency(text) {

}`,
    hints: [
      { tier: 1, text: 'Загугли: javascript split по пробелам регулярка, убрать знаки препинания regex unicode кириллица.' },
      { tier: 2, text: `${MDN}/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape` },
      { tier: 3, text: 'Идея: сначала приведи к одному регистру и выбрось всё, что не буква и не цифра и не пробел (по умолчанию regexp понимает только латиницу, ищи флаг для Unicode). Потом режь по пробелам, не забывая про пустые куски.' },
    ],
    tests: [
      { name: 'русский текст со знаками', call: "wordFrequency('Привет, мир! привет')", expected: { привет: 2, мир: 1 } },
      { name: 'лишние пробелы и регистр', call: "wordFrequency('  a  A b ')", expected: { a: 2, b: 1 } },
      { name: 'пустая строка', call: "wordFrequency('')", expected: {} },
      { name: 'много знаков', call: "wordFrequency('Hello, hello... HELLO!')", expected: { hello: 3 } },
      { name: 'цифры считаются словами', call: "wordFrequency('go go 2026')", expected: { go: 2, 2026: 1 } },
    ],
    solution: `function wordFrequency(text) {
  const words = text
    .toLowerCase()
    .replace(/[^\\p{L}\\p{N}\\s]/gu, '')
    .split(/\\s+/)
    .filter(Boolean);
  const result = {};
  for (const word of words) {
    result[word] = (result[word] ?? 0) + 1;
  }
  return result;
}`,
  }),
  logicTask({
    id: 'js-204-sort-users',
    title: 'Сортировка без побочных эффектов',
    level: 2,
    topic: 'sort-immutability',
    mapTopics: ['JS #22 Мутирующие методы: sort', 'JS #23 Немутирующие методы', 'JS #35 Ссылочные типы'],
    learn: 'sort меняет исходный массив, и это одна из самых частых скрытых ошибок в React.',
    prompt:
      'Напиши функцию sortUsers(users, field, direction), которая возвращает новый массив, отсортированный по полю field. direction равно "asc" (по умолчанию) или "desc". Числа сортируются как числа, строки как строки. Исходный массив после вызова должен остаться в прежнем порядке.',
    specs: [
      'Функция называется sortUsers и принимает массив, название поля и необязательное направление',
      'Исходный массив менять нельзя',
    ],
    starterJs: `// users: массив объектов, field: строка, direction: 'asc' | 'desc'
function sortUsers(users, field, direction = 'asc') {

}`,
    hints: [
      { tier: 1, text: 'Загугли: javascript sort не мутируя исходный массив, sort функция сравнения числа, localeCompare.' },
      { tier: 2, text: `${MDN}/JavaScript/Reference/Global_Objects/Array/sort` },
      { tier: 3, text: 'Идея: сначала сделай копию массива, и только копию сортируй. В функции сравнения для чисел возвращай разность, для строк используй специальный метод сравнения строк. Для «desc» достаточно поменять знак результата.' },
    ],
    tests: [
      { name: 'числа по возрастанию', call: "sortUsers([{ n: 'a', age: 30 }, { n: 'b', age: 7 }, { n: 'c', age: 18 }], 'age').map((u) => u.age)", expected: [7, 18, 30] },
      { name: 'числа по убыванию', call: "sortUsers([{ age: 30 }, { age: 7 }, { age: 18 }], 'age', 'desc').map((u) => u.age)", expected: [30, 18, 7] },
      { name: 'строки по возрастанию', call: "sortUsers([{ name: 'Виктор' }, { name: 'Анна' }, { name: 'Борис' }], 'name').map((u) => u.name)", expected: ['Анна', 'Борис', 'Виктор'] },
      { name: 'строки по убыванию', call: "sortUsers([{ name: 'Анна' }, { name: 'Борис' }], 'name', 'desc').map((u) => u.name)", expected: ['Борис', 'Анна'] },
      { name: 'исходный массив не изменён', call: "(() => { const u = [{ age: 3 }, { age: 1 }, { age: 2 }]; sortUsers(u, 'age'); return u.map((x) => x.age); })()", expected: [3, 1, 2] },
      { name: 'пустой массив', call: "sortUsers([], 'age')", expected: [] },
    ],
    solution: `function sortUsers(users, field, direction = 'asc') {
  const sign = direction === 'desc' ? -1 : 1;
  return [...users].sort((a, b) => {
    const x = a[field];
    const y = b[field];
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * sign;
    return String(x).localeCompare(String(y)) * sign;
  });
}`,
  }),
  logicTask({
    id: 'js-205-normalize-users',
    title: 'Привести ответ API в порядок',
    level: 2,
    topic: 'destructuring-optional-chaining',
    mapTopics: ['JS #24 forEach, map, filter', 'JS #32 Деструктуризация', 'JS #34 Optional chaining и nullish coalescing'],
    learn: 'Чем ?? отличается от ||, и почему возраст 0 не должен превращаться в «неизвестно».',
    prompt:
      'С сервера приходят пользователи в формате { id, first_name, last_name, email, profile? }, где profile может отсутствовать целиком. Напиши функцию normalizeUsers(list): для каждого пользователя верни объект { id, fullName, email, age, city }. fullName это имя и фамилия через пробел, email приводится к нижнему регистру и очищается от пробелов по краям. Если возраста нет, age равен null; если города нет, city равен "не указан". Возраст 0 это настоящее значение, его терять нельзя.',
    specs: [
      'Функция называется normalizeUsers и принимает массив',
      'Поля profile.age и profile.city могут отсутствовать, как и сам profile',
    ],
    starterJs: `// list: [{ id, first_name, last_name, email, profile?: { age?, city? } }]
function normalizeUsers(list) {

}`,
    hints: [
      { tier: 1, text: 'Загугли: javascript optional chaining, nullish coalescing чем отличается от или, деструктуризация объекта в параметрах map.' },
      { tier: 2, text: `${MDN}/JavaScript/Reference/Operators/Optional_chaining` },
      { tier: 3, text: 'Идея: для безопасного чтения вложенного поля есть специальный оператор, а для «значение по умолчанию, только если пусто» есть другой оператор, который, в отличие от обычного «или», не считает нулевое значение пустым.' },
    ],
    tests: [
      { name: 'полный профиль', call: "normalizeUsers([{ id: 1, first_name: 'Анна', last_name: 'Иванова', email: ' Anna@Mail.RU ', profile: { age: 25, city: 'Казань' } }])", expected: [{ id: 1, fullName: 'Анна Иванова', email: 'anna@mail.ru', age: 25, city: 'Казань' }] },
      { name: 'профиля нет совсем', call: "normalizeUsers([{ id: 2, first_name: 'Борис', last_name: 'Петров', email: 'b@x.io' }])", expected: [{ id: 2, fullName: 'Борис Петров', email: 'b@x.io', age: null, city: 'не указан' }] },
      { name: 'возраст 0 сохраняется', call: "normalizeUsers([{ id: 3, first_name: 'Ева', last_name: 'К', email: 'e@x.io', profile: { age: 0 } }])", expected: [{ id: 3, fullName: 'Ева К', email: 'e@x.io', age: 0, city: 'не указан' }] },
      { name: 'пустой список', call: 'normalizeUsers([])', expected: [] },
    ],
    solution: `function normalizeUsers(list) {
  return list.map(({ id, first_name, last_name, email, profile }) => ({
    id,
    fullName: \`\${first_name} \${last_name}\`,
    email: email.trim().toLowerCase(),
    age: profile?.age ?? null,
    city: profile?.city ?? 'не указан',
  }));
}`,
  }),
  logicTask({
    id: 'js-206-boss-top-categories',
    title: 'Босс: топ категорий по выручке',
    level: 2,
    isBoss: true,
    topic: 'data-pipeline-boss',
    mapTopics: ['JS #26 reduce', 'JS #28 flat, flatMap, Array.from', 'JS #31 Object.entries', 'JS #6 Числа: почему 0.1 + 0.2 !== 0.3'],
    learn: 'Как собрать отчёт из вложенных данных и не попасться на ошибки округления.',
    prompt:
      'Есть список заказов, в каждом заказе список позиций { category, price, qty }. Напиши функцию topCategories(orders, n): она возвращает n категорий с самой большой выручкой (цена × количество, по всем заказам) в виде массива { category, total }, по убыванию выручки. При равной выручке категории идут по алфавиту. Выручка округляется до копеек (2 знака). Если категорий меньше n, верни все.',
    specs: [
      'Функция называется topCategories и принимает массив заказов и число n',
      'Каждый заказ выглядит как { id, items: [{ category, price, qty }] }',
      'Округляй итоговую сумму категории, а не каждую позицию отдельно',
    ],
    starterJs: `// orders: [{ id, items: [{ category, price, qty }] }]
function topCategories(orders, n) {

}`,
    hints: [
      { tier: 1, text: 'Загугли: javascript flatMap вложенные массивы, Object.entries сортировка по значению, округление до 2 знаков.' },
      { tier: 2, text: `${MDN}/JavaScript/Reference/Global_Objects/Array/flatMap` },
      { tier: 3, text: 'Идея: сначала разверни заказы в один плоский список позиций, потом накопи выручку по категориям в объекте, потом преврати его в массив пар, отсортируй сначала по сумме, при равенстве по названию, и обрежь до n. Дробные суммы в JS накапливают микро-ошибки, округли в самом конце.' },
    ],
    tests: [
      {
        name: 'обычный отчёт',
        call: "topCategories([{ id: 1, items: [{ category: 'books', price: 10, qty: 2 }, { category: 'toys', price: 5, qty: 1 }] }, { id: 2, items: [{ category: 'books', price: 7.5, qty: 2 }, { category: 'food', price: 3, qty: 10 }] }], 2)",
        expected: [{ category: 'books', total: 35 }, { category: 'food', total: 30 }],
      },
      {
        name: 'равная выручка: по алфавиту',
        call: "topCategories([{ id: 1, items: [{ category: 'b', price: 10, qty: 1 }, { category: 'a', price: 5, qty: 2 }, { category: 'c', price: 5, qty: 1 }] }], 2)",
        expected: [{ category: 'a', total: 10 }, { category: 'b', total: 10 }],
      },
      {
        name: 'ошибки округления',
        call: "topCategories([{ id: 1, items: [{ category: 'tea', price: 0.1, qty: 3 }, { category: 'tea', price: 0.2, qty: 1 }] }], 1)",
        expected: [{ category: 'tea', total: 0.5 }],
      },
      {
        name: 'n больше числа категорий',
        call: "topCategories([{ id: 1, items: [{ category: 'x', price: 1, qty: 1 }] }], 5)",
        expected: [{ category: 'x', total: 1 }],
      },
      { name: 'нет заказов', call: 'topCategories([], 3)', expected: [] },
    ],
    solution: `function topCategories(orders, n) {
  const totals = {};
  for (const item of orders.flatMap((order) => order.items)) {
    totals[item.category] = (totals[item.category] ?? 0) + item.price * item.qty;
  }
  return Object.entries(totals)
    .map(([category, total]) => ({ category, total: Math.round(total * 100) / 100 }))
    .sort((a, b) => b.total - a.total || a.category.localeCompare(b.category))
    .slice(0, n);
}`,
  }),
];

// ============================ ЗАПИСЬ =======================================
const layoutDir = path.resolve('content/layout');
const logicDir = path.resolve('content/logic');
const legacyDir = path.resolve('content-legacy');

fs.mkdirSync(layoutDir, { recursive: true });
fs.mkdirSync(logicDir, { recursive: true });
fs.mkdirSync(legacyDir, { recursive: true });

// Старые задачи уровней 2-7 не удаляем, а переносим в content-legacy:
// те, что про Docker, Nginx, Python и т.д., пригодятся в будущем треке «стек».
// Уровень 1 (layout-1xx, js-01...js-07) этот скрипт не трогает.
function moveLegacy(dir, pattern) {
  for (const file of fs.readdirSync(dir)) {
    if (pattern.test(file)) {
      fs.renameSync(path.join(dir, file), path.join(legacyDir, file));
    }
  }
}
moveLegacy(layoutDir, /^layout-[2-7]\d\d-.*\.json$/);
moveLegacy(logicDir, /^js-[2-7]\d\d-.*\.json$/);

for (const task of [...layoutTasks, ...logicTasks]) {
  const dir = task.track === 'layout' ? layoutDir : logicDir;
  fs.writeFileSync(
    path.join(dir, `${task.id}.json`),
    JSON.stringify(task, null, 2) + '\n',
    'utf8',
  );
}

console.log(
  `Готово: ${layoutTasks.length} задач вёрстки и ${logicTasks.length} задач логики. Старые задачи уровней 2-7 лежат в content-legacy/.`,
);
