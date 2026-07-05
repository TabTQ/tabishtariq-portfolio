import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getProfile } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const profile = await getProfile();
  const channels = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    { icon: GithubIcon, label: "GitHub", value: profile.socials.githubLabel, href: profile.socials.github },
    { icon: LinkedinIcon, label: "LinkedIn", value: profile.socials.linkedinLabel, href: profile.socials.linkedin },
  ];
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Contact"
        title="Let's talk"
        description="The fastest way to reach me is email."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="block"
          >
            <Card className="flex items-center gap-4 transition-colors hover:border-accent/50">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <c.icon size={19} />
              </span>
              <div className="min-w-0">
                <span className="eyebrow">{c.label}</span>
                <p className="truncate text-sm text-text">{c.value}</p>
              </div>
            </Card>
          </a>
        ))}
      </div>

      <Card className="flex items-center gap-3 text-sm text-text-muted">
        <MapPin size={16} className="text-accent" />
        Based in {profile.location} · {profile.brand}
      </Card>
    </div>
  );
}
