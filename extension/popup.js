const listEl = document.getElementById("list");
const countEl = document.getElementById("count");

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

async function render() {
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

document.getElementById("clear").addEventListener("click", async () => {
  await chrome.storage.local.set({ history: [] });
  render();
});
document.getElementById("opts").addEventListener("click", (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

render();
