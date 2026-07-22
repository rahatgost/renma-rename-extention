const AI_HOSTS = ["openai.com", "chatgpt.com", "oaiusercontent.com"];
const DEFAULT_IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "avif", "tiff", "ico", "heic"];
const DEFAULT_TEMPLATE = "{prefix}_{timestamp}.{ext}";
const HISTORY_LIMIT = 50;
const SEEN_LIMIT = 300;

const DEFAULTS = {
  enabled: true,
  template: DEFAULT_TEMPLATE,
  dateFolders: false,
  dateFolderFormat: "YYYY/MM/DD",
  siteMode: "all", // "all" | "whitelist" | "blacklist"
  siteList: [],
  customMappings: [], // [{domain, prefix, folder?}]
  filetypes: DEFAULT_IMAGE_EXTS,
  onlyImages: true,
  counter: 0,
  history: [],
  // new
  notifications: false,
  duplicateMode: "tag", // "off" | "tag" | "skip"
  seenUrls: [], // recent URLs (bounded)
  stats: { total: 0, byDomain: {}, byDay: {} },
};

async function getSettings() {
  const stored = await chrome.storage.local.get(Object.keys(DEFAULTS));
  return { ...DEFAULTS, ...stored };
}

function getHostname(item) {
  try {
    return (new URL(item.finalUrl || item.url || "").hostname || "").toLowerCase();
  } catch {
    return "";
  }
}

function getExtension(filename) {
  const idx = filename.lastIndexOf(".");
  if (idx === -1 || idx === filename.length - 1) return "";
  return filename.slice(idx + 1).toLowerCase();
}

function stripExt(filename) {
  const idx = filename.lastIndexOf(".");
  return idx === -1 ? filename : filename.slice(0, idx);
}

function domainPrefix(hostname) {
  const clean = hostname.replace(/^www\./, "");
  const parts = clean.split(".");
  if (parts.length <= 1) return clean || "download";
  return parts.slice(0, -1).join("_") || clean;
}

function isImage(item, ext, filetypes) {
  if (item.mime && item.mime.startsWith("image/")) return true;
  return filetypes.includes(ext);
}

function siteAllowed(hostname, mode, list) {
  const hits = list.some((d) => d && hostname.includes(d.toLowerCase()));
  if (mode === "whitelist") return hits;
  if (mode === "blacklist") return !hits;
  return true;
}

function resolveMapping(hostname, mappings) {
  for (const m of mappings) {
    if (m.domain && hostname.includes(m.domain.toLowerCase())) return m;
  }
  if (AI_HOSTS.some((h) => hostname.includes(h))) return { prefix: "AI_Generated" };
  return { prefix: domainPrefix(hostname) };
}

function pad(n, w = 2) {
  return String(n).padStart(w, "0");
}

function formatDate(d, fmt) {
  const map = {
    YYYY: d.getFullYear(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  };
  return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, (k) => map[k]);
}

function sanitize(part) {
  return String(part)
    .replace(/[\\?%*:|"<>\x00-\x1F]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^[._-]+|[._-]+$/g, "")
    .slice(0, 80) || "file";
}

function renderTemplate(template, tokens) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const v = tokens[key];
    return v === undefined || v === null ? "" : String(v);
  });
}

async function pushHistory(entry) {
  const { history = [] } = await chrome.storage.local.get("history");
  history.unshift(entry);
  await chrome.storage.local.set({ history: history.slice(0, HISTORY_LIMIT) });
}

async function nextCounter() {
  const { counter = 0 } = await chrome.storage.local.get("counter");
  const next = counter + 1;
  await chrome.storage.local.set({ counter: next });
  return next;
}

async function bumpStats(hostname, dateStr) {
  const { stats = { total: 0, byDomain: {}, byDay: {} } } = await chrome.storage.local.get("stats");
  stats.total = (stats.total || 0) + 1;
  stats.byDomain[hostname] = (stats.byDomain[hostname] || 0) + 1;
  stats.byDay[dateStr] = (stats.byDay[dateStr] || 0) + 1;
  // keep byDay bounded to last 30 keys
  const days = Object.keys(stats.byDay).sort();
  if (days.length > 30) {
    const drop = days.slice(0, days.length - 30);
    drop.forEach((k) => delete stats.byDay[k]);
  }
  await chrome.storage.local.set({ stats });
}

async function checkAndTrackDuplicate(url) {
  const { seenUrls = [] } = await chrome.storage.local.get("seenUrls");
  const isDup = seenUrls.includes(url);
  if (!isDup) {
    seenUrls.unshift(url);
    await chrome.storage.local.set({ seenUrls: seenUrls.slice(0, SEEN_LIMIT) });
  }
  return isDup;
}

function notify(title, message) {
  try {
    chrome.notifications?.create({
      type: "basic",
      iconUrl: "icon-128.png",
      title,
      message,
      priority: 0,
    });
  } catch {}
}

chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  (async () => {
    const s = await getSettings();

    if (!s.enabled) return suggest();

    const ext = getExtension(item.filename);
    if (s.onlyImages && !isImage(item, ext, s.filetypes)) return suggest();

    const hostname = getHostname(item);
    if (!siteAllowed(hostname, s.siteMode, s.siteList)) return suggest();

    // Duplicate handling
    const url = item.finalUrl || item.url || "";
    const isDup = url ? await checkAndTrackDuplicate(url) : false;
    if (isDup && s.duplicateMode === "skip") {
      if (s.notifications) notify("Renma — duplicate skipped", hostname || "unknown source");
      return suggest();
    }

    const mapping = resolveMapping(hostname, s.customMappings);
    const now = new Date();
    const counter = await nextCounter();
    const finalExt = ext || "png";

    const tokens = {
      prefix: sanitize(mapping.prefix || domainPrefix(hostname)),
      domain: sanitize(domainPrefix(hostname)),
      host: sanitize(hostname.replace(/^www\./, "")),
      date: formatDate(now, "YYYY-MM-DD"),
      time: formatDate(now, "HH-mm-ss"),
      timestamp: now.getTime(),
      counter: pad(counter, 4),
      originalName: sanitize(stripExt(item.filename)),
      ext: finalExt,
    };

    let name = renderTemplate(s.template || DEFAULT_TEMPLATE, tokens);
    if (!name || name.startsWith(".")) name = renderTemplate(DEFAULT_TEMPLATE, tokens);

    const parts = [];
    if (mapping.folder) {
      mapping.folder.split("/").filter(Boolean).forEach((p) => parts.push(sanitize(p)));
    }
    if (s.dateFolders) {
      formatDate(now, s.dateFolderFormat || "YYYY/MM/DD")
        .split("/")
        .filter(Boolean)
        .forEach((p) => parts.push(sanitize(p)));
    }
    parts.push(name);
    const finalPath = parts.join("/");

    await pushHistory({
      originalName: item.filename,
      newName: finalPath,
      domain: hostname,
      url,
      duplicate: isDup,
      time: now.toISOString(),
    });
    await bumpStats(hostname || "unknown", formatDate(now, "YYYY-MM-DD"));

    if (s.notifications) {
      notify(
        isDup ? "Renma — duplicate renamed" : "Renma — renamed",
        `${item.filename} → ${finalPath}`
      );
    }

    suggest({ filename: finalPath, conflictAction: "uniquify" });
  })();

  return true;
});
