import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BrowseShell } from "@/components/browse-shell";
import { getTopic, topics } from "@/lib/data";

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  return (
    <Suspense fallback={null}>
      <BrowseShell viewMode="topic" scopeSlug={slug} />
    </Suspense>
  );
}
