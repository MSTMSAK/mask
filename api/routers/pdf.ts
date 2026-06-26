import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { stocks, aiReports, aiScores, stockPrices } from "@db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * 生成 HTML 格式的研报（前端可转为 PDF）
 * 纯服务端生成，避免依赖重型 PDF 库
 */
export const pdfRouter = createRouter({
  // 生成研报 HTML
  generateReport: publicQuery
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      
      // 获取股票信息
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

      // 获取研报
      const reports = await db.select()
        .from(aiReports)
        .where(eq(aiReports.stockId, s.id))
        .orderBy(desc(aiReports.tradeDate))
        .limit(1);
      const report = reports[0];

      const tradeDate = price?.tradeDate || new Date().toISOString().split('T')[0];

      // 生成完整 HTML
      const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${s.name}(${s.code}) - AI深度研报</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
    }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding: 40px;
      border-radius: 16px;
      margin-bottom: 32px;
    }
    .header h1 { font-size: 28px; margin-bottom: 8px; }
    .header .meta { color: #94a3b8; font-size: 14px; }
    .score-card {
      display: flex;
      gap: 24px;
      margin-bottom: 32px;
    }
    .score-item {
      flex: 1;
      background: white;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .score-value {
      font-size: 36px;
      font-weight: 700;
      color: #06b6d4;
    }
    .score-label { font-size: 14px; color: #64748b; margin-top: 4px; }
    .section {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .section h2 {
      font-size: 20px;
      color: #0f172a;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #06b6d4;
    }
    .section h3 {
      font-size: 16px;
      color: #334155;
      margin: 20px 0 12px;
    }
    .section p {
      font-size: 14px;
      color: #475569;
      margin-bottom: 12px;
    }
    .section ul {
      margin-left: 24px;
      color: #475569;
    }
    .section li { margin-bottom: 8px; }
    .dimension-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
      margin-top: 16px;
    }
    .dim-item { text-align: center; }
    .dim-score {
      font-size: 28px;
      font-weight: 700;
    }
    .dim-score.high { color: #06b6d4; }
    .dim-score.medium { color: #f59e0b; }
    .dim-score.low { color: #ef4444; }
    .dim-label { font-size: 13px; color: #64748b; margin-top: 4px; }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .info-label { color: #64748b; }
    .info-value { font-weight: 600; }
    .conclusion {
      background: linear-gradient(135deg, #06b6d4 0%, #164e63 100%);
      color: white;
      padding: 32px;
      border-radius: 12px;
      text-align: center;
    }
    .conclusion h2 { border-bottom: 2px solid rgba(255,255,255,0.3); }
    .footer {
      text-align: center;
      padding: 24px;
      color: #94a3b8;
      font-size: 12px;
    }
    .grade-badge {
      display: inline-block;
      padding: 8px 24px;
      border-radius: 24px;
      font-size: 24px;
      font-weight: 700;
      background: rgba(6,182,212,0.2);
      border: 2px solid #06b6d4;
    }
    @media print {
      body { background: white; }
      .section { box-shadow: none; border: 1px solid #e2e8f0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${s.name} (${s.code})</h1>
      <p class="meta">AI深度研报 | ${tradeDate} | 智投AI</p>
    </div>

    <div class="score-card">
      <div class="score-item">
        <div class="score-value">${price ? parseFloat(price.close?.toString() || '0').toFixed(2) : '--'}</div>
        <div class="score-label">最新价格</div>
      </div>
      <div class="score-item">
        <div class="score-value" style="color:${parseFloat(price?.changePercent?.toString() || '0') >= 0 ? '#ef4444' : '#10b981'}">
          ${price ? (parseFloat(price.changePercent?.toString() || '0') >= 0 ? '+' : '') + parseFloat(price.changePercent?.toString() || '0').toFixed(2) + '%' : '--'}
        </div>
        <div class="score-label">涨跌幅</div>
      </div>
      <div class="score-item">
        <div class="score-value">${score?.totalScore || '--'}</div>
        <div class="score-label">AI综合评分</div>
      </div>
      <div class="score-item">
        <div class="grade-badge">${score?.grade || '--'}级</div>
        <div class="score-label" style="margin-top:12px">评级</div>
      </div>
    </div>

    <div class="section">
      <h2>五维分析</h2>
      <div class="dimension-grid">
        ${score ? `
        <div class="dim-item">
          <div class="dim-score ${score.fundamental >= 80 ? 'high' : score.fundamental >= 60 ? 'medium' : 'low'}">${score.fundamental}</div>
          <div class="dim-label">基本面</div>
        </div>
        <div class="dim-item">
          <div class="dim-score ${score.technical >= 80 ? 'high' : score.technical >= 60 ? 'medium' : 'low'}">${score.technical}</div>
          <div class="dim-label">技术面</div>
        </div>
        <div class="dim-item">
          <div class="dim-score ${score.capital >= 80 ? 'high' : score.capital >= 60 ? 'medium' : 'low'}">${score.capital}</div>
          <div class="dim-label">资金面</div>
        </div>
        <div class="dim-item">
          <div class="dim-score ${score.news >= 80 ? 'high' : score.news >= 60 ? 'medium' : 'low'}">${score.news}</div>
          <div class="dim-label">消息面</div>
        </div>
        <div class="dim-item">
          <div class="dim-score ${score.sentiment >= 80 ? 'high' : score.sentiment >= 60 ? 'medium' : 'low'}">${score.sentiment}</div>
          <div class="dim-label">舆情面</div>
        </div>
        ` : '<p>暂无评分数据</p>'}
      </div>
    </div>

    ${report ? `
    <div class="section">
      ${report.content.replace(/## /g, '<h2>').replace(/\n\n/g, '</p><p>').replace(/\n- /g, '<li>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/### /g, '<h3>')}
    </div>
    ` : ''}

    <div class="section">
      <h2>基本面数据</h2>
      <div class="info-row">
        <span class="info-label">市盈率 (PE)</span>
        <span class="info-value">${price?.pe || '--'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">换手率</span>
        <span class="info-value">${price?.turnoverRate || '--'}%</span>
      </div>
      <div class="info-row">
        <span class="info-label">成交量</span>
        <span class="info-value">${price?.volume ? (price.volume / 10000).toFixed(0) + '万手' : '--'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">市值</span>
        <span class="info-value">${price?.marketCap ? (parseFloat(price.marketCap.toString()) / 100000000).toFixed(0) + '亿' : '--'}</span>
      </div>
    </div>

    <div class="conclusion section">
      <h2>AI结论</h2>
      <p style="font-size:18px; margin-top:16px">
        ${report?.conclusion || score ? `综合评分${score?.totalScore}分，${score?.grade}级标的，${score?.grade === 'S' ? '强烈' : score?.grade === 'A' ? '积极' : '适度'}关注。` : '暂无分析数据'}
      </p>
      <p style="margin-top:12px; opacity:0.8">
        ${report?.holdPeriod ? `建议持仓周期：${report.holdPeriod}` : ''}
      </p>
    </div>

    <div class="footer">
      <p>本报告由智投AI自动生成，仅供参考，不构成任何投资建议。</p>
      <p>生成时间：${new Date().toLocaleString('zh-CN')}</p>
      <p>&copy; 2026 智投AI</p>
    </div>
  </div>

  <script>
    // 自动触发打印
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 1000);
    });
  </script>
</body>
</html>`;

      return {
        html,
        filename: `${s.name}_${s.code}_研报_${tradeDate}.html`,
        stockName: s.name,
        stockCode: s.code,
        tradeDate,
      };
    }),
});