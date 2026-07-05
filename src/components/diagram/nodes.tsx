"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { nodeVisualState, useDiagramState } from "./DiagramState";
import type { MapNode } from "@/lib/types";

export type FlowNodeData = MapNode & { dir: "TB" | "LR" };

const accentRing: Record<string, string> = {
  accent: "data-[clickable=true]:hover:border-accent data-[clickable=true]:hover:shadow-accent/20",
  sage: "data-[clickable=true]:hover:border-sage data-[clickable=true]:hover:shadow-sage/20",
  gold: "data-[clickable=true]:hover:border-gold data-[clickable=true]:hover:shadow-gold/20",
  blue: "data-[clickable=true]:hover:border-blue data-[clickable=true]:hover:shadow-blue/20",
  danger: "data-[clickable=true]:hover:border-danger data-[clickable=true]:hover:shadow-danger/20",
};

const iconTone: Record<string, string> = {
  accent: "bg-accent-soft text-accent",
  sage: "bg-sage-soft text-sage",
  gold: "bg-gold-soft text-gold",
  blue: "bg-[var(--blue)]/15 text-blue",
  danger: "bg-danger/15 text-danger",
};

function Handles({ dir }: { dir: "TB" | "LR" }) {
  const target = dir === "TB" ? Position.Top : Position.Left;
  const source = dir === "TB" ? Position.Bottom : Position.Right;
  return (
    <>
      <Handle type="target" position={target} />
      <Handle type="source" position={source} />
    </>
  );
}

function BaseNode({
  id,
  data,
  size = "md",
}: {
  id: string;
  data: FlowNodeData;
  size?: "sm" | "md" | "lg";
}) {
  const { active, dimmed } = nodeVisualState(id, useDiagramState());
  const clickable = Boolean(data.route);
  const accent = data.accent ?? "accent";
  const sizes = {
    sm: "w-full px-3 py-2.5",
    md: "w-full px-4 py-3",
    lg: "w-full px-5 py-4",
  };
  const tooltip = `${data.label}${data.sublabel ? ` — ${data.sublabel}` : ""}`;
  const mayTruncate = tooltip.length > 30;
  return (
    <div
      data-clickable={clickable}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl border border-border bg-surface text-left shadow-md transition-all",
        sizes[size],
        clickable && "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg",
        accentRing[accent],
        active && "border-accent ring-2 ring-accent/50",
        dimmed && "opacity-30",
      )}
    >
      <Handles dir={data.dir} />
      {mayTruncate ? (
        <span className="pointer-events-none absolute -top-2 left-1/2 z-20 w-max max-w-72 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-bg-2 px-2.5 py-1.5 text-[11px] leading-snug text-text opacity-0 shadow-lg transition-opacity delay-300 group-hover:opacity-100">
          {tooltip}
        </span>
      ) : null}
      {data.icon ? (
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            iconTone[accent],
          )}
        >
          <Icon name={data.icon} size={size === "lg" ? 20 : 17} />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate font-medium text-text",
            size === "lg" ? "font-serif text-base" : "text-sm",
          )}
        >
          {data.label}
        </span>
        {data.sublabel ? (
          <span className="block truncate text-[11px] text-text-muted">
            {data.sublabel}
          </span>
        ) : null}
      </span>
      {clickable ? (
        <ArrowUpRight
          size={15}
          className="shrink-0 text-text-faint transition-colors group-hover:text-text"
        />
      ) : null}
    </div>
  );
}

function RootNode({ id, data }: NodeProps) {
  const d = data as unknown as FlowNodeData;
  const { active, dimmed } = nodeVisualState(id, useDiagramState());
  return (
    <div
      className={cn(
        "relative flex w-full items-center gap-3 rounded-xl border border-accent/50 bg-linear-to-br from-surface to-surface-2 px-5 py-4 shadow-lg ring-1 ring-accent/20 transition-opacity",
        active && "ring-2 ring-accent/60",
        dimmed && "opacity-30",
      )}
    >
      <Handles dir={d.dir} />
      {d.icon ? (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-bg-2">
          <Icon name={d.icon} size={20} />
        </span>
      ) : null}
      <span>
        <span className="block font-serif text-base text-text">{d.label}</span>
        {d.sublabel ? (
          <span className="block text-[11px] text-text-muted">{d.sublabel}</span>
        ) : null}
      </span>
    </div>
  );
}

function make(size: "sm" | "md" | "lg") {
  function SizedNode({ id, data }: NodeProps) {
    return <BaseNode id={id} data={data as unknown as FlowNodeData} size={size} />;
  }
  return SizedNode;
}

export const nodeTypes = {
  root: RootNode,
  domain: make("md"),
  service: make("md"),
  storage: make("sm"),
  device: make("sm"),
  metric: make("sm"),
  step: make("lg"),
  group: make("md"),
};
