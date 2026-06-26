import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { stocks, stockPrices, aiScores } from "@db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export const stockRouter = createRouter({
  // 获取股票列表
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(stocks).limit(200);
  }),

  // 获取单只股票详情
  detail: publicQuery
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const stock = await db.select().from(stocks).where(eq(stocks.code, input.code)).limit(1);
      if (!stock.length) return null;
      return stock[0];
    }),

  // 获取股票最新行情
  latestPrice: publicQuery
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const stock = await db.select().from(stocks).where(eq(stocks.code, input.code)).limit(1);
      if (!stock.length) return null;

      const prices = await db.select()
        .from(stockPrices)
        .where(eq(stockPrices.stockId, stock[0].id))
        .orderBy(desc(stockPrices.tradeDate))
        .limit(1);

      if (!prices.length) return null;

      return {
        ...stock[0],
        price: parseFloat(prices[0].close?.toString() || '0'),
        change: parseFloat(prices[0].change?.toString() || '0'),
        changePercent: parseFloat(prices[0].changePercent?.toString() || '0'),
        volume: prices[0].volume || 0,
        marketCap: parseFloat(prices[0].marketCap?.toString() || '0'),
        pe: parseFloat(prices[0].pe?.toString() || '0'),
        turnoverRate: parseFloat(prices[0].turnoverRate?.toString() || '0'),
      };
    }),

  // 获取股票历史行情
  history: publicQuery
    .input(z.object({ code: z.string(), days: z.number().default(30) }))
    .query(async ({ input }) => {
      const db = getDb();
      const stock = await db.select().from(stocks).where(eq(stocks.code, input.code)).limit(1);
      if (!stock.length) return [];

      return db.select()
        .from(stockPrices)
        .where(eq(stockPrices.stockId, stock[0].id))
        .orderBy(desc(stockPrices.tradeDate))
        .limit(input.days);
    }),

  // 获取股票AI评分
  aiScore: publicQuery
    .input(z.object({ code: z.string(), date: z.string().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      const stock = await db.select().from(stocks).where(eq(stocks.code, input.code)).limit(1);
      if (!stock.length) return null;

      const query = input.date
        ? db.select().from(aiScores).where(
            and(eq(aiScores.stockId, stock[0].id), eq(aiScores.tradeDate, input.date))
          )
        : db.select().from(aiScores).where(eq(aiScores.stockId, stock[0].id)).orderBy(desc(aiScores.tradeDate));

      const scores = await query.limit(1);
      return scores[0] || null;
    }),

  // 获取指数实时数据
  indices: publicQuery.query(async () => {
    const db = getDb();
    // 获取最新日期的市场数据
    const latest = await db.select().from(stockPrices)
      .orderBy(desc(stockPrices.tradeDate))
      .limit(1);
    
    const tradeDate = latest[0]?.tradeDate;
    if (!tradeDate) return [];

    // 获取上证指数、深证成指、创业板指、科创50的数据
    const indexCodes = ['000001', '399001', '399006', '000688'];
    const result = [];

    for (const code of indexCodes) {
      const stock = await db.select().from(stocks).where(eq(stocks.code, code)).limit(1);
      if (!stock.length) continue;

      const price = await db.select()
        .from(stockPrices)
        .where(and(eq(stockPrices.stockId, stock[0].id), eq(stockPrices.tradeDate, tradeDate)))
        .limit(1);

      if (price.length) {
        result.push({
          name: stock[0].name,
          code: stock[0].code,
          value: parseFloat(price[0].close?.toString() || '0'),
          change: parseFloat(price[0].change?.toString() || '0'),
          changePercent: parseFloat(price[0].changePercent?.toString() || '0'),
        });
      }
    }

    return result;
  }),
});