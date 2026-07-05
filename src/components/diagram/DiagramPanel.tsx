"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Maximize2, MousePointerClick, Search, X } from "lucide-react";
import { SystemMap } from "./SystemMap";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { DiagramSpec } from "@/lib/types";

/**
 * Wraps an interactive SystemMap with a hint, an optional search box for
 * larger diagrams, a fullscreen toggle, and an accessible link fallback
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
  const [query, setQuery] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const links = spec.nodes.filter((n) => n.route);
  const searchable = spec.nodes.length > 8;

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  const map = (
    <SystemMap
      spec={spec}
      height={fullscreen ? "100%" : height}
      filter={query}
    />
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 text-xs text-text-faint">
          <MousePointerClick size={14} className="shrink-0" />
          <span className="truncate">{hint}. Scroll to pan, use controls to zoom.</span>
        </div>
        {searchable ? (
          <div className="relative">
            <Search
              size={13}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-faint"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a node…"
              className="w-40 rounded-lg border border-border bg-surface py-1.5 pl-8 pr-7 text-xs text-text outline-none transition-colors focus:border-accent/60"
            />
            {query ? (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-faint hover:text-text"
              >
                <X size={12} />
              </button>
            ) : null}
          </div>
        ) : null}
        <button
          onClick={() => setFullscreen(true)}
          aria-label="Expand diagram"
          className="rounded-lg border border-border bg-surface p-1.5 text-text-muted transition-colors hover:border-accent/50 hover:text-text"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {map}

      {/* Fullscreen overlay */}
      {fullscreen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/70 p-3 sm:p-6">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-soft px-4 py-2.5">
              <span className="text-sm text-text-muted">{hint}</span>
              <div className="flex items-center gap-2">
                {searchable ? (
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Find a node…"
                    className="w-44 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text outline-none focus:border-accent/60"
                  />
                ) : null}
                <button
                  onClick={() => setFullscreen(false)}
                  aria-label="Close fullscreen"
                  className="rounded-lg border border-border bg-surface p-1.5 text-text-muted transition-colors hover:border-accent/50 hover:text-text"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 p-3">{map}</div>
          </div>
        </div>
      ) : null}

      {links.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {links.map((n) => {
            const matched =
              query.trim() &&
              (n.label.toLowerCase().includes(query.trim().toLowerCase()) ||
                (n.sublabel ?? "").toLowerCase().includes(query.trim().toLowerCase()));
            const cls = cn(
              "inline-flex items-center gap-1.5 rounded-lg border bg-surface px-2.5 py-1.5 text-xs transition-colors hover:border-accent/50 hover:text-text",
              matched
                ? "border-accent/60 text-text"
                : "border-border text-text-muted",
            );
            return n.route!.startsWith("#") ? (
              <a key={n.id} href={n.route} className={cls}>
                {n.icon ? <Icon name={n.icon} size={13} /> : null}
                {n.label}
              </a>
            ) : (
              <Link key={n.id} href={n.route!} className={cls}>
                {n.icon ? <Icon name={n.icon} size={13} /> : null}
                {n.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
