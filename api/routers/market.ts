import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { marketOverviews, sectorData, moneyFlow } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const marketRouter = createRouter({
  // 获取最新市场总览
  overview: publicQuery.query(async () => {
    const db = getDb();
    const overviews = await db.select()
      .from(marketOverviews)
      .orderBy(desc(marketOverviews.tradeDate))
      .limit(1);

    return overviews[0] || null;
  }),

  // 获取指定日期市场总览
  overviewByDate: publicQuery
    .input(z.object({ date: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const overviews = await db.select()
        .from(marketOverviews)
        .where(eq(marketOverviews.tradeDate, input.date))
        .limit(1);

      return overviews[0] || null;
    }),

  // 获取板块数据
  sectors: publicQuery
    .input(z.object({ date: z.string().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      
      if (input.date) {
        return db.select()
          .from(sectorData)
          .where(eq(sectorData.tradeDate, input.date))
          .orderBy(desc(sectorData.change));
      }

      // 获取最新日期
      const latest = await db.select().from(sectorData)
        .orderBy(desc(sectorData.tradeDate))
        .limit(1);
      
      const date = latest[0]?.tradeDate;
      if (!date) return [];

      return db.select()
        .from(sectorData)
        .where(eq(sectorData.tradeDate, date))
        .orderBy(desc(sectorData.change));
    }),

  // 获取资金流向
  moneyFlow: publicQuery
    .input(z.object({ date: z.string().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      
      if (input.date) {
        return db.select()
          .from(moneyFlow)
          .where(eq(moneyFlow.tradeDate, input.date))
          .orderBy(moneyFlow.time);
      }

      const latest = await db.select().from(moneyFlow)
        .orderBy(desc(moneyFlow.tradeDate))
        .limit(1);
      
      const date = latest[0]?.tradeDate;
      if (!date) return [];

      return db.select()
        .from(moneyFlow)
        .where(eq(moneyFlow.tradeDate, date))
        .orderBy(moneyFlow.time);
    }),
});