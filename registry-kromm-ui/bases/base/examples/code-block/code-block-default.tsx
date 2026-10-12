import { CodeBlock } from "@/registry-kromm-ui/bases/base/kromm-ui/code-block";

const snippet = `import { Button } from "@/components/ui/button";

export function SubmitButton() {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? "Saving..." : "Save changes"}
    </Button>
  );
}`;

export function CodeBlockDefault() {
  return (
    <CodeBlock
      className="w-full max-w-xl"
      code={snippet}
      filename="submit-button.tsx"
      language="tsx"
    />
  );
}
