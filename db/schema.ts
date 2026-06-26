import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  int,
  json,
  index,
  date,
  mysqlEnum,
  boolean,
  bigint,
} from "drizzle-orm/mysql-core";

// ==========================================
// 股票基础信息表
// ==========================================
export const stocks = mysqlTable("stocks", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  industry: varchar("industry", { length: 100 }),
  market: mysqlEnum("market", ["sh", "sz", "bj"]).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ==========================================
// 每日行情数据表
// ==========================================
export const stockPrices = mysqlTable("stock_prices", {
  id: serial("id").primaryKey(),
  stockId: bigint("stock_id", { mode: "number", unsigned: true }).notNull(),
  tradeDate: date("trade_date").notNull(),
  open: decimal("open", { precision: 12, scale: 2 }),
  close: decimal("close", { precision: 12, scale: 2 }),
  high: decimal("high", { precision: 12, scale: 2 }),
  low: decimal("low", { precision: 12, scale: 2 }),
  change: decimal("change", { precision: 10, scale: 2 }),
  changePercent: decimal("change_percent", { precision: 8, scale: 2 }),
  volume: bigint("volume", { mode: "number" }),
  amount: decimal("amount", { precision: 16, scale: 2 }),
  turnoverRate: decimal("turnover_rate", { precision: 8, scale: 2 }),
  marketCap: decimal("market_cap", { precision: 20, scale: 2 }),
  pe: decimal("pe", { precision: 10, scale: 2 }),
  pb: decimal("pb", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("idx_stock_date").on(table.stockId, table.tradeDate),
  index("idx_trade_date").on(table.tradeDate),
]);

// ==========================================
// 市场总览数据表
// ==========================================
export const marketOverviews = mysqlTable("market_overviews", {
  id: serial("id").primaryKey(),
  tradeDate: date("trade_date").notNull().unique(),
  shIndex: decimal("sh_index", { precision: 10, scale: 2 }),
  shChange: decimal("sh_change", { precision: 10, scale: 2 }),
  shChangePercent: decimal("sh_change_percent", { precision: 8, scale: 2 }),
  szIndex: decimal("sz_index", { precision: 10, scale: 2 }),
  szChange: decimal("sz_change", { precision: 10, scale: 2 }),
  szChangePercent: decimal("sz_change_percent", { precision: 8, scale: 2 }),
  cyIndex: decimal("cy_index", { precision: 10, scale: 2 }),
  cyChange: decimal("cy_change", { precision: 10, scale: 2 }),
  cyChangePercent: decimal("cy_change_percent", { precision: 8, scale: 2 }),
  kcIndex: decimal("kc_index", { precision: 10, scale: 2 }),
  kcChange: decimal("kc_change", { precision: 10, scale: 2 }),
  kcChangePercent: decimal("kc_change_percent", { precision: 8, scale: 2 }),
  upCount: int("up_count"),
  downCount: int("down_count"),
  flatCount: int("flat_count"),
  totalVolume: decimal("total_volume", { precision: 16, scale: 2 }),
  sentimentScore: int("sentiment_score"),
  aiSummary: text("ai_summary"),
  confidence: int("confidence"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ==========================================
// AI 五维评分数据表
// ==========================================
export const aiScores = mysqlTable("ai_scores", {
  id: serial("id").primaryKey(),
  stockId: bigint("stock_id", { mode: "number", unsigned: true }).notNull(),
  tradeDate: date("trade_date").notNull(),
  fundamental: int("fundamental").notNull(),
  technical: int("technical").notNull(),
  capital: int("capital").notNull(),
  news: int("news").notNull(),
  sentiment: int("sentiment").notNull(),
  totalScore: int("total_score").notNull(),
  grade: mysqlEnum("grade", ["S", "A", "B", "C", "D"]).notNull(),
  logic: text("logic"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("idx_stock_score_date").on(table.stockId, table.tradeDate),
]);

// ==========================================
// AI 研报表
// ==========================================
export const aiReports = mysqlTable("ai_reports", {
  id: serial("id").primaryKey(),
  stockId: bigint("stock_id", { mode: "number", unsigned: true }).notNull(),
  tradeDate: date("trade_date").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  conclusion: text("conclusion"),
  targetPriceLow: decimal("target_price_low", { precision: 10, scale: 2 }),
  targetPriceHigh: decimal("target_price_high", { precision: 10, scale: 2 }),
  holdPeriod: varchar("hold_period", { length: 50 }),
  riskLevel: mysqlEnum("risk_level", ["low", "medium", "high"]),
  pdfUrl: varchar("pdf_url", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("idx_report_stock_date").on(table.stockId, table.tradeDate),
]);

// ==========================================
// 板块数据表
// ==========================================
export const sectorData = mysqlTable("sector_data", {
  id: serial("id").primaryKey(),
  tradeDate: date("trade_date").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  change: decimal("change", { precision: 8, scale: 2 }),
  leader: varchar("leader", { length: 100 }),
  leaderChange: decimal("leader_change", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("idx_sector_date").on(table.tradeDate),
]);

// ==========================================
// 资金流向数据表
// ==========================================
export const moneyFlow = mysqlTable("money_flow", {
  id: serial("id").primaryKey(),
  tradeDate: date("trade_date").notNull(),
  time: varchar("time", { length: 10 }).notNull(),
  inflow: decimal("inflow", { precision: 12, scale: 2 }),
  outflow: decimal("outflow", { precision: 12, scale: 2 }),
  netInflow: decimal("net_inflow", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("idx_flow_date").on(table.tradeDate),
]);

// ==========================================
// 数据同步日志表
// ==========================================
export const syncLogs = mysqlTable("sync_logs", {
  id: serial("id").primaryKey(),
  dataType: mysqlEnum("data_type", [
    "stocks",
    "prices",
    "market",
    "scores",
    "reports",
    "sectors",
    "money_flow",
  ]).notNull(),
  status: mysqlEnum("status", ["success", "failed", "partial"]).notNull(),
  message: text("message"),
  recordsCount: int("records_count"),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
});

// ==========================================
// 新闻资讯表
// ==========================================
export const news = mysqlTable("news", {
  id: serial("id").primaryKey(),
  stockId: bigint("stock_id", { mode: "number", unsigned: true }),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content"),
  source: varchar("source", { length: 100 }),
  sentiment: mysqlEnum("sentiment", ["positive", "negative", "neutral"]),
  publishTime: timestamp("publish_time").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
