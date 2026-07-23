import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, GitCommit } from "lucide-react";
import renmaLogo from "@/assets/renma-logo.png";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Renma — Changelog" },
      {
        name: "description",
        content:
          "Every shipped change to Renma — new features, fixes, and small polish, version by version.",
      },
      { property: "og:title", content: "Renma — Changelog" },
      {
        property: "og:description",
        content: "Version-by-version history of the Renma Chrome extension.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChangelogPage,
});

type Entry = {
  version: string;
  date: string;
  tag: "Major" | "Minor" | "Patch";
  title: string;
  items: { kind: "New" | "Fix" | "Polish"; text: string }[];
};

const ENTRIES: Entry[] = [
  {
    version: "1.3.0",
    date: "Jul 23, 2026",
    tag: "Minor",
    title: "Undo, shortcuts, dimensions",
    items: [
      { kind: "New", text: "Undo last rename directly from the popup." },
      { kind: "New", text: "Keyboard shortcuts to toggle renaming and open the popup." },
      { kind: "New", text: "Right-click context menu for one-off saves." },
      { kind: "New", text: "Image dimension tokens — {width}, {height}, {dimensions}." },
    ],
  },
  {
    version: "1.2.0",
    date: "Jul 20, 2026",
    tag: "Minor",
    title: "Duplicates, search, export",
    items: [
      { kind: "New", text: "Duplicate detection with per-domain modes." },
      { kind: "New", text: "Desktop notifications on rename." },
      { kind: "New", text: "Search + JSON export in the popup." },
      { kind: "New", text: "Stats dashboard in Options." },
    ],
  },
  {
    version: "1.1.0",
    date: "Jul 15, 2026",
    tag: "Minor",
    title: "Templates, routing, scope",
    items: [
      { kind: "New", text: "Custom filename templates." },
      { kind: "New", text: "Folder routing per domain." },
      { kind: "New", text: "Master on/off toggle." },
      { kind: "New", text: "Whitelist / blacklist site scope." },
    ],
  },
  {
    version: "1.0.0",
    date: "Jul 10, 2026",
    tag: "Major",
    title: "First public release",
    items: [
      { kind: "New", text: "Auto-rename downloaded images by source domain." },
      { kind: "New", text: "Custom domain → prefix mappings." },
      { kind: "New", text: "Recent history in the popup." },
    ],
  },
];

const kindStyle: Record<Entry["items"][number]["kind"], string> = {
  New: "text-coral bg-coral/10",
  Fix: "text-ink bg-ink/10",
  Polish: "text-muted bg-hairline",
};

function ChangelogPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <TopBar />
      <main className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
            Changelog
          </div>
          <h1 className="h-display-lg">Every change, in order.</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/70 max-w-xl">
            Renma ships in small, sharp releases. Here's the full history —
            what's new, what got fixed, what got a little kinder.
          </p>
        </motion.header>

        <ol className="relative border-l border-hairline pl-8 space-y-14">
          {ENTRIES.map((e, i) => (
            <motion.li
              key={e.version}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="relative"
            >
              <span className="absolute -left-[38px] top-1 grid place-items-center w-6 h-6 rounded-full bg-canvas border border-hairline">
                <GitCommit className="w-3 h-3 text-coral" />
              </span>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-mono text-[13px] text-ink">v{e.version}</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
                  {e.date}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] px-2 py-[3px] rounded-full bg-surface-card text-body">
                  {e.tag}
                </span>
              </div>
              <h2 className="mt-2 font-serif italic text-[26px] leading-tight">
                {e.title}
              </h2>
              <ul className="mt-5 space-y-2">
                {e.items.map((it, k) => (
                  <li key={k} className="flex items-start gap-3 text-[14.5px] leading-relaxed">
                    <span
                      className={`shrink-0 mt-[3px] text-[10px] font-medium uppercase tracking-[0.12em] px-2 py-[2px] rounded-full ${kindStyle[it.kind]}`}
                    >
                      {it.kind}
                    </span>
                    <span className="text-body">{it.text}</span>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </main>
    </div>
  );
}

function TopBar() {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-canvas/85 backdrop-blur-md border border-hairline shadow-sm">
        <Link
          to="/"
          className="flex items-center gap-2 text-[13px] text-ink hover:text-coral transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <img src={renmaLogo} alt="" width={20} height={20} className="rounded" />
          <span className="font-serif italic text-[16px]">
            renma<span className="text-coral">.</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
