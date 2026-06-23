export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-border-soft pb-6">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h1 className="font-serif text-3xl text-text sm:text-4xl">{title}</h1>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-text-muted">
          {description}
        </p>
      ) : null}
      {children}
    </header>
  );
}

export function SectionHeading({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="font-serif text-xl text-text">{title}</h2>
      {hint ? <span className="text-xs text-text-faint">{hint}</span> : null}
    </div>
  );
}
