import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { resources } from "@/app/admin/resources";

export const metadata: Metadata = { title: "Admin" };

const extraSections = [
  { href: "/admin/profile", title: "Profile", description: "Name, bio, socials, stat cards" },
  { href: "/admin/case-studies", title: "Case studies", description: "Flagship project detail (metrics, layers, tech stack)" },
  { href: "/admin/diagrams", title: "Diagrams", description: "System-map nodes and edges per page" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-text">Content admin</h1>
      <p className="text-sm text-text-muted">
        Every change here writes straight to Postgres; the public pages pick it
        up on the next refresh.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {extraSections.map((s) => (
          <Link key={s.href} href={s.href} className="block">
            <Card className="h-full transition-colors hover:border-accent/50">
              <h2 className="font-serif text-base text-text">{s.title}</h2>
              <p className="mt-1 text-sm text-text-muted">{s.description}</p>
            </Card>
          </Link>
        ))}
        {Object.values(resources).map((r) => (
          <Link key={r.key} href={`/admin/${r.key}`} className="block">
            <Card className="h-full transition-colors hover:border-accent/50">
              <h2 className="font-serif text-base text-text">{r.title}</h2>
              <p className="mt-1 text-sm text-text-muted">{r.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
