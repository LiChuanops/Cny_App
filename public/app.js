const $ = (id) => document.getElementById(id);

async function api(path, options) {
  const res = await fetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `请求失败 (${res.status})`);
  return data;
}

function showMsg(text, ok) {
  const el = $("msg");
  el.textContent = text;
  el.className = "msg " + (ok ? "ok" : "err");
  if (text) setTimeout(() => { el.textContent = ""; el.className = "msg"; }, 3000);
}

async function loadStock() {
  const rows = await api("/api/stock");
  const tbody = $("stock-table").querySelector("tbody");
  tbody.innerHTML = "";
  $("stock-empty").style.display = rows.length ? "none" : "block";
  for (const r of rows) {
    const tr = document.createElement("tr");
    const negClass = r.stock < 0 ? "stock-neg" : "";
    tr.innerHTML = `<td>${esc(r.item)}</td><td>${r.total_in}</td><td>${r.total_out}</td>` +
                   `<td class="${negClass}">${r.stock}</td>`;
    tbody.appendChild(tr);
  }
}

async function loadLog() {
  const rows = await api("/api/movements");
  const tbody = $("log-table").querySelector("tbody");
  tbody.innerHTML = "";
  $("log-empty").style.display = rows.length ? "none" : "block";
  for (const r of rows) {
    const tr = document.createElement("tr");
    const tag = r.type === "in"
      ? '<span class="tag in">入库</span>'
      : '<span class="tag out">出库</span>';
    tr.innerHTML = `<td>${esc(r.created_at)}</td><td>${tag}</td><td>${esc(r.item)}</td>` +
                   `<td>${r.qty}</td><td>${esc(r.note || "")}</td>`;
    tbody.appendChild(tr);
  }
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function refresh() {
  await Promise.all([loadStock(), loadLog()]);
}

$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("submit");
  btn.disabled = true;
  try {
    await api("/api/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: $("type").value,
        item: $("item").value,
        qty: $("qty").value,
        note: $("note").value,
      }),
    });
    showMsg("✓ 已保存", true);
    $("item").value = "";
    $("note").value = "";
    $("qty").value = "1";
    $("item").focus();
    await refresh();
  } catch (err) {
    showMsg(err.message, false);
  } finally {
    btn.disabled = false;
  }
});

refresh().catch((err) => showMsg(err.message, false));
