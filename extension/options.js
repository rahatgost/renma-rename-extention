const listEl = document.getElementById("list");
const domainEl = document.getElementById("domain");
const prefixEl = document.getElementById("prefix");
const addEl = document.getElementById("add");
const statusEl = document.getElementById("status");

async function load() {
  const { customMappings = [] } = await chrome.storage.local.get("customMappings");
  listEl.innerHTML = "";
  if (customMappings.length === 0) {
    listEl.innerHTML = `<tr><td colspan="3" style="color:#888">No custom mappings yet.</td></tr>`;
    return;
  }
  customMappings.forEach((m, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td></td><td></td><td><button class="del" data-i="${i}">Remove</button></td>`;
    tr.children[0].textContent = m.domain;
    tr.children[1].textContent = m.prefix;
    listEl.appendChild(tr);
  });
  listEl.querySelectorAll(".del").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const i = Number(e.target.dataset.i);
      const { customMappings = [] } = await chrome.storage.local.get("customMappings");
      customMappings.splice(i, 1);
      await chrome.storage.local.set({ customMappings });
      flash("Removed");
      load();
    })
  );
}

function flash(msg) {
  statusEl.textContent = msg;
  setTimeout(() => (statusEl.textContent = ""), 1500);
}

addEl.addEventListener("click", async () => {
  const domain = domainEl.value.trim().toLowerCase();
  const prefix = prefixEl.value.trim();
  if (!domain || !prefix) {
    flash("Both fields required");
    return;
  }
  const { customMappings = [] } = await chrome.storage.local.get("customMappings");
  customMappings.push({ domain, prefix });
  await chrome.storage.local.set({ customMappings });
  domainEl.value = "";
  prefixEl.value = "";
  flash("Saved");
  load();
});

load();
