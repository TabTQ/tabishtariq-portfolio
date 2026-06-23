import Link from "next/link";
import { MousePointerClick } from "lucide-react";
import { SystemMap } from "./SystemMap";
import { Icon } from "@/components/ui/Icon";
import type { DiagramSpec } from "@/data/types";

/**
 * Wraps an interactive SystemMap with a hint and an accessible link fallback
 * (so every routed node is reachable without canvas interaction / for SEO).
 */
export function DiagramPanel({
  spec,
  height,
  hint = "Click a node to open its detail",
}: {
  spec: DiagramSpec;
  height?: number;
  hint?: string;
}) {
  const links = spec.nodes.filter((n) => n.route);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-text-faint">
        <MousePointerClick size={14} />
        <span>{hint}. Scroll to pan, use controls to zoom.</span>
      </div>

      <SystemMap spec={spec} height={height} />

      {links.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {links.map((n) =>
            n.route!.startsWith("#") ? (
              <a
                key={n.id}
                href={n.route}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text-muted transition-colors hover:border-accent/50 hover:text-text"
              >
                {n.icon ? <Icon name={n.icon} size={13} /> : null}
                {n.label}
              </a>
            ) : (
              <Link
                key={n.id}
                href={n.route!}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text-muted transition-colors hover:border-accent/50 hover:text-text"
              >
                {n.icon ? <Icon name={n.icon} size={13} /> : null}
                {n.label}
              </Link>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
