import Link from "next/link";

import { patterns } from "@/components/gallery/patterns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PatternsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <header className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Patterns
        </span>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Custom Patterns</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Patrones personalizados listos para usar. Cada patrón es una
          composición de componentes primarios.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {patterns.map((pattern) => {
          const PatternComponent = pattern.Component;
          return (
            <Card key={pattern.id} className="h-full overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">{pattern.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="aspect-video bg-muted rounded flex items-center justify-center">
                  <PatternComponent />
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 pt-0">
                <span className="text-sm text-muted-foreground truncate">
                  {pattern.description}
                </span>
                <Link
                  href={`/components/patterns/${pattern.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  View
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
