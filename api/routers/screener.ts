import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { stocks, stockPrices, aiScores } from "@db/schema";
import { eq, and, desc, sql, gte } from "drizzle-orm";

export const screenerRouter = createRouter({
  // AI精选股票池 - Top评分股票
  topPicks: publicQuery
    .input(z.object({ 
      date: z.string().optional(),
      limit: z.number().default(10),
      minGrade: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      
      // 获取最新交易日
      let tradeDate = input?.date;
      if (!tradeDate) {
        const latest = await db.select().from(aiScores)
          .orderBy(desc(aiScores.tradeDate))
          .limit(1);
        tradeDate = latest[0]?.tradeDate;
      }

      if (!tradeDate) return [];

      // 获取评分 + 股票信息
      const scores = await db.select({
        score: aiScores,
        stock: stocks,
        price: stockPrices,
      })
        .from(aiScores)
        .innerJoin(stocks, eq(aiScores.stockId, stocks.id))
        .leftJoin(stockPrices, and(
          eq(stockPrices.stockId, stocks.id),
          eq(stockPrices.tradeDate, tradeDate!)
        ))
        .where(eq(aiScores.tradeDate, tradeDate))
        .orderBy(desc(aiScores.totalScore))
        .limit(input?.limit || 10);

      return scores.map(({ score, stock, price }) => ({
        code: stock.code,
        name: stock.name,
        price: parseFloat(price?.close?.toString() || '0'),
        change: parseFloat(price?.change?.toString() || '0'),
        changePercent: parseFloat(price?.changePercent?.toString() || '0'),
        aiScore: score.totalScore,
        aiGrade: score.grade,
        logic: score.logic || '',
        fiveD: {
          fundamental: score.fundamental,
          technical: score.technical,
          capital: score.capital,
          news: score.news,
          sentiment: score.sentiment,
        },
        marketCap: parseFloat(price?.marketCap?.toString() || '0'),
        volume: price?.volume || 0,
      }));
    }),

  // 多条件筛选
  filter: publicQuery
    .input(z.object({
      minPe: z.number().optional(),
      maxPe: z.number().optional(),
      minRoe: z.number().optional(),
      minChange: z.number().optional(),
      maxChange: z.number().optional(),
      minTurnover: z.number().optional(),
      grade: z.string().optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ input }) => {
      const db = getDb();

      // 获取最新交易日
      const latestScore = await db.select().from(aiScores)
        .orderBy(desc(aiScores.tradeDate))
        .limit(1);
      const tradeDate = latestScore[0]?.tradeDate;
      if (!tradeDate) return [];

      // 构建查询条件
      let query = db.select({
        score: aiScores,
        stock: stocks,
        price: stockPrices,
      })
        .from(aiScores)
        .innerJoin(stocks, eq(aiScores.stockId, stocks.id))
        .leftJoin(stockPrices, and(
          eq(stockPrices.stockId, stocks.id),
          eq(stockPrices.tradeDate, tradeDate)
        ))
        .where(eq(aiScores.tradeDate, tradeDate))
        .orderBy(desc(aiScores.totalScore))
        .limit(input.limit);

      const results = await query;

      // 前端过滤
      return results
        .filter(({ price, score }) => {
          if (!price) return false;
          const pe = parseFloat(price.pe?.toString() || '0');
          const change = parseFloat(price.changePercent?.toString() || '0');
          const turnover = parseFloat(price.turnoverRate?.toString() || '0');

          if (input.minPe && pe < input.minPe) return false;
          if (input.maxPe && pe > input.maxPe) return false;
          if (input.minChange && change < input.minChange) return false;
          if (input.maxChange && change > input.maxChange) return false;
          if (input.minTurnover && turnover < input.minTurnover) return false;
          if (input.grade && score.grade !== input.grade) return false;

          return true;
        })
        .map(({ score, stock, price }) => ({
          code: stock.code,
          name: stock.name,
          price: parseFloat(price?.close?.toString() || '0'),
          change: parseFloat(price?.change?.toString() || '0'),
          changePercent: parseFloat(price?.changePercent?.toString() || '0'),
          aiScore: score.totalScore,
          aiGrade: score.grade,
          logic: score.logic || '',
          fiveD: {
            fundamental: score.fundamental,
            technical: score.technical,
            capital: score.capital,
            news: score.news,
            sentiment: score.sentiment,
          },
          pe: parseFloat(price?.pe?.toString() || '0'),
          marketCap: parseFloat(price?.marketCap?.toString() || '0'),
          volume: price?.volume || 0,
        }));
    }),

  // 自然语言选股 - 简化为关键词匹配
  search: publicQuery
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const searchTerm = input.query.trim();
      
      if (!searchTerm) return [];

      // 搜索股票代码或名称
      const matched = await db.select().from(stocks)
        .where(
          sql`${stocks.code} LIKE ${'%' + searchTerm + '%'} OR ${stocks.name} LIKE ${'%' + searchTerm + '%'}`
        )
        .limit(20);

      // 获取最新评分和行情
      const results = [];
      for (const stock of matched) {
        const scores = await db.select()
          .from(aiScores)
          .where(eq(aiScores.stockId, stock.id))
          .orderBy(desc(aiScores.tradeDate))
          .limit(1);

        const prices = await db.select()
          .from(stockPrices)
          .where(eq(stockPrices.stockId, stock.id))
          .orderBy(desc(stockPrices.tradeDate))
          .limit(1);

        const score = scores[0];
        const price = prices[0];

        results.push({
          code: stock.code,
          name: stock.name,
          price: parseFloat(price?.close?.toString() || '0'),
          change: parseFloat(price?.change?.toString() || '0'),
          changePercent: parseFloat(price?.changePercent?.toString() || '0'),
          aiScore: score?.totalScore || 0,
          aiGrade: score?.grade || 'B',
          logic: score?.logic || '',
          fiveD: score ? {
            fundamental: score.fundamental,
            technical: score.technical,
            capital: score.capital,
            news: score.news,
            sentiment: score.sentiment,
          } : null,
        });
      }

      return results;
    }),
});