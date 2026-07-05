import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { MetricBar } from "@/components/ui/MetricBar";
import { DiagramPanel } from "@/components/diagram/DiagramPanel";
import { getDiagram, getProject } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project ? project.title : "Project" };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project || project.kind !== "flagship") notFound();

  const cs = project.caseStudy;
  const diagram = await getDiagram(slug).catch(() => null);

  return (
    <div className="space-y-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text"
      >
        <ArrowLeft size={14} /> All projects
      </Link>

      <PageHeader
        eyebrow={cs?.client ?? "Project"}
        title={project.title}
        description={project.description}
      >
        <div className="flex flex-wrap gap-2 pt-1">
          {cs?.role ? <Chip tone="accent">{cs.role}</Chip> : null}
          {cs?.duration ? <Chip tone="neutral">{cs.duration}</Chip> : null}
        </div>
      </PageHeader>

      {cs?.context ? (
        <Card className="border-l-2 border-l-accent">
          <span className="eyebrow">The problem inherited</span>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{cs.context}</p>
        </Card>
      ) : null}

      {/* Architecture map */}
      {diagram ? (
        <Card>
          <SectionHeading title="Pipeline architecture" hint="click highlighted nodes" />
          <DiagramPanel
            spec={diagram}
            height={520}
            hint="Click a highlighted node to open its deep-dive"
          />
        </Card>
      ) : null}

      {/* Before / after metrics */}
      {cs && cs.metrics.length > 0 ? (
        <section>
          <SectionHeading title="Before → after" hint="measured outcomes" />
          <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {cs.metrics.map((m) => (
              <MetricBar
                key={m.label}
                label={m.label}
                before={m.before}
                after={m.after}
                tone={m.emphasis ?? "accent"}
                fill={92}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Layer breakdown */}
      {cs && cs.layers.length > 0 ? (
        <section>
          <SectionHeading title="Three-layer separation" />
          <div className="grid gap-4 md:grid-cols-3">
            {cs.layers.map((col) => (
              <Card key={col.title}>
                <Chip tone={col.tone}>{col.title}</Chip>
                <ul className="mt-3 space-y-2 font-mono text-[11px] leading-relaxed text-text-muted">
                  {col.items.map((it) => (
                    <li key={it} className="rounded-md bg-surface-2 px-2.5 py-2">
                      {it}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {/* Deliverable deep-dives */}
      {project.deliverables.length > 0 ? (
        <section>
          <SectionHeading title="Deep-dives" hint="open a deliverable" />
          <div className="grid gap-4 md:grid-cols-2">
            {project.deliverables.map((d) => (
              <Link
                key={d.deliverableKey}
                href={`/projects/${project.slug}/${d.deliverableKey}`}
                className="block"
              >
                <Card className="flex h-full flex-col transition-colors hover:border-accent/50">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-base text-text">{d.title}</h3>
                    <ArrowUpRight size={16} className="shrink-0 text-text-faint" />
                  </div>
                  <Chip tone="neutral" className="mt-2 w-fit">
                    {d.tag}
                  </Chip>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-muted">
                    {d.body}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Tech stack */}
      {cs && cs.techStack.length > 0 ? (
        <section>
          <SectionHeading title="Technology stack" />
          <Card>
            <dl className="divide-y divide-border-soft">
              {cs.techStack.map((t) => (
                <div
                  key={t.layer}
                  className="flex flex-col gap-1 py-2.5 sm:flex-row sm:justify-between sm:gap-4"
                >
                  <dt className="text-sm font-medium text-text">{t.layer}</dt>
                  <dd className="text-sm text-text-muted sm:text-right">{t.tech}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
