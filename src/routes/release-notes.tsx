import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Sparkles, Download } from "lucide-react";
import renmaLogo from "@/assets/renma-logo.png";

export const Route = createFileRoute("/release-notes")({
  head: () => ({
    meta: [
      { title: "Renma — Release Notes" },
      {
        name: "description",
        content:
          "The story behind each Renma release — what we shipped, why it matters, and how to try it.",
      },
      { property: "og:title", content: "Renma — Release Notes" },
      {
        property: "og:description",
        content: "Narrative release notes for the Renma Chrome extension.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReleaseNotesPage,
});

const RELEASES = [
  {
    version: "1.3.0",
    codename: "Second Chances",
    date: "Jul 23, 2026",
    lede: "The one where a wrong rename is no longer permanent.",
    body: [
      "You right-click, hit save, and a fraction of a second later realize the template was wrong. In 1.3, that's a single tap: the popup surfaces an Undo button on the latest rename that restores the original filename and quietly skips it next time.",
      "We also mapped two keyboard shortcuts (toggle + open popup), added a real context-menu entry for one-off saves, and taught Renma to read image dimensions so your filenames can carry {width}, {height} and {dimensions} tokens.",
    ],
    highlights: [
      "Undo the last rename in one click",
      "Keyboard shortcuts + context menu",
      "New {width}, {height}, {dimensions} tokens",
    ],
  },
  {
    version: "1.2.0",
    codename: "Room to Breathe",
    date: "Jul 20, 2026",
    lede: "Duplicates handled, history searchable, stats worth glancing at.",
    body: [
      "The single biggest ask after 1.1: 'stop saving the same reference five times.' 1.2 detects duplicates by URL and lets you choose per-domain what to do — skip, suffix, or overwrite.",
      "The popup got a search bar and JSON export, and Options grew a small, honest stats dashboard so you can see what Renma is actually doing for you each week.",
    ],
    highlights: [
      "Duplicate detection with per-domain modes",
      "Search + JSON export from the popup",
      "Stats dashboard in Options",
    ],
  },
  {
    version: "1.1.0",
    codename: "Your Rules",
    date: "Jul 15, 2026",
    lede: "Templates, folders, and a big honest off switch.",
    body: [
      "1.0 was opinionated. 1.1 is opinionated but polite. You can now write your own filename templates with tokens, route certain domains to specific subfolders, and scope Renma to a whitelist or blacklist of sites.",
      "There's also a master toggle in the popup — because sometimes you just want Chrome to be Chrome for ten minutes.",
    ],
    highlights: [
      "Custom filename templates",
      "Per-domain folder routing",
      "Whitelist / blacklist scope",
    ],
  },
  {
    version: "1.0.0",
    codename: "Hello, World",
    date: "Jul 10, 2026",
    lede: "The first public build.",
    body: [
      "Renma ships as a tiny Manifest V3 extension that watches image downloads, figures out where they came from, and gives them a name you can actually search for six months later.",
      "No accounts, no servers — everything stays local.",
    ],
    highlights: [
      "Auto-rename by source domain",
      "Custom domain → prefix mappings",
      "Local history in the popup",
    ],
  },
];

function ReleaseNotesPage() {
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
            Release notes
          </div>
          <h1 className="h-display-lg">Notes from the shop.</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/70 max-w-xl">
            Small essays about each release — the why behind the what. For the
            terse list, see the{" "}
            <Link to="/changelog" className="text-coral underline underline-offset-4">
              changelog
            </Link>
            .
          </p>
        </motion.header>

        <div className="space-y-16">
          {RELEASES.map((r, i) => (
            <motion.article
              key={r.version}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="border border-hairline rounded-2xl bg-surface-soft/40 p-8 md:p-10"
            >
              <div className="flex items-baseline gap-3 flex-wrap mb-4">
                <span className="font-mono text-[13px] text-ink">v{r.version}</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
                  {r.date}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] px-2 py-[3px] rounded-full bg-coral/10 text-coral">
                  {r.codename}
                </span>
              </div>
              <h2 className="font-serif italic text-[32px] md:text-[38px] leading-[1.05] tracking-tight">
                {r.lede}
              </h2>
              <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-body">
                {r.body.map((p, k) => (
                  <p key={k}>{p}</p>
                ))}
              </div>
              <div className="mt-7 pt-6 border-t border-hairline">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted mb-3 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-coral" /> Highlights
                </div>
                <ul className="grid sm:grid-cols-3 gap-2">
                  {r.highlights.map((h, k) => (
                    <li
                      key={k}
                      className="text-[13.5px] text-ink px-3 py-2 rounded-lg bg-canvas border border-hairline"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-between flex-wrap gap-4 p-6 rounded-2xl bg-ink text-canvas">
          <div>
            <div className="font-serif italic text-[22px]">Ready to try the latest?</div>
            <div className="text-[13px] text-canvas/70 mt-1">
              Load the newest build in under a minute.
            </div>
          </div>
          <Link
            to="/"
            hash="install"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coral text-canvas text-[13px] font-medium hover:bg-coral-active transition-colors"
          >
            <Download className="w-4 h-4" /> Install Renma
          </Link>
        </div>
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
