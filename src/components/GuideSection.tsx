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
  Lightbulb,
  Keyboard,
  FileImage,
  FolderOpen,
} from "lucide-react";

import sketchOpen from "@/assets/guide/sketch-01-open.jpg";
import sketchBehavior from "@/assets/guide/sketch-02-behavior.jpg";
import sketchTemplate from "@/assets/guide/sketch-03-template.jpg";
import sketchRules from "@/assets/guide/sketch-04-rules.jpg";
import sketchScope from "@/assets/guide/sketch-05-scope.jpg";
import sketchStats from "@/assets/guide/sketch-06-stats.jpg";
import sketchBackup from "@/assets/guide/sketch-07-backup.jpg";
import sketchPopup from "@/assets/guide/sketch-08-popup.jpg";

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

/* ───────────────────── Sketch frame (hero) ───────────────────── */

function SketchFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative">
      <div className="relative rounded-[22px] border border-[color:var(--hairline)] bg-[color:var(--canvas)] p-2.5 sm:p-3 shadow-[0_30px_80px_-40px_rgba(20,20,19,0.35)]">
        <span className="absolute -top-3 left-10 h-6 w-20 rotate-[-4deg] rounded-[2px] bg-[color:var(--coral)]/25 border border-[color:var(--coral)]/40" />
        <span className="absolute -top-3 right-14 h-6 w-16 rotate-[3deg] rounded-[2px] bg-[color:var(--accent-amber,#e8a55a)]/25 border border-[color:var(--accent-amber,#e8a55a)]/40" />
        <div className="overflow-hidden rounded-[14px] border border-[color:var(--hairline)] bg-[#f5efe1]">
          <img src={src} alt={alt} loading="lazy" className="block w-full h-auto" />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Before/after strip ───────────────────── */

function BeforeAfter({ before, after, note }: { before: string; after: string; note?: string }) {
  return (
    <figure className="relative">
      {/* torn-paper receipt */}
      <div className="relative rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--canvas)] shadow-[0_20px_50px_-30px_rgba(20,20,19,0.35)] overflow-hidden">
        {/* header strip */}
        <div className="flex items-center justify-between gap-3 border-b border-dashed border-[color:var(--ink)]/15 bg-[color:var(--surface-soft)] px-4 py-2">
          <div className="flex items-center gap-2 text-[color:var(--muted)]">
            <span className="grid h-2 w-2 rounded-full bg-[color:var(--coral)]/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]">download receipt</span>
          </div>
          <span className="font-[Fraunces] italic text-[12px] text-[color:var(--muted)]">real filename</span>
        </div>

        {/* rows */}
        <div className="grid sm:grid-cols-[1fr_auto_1fr]">
          {/* before */}
          <div className="relative p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <FileImage className="h-3.5 w-3.5 text-[color:var(--muted)]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--muted)]">Browser saved</p>
            </div>
            <p className="font-mono text-[13px] leading-snug text-[color:var(--ink)]/60 line-through decoration-[color:var(--muted-soft)]/70 break-all">
              {before}
            </p>
          </div>

          {/* arrow divider */}
          <div className="relative grid place-items-center px-2 py-2 sm:py-0">
            <div className="hidden sm:block absolute inset-y-3 left-1/2 -translate-x-1/2 w-px border-l border-dashed border-[color:var(--ink)]/15" />
            <div className="relative grid h-8 w-8 place-items-center rounded-full bg-[color:var(--coral)] text-white shadow-[0_6px_16px_-6px_rgba(204,120,92,0.6)]">
              <ArrowRight className="h-4 w-4 rotate-90 sm:rotate-0" />
            </div>
          </div>

          {/* after */}
          <div className="relative p-4 sm:p-5 bg-[color:var(--coral)]/5">
            <div className="flex items-center gap-2 mb-2">
              <FolderOpen className="h-3.5 w-3.5 text-[color:var(--coral)]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--coral)]">Renma saved</p>
            </div>
            <p className="font-mono text-[13.5px] font-medium leading-snug text-[color:var(--ink)] break-all">
              {after}
            </p>
          </div>
        </div>

        {/* note strip */}
        {note && (
          <figcaption className="flex items-start gap-2 border-t border-dashed border-[color:var(--ink)]/15 bg-[color:var(--surface-soft)]/60 px-4 py-3">
            <span className="mt-[6px] h-[6px] w-[6px] shrink-0 rotate-45 bg-[color:var(--coral)]" />
            <p className="font-[Fraunces] italic text-[13.5px] leading-snug text-[color:var(--body)]">{note}</p>
          </figcaption>
        )}
      </div>

      {/* punched holes on the left edge (paper feel) */}
      <div className="pointer-events-none absolute left-[-6px] top-6 bottom-6 hidden sm:flex flex-col justify-between">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-[color:var(--canvas)] border border-[color:var(--hairline)]" />
        ))}
      </div>
    </figure>
  );
}


/* ───────────────────── How-to steps + Tip ───────────────────── */

type HowStep = { action: string; detail?: string };

function HowToList({ steps }: { steps: HowStep[] }) {
  return (
    <ol className="relative space-y-3">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-[2px] inline-grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-[color:var(--ink)] bg-[color:var(--canvas)] font-mono text-[11px] font-bold text-[color:var(--ink)]">
            {i + 1}
          </span>
          <p className="text-[14.5px] leading-[1.55] text-[color:var(--ink)]">
            <span className="font-medium">{s.action}</span>
            {s.detail && <span className="text-[color:var(--body)]"> — {s.detail}</span>}
          </p>
        </li>
      ))}
    </ol>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex gap-3 rounded-xl border border-[color:var(--coral)]/30 bg-[color:var(--coral)]/8 p-3.5">
      <Lightbulb className="mt-[2px] h-4 w-4 shrink-0 text-[color:var(--coral)]" />
      <p className="font-[Fraunces] italic text-[14px] leading-snug text-[color:var(--ink)]">{children}</p>
    </div>
  );
}

/* ───────────────────── Step ───────────────────── */

function Step({
  num,
  icon: Icon,
  title,
  kicker,
  intro,
  how,
  tip,
  shot,
  demo,
}: {
  num: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  kicker: string;
  intro: React.ReactNode;
  how: HowStep[];
  tip?: React.ReactNode;
  shot: React.ReactNode;
  demo?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="relative grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14 items-start"
    >
      {/* Big sketch on the left */}
      <div className="relative">
        <div className="flex items-center gap-3 text-[color:var(--muted)] mb-4">
          <span className="font-mono text-[12px] tracking-widest uppercase">Step {num}</span>
          <span className="h-px flex-1 bg-[color:var(--hairline)]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--coral)]">{kicker}</span>
        </div>
        {shot}
      </div>

      {/* How-to + demo on the right */}
      <div className="lg:pt-2">
        <div className="flex items-start gap-4">
          <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[color:var(--coral)] text-white shadow-[0_10px_30px_-10px_rgba(204,120,92,0.6)]">
            <Icon className="h-5 w-5" />
            <Star className="absolute -right-3 -top-3 h-4 w-4 text-[color:var(--ink)]" />
          </div>
          <h3 className="font-[Fraunces] italic text-[28px] sm:text-[34px] leading-[1.05] text-[color:var(--ink)]">
            {title}
          </h3>
        </div>

        <div className="mt-4 text-[15px] leading-[1.65] text-[color:var(--body)]">{intro}</div>

        <div className="mt-6 rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface-soft)] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)] mb-3">
            How to do it
          </p>
          <HowToList steps={how} />
          {tip && <Tip>{tip}</Tip>}
        </div>

        {demo && <div className="mt-5">{demo}</div>}
      </div>
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
      <Star className="absolute left-6 top-10 h-5 w-5 text-[color:var(--ink)]/30" />
      <Star className="absolute right-8 top-24 h-4 w-4 text-[color:var(--coral)]/50" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--coral)]">
            The field notebook
          </p>
          <h2 className="mt-3 font-[Fraunces] italic text-[44px] sm:text-[64px] leading-[0.98] tracking-[-0.02em]">
            Learn Renma in{" "}
            <span className="relative inline-block">
              <span className="relative z-10">seven sketches</span>
              <span aria-hidden className="absolute inset-x-0 bottom-1 h-3 -z-0 bg-[color:var(--coral)]/30 rotate-[-1deg]" />
              <Squiggle className="absolute left-0 right-0 -bottom-2 w-full text-[color:var(--coral)]" />
            </span>
            .
          </h2>
          <p className="mt-5 text-[16.5px] leading-[1.65] text-[color:var(--body)] max-w-xl">
            Hand-drawn sketches of every screen, click-by-click instructions, and a
            real before/after filename so you know exactly what happens.
          </p>
        </div>

        {/* Quick start strip */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3 rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface-soft)] p-4">
          {[
            { k: "1", t: "Install", d: "Load unpacked at chrome://extensions." },
            { k: "2", t: "Open options", d: "Right-click the icon → Options." },
            { k: "3", t: "Save an image", d: "Renma renames it instantly." },
          ].map((s) => (
            <div key={s.k} className="flex gap-3 p-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color:var(--coral)] text-white font-mono text-[12px] font-bold">
                {s.k}
              </span>
              <div>
                <p className="font-[Fraunces] italic text-[16px] text-[color:var(--ink)]">{s.t}</p>
                <p className="text-[13px] text-[color:var(--body)]">{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TOC */}
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="mt-24 space-y-24">
          <div id="guide-1" />
          <Step
            num="01"
            kicker="Open"
            icon={Settings2}
            title="Find the settings page"
            intro={<p>Every control lives on a single options page. You only need to open it once.</p>}
            how={[
              { action: "Open chrome://extensions", detail: "paste it into the address bar and hit enter." },
              { action: "Find the Renma card", detail: "it looks like any other extension in the list." },
              { action: "Click Details, then Extension options", detail: "the dashed row on the sketch." },
            ]}
            tip={<>Shortcut — right-click the toolbar icon and pick <b>Options</b>. Same page, one click.</>}
            shot={<SketchFrame src={sketchOpen} alt="chrome://extensions with Renma highlighted" />}
          />

          <div id="guide-2" />
          <Step
            num="02"
            kicker="Behavior"
            icon={MousePointer2}
            title="Flip the master switches"
            intro={<p>Three toggles decide when Renma is active and how loud it is about it.</p>}
            how={[
              { action: "Enable renma", detail: "the global on/off. Off = every download saves untouched." },
              { action: "Only images", detail: "restrict Renma to real image MIME types. PDFs, ZIPs pass through." },
              { action: "Notify me", detail: "a small desktop toast fires on every rename." },
            ]}
            tip={<>Turn <b>Notify me</b> on for the first day so you can see what Renma is doing, then switch it off.</>}
            shot={<SketchFrame src={sketchBehavior} alt="Behavior toggles sketch" />}
            demo={
              <BeforeAfter
                before="unsplash-photo-2394.pdf"
                after="unsplash-photo-2394.pdf"
                note="With 'Only images' ON, non-images pass through untouched."
              />
            }
          />

          <div id="guide-3" />
          <Step
            num="03"
            kicker="Template"
            icon={FileType2}
            title="Design the filename"
            intro={<p>Templates are recipes. Mix tokens and separators — Renma fills in the values at download time.</p>}
            how={[
              { action: "Tap a token chip", detail: "it inserts into the editor at the cursor." },
              { action: "Add separators", detail: "underscore, dash, or dot between tokens for readability." },
              { action: "Check the live preview", detail: "it uses a real Unsplash download so you know what you get." },
            ]}
            tip={<>Available tokens: <code>{"{prefix} {date} {time} {timestamp} {counter} {width} {height} {dimensions} {ext}"}</code>.</>}
            shot={<SketchFrame src={sketchTemplate} alt="Filename template editor sketch" />}
            demo={
              <BeforeAfter
                before="photo-1503023345310-bd7c1de61c7d.jpg"
                after="Unsplash_20260723-142011_1920x1280.jpg"
                note="Template: {prefix}_{date}-{time}_{dimensions}.{ext}"
              />
            }
          />

          <div id="guide-4" />
          <Step
            num="04"
            kicker="Rules"
            icon={Globe2}
            title="Teach it your domains"
            intro={<p>Rules map a hostname to a prefix and, optionally, a subfolder inside Downloads/.</p>}
            how={[
              { action: "Click Add rule" },
              { action: "Type a domain fragment", detail: "'dribbble' matches dribbble.com AND cdn.dribbble.com." },
              { action: "Set a prefix", detail: "this replaces {prefix} in your template." },
              { action: "Optional: set a folder", detail: "e.g. refs/ui — Renma creates it inside Downloads/." },
            ]}
            tip={<>Renma ships with sensible defaults — OpenAI → <code>AI_Generated</code>. Delete or edit anything.</>}
            shot={<SketchFrame src={sketchRules} alt="Domain rules table sketch" />}
            demo={
              <BeforeAfter
                before="ss_1_4x-1720012.jpg"
                after="refs/ui/Dribbble_20260723-142255.jpg"
                note="Rule: dribbble.com → prefix 'Dribbble', folder 'refs/ui'"
              />
            }
          />

          <div id="guide-5" />
          <Step
            num="05"
            kicker="Scope"
            icon={Sparkles}
            title="Pick where Renma runs"
            intro={<p>Site scope is a big kill-switch by domain. Only one mode is active at a time.</p>}
            how={[
              { action: "Pick a mode", detail: "All sites · Whitelist only · Blacklist." },
              { action: "Type a domain, press Enter", detail: "a chip appears in the list." },
              { action: "Click × to remove", detail: "empty list + Whitelist mode = Renma runs nowhere." },
            ]}
            tip={<>Put your bank and email provider on the <b>Blacklist</b>. Renma won't touch anything you download there.</>}
            shot={<SketchFrame src={sketchScope} alt="Site scope sketch" />}
            demo={
              <BeforeAfter
                before="statement_IMG_9821.jpeg"
                after="statement_IMG_9821.jpeg"
                note="Blacklist contains your bank — Renma stays out of the way."
              />
            }
          />

          <div id="guide-6" />
          <Step
            num="06"
            kicker="Insights"
            icon={BarChart3}
            title="Duplicates & stats"
            intro={<p>Choose how the same URL twice should behave, and watch your download habits fill in below.</p>}
            how={[
              { action: "Pick a duplicate mode", detail: "Off = ignore · Tag = mark it · Skip = refuse the re-download." },
              { action: "Scroll to Stats", detail: "totals, today, and unique sources — 100% local." },
              { action: "Read the top-domains chart", detail: "the bars show where your images actually come from." },
            ]}
            tip={<>Nothing in Stats leaves your machine — no telemetry, no accounts, no network calls.</>}
            shot={<SketchFrame src={sketchStats} alt="Duplicate handling and stats sketch" />}
            demo={
              <BeforeAfter
                before="hero-banner.png  (already saved)"
                after="⏭  skipped — duplicate URL"
                note="Duplicate mode = 'Skip' — no clutter, no '(1)' copies."
              />
            }
          />

          <div id="guide-7" />
          <Step
            num="07"
            kicker="Portable"
            icon={Copy}
            title="Backup & restore"
            intro={<p>Your config is a single JSON file. Move machines without redoing anything.</p>}
            how={[
              { action: "Click Export", detail: "downloads renma-backup.json." },
              { action: "On the new machine, install Renma", detail: "open options." },
              { action: "Click Import and pick the JSON", detail: "templates, rules, scope, toggles — all restored." },
            ]}
            tip={<>Keep a fresh export in your dotfiles. Renma is trivially reproducible on any new laptop.</>}
            shot={<SketchFrame src={sketchBackup} alt="Backup and restore sketch" />}
            demo={
              <BeforeAfter
                before="fresh install, no rules"
                after="renma-backup.json → 12 rules, template, scope restored"
                note="Everything travels: templates, rules, scope, duplicate mode, toggles."
              />
            }
          />

          {/* Popup bonus */}
          <div id="guide-popup" />
          <section className="relative rounded-[28px] border border-[color:var(--hairline)] bg-[color:var(--surface-soft)] p-6 sm:p-10">
            <span className="absolute -top-3 left-10 h-6 w-24 rotate-[-4deg] rounded-[2px] bg-[color:var(--coral)]/25 border border-[color:var(--coral)]/40" />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center">
              <div className="relative mx-auto max-w-md rounded-[20px] border border-[color:var(--hairline)] bg-[color:var(--canvas)] p-3 shadow-[0_20px_60px_-30px_rgba(20,20,19,0.3)]">
                <img src={sketchPopup} alt="Renma popup sketch" loading="lazy" className="block w-full h-auto rounded-[12px]" />
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--coral)]">Bonus</p>
                <h3 className="mt-2 font-[Fraunces] italic text-[34px] leading-[1.05]">The toolbar popup</h3>
                <p className="mt-4 text-[15.5px] leading-[1.7] text-[color:var(--body)]">
                  Click the Renma icon for your last 50 renames. Search them, export as JSON, or
                  hit <b>Undo</b> to revert the most recent one.
                </p>

                <div className="mt-6 rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--canvas)] p-5">
                  <div className="flex items-center gap-2 text-[color:var(--muted)] mb-3">
                    <Keyboard className="h-4 w-4" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Keyboard shortcuts</p>
                  </div>
                  <div className="grid gap-2 text-[13.5px] text-[color:var(--body)]">
                    {[
                      ["Alt+Shift+P", "open popup"],
                      ["Alt+Shift+R", "toggle renaming on/off"],
                      ["Alt+Shift+Z", "undo last rename"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center gap-3">
                        <kbd className="rounded-md border border-[color:var(--hairline)] bg-[color:var(--surface-soft)] px-2 py-1 font-mono text-[12px] text-[color:var(--ink)]">
                          {k}
                        </kbd>
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
