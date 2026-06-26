import { createRouter, publicQuery } from "./middleware";
import { stockRouter } from "./routers/stock";
import { marketRouter } from "./routers/market";
import { reportRouter } from "./routers/report";
import { screenerRouter } from "./routers/screener";
import { syncRouter } from "./routers/sync";
import { pdfRouter } from "./routers/pdf";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  // 股票数据
  stock: stockRouter,

  // 市场总览
  market: marketRouter,

  // AI研报
  report: reportRouter,

  // 智能选股
  screener: screenerRouter,

  // 数据同步
  sync: syncRouter,

  // PDF导出
  pdf: pdfRouter,
});

export type AppRouter = typeof appRouter;