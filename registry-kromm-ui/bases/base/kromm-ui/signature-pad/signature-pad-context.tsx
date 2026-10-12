import * as React from "react";

import { signatureToDataURL, signatureToSVG } from "./core/serialization";
import type {
  SignatureData,
  SignatureDataUrlOptions,
  SignaturePen,
  SignatureSvgOptions,
} from "./core/types";
import { useSignatureHistory } from "./hooks/use-signature-history";

export interface SignaturePadRef {
  clear: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  isEmpty: () => boolean;
  getValue: () => SignatureData | null;
  toDataURL: (options?: SignatureDataUrlOptions) => string | null;
  toSVG: (options?: SignatureSvgOptions) => string | null;
}

interface SignaturePadContextValue {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;

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

  disabled: boolean;
  readOnly: boolean;

  pen: Required<SignaturePen>;

  redraw: () => void;

  toDataURL: (options?: SignatureDataUrlOptions) => string | null;

  toSVG: (options?: SignatureSvgOptions) => string | null;

  save: () => void;
}

const SignaturePadContext =
  React.createContext<SignaturePadContextValue | null>(null);

export function useSignaturePad() {
  const context = React.useContext(SignaturePadContext);

  if (!context) {
    throw new Error(
      "SignaturePad components must be used inside SignaturePadProvider."
    );
  }

  return context;
}

interface SignaturePadProviderProps {
  children: React.ReactNode;

  value?: SignatureData | null;
  defaultValue?: SignatureData | null;

  onValueChange?: (value: SignatureData | null) => void;

  /** @deprecated Use onValueChange with SignatureData instead. This callback receives a data URL string. */
  onValueChangeLegacy?: (dataUrl: string | null) => void;

  onSave?: (dataUrl: string | null) => void;

  disabled?: boolean;
  readOnly?: boolean;

  pen?: SignaturePen;
}

export function SignaturePadProvider({
  children,
  value,
  defaultValue,
  onValueChange,
  onValueChangeLegacy,
  onSave,
  disabled = false,
  readOnly = false,
  pen,
}: SignaturePadProviderProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const penConfig = React.useMemo(
    () => ({
      color: pen?.color ?? "currentColor",
      width: pen?.width ?? 2,
    }),
    [pen?.color, pen?.width]
  );

  const history = useSignatureHistory({
    defaultValue,
    onValueChange,
    onValueChangeLegacy,
    penColor: penConfig.color,
    penWidth: penConfig.width,
    value,
  });

  const redraw = React.useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    context.clearRect(0, 0, rect.width, rect.height);

    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = penConfig.color;
    context.lineWidth = penConfig.width;

    if (!history.value) {
      return;
    }

    for (const stroke of history.value.strokes) {
      if (stroke.points.length === 0) {
        continue;
      }

      context.beginPath();

      stroke.points.forEach((point, index) => {
        const x = point.x * rect.width;
        const y = point.y * rect.height;

        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });

      context.stroke();
    }
  }, [history.value, penConfig]);

  const toDataURL = React.useCallback(
    (options?: SignatureDataUrlOptions) => {
      if (!history.value) {
        return null;
      }

      return signatureToDataURL(
        history.value,
        penConfig.color,
        penConfig.width,
        options
      );
    },
    [history.value, penConfig]
  );

  const toSVG = React.useCallback(
    (options?: SignatureSvgOptions) => {
      if (!history.value) {
        return null;
      }

      return signatureToSVG(history.value, options);
    },
    [history.value]
  );

  const save = React.useCallback(() => {
    const dataUrl = toDataURL();
    onSave?.(dataUrl);
  }, [toDataURL, onSave]);

  const contextValue = React.useMemo<SignaturePadContextValue>(
    () => ({
      canRedo: history.canRedo,

      canUndo: history.canUndo,
      canvasRef,

      clear: history.clear,
      disabled,
      pen: penConfig,

      readOnly,
      redo: history.redo,

      redraw,
      save,

      setValue: history.setValue,

      toDataURL,

      toSVG,
      undo: history.undo,

      value: history.value,
    }),
    [
      history.value,
      history.setValue,
      history.clear,
      history.undo,
      history.redo,
      history.canUndo,
      history.canRedo,
      disabled,
      readOnly,
      penConfig,
      redraw,
      toDataURL,
      toSVG,
      save,
    ]
  );

  return (
    <SignaturePadContext.Provider value={contextValue}>
      {children}
    </SignaturePadContext.Provider>
  );
}
