"use client";

import * as React from "react";

import type {
  RichTextEditorContextValue,
  RichTextEditorFeatures,
} from "./core/types";

const RichTextEditorContext =
  React.createContext<RichTextEditorContextValue | null>(null);

export function useRichTextEditor(): RichTextEditorContextValue {
  const context = React.useContext(RichTextEditorContext);

  if (!context) {
    throw new Error(
      "RichTextEditor components must be used inside <RichTextEditor>."
    );
  }

  return context;
}

interface RichTextEditorProviderProps {
  children: React.ReactNode;
  editor: RichTextEditorContextValue["editor"];
  disabled: boolean;
  readOnly: boolean;
  features: Required<RichTextEditorFeatures>;
}

export function RichTextEditorProvider({
  children,
  disabled,
  editor,
  features,
  readOnly,
}: RichTextEditorProviderProps) {
  const contextValue = React.useMemo<RichTextEditorContextValue>(
    () => ({ disabled, editor, features, readOnly }),
    [disabled, editor, features, readOnly]
  );

  return (
    <RichTextEditorContext.Provider value={contextValue}>
      {children}
    </RichTextEditorContext.Provider>
  );
}
