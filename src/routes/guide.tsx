import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  MousePointer2,
  Sparkles,
  FileType2,
  Globe2,
  Copy,
  BarChart3,
  Download,
  Settings2,
} from "lucide-react";
import renmaLogo from "@/assets/renma-logo.png";
import shotBehavior from "@/assets/guide/behavior.png";
import shotTemplate from "@/assets/guide/template.png";
import shotMappings from "@/assets/guide/mappings.png";
import shotScope from "@/assets/guide/scope.png";
import shotDuplicates from "@/assets/guide/duplicates.png";
import shotStats from "@/assets/guide/stats.png";
import shotBackup from "@/assets/guide/backup.png";
import shotPopup from "@/assets/guide/popup.png";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Renma — User Manual & Settings Guide" },
      {
        name: "description",
        content:
          "Visual, sketch-style walkthrough of every Renma setting — templates, domain rules, site scope, duplicates, stats and backup. Screenshots included.",
      },
      { property: "og:title", content: "Renma — User Manual" },
      {
        property: "og:description",
        content:
          "Learn every Renma setting in a scannable, sketch-style guide with real screenshots and annotations.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Renma — User Manual" },
      {
        name: "twitter:description",
        content: "Every Renma setting, annotated. Sketch guide + screenshots.",
      },
    ],
  }),
  component: GuidePage,
});

/* ---------- Sketch primitives (hand-drawn SVG) ---------- */

function ScribbleUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 12"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    >
      <path d="M4 7 C 40 2, 80 11, 120 5 S 200 10, 236 4" />
    </svg>
  );
}

function ArrowCurve({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M8 8 C 30 30, 70 20, 100 55" strokeDasharray="1 5" />
      <path d="M100 55 L 90 46 M100 55 L 92 62" />
    </svg>
  );
}

function CircleMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 32 C 12 8, 188 6, 190 30 C 192 54, 22 58, 10 34 Z" />
    </svg>
  );
}

function Star({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M12 3 L12 21 M3 12 L21 12 M6 6 L18 18 M18 6 L6 18" />
    </svg>
  );
}

/* ---------- Annotated screenshot card ---------- */

type Note = {
  x: number; // 0-100 %
  y: number;
  label: string;
  side?: "left" | "right";
};

function AnnotatedShot({
  src,
  alt,
  notes = [],
}: {
  src: string;
  alt: string;
  notes?: Note[];
}) {
  return (
    <div className="relative rounded-[24px] border border-[color:var(--hairline)] bg-[color:var(--surface-soft)] p-4 sm:p-6 shadow-[0_20px_60px_-30px_rgba(20,20,19,0.25)]">
      <div className="relative overflow-hidden rounded-[16px] border border-[color:var(--hairline)] bg-[color:var(--canvas)]">
        <img src={src} alt={alt} className="block w-full h-auto" />
        {notes.map((n, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%,-50%)" }}
          >
            <div className="relative">
              <div className="h-6 w-6 rounded-full border-2 border-[color:var(--coral)] bg-[color:var(--canvas)] grid place-items-center text-[11px] font-bold text-[color:var(--coral)] shadow-md">
                {i + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
      {notes.length > 0 && (
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {notes.map((n, i) => (
            <li key={i} className="flex gap-2 text-[13.5px] leading-snug text-[color:var(--body)]">
              <span className="mt-[2px] inline-grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color:var(--coral)] text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span>{n.label}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* ---------- Step block ---------- */

function Step({
  num,
  icon: Icon,
  title,
  kicker,
  children,
  shot,
}: {
  num: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  kicker: string;
  children: React.ReactNode;
  shot: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 items-start"
    >
      <div className="lg:sticky lg:top-28">
        <div className="flex items-center gap-3 text-[color:var(--muted)]">
          <span className="font-mono text-[12px] tracking-widest uppercase">
            Step {num}
          </span>
          <span className="h-px flex-1 bg-[color:var(--hairline)]" />
        </div>
        <div className="mt-4 flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[color:var(--coral)] text-white shadow-[0_10px_30px_-10px_rgba(204,120,92,0.6)]">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--coral)]">
              {kicker}
            </p>
            <h2 className="mt-1 font-[Fraunces] italic text-[34px] sm:text-[42px] leading-[1.05] text-[color:var(--ink)]">
              {title}
            </h2>
          </div>
        </div>
        <div className="mt-5 text-[15.5px] leading-[1.7] text-[color:var(--body)] space-y-3">
          {children}
        </div>
      </div>
      <div className="relative">{shot}</div>
    </motion.section>
  );
}

/* ---------- Page ---------- */

function GuidePage() {
  return (
    <div className="min-h-screen bg-[color:var(--canvas)] text-[color:var(--ink)]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--canvas)]/85 border-b border-[color:var(--hairline)]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <img src={renmaLogo} alt="" className="h-7 w-7 rounded-md" />
            <span className="font-[Fraunces] italic text-[22px] leading-none">
              renma<span className="text-[color:var(--coral)]">.</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-soft)] px-4 py-2 text-[13px] font-medium text-[color:var(--body)] hover:bg-[color:var(--surface-card)] transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-end">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-soft)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--muted)]">
                <Sparkles className="h-3.5 w-3.5 text-[color:var(--coral)]" />
                User manual · v1.3
              </div>
              <h1 className="mt-6 font-[Fraunces] italic text-[52px] sm:text-[76px] leading-[0.98] tracking-[-0.02em]">
                Every setting,
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10">sketched out</span>
                  <ScribbleUnderline className="absolute left-0 right-0 -bottom-3 w-full text-[color:var(--coral)]" />
                </span>
                .
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-[1.65] text-[color:var(--body)]">
                A hand-drawn walkthrough of the Renma options page. Real
                screenshots, circled controls, and one paragraph per setting —
                so you can wire it up in under two minutes.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#step-1"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-5 py-3 text-[14px] font-medium text-[color:var(--canvas)] hover:bg-black transition"
                >
                  Start the walkthrough <MousePointer2 className="h-4 w-4" />
                </a>
                <a
                  href="#toc"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-soft)] px-5 py-3 text-[14px] font-medium text-[color:var(--body)] hover:bg-[color:var(--surface-card)] transition"
                >
                  Jump to a section
                </a>
              </div>
            </div>

            {/* Sketch diagram */}
            <div className="relative">
              <div className="relative rounded-[28px] border border-[color:var(--hairline)] bg-[color:var(--surface-soft)] p-6 sm:p-8 aspect-[4/3] overflow-hidden">
                <Star className="absolute top-4 right-6 h-5 w-5 text-[color:var(--coral)] opacity-70" />
                <Star className="absolute bottom-6 left-6 h-4 w-4 text-[color:var(--muted)] opacity-60" />

                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-4 p-6 sm:p-8">
                  <div className="col-span-1 row-span-1 rounded-2xl border border-dashed border-[color:var(--muted-soft)] bg-[color:var(--canvas)] grid place-items-center">
                    <span className="font-mono text-[10px] text-[color:var(--muted)]">TOGGLE</span>
                  </div>
                  <div className="col-span-2 row-span-1 rounded-2xl border-2 border-[color:var(--ink)] bg-[color:var(--canvas)] p-3 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[color:var(--body)]">
                      {"{prefix}_{timestamp}.{ext}"}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[color:var(--coral)]" />
                  </div>
                  <div className="col-span-1 row-span-2 rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface-card)] p-3 flex flex-col justify-between">
                    <span className="font-mono text-[10px] text-[color:var(--muted)]">RULES</span>
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full rounded-full bg-[color:var(--coral)]" />
                      <div className="h-1.5 w-3/4 rounded-full bg-[color:var(--coral)]/70" />
                      <div className="h-1.5 w-1/2 rounded-full bg-[color:var(--coral)]/40" />
                    </div>
                  </div>
                  <div className="col-span-2 row-span-2 rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--canvas)] p-4 relative">
                    <span className="font-mono text-[10px] text-[color:var(--muted)]">STATS</span>
                    <div className="mt-2 flex items-end gap-2 h-full pb-4">
                      {[35, 60, 45, 82, 55, 70, 40].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-md bg-[color:var(--coral)]/70"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <ArrowCurve className="absolute -top-6 -left-8 h-16 w-24 text-[color:var(--ink)] hidden sm:block" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 rotate-[6deg] rounded-xl bg-[color:var(--ink)] px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[color:var(--canvas)] shadow-lg">
                you'll build this ↑
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOC */}
      <section id="toc" className="border-y border-[color:var(--hairline)] bg-[color:var(--surface-soft)]/50">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
          <div className="flex items-baseline justify-between gap-4 mb-5">
            <h2 className="font-[Fraunces] italic text-[26px]">Table of contents</h2>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--muted)]">
              7 sections · ~2 min read
            </span>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Open the options page", "step-1"],
              ["Behavior toggles", "step-2"],
              ["Filename template", "step-3"],
              ["Domain rules", "step-4"],
              ["Site scope", "step-5"],
              ["Duplicates & stats", "step-6"],
              ["Backup & restore", "step-7"],
            ].map(([label, id], i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="group flex items-center gap-3 rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--canvas)] px-4 py-3 hover:border-[color:var(--coral)] transition"
                >
                  <span className="font-mono text-[12px] text-[color:var(--muted)] w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[14.5px] font-medium text-[color:var(--ink)] flex-1">
                    {label}
                  </span>
                  <MousePointer2 className="h-3.5 w-3.5 text-[color:var(--muted)] group-hover:text-[color:var(--coral)] transition" />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Steps */}
      <main className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28 space-y-28">
        <div id="step-1" />
        <Step
          num="01"
          kicker="Open"
          icon={Settings2}
          title="Find the settings page"
          shot={
            <div className="relative rounded-[24px] border border-[color:var(--hairline)] bg-[color:var(--ink)] p-6 sm:p-10 text-[color:var(--canvas)]">
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/60 mb-4">
                chrome://extensions
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <img src={renmaLogo} alt="" className="h-8 w-8 rounded-md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-[Fraunces] italic text-[18px]">renma.</p>
                    <p className="text-[12px] text-white/50">v1.3 · enabled</p>
                  </div>
                  <button className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider">
                    Details
                  </button>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-[color:var(--coral)] bg-[color:var(--coral)]/10 p-3">
                  <div className="h-8 w-8 rounded-md bg-[color:var(--coral)] grid place-items-center">
                    <Settings2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[13px] flex-1">Extension options</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--coral)]">
                    click →
                  </span>
                </div>
              </div>
              <p className="mt-5 text-[12px] text-white/50 leading-relaxed">
                Or right-click the Renma toolbar icon → <b>Options</b>.
              </p>
            </div>
          }
        >
          <p>
            Renma stores every setting locally in Chrome. To reach the panel,
            go to <code className="rounded bg-[color:var(--surface-card)] px-1.5 py-0.5 font-mono text-[13px]">chrome://extensions</code>,
            click <b>Details</b> on Renma, then <b>Extension options</b>.
          </p>
          <p className="text-[color:var(--muted)]">
            Shortcut: right-click the toolbar icon and pick <i>Options</i>.
          </p>
        </Step>

        <div id="step-2" />
        <Step
          num="02"
          kicker="Behavior"
          icon={MousePointer2}
          title="Flip the master switches"
          shot={
            <AnnotatedShot
              src={shotBehavior}
              alt="Behavior settings"
              notes={[
                { x: 82, y: 32, label: "Master on/off — pause Renma without uninstalling." },
                { x: 82, y: 55, label: "Only images — skip PDFs, ZIPs and other file types." },
                { x: 82, y: 78, label: "Notifications — desktop toast on every rename." },
              ]}
            />
          }
        >
          <p>
            Three switches govern the whole extension. The <b>master toggle</b>{" "}
            pauses renaming globally — useful when you're doing a bulk
            download and want the original names.
          </p>
          <p>
            <b>Only images</b> restricts Renma to actual image MIME types.{" "}
            <b>Notifications</b> shows a small desktop toast so you can spot
            what got renamed to what.
          </p>
        </Step>

        <div id="step-3" />
        <Step
          num="03"
          kicker="Template"
          icon={FileType2}
          title="Design the filename"
          shot={
            <AnnotatedShot
              src={shotTemplate}
              alt="Template editor"
              notes={[
                { x: 50, y: 30, label: "Template input — mix any tokens with underscores, dashes, dots." },
                { x: 50, y: 70, label: "Live preview — what a real Unsplash download would look like." },
              ]}
            />
          }
        >
          <p>
            The template controls every renamed file. Click any token chip to
            insert it at your cursor — common combos:
          </p>
          <ul className="space-y-1.5 font-mono text-[13px] text-[color:var(--ink)]">
            <li>· {"{prefix}_{timestamp}.{ext}"}</li>
            <li>· {"{prefix}-{date}-{counter}.{ext}"}</li>
            <li>· {"{prefix}_{dimensions}.{ext}"}</li>
          </ul>
        </Step>

        <div id="step-4" />
        <Step
          num="04"
          kicker="Rules"
          icon={Globe2}
          title="Teach it your domains"
          shot={
            <AnnotatedShot
              src={shotMappings}
              alt="Domain rules"
              notes={[
                { x: 20, y: 62, label: "Domain — match on any part of the URL host." },
                { x: 50, y: 62, label: "Prefix — becomes {prefix} in the template." },
                { x: 80, y: 62, label: "Folder — optional subfolder inside Downloads/." },
              ]}
            />
          }
        >
          <p>
            Renma ships with sensible defaults (OpenAI → <code>AI_Generated</code>,
            etc.). Add your own to route specific sites into named prefixes and
            folders.
          </p>
          <p className="text-[color:var(--muted)]">
            Example: <code className="font-mono text-[13px]">dribbble.com → Dribbble → refs/ui</code>.
          </p>
        </Step>

        <div id="step-5" />
        <Step
          num="05"
          kicker="Scope"
          icon={Sparkles}
          title="Pick where Renma runs"
          shot={
            <AnnotatedShot
              src={shotScope}
              alt="Site scope"
              notes={[
                { x: 50, y: 22, label: "Mode: run everywhere, only listed sites, or exclude listed sites." },
                { x: 50, y: 65, label: "Site list — one domain per chip." },
              ]}
            />
          }
        >
          <p>
            Use <b>Whitelist</b> when you only want Renma on a handful of
            sources. Use <b>Blacklist</b> to keep your bank's downloads
            untouched. <b>All sites</b> is the default and works for most
            people.
          </p>
        </Step>

        <div id="step-6" />
        <Step
          num="06"
          kicker="Insights"
          icon={BarChart3}
          title="Duplicates & stats"
          shot={
            <div className="grid gap-5">
              <AnnotatedShot
                src={shotDuplicates}
                alt="Duplicate mode"
                notes={[
                  { x: 50, y: 55, label: "Off / Tag / Skip — how to treat the same URL twice." },
                ]}
              />
              <AnnotatedShot
                src={shotStats}
                alt="Stats dashboard"
                notes={[
                  { x: 50, y: 30, label: "Totals: lifetime, today, unique sources." },
                  { x: 50, y: 75, label: "Top-domain bars — see where your images come from." },
                ]}
              />
            </div>
          }
        >
          <p>
            <b>Tag</b> keeps duplicate downloads but marks them in the popup so
            you can spot repeats. <b>Skip</b> refuses to re-download the same
            URL entirely.
          </p>
          <p>
            The stats panel is fully local — nothing leaves your machine. Hit{" "}
            <b>Reset</b> to zero it any time.
          </p>
        </Step>

        <div id="step-7" />
        <Step
          num="07"
          kicker="Portable"
          icon={Copy}
          title="Backup & restore"
          shot={
            <AnnotatedShot
              src={shotBackup}
              alt="Backup panel"
              notes={[
                { x: 30, y: 60, label: "Export — download your full config as JSON." },
                { x: 70, y: 60, label: "Import — drop the same JSON on a new machine." },
              ]}
            />
          }
        >
          <p>
            Moving to a new laptop? Export once, import on the other side.
            Templates, rules, scope, duplicate mode and toggles all travel
            together.
          </p>
        </Step>

        {/* Popup bonus */}
        <section className="rounded-[28px] border border-[color:var(--hairline)] bg-[color:var(--surface-soft)] p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--coral)]">
                Bonus
              </p>
              <h2 className="mt-2 font-[Fraunces] italic text-[38px] leading-[1.05]">
                The toolbar popup
              </h2>
              <p className="mt-4 text-[15.5px] leading-[1.7] text-[color:var(--body)]">
                Click the Renma icon in your Chrome toolbar to see the last 50
                renames, search them, export as JSON, or hit <b>Undo</b> to
                revert the most recent one.
              </p>
              <div className="mt-5 grid gap-2 text-[13.5px] text-[color:var(--body)]">
                {[
                  ["Alt+Shift+P", "open popup"],
                  ["Alt+Shift+R", "toggle renaming on/off"],
                  ["Alt+Shift+Z", "undo last rename"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center gap-3">
                    <kbd className="rounded-md border border-[color:var(--hairline)] bg-[color:var(--canvas)] px-2 py-1 font-mono text-[12px] text-[color:var(--ink)]">
                      {k}
                    </kbd>
                    <span className="text-[color:var(--muted)]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[20px] border border-[color:var(--hairline)] bg-[color:var(--canvas)] p-4 shadow-[0_20px_60px_-30px_rgba(20,20,19,0.3)]">
              <img src={shotPopup} alt="Renma popup" className="w-full h-auto rounded-[12px]" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="font-[Fraunces] italic text-[42px] sm:text-[56px] leading-[1.02]">
            That's the whole thing.
          </h2>
          <p className="mt-4 text-[16px] text-[color:var(--muted)]">
            Install Renma and every image download from here on out lands with
            a proper name.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--coral)] px-6 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--coral-active)] transition"
            >
              <Download className="h-4 w-4" /> Get Renma
            </Link>
            <a
              href="#toc"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-soft)] px-6 py-3 text-[14px] font-medium text-[color:var(--body)] hover:bg-[color:var(--surface-card)] transition"
            >
              Back to top
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
