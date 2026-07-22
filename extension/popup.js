const listEl = document.getElementById("list");
const countEl = document.getElementById("count");
const masterSwitch = document.getElementById("masterSwitch");
const toggleTitle = document.getElementById("toggleTitle");
const toggleSub = document.getElementById("toggleSub");
const siteRow = document.getElementById("siteRow");
const siteHostEl = document.getElementById("siteHost");
const siteToggleBtn = document.getElementById("siteToggle");

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

function baseDomain(host) {
  const clean = host.replace(/^www\./, "");
  const parts = clean.split(".");
  return parts.length <= 2 ? clean : parts.slice(-2).join(".");
}

async function renderHistory() {
  const { history = [] } = await chrome.storage.local.get("history");
  countEl.textContent = String(history.length);
  if (history.length === 0) {
    listEl.innerHTML = `
      <div class="empty">
        <div class="title">Nothing renamed yet.</div>
        <div class="sub">Save an image — renma will do the rest.</div>
      </div>`;
    return;
  }
  listEl.innerHTML = "";
  history.forEach((h) => {
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
    const pill = document.createElement("span");
    pill.className = "domain-pill";
    pill.textContent = h.domain || "unknown";
    const time = document.createElement("span");
    time.className = "time";
    time.textContent = fmtTime(h.time);
    mt.append(pill, time);
    div.append(nw, od, mt);
    listEl.appendChild(div);
  });
}

async function renderToggle() {
  const { enabled = true } = await chrome.storage.local.get("enabled");
  masterSwitch.classList.toggle("on", enabled);
  masterSwitch.setAttribute("aria-checked", String(enabled));
  toggleTitle.textContent = enabled ? "Renaming on" : "Renaming paused";
  toggleSub.textContent = enabled
    ? "Downloads will be auto-renamed"
    : "Files save with their original names";
}

async function renderSiteRow() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) return;
    const host = new URL(tab.url).hostname;
    if (!host || host === "newtab" || tab.url.startsWith("chrome://")) return;
    const domain = baseDomain(host);
    siteHostEl.textContent = domain;
    siteRow.style.display = "flex";

    const { siteMode = "all", siteList = [] } = await chrome.storage.local.get([
      "siteMode",
      "siteList",
    ]);
    const inList = siteList.some((d) => domain.includes(d) || d.includes(domain));
    const skipping = siteMode === "blacklist" && inList;

    siteToggleBtn.classList.toggle("active", skipping);
    siteToggleBtn.textContent = skipping ? "Skipping — undo" : "Skip this site";

    siteToggleBtn.onclick = async () => {
      const s = await chrome.storage.local.get(["siteMode", "siteList"]);
      let mode = s.siteMode || "all";
      let list = s.siteList || [];
      if (mode !== "blacklist") mode = "blacklist";
      const idx = list.indexOf(domain);
      if (idx === -1) list.push(domain);
      else list.splice(idx, 1);
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

document.getElementById("clear").addEventListener("click", async () => {
  await chrome.storage.local.set({ history: [] });
  renderHistory();
});
document.getElementById("opts").addEventListener("click", (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

renderHistory();
renderToggle();
renderSiteRow();
