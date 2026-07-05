import Link from "next/link";
import { getProjects } from "@/lib/api";
import { Card } from "@/components/ui/Card";

export default async function AdminCaseStudiesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, projects] = await Promise.all([searchParams, getProjects("flagship")]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-xl text-text">Case studies</h1>
        <p className="text-sm text-text-muted">
          Rich detail attached to flagship projects. Create the project first
          (kind = flagship), then edit its case study here.
        </p>
      </div>
      {error ? <Card className="border-danger/50 text-sm text-danger">{error}</Card> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <Link key={p.id} href={`/admin/case-studies/${p.id}`} className="block">
            <Card className="transition-colors hover:border-accent/50">
              <h2 className="font-serif text-base text-text">{p.title}</h2>
              <p className="mt-1 text-xs text-text-muted">
                /{p.slug} · {p.caseStudy ? "has case study" : "no case study yet"} ·{" "}
                {p.deliverables.length} deliverables
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
