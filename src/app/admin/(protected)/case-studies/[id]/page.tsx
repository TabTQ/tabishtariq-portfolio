import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/api";
import { saveCaseStudyAction } from "@/app/admin/actions";
import { CASE_STUDY_FIELDS } from "@/app/admin/resources";
import { AdminForm } from "@/components/admin/AdminForm";
import { Card } from "@/components/ui/Card";

export default async function AdminCaseStudyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projects = await getProjects("flagship");
  const project = projects.find((p) => String(p.id) === id);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/admin/case-studies" className="text-xs text-text-muted hover:text-text">
        ← Case studies
      </Link>
      <h1 className="font-serif text-xl text-text">Case study — {project.title}</h1>
      <Card>
        <AdminForm
          fields={CASE_STUDY_FIELDS}
          values={(project.caseStudy ?? {}) as unknown as Record<string, unknown>}
          action={saveCaseStudyAction.bind(null, project.id)}
        />
      </Card>
    </div>
  );
}
