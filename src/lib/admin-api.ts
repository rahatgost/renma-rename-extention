// Public API endpoints on the Renma admin panel project.
// Data flows one-way: this landing site POSTs, admin project stores + displays.
const ADMIN_BASE =
  (import.meta.env.VITE_ADMIN_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://project--d9993ab7-e2e8-47f1-aa73-dc701833f07e.lovable.app";

export const TRACK_URL = `${ADMIN_BASE}/api/public/track`;
export const REPORT_URL = `${ADMIN_BASE}/api/public/report`;

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem("renma_sid");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("renma_sid", id);
    }
    return id;
  } catch {
    return "";
  }
}

export function trackEvent(
  event_type: "pageview" | "cta_click",
  extras: { event_label?: string } = {},
): void {
  if (typeof window === "undefined") return;
  const payload = {
    event_type,
    path: window.location.pathname,
    referrer: document.referrer || null,
    session_id: getSessionId(),
    ...extras,
  };
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    if (navigator.sendBeacon?.(TRACK_URL, blob)) return;
  } catch {}
  fetch(TRACK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
    mode: "cors",
  }).catch(() => {});
}

const CATEGORY_MAP: Record<string, "bug" | "feature" | "question" | "other"> = {
  Bug: "bug",
  "Feature request": "feature",
  "Rename didn't work": "bug",
  "UI issue": "bug",
  Other: "other",
};

const SEVERITY_MAP: Record<string, "low" | "medium" | "high"> = {
  Low: "low",
  Medium: "medium",
  High: "high",
  Blocking: "high",
};

export async function submitReport(data: {
  name?: string;
  email?: string;
  category: string;
  severity: string;
  description: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(REPORT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: (data.name && data.name.trim()) || "Anonymous",
        email: (data.email && data.email.trim()) || undefined,
        description: data.description,
        category: CATEGORY_MAP[data.category] ?? "other",
        severity: SEVERITY_MAP[data.severity] ?? "medium",
        path: typeof window !== "undefined" ? window.location.pathname : null,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      }),
    });
    if (!res.ok) {
      let msg = `Server error (${res.status})`;
      try {
        const j = await res.json();
        if (j?.error) msg = j.error;
      } catch {}
      return { ok: false, error: msg };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}
