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
export const metadata: Metadata = { title: "Home Network" };

export default async function NetworkPage() {
  const [networkDiagram, homelab] = await Promise.all([
    getDiagram("network"),
    getHomelab(),
  ]);
  const network = homelab.network;
  if (!network) notFound();

  const isps = network.networkEntities.filter((e) => e.entityType === "isp");
  const vlans = network.networkEntities.filter((e) => e.entityType === "vlan");
  const switches = network.networkEntities.filter((e) => e.entityType === "switch");

  return (
    <div className="space-y-8">
      <Link
        href="/homelab"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text"
      >
        <ArrowLeft size={14} /> Homelab
      </Link>

      <PageHeader eyebrow="Homelab" title={network.name} description={network.summary ?? undefined} />

      <Card>
        <SectionHeading title="Topology" hint="click a switch" />
        <DiagramPanel
          spec={networkDiagram}
          height={520}
          hint="Click a switch to jump to its detail"
        />
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <SectionHeading title="ISPs & failover" />
          <ul className="space-y-3">
            {isps.map((i) => (
              <li key={i.id} className="text-sm">
                <span className="text-text">{i.name}</span>
                <p className="text-text-muted">{i.spec.spec}</p>
              </li>
            ))}
          </ul>
          {network.extra.failover ? (
            <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2.5 text-xs text-text-muted">
              {network.extra.failover}
            </p>
          ) : null}
        </Card>

        <Card>
          <SectionHeading title="VLAN segmentation" />
          <ul className="space-y-3">
            {vlans.map((v) => (
              <li key={v.id} className="flex items-start gap-3 text-sm">
                <Chip tone={v.name.includes("10") ? "sage" : "gold"}>{v.name}</Chip>
                <span className="text-text-muted">
                  <span className="font-mono text-[11px] text-text">{v.spec.subnet}</span>{" "}
                  — {v.spec.role}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section className="space-y-3">
        <SectionHeading title="Switches" />
        <div className="grid gap-4 md:grid-cols-3">
          {switches.map((sw) => (
            <Card key={sw.id} id={sw.spec.anchor} className="scroll-mt-24">
              <h3 className="font-serif text-base text-text">{sw.name}</h3>
              <p className="text-xs text-text-faint">{sw.spec.type}</p>
              <Chip tone="neutral" className="mt-2 w-fit">
                {sw.spec.role}
              </Chip>
              <ul className="mt-3 space-y-1.5 font-mono text-[11px] text-text-muted">
                {(sw.spec.ports ?? []).map((p) => (
                  <li key={p} className="rounded-md bg-surface-2 px-2.5 py-1.5">
                    {p}
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
