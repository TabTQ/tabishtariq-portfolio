import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { DiagramPanel } from "@/components/diagram/DiagramPanel";
import { getDiagram, getHomelab } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Proxmox VE Node" };

export default async function ProxmoxPage() {
  const [proxmoxDiagram, homelab] = await Promise.all([
    getDiagram("proxmox"),
    getHomelab(),
  ]);
  const proxmox = homelab.proxmox;
  if (!proxmox) notFound();

  return (
    <div className="space-y-8">
      <Link
        href="/homelab"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text"
      >
        <ArrowLeft size={14} /> Homelab
      </Link>

      <PageHeader eyebrow="Homelab" title={proxmox.name} description={proxmox.summary ?? undefined} />

      <Card>
        <SectionHeading title="Node map" hint="click a container" />
        <DiagramPanel
          spec={proxmoxDiagram}
          height={560}
          hint="Click a container to jump to its detail"
        />
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <SectionHeading title="Hardware" />
          <dl className="divide-y divide-border-soft">
            {proxmox.hardware.map((h) => (
              <div key={h.component} className="flex justify-between gap-3 py-2 text-sm">
                <dt className="text-text-faint">{h.component}</dt>
                <dd className="text-right text-text-muted">{h.spec}</dd>
              </div>
            ))}
          </dl>
          {proxmox.extra.network ? (
            <p className="mt-3 text-xs text-text-faint">{proxmox.extra.network}</p>
          ) : null}
        </Card>

        <Card className="lg:col-span-2">
          <SectionHeading title="External access" />
          <div className="flex flex-wrap gap-2">
            {(proxmox.extra.access ?? []).map((a) => (
              <Chip key={a} tone="accent">
                {a}
              </Chip>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            Services are isolated across LXC containers — Docker hosts for
            containerized apps, native installs for performance-critical
            workloads. LXC 999 runs Proxmox Backup Server against a dedicated SSD,
            backing up the whole homelab including the Raspberry Pi.
          </p>
        </Card>
      </div>

      <section className="space-y-3">
        <SectionHeading title="LXC containers" />
        <div className="grid gap-4 md:grid-cols-2">
          {proxmox.containers.map((c) => (
            <Card key={c.containerKey} id={c.containerKey} className="scroll-mt-24 transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-base text-text">{c.name}</h3>
                  <p className="text-xs text-text-faint">
                    {c.containerKey.toUpperCase()} · {c.ipAddress}
                  </p>
                </div>
                <Chip tone={c.status === "Idle" ? "gold" : "sage"} dot>
                  {c.status}
                </Chip>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                <Chip tone="neutral">{c.purpose}</Chip>
                <Chip tone="neutral">{c.resources}</Chip>
              </div>
              <ul className="mt-3 space-y-1.5 font-mono text-[11px] text-text-muted">
                {c.services.map((s) => (
                  <li key={s} className="rounded-md bg-surface-2 px-2.5 py-1.5">
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
