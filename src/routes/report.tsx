import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bug, Check, Loader2 } from "lucide-react";
import { submitReport } from "@/lib/admin-api";
import renmaLogo from "@/assets/renma-logo.png";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an issue — Renma" },
      {
        name: "description",
        content:
          "Found a bug or have a feature request for Renma? Send it straight to the maintainers — no account required.",
      },
      { property: "og:title", content: "Report an issue — Renma" },
      {
        property: "og:description",
        content: "Send bug reports and feature requests to the Renma team.",
      },
      { property: "og:url", content: "https://renma.flinkeo.online/report" },
    ],
    links: [{ rel: "canonical", href: "https://renma.flinkeo.online/report" }],
  }),
  component: ReportPage,
});

const CATEGORIES = ["Bug", "Feature request", "Rename didn't work", "UI issue", "Other"];
const SEVERITIES = ["Low", "Medium", "High", "Blocking"];

function ReportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "Bug",
    severity: "Medium",
    description: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.description.trim().length < 10) {
      setError("Please describe the issue in at least 10 characters.");
      return;
    }
    setError(null);
    setStatus("sending");
    const res = await submitReport(form);
    if (res.ok) {
      setStatus("done");
      setForm({ name: "", email: "", category: "Bug", severity: "Medium", description: "" });
    } else {
      setStatus("error");
      setError(res.error || "Failed to send report.");
    }
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="max-w-3xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={renmaLogo} alt="Renma" className="h-8 w-8" />
          <span className="font-serif italic text-2xl">
            renma<span className="text-coral">.</span>
          </span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-6 pb-24">
        <div className="pt-8 pb-10 sm:pb-12 border-b border-ink/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 text-coral text-xs uppercase tracking-wider mb-6">
            <Bug className="w-3.5 h-3.5" /> Report an issue
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
            Something off? <br />
            <span className="italic text-coral">Tell us.</span>
          </h1>
          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-ink/70 max-w-xl">
            Bugs, feature ideas, weird filenames — anything. Reports go straight to the
            maintainers. No account needed.
          </p>
        </div>


        {status === "done" ? (
          <div className="mt-12 rounded-2xl border border-ink/10 bg-white p-10 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-coral/10 flex items-center justify-center">
              <Check className="w-7 h-7 text-coral" />
            </div>
            <h2 className="mt-6 font-serif text-3xl">Thanks — report received.</h2>
            <p className="mt-3 text-ink/70">
              We read every one. If you left an email, we'll follow up when it's addressed.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-canvas text-sm hover:bg-ink/90 transition-colors"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 sm:mt-12 space-y-6">
            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">

              <Field label="Your name" hint="Optional">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={80}
                  className="input"
                  placeholder="Jane Doe"
                />
              </Field>
              <Field label="Email" hint="Optional — for follow-up">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={200}
                  className="input"
                  placeholder="you@domain.com"
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Severity">
                <div className="flex gap-2 flex-wrap">
                  {SEVERITIES.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setForm({ ...form, severity: s })}
                      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                        form.severity === s
                          ? "bg-ink text-canvas border-ink"
                          : "bg-white border-ink/15 text-ink/70 hover:border-ink/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="What happened?" hint="Steps, expected vs actual, sample filename">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                maxLength={4000}
                rows={8}
                className="input resize-y"
                placeholder="I downloaded an image from example.com and the filename became…"
              />
              <div className="mt-1 text-xs text-ink/50 text-right">
                {form.description.length}/4000
              </div>
            </Field>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <p className="text-xs text-ink/50 sm:max-w-sm">
                We never store what you download. This form only sends what you type here.
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-coral text-white text-sm font-medium hover:bg-coral/90 disabled:opacity-60 transition-colors"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                  </>
                ) : (
                  "Send report"
                )}
              </button>
            </div>

          </form>
        )}
      </main>

      <style>{`
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: white;
          border: 1px solid rgb(from var(--color-ink, #1a1a1a) r g b / 0.15);
          color: var(--color-ink, #1a1a1a);
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: var(--color-coral, #ff5a3c); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-medium text-ink">{label}</span>
        {hint && <span className="text-xs text-ink/50">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
