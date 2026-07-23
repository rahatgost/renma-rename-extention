import { motion } from "motion/react";
import {
  MousePointer2,
  Sparkles,
  FileType2,
  Globe2,
  Copy,
  BarChart3,
  Settings2,
  ArrowRight,
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

/* ───────────────────── Hand-drawn primitives ───────────────────── */

function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 12" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M4 7 C 40 2, 80 11, 120 5 S 200 10, 236 4" />
    </svg>
  );
}

function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 L12 21 M3 12 L21 12 M6 6 L18 18 M18 6 L6 18" />
    </svg>
  );
}

/** Curved hand-drawn arrow from (x1,y1) → (x2,y2) in % of container */
function Arrow({
  from,
  to,
  bend = 40,
  className = "text-[color:var(--ink)]",
}: {
  from: [number, number];
  to: [number, number];
  bend?: number;
  className?: string;
}) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - bend;
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <marker id="ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
        </marker>
      </defs>
      <path
        d={`M ${x1} ${y1} Q ${mx} ${my}, ${x2} ${y2}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeDasharray="0.8 1.2"
        vectorEffect="non-scaling-stroke"
        markerEnd="url(#ah)"
        style={{ strokeWidth: 1.4 } as React.CSSProperties}
      />
    </svg>
  );
}

/* ───────────────────── Annotated screenshot w/ margin notes ───────────────────── */

type Callout = {
  /** dot position on the screenshot, in % */
  pin: [number, number];
  /** note anchor, in % of the outer frame */
  note: [number, number];
  /** which side the note sits: 'l' | 'r' */
  side: "l" | "r";
  title: string;
  body: string;
  bend?: number;
};

function SketchShot({
  src,
  alt,
  callouts,
  aspect = "auto",
}: {
  src: string;
  alt: string;
  callouts: Callout[];
  aspect?: string;
}) {
  return (
    <div className="relative">
      {/* paper frame w/ tape */}
      <div className="relative rounded-[22px] border border-[color:var(--hairline)] bg-[color:var(--canvas)] p-3 sm:p-4 shadow-[0_30px_80px_-40px_rgba(20,20,19,0.35)]">
        <span className="absolute -top-3 left-10 h-6 w-20 rotate-[-4deg] rounded-[2px] bg-[color:var(--coral)]/25 border border-[color:var(--coral)]/40" />
        <span className="absolute -top-3 right-14 h-6 w-16 rotate-[3deg] rounded-[2px] bg-[color:var(--accent-amber,#e8a55a)]/25 border border-[color:var(--accent-amber,#e8a55a)]/40" />

        <div className="relative overflow-hidden rounded-[14px] border border-[color:var(--hairline)] bg-white" style={{ aspectRatio: aspect === "auto" ? undefined : aspect }}>
          <img src={src} alt={alt} className="block w-full h-auto" />

          {/* pins */}
          {callouts.map((c, i) => (
            <div
              key={`pin-${i}`}
              className="absolute z-10"
              style={{ left: `${c.pin[0]}%`, top: `${c.pin[1]}%`, transform: "translate(-50%,-50%)" }}
            >
              <span className="absolute inset-0 -m-2 rounded-full bg-[color:var(--coral)]/20 animate-ping" />
              <span className="relative grid h-7 w-7 place-items-center rounded-full border-2 border-[color:var(--coral)] bg-[color:var(--canvas)] text-[12px] font-bold text-[color:var(--coral)] shadow-md">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* margin notes */}
      {callouts.map((c, i) => {
        const isLeft = c.side === "l";
        return (
          <div
            key={`note-${i}`}
            className="pointer-events-none absolute z-20 hidden md:block"
            style={{
              left: `${c.note[0]}%`,
              top: `${c.note[1]}%`,
              transform: `translate(${isLeft ? "-100%" : "0"}, -50%) rotate(${isLeft ? "-1.2deg" : "1deg"})`,
              maxWidth: "220px",
            }}
          >
            <div className="rounded-md border border-[color:var(--ink)]/15 bg-[color:var(--surface-soft)] px-3 py-2 shadow-[2px_3px_0_rgba(20,20,19,0.08)]">
              <div className="flex items-center gap-1.5">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-[color:var(--coral)] text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="font-[Fraunces] italic text-[15px] leading-none text-[color:var(--ink)]">{c.title}</p>
              </div>
              <p className="mt-1 text-[12.5px] leading-snug text-[color:var(--body)]">{c.body}</p>
            </div>
          </div>
        );
      })}

      {/* mobile note list */}
      <ol className="mt-4 grid gap-2 md:hidden">
        {callouts.map((c, i) => (
          <li key={`m-${i}`} className="flex gap-2 rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface-soft)] p-3">
            <span className="mt-[2px] inline-grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color:var(--coral)] text-[11px] font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-[Fraunces] italic text-[15px] text-[color:var(--ink)]">{c.title}</p>
              <p className="text-[13px] leading-snug text-[color:var(--body)]">{c.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────────────────── Real-usage demo strip ───────────────────── */

function BeforeAfter({
  before,
  after,
  note,
}: {
  before: string;
  after: string;
  note?: string;
}) {
  return (
    <div className="relative rounded-2xl border border-dashed border-[color:var(--ink)]/20 bg-[color:var(--canvas)] p-4 sm:p-5">
      <span className="absolute -top-3 left-4 rounded-full bg-[color:var(--surface-soft)] px-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted)]">
        real download
      </span>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 rounded-lg border border-[color:var(--hairline)] bg-white p-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--muted)]">Browser saved</p>
          <p className="mt-1 truncate font-mono text-[13px] text-[color:var(--body-strong,#252523)] line-through decoration-[color:var(--muted-soft)]/60">
            {before}
          </p>
        </div>
        <div className="grid place-items-center px-1 text-[color:var(--coral)]">
          <ArrowRight className="h-5 w-5 rotate-90 sm:rotate-0" />
        </div>
        <div className="flex-1 rounded-lg border border-[color:var(--coral)]/40 bg-[color:var(--coral)]/8 p-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--coral)]">Renma renamed</p>
          <p className="mt-1 truncate font-mono text-[13px] font-medium text-[color:var(--ink)]">{after}</p>
        </div>
      </div>
      {note && (
        <p className="mt-3 font-[Fraunces] italic text-[14px] text-[color:var(--muted)]">— {note}</p>
      )}
    </div>
  );
}

/* ───────────────────── Step ───────────────────── */

function Step({
  num,
  icon: Icon,
  title,
  kicker,
  children,
  shot,
  demo,
}: {
  num: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  kicker: string;
  children: React.ReactNode;
  shot: React.ReactNode;
  demo?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="relative grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] lg:gap-16 items-start"
    >
      <div className="lg:sticky lg:top-28">
        <div className="flex items-center gap-3 text-[color:var(--muted)]">
          <span className="font-mono text-[12px] tracking-widest uppercase">Step {num}</span>
          <span className="h-px flex-1 bg-[color:var(--hairline)]" />
        </div>
        <div className="mt-4 flex items-start gap-4">
          <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[color:var(--coral)] text-white shadow-[0_10px_30px_-10px_rgba(204,120,92,0.6)]">
            <Icon className="h-5 w-5" />
            <Star className="absolute -right-3 -top-3 h-4 w-4 text-[color:var(--ink)]" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--coral)]">{kicker}</p>
            <h3 className="mt-1 font-[Fraunces] italic text-[30px] sm:text-[38px] leading-[1.05] text-[color:var(--ink)]">
              {title}
            </h3>
          </div>
        </div>
        <div className="mt-5 text-[15.5px] leading-[1.7] text-[color:var(--body)] space-y-3">{children}</div>
        {demo && <div className="mt-6">{demo}</div>}
      </div>
      <div className="relative">{shot}</div>
    </motion.div>
  );
}

/* ───────────────────── Section ───────────────────── */

export default function GuideSection() {
  return (
    <section
      id="guide"
      className="relative py-24 md:py-36 border-t border-hairline overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(20,20,19,0.09) 1px, transparent 0)",
        backgroundSize: "22px 22px",
        backgroundColor: "var(--canvas)",
      }}
    >
      {/* corner doodles */}
      <Star className="absolute left-6 top-10 h-5 w-5 text-[color:var(--ink)]/30" />
      <Star className="absolute right-8 top-24 h-4 w-4 text-[color:var(--coral)]/50" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Section header */}
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--coral)]">
            The field notebook
          </p>
          <h2 className="mt-3 font-[Fraunces] italic text-[44px] sm:text-[64px] leading-[0.98] tracking-[-0.02em]">
            A hand-drawn tour of{" "}
            <span className="relative inline-block">
              <span className="relative z-10">every setting</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 h-3 -z-0 bg-[color:var(--coral)]/30 rotate-[-1deg]"
              />
              <Squiggle className="absolute left-0 right-0 -bottom-2 w-full text-[color:var(--coral)]" />
            </span>
            .
          </h2>
          <p className="mt-5 text-[16.5px] leading-[1.65] text-[color:var(--body)] max-w-xl">
            Real screenshots. Real downloads. Numbered pins, margin notes, and a
            before/after for each control — so you know exactly what changes.
          </p>
        </div>

        {/* TOC */}
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Open settings", "guide-1"],
            ["Behavior", "guide-2"],
            ["Template", "guide-3"],
            ["Domain rules", "guide-4"],
            ["Site scope", "guide-5"],
            ["Duplicates & stats", "guide-6"],
            ["Backup", "guide-7"],
            ["Popup", "guide-popup"],
          ].map(([label, id], i) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="group flex items-center gap-3 rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--canvas)] px-4 py-3 hover:border-[color:var(--coral)] transition"
              >
                <span className="font-mono text-[12px] text-[color:var(--muted)] w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px] font-medium text-[color:var(--ink)] flex-1">{label}</span>
              </a>
            </li>
          ))}
        </ol>

        {/* Steps */}
        <div className="mt-24 space-y-32">
          <div id="guide-1" />
          <Step
            num="01"
            kicker="Open"
            icon={Settings2}
            title="Find the settings page"
            shot={
              <div className="relative rounded-[22px] border border-[color:var(--hairline)] bg-[color:var(--ink)] p-6 sm:p-10 text-[color:var(--canvas)]">
                <span className="absolute -top-3 left-10 h-6 w-20 rotate-[-4deg] rounded-[2px] bg-[color:var(--coral)]/40" />
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
                  <div className="relative flex items-center gap-3 rounded-xl border border-dashed border-[color:var(--coral)] bg-[color:var(--coral)]/10 p-3">
                    <div className="h-8 w-8 rounded-md bg-[color:var(--coral)] grid place-items-center">
                      <Settings2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-[13px] flex-1">Extension options</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--coral)]">
                      click →
                    </span>
                    <span
                      className="absolute -right-4 -top-6 font-[Fraunces] italic text-[16px] text-[color:var(--coral)] rotate-[-6deg]"
                    >
                      here!
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
              Go to{" "}
              <code className="rounded bg-[color:var(--surface-card)] px-1.5 py-0.5 font-mono text-[13px]">
                chrome://extensions
              </code>
              , click <b>Details</b> on Renma, then <b>Extension options</b>.
            </p>
            <p className="text-[color:var(--muted)]">
              Shortcut: right-click the toolbar icon and pick <i>Options</i>.
            </p>
          </Step>

          <div id="guide-2" />
          <Step
            num="02"
            kicker="Behavior"
            icon={MousePointer2}
            title="Flip the master switches"
            shot={
              <SketchShot
                src={shotBehavior}
                alt="Behavior settings"
                callouts={[
                  { pin: [88, 22], note: [104, 22], side: "r", title: "Master switch", body: "Pause Renma everywhere without uninstalling.", bend: 20 },
                  { pin: [88, 50], note: [104, 50], side: "r", title: "Only images", body: "Skip PDFs, ZIPs, and other MIME types.", bend: 0 },
                  { pin: [88, 78], note: [104, 78], side: "r", title: "Notify me", body: "Small desktop toast fires on every rename.", bend: -10 },
                ]}
              />
            }
            demo={
              <BeforeAfter
                before="unsplash-photo-2394.pdf"
                after="unsplash-photo-2394.pdf"
                note="With ‘Only images’ ON, non-images pass through untouched."
              />
            }
          >
            <p>
              The <b>master toggle</b> pauses renaming globally. <b>Only images</b> restricts
              Renma to actual image MIME types. <b>Notifications</b> shows a small desktop
              toast for every rename.
            </p>
          </Step>

          <div id="guide-3" />
          <Step
            num="03"
            kicker="Template"
            icon={FileType2}
            title="Design the filename"
            shot={
              <SketchShot
                src={shotTemplate}
                alt="Template editor"
                callouts={[
                  { pin: [45, 32], note: [104, 26], side: "r", title: "The recipe", body: "Mix tokens with _  -  . to taste. Click a chip to insert.", bend: 20 },
                  { pin: [45, 74], note: [104, 74], side: "r", title: "Live preview", body: "Renders using a real Unsplash download.", bend: -12 },
                ]}
              />
            }
            demo={
              <BeforeAfter
                before="photo-1503023345310-bd7c1de61c7d.jpg"
                after="Unsplash_20260723-142011_1920x1280.jpg"
                note="Template: {prefix}_{date}-{time}_{dimensions}.{ext}"
              />
            }
          >
            <p>Common recipes:</p>
            <ul className="space-y-1.5 font-mono text-[13px] text-[color:var(--ink)]">
              <li>· {"{prefix}_{timestamp}.{ext}"}</li>
              <li>· {"{prefix}-{date}-{counter}.{ext}"}</li>
              <li>· {"{prefix}_{dimensions}.{ext}"}</li>
            </ul>
          </Step>

          <div id="guide-4" />
          <Step
            num="04"
            kicker="Rules"
            icon={Globe2}
            title="Teach it your domains"
            shot={
              <SketchShot
                src={shotMappings}
                alt="Domain rules"
                callouts={[
                  { pin: [18, 62], note: [-4, 62], side: "l", title: "Domain", body: "Any substring of the URL host. dribbble also matches cdn.dribbble.com.", bend: 15 },
                  { pin: [50, 62], note: [50, 108], side: "r", title: "Prefix", body: "Becomes {prefix} in your template.", bend: -20 },
                  { pin: [82, 62], note: [104, 62], side: "r", title: "Folder", body: "Optional subfolder inside your Downloads/ root.", bend: 10 },
                ]}
              />
            }
            demo={
              <BeforeAfter
                before="ss_1_4x-1720012.jpg"
                after="refs/ui/Dribbble_20260723-142255.jpg"
                note="Rule: dribbble.com → prefix ‘Dribbble’, folder ‘refs/ui’"
              />
            }
          >
            <p>
              Ships with defaults (OpenAI → <code>AI_Generated</code>). Add your own to route
              specific sites into named prefixes and folders.
            </p>
          </Step>

          <div id="guide-5" />
          <Step
            num="05"
            kicker="Scope"
            icon={Sparkles}
            title="Pick where Renma runs"
            shot={
              <SketchShot
                src={shotScope}
                alt="Site scope"
                callouts={[
                  { pin: [50, 22], note: [104, 22], side: "r", title: "Mode", body: "All sites · whitelist · blacklist. Only one is active.", bend: 12 },
                  { pin: [50, 68], note: [-4, 68], side: "l", title: "Site list", body: "One domain per chip. Enter to add, × to remove.", bend: -15 },
                ]}
              />
            }
            demo={
              <BeforeAfter
                before="IMG_9821.jpeg"
                after="IMG_9821.jpeg"
                note="Blacklist contains your bank — Renma stays out of the way."
              />
            }
          >
            <p>
              <b>Whitelist</b> when you only want Renma on a handful of sources.{" "}
              <b>Blacklist</b> to keep sensitive downloads untouched.{" "}
              <b>All sites</b> is the default.
            </p>
          </Step>

          <div id="guide-6" />
          <Step
            num="06"
            kicker="Insights"
            icon={BarChart3}
            title="Duplicates & stats"
            shot={
              <div className="grid gap-6">
                <SketchShot
                  src={shotDuplicates}
                  alt="Duplicate mode"
                  callouts={[
                    { pin: [50, 60], note: [104, 60], side: "r", title: "Off · Tag · Skip", body: "How to treat the same URL downloaded twice.", bend: 10 },
                  ]}
                />
                <SketchShot
                  src={shotStats}
                  alt="Stats dashboard"
                  callouts={[
                    { pin: [50, 26], note: [-4, 26], side: "l", title: "Totals", body: "Lifetime · today · unique sources.", bend: 10 },
                    { pin: [50, 78], note: [104, 78], side: "r", title: "Top domains", body: "Bar chart of where your images actually come from.", bend: -10 },
                  ]}
                />
              </div>
            }
            demo={
              <BeforeAfter
                before="hero-banner.png  (already saved)"
                after="⏭  skipped — duplicate URL"
                note="Duplicate mode = ‘Skip’ — no clutter, no ‘(1)’ copies."
              />
            }
          >
            <p>
              <b>Tag</b> keeps duplicate downloads but marks them in the popup. <b>Skip</b>{" "}
              refuses to re-download the same URL entirely.
            </p>
            <p>The stats panel is fully local — nothing leaves your machine.</p>
          </Step>

          <div id="guide-7" />
          <Step
            num="07"
            kicker="Portable"
            icon={Copy}
            title="Backup & restore"
            shot={
              <SketchShot
                src={shotBackup}
                alt="Backup panel"
                callouts={[
                  { pin: [30, 60], note: [-4, 60], side: "l", title: "Export", body: "Downloads your full config as renma-backup.json.", bend: 15 },
                  { pin: [70, 60], note: [104, 60], side: "r", title: "Import", body: "Drop the same JSON on any other machine.", bend: -15 },
                ]}
              />
            }
            demo={
              <BeforeAfter
                before="fresh install, no rules"
                after="renma-backup.json → 12 rules, template, scope restored"
                note="Everything travels: templates, rules, scope, duplicate mode, toggles."
              />
            }
          >
            <p>
              Moving laptops? Export once, import on the other side. Templates, rules, scope,
              duplicate mode and toggles all travel together.
            </p>
          </Step>

          {/* Popup bonus */}
          <div id="guide-popup" />
          <section className="relative rounded-[28px] border border-[color:var(--hairline)] bg-[color:var(--surface-soft)] p-6 sm:p-10">
            <span className="absolute -top-3 left-10 h-6 w-24 rotate-[-4deg] rounded-[2px] bg-[color:var(--coral)]/25 border border-[color:var(--coral)]/40" />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--coral)]">
                  Bonus
                </p>
                <h3 className="mt-2 font-[Fraunces] italic text-[34px] leading-[1.05]">
                  The toolbar popup
                </h3>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-[color:var(--body)]">
                  Click the Renma icon to see the last 50 renames, search them, export as JSON,
                  or hit <b>Undo</b> to revert the most recent one.
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
              <div className="relative rounded-[20px] border border-[color:var(--hairline)] bg-[color:var(--canvas)] p-4 shadow-[0_20px_60px_-30px_rgba(20,20,19,0.3)]">
                <img src={shotPopup} alt="Renma popup" className="w-full h-auto rounded-[12px]" />
                <span className="absolute -right-4 top-10 font-[Fraunces] italic text-[18px] text-[color:var(--coral)] rotate-[8deg]">
                  ← one click undo
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
