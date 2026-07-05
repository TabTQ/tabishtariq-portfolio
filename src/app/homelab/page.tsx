import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { DiagramPanel } from "@/components/diagram/DiagramPanel";
import { getDiagram, getHomelab } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Homelab" };

export default async function HomelabPage() {
  const [homelabDiagram, homelab] = await Promise.all([
    getDiagram("homelab"),
    getHomelab(),
  ]);
  const subsystems = [
    { href: "/homelab/proxmox", icon: "Boxes", name: homelab.proxmox?.name, summary: homelab.proxmox?.summary },
    { href: "/homelab/raspberry-pi", icon: "Cpu", name: homelab.raspberryPi?.name, summary: homelab.raspberryPi?.summary },
    { href: "/homelab/network", icon: "Network", name: homelab.network?.name, summary: homelab.network?.summary },
  ].filter((s) => s.name);
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Homelab"
        title="Self-hosted service platform"
        description="A Proxmox compute node, a Raspberry Pi observability stack, and a VLAN-segmented dual-ISP network — all built self-directed with AI coding assistants as a force multiplier."
      />

      <Card>
        <SectionHeading title="Topology" hint="click a subsystem" />
        <DiagramPanel spec={homelabDiagram} height={320} hint="Click a subsystem to explore it" />
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {subsystems.map((s) => (
          <Link key={s.href} href={s.href} className="block">
            <Card className="flex h-full flex-col transition-colors hover:border-accent/50">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Icon name={s.icon} size={19} />
              </span>
              <h2 className="mt-3 font-serif text-lg text-text">{s.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                {s.summary}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-text">
                Explore <ArrowUpRight size={14} className="text-accent" />
              </span>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
