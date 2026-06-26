import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { syncLogs } from "@db/schema";
import { desc } from "drizzle-orm";
import { runDailySync } from "../services/stockData";

export const syncRouter = createRouter({
  // 触发数据同步
  trigger: publicQuery
    .input(z.object({ force: z.boolean().optional() }))
    .query(async ({ input }) => {
      const result = await runDailySync();
      
      // 记录同步日志
      const db = getDb();
      await db.insert(syncLogs).values({
        dataType: "stocks",
        status: result.success ? "success" : "failed",
        message: result.results.map(r => `${r.step}: ${r.message}`).join("; "),
        recordsCount: result.results.reduce((sum, r) => sum + r.count, 0),
        startedAt: new Date(),
        completedAt: new Date(),
      });

      return result;
    }),

  // 获取同步日志
  logs: publicQuery
    .input(z.object({ limit: z.number().default(20) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      return db.select()
        .from(syncLogs)
        .orderBy(desc(syncLogs.startedAt))
        .limit(input?.limit || 20);
    }),

  // 检查数据状态
  status: publicQuery.query(async () => {
    const db = getDb();

    // 各表最新数据时间
    const tables = ["stockPrices", "marketOverviews", "aiScores", "aiReports", "sectorData"] as const;
    const status: Record<string, { lastDate: string | null; count: number }> = {};

    // 行情数据
    const latestPrice = await db.select().from(db.$schema.stockPrices || {} as any)
      .orderBy(desc((db.$schema.stockPrices as any).tradeDate))
      .limit(1);
    
    // 使用原始查询
    const { sql } = await import("drizzle-orm");
    
    const priceCount = await db.execute(sql`SELECT COUNT(*) as count FROM stock_prices`);
    const marketCount = await db.execute(sql`SELECT COUNT(*) as count FROM market_overviews`);
    const scoreCount = await db.execute(sql`SELECT COUNT(*) as count FROM ai_scores`);
    const reportCount = await db.execute(sql`SELECT COUNT(*) as count FROM ai_reports`);
    const sectorCount = await db.execute(sql`SELECT COUNT(*) as count FROM sector_data`);

    return {
      prices: { count: Number((priceCount[0] as any)?.count || 0) },
      market: { count: Number((marketCount[0] as any)?.count || 0) },
      scores: { count: Number((scoreCount[0] as any)?.count || 0) },
      reports: { count: Number((reportCount[0] as any)?.count || 0) },
      sectors: { count: Number((sectorCount[0] as any)?.count || 0) },
    };
  }),
});