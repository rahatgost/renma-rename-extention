const RELEASES = [
  {
    version: "1.5.1",
    date: "Jul 25, 2026",
    tag: "Patch",
    title: "First-run changelog",
    items: [
      { kind: "New", text: "What's-new page opens automatically on install and after every update." },
      { kind: "Polish", text: "Tracks the last-seen version so you only see notes once per release." },
    ],
  },
  {
    version: "1.5.0",
    date: "Jul 24, 2026",
    tag: "Minor",
    title: "Bulk rename + audit fixes",
    items: [
      { kind: "New", text: "Bulk rename tool: scan the last 100 image downloads and re-download with your current template." },
      { kind: "New", text: "Live preview of the corrected filename before you commit." },
      { kind: "Fix", text: "Options page default template now matches background (counter + date + time tokens)." },
      { kind: "Fix", text: "Export/import now includes filenameCase, maxNameLength, and aiPrefix." },
      { kind: "Fix", text: "Duplicate seen-URL guard no longer grows unbounded." },
    ],
  },
  {
    version: "1.3.0",
    date: "Jul 23, 2026",
    tag: "Minor",
    title: "Undo, shortcuts, dimensions",
    items: [
      { kind: "New", text: "Undo the last rename directly from the popup." },
      { kind: "New", text: "Keyboard shortcuts to toggle renaming and open the popup." },
      { kind: "New", text: "Right-click context menu for one-off saves." },
      { kind: "New", text: "{width}, {height}, {dimensions} tokens." },
    ],
  },
];

function render() {
  const params = new URLSearchParams(location.search);
  const current = params.get("v") || "1.5.1";
  const previous = params.get("prev") || "";
  const reason = params.get("reason") || "update";

  document.getElementById("ver").textContent = "v" + current;
  const lede = document.getElementById("lede");
  if (reason === "install") {
    lede.textContent = "Welcome to Renma. Here's a quick tour of everything shipped so far.";
  } else if (previous) {
    lede.textContent = `Updated from v${previous} to v${current}. Here's what changed since your last version.`;
  }

  // Show releases newer than previous (inclusive of current)
  const list = document.getElementById("releases");
  const shown = previous
    ? RELEASES.filter((r) => compareVer(r.version, previous) > 0)
    : RELEASES;
  const toRender = shown.length ? shown : RELEASES.slice(0, 1);

  list.innerHTML = toRender
    .map(
      (r) => `
      <article class="release">
        <div class="release-head">
          <span class="v">v${r.version}</span>
          <span class="date">${r.date}</span>
          <span class="tag">${r.tag}</span>
        </div>
        <h2>${r.title}</h2>
        <ul class="items">
          ${r.items
            .map(
              (it) => `<li><span class="kind ${it.kind}">${it.kind}</span><span>${escapeHtml(it.text)}</span></li>`
            )
            .join("")}
        </ul>
      </article>`
    )
    .join("");
}

function compareVer(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x !== y) return x - y;
  }
  return 0;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

document.getElementById("openOptions").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
document.getElementById("optLink").addEventListener("click", (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

render();
