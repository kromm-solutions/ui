import Paper from "@/registry-kromm-ui/bases/base/kromm-ui/paper";
export default function PaperPreviewPage() {
  return <main className="min-h-screen bg-neutral-100 p-8 text-neutral-900">
    <h1 className="mb-2 text-2xl font-semibold">Paper</h1>
    <p className="mb-8 text-sm text-neutral-600">Vista previa del componente Paper · 220 × 280</p>
    <div className="flex justify-center"><Paper><h2 className="text-lg font-semibold">Documento</h2><p className="mt-3 text-sm text-neutral-500">Contenido de ejemplo</p></Paper></div>
  </main>;
}
