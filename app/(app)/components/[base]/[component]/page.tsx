import { notFound } from 'next/navigation';
import { getComponent, getCatalog } from '@/lib/catalog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as React from 'react';

function PatternPreview({ base, patternName }: { base: string; patternName: string }) {
  const importMap: Record<string, Record<string, () => Promise<{ default: React.ComponentType }>>> = {
    base: {
      'signature-pad-default': () => import('@/registry-kromm-ui/bases/base/examples/signature-pad/signature-pad-default').then(m => ({ default: m.SignaturePadDefault })),
      'signature-pad-field': () => import('@/registry-kromm-ui/bases/base/examples/signature-pad/signature-pad-field').then(m => ({ default: m.SignaturePadField })),
      'code-block-default': () => import('@/registry-kromm-ui/bases/base/examples/code-block/code-block-default').then(m => ({ default: m.CodeBlockDefault })),
      'code-block-collapsible': () => import('@/registry-kromm-ui/bases/base/examples/code-block/code-block-collapsible').then(m => ({ default: m.CodeBlockCollapsible })),
    },
    aria: {
      'signature-pad-default': () => import('@/registry-kromm-ui/bases/aria/examples/signature-pad/signature-pad-default').then(m => ({ default: m.SignaturePadDefault })),
      'signature-pad-field': () => import('@/registry-kromm-ui/bases/aria/examples/signature-pad/signature-pad-field').then(m => ({ default: m.SignaturePadField })),
    },
    radix: {
      'signature-pad-default': () => import('@/registry-kromm-ui/bases/radix/examples/signature-pad/signature-pad-default').then(m => ({ default: m.SignaturePadDefault })),
      'signature-pad-field': () => import('@/registry-kromm-ui/bases/radix/examples/signature-pad/signature-pad-field').then(m => ({ default: m.SignaturePadField })),
    },
  };

  const loader = importMap[base]?.[patternName];
  if (!loader) return <div className="bg-muted p-4 rounded text-center text-sm">Preview not available for {base}/{patternName}</div>;

  return <PatternLoader loader={loader} />;
}

function PatternLoader({ loader }: { loader: () => Promise<{ default: React.ComponentType }> }) {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
  React.useEffect(() => { loader().then(m => setComponent(m.default)); }, [loader]);
  if (!Component) return <div className="bg-muted p-4 rounded text-center text-sm">Loading...</div>;
  return <Component />;
}

export async function generateStaticParams() {
  const catalog = getCatalog();
  return catalog.map(c => ({ base: c.base, component: c.title }));
}

export default async function ComponentPage({ params }: { params: Promise<{ base: string; component: string }> }) {
  const { base, component } = await params;
  const comp = getComponent(base, component);
  if (!comp) return notFound();

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <header className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">{comp.name}</h1>
        <Badge variant="outline">{comp.base}</Badge>
      </header>
      <p className="text-sm text-muted-foreground">{comp.description}</p>

      {comp.patterns.length > 1 && (
        <Tabs defaultValue={comp.patterns[0].name}>
          <TabsList className="w-full">
            {comp.patterns.map(p => (
              <TabsTrigger key={p.name} value={p.name}>{p.title}</TabsTrigger>
            ))}
          </TabsList>
          {comp.patterns.map(p => (
            <TabsContent key={p.name} value={p.name} className="mt-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <div className="border rounded-lg overflow-hidden">
                  <PatternPreview base={base} patternName={p.name} />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {comp.patterns.length === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{comp.patterns[0].description}</p>
          <div className="border rounded-lg overflow-hidden">
            <PatternPreview base={base} patternName={comp.patterns[0].name} />
          </div>
        </div>
      )}
    </div>
  );
}