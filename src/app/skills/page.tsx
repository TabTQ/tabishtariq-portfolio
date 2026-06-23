import type { Metadata } from "next";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { DiagramPanel } from "@/components/diagram/DiagramPanel";
import { skillsDiagram } from "@/data/diagrams";
import { skillGroups } from "@/data/skills";

export const metadata: Metadata = { title: "Skills" };

export default function SkillsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Skills"
        title="Stack & tooling"
        description="Where I spend my time: cloud data warehousing, Python data engineering, and the Linux/Docker infrastructure that backs my homelab."
      />

      <Card>
        <SectionHeading title="Overview" hint="click a domain" />
        <DiagramPanel
          spec={skillsDiagram}
          height={360}
          hint="Click a domain to jump to its skills"
        />
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        {skillGroups.map((g, i) => (
          <Card key={g.category} id={`cat-${i}`} className="scroll-mt-24">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Icon name={g.icon} size={16} />
              </span>
              <h2 className="font-serif text-base text-text">{g.category}</h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {g.skills.map((s) => (
                <Chip key={s} tone="neutral">
                  {s}
                </Chip>
              ))}
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
