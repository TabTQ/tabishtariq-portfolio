"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { MapNode } from "@/data/types";

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
  data,
  size = "md",
}: {
  data: FlowNodeData;
  size?: "sm" | "md" | "lg";
}) {
  const clickable = Boolean(data.route);
  const accent = data.accent ?? "accent";
  const sizes = {
    sm: "w-full px-3 py-2.5",
    md: "w-full px-4 py-3",
    lg: "w-full px-5 py-4",
  };
  return (
    <div
      data-clickable={clickable}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl border border-border bg-surface text-left shadow-md transition-all",
        sizes[size],
        clickable && "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg",
        accentRing[accent],
      )}
    >
      <Handles dir={data.dir} />
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

function RootNode({ data }: NodeProps) {
  const d = data as unknown as FlowNodeData;
  return (
    <div className="relative flex w-full items-center gap-3 rounded-xl border border-accent/50 bg-linear-to-br from-surface to-surface-2 px-5 py-4 shadow-lg ring-1 ring-accent/20">
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

const make =
  (size: "sm" | "md" | "lg") =>
  ({ data }: NodeProps) =>
    <BaseNode data={data as unknown as FlowNodeData} size={size} />;

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
