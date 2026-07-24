const listEl = document.getElementById("list");
const countEl = document.getElementById("count");
const searchEl = document.getElementById("search");
const masterSwitch = document.getElementById("masterSwitch");
const toggleTitle = document.getElementById("toggleTitle");
const toggleSub = document.getElementById("toggleSub");
const siteRow = document.getElementById("siteRow");
const siteHostEl = document.getElementById("siteHost");
const siteToggleBtn = document.getElementById("siteToggle");
const statToday = document.getElementById("statToday");
const statTotal = document.getElementById("statTotal");
const statSources = document.getElementById("statSources");
const filters = document.getElementById("filters");

let cachedHistory = [];
let activeFilter = "all";

function fmtTime(iso) {
  try {
    const d = new Date(iso);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
}

function isToday(iso) {
  try {
    return new Date(iso).toDateString() === new Date().toDateString();
  } catch {
    return false;
  }
}

function baseDomain(host) {
  const clean = host.replace(/^www\./, "");
  const parts = clean.split(".");
  return parts.length <= 2 ? clean : parts.slice(-2).join(".");
}

function aiLike(h) {
  const hay = `${h.domain || ""} ${h.newName || ""}`.toLowerCase();
  return (
    hay.includes("ai_generated") ||
    hay.includes("chatgpt") ||
    hay.includes("openai") ||
    hay.includes("oaiusercontent")
  );
}

function applyMode(entries) {
  if (activeFilter === "ai") return entries.filter(aiLike);
  if (activeFilter === "duplicates") return entries.filter((h) => h.duplicate);
  if (activeFilter === "today") return entries.filter((h) => isToday(h.time));
  return entries;
}

function paint(entries) {
  countEl.textContent = String(cachedHistory.length);
  const shown = applyMode(entries);

  if (shown.length === 0) {
    listEl.innerHTML = `
      <div class="empty">
        <div class="title">${cachedHistory.length === 0 ? "Nothing renamed yet." : "No matches."}</div>
        <div class="sub">${
          cachedHistory.length === 0
            ? "Save an image — Renma will clean the name instantly."
            : "Try another search or filter."
        }</div>
      </div>`;
    return;
  }

  listEl.innerHTML = "";
  shown.forEach((h, idx) => {
    const div = document.createElement("div");
    div.className = "item";

    const nw = document.createElement("div");
    nw.className = "new";
    nw.textContent = h.newName;

    const od = document.createElement("div");
    od.className = "old";
    od.textContent = h.originalName;

    const mt = document.createElement("div");
    mt.className = "meta";

    const domain = document.createElement("span");
    domain.className = "chip domain";
    domain.textContent = h.domain || "unknown";
    mt.appendChild(domain);

    if (h.dimensions) {
      const dm = document.createElement("span");
      dm.className = "chip dim";
      dm.textContent = h.dimensions;
      mt.appendChild(dm);
    }

    if (h.duplicate) {
      const dp = document.createElement("span");
      dp.className = "chip dup";
      dp.textContent = "duplicate";
      mt.appendChild(dp);
    }

    const time = document.createElement("span");
    time.className = "time";
    time.textContent = fmtTime(h.time);
    mt.appendChild(time);

    if (idx === 0 && activeFilter === "all" && !searchEl.value.trim()) {
      const undoBtn = document.createElement("button");
      undoBtn.className = "undo";
      undoBtn.textContent = "Undo";
      undoBtn.onclick = async () => {
        undoBtn.disabled = true;
        undoBtn.textContent = "Undone";
        try {
          await chrome.runtime.sendMessage({ type: "undo-last" });
        } catch {
          const { history = [], skipOnce = [] } = await chrome.storage.local.get([
            "history",
            "skipOnce",
          ]);
          const [last, ...rest] = history;
          const nextSkip = last?.url
            ? [last.url, ...skipOnce.filter((u) => u !== last.url)].slice(0, 50)
            : skipOnce;
          await chrome.storage.local.set({ history: rest, skipOnce: nextSkip });
        }
        setTimeout(renderHistory, 250);
      };
      mt.appendChild(undoBtn);
    }

    div.append(nw, od, mt);
    listEl.appendChild(div);
  });
}

function applyFilter() {
  const q = (searchEl.value || "").toLowerCase().trim();
  const entries = !q
    ? cachedHistory
    : cachedHistory.filter((h) =>
        [h.newName, h.originalName, h.domain, h.dimensions].some((v) =>
          String(v || "").toLowerCase().includes(q)
        )
      );
  paint(entries);
}

async function renderHistory() {
  const { history = [] } = await chrome.storage.local.get("history");
  cachedHistory = history;
  applyFilter();
}

async function renderStats() {
  const { stats = { total: 0, byDomain: {}, byDay: {} } } =
    await chrome.storage.local.get("stats");
  const today = new Date().toISOString().slice(0, 10);
  statToday.textContent = String(stats.byDay?.[today] || 0);
  statTotal.textContent = String(stats.total || 0);
  statSources.textContent = String(Object.keys(stats.byDomain || {}).length);
}

async function renderToggle() {
  const { enabled = true } = await chrome.storage.local.get("enabled");
  masterSwitch.classList.toggle("on", enabled);
  masterSwitch.setAttribute("aria-checked", String(enabled));
  toggleTitle.textContent = enabled ? "Renaming on" : "Renaming paused";
  toggleSub.textContent = enabled
    ? "Downloads will be source-aware and searchable."
    : "Files will keep their original names.";
}

async function renderSiteRow() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url || tab.url.startsWith("chrome://")) return;

    const host = new URL(tab.url).hostname;
    if (!host || host === "newtab") return;

    const domain = baseDomain(host);
    siteHostEl.textContent = domain;
    siteRow.style.display = "flex";

    const { siteMode = "all", siteList = [] } = await chrome.storage.local.get([
      "siteMode",
      "siteList",
    ]);
    const inList = siteList.some((d) => domain.includes(d) || d.includes(domain));
    const skipping =
      (siteMode === "blacklist" && inList) || (siteMode === "whitelist" && !inList);

    siteToggleBtn.classList.toggle("active", skipping);
    siteToggleBtn.textContent = skipping ? "Skipping — undo" : "Skip this site";

    siteToggleBtn.onclick = async () => {
      const s = await chrome.storage.local.get(["siteMode", "siteList"]);
      let mode = s.siteMode || "all";
      let list = Array.isArray(s.siteList) ? [...s.siteList] : [];
      const idx = list.indexOf(domain);
      if (mode === "whitelist") {
        idx === -1 ? list.push(domain) : list.splice(idx, 1);
      } else {
        mode = "blacklist";
        idx === -1 ? list.push(domain) : list.splice(idx, 1);
      }
      await chrome.storage.local.set({ siteMode: mode, siteList: list });
      renderSiteRow();
    };
  } catch {}
}

masterSwitch.addEventListener("click", async () => {
  const { enabled = true } = await chrome.storage.local.get("enabled");
  await chrome.storage.local.set({ enabled: !enabled });
  renderToggle();
});

filters.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-filter]");
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  filters.querySelectorAll(".filter").forEach((b) => b.classList.toggle("active", b === btn));
  applyFilter();
});

searchEl.addEventListener("input", applyFilter);

document.getElementById("clear").addEventListener("click", async () => {
  await chrome.storage.local.set({ history: [] });
  renderHistory();
});

document.getElementById("export").addEventListener("click", async () => {
  const { history = [] } = await chrome.storage.local.get("history");
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `renma-history-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

document.getElementById("opts").addEventListener("click", (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

renderHistory();
renderStats();
renderToggle();
renderSiteRow();