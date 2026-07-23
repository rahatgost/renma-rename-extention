import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Play, X, Wand2, FolderTree, Gauge } from "lucide-react";

/* ---------------- Editable content ----------------
 * Replace POSTER_URL and VIDEO_URL with the final demo assets.
 * Everything user-visible lives in DEMO_CONTENT.
 */
const DEMO_CONTENT = {
  eyebrow: "Live demo",
  title: "See Renma in motion",
  description:
    "Watch a real download turn from image (17).png into a clean, sourced filename — before Chrome even finishes writing it to disk.",
  ctaLabel: "Watch Demo",
  posterUrl: "/renma-demo-poster.jpg",
  videoUrl: "/renma-demo.mp4",
  highlights: [
    { icon: Wand2, label: "Instant source-aware renaming" },
    { icon: FolderTree, label: "Auto-routed into the right folder" },
    { icon: Gauge, label: "Zero-latency, fully local" },
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
      {/* Radial coral glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 40%, oklch(0.66 0.128 42 / 0.28), transparent 70%), radial-gradient(40% 40% at 50% 100%, oklch(0.66 0.128 42 / 0.12), transparent 70%)",
        }}
      />
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
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
          <span className="t-caption-upper text-coral">{DEMO_CONTENT.eyebrow}</span>
          <h2
            id="demo-heading"
            className="h-display-lg mt-4 text-white"
          >
            {DEMO_CONTENT.title}
          </h2>
          <p className="t-body mt-4 text-white/70">{DEMO_CONTENT.description}</p>
        </motion.div>

        {/* Video preview */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="relative mx-auto mt-14 max-w-5xl"
        >
          {/* Animated gradient border */}
          <div
            aria-hidden
            className="absolute -inset-px rounded-[22px] opacity-70 [background:conic-gradient(from_var(--angle),transparent_20%,oklch(0.66_0.128_42/.7)_40%,transparent_60%,oklch(0.72_0.08_175/.5)_80%,transparent)] motion-safe:animate-[demo-spin_8s_linear_infinite]"
            style={
              {
                ["--angle" as string]: "0deg",
              } as React.CSSProperties
            }
          />
          <style>{`
            @property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
            @keyframes demo-spin { to { --angle: 360deg; } }
            @keyframes demo-pulse { 0%,100% { box-shadow: 0 0 0 0 oklch(0.66 0.128 42 / 0.55); } 50% { box-shadow: 0 0 0 18px oklch(0.66 0.128 42 / 0); } }
          `}</style>

          <button
            ref={triggerRef}
            type="button"
            onClick={handleOpen}
            aria-label="Play demo video"
            className="group relative block aspect-video w-full overflow-hidden rounded-[20px] bg-surface-dark-elevated ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] transition duration-500 hover:ring-coral/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          >
            <img
              src={DEMO_CONTENT.posterUrl}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-100"
            />
            {/* Vignette */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30"
            />

            {/* Play button */}
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:bg-white/25 motion-safe:animate-[demo-pulse_2.6s_ease-out_infinite] md:h-24 md:w-24"
            >
              <Play className="ml-1 h-8 w-8 fill-white text-white md:h-10 md:w-10" />
            </span>

            <span className="absolute bottom-5 left-5 t-caption-upper text-white/80">
              {DEMO_CONTENT.ctaLabel}
            </span>
          </button>
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
          className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {DEMO_CONTENT.highlights.map(({ icon: Icon, label }) => (
            <motion.li
              key={label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-sm"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-coral/15 text-coral ring-1 ring-coral/25">
                <Icon className="h-5 w-5" />
              </span>
              <span className="t-body-sm text-white/85">{label}</span>
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

  // Lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Focus management + focus trap + Escape
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
