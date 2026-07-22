const listEl = document.getElementById("list");

function fmtTime(iso) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

async function render() {
  const { history = [] } = await chrome.storage.local.get("history");
  if (history.length === 0) {
    listEl.innerHTML = `<div class="empty">No renames yet.</div>`;
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
    od.textContent = "was: " + h.originalName;
    const mt = document.createElement("div");
    mt.className = "meta";
    mt.textContent = `${h.domain || "unknown"} · ${fmtTime(h.time)}`;
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
