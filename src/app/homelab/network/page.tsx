import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { DiagramPanel } from "@/components/diagram/DiagramPanel";
import { networkDiagram } from "@/data/diagrams";
import { network } from "@/data/homelab";

export const metadata: Metadata = { title: "Home Network" };

const switchIds = ["sg108e", "ls105g", "tenda"];

export default function NetworkPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/homelab"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text"
      >
        <ArrowLeft size={14} /> Homelab
      </Link>

      <PageHeader eyebrow="Homelab" title={network.name} description={network.summary} />

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
            {network.isps.map((i) => (
              <li key={i.name} className="text-sm">
                <span className="text-text">{i.name}</span>
                <p className="text-text-muted">{i.spec}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2.5 text-xs text-text-muted">
            {network.failover}
          </p>
        </Card>

        <Card>
          <SectionHeading title="VLAN segmentation" />
          <ul className="space-y-3">
            {network.vlans.map((v) => (
              <li key={v.id} className="flex items-start gap-3 text-sm">
                <Chip tone={v.id.includes("10") ? "sage" : "gold"}>{v.id}</Chip>
                <span className="text-text-muted">
                  <span className="font-mono text-[11px] text-text">{v.subnet}</span>{" "}
                  — {v.role}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section className="space-y-3">
        <SectionHeading title="Switches" />
        <div className="grid gap-4 md:grid-cols-3">
          {network.switches.map((sw, idx) => (
            <Card key={sw.name} id={switchIds[idx]} className="scroll-mt-24">
              <h3 className="font-serif text-base text-text">{sw.name}</h3>
              <p className="text-xs text-text-faint">{sw.type}</p>
              <Chip tone="neutral" className="mt-2 w-fit">
                {sw.role}
              </Chip>
              <ul className="mt-3 space-y-1.5 font-mono text-[11px] text-text-muted">
                {sw.ports.map((p) => (
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
