import Link from "next/link";
import { notFound } from "next/navigation";
import { adminFetch } from "@/lib/admin";
import { saveDiagramAction } from "@/app/admin/actions";
import { DIAGRAM_FIELDS } from "@/app/admin/resources";
import { AdminForm } from "@/components/admin/AdminForm";
import { Card } from "@/components/ui/Card";

export default async function AdminDiagramEditPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const res = await adminFetch("/api/admin/diagrams");
  if (!res.ok) throw new Error(`Failed to load diagrams: ${res.status}`);
  const diagrams = (await res.json()) as Record<string, unknown>[];
  const diagram = diagrams.find((d) => d.diagramKey === key);
  if (!diagram) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/admin/diagrams" className="text-xs text-text-muted hover:text-text">
        ← Diagrams
      </Link>
      <h1 className="font-serif text-xl text-text">
        Diagram <span className="font-mono">{key}</span>
      </h1>
      <Card>
        <AdminForm
          fields={DIAGRAM_FIELDS}
          values={diagram}
          action={saveDiagramAction.bind(null, key)}
        />
      </Card>
    </div>
  );
}
