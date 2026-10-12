import * as React from "react";

import { signatureToDataURL } from "../core/serialization";
import type { SignatureData } from "../core/types";

interface UseSignatureHistoryOptions {
  value?: SignatureData | null;
  defaultValue?: SignatureData | null;
  onValueChange?: (value: SignatureData | null) => void;
  onValueChangeLegacy?: (dataUrl: string | null) => void;
  penColor?: string;
  penWidth?: number;
}

interface UseSignatureHistoryReturn {
  value: SignatureData | null;
  setValue: (
    value:
      | SignatureData
      | null
      | ((previous: SignatureData | null) => SignatureData | null)
  ) => void;
  clear: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useSignatureHistory({
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  onValueChangeLegacy,
  penColor = "currentColor",
  penWidth = 2,
}: UseSignatureHistoryOptions): UseSignatureHistoryReturn {
  const isControlled = controlledValue !== undefined;

  const [internalValue, setInternalValue] =
    React.useState<SignatureData | null>(defaultValue);

  const [past, setPast] = React.useState<SignatureData[]>([]);
  const [future, setFuture] = React.useState<SignatureData[]>([]);

  const value = isControlled ? (controlledValue ?? null) : internalValue;

  const callLegacy = React.useCallback(
    (val: SignatureData | null) => {
      if (!val || val.strokes.length === 0) {
        onValueChangeLegacy?.(null);
        return;
      }
      const dataUrl = signatureToDataURL(val, penColor, penWidth);
      onValueChangeLegacy?.(dataUrl);
    },
    [onValueChangeLegacy, penColor, penWidth]
  );

  const commit = React.useCallback(
    (nextValue: SignatureData | null) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
      callLegacy(nextValue);
    },
    [isControlled, onValueChange, callLegacy]
  );

  const setValue = React.useCallback(
    (
      next:
        | SignatureData
        | null
        | ((previous: SignatureData | null) => SignatureData | null)
    ) => {
      const nextValue = typeof next === "function" ? next(value) : next;

      if (nextValue === value) {
        return;
      }

      if (value) {
        setPast((previous) => [...previous, value]);
      }

      setFuture([]);
      commit(nextValue);
    },
    [commit, value]
  );

  const clear = React.useCallback(() => {
    if (!value) {
      return;
    }

    setPast((previous) => [...previous, value]);
    setFuture([]);
    commit(null);
  }, [commit, value]);

  const undo = React.useCallback(() => {
    if (past.length === 0) {
      return;
    }

    const previous = past.at(-1);

    setPast((items) => items.slice(0, -1));

    setFuture((items) => [...(value ? [value] : []), ...items]);

    commit(previous ?? null);
  }, [commit, past, value]);

  const redo = React.useCallback(() => {
    if (future.length === 0) {
      return;
    }

    const next = future[0];

    setFuture((items) => items.slice(1));

    setPast((items) => [...items, ...(value ? [value] : [])]);

    commit(next);
  }, [commit, future, value]);

  return {
    canRedo: future.length > 0,
    canUndo: past.length > 0,
    clear,
    redo,
    setValue,
    undo,
    value,
  };
}
