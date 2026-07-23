import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Lock, Server, Cookie, Database, Mail } from "lucide-react";
import renmaLogo from "@/assets/renma-logo.png";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Renma — Privacy" },
      {
        name: "description",
        content:
          "Renma is local-first. No accounts, no servers, no tracking. Here's exactly what the extension stores and why.",
      },
      { property: "og:title", content: "Renma — Privacy" },
      {
        property: "og:description",
        content:
          "How the Renma Chrome extension handles your data. Local-first, no tracking, no accounts.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

const PILLARS = [
  {
    icon: Server,
    title: "No servers",
    body: "Renma has no backend. There's nothing to send data to, even if we wanted to.",
  },
  {
    icon: Lock,
    title: "No accounts",
    body: "You never sign in. There's no identifier that ties activity to a person.",
  },
  {
    icon: Cookie,
    title: "No tracking",
    body: "No analytics SDKs, no telemetry, no third-party scripts inside the extension.",
  },
  {
    icon: Database,
    title: "Local storage only",
    body: "Rules, history, and stats live in chrome.storage.local on your machine.",
  },
];

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <TopBar />
      <main className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
            Privacy
          </div>
          <h1 className="h-display-lg">Local-first, always.</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/70 max-w-xl">
            This page is maintained by the Renma team to explain, in plain
            English, how the extension handles your data. Last updated{" "}
            <span className="text-ink">July 23, 2026</span>.
          </p>
        </motion.header>

        <section className="grid sm:grid-cols-2 gap-3 mb-16">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-5 rounded-2xl bg-surface-soft border border-hairline"
            >
              <p.icon className="w-4 h-4 text-coral" />
              <div className="mt-3 font-medium text-[15px] text-ink">{p.title}</div>
              <div className="mt-1 text-[13.5px] leading-relaxed text-body">{p.body}</div>
            </motion.div>
          ))}
        </section>

        <div className="prose-renma space-y-12">
          <Section title="What Renma stores">
            <p>
              Renma keeps three small pieces of data on your device, inside
              Chrome's <code>chrome.storage.local</code>:
            </p>
            <ul>
              <li>
                <strong>Your rules</strong> — filename templates, domain
                mappings, folder routes, duplicate mode, and site scope.
              </li>
              <li>
                <strong>Recent history</strong> — the last renamed files
                (original name, new name, source domain, timestamp) so the popup
                can show them and offer undo.
              </li>
              <li>
                <strong>Basic counters</strong> — how many files were renamed,
                grouped by domain, for the small stats view in Options.
              </li>
            </ul>
            <p>
              You can wipe all of it any time from the popup ("Clear history")
              or by removing the extension.
            </p>
          </Section>

          <Section title="What Renma does not do">
            <ul>
              <li>Send your filenames, URLs, or history anywhere.</li>
              <li>Read the contents of pages you visit.</li>
              <li>Include analytics, telemetry, or third-party scripts.</li>
              <li>Sync anything across devices or browsers.</li>
            </ul>
          </Section>

          <Section title="Permissions we ask for">
            <ul>
              <li>
                <strong>downloads</strong> — required to observe a download and
                suggest a new filename before the file is written.
              </li>
              <li>
                <strong>storage</strong> — required to remember your rules and
                recent history locally.
              </li>
              <li>
                <strong>notifications</strong> — optional; used only to show a
                small confirmation when a file is renamed.
              </li>
              <li>
                <strong>contextMenus</strong> — required to add the "Save with
                Renma" right-click entry.
              </li>
            </ul>
            <p>
              Renma asks for the minimum surface area that lets it do its one
              job.
            </p>
          </Section>

          <Section title="Image dimension reads">
            <p>
              If you enable dimension tokens (<code>{"{width}"}</code>,{" "}
              <code>{"{height}"}</code>), Renma briefly fetches the image bytes
              to read its size, then discards them. Nothing is uploaded and
              nothing is cached beyond the resulting number.
            </p>
          </Section>

          <Section title="Third parties">
            <p>
              The extension itself has no third-party integrations. This
              marketing website loads Google Fonts to render the wordmark; if
              you'd prefer to avoid that, browser-level font blocking works
              normally — Renma the extension is unaffected.
            </p>
          </Section>

          <Section title="Changes to this page">
            <p>
              If the extension ever starts handling data differently, this page
              gets updated first and the release notes reference the change.
            </p>
          </Section>

          <Section title="Contact">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-coral" />
              Questions or concerns? Open an issue on the GitHub repo — that's
              the fastest path to a real reply.
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif italic text-[26px] leading-tight mb-4">{title}</h2>
      <div className="text-[15px] leading-relaxed text-body space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_code]:font-mono [&_code]:text-[13px] [&_code]:bg-surface-card [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_strong]:text-ink">
        {children}
      </div>
    </section>
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
