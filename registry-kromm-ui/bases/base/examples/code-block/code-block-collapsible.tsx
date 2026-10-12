import { CodeBlock } from "@/registry-kromm-ui/bases/base/kromm-ui/code-block";

const snippet = `# Install the primitive
pnpm add shiki lucide-react

# Rebuild the registry items
pnpm registry:metadata
pnpm registry:build

# Check the published shape of one item
pnpm registry:verify

# Every item lists its own files, so an install never
# leaves a relative import pointing at a file that
# was not written to disk.
echo "done"`;

export function CodeBlockCollapsible() {
  return (
    <CodeBlock
      className="w-full max-w-xl"
      code={snippet}
      collapsible
      language="bash"
      lineNumbers
    />
  );
}
