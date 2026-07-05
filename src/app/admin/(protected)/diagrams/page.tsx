import Link from "next/link";
import { adminFetch } from "@/lib/admin";
import { Card } from "@/components/ui/Card";

interface DiagramRow {
  id: number;
  diagramKey: string;
  direction: string;
  nodes: unknown[];
  edges: unknown[];
}

export default async function AdminDiagramsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const res = await adminFetch("/api/admin/diagrams");
  if (!res.ok) throw new Error(`Failed to load diagrams: ${res.status}`);
  const diagrams = (await res.json()) as DiagramRow[];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-xl text-text">Diagrams</h1>
        <p className="text-sm text-text-muted">
          System-map specs stored as JSON. The proxmox diagram automatically
          appends one node per LXC container at request time — only its static
          nodes live here.
        </p>
      </div>
      {error ? <Card className="border-danger/50 text-sm text-danger">{error}</Card> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {diagrams.map((d) => (
          <Link key={d.diagramKey} href={`/admin/diagrams/${d.diagramKey}`} className="block">
            <Card className="transition-colors hover:border-accent/50">
              <h2 className="font-mono text-sm text-text">{d.diagramKey}</h2>
              <p className="mt-1 text-xs text-text-muted">
                {d.direction} · {d.nodes.length} nodes · {d.edges.length} edges
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
