import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { StatCard } from "@/components/ui/StatCard";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="About"
        title={`${profile.name} — ${profile.title}`}
        description={profile.tagline}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="space-y-4 text-sm leading-relaxed text-text-muted">
            {profile.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <span className="eyebrow">At a glance</span>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-text-faint">Location</dt>
                <dd className="text-text">{profile.location}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-faint">Email</dt>
                <dd className="truncate text-text">{profile.email}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-faint">Phone</dt>
                <dd className="text-text">{profile.phone}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={profile.socials.github} target="_blank" rel="noreferrer">
                <Chip tone="neutral">GitHub</Chip>
              </a>
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
                <Chip tone="neutral">LinkedIn</Chip>
              </a>
            </div>
          </Card>
          <Link
            href="/experience"
            className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text transition-colors hover:border-accent/50"
          >
            See work history <ArrowUpRight size={15} className="text-accent" />
          </Link>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {profile.stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} />
        ))}
      </section>
    </div>
  );
}
