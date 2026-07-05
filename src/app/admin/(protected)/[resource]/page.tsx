import Link from "next/link";
import { notFound } from "next/navigation";
import { adminFetch } from "@/lib/admin";
import { getResource } from "@/app/admin/resources";
import { AdminTable } from "@/components/admin/AdminTable";
import { Card } from "@/components/ui/Card";

export default async function ResourceListPage({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();
  const { error } = await searchParams;

  const res = await adminFetch(resource.listPath);
  if (!res.ok) throw new Error(`Failed to load ${resource.title}: ${res.status}`);
  const data = (await res.json()) as unknown;
  const rows = resource.listTransform
    ? resource.listTransform(data)
    : (data as Record<string, unknown>[]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl text-text">{resource.title}</h1>
          <p className="text-sm text-text-muted">{resource.description}</p>
        </div>
        <Link
          href={`/admin/${resource.key}/new`}
          className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-bg-2 transition-opacity hover:opacity-90"
        >
          New entry
        </Link>
      </div>
      {error ? (
        <Card className="border-danger/50 text-sm text-danger">{error}</Card>
      ) : null}
      <AdminTable resource={resource} rows={rows} />
    </div>
  );
}
