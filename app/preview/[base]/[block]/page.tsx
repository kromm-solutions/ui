import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { previewBlocks } from "@/lib/preview/blocks";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ base: string; block: string }>;
}): Promise<Metadata> => {
  const { base, block } = await params;
  return { title: `${block} (${base}) · Preview` };
};

const BlockPreviewPage = async ({
  params,
}: {
  params: Promise<{ base: string; block: string }>;
}) => {
  const { base, block } = await params;
  const Component = previewBlocks[base]?.[block];

  if (!Component) {
    notFound();
  }

  return (
    <div
      className="@container min-h-screen w-full bg-background text-foreground"
      data-slot="block-preview-canvas"
    >
      <Component />
    </div>
  );
};

export default BlockPreviewPage;
