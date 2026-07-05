import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, CalendarDays, MapPin } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { BulletList } from "@/components/ui/Bullet";
import { getExperience } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = await getExperience(slug);
  return { title: e ? `${e.role} · ${e.company}` : "Experience" };
}

export default async function ExperienceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = await getExperience(slug);
  if (!e) notFound();

  return (
    <div className="space-y-8">
      <Link
        href="/experience"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text"
      >
        <ArrowLeft size={14} /> All experience
      </Link>

      <PageHeader eyebrow={e.company} title={e.role} description={e.summary} />

      <div className="flex flex-wrap gap-2">
        <Chip tone="neutral">
          <Building2 size={12} /> {e.client ?? e.company}
        </Chip>
        <Chip tone="neutral">
          <CalendarDays size={12} /> {e.duration}
        </Chip>
        {e.location ? (
          <Chip tone="neutral">
            <MapPin size={12} /> {e.location}
          </Chip>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHeading title="What I delivered" />
          <BulletList items={e.highlights} />
        </Card>
        <Card className="h-fit">
          <SectionHeading title="Stack" />
          <div className="flex flex-wrap gap-1.5">
            {e.skills.map((s) => (
              <Chip key={s} tone="accent">
                {s}
              </Chip>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
