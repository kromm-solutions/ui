import type { SignatureData } from "./types";

export interface SignatureHistory {
  items: (SignatureData | null)[];
  index: number;
}

export function createHistory(initial: SignatureData | null): SignatureHistory {
  return {
    index: 0,
    items: [initial],
  };
}

export function pushHistory(
  history: SignatureHistory,
  item: SignatureData | null
): SignatureHistory {
  const items = history.items.slice(0, history.index + 1);

  items.push(item);

  return {
    index: history.index + 1,
    items,
  };
}

export function undoHistory(history: SignatureHistory): SignatureHistory {
  if (history.index === 0) {
    return history;
  }

  return {
    ...history,
    index: history.index - 1,
  };
}

export function redoHistory(history: SignatureHistory): SignatureHistory {
  if (history.index === history.items.length - 1) {
    return history;
  }

  return {
    ...history,
    index: history.index + 1,
  };
}

export function canUndo(history: SignatureHistory) {
  return history.index > 0;
}

export function canRedo(history: SignatureHistory) {
  return history.index < history.items.length - 1;
}

export function currentHistoryValue(history: SignatureHistory) {
  return history.items[history.index] ?? null;
}
