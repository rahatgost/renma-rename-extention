import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Download,
  Sparkles,
  Zap,
  Settings2,
  Clock,
  Globe2,
  ImageIcon,
  Shield,
  ArrowRight,
  Check,
  ChevronRight,
  Puzzle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Image Renamer — Auto-name downloads by source domain" },
      {
        name: "description",
        content:
          "A Chrome extension that instantly renames image downloads using the site you got them from. AI images become AI_Generated. Everything else, just clean.",
      },
      { property: "og:title", content: "Smart Image Renamer" },
      {
        property: "og:description",
        content:
          "Stop dragging image (17).png into folders. Auto-rename every download by source domain — Chrome MV3, zero setup.",
      },
      { name: "twitter:title", content: "Smart Image Renamer" },
      {
        name: "twitter:description",
        content:
          "Auto-rename every image download by source domain. Chrome MV3.",
      },
    ],
  }),
  component: Landing,
});

/* ---------------- Animations ---------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/* ---------------- Sections ---------------- */

function Landing() {
  return (
    <div className="min-h-screen bg-canvas text-ink font-sans overflow-x-hidden">
      <Nav />
      <Hero />
      <LogoStrip />
      <BentoFeatures />
      <HowItWorks />
      <RulesShowcase />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

/* ---------------- Nav ---------------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-canvas/80 backdrop-blur-md border-b border-hairline"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-ink text-canvas flex items-center justify-center relative overflow-hidden">
            <ImageIcon className="w-4 h-4 relative z-10" />
            <motion.div
              className="absolute inset-0 bg-coral"
              initial={{ y: "100%" }}
              whileHover={{ y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="font-display text-xl">Smart Image Renamer</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-body-text">
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
          <a href="#how" className="hover:text-ink transition-colors">How it works</a>
          <a href="#rules" className="hover:text-ink transition-colors">Rules</a>
          <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
        </nav>
        <a
          href="/smart-image-renamer.zip"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-ink text-canvas text-sm font-medium hover:bg-coral transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download</span>
        </a>
      </div>
    </motion.header>
  );
}

function handleDownload(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  fetch("/smart-image-renamer.zip")
    .then((r) => {
      if (!r.ok) throw new Error(`Download failed: ${r.status}`);
      return r.blob();
    })
    .then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "smart-image-renamer.zip";
      a.click();
      URL.revokeObjectURL(a.href);
    })
    .catch((err) => alert(err.message));
}

/* ---------------- Hero ---------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const reduce = useReducedMotion();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  return (
    <section id="top" ref={ref} className="relative grain-bg pt-16 pb-24 md:pt-24 md:pb-40">
      <motion.div style={{ y: y2, opacity }} className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-surface-card text-xs font-medium text-body-strong mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
            Chrome Extension · Manifest V3
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-[52px] leading-[1.02] md:text-[92px] md:leading-[0.98] tracking-tight text-ink"
          >
            Every image, <br />
            <span className="italic text-coral">named properly</span> <br />
            the second it lands.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-lg text-body-text leading-relaxed"
          >
            Stop the flood of <code className="font-mono text-sm bg-surface-card px-1.5 py-0.5 rounded">image&nbsp;(17).png</code>. Smart Image
            Renamer detects the source of every download and rewrites the
            filename before it hits disk — cleanly, deterministically, forever.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="/smart-image-renamer.zip"
              onClick={handleDownload}
              className="group inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-coral text-white font-medium hover:bg-coral-active transition-colors"
            >
              <Download className="w-4 h-4" />
              Download extension
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-canvas border border-hairline text-ink font-medium hover:bg-surface-soft transition-colors"
            >
              See how it works
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex items-center gap-6 text-xs text-muted-ink">
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-coral" /> Free · Open source</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-coral" /> No account</div>
            <div className="hidden sm:flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-coral" /> Works offline</div>
          </motion.div>
        </motion.div>

        {/* Floating filename morph card */}
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 md:mt-28 max-w-3xl mx-auto"
        >
          <FilenameMorph />
        </motion.div>
      </motion.div>
    </section>
  );
}

function FilenameMorph() {
  const [i, setI] = useState(0);
  const examples = [
    { from: "image (17).png", to: "AI_Generated_1737551204812.png", host: "chatgpt.com", tone: "coral" },
    { from: "download.jpg", to: "unsplash_1737551204901.jpg", host: "unsplash.com", tone: "teal" },
    { from: "IMG_2891.webp", to: "dribbble_1737551205044.webp", host: "dribbble.com", tone: "amber" },
    { from: "photo-large.png", to: "AI_Generated_1737551205200.png", host: "oaiusercontent.com", tone: "coral" },
  ];
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % examples.length), 2600);
    return () => clearInterval(t);
  }, [examples.length]);
  const ex = examples[i];

  return (
    <div className="rounded-2xl bg-surface-dark p-1.5 shadow-[0_40px_80px_-30px_rgba(20,20,19,0.35)]">
      <div className="rounded-xl bg-surface-dark-elevated p-6 md:p-8">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="ml-3 text-[11px] font-mono text-white/40 tracking-widest uppercase">chrome.downloads · onDeterminingFilename</span>
        </div>
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-widest text-white/40 mb-2">Original</div>
            <motion.div
              key={ex.from}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="font-mono text-sm md:text-base text-white/60 truncate line-through decoration-white/30"
            >
              {ex.from}
            </motion.div>
          </div>
          <motion.div
            key={`arrow-${i}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="hidden md:flex w-9 h-9 rounded-full bg-coral text-white items-center justify-center"
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-widest text-white/40 mb-2">Renamed</div>
            <motion.div
              key={ex.to}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-mono text-sm md:text-base text-white truncate"
            >
              <span className={ex.tone === "coral" ? "text-coral" : ex.tone === "teal" ? "text-teal" : "text-amber"}>
                {ex.to.split("_")[0]}
              </span>
              <span className="text-white/80">_{ex.to.split("_").slice(1).join("_")}</span>
            </motion.div>
          </div>
        </div>
        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-white/50">
            <Globe2 className="w-3.5 h-3.5" />
            <span className="font-mono">{ex.host}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            suggest() applied
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Logo strip ---------------- */

function LogoStrip() {
  const items = ["chatgpt.com", "midjourney.com", "unsplash.com", "dribbble.com", "pinterest.com", "figma.com", "behance.net"];
  return (
    <section className="py-10 border-y border-hairline bg-surface-soft/40">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs uppercase tracking-widest text-muted-ink mb-6 text-center">
          Works with every image source
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {items.map((s, idx) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 0.7, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="font-mono text-sm text-body-strong"
            >
              {s}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Bento features ---------------- */

function BentoFeatures() {
  return (
    <section id="features" className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15%" }}
          className="max-w-2xl mb-16"
        >
          <motion.div variants={fadeUp} className="text-xs uppercase tracking-widest text-coral mb-4">
            Built for messy download folders
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-6xl leading-[1.02] text-ink">
            Small extension.<br /><span className="italic">Enormous</span> quality-of-life.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-body-text text-lg">
            Everything Smart Image Renamer does happens invisibly, at the moment Chrome asks
            <span className="font-mono text-sm bg-surface-card px-1 mx-1 rounded">onDeterminingFilename</span> —
            no clipboard hacks, no post-processing, no manual renaming.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[minmax(180px,auto)] gap-4">
          <BentoCard className="md:col-span-4 bg-surface-dark text-white" delay={0}>
            <div className="p-8 h-full flex flex-col justify-between min-h-[320px]">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
                <Sparkles className="w-3.5 h-3.5 text-coral" /> AI detection
              </div>
              <div>
                <div className="font-display text-4xl md:text-5xl leading-tight mb-4">
                  AI-generated images get <span className="italic text-coral">their own prefix.</span>
                </div>
                <p className="text-white/60 max-w-md">
                  Images from openai.com, chatgpt.com, and oaiusercontent.com are auto-tagged
                  as <span className="font-mono text-white">AI_Generated</span>, so you never mix
                  synthesised images with the real thing again.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {["openai.com", "chatgpt.com", "oaiusercontent.com"].map((d) => (
                  <span key={d} className="font-mono text-xs px-2.5 py-1 rounded-md bg-white/5 text-white/70 border border-white/10">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-2 bg-coral text-white" delay={0.1}>
            <div className="p-8 h-full flex flex-col justify-between min-h-[320px]">
              <Zap className="w-8 h-8" />
              <div>
                <div className="font-display text-3xl md:text-4xl leading-tight mb-3">
                  Zero delay.
                </div>
                <p className="text-white/85 text-sm">
                  Runs inside Chrome's own filename hook — the download completes with the
                  right name. Nothing to click, nothing to wait for.
                </p>
              </div>
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-2 bg-surface-card" delay={0.15}>
            <div className="p-8 h-full flex flex-col justify-between min-h-[240px]">
              <Settings2 className="w-8 h-8 text-ink" />
              <div>
                <div className="font-display text-3xl leading-tight mb-2">Your rules, your prefixes.</div>
                <p className="text-body-text text-sm">
                  Add custom domain → prefix mappings from the options page. Saved instantly
                  via chrome.storage.local.
                </p>
              </div>
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-2 bg-canvas border border-hairline" delay={0.2}>
            <div className="p-8 h-full flex flex-col min-h-[240px]">
              <Clock className="w-8 h-8 text-ink mb-6" />
              <div className="font-display text-3xl leading-tight mb-2">Last 5 renames.</div>
              <p className="text-body-text text-sm mb-4">Popup shows exactly what changed.</p>
              <div className="mt-auto space-y-1.5">
                {["AI_Generated_...812.png", "unsplash_...901.jpg", "dribbble_...044.webp"].map((n) => (
                  <div key={n} className="font-mono text-[11px] text-body-strong truncate">{n}</div>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-2 bg-surface-soft" delay={0.25}>
            <div className="p-8 h-full flex flex-col justify-between min-h-[240px]">
              <Shield className="w-8 h-8 text-ink" />
              <div>
                <div className="font-display text-3xl leading-tight mb-2">Privacy first.</div>
                <p className="text-body-text text-sm">
                  Everything is local. No telemetry, no servers, no analytics. The
                  extension only asks for the <code className="font-mono text-xs bg-canvas px-1 rounded">downloads</code> permission.
                </p>
              </div>
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-3 bg-surface-cream-strong" delay={0.3}>
            <div className="p-8 h-full flex flex-col justify-between min-h-[220px]">
              <Globe2 className="w-8 h-8 text-ink" />
              <div>
                <div className="font-display text-3xl leading-tight mb-2">Any domain, any extension.</div>
                <p className="text-body-text text-sm">
                  Preserves the original file extension — png, jpg, webp, gif, svg, avif —
                  and strips <code className="font-mono text-xs">www.</code> plus TLD for
                  a clean prefix out of the box.
                </p>
              </div>
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-3 bg-ink text-white" delay={0.35}>
            <div className="p-8 h-full flex flex-col justify-between min-h-[220px]">
              <Puzzle className="w-8 h-8 text-coral" />
              <div>
                <div className="font-display text-3xl leading-tight mb-2">
                  Manifest V3, service worker, done.
                </div>
                <p className="text-white/60 text-sm">
                  ~2 KB background script. No content scripts, no host permissions,
                  no bloat. Loads unpacked in every Chromium browser.
                </p>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- How it works ---------------- */

function HowItWorks() {
  const steps = [
    { n: "01", title: "Install unpacked", body: "Download the zip, unzip, and load it in chrome://extensions with Developer mode on." },
    { n: "02", title: "Just browse", body: "Save any image from any site the way you always do. Chrome fires onDeterminingFilename." },
    { n: "03", title: "Get a clean name", body: "The extension inspects the source host, applies your rules, and calls suggest() with a tidy {prefix}_{timestamp}.{ext} filename." },
  ];
  return (
    <section id="how" className="py-24 md:py-36 bg-surface-soft border-y border-hairline">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15%" }}
            className="md:col-span-5"
          >
            <motion.div variants={fadeUp} className="text-xs uppercase tracking-widest text-coral mb-4">
              How it works
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-6xl leading-[1.02] text-ink">
              Three steps.<br /><span className="italic">That's it.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 text-body-text">
              No sign-in, no config, no cloud. The background service worker registers a single
              listener and every future image download flows through it.
            </motion.p>
          </motion.div>

          <motion.ol
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15%" }}
            className="md:col-span-7 space-y-4"
          >
            {steps.map((s) => (
              <motion.li
                key={s.n}
                variants={fadeUp}
                className="group flex gap-6 p-6 rounded-2xl bg-canvas border border-hairline hover:border-coral/40 transition-colors"
              >
                <div className="font-display text-4xl text-coral shrink-0 leading-none">{s.n}</div>
                <div>
                  <div className="font-display text-2xl text-ink mb-1.5">{s.title}</div>
                  <p className="text-body-text text-sm leading-relaxed">{s.body}</p>
                </div>
                <ChevronRight className="ml-auto w-5 h-5 text-muted-ink self-center opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Rules showcase ---------------- */

function RulesShowcase() {
  return (
    <section id="rules" className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15%" }}
            className="md:col-span-5"
          >
            <motion.div variants={fadeUp} className="text-xs uppercase tracking-widest text-coral mb-4">
              Naming logic
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-6xl leading-[1.02]">
              A tiny <span className="italic">decision tree</span> with big returns.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 text-body-text">
              Custom mappings win first. Then the AI hosts. Then a clean domain fallback. The
              rest is just a timestamp and the original extension.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 space-y-3 text-sm">
              {[
                ["Custom mapping match", "Uses your saved prefix"],
                ["AI hosts (openai/chatgpt/oaiusercontent)", "AI_Generated"],
                ["Anything else", "domain name minus www and TLD"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 items-start">
                  <Check className="w-4 h-4 mt-0.5 text-coral shrink-0" />
                  <div>
                    <div className="text-ink font-medium">{k}</div>
                    <div className="text-muted-ink">{v}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-7 rounded-2xl bg-surface-dark p-1.5"
          >
            <div className="rounded-xl bg-surface-dark-elevated p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="ml-3 text-[11px] font-mono text-white/40 tracking-widest uppercase">background.js</span>
              </div>
              <pre className="font-mono text-[13px] leading-relaxed text-white/85 overflow-x-auto">
{`chrome.downloads.onDeterminingFilename.addListener(
  (item, suggest) => {
    const host = new URL(item.finalUrl || item.url).hostname;
    const ext  = getExtension(item.filename) || "png";

    (async () => {
      const custom = await getCustomMappings();
      const prefix = resolvePrefix(host, custom);
      const name   = `${'`${prefix}_${Date.now()}.${ext}`'}`;

      await pushHistory({ originalName: item.filename, newName: name, domain: host });
      suggest({ filename: name });
    })();

    return true; // keep suggest() alive
  }
);`}
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

function FAQ() {
  const items = [
    { q: "Does it work in Chrome, Edge, Brave, Arc?", a: "Yes. It's a standard Manifest V3 extension — any Chromium browser can load it unpacked." },
    { q: "Do you upload my downloads anywhere?", a: "No. There is zero network activity. All logic runs in the local service worker; history lives in chrome.storage.local." },
    { q: "Can I add my own rules?", a: "Yes. Open the options page and add any number of domain → prefix mappings. They take priority over the built-in rules." },
    { q: "What about the file extension?", a: "The extension is preserved from the original filename, so png stays png, webp stays webp, and so on." },
    { q: "Will this rename non-image downloads?", a: "No. The listener checks mime type and common image extensions before touching the filename." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 md:py-36 bg-surface-soft border-y border-hairline">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15%" }}
          className="mb-14"
        >
          <motion.div variants={fadeUp} className="text-xs uppercase tracking-widest text-coral mb-4">FAQ</motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-6xl leading-[1.02]">
            Questions, <span className="italic">answered.</span>
          </motion.h2>
        </motion.div>
        <div className="divide-y divide-hairline border-y border-hairline">
          {items.map((it, i) => (
            <motion.div
              key={it.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left py-6 flex items-center justify-between gap-6 group"
              >
                <span className="font-display text-xl md:text-2xl text-ink">{it.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-8 rounded-full bg-surface-card flex items-center justify-center text-ink shrink-0"
                >
                  +
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="pb-6 pr-14 text-body-text">{it.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */

function CTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl bg-ink text-white p-10 md:p-20"
        >
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-coral/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-teal/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-5xl md:text-7xl leading-[1.02]">
              Give your <span className="italic text-coral">Downloads folder</span> a life it deserves.
            </h2>
            <p className="mt-6 text-white/70 text-lg max-w-lg">
              One zip. Two minutes. A permanently tidy filesystem.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="/smart-image-renamer.zip"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-coral text-white font-medium hover:bg-coral-active transition-colors"
              >
                <Download className="w-4 h-4" /> Download the extension
              </a>
              <a
                href="#how"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-white/10 text-white font-medium hover:bg-white/15 transition-colors"
              >
                Install guide
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-ink">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-ink text-canvas flex items-center justify-center">
            <ImageIcon className="w-3 h-3" />
          </div>
          <span className="font-display text-lg text-ink">Smart Image Renamer</span>
        </div>
        <div>© {new Date().getFullYear()} · Chrome MV3 · Made with warmth.</div>
      </div>
    </footer>
  );
}
