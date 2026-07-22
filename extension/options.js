const DEFAULT_TEMPLATE = "{prefix}_{timestamp}.{ext}";
const TOKENS = ["prefix", "domain", "host", "date", "time", "timestamp", "counter", "originalName", "ext"];

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

/* ---------- Init ---------- */
bindSwitch("sw-enabled", "enabled", true);
bindSwitch("sw-onlyImages", "onlyImages", true);
bindSwitch("sw-dateFolders", "dateFolders", false);
renderTokens();
loadTemplate();
renderMappings();
renderMode();
renderSites();
