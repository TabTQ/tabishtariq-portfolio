"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Chip } from "@/components/ui/Chip";

const LABELS: Record<string, string> = {
  "": "Dashboard",
  about: "About",
  experience: "Experience",
  genpact: "Genpact",
  "tcs-system-engineer": "System Engineer",
  "tcs-trainee": "Trainee",
  projects: "Projects",
  redshift: "Redshift Pipeline",
  consolidation: "Unified Procedures",
  "etl-framework": "ETL Framework",
  "join-optimization": "Join Optimization",
  deadlocks: "Lock Redesign",
  homelab: "Homelab",
  proxmox: "Proxmox",
  "raspberry-pi": "Raspberry Pi",
  network: "Network",
  skills: "Skills",
  academics: "Academics",
  contact: "Contact",
};

function label(seg: string) {
  return LABELS[seg] ?? seg.replace(/-/g, " ");
}

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.length ? segments : [""];

  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const heading = label(crumbs[crumbs.length - 1]);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-bg/85 px-4 py-3.5 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg border border-border p-2 text-text-muted hover:text-text lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      <div className="min-w-0 flex-1">
        <nav className="flex items-center gap-1.5 text-[11px] text-text-faint">
          <span>portfolio</span>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5 truncate">
              <span aria-hidden>/</span>
              <span className={i === crumbs.length - 1 ? "text-text-muted" : ""}>
                {label(c)}
              </span>
            </span>
          ))}
        </nav>
        <h1 className="truncate font-serif text-lg text-text">{heading}</h1>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <Chip tone="sage" dot>
          available
        </Chip>
        <Chip tone="neutral">remote</Chip>
      </div>

      <div className="hidden font-mono text-xs tabular-nums text-text-muted md:block">
        {time} IST
      </div>
    </header>
  );
}
