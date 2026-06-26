import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { aiReports, stocks, aiScores, stockPrices } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";

export const reportRouter = createRouter({
  // 获取股票最新研报
  latest: publicQuery
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const stock = await db.select().from(stocks).where(eq(stocks.code, input.code)).limit(1);
      if (!stock.length) return null;

      const reports = await db.select()
        .from(aiReports)
        .where(eq(aiReports.stockId, stock[0].id))
        .orderBy(desc(aiReports.tradeDate))
        .limit(1);

      return reports[0] || null;
    }),

  // 获取股票研报历史
  history: publicQuery
    .input(z.object({ code: z.string(), limit: z.number().default(30) }))
    .query(async ({ input }) => {
      const db = getDb();
      const stock = await db.select().from(stocks).where(eq(stocks.code, input.code)).limit(1);
      if (!stock.length) return [];

      return db.select()
        .from(aiReports)
        .where(eq(aiReports.stockId, stock[0].id))
        .orderBy(desc(aiReports.tradeDate))
        .limit(input.limit);
    }),

  // 获取股票完整分析数据（研报 + 评分 + 行情）
  fullAnalysis: publicQuery
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      
      // 获取股票
      const stock = await db.select().from(stocks).where(eq(stocks.code, input.code)).limit(1);
      if (!stock.length) return null;

      const s = stock[0];

      // 获取最新行情
      const prices = await db.select()
        .from(stockPrices)
        .where(eq(stockPrices.stockId, s.id))
        .orderBy(desc(stockPrices.tradeDate))
        .limit(1);

      const price = prices[0];

      // 获取最新AI评分
      const scores = await db.select()
        .from(aiScores)
        .where(eq(aiScores.stockId, s.id))
        .orderBy(desc(aiScores.tradeDate))
        .limit(1);

      const score = scores[0];

      // 获取最新研报
      const reports = await db.select()
        .from(aiReports)
        .where(eq(aiReports.stockId, s.id))
        .orderBy(desc(aiReports.tradeDate))
        .limit(1);

      const report = reports[0];

      return {
        stock: s,
        price: price ? {
          close: parseFloat(price.close?.toString() || '0'),
          change: parseFloat(price.change?.toString() || '0'),
          changePercent: parseFloat(price.changePercent?.toString() || '0'),
          volume: price.volume || 0,
          marketCap: parseFloat(price.marketCap?.toString() || '0'),
          pe: parseFloat(price.pe?.toString() || '0'),
          turnoverRate: parseFloat(price.turnoverRate?.toString() || '0'),
        } : null,
        score: score || null,
        report: report || null,
      };
    }),
});