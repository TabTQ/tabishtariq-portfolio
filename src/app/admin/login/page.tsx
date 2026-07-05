import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import { getAdminUser } from "@/lib/admin";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getAdminUser();
  if (user) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm py-16">
      <Card>
        <h1 className="font-serif text-xl text-text">Admin login</h1>
        {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
        <form action={loginAction} className="mt-4 space-y-3">
          <input
            name="username"
            placeholder="Username"
            required
            autoComplete="username"
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-accent/60"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-accent/60"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg-2 transition-opacity hover:opacity-90"
          >
            Sign in
          </button>
        </form>
      </Card>
    </div>
  );
}
