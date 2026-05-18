import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="text-sm uppercase tracking-[0.12em] text-muted">404</p>
        <h1 className="font-sans text-2xl font-semibold mt-2">Page not found</h1>
        <p className="text-sm text-muted mt-2">
          That topic, codebase, or lesson doesn&apos;t exist yet.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 text-sm text-accent hover:underline"
        >
          Back to the notebook
        </Link>
      </div>
    </main>
  );
}
