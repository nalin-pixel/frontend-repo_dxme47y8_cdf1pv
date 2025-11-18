const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export async function uploadMedia(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE_URL}/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createJob(media_id, params = {}) {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ media_id, params }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getJob(job_id) {
  const res = await fetch(`${BASE_URL}/jobs/${job_id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getPresets() {
  const res = await fetch(`${BASE_URL}/presets`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getMotionTemplates() {
  const res = await fetch(`${BASE_URL}/motion-templates`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function sendChat(job_id, message) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_id, message }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getChat(job_id) {
  const res = await fetch(`${BASE_URL}/chat/${job_id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function downloadUrl(path) {
  if (!path) return null;
  // If API returned absolute path keep, else prefix with backend base
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}

export { BASE_URL };
