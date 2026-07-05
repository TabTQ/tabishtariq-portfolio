import Link from "next/link";
import { deleteResourceAction } from "@/app/admin/actions";
import type { ResourceConfig } from "@/app/admin/resources";

export function AdminTable({
  resource,
  rows,
}: {
  resource: ResourceConfig;
  rows: Record<string, unknown>[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-soft">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-2 text-xs text-text-faint">
          <tr>
            {resource.listColumns.map((c) => (
              <th key={c.field} className="px-3 py-2 font-medium">
                {c.header}
              </th>
            ))}
            <th className="px-3 py-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-soft">
          {rows.map((row) => (
            <tr key={String(row.id)} className="hover:bg-surface-2/50">
              {resource.listColumns.map((c) => (
                <td key={c.field} className="max-w-64 truncate px-3 py-2 text-text-muted">
                  {String(row[c.field] ?? "")}
                </td>
              ))}
              <td className="whitespace-nowrap px-3 py-2">
                <Link
                  href={`/admin/${resource.key}/${row.id}`}
                  className="text-xs text-accent hover:underline"
                >
                  Edit
                </Link>
                <form
                  action={deleteResourceAction.bind(null, resource.key, JSON.stringify(row))}
                  className="ml-3 inline"
                >
                  <button type="submit" className="text-xs text-danger hover:underline">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={resource.listColumns.length + 1}
                className="px-3 py-6 text-center text-xs text-text-faint"
              >
                No entries yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
