import { Card } from "./Card";

export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card className="flex flex-col gap-2">
      <span className="eyebrow">{label}</span>
      <span className="font-serif text-3xl leading-none text-text">{value}</span>
      {sub ? <span className="text-xs text-text-muted">{sub}</span> : null}
    </Card>
  );
}
