const SPACING_PX: Record<string, string> = {
	'0': '0px',
	'0.5': '2px',
	'1': '4px',
	'1.5': '6px',
	'2': '8px',
	'2.5': '10px',
	'3': '12px',
	'3.5': '14px',
	'4': '16px',
	'5': '20px',
	'6': '24px',
	'7': '28px',
	'8': '32px',
	'10': '40px',
	'11': '44px',
	'12': '48px',
	'14': '56px',
	'16': '64px',
	'20': '80px',
	'24': '96px',
	'32': '128px',
	'36': '144px',
	'40': '160px',
	'48': '192px',
	'52': '208px',
	full: '100%',
 };
 
 const RADIUS_PX: Record<string, string> = {
	none: '0px',
	sm: '4px',
	DEFAULT: '6px',
	md: '6px',
	lg: '8px',
	xl: '12px',
	'2xl': '16px',
	full: '999px',
 };
 
 const COLOR_MAP: Record<string, string> = {
	white: '#ffffff',
	transparent: 'transparent',
	'slate-950': '#020617',
	'slate-900': '#0f172a',
	'slate-800': '#1e293b',
	'slate-700': '#334155',
	'slate-600': '#475569',
	'slate-400': '#94a3b8',
	'slate-300': '#cbd5e1',
	'slate-200': '#e2e8f0',
	'slate-100': '#f1f5f9',
	'slate-50': '#f8fafc',
	'sky-500': '#0ea5e9',
	'sky-400': '#38bdf8',
	'sky-300': '#7dd3fc',
	'indigo-500': '#6366f1',
	'indigo-950': '#1e1b4b',
	'emerald-950': '#052e16',
	'emerald-900': '#064e3b',
	'emerald-500': '#10b981',
	'emerald-400': '#34d399',
	'emerald-300': '#6ee7b7',
	'amber-500': '#f59e0b',
	'amber-400': '#fbbf24',
	'red-900': '#7f1d1d',
	'red-500': '#ef4444',
	'red-300': '#fca5a5',
 };
 
 function escapeClassSelector(cls: string): string {
	return '.' + cls.replace(/([^a-zA-Z0-9_-])/g, '\\$1');
 }
 
 function resolveSize(token: string): string | null {
	if (token.startsWith('[') && token.endsWith(']')) {
	  return token.slice(1, -1).replace(/_/g, ' ');
	}
	return SPACING_PX[token] ?? null;
 }
 
 function ruleForToken(cls: string): string | null {
	const sel = escapeClassSelector(cls);
 
	const staticRules: Record<string, string> = {
	  block: 'display: block;',
	  'inline-block': 'display: inline-block;',
	  flex: 'display: flex;',
	  'inline-flex': 'display: inline-flex;',
	  grid: 'display: grid;',
	  hidden: 'display: none;',
	  'flex-row': 'flex-direction: row;',
	  'flex-col': 'flex-direction: column;',
	  'flex-1': 'flex: 1 1 0%;',
	  'items-center': 'align-items: center;',
	  'items-start': 'align-items: flex-start;',
	  'items-end': 'align-items: flex-end;',
	  'justify-center': 'justify-content: center;',
	  'justify-between': 'justify-content: space-between;',
	  'justify-end': 'justify-content: flex-end;',
	  'justify-start': 'justify-content: flex-start;',
	  'text-center': 'text-align: center;',
	  'text-left': 'text-align: left;',
	  'text-right': 'text-align: right;',
	  'font-medium': 'font-weight: 500;',
	  'font-semibold': 'font-weight: 600;',
	  'font-bold': 'font-weight: 700;',
	  'font-mono': 'font-family: monospace;',
	  'list-none': 'list-style-type: none;',
	  'no-underline': 'text-decoration: none;',
	  'box-border': 'box-sizing: border-box;',
	  'overflow-hidden': 'overflow: hidden;',
	  border: 'border-width: 1px; border-style: solid;',
	  'border-0': 'border-width: 0px;',
	  'border-none': 'border: none;',
	  'border-b': 'border-bottom-width: 1px; border-bottom-style: solid;',
	  'border-l-4': 'border-left-width: 4px; border-left-style: solid;',
	  'text-xs': 'font-size: 12px;',
	  'text-sm': 'font-size: 14px;',
	  'text-base': 'font-size: 16px;',
	  'text-lg': 'font-size: 18px;',
	  'text-xl': 'font-size: 20px;',
	};
 
	if (staticRules[cls]) {
	  return `${sel} { ${staticRules[cls]} }`;
	}
 
	// grid-cols-*
	if (cls.startsWith('grid-cols-')) {
	  const rest = cls.slice('grid-cols-'.length);
	  if (rest.startsWith('[') && rest.endsWith(']')) {
		 const cols = rest.slice(1, -1).replace(/_/g, ' ');
		 return `${sel} { grid-template-columns: ${cols}; }`;
	  }
	  const count = Number(rest);
	  if (Number.isInteger(count) && count > 0) {
		 return `${sel} { grid-template-columns: ${Array(count).fill('1fr').join(' ')}; }`;
	  }
	}
 
	// gap-*, gap-x-*, gap-y-*
	if (cls.startsWith('gap-')) {
	  const rest = cls.slice(4);
	  if (rest.startsWith('x-')) {
		 const v = resolveSize(rest.slice(2));
		 return v ? `${sel} { column-gap: ${v}; }` : null;
	  }
	  if (rest.startsWith('y-')) {
		 const v = resolveSize(rest.slice(2));
		 return v ? `${sel} { row-gap: ${v}; }` : null;
	  }
	  const v = resolveSize(rest);
	  return v ? `${sel} { gap: ${v}; }` : null;
	}
 
	// padding: p-*, px-*, py-*
	if (cls.startsWith('p-')) {
	  const v = resolveSize(cls.slice(2));
	  return v ? `${sel} { padding: ${v}; }` : null;
	}
	if (cls.startsWith('px-')) {
	  const v = resolveSize(cls.slice(3));
	  return v ? `${sel} { padding-left: ${v}; padding-right: ${v}; }` : null;
	}
	if (cls.startsWith('py-')) {
	  const v = resolveSize(cls.slice(3));
	  return v ? `${sel} { padding-top: ${v}; padding-bottom: ${v}; }` : null;
	}
 
	// margin: m-*, mb-*, mt-*
	if (cls.startsWith('m-')) {
	  const v = resolveSize(cls.slice(2));
	  return v ? `${sel} { margin: ${v}; }` : null;
	}
	if (cls.startsWith('mb-')) {
	  const v = resolveSize(cls.slice(3));
	  return v ? `${sel} { margin-bottom: ${v}; }` : null;
	}
	if (cls.startsWith('mt-')) {
	  const v = resolveSize(cls.slice(3));
	  return v ? `${sel} { margin-top: ${v}; }` : null;
	}
 
	// width & height: w-*, h-*
	if (cls.startsWith('w-')) {
	  const v = resolveSize(cls.slice(2));
	  return v ? `${sel} { width: ${v}; }` : null;
	}
	if (cls.startsWith('h-')) {
	  const v = resolveSize(cls.slice(2));
	  return v ? `${sel} { height: ${v}; }` : null;
	}
 
	// rounded & rounded-*
	if (cls === 'rounded') {
	  return `${sel} { border-radius: ${RADIUS_PX.DEFAULT}; }`;
	}
	if (cls.startsWith('rounded-')) {
	  const rest = cls.slice('rounded-'.length);
	  const v = RADIUS_PX[rest] ?? resolveSize(rest);
	  return v ? `${sel} { border-radius: ${v}; }` : null;
	}
 
	// bg-*, text-*, border-*
	if (cls.startsWith('bg-')) {
	  const c = COLOR_MAP[cls.slice(3)];
	  return c ? `${sel} { background-color: ${c}; }` : null;
	}
	if (cls.startsWith('text-')) {
	  const c = COLOR_MAP[cls.slice(5)];
	  return c ? `${sel} { color: ${c}; }` : null;
	}
	if (cls.startsWith('border-')) {
	  const c = COLOR_MAP[cls.slice(7)];
	  return c ? `${sel} { border-color: ${c}; }` : null;
	}
 
	return null;
 }
 
 export function compileTailwindFromHtml(html: string): string {
	const classTokens = new Set<string>();
	const classRegex = /class\s*=\s*["']([^"']+)["']/g;
	let match: RegExpExecArray | null;
 
	while ((match = classRegex.exec(html)) !== null) {
	  const raw = match[1] ?? '';
	  for (const token of raw.split(/\s+/)) {
		 if (token) classTokens.add(token);
	  }
	}
 
	const rules: string[] = [];
	for (const token of classTokens) {
	  const cssRule = ruleForToken(token);
	  if (cssRule) rules.push(cssRule);
	}
 
	return rules.join('\n');
 }