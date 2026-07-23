import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Play, X, Wand2, FolderTree, Gauge, Clock } from "lucide-react";

const DEMO_CONTENT = {
  eyebrow: "Live demo",
  title: "See Renma in motion",
  description:
    "Watch a real download turn from image (17).png into a clean, sourced filename — before Chrome even finishes writing it to disk.",
  ctaLabel: "Play the 45s walkthrough",
  duration: "0:45",
  posterUrl: "/renma-demo-poster.jpg",
  videoUrl: "/renma-demo.mp4",
  chapters: [
    { time: "0:04", label: "The image (17).png problem" },
    { time: "0:12", label: "Right-click → Save" },
    { time: "0:22", label: "Filename morphs live" },
    { time: "0:34", label: "Auto-routed folders" },
  ],
  highlights: [
    {
      icon: Wand2,
      title: "Source-aware renaming",
      body: "ChatGPT, Midjourney, Dribbble — each file inherits where it came from.",
    },
    {
      icon: FolderTree,
      title: "Auto-routed folders",
      body: "Rules move every download into the right project directory on save.",
    },
    {
      icon: Gauge,
      title: "Zero-latency, fully local",
      body: "Runs inside the download pipeline. No servers, no uploads, no wait.",
    },
  ],
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export default function DemoSection() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <section
      id="demo"
      aria-labelledby="demo-heading"
      className="relative isolate overflow-hidden bg-surface-dark py-24 md:py-32"
    >
      {/* Ambient coral glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 50% at 50% 30%, oklch(0.66 0.128 42 / 0.28), transparent 70%), radial-gradient(40% 40% at 50% 100%, oklch(0.72 0.08 175 / 0.12), transparent 70%)",
        }}
      />
      {/* Grid mask */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 78%)",
        }}
      />
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-coral" />
            </span>
            <span className="t-caption-upper text-white/80">{DEMO_CONTENT.eyebrow}</span>
          </span>
          <h2 id="demo-heading" className="h-display-lg mt-5 text-white">
            {DEMO_CONTENT.title}
          </h2>
          <p className="t-body mt-4 text-white/65">{DEMO_CONTENT.description}</p>
        </motion.div>

        {/* Video preview */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="relative mx-auto mt-14 max-w-5xl"
        >
          {/* Corner tick marks */}
          <CornerTicks />

          {/* Animated gradient border */}
          <div
            aria-hidden
            className="absolute -inset-px rounded-[24px] opacity-70 [background:conic-gradient(from_var(--angle),transparent_20%,oklch(0.66_0.128_42/.7)_40%,transparent_60%,oklch(0.72_0.08_175/.5)_80%,transparent)] motion-safe:animate-[demo-spin_9s_linear_infinite]"
            style={{ ["--angle" as string]: "0deg" } as React.CSSProperties}
          />
          <style>{`
            @property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
            @keyframes demo-spin { to { --angle: 360deg; } }
            @keyframes demo-pulse { 0%,100% { box-shadow: 0 0 0 0 oklch(0.66 0.128 42 / 0.55); } 50% { box-shadow: 0 0 0 22px oklch(0.66 0.128 42 / 0); } }
          `}</style>

          {/* Browser chrome frame */}
          <div className="relative overflow-hidden rounded-[22px] bg-surface-dark-elevated ring-1 ring-white/10 shadow-[0_40px_100px_-24px_rgba(0,0,0,0.75)]">
            {/* Chrome bar */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] bg-black/30 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-white/15" />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-md bg-white/[0.06] px-3 py-1 text-[11px] text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-coral/70" />
                renma · live demo · 1080p
              </div>
              <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[11px] text-white/60">
                <Clock className="h-3 w-3" /> {DEMO_CONTENT.duration}
              </span>
            </div>

            <button
              ref={triggerRef}
              type="button"
              onClick={handleOpen}
              aria-label="Play demo video"
              className="group relative block aspect-video w-full overflow-hidden focus-visible:outline-none"
            >
              <img
                src={DEMO_CONTENT.posterUrl}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30"
              />

              {/* Play button */}
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/15 backdrop-blur-xl transition duration-300 group-hover:scale-110 group-hover:bg-white/25 motion-safe:animate-[demo-pulse_2.6s_ease-out_infinite] md:h-24 md:w-24"
              >
                <Play className="ml-1 h-8 w-8 fill-white text-white md:h-10 md:w-10" />
              </span>

              {/* Bottom bar overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <span className="rounded-full bg-black/45 px-3 py-1.5 text-[13px] font-medium text-white/90 backdrop-blur-md ring-1 ring-white/10">
                  ▶ {DEMO_CONTENT.ctaLabel}
                </span>
                <span className="hidden rounded-full bg-black/45 px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-white/70 backdrop-blur-md ring-1 ring-white/10 sm:inline-flex">
                  No audio · silent by design
                </span>
              </div>
            </button>
          </div>

          {/* Chapters */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {DEMO_CONTENT.chapters.map((c) => (
              <button
                key={c.time}
                type="button"
                onClick={handleOpen}
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 transition hover:border-coral/40 hover:bg-white/[0.06]"
              >
                <span className="font-mono text-[11px] text-coral">{c.time}</span>
                <span className="t-body-sm text-white/70 group-hover:text-white/90">
                  {c.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
          }}
          className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {DEMO_CONTENT.highlights.map(({ icon: Icon, title, body }, i) => (
            <motion.li
              key={title}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition hover:border-coral/30 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-coral/15 text-coral ring-1 ring-coral/25">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-[11px] text-white/30">
                  0{i + 1}
                </span>
              </div>
              <h3 className="h-title-md mt-4 text-white">{title}</h3>
              <p className="t-body-sm mt-1.5 text-white/60">{body}</p>
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-coral/20 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100"
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {open && (
        <VideoModal
          src={DEMO_CONTENT.videoUrl}
          onClose={handleClose}
          returnFocusTo={triggerRef}
        />
      )}
    </section>
  );
}

function CornerTicks() {
  const base =
    "pointer-events-none absolute h-4 w-4 border-coral/60";
  return (
    <>
      <span aria-hidden className={`${base} -left-2 -top-2 border-l border-t`} />
      <span aria-hidden className={`${base} -right-2 -top-2 border-r border-t`} />
      <span aria-hidden className={`${base} -bottom-2 -left-2 border-b border-l`} />
      <span aria-hidden className={`${base} -bottom-2 -right-2 border-b border-r`} />
    </>
  );
}

/* ---------------- Modal ---------------- */

function VideoModal({
  src,
  onClose,
  returnFocusTo,
}: {
  src: string;
  onClose: () => void;
  returnFocusTo: React.RefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const prevActive = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], video, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      const target = returnFocusTo.current ?? prevActive;
      target?.focus?.();
    };
  }, [onClose, returnFocusTo]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Renma demo video"
      ref={dialogRef}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl animate-in zoom-in-95 duration-300"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close demo video"
          className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
        >
          <X className="h-5 w-5" />
        </button>
        <video
          ref={videoRef}
          src={src}
          controls
          autoPlay
          playsInline
          className="aspect-video w-full bg-black"
        />
      </div>
    </div>
  );
}
