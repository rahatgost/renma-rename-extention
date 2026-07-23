const DEFAULT_TEMPLATE = "{prefix}_{timestamp}.{ext}";
const TOKENS = ["prefix", "domain", "host", "date", "time", "timestamp", "counter", "originalName", "ext", "width", "height", "dimensions"];

const $ = (id) => document.getElementById(id);

async function get(keys) {
  return chrome.storage.local.get(keys);
}
async function set(obj) {
  return chrome.storage.local.set(obj);
}

/* ---------- Toggles ---------- */
function bindSwitch(id, key, defVal = false) {
  const el = $(id);
  chrome.storage.local.get(key).then((s) => {
    const v = key in s ? s[key] : defVal;
    el.classList.toggle("on", !!v);
  });
  el.addEventListener("click", async () => {
    const s = await chrome.storage.local.get(key);
    const cur = key in s ? s[key] : defVal;
    const next = !cur;
    await chrome.storage.local.set({ [key]: next });
    el.classList.toggle("on", next);
  });
}

/* ---------- Template ---------- */
const templateEl = $("template");
const previewEl = $("preview");
const tokenListEl = $("tokenList");

function renderTokens() {
  tokenListEl.innerHTML =
    "Tokens: " +
    TOKENS.map((t) => `<code data-tok="{${t}}">{${t}}</code>`).join(" ");
  tokenListEl.querySelectorAll("code").forEach((c) =>
    c.addEventListener("click", () => {
      const t = c.dataset.tok;
      const start = templateEl.selectionStart ?? templateEl.value.length;
      const end = templateEl.selectionEnd ?? templateEl.value.length;
      templateEl.value =
        templateEl.value.slice(0, start) + t + templateEl.value.slice(end);
      templateEl.focus();
      templateEl.selectionStart = templateEl.selectionEnd = start + t.length;
      saveTemplate();
    })
  );
}

function pad(n, w = 2) { return String(n).padStart(w, "0"); }

function previewFor(template) {
  const now = new Date();
  const tokens = {
    prefix: "Unsplash",
    domain: "unsplash",
    host: "unsplash.com",
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`,
    timestamp: now.getTime(),
    counter: "0042",
    originalName: "photo-hero",
    ext: "jpg",
    width: "1920",
    height: "1080",
    dimensions: "1920x1080",
  };
  return (template || DEFAULT_TEMPLATE).replace(/\{(\w+)\}/g, (_, k) =>
    tokens[k] === undefined ? "" : String(tokens[k])
  );
}

async function loadTemplate() {
  const { template = DEFAULT_TEMPLATE } = await get("template");
  templateEl.value = template;
  previewEl.textContent = previewFor(template);
}

async function saveTemplate() {
  const v = templateEl.value.trim() || DEFAULT_TEMPLATE;
  previewEl.textContent = previewFor(v);
  await set({ template: v });
}
templateEl.addEventListener("input", saveTemplate);

/* ---------- Mappings ---------- */
const mapListEl = $("mapList");
const mStatus = $("m-status");

function flash(el, msg) {
  el.textContent = msg;
  setTimeout(() => (el.textContent = ""), 1500);
}

async function renderMappings() {
  const { customMappings = [] } = await get("customMappings");
  mapListEl.innerHTML = "";
  if (customMappings.length === 0) {
    mapListEl.innerHTML = `<tr><td colspan="4" class="empty-cell">No custom rules yet — add your first below.</td></tr>`;
    return;
  }
  customMappings.forEach((m, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="mono"></td>
      <td class="prefix-cell"></td>
      <td class="mono"></td>
      <td style="text-align:right"><button class="del" data-i="${i}">Remove</button></td>`;
    tr.children[0].textContent = m.domain;
    tr.children[1].textContent = m.prefix;
    tr.children[2].textContent = m.folder || "—";
    mapListEl.appendChild(tr);
  });
  mapListEl.querySelectorAll(".del").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const i = Number(e.target.dataset.i);
      const { customMappings = [] } = await get("customMappings");
      customMappings.splice(i, 1);
      await set({ customMappings });
      flash(mStatus, "Removed");
      renderMappings();
    })
  );
}

$("m-add").addEventListener("click", async () => {
  const domain = $("m-domain").value.trim().toLowerCase();
  const prefix = $("m-prefix").value.trim();
  const folder = $("m-folder").value.trim();
  if (!domain || !prefix) return flash(mStatus, "Domain and prefix are required");
  const { customMappings = [] } = await get("customMappings");
  customMappings.push({ domain, prefix, folder: folder || undefined });
  await set({ customMappings });
  $("m-domain").value = ""; $("m-prefix").value = ""; $("m-folder").value = "";
  flash(mStatus, "Saved");
  renderMappings();
});

/* ---------- Site scope ---------- */
const modeSeg = $("modeSeg");
const siteChipsEl = $("siteChips");

async function renderMode() {
  const { siteMode = "all" } = await get("siteMode");
  modeSeg.querySelectorAll("button").forEach((b) =>
    b.classList.toggle("active", b.dataset.mode === siteMode)
  );
}
modeSeg.querySelectorAll("button").forEach((b) =>
  b.addEventListener("click", async () => {
    await set({ siteMode: b.dataset.mode });
    renderMode();
  })
);

async function renderSites() {
  const { siteList = [] } = await get("siteList");
  siteChipsEl.innerHTML = "";
  if (siteList.length === 0) {
    siteChipsEl.innerHTML = `<span style="font-size:12px;color:var(--muted-soft)">No sites yet.</span>`;
    return;
  }
  siteList.forEach((d, i) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `<span></span><button data-i="${i}" aria-label="Remove">×</button>`;
    chip.children[0].textContent = d;
    siteChipsEl.appendChild(chip);
  });
  siteChipsEl.querySelectorAll("button").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const i = Number(e.currentTarget.dataset.i);
      const { siteList = [] } = await get("siteList");
      siteList.splice(i, 1);
      await set({ siteList });
      renderSites();
    })
  );
}

$("s-add").addEventListener("click", async () => {
  const domain = $("s-domain").value.trim().toLowerCase();
  if (!domain) return;
  const { siteList = [] } = await get("siteList");
  if (!siteList.includes(domain)) siteList.push(domain);
  await set({ siteList });
  $("s-domain").value = "";
  renderSites();
});

/* ---------- Duplicate mode ---------- */
const dupSeg = $("dupSeg");
async function renderDupMode() {
  const { duplicateMode = "tag" } = await get("duplicateMode");
  dupSeg.querySelectorAll("button").forEach((b) =>
    b.classList.toggle("active", b.dataset.mode === duplicateMode)
  );
}
dupSeg.querySelectorAll("button").forEach((b) =>
  b.addEventListener("click", async () => {
    await set({ duplicateMode: b.dataset.mode });
    renderDupMode();
  })
);

/* ---------- Counter ---------- */
async function renderCounter() {
  const { counter = 0 } = await get("counter");
  $("counterVal").textContent = String(counter).padStart(4, "0");
}
$("resetCounter").addEventListener("click", async () => {
  await set({ counter: 0 });
  renderCounter();
});

/* ---------- Stats ---------- */
async function renderStats() {
  const { stats = { total: 0, byDomain: {}, byDay: {} } } = await get("stats");
  const today = new Date().toISOString().slice(0, 10);
  $("stat-total").textContent = stats.total || 0;
  $("stat-today").textContent = stats.byDay?.[today] || 0;
  $("stat-sources").textContent = Object.keys(stats.byDomain || {}).length;

  const entries = Object.entries(stats.byDomain || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = entries[0]?.[1] || 1;
  const top = $("topDomains");
  top.innerHTML = "";
  if (entries.length === 0) {
    top.innerHTML = `<div style="font-family:'Instrument Serif',serif;font-size:15px;color:var(--muted-soft);text-align:center;padding:20px">No downloads tracked yet.</div>`;
    return;
  }
  entries.forEach(([domain, count]) => {
    const pct = (count / max) * 100;
    const row = document.createElement("div");
    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
        <span style="font-family:'JetBrains Mono',monospace;font-size:12.5px;color:var(--body)"></span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--coral);font-weight:500"></span>
      </div>
      <div style="height:6px;background:var(--surface-soft);border-radius:999px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:var(--coral);border-radius:999px"></div>
      </div>`;
    row.children[0].children[0].textContent = domain;
    row.children[0].children[1].textContent = count;
    top.appendChild(row);
  });
}
$("resetStats").addEventListener("click", async () => {
  await set({ stats: { total: 0, byDomain: {}, byDay: {} } });
  renderStats();
});

/* ---------- Backup ---------- */
const bStatus = $("b-status");
const BACKUP_KEYS = [
  "enabled", "template", "dateFolders", "dateFolderFormat",
  "siteMode", "siteList", "customMappings", "filetypes",
  "onlyImages", "notifications", "duplicateMode",
];
$("exportSettings").addEventListener("click", async () => {
  const data = await get(BACKUP_KEYS);
  const blob = new Blob([JSON.stringify({ __renma: 1, version: 1, data }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `renma-settings-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  flash(bStatus, "Exported");
});
$("importFile").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const data = parsed.data || parsed;
    const clean = {};
    BACKUP_KEYS.forEach((k) => { if (k in data) clean[k] = data[k]; });
    await set(clean);
    flash(bStatus, "Imported — reloading");
    setTimeout(() => location.reload(), 700);
  } catch (err) {
    bStatus.style.color = "#c64545";
    bStatus.textContent = "Invalid file";
    setTimeout(() => { bStatus.textContent = ""; bStatus.style.color = ""; }, 2000);
  }
});

/* ---------- Init ---------- */
bindSwitch("sw-enabled", "enabled", true);
bindSwitch("sw-onlyImages", "onlyImages", true);
bindSwitch("sw-dateFolders", "dateFolders", false);
bindSwitch("sw-notifications", "notifications", false);
renderTokens();
loadTemplate();
renderMappings();
renderMode();
renderSites();
renderDupMode();
renderCounter();
renderStats();
