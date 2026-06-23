import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { DiagramPanel } from "@/components/diagram/DiagramPanel";
import { experienceDiagram } from "@/data/diagrams";
import { experiences } from "@/data/experience";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Experience"
        title="Work history"
        description="Four years on the same GE Renewables wind-energy data platform — from onboarding sources as a trainee to leading its Redshift redesign."
      />

      <Card>
        <SectionHeading title="Career flow" hint="click a role" />
        <DiagramPanel spec={experienceDiagram} height={260} hint="Click a role to open it" />
      </Card>

      <section className="space-y-4">
        {experiences.map((e) => (
          <Link key={e.slug} href={`/experience/${e.slug}`} className="block">
            <Card className="transition-colors hover:border-accent/50">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-lg text-text">{e.role}</h2>
                  <p className="text-sm text-accent">{e.company}</p>
                  {e.client ? (
                    <p className="text-xs text-text-faint">{e.client}</p>
                  ) : null}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-text-muted">{e.duration}</span>
                  <ArrowUpRight size={16} className="text-text-faint" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {e.summary}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.skills.slice(0, 6).map((s) => (
                  <Chip key={s} tone="neutral">
                    {s}
                  </Chip>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
