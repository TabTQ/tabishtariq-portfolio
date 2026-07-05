import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { getProjects } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();
  const flagships = projects.filter((p) => p.kind === "flagship");
  const smallProjects = projects.filter((p) => p.kind === "small");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Projects"
        title="Things I've built"
        description="One flagship engagement plus earlier builds spanning automation, control systems, and the web."
      />

      {/* Flagship case studies */}
      {flagships.map((project) => (
        <Link key={project.slug} href={`/projects/${project.slug}`} className="block">
          <Card className="relative overflow-hidden transition-colors hover:border-accent/50">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent-soft blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <Star size={14} className="text-gold" />
                <span className="eyebrow">Flagship</span>
              </div>
              <h2 className="mt-2 font-serif text-2xl text-text">{project.title}</h2>
              {project.caseStudy?.client ? (
                <p className="text-sm text-accent">{project.caseStudy.client}</p>
              ) : null}
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-muted">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {(project.caseStudy?.platform ?? []).map((p) => (
                  <Chip key={p} tone="neutral">
                    {p}
                  </Chip>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-text">
                Open the interactive case study{" "}
                <ArrowUpRight size={15} className="text-accent" />
              </span>
            </div>
          </Card>
        </Link>
      ))}

      {/* Other projects */}
      <section>
        <SectionHeading title="Earlier projects" />
        <div className="grid gap-4 md:grid-cols-3">
          {smallProjects.map((p) => (
            <Card key={p.slug} className="flex flex-col">
              <span className="eyebrow">{p.type}</span>
              <h3 className="mt-1.5 font-serif text-lg text-text">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                {p.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.slice(0, 4).map((t) => (
                  <Chip key={t} tone="neutral">
                    {t}
                  </Chip>
                ))}
              </div>
              {p.repoUrl ? (
                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text"
                >
                  <GithubIcon size={14} /> Repository
                </a>
              ) : null}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
