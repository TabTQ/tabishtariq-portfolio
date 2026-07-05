import Link from "next/link";
import { notFound } from "next/navigation";
import { adminFetch } from "@/lib/admin";
import { saveResourceAction } from "@/app/admin/actions";
import { getResource } from "@/app/admin/resources";
import { AdminForm } from "@/components/admin/AdminForm";
import { Card } from "@/components/ui/Card";

export default async function ResourceEditPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  const res = await adminFetch(resource.listPath);
  if (!res.ok) throw new Error(`Failed to load ${resource.title}: ${res.status}`);
  const data = (await res.json()) as unknown;
  const rows = resource.listTransform
    ? resource.listTransform(data)
    : (data as Record<string, unknown>[]);
  const row = rows.find((r) => String(r.id) === id);
  if (!row) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href={`/admin/${resource.key}`} className="text-xs text-text-muted hover:text-text">
        ← {resource.title}
      </Link>
      <h1 className="font-serif text-xl text-text">
        Edit {resource.title.toLowerCase()} #{id}
      </h1>
      <Card>
        <AdminForm
          fields={resource.fields}
          values={row}
          action={saveResourceAction.bind(null, resource.key, JSON.stringify(row))}
        />
      </Card>
    </div>
  );
}
