const AI_HOSTS = ["openai.com", "chatgpt.com", "oaiusercontent.com"];
const IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "avif", "tiff", "ico"];

function getHostname(item) {
  try {
    return new URL(item.finalUrl || item.url || "").hostname || "";
  } catch {
    return "";
  }
}

function getExtension(filename) {
  const idx = filename.lastIndexOf(".");
  if (idx === -1 || idx === filename.length - 1) return "";
  return filename.slice(idx + 1).toLowerCase();
}

function domainPrefix(hostname) {
  const clean = hostname.replace(/^www\./, "");
  const parts = clean.split(".");
  if (parts.length <= 1) return clean || "download";
  // drop TLD
  return parts.slice(0, -1).join("_") || clean;
}

function isImage(item, ext) {
  if (item.mime && item.mime.startsWith("image/")) return true;
  return IMAGE_EXTS.includes(ext);
}

async function getCustomMappings() {
  const { customMappings = [] } = await chrome.storage.local.get("customMappings");
  return customMappings;
}

async function pushHistory(entry) {
  const { history = [] } = await chrome.storage.local.get("history");
  history.unshift(entry);
  await chrome.storage.local.set({ history: history.slice(0, 5) });
}

function resolvePrefix(hostname, mappings) {
  for (const m of mappings) {
    if (m.domain && hostname.includes(m.domain.toLowerCase())) return m.prefix;
  }
  if (AI_HOSTS.some((h) => hostname.includes(h))) return "AI_Generated";
  return domainPrefix(hostname);
}

chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  const ext = getExtension(item.filename);
  if (!isImage(item, ext)) {
    suggest();
    return;
  }

  const hostname = getHostname(item).toLowerCase();

  (async () => {
    const mappings = await getCustomMappings();
    const prefix = resolvePrefix(hostname, mappings);
    const timestamp = Date.now();
    const finalExt = ext || "png";
    const newName = `${prefix}_${timestamp}.${finalExt}`;

    await pushHistory({
      originalName: item.filename,
      newName,
      domain: hostname,
      time: new Date().toISOString(),
    });

    suggest({ filename: newName });
  })();

  return true; // keep suggest() available async
});
