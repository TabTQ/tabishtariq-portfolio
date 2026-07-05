import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { getProject } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; deliverable: string }>;
}): Promise<Metadata> {
  const { slug, deliverable } = await params;
  const project = await getProject(slug);
  const d = project?.deliverables.find((x) => x.deliverableKey === deliverable);
  return { title: d ? d.title : "Deliverable" };
}

export default async function DeliverablePage({
  params,
}: {
  params: Promise<{ slug: string; deliverable: string }>;
}) {
  const { slug, deliverable } = await params;
  const project = await getProject(slug);
  const d = project?.deliverables.find((x) => x.deliverableKey === deliverable);
  if (!project || !d) notFound();

  const others = project.deliverables.filter(
    (x) => x.deliverableKey !== deliverable,
  );

  return (
    <div className="space-y-8">
      <Link
        href={`/projects/${project.slug}`}
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text"
      >
        <ArrowLeft size={14} /> {project.title}
      </Link>

      <PageHeader eyebrow={project.title} title={d.title}>
        <Chip tone="accent" className="mt-1 w-fit">
          {d.tag}
        </Chip>
      </PageHeader>

      <Card className="border-l-2 border-l-accent">
        <p className="text-sm leading-relaxed text-text-muted">{d.body}</p>
      </Card>

      {others.length > 0 ? (
        <section>
          <span className="eyebrow">Other deep-dives</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.deliverableKey}
                href={`/projects/${project.slug}/${o.deliverableKey}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-muted transition-colors hover:border-accent/50 hover:text-text"
              >
                {o.title}
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
