import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ALL_DRILLS,
  DRILL_CATEGORIES,
  evaluateDrillInput,
  type DrillCategory,
} from '@/features/drills/drillsData';
import { cn } from '@/lib/utils';
import { useProgressStore } from '@/stores/useProgressStore';
import {
  CheckCircle2,
  Eye,
  Flame,
  Gauge,
  Keyboard,
  SkipForward,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export function DrillsView() {
  const [category, setCategory] = useState<DrillCategory | 'all'>(
    'css-to-tailwind',
  );
  const [cardIndex, setCardIndex] = useState(0);
  const [input, setInput] = useState('');
  const [ghostMode, setGhostMode] = useState(false);
  const [combo, setCombo] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [cpm, setCpm] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const awardBonusXp = useProgressStore((s) => s.awardBonusXp);

  const cards = useMemo(
    () =>
      category === 'all'
        ? ALL_DRILLS
        : ALL_DRILLS.filter((c) => c.category === category),
    [category],
  );

  const card = cards[cardIndex % cards.length] ?? ALL_DRILLS[0]!;
  const check = useMemo(
    () => evaluateDrillInput(card, input),
    [card, input],
  );

  useEffect(() => {
    setInput('');
    setStartedAt(null);
    inputRef.current?.focus();
  }, [card.id]);

  const handleCompleteCard = async () => {
    if (!check.allMatched) return;

    if (startedAt) {
      const minutes = Math.max(0.05, (Date.now() - startedAt) / 60000);
      setCpm(Math.round(input.length / minutes));
    }

    const nextCombo = ghostMode ? combo : combo + 1;
    setCombo(nextCombo);
    setSolvedCount((c) => c + 1);

    const xp = ghostMode ? 2 : nextCombo >= 5 ? 8 : 5;
    await awardBonusXp(
      xp,
      `⚡ Рефлекс «${card.tech}»: +${xp} XP (Комбо ×${nextCombo})`,
    );

    setCardIndex((idx) => (idx + 1) % cards.length);
  };

  return (
    <div className="col-span-2 overflow-y-auto p-6">
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card p-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                <Zap className="size-3.5" />
                Мышечная память
              </span>
              <span className="text-xs text-muted-foreground">
                Перевод CSS → Tailwind и идиомы 39 технологий на автомате
              </span>
            </div>
            <h2 className="mt-2 text-lg font-bold">
              Скоростные дриллы: пиши код не задумываясь
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-300">
              <Flame className="size-4" />
              <span>Комбо ×{combo}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-300">
              <Gauge className="size-4" />
              <span>{cpm} симв/мин</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="size-4" />
              <span>Сдано: {solvedCount}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {DRILL_CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                type="button"
                size="sm"
                variant={category === cat.id ? 'default' : 'outline'}
                onClick={() => {
                  setCategory(cat.id);
                  setCardIndex(0);
                }}
                className="text-xs"
              >
                {cat.label}
              </Button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setGhostMode((prev) => !prev);
              inputRef.current?.focus();
            }}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition',
              ghostMode
                ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                : 'border-border bg-muted/40 text-muted-foreground hover:text-foreground',
            )}
            title="Горячая клавиша: Tab — показать полупрозрачную тень ответа для запоминания пальцами"
          >
            <Eye className="size-3.5" />
            <span>
              {ghostMode ? 'Тень кода: ВКЛ (Tab)' : 'Тень кода: ВЫКЛ (Tab)'}
            </span>
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-sky-500 font-bold text-slate-950">
                {card.tech}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Карточка {(cardIndex % cards.length) + 1} из {cards.length}
              </span>
              {card.orderIndependent ? (
                <Badge variant="outline" className="text-[10px]">
                  Порядок классов не важен
                </Badge>
              ) : null}
            </div>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setCardIndex((idx) => (idx + 1) % cards.length)}
              className="h-7 gap-1 text-xs text-muted-foreground"
            >
              Пропустить
              <SkipForward className="size-3.5" />
            </Button>
          </div>

          <h3 className="mt-3 text-base font-bold text-foreground">
            {card.title}
          </h3>

          <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-[#161b26] p-4 font-mono text-sm leading-relaxed text-slate-200">
            {card.sourceCode}
          </pre>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                <Keyboard className="size-3.5 text-sky-400" />
                Твой ответ (нажми Enter, когда все блоки станут зелёными):
              </span>
              {check.allMatched ? (
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <Sparkles className="size-3.5" />
                  Идеально! Нажми Enter ↵
                </span>
              ) : null}
            </div>

            <div className="relative">
              {ghostMode ? (
                <div className="pointer-events-none absolute inset-0 flex items-center px-4 font-mono text-sm text-slate-500/45 select-none">
                  {card.targetCode}
                </div>
              ) : null}

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  if (!startedAt && e.target.value.length > 0) {
                    setStartedAt(Date.now());
                  }
                  setInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    setGhostMode((prev) => !prev);
                  } else if (e.key === 'Enter' && check.allMatched) {
                    e.preventDefault();
                    void handleCompleteCard();
                  }
                }}
                placeholder={
                  ghostMode
                    ? ''
                    : card.category === 'css-to-tailwind'
                      ? 'Введи классы Tailwind через пробел...'
                      : 'Введи конструкцию кода (или нажми Tab для подсказки-тени)...'
                }
                spellCheck={false}
                autoComplete="off"
                className={cn(
                  'w-full rounded-xl border bg-background/90 px-4 py-3 font-mono text-sm text-foreground transition outline-none',
                  check.allMatched
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-border focus:border-sky-500',
                )}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs text-muted-foreground">
              Чек-лист токенов:
            </span>
            {card.tokens.map((tok, idx) => {
              const matched = check.matchedTokens[idx];
              return (
                <span
                  key={`${tok}-${idx}`}
                  className={cn(
                    'rounded-md border px-2 py-0.5 font-mono text-xs font-semibold transition',
                    matched
                      ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                      : 'border-border bg-muted/40 text-muted-foreground',
                  )}
                >
                  {matched ? tok : ghostMode ? tok : `${tok.slice(0, 2)}•••`}
                </span>
              );
            })}

            {check.extraTokens.map((extra) => (
              <span
                key={extra}
                className="rounded-md border border-destructive/50 bg-destructive/15 px-2 py-0.5 font-mono text-xs text-destructive"
              >
                лишний: {extra}
              </span>
            ))}
          </div>

          <p className="mt-4 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            💡 <strong>Запомни правило:</strong> {card.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}