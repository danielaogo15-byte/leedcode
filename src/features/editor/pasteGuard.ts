export const MAX_INTERNAL_COPY_CHARS = 120;
export const MAX_UNTRUSTED_INSERT_CHARS = 45;
export const MAX_REALISTIC_CHARS_PER_SEC = 22;

export type PasteGuardState = {
  internalClipboard: string;
  firstInputAt: number | null;
  totalTypedChars: number;
  suspiciousSpeed: boolean;
  blockedAttemptMessage: string | null;
};

export function createPasteGuardState(): PasteGuardState {
  return {
    internalClipboard: '',
    firstInputAt: null,
    totalTypedChars: 0,
    suspiciousSpeed: false,
    blockedAttemptMessage: null,
  };
}

export function canPasteInternal(
  pastedText: string,
  internalClipboard: string,
): boolean {
  if (!pastedText) return true;
  if (pastedText.length > MAX_INTERNAL_COPY_CHARS) return false;
  return pastedText === internalClipboard;
}

export function evaluateCodeChange(
  prevCode: string,
  nextCode: string,
  state: PasteGuardState,
  now = Date.now(),
): {
  allowed: boolean;
  nextState: PasteGuardState;
} {
  const delta = nextCode.length - prevCode.length;

  if (delta <= 0) {
    return {
      allowed: true,
      nextState: { ...state, blockedAttemptMessage: null },
    };
  }

  const matchesInternal =
    state.internalClipboard.length > 0 &&
    delta === state.internalClipboard.length &&
    delta <= MAX_INTERNAL_COPY_CHARS &&
    nextCode.includes(state.internalClipboard);

  if (delta > MAX_UNTRUSTED_INSERT_CHARS && !matchesInternal) {
    return {
      allowed: false,
      nextState: {
        ...state,
        blockedAttemptMessage:
          'Вставка из внешнего буфера или слишком большой кусок текста заблокированы.',
      },
    };
  }

  const firstInputAt = state.firstInputAt ?? now;
  const totalTypedChars = state.totalTypedChars + delta;
  const elapsedSec = Math.max(0.25, (now - firstInputAt) / 1000);
  const charsPerSec = totalTypedChars / elapsedSec;

  const suspiciousSpeed =
    state.suspiciousSpeed ||
    (totalTypedChars >= 35 && charsPerSec > MAX_REALISTIC_CHARS_PER_SEC);

  return {
    allowed: true,
    nextState: {
      ...state,
      firstInputAt,
      totalTypedChars,
      suspiciousSpeed,
      blockedAttemptMessage: null,
    },
  };
}