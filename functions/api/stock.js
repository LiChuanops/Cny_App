// GET /api/stock -> 每个商品的当前库存（入库累加、出库累减）

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT item,
            SUM(CASE WHEN type = 'in'  THEN qty ELSE 0 END) AS total_in,
            SUM(CASE WHEN type = 'out' THEN qty ELSE 0 END) AS total_out,
            SUM(CASE WHEN type = 'in'  THEN qty ELSE -qty END) AS stock
       FROM movements
      GROUP BY item
      ORDER BY item`
  ).all();
  return Response.json(results);
}
