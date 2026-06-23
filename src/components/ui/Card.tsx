import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-xl border border-border bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.02)_inset]",
        className,
      )}
    >
      {children}
    </div>
  );
}
