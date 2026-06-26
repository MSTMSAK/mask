import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowLeft, Download, Activity, Newspaper, MessageCircle, DollarSign, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FiveDRadar from '@/components/FiveDRadar';
import ScrollReveal from '@/components/ScrollReveal';
import { trpc } from '@/providers/trpc';

export default function StockDetail() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const safeCode = code || '688981';

  const { data: analysis, isLoading } = trpc.report.fullAnalysis.useQuery({ code: safeCode });
  const { data: pdfData } = trpc.pdf.generateReport.useQuery({ code: safeCode });

  const [downloading, setDownloading] = useState(false);

  const handleExportPDF = () => {
    if (!pdfData?.html) return;
    setDownloading(true);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfData.html);
      printWindow.document.close();
    }
    setDownloading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E14]">
        <Navbar />
        <div className="pt-24 flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06B6D4]" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#0B0E14]">
        <Navbar />
        <div className="pt-24 flex flex-col items-center justify-center h-[60vh]">
          <p className="text-[#94A3B8] mb-4">未找到股票数据，请先同步数据</p>
          <button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg bg-[#164E63] text-[#06B6D4] text-sm">返回首页</button>
        </div>
      </div>
    );
  }

  const { stock, price, score, report } = analysis;
  const fiveD = score ? {
    fundamental: score.fundamental, technical: score.technical, capital: score.capital, news: score.news, sentiment: score.sentiment,
  } : { fundamental: 50, technical: 50, capital: 50, news: 50, sentiment: 50 };

  const dimensionDetails = [
    { key: 'fundamental', label: '基本面', score: fiveD.fundamental, icon: Activity, color: '#06B6D4', details: [{ name: '估值水平', value: price?.pe ? `${price.pe.toFixed(1)}` : '--', desc: price?.pe && price.pe < 30 ? '低估区间' : price?.pe && price.pe < 50 ? '合理区间' : '偏高关注' }, { name: '市值', value: price?.marketCap ? `${(price.marketCap / 1e8).toFixed(0)}亿` : '--', desc: '总市值' }, { name: '基本面评分', value: `${fiveD.fundamental}分`, desc: fiveD.fundamental >= 80 ? '优秀' : fiveD.fundamental >= 60 ? '良好' : '一般' }] },
    { key: 'technical', label: '技术面', score: fiveD.technical, icon: TrendingUp, color: '#10B981', details: [{ name: '涨跌幅', value: `${price?.changePercent && price.changePercent > 0 ? '+' : ''}${price?.changePercent?.toFixed(2) || 0}%`, desc: price?.changePercent && price.changePercent > 0 ? '上涨' : '调整' }, { name: '换手率', value: `${price?.turnoverRate?.toFixed(2) || 0}%`, desc: price?.turnoverRate && price.turnoverRate > 5 ? '活跃' : '平稳' }, { name: '技术面评分', value: `${fiveD.technical}分`, desc: fiveD.technical >= 80 ? '强势' : fiveD.technical >= 60 ? '中性' : '弱势' }] },
    { key: 'capital', label: '资金面', score: fiveD.capital, icon: DollarSign, color: '#F59E0B', details: [{ name: '成交量', value: price?.volume ? `${(price.volume / 1e4).toFixed(0)}万手` : '--', desc: '成交额' }, { name: '换手率', value: `${price?.turnoverRate?.toFixed(2) || 0}%`, desc: '资金参与度' }, { name: '资金面评分', value: `${fiveD.capital}分`, desc: fiveD.capital >= 80 ? '资金活跃' : fiveD.capital >= 60 ? '资金平稳' : '资金流出' }] },
    { key: 'news', label: '消息面', score: fiveD.news, icon: Newspaper, color: '#8B5CF6', details: [{ name: '涨跌驱动', value: price?.changePercent && price.changePercent > 3 ? '利好驱动' : '正常波动', desc: '消息影响' }, { name: '消息面评分', value: `${fiveD.news}分`, desc: fiveD.news >= 80 ? '利好密集' : fiveD.news >= 60 ? '消息中性' : '利空居多' }, { name: '舆情风险', value: fiveD.news >= 70 ? '较低' : fiveD.news >= 40 ? '中等' : '较高', desc: '风险评估' }] },
    { key: 'sentiment', label: '舆情面', score: fiveD.sentiment, icon: MessageCircle, color: '#EC4899', details: [{ name: '市场情绪', value: fiveD.sentiment >= 70 ? '积极' : fiveD.sentiment >= 50 ? '中性' : '谨慎', desc: '投资者情绪' }, { name: '舆情评分', value: `${fiveD.sentiment}分`, desc: fiveD.sentiment >= 80 ? '情绪高涨' : fiveD.sentiment >= 60 ? '情绪稳定' : '情绪低迷' }, { name: '关注度', value: fiveD.sentiment >= 70 ? '高' : fiveD.sentiment >= 50 ? '中' : '低', desc: '市场关注度' }] },
  ];

  const gradeConfig: Record<string, { color: string; bg: string; text: string }> = {
    S: { color: '#06B6D4', bg: 'bg-[#06B6D4]/20', text: '强烈推荐' },
    A: { color: '#06B6D4', bg: 'bg-[#06B6D4]/15', text: '推荐' },
    B: { color: '#F59E0B', bg: 'bg-[#F59E0B]/15', text: '中性' },
    C: { color: '#EF4444', bg: 'bg-[#EF4444]/15', text: '谨慎' },
    D: { color: '#EF4444', bg: 'bg-[#EF4444]/20', text: '回避' },
  };

  const grade = gradeConfig[score?.grade || 'B'];

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#E2E8F0] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />返回首页
          </motion.button>

          <ScrollReveal>
            <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6 sm:p-8 mb-8 glow-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#E2E8F0]">{stock.name}<span className="font-mono text-lg text-[#64748B] ml-3">({stock.code})</span></h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="data-number text-3xl text-[#E2E8F0]">{price?.price ? `¥${price.price.toFixed(2)}` : '--'}</span>
                    <span className={`flex items-center text-sm font-medium ${(price?.changePercent || 0) >= 0 ? 'text-[#F43F5E]' : 'text-[#10B981]'}`}>
                      {(price?.changePercent || 0) >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {(price?.changePercent || 0) >= 0 ? '+' : ''}{(price?.changePercent || 0).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="data-number text-5xl" style={{ color: grade.color, textShadow: `0 0 20px ${grade.color}40` }}>{score?.totalScore || '--'}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${grade.bg}`} style={{ color: grade.color }}>{score?.grade || 'B'}级</span>
                      <span className="text-xs text-[#94A3B8]">{grade.text}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[{ label: '总市值', value: price?.marketCap ? `${(price.marketCap / 1e8).toFixed(0)}亿` : '--' }, { label: '市盈率', value: price?.pe ? price.pe.toFixed(1) : '--' }, { label: '换手率', value: price?.turnoverRate ? `${price.turnoverRate.toFixed(2)}%` : '--' }, { label: '成交量', value: price?.volume ? `${(price.volume / 1e4).toFixed(0)}万手` : '--' }].map((item) => (
                  <div key={item.label} className="bg-[#0F172A] rounded-lg p-3">
                    <div className="text-xs text-[#64748B] mb-1">{item.label}</div>
                    <div className="data-number text-sm text-[#E2E8F0]">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <ScrollReveal delay={0.1} className="lg:col-span-1">
              <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4">五维雷达图</h3>
                <div className="relative">
                  <FiveDRadar data={fiveD} size={280} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="data-number text-2xl text-[#06B6D4]">{score?.totalScore || '--'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="lg:col-span-2">
              <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4">五维拆解</h3>
                <div className="space-y-4">
                  {dimensionDetails.map((dim) => {
                    const Icon = dim.icon;
                    return (
                      <div key={dim.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" style={{ color: dim.color }} />
                            <span className="text-sm font-medium text-[#E2E8F0]">{dim.label}</span>
                          </div>
                          <div className="data-number text-sm" style={{ color: dim.color }}>{dim.score}分</div>
                        </div>
                        <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${dim.score}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: dim.color }} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {dim.details.map((d) => (
                            <div key={d.name} className="bg-[#0F172A] rounded-lg p-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-[#94A3B8]">{d.name}</span>
                                <span className="data-number text-xs" style={{ color: dim.color }}>{d.value}</span>
                              </div>
                              <div className="text-xs text-[#64748B] leading-tight">{d.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#06B6D4]" />
                  <h3 className="text-lg font-semibold text-[#E2E8F0]">AI深度研报</h3>
                </div>
                <button onClick={handleExportPDF} disabled={downloading || !pdfData?.html} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#164E63]/50 text-[#06B6D4] text-xs font-medium hover:bg-[#164E63] transition-colors disabled:opacity-50">
                  <Download className="w-3.5 h-3.5" />
                  {downloading ? '生成中...' : '导出PDF'}
                </button>
              </div>

              <div className="prose prose-invert prose-sm max-w-none">
                {report?.content ? (
                  report.content.split('\n').map((line: string, i: number) => {
                    if (line.startsWith('## ')) return <h3 key={i} className="text-base font-semibold text-[#E2E8F0] mt-6 mb-3">{line.replace('## ', '')}</h3>;
                    if (line.startsWith('**')) return <h4 key={i} className="text-sm font-medium text-[#06B6D4] mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>;
                    if (line.startsWith('- ')) return <li key={i} className="text-sm text-[#94A3B8] ml-4 mb-1">{line.replace('- ', '')}</li>;
                    if (line.trim() === '') return <div key={i} className="h-2" />;
                    return <p key={i} className="text-sm text-[#94A3B8] leading-relaxed mb-2">{line}</p>;
                  })
                ) : score ? (
                  <div>
                    <h3 className="text-base font-semibold text-[#E2E8F0] mt-4 mb-3">AI综合评分：{score.totalScore}分 ({score.grade}级)</h3>
                    <p className="text-sm text-[#94A3B8] mb-4">该标的当前五维评分为：基本面{score.fundamental}分、技术面{score.technical}分、资金面{score.capital}分、消息面{score.news}分、舆情面{score.sentiment}分。</p>
                    <h4 className="text-sm font-medium text-[#06B6D4] mt-4 mb-2">AI观点</h4>
                    <p className="text-sm text-[#94A3B8]">{score.logic}</p>
                    <div className="mt-6 p-3 bg-[#164E63]/20 border border-[#06B6D4]/20 rounded-lg">
                      <span className="text-sm font-medium text-[#06B6D4]">投资建议：{score.grade === 'S' ? '强烈关注' : score.grade === 'A' ? '积极关注' : '跟踪观察'}</span>
                      <span className="text-sm text-[#94A3B8] block mt-1">建议持仓周期：1-3个月</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#94A3B8]">暂无研报数据</p>
                )}
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-8 p-4 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl">
            <p className="text-xs text-[#F59E0B] leading-relaxed">
              <strong>风险提示：</strong>本页面所有分析结果由AI模型生成，仅供参考，不构成任何投资建议。投资者应独立做出投资决策，并承担相应风险。过往表现不代表未来收益。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}