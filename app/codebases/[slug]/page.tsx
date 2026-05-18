import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BrowseShell } from "@/components/browse-shell";
import { codebases, getCodebase } from "@/lib/data";

export function generateStaticParams() {
  return codebases.map((c) => ({ slug: c.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CodebasePage({ params }: PageProps) {
  const { slug } = await params;
  const codebase = getCodebase(slug);
  if (!codebase) notFound();

  return (
    <Suspense fallback={null}>
      <BrowseShell viewMode="codebase" scopeSlug={slug} />
    </Suspense>
  );
}
