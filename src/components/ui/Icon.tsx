import * as Lucide from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconName = keyof typeof Lucide;

/** Render a lucide icon by name (falls back to a circle if unknown). */
export function Icon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Cmp =
    (Lucide[name as IconName] as React.ComponentType<LucideProps>) ??
    Lucide.Circle;
  return <Cmp {...props} />;
}
