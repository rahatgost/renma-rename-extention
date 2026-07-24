const AI_HOSTS = [
  "openai.com",
  "chatgpt.com",
  "oaiusercontent.com",
  "midjourney.com",
  "leonardo.ai",
  "stability.ai",
  "ideogram.ai",
  "fal.ai",
];

const DEFAULT_IMAGE_EXTS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "bmp",
  "svg",
  "avif",
  "tiff",
  "ico",
  "heic",
];

const DEFAULT_TEMPLATE = "{prefix}_{date}_{time}_{counter}.{ext}";
const HISTORY_LIMIT = 50;
const SEEN_LIMIT = 300;
const SKIP_ONCE_LIMIT = 50;
const CACHE_LIMIT = 80;

const DEFAULTS = {
  enabled: true,
  template: DEFAULT_TEMPLATE,
  dateFolders: false,
  dateFolderFormat: "YYYY/MM/DD",
  siteMode: "all",
  siteList: [],
  customMappings: [],
  filetypes: DEFAULT_IMAGE_EXTS,
  onlyImages: true,
  counter: 0,
  history: [],
  notifications: false,
  duplicateMode: "tag",
  seenUrls: [],
  stats: { total: 0, byDomain: {}, byDay: {} },
  fetchDimensions: true,
  skipOnce: [],
  filenameCase: "preserve",
  maxNameLength: 120,
  aiPrefix: "AI_Generated",
  recentCache: [],
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
  if (item.mime?.startsWith("image/")) return true;
  return filetypes.includes(ext);
}

function siteAllowed(hostname, mode, list) {
  const hits = list.some((d) => d && hostname.includes(d.toLowerCase()));
  if (mode === "whitelist") return hits;
  if (mode === "blacklist") return !hits;
  return true;
}

function resolveMapping(hostname, mappings, aiPrefix) {
  for (const m of mappings) {
    if (m.domain && hostname.includes(m.domain.toLowerCase())) return m;
  }
  if (AI_HOSTS.some((h) => hostname.includes(h))) {
    return { prefix: aiPrefix || "AI_Generated", folder: "AI" };
  }
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

function sanitize(part, max = 80) {
  return String(part)
    .normalize("NFKD")
    .replace(/[\\?%*:|"<>\x00-\x1F]/g, "")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^[._-]+|[._-]+$/g, "")
    .slice(0, max) || "file";
}

function applyCase(name, mode) {
  if (mode === "lower") return name.toLowerCase();
  if (mode === "upper") return name.toUpperCase();
  if (mode === "title") {
    return name.replace(/(^|[_-])(\w)/g, (m, sep, ch) => sep + ch.toUpperCase());
  }
  return name;
}

function renderTemplate(template, tokens) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = tokens[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

async function pushHistory(entry) {
  const { history = [] } = await chrome.storage.local.get("history");
  history.unshift(entry);
  await chrome.storage.local.set({ history: history.slice(0, HISTORY_LIMIT) });
}

async function pushRecentCache(entry) {
  const { recentCache = [] } = await chrome.storage.local.get("recentCache");
  recentCache.unshift(entry);
  await chrome.storage.local.set({ recentCache: recentCache.slice(0, CACHE_LIMIT) });
}

async function nextCounter() {
  const { counter = 0 } = await chrome.storage.local.get("counter");
  const next = counter + 1;
  await chrome.storage.local.set({ counter: next });
  return next;
}

async function bumpStats(hostname, dateStr) {
  const { stats = { total: 0, byDomain: {}, byDay: {} } } =
    await chrome.storage.local.get("stats");
  stats.total = (stats.total || 0) + 1;
  stats.byDomain[hostname] = (stats.byDomain[hostname] || 0) + 1;
  stats.byDay[dateStr] = (stats.byDay[dateStr] || 0) + 1;
  const days = Object.keys(stats.byDay).sort();
  if (days.length > 30) {
    days.slice(0, days.length - 30).forEach((key) => delete stats.byDay[key]);
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

const MAX_DIM_BYTES = 8 * 1024 * 1024;

async function fetchDimensions(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1800);
    const res = await fetch(url, { signal: controller.signal, credentials: "omit" });
    clearTimeout(timer);
    if (!res.ok) return null;
    const len = Number(res.headers.get("content-length") || 0);
    if (len && len > MAX_DIM_BYTES) return null;
    const blob = await res.blob();
    if (blob.size > MAX_DIM_BYTES) return null;
    const bitmap = await createImageBitmap(blob);
    const dims = { width: bitmap.width, height: bitmap.height };
    bitmap.close?.();
    return dims;
  } catch {
    return null;
  }
}

chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  (async () => {
    const s = await getSettings();
    if (!s.enabled) return suggest();

    const ext = getExtension(item.filename);
    if (s.onlyImages && !isImage(item, ext, s.filetypes)) return suggest();

    const hostname = getHostname(item);
    if (!siteAllowed(hostname, s.siteMode, s.siteList)) return suggest();

    const url = item.finalUrl || item.url || "";

    if (url && Array.isArray(s.skipOnce) && s.skipOnce.includes(url)) {
      const remaining = s.skipOnce.filter((u) => u !== url);
      await chrome.storage.local.set({ skipOnce: remaining });
      if (s.notifications) notify("Renma — skipped once", "Original filename kept.");
      return suggest();
    }

    const isDup = url ? await checkAndTrackDuplicate(url) : false;
    if (isDup && s.duplicateMode === "skip") {
      if (s.notifications) notify("Renma — duplicate skipped", hostname || "unknown source");
      return suggest();
    }

    let dims = null;
    if (s.fetchDimensions && url && isImage(item, ext, s.filetypes)) {
      dims = await fetchDimensions(url);
    }

    const mapping = resolveMapping(hostname, s.customMappings, s.aiPrefix);
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
      originalName: sanitize(stripExt(item.filename), 72),
      ext: finalExt,
      width: dims?.width ?? "",
      height: dims?.height ?? "",
      dimensions: dims ? `${dims.width}x${dims.height}` : "",
    };

    let name = renderTemplate(s.template || DEFAULT_TEMPLATE, tokens)
      .replace(/_+/g, "_")
      .replace(/\._/g, ".")
      .replace(/_\./g, ".")
      .replace(/^_+|_+$/g, "");

    if (!name || name.startsWith(".")) name = renderTemplate(DEFAULT_TEMPLATE, tokens);
    name = applyCase(name, s.filenameCase);
    name = sanitize(name, Number(s.maxNameLength) || 120);
    if (!name.includes(".")) name = `${name}.${finalExt}`;

    const parts = [];
    if (mapping.folder) {
      mapping.folder.split("/").filter(Boolean).forEach((part) => parts.push(sanitize(part)));
    }
    if (s.dateFolders) {
      formatDate(now, s.dateFolderFormat || "YYYY/MM/DD")
        .split("/")
        .filter(Boolean)
        .forEach((part) => parts.push(sanitize(part)));
    }
    parts.push(name);
    const finalPath = parts.join("/");

    const historyEntry = {
      originalName: item.filename,
      newName: finalPath,
      domain: hostname,
      url,
      duplicate: isDup,
      dimensions: dims ? `${dims.width}x${dims.height}` : null,
      time: now.toISOString(),
    };

    await pushHistory(historyEntry);
    await pushRecentCache({ ...historyEntry, id: item.id });
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

async function undoLast() {
  const { history = [], skipOnce = [] } = await chrome.storage.local.get([
    "history",
    "skipOnce",
  ]);
  if (history.length === 0) return false;
  const last = history[0];
  const rest = history.slice(1);
  const nextSkip = last.url
    ? [last.url, ...skipOnce.filter((u) => u !== last.url)].slice(0, SKIP_ONCE_LIMIT)
    : skipOnce;
  await chrome.storage.local.set({ history: rest, skipOnce: nextSkip });
  notify("Renma — undo", "Next download of the same URL keeps the original name.");
  return true;
}

chrome.commands?.onCommand.addListener(async (cmd) => {
  if (cmd === "toggle-enabled") {
    const { enabled = true } = await chrome.storage.local.get("enabled");
    await chrome.storage.local.set({ enabled: !enabled });
    notify("Renma", !enabled ? "Renaming enabled" : "Renaming paused");
  } else if (cmd === "undo-last") {
    const ok = await undoLast();
    if (!ok) notify("Renma", "Nothing to undo.");
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "undo-last") {
    undoLast().then((ok) => sendResponse({ ok }));
    return true;
  }
});

function createMenus() {
  try {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: "renma-save-image",
        title: "Save image with Renma",
        contexts: ["image"],
      });
      chrome.contextMenus.create({
        id: "renma-toggle",
        title: "Toggle Renma renaming",
        contexts: ["action"],
      });
    });
  } catch {}
}

chrome.runtime.onInstalled.addListener(createMenus);
chrome.runtime.onStartup?.addListener(createMenus);

chrome.contextMenus?.onClicked.addListener(async (info) => {
  if (info.menuItemId === "renma-save-image" && info.srcUrl) {
    const { enabled = true } = await chrome.storage.local.get("enabled");
    const wasDisabled = !enabled;
    if (wasDisabled) await chrome.storage.local.set({ enabled: true });
    try {
      await chrome.downloads.download({ url: info.srcUrl, saveAs: false });
    } catch {
      notify("Renma", "Could not start download.");
    }
    if (wasDisabled) {
      setTimeout(() => chrome.storage.local.set({ enabled: false }), 5000);
    }
  } else if (info.menuItemId === "renma-toggle") {
    const { enabled = true } = await chrome.storage.local.get("enabled");
    await chrome.storage.local.set({ enabled: !enabled });
    notify("Renma", !enabled ? "Renaming enabled" : "Renaming paused");
  }
});