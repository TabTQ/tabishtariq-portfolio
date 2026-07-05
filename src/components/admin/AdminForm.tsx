import type { FieldSpec } from "@/app/admin/resources";

function fieldValue(field: FieldSpec, values: Record<string, unknown>): string {
  const v = values[field.name];
  if (v === null || v === undefined) return "";
  switch (field.type) {
    case "lines":
      return Array.isArray(v) ? v.join("\n") : String(v);
    case "json":
      return JSON.stringify(v, null, 2);
    default:
      return String(v);
  }
}

const inputCls =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-accent/60";

export function AdminForm({
  fields,
  values = {},
  action,
  submitLabel = "Save",
}: {
  fields: FieldSpec[];
  values?: Record<string, unknown>;
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="space-y-4">
      {fields.map((f) => {
        const value = fieldValue(f, values);
        return (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1 block text-xs font-medium text-text-muted">
              {f.label}
              {f.required ? <span className="text-accent"> *</span> : null}
            </label>
            {f.type === "textarea" || f.type === "lines" ? (
              <textarea
                id={f.name}
                name={f.name}
                defaultValue={value}
                rows={f.type === "lines" ? Math.max(3, value.split("\n").length + 1) : 4}
                required={f.required}
                className={inputCls}
              />
            ) : f.type === "json" ? (
              <textarea
                id={f.name}
                name={f.name}
                defaultValue={value}
                rows={Math.min(18, Math.max(4, value.split("\n").length + 1))}
                required={f.required}
                spellCheck={false}
                className={`${inputCls} font-mono text-[12px]`}
              />
            ) : f.type === "select" ? (
              <select
                id={f.name}
                name={f.name}
                defaultValue={value}
                required={f.required}
                className={inputCls}
              >
                {!f.required ? <option value="">—</option> : null}
                {(f.options ?? []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={f.name}
                name={f.name}
                type={f.type === "number" ? "number" : "text"}
                defaultValue={value}
                required={f.required}
                className={inputCls}
              />
            )}
            {f.help ? <p className="mt-1 text-[11px] text-text-faint">{f.help}</p> : null}
          </div>
        );
      })}
      <button
        type="submit"
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg-2 transition-opacity hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}
