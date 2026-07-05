import Link from "next/link";
import { notFound } from "next/navigation";
import { saveResourceAction } from "@/app/admin/actions";
import { getResource } from "@/app/admin/resources";
import { AdminForm } from "@/components/admin/AdminForm";
import { Card } from "@/components/ui/Card";

export default async function ResourceNewPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href={`/admin/${resource.key}`} className="text-xs text-text-muted hover:text-text">
        ← {resource.title}
      </Link>
      <h1 className="font-serif text-xl text-text">New {resource.title.toLowerCase()} entry</h1>
      <Card>
        <AdminForm
          fields={resource.fields}
          action={saveResourceAction.bind(null, resource.key, null)}
          submitLabel="Create"
        />
      </Card>
    </div>
  );
}
