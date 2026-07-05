import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { getAdminUser } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
        <Link href="/admin" className="text-sm font-medium text-text">
          Admin <span className="text-text-faint">· signed in as {user}</span>
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-text-muted hover:text-text">
            Sign out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
