import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { redshift, getDeliverable } from "@/data/projects";

export function generateStaticParams() {
  return redshift.deliverables.map((d) => ({ id: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const d = getDeliverable(id);
  return { title: d ? d.title : "Deliverable" };
}

export default async function DeliverablePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = getDeliverable(id);
  if (!d) notFound();

  const others = redshift.deliverables.filter((x) => x.id !== id);

  return (
    <div className="space-y-8">
      <Link
        href="/projects/redshift"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text"
      >
        <ArrowLeft size={14} /> Redshift case study
      </Link>

      <PageHeader eyebrow={redshift.title} title={d.title}>
        <Chip tone="accent" className="mt-1 w-fit">
          {d.tag}
        </Chip>
      </PageHeader>

      <Card className="border-l-2 border-l-accent">
        <p className="text-sm leading-relaxed text-text-muted">{d.body}</p>
      </Card>

      <section>
        <span className="eyebrow">Other deep-dives</span>
        <div className="mt-3 flex flex-wrap gap-2">
          {others.map((o) => (
            <Link
              key={o.id}
              href={`/projects/redshift/${o.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-muted transition-colors hover:border-accent/50 hover:text-text"
            >
              {o.title}
              <ArrowUpRight size={13} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
