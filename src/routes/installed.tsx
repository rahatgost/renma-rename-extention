import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight, Keyboard, Settings2, Bug } from "lucide-react";
import renmaLogo from "@/assets/renma-logo.png";

export const Route = createFileRoute("/installed")({
  head: () => ({
    meta: [
      { title: "You're in — Welcome to Renma" },
      {
        name: "description",
        content:
          "Renma is now installed. A 30-second tour of the shortcuts, the popup, and how to make it yours.",
      },
      { property: "og:title", content: "Welcome to Renma" },
      {
        property: "og:description",
        content: "Renma is installed. Here's how to get the most out of it in 30 seconds.",
      },
      { property: "og:url", content: "https://renma.flinkeo.online/installed" },
      { property: "og:image", content: "https://renma.flinkeo.online/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://renma.flinkeo.online/og-image.jpg" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://renma.flinkeo.online/installed" }],
  }),
  component: InstalledPage,
});

const TIPS = [
  {
    icon: Settings2,
    title: "Open the options page",
    body: "Right-click the Renma icon → Options. Add custom domain → prefix mappings and pick your naming template.",
  },
  {
    icon: Keyboard,
    title: "Learn the shortcut",
    body: "Ctrl/⌘+Shift+U undoes the last rename. Great when a template needs tweaking mid-session.",
  },
  {
    icon: Bug,
    title: "Something off?",
    body: "The report form goes straight to the maintainer. No account, no ticket queue.",
  },
];

function InstalledPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="max-w-3xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={renmaLogo} alt="Renma" className="h-8 w-8" />
          <span className="font-serif italic text-2xl">
            renma<span className="text-coral">.</span>
          </span>
        </Link>
        <Link to="/guide" className="text-sm text-ink/60 hover:text-ink transition-colors">
          Full guide →
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-6 pb-24">
        <div className="pt-10 pb-12 border-b border-ink/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 text-coral text-xs uppercase tracking-wider mb-6">
            <Check className="w-3.5 h-3.5" /> Installed
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
            You're in. <br />
            <span className="italic text-coral">Now save your first file.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ink/70 max-w-xl">
            Nothing else to configure. Right-click any image on the web, hit
            <span className="mx-1 px-2 py-0.5 rounded bg-ink/5 font-mono text-sm">Save image as…</span>
            and watch the filename rewrite itself.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-5">
          {TIPS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-ink/10 bg-white p-6">
              <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-ink">{title}</h3>
              <p className="mt-2 text-sm text-ink/60 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-ink text-canvas p-8 sm:p-10">
          <h2 className="font-serif text-3xl sm:text-4xl">Try it right now.</h2>
          <p className="mt-3 text-canvas/70 max-w-lg">
            Head to any site with images. Right-click, save, and the filename lands as
            <span className="mx-1 px-2 py-0.5 rounded bg-canvas/10 font-mono text-sm">domain_timestamp.ext</span>.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/guide"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coral text-white text-sm font-medium hover:bg-coral/90 transition-colors"
            >
              Read the guide <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-canvas/10 text-canvas text-sm hover:bg-canvas/20 transition-colors"
            >
              Report an issue
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
