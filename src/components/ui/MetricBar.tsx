import { cn } from "@/lib/cn";

const tones = {
  accent: { bar: "bg-accent", text: "text-accent" },
  sage: { bar: "bg-sage", text: "text-sage" },
  gold: { bar: "bg-gold", text: "text-gold" },
} as const;

/**
 * Labelled progress bar in the style of the reference "risk envelope" rows —
 * here repurposed to show a before → after improvement.
 */
export function MetricBar({
  label,
  before,
  after,
  fill = 80,
  tone = "accent",
}: {
  label: string;
  before: string;
  after: string;
  fill?: number;
  tone?: keyof typeof tones;
}) {
  const t = tones[tone];
  return (
    <div className="flex flex-col gap-1.5 py-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-text">{label}</span>
        <span className={cn("text-xs font-medium tabular-nums", t.text)}>{after}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
        <div
          className={cn("h-full rounded-full", t.bar)}
          style={{ width: `${Math.min(Math.max(fill, 6), 100)}%` }}
        />
      </div>
      <span className="text-xs text-text-faint line-through decoration-text-faint/50">
        {before}
      </span>
    </div>
  );
}
