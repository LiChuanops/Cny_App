// GET  /api/movements  -> 最近的出入库流水
// POST /api/movements  -> 新增一条出入库记录  { type, item, qty, note }

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT id, type, item, qty, note, created_at
       FROM movements
      ORDER BY id DESC
      LIMIT 100`
  ).all();
  return Response.json(results);
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }

  const type = body.type;
  const item = (body.item || "").trim();
  const qty = parseInt(body.qty, 10);
  const note = (body.note || "").trim();

  if (type !== "in" && type !== "out") {
    return Response.json({ error: "type 必须是 in 或 out" }, { status: 400 });
  }
  if (!item) {
    return Response.json({ error: "商品名称不能为空" }, { status: 400 });
  }
  if (!Number.isInteger(qty) || qty <= 0) {
    return Response.json({ error: "数量必须是正整数" }, { status: 400 });
  }

  const { results } = await env.DB.prepare(
    `INSERT INTO movements (type, item, qty, note)
     VALUES (?, ?, ?, ?)
     RETURNING id, type, item, qty, note, created_at`
  ).bind(type, item, qty, note).all();

  return Response.json(results[0], { status: 201 });
}
