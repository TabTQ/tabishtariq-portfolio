import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { DiagramPanel } from "@/components/diagram/DiagramPanel";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Chip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/PageHeader";
import { hubDiagram } from "@/data/diagrams";
import { profile } from "@/data/profile";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="flex flex-col gap-4">
        <span className="eyebrow">Portfolio · interactive system map</span>
        <h1 className="font-serif text-4xl leading-tight text-text sm:text-5xl">
          {profile.name}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-text-muted">
          {profile.tagline}. {profile.summary}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="sage" dot>
            {profile.status}
          </Chip>
          <Chip tone="neutral">
            <MapPin size={12} /> {profile.location}
          </Chip>
          <a href={profile.socials.github} target="_blank" rel="noreferrer">
            <Chip tone="neutral">
              <GithubIcon size={12} /> {profile.socials.githubLabel}
            </Chip>
          </a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
            <Chip tone="neutral">
              <LinkedinIcon size={12} /> {profile.socials.linkedinLabel}
            </Chip>
          </a>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {profile.stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} />
        ))}
      </section>

      {/* Map + snapshot */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHeading title="Explore the map" hint="every node is a page" />
          <DiagramPanel spec={hubDiagram} height={500} />
        </Card>

        <Card className="flex flex-col">
          <SectionHeading title="Snapshot" />
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="eyebrow">Now</dt>
              <dd className="mt-1 text-text-muted">
                Data Engineer at Genpact, leading GE Renewables&rsquo; Redshift
                telemetry pipeline.
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Focus</dt>
              <dd className="mt-1 text-text-muted">
                Redshift / PL-pgSQL optimization, Python ETL orchestration, and a
                self-hosted Proxmox + Raspberry Pi homelab.
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Education</dt>
              <dd className="mt-1 text-text-muted">
                M.Tech Control &amp; Instrumentation, Jamia Millia Islamia.
              </dd>
            </div>
          </dl>
          <div className="mt-auto flex flex-col gap-2 pt-5">
            <Link
              href="/projects/redshift"
              className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-text transition-colors hover:border-accent/50"
            >
              View flagship project <ArrowUpRight size={15} className="text-accent" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-text transition-colors hover:border-accent/50"
            >
              Get in touch <ArrowUpRight size={15} className="text-accent" />
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
