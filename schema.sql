-- 出入库流水表：每一条记录 = 一次入库或出库
DROP TABLE IF EXISTS movements;
CREATE TABLE movements (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  type       TEXT    NOT NULL CHECK (type IN ('in', 'out')), -- in=入库, out=出库
  item       TEXT    NOT NULL,                               -- 商品名称
  qty        INTEGER NOT NULL CHECK (qty > 0),               -- 数量
  note       TEXT    DEFAULT '',                             -- 备注
  created_at TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_movements_item ON movements(item);
CREATE INDEX IF NOT EXISTS idx_movements_created ON movements(created_at);
