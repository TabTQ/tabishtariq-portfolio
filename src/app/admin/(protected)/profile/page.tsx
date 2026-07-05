import Link from "next/link";
import { getProfile } from "@/lib/api";
import { saveProfileAction } from "@/app/admin/actions";
import { PROFILE_FIELDS } from "@/app/admin/resources";
import { AdminForm } from "@/components/admin/AdminForm";
import { Card } from "@/components/ui/Card";

export default async function AdminProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const [profile, { error, saved }] = await Promise.all([getProfile(), searchParams]);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href="/admin" className="text-xs text-text-muted hover:text-text">
        ← Admin
      </Link>
      <h1 className="font-serif text-xl text-text">Profile</h1>
      {error ? <Card className="border-danger/50 text-sm text-danger">{error}</Card> : null}
      {saved ? <Card className="border-sage/50 text-sm text-sage">Saved.</Card> : null}
      <Card>
        <AdminForm
          fields={PROFILE_FIELDS}
          values={profile as unknown as Record<string, unknown>}
          action={saveProfileAction}
        />
      </Card>
    </div>
  );
}
