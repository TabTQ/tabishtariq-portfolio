import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import type { ResearchItem } from "@/data/types";
import { education, publications, certifications } from "@/data/research";

export const metadata: Metadata = { title: "Academics" };

function ItemRow({ item }: { item: ResearchItem }) {
  const inner = (
    <Card className="transition-colors hover:border-accent/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-base text-text">{item.title}</h3>
          <p className="text-sm text-accent">{item.institution}</p>
        </div>
        <span className="shrink-0 text-xs text-text-faint">{item.date}</span>
      </div>
      {item.description ? (
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          {item.description}
        </p>
      ) : null}
      {item.url ? (
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-text-muted">
          <ExternalLink size={13} /> View
        </span>
      ) : null}
    </Card>
  );

  return item.url ? (
    <a href={item.url} target="_blank" rel="noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}

export default function ResearchPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Academics"
        title="Education & publications"
        description="A control-and-instrumentation background — including two peer-reviewed papers on fuzzy-logic irrigation control."
      />

      <section>
        <SectionHeading title="Education" />
        <div className="grid gap-4 md:grid-cols-2">
          {education.map((e) => (
            <ItemRow key={e.title} item={e} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Publications" />
        <div className="grid gap-4 md:grid-cols-2">
          {publications.map((p) => (
            <ItemRow key={p.title} item={p} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Certifications" />
        <div className="grid gap-4 md:grid-cols-3">
          {certifications.map((c) => (
            <ItemRow key={c.title} item={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
