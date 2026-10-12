import { getCatalog } from '@/lib/catalog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ComponentsPage() {
  const components = getCatalog();
  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <header className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">Components</span>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Free Shadcn UI Components</h1>
          <Badge variant="outline">{components.length}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Composiciones listas para instalar sobre las primitives de shadcn.
          Cada patrón se previsualiza en vivo, es código de tu app y se instala con un comando.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {components.map((c) => (
          <Card key={`${c.base}/${c.title}`} className="h-full overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">{c.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="aspect-video bg-muted rounded flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Preview: {c.patterns[0]?.title}</span>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
              <Badge variant="secondary">{c.base}</Badge>
              <Link href={`/components/${c.base}/${c.title}`} className="text-sm font-medium hover:underline">
                {c.patterns.length} pattern{c.patterns.length !== 1 ? 's' : ''}
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}