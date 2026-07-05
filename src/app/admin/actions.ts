"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminFetch, backendLogin } from "@/lib/admin";
import {
  CASE_STUDY_FIELDS,
  DIAGRAM_FIELDS,
  PROFILE_FIELDS,
  getResource,
  type FieldSpec,
} from "@/app/admin/resources";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const token = await backendLogin(username, password);
  if (!token) redirect("/admin/login?error=Invalid+credentials");
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

function buildPayload(fields: FieldSpec[], formData: FormData): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = String(formData.get(f.name) ?? "").trim();
    switch (f.type) {
      case "number":
        payload[f.name] = raw ? Number(raw) : 0;
        break;
      case "lines":
        payload[f.name] = raw ? raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : [];
        break;
      case "json":
        if (raw) {
          try {
            payload[f.name] = JSON.parse(raw);
          } catch {
            throw new Error(`Field "${f.label}" contains invalid JSON`);
          }
        }
        // empty json input → omit so the backend default applies
        break;
      default:
        payload[f.name] = raw === "" && !f.required ? null : raw;
    }
  }
  return payload;
}

async function submit(path: string, method: "POST" | "PUT" | "DELETE", body?: unknown) {
  const res = await adminFetch(path, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const data = (await res.json()) as { detail?: unknown };
      if (data.detail) detail = JSON.stringify(data.detail);
    } catch {
      /* keep status text */
    }
    return detail;
  }
  return null;
}

export async function saveResourceAction(
  resourceKey: string,
  rowJson: string | null,
  formData: FormData,
) {
  const resource = getResource(resourceKey);
  if (!resource) throw new Error(`Unknown resource ${resourceKey}`);
  const existing = rowJson ? (JSON.parse(rowJson) as Record<string, unknown>) : null;
  const payload = buildPayload(resource.fields, formData);
  const error = existing
    ? await submit(resource.updatePath({ ...existing, ...payload }), "PUT", payload)
    : await submit(resource.createPath(payload), "POST", payload);
  if (error) redirect(`/admin/${resourceKey}?error=${encodeURIComponent(error)}`);
  redirect(`/admin/${resourceKey}`);
}

export async function deleteResourceAction(resourceKey: string, rowJson: string) {
  const resource = getResource(resourceKey);
  if (!resource) throw new Error(`Unknown resource ${resourceKey}`);
  const row = JSON.parse(rowJson) as Record<string, unknown>;
  const error = await submit(resource.deletePath(row), "DELETE");
  if (error) redirect(`/admin/${resourceKey}?error=${encodeURIComponent(error)}`);
  redirect(`/admin/${resourceKey}`);
}

export async function saveProfileAction(formData: FormData) {
  const payload = buildPayload(PROFILE_FIELDS, formData);
  // required strings can't be null
  for (const k of ["tagline", "location", "email", "phone", "brand", "status", "summary"]) {
    if (payload[k] === null) payload[k] = "";
  }
  const error = await submit("/api/admin/profile", "PUT", payload);
  if (error) redirect(`/admin/profile?error=${encodeURIComponent(error)}`);
  redirect("/admin/profile?saved=1");
}

export async function saveDiagramAction(key: string, formData: FormData) {
  const payload = buildPayload(DIAGRAM_FIELDS, formData);
  payload.diagramKey = key;
  payload.nodes ??= [];
  payload.edges ??= [];
  const error = await submit(`/api/admin/diagrams/${encodeURIComponent(key)}`, "PUT", payload);
  if (error) redirect(`/admin/diagrams?error=${encodeURIComponent(error)}`);
  redirect("/admin/diagrams");
}

export async function saveCaseStudyAction(projectId: number, formData: FormData) {
  const payload = buildPayload(CASE_STUDY_FIELDS, formData);
  payload.metrics ??= [];
  payload.layers ??= [];
  payload.techStack ??= [];
  const error = await submit(`/api/admin/projects/${projectId}/case-study`, "PUT", payload);
  if (error) redirect(`/admin/case-studies?error=${encodeURIComponent(error)}`);
  redirect("/admin/case-studies");
}
