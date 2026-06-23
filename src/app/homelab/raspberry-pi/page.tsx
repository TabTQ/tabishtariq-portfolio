import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DiagramPanel } from "@/components/diagram/DiagramPanel";
import { rpiDiagram } from "@/data/diagrams";
import { raspberryPi } from "@/data/homelab";

export const metadata: Metadata = { title: "Raspberry Pi Stack" };

export default function RaspberryPiPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/homelab"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text"
      >
        <ArrowLeft size={14} /> Homelab
      </Link>

      <PageHeader
        eyebrow="Homelab"
        title={raspberryPi.name}
        description={raspberryPi.summary}
      />

      <Card>
        <SectionHeading title="Access & service map" hint="click a service" />
        <DiagramPanel
          spec={rpiDiagram}
          height={480}
          hint="Click a service to jump to the matrix"
        />
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <SectionHeading title="Hardware" />
          <dl className="divide-y divide-border-soft">
            {raspberryPi.hardware.map((h) => (
              <div key={h.component} className="flex justify-between gap-3 py-2 text-sm">
                <dt className="shrink-0 text-text-faint">{h.component}</dt>
                <dd className="text-right text-text-muted">{h.spec}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card className="lg:col-span-2">
          <SectionHeading title="Service matrix" hint={`${raspberryPi.services.length} containers`} />
          <div className="overflow-hidden rounded-lg border border-border-soft">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs text-text-faint">
                <tr>
                  <th className="px-3 py-2 font-medium">Service</th>
                  <th className="px-3 py-2 font-medium">Container</th>
                  <th className="px-3 py-2 font-medium">Port</th>
                  <th className="hidden px-3 py-2 font-medium sm:table-cell">Function</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {raspberryPi.services.map((s) => (
                  <tr
                    key={s.container}
                    id={s.container}
                    className="scroll-mt-24 hover:bg-surface-2/50"
                  >
                    <td className="px-3 py-2 text-text">{s.service}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-text-muted">
                      {s.container}
                    </td>
                    <td className="px-3 py-2 font-mono text-[11px] text-text-muted">
                      {s.hostPort}
                    </td>
                    <td className="hidden px-3 py-2 text-text-muted sm:table-cell">
                      {s.fn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-text-faint">{raspberryPi.backup}</p>
        </Card>
      </div>
    </div>
  );
}
