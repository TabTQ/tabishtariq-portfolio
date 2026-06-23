import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <span className="font-serif text-6xl text-accent">404</span>
      <h1 className="font-serif text-2xl text-text">Node not found</h1>
      <p className="max-w-sm text-sm text-text-muted">
        That route isn&rsquo;t on the map. Head back to the dashboard and pick a
        node.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text transition-colors hover:border-accent/50"
      >
        <ArrowLeft size={15} /> Back to dashboard
      </Link>
    </div>
  );
}
