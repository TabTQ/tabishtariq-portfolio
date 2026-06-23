import { cn } from "@/lib/cn";

const tones = {
  neutral: "border-border bg-surface-2 text-text-muted",
  accent: "border-accent/40 bg-accent-soft text-accent",
  sage: "border-sage/40 bg-sage-soft text-sage",
  gold: "border-gold/40 bg-gold-soft text-gold",
} as const;

export function Chip({
  children,
  tone = "neutral",
  dot = false,
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {dot ? (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      ) : null}
      {children}
    </span>
  );
}
