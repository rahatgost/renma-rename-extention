const AI_HOSTS = ["openai.com", "chatgpt.com", "oaiusercontent.com"];
const DEFAULT_IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "avif", "tiff", "ico", "heic"];
const DEFAULT_TEMPLATE = "{prefix}_{timestamp}.{ext}";
const HISTORY_LIMIT = 50;
const SEEN_LIMIT = 300;
const SKIP_ONCE_LIMIT = 50;

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
};

async function getSettings() {
  const stored = await chrome.storage.local.get(Object.keys(DEFAULTS));
  return { ...DEFAULTS, ...stored };
}

function getHostname(item) {
  try { return (new URL(item.finalUrl || item.url || "").hostname || "").toLowerCase(); }
  catch { return ""; }
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
function pad(n, w = 2) { return String(n).padStart(w, "0"); }
function formatDate(d, fmt) {
  const map = {
    YYYY: d.getFullYear(), MM: pad(d.getMonth() + 1), DD: pad(d.getDate()),
    HH: pad(d.getHours()), mm: pad(d.getMinutes()), ss: pad(d.getSeconds()),
  };
  return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, (k) => map[k]);
}
function sanitize(part) {
  return String(part)
    .replace(/[\\?%*:|"<>\x00-\x1F]/g, "")
    .replace(/\s+/g, "_").replace(/_+/g, "_")
    .replace(/^[._-]+|[._-]+$/g, "").slice(0, 80) || "file";
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
  const days = Object.keys(stats.byDay).sort();
  if (days.length > 30) days.slice(0, days.length - 30).forEach((k) => delete stats.byDay[k]);
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
      type: "basic", iconUrl: "icon-128.png", title, message, priority: 0,
    });
  } catch {}
}

// Fetch image dimensions (best-effort, capped size + short timeout so we
// never block Chrome's onDeterminingFilename beyond its ~4s budget).
const MAX_DIM_BYTES = 8 * 1024 * 1024; // 8 MB
async function fetchDimensions(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
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

    // Skip-once (from Undo)
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

    // Dimensions (best-effort)
    let dims = null;
    if (s.fetchDimensions && url && isImage(item, ext, s.filetypes)) {
      dims = await fetchDimensions(url);
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
      width: dims?.width ?? "",
      height: dims?.height ?? "",
      dimensions: dims ? `${dims.width}x${dims.height}` : "",
    };

    let name = renderTemplate(s.template || DEFAULT_TEMPLATE, tokens);
    // clean up empty dimension gaps like "__" or trailing "_."
    name = name.replace(/_+/g, "_").replace(/_\./g, ".").replace(/^_+|_+$/g, "");
    if (!name || name.startsWith(".")) name = renderTemplate(DEFAULT_TEMPLATE, tokens);

    const parts = [];
    if (mapping.folder) mapping.folder.split("/").filter(Boolean).forEach((p) => parts.push(sanitize(p)));
    if (s.dateFolders) {
      formatDate(now, s.dateFolderFormat || "YYYY/MM/DD").split("/").filter(Boolean).forEach((p) => parts.push(sanitize(p)));
    }
    parts.push(name);
    const finalPath = parts.join("/");

    await pushHistory({
      originalName: item.filename,
      newName: finalPath,
      domain: hostname,
      url,
      duplicate: isDup,
      dimensions: dims ? `${dims.width}x${dims.height}` : null,
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

/* ---------------- Undo (skip-once) ---------------- */
async function undoLast() {
  const { history = [], skipOnce = [] } = await chrome.storage.local.get(["history", "skipOnce"]);
  if (history.length === 0) return false;
  const last = history[0];
  const rest = history.slice(1);
  const nextSkip = last.url ? [last.url, ...skipOnce.filter((u) => u !== last.url)].slice(0, SKIP_ONCE_LIMIT) : skipOnce;
  await chrome.storage.local.set({ history: rest, skipOnce: nextSkip });
  notify("Renma — undo", `Removed from history. Next download of same URL keeps original name.`);
  return true;
}

/* ---------------- Commands (keyboard shortcuts) ---------------- */
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

/* ---------------- Messages from popup ---------------- */
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "undo-last") {
    undoLast().then((ok) => sendResponse({ ok }));
    return true;
  }
});

/* ---------------- Context menu: force-rename an image ---------------- */
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

chrome.contextMenus?.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "renma-save-image" && info.srcUrl) {
    // Ensure renaming is enabled for this download, then restore prior state
    // only AFTER the download has been initiated (avoids a race where
    // onDeterminingFilename fires after we've flipped enabled back to false).
    const { enabled = true } = await chrome.storage.local.get("enabled");
    const wasDisabled = !enabled;
    if (wasDisabled) await chrome.storage.local.set({ enabled: true });
    try {
      await chrome.downloads.download({ url: info.srcUrl, saveAs: false });
    } catch (e) {
      notify("Renma", "Could not start download.");
    }
    if (wasDisabled) {
      // Give onDeterminingFilename time to fire (dimension fetch can take ~2s).
      setTimeout(() => chrome.storage.local.set({ enabled: false }), 5000);
    }
  } else if (info.menuItemId === "renma-toggle") {
    const { enabled = true } = await chrome.storage.local.get("enabled");
    await chrome.storage.local.set({ enabled: !enabled });
    notify("Renma", !enabled ? "Renaming enabled" : "Renaming paused");
  }
});
