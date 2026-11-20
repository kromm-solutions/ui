import { notFound } from "next/navigation";

import { patterns } from "@/components/gallery/patterns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatternPage({
  params,
}: {
  params: Promise<{ pattern: string }>;
}) {
  const { pattern: patternId } = params;
  const pattern = patterns.find((p) => p.id === patternId);

  if (!pattern) {
    notFound();
  }

  const PatternComponent = pattern.Component;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <header className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Pattern
        </span>
        <h1 className="text-3xl font-bold">{pattern.title}</h1>
        <p className="text-muted-foreground">{pattern.description}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4">
            <PatternComponent />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Code</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
            {`import { ${pattern.title.replaceAll(/\s+/g, "")}Pattern } from "@/components/gallery/patterns/${pattern.id}-pattern";`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
