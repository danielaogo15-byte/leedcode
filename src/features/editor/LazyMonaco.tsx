import {
	canPasteInternal,
	evaluateCodeChange,
	type PasteGuardState,
 } from '@/features/editor/pasteGuard';
 import type { Monaco } from '@monaco-editor/react';
 import { lazy, Suspense, useEffect, useRef, useState } from 'react';
 
 const MonacoEditor = lazy(() => import('@monaco-editor/react'));
 
 const HTML_TAGS = [
	'h1',
	'h2',
	'h3',
	'p',
	'div',
	'span',
	'button',
	'a',
	'nav',
	'header',
	'section',
	'article',
	'ul',
	'li',
 ];
 
 let emmetRegistered = false;
 
 type Props = {
	language:
	  | 'html'
	  | 'css'
	  | 'javascript'
	  | 'typescript'
	  | 'python'
	  | 'sql'
	  | 'dockerfile'
	  | 'yaml'
	  | 'graphql'
	  | 'ini';
	value: string;
	hardcore: boolean;
	guardState: PasteGuardState;
	onGuardStateChange: (next: PasteGuardState) => void;
	onChange: (next: string) => void;
 };
 
 export function LazyMonaco({
	language,
	value,
	hardcore,
	guardState,
	onGuardStateChange,
	onChange,
 }: Props) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const hardcoreRef = useRef(hardcore);
	const [isDark, setIsDark] = useState(() =>
	  document.documentElement.classList.contains('dark'),
	);
 
	useEffect(() => {
	  hardcoreRef.current = hardcore;
	}, [hardcore]);
 
	useEffect(() => {
	  const observer = new MutationObserver(() => {
		 setIsDark(document.documentElement.classList.contains('dark'));
	  });
	  observer.observe(document.documentElement, {
		 attributes: true,
		 attributeFilter: ['class'],
	  });
	  return () => observer.disconnect();
	}, []);
 
	const handleBeforeMount = (monaco: Monaco) => {
	  monaco.editor.defineTheme('dojo-slate', {
		 base: 'vs-dark',
		 inherit: true,
		 rules: [],
		 colors: {
			'editor.background': '#222734',
			'editor.lineHighlightBackground': '#2c3344',
			'editorLineNumber.foreground': '#64748b',
			'editorGutter.background': '#222734',
		 },
	  });
 
	  if (emmetRegistered) return;
	  emmetRegistered = true;
 
	  monaco.languages.registerCompletionItemProvider('html', {
		 triggerCharacters: ['.', '#', ...'abcdefghijklmnopqrstuvwxyz'.split('')],
		 provideCompletionItems(model, position) {
			if (hardcoreRef.current) {
			  return { suggestions: [] };
			}
 
			const linePrefix = model
			  .getValueInRange({
				 startLineNumber: position.lineNumber,
				 startColumn: 1,
				 endLineNumber: position.lineNumber,
				 endColumn: position.column,
			  })
			  .trimStart();
 
			if (linePrefix.startsWith('<')) {
			  return { suggestions: [] };
			}
 
			const match = linePrefix.match(
			  /([a-zA-Z][a-zA-Z0-9]*)?([.#][a-zA-Z0-9_-]+)?$/,
			);
			if (!match || !match[0]) {
			  return { suggestions: [] };
			}
 
			const fullToken = match[0];
			const startColumn = position.column - fullToken.length;
			const range = {
			  startLineNumber: position.lineNumber,
			  endLineNumber: position.lineNumber,
			  startColumn,
			  endColumn: position.column,
			};
 
			const suggestions = [];
 
			const emmetMatch = fullToken.match(
			  /^([a-zA-Z][a-zA-Z0-9]*)?([.#])([a-zA-Z0-9_-]+)$/,
			);
			if (emmetMatch) {
			  const tag = emmetMatch[1] || 'div';
			  const attr = emmetMatch[2] === '.' ? 'class' : 'id';
			  const attrVal = emmetMatch[3];
			  suggestions.push({
				 label: `${fullToken} → <${tag} ${attr}="${attrVal}">`,
				 kind: monaco.languages.CompletionItemKind.Snippet,
				 documentation: `Emmet: развернуть в <${tag} ${attr}="${attrVal}">`,
				 insertText: `<${tag} ${attr}="${attrVal}">$0</${tag}>`,
				 insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				 range,
				 sortText: '0_' + fullToken,
			  });
			}
 
			for (const tag of HTML_TAGS) {
			  if (tag.startsWith(fullToken.toLowerCase())) {
				 const snippet =
					tag === 'a'
					  ? `<a href="$1">$0</a>`
					  : tag === 'button'
						 ? `<button type="button">$0</button>`
						 : `<${tag}>$0</${tag}>`;
 
				 suggestions.push({
					label: tag,
					kind: monaco.languages.CompletionItemKind.Snippet,
					detail: `<${tag}>...</${tag}>`,
					insertText: snippet,
					insertTextRules:
					  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					range,
					sortText: '1_' + tag,
				 });
			  }
			}
 
			return { suggestions };
		 },
	  });
	};
 
	return (
	  <div
		 ref={containerRef}
		 className="relative min-h-[16rem] flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
		 onCopyCapture={() => {
			const selected = window.getSelection()?.toString() ?? '';
			if (selected) {
			  onGuardStateChange({
				 ...guardState,
				 internalClipboard: selected,
			  });
			}
		 }}
		 onCutCapture={() => {
			const selected = window.getSelection()?.toString() ?? '';
			if (selected) {
			  onGuardStateChange({
				 ...guardState,
				 internalClipboard: selected,
			  });
			}
		 }}
		 onPasteCapture={(event) => {
			const pasted = event.clipboardData?.getData('text/plain') ?? '';
			if (!canPasteInternal(pasted, guardState.internalClipboard)) {
			  event.preventDefault();
			  event.stopPropagation();
			  onGuardStateChange({
				 ...guardState,
				 blockedAttemptMessage:
					'Внешняя вставка запрещена — пиши код руками для тренировки мышечной памяти.',
			  });
			}
		 }}
		 onDropCapture={(event) => {
			event.preventDefault();
			event.stopPropagation();
			onGuardStateChange({
			  ...guardState,
			  blockedAttemptMessage: 'Перетаскивание текста (Drop) запрещено.',
			});
		 }}
	  >
		 <Suspense
			fallback={
			  <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
				 Загрузка редактора Monaco…
			  </div>
			}
		 >
			<MonacoEditor
			  height="100%"
			  theme={isDark ? 'dojo-slate' : 'light'}
			  language={language}
			  value={value}
			  beforeMount={handleBeforeMount}
			  onChange={(nextValue) => {
				 const next = nextValue ?? '';
				 const check = evaluateCodeChange(value, next, guardState);
				 onGuardStateChange(check.nextState);
				 if (check.allowed) {
					onChange(next);
				 }
			  }}
			  options={{
				 minimap: { enabled: false },
				 fontSize: 14,
				 lineHeight: 22,
				 padding: { top: 16, bottom: 16 },
				 tabSize: 2,
				 scrollBeyondLastLine: false,
				 contextmenu: false,
				 quickSuggestions: hardcore
					? false
					: { other: true, comments: false, strings: true },
				 snippetSuggestions: hardcore ? 'none' : 'top',
				 suggestOnTriggerCharacters: !hardcore,
				 acceptSuggestionOnEnter: hardcore ? 'off' : 'on',
				 tabCompletion: hardcore ? 'off' : 'on',
				 parameterHints: { enabled: !hardcore },
				 wordBasedSuggestions: hardcore ? 'off' : 'currentDocument',
				 hover: { enabled: !hardcore },
			  }}
			/>
		 </Suspense>
	  </div>
	);
 }