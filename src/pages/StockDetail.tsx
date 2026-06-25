import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Download,
  Activity,
  Newspaper,
  MessageCircle,
  DollarSign,
  FileText,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import FiveDRadar from '@/components/FiveDRadar';
import ScrollReveal from '@/components/ScrollReveal';
import { topStocks, aiAnalysisReport, newsData } from '@/lib/data';

export default function StockDetail() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  // Find stock by code, fallback to first stock
  const stock = topStocks.find((s) => s.code === code) || topStocks[0];
  const fiveD = stock.fiveD || { fundamental: 80, technical: 75, capital: 70, news: 65, sentiment: 72 };

  const dimensionDetails = [
    {
      key: 'fundamental',
      label: '基本面',
      score: fiveD.fundamental,
      icon: Activity,
      color: '#06B6D4',
      details: [
        { name: '财务健康度', value: 82, desc: '资产负债率42.3%，流动比率2.1' },
        { name: '盈利能力', value: 85, desc: 'ROE 18.5%，毛利率26.3%' },
        { name: '成长性', value: 90, desc: '营收同比+35.8%，净利同比+42.1%' },
        { name: '现金流', value: 88, desc: '经营现金流/净利润1.25' },
      ],
    },
    {
      key: 'technical',
      label: '技术面',
      score: fiveD.technical,
      icon: TrendingUp,
      color: '#10B981',
      details: [
        { name: '趋势方向', value: 88, desc: '突破60日均线，多头排列' },
        { name: '动量指标', value: 85, desc: 'MACD金叉，柱状图扩大' },
        { name: '形态识别', value: 78, desc: '杯柄形态确认度85%' },
        { name: '支撑压力', value: 92, desc: '支撑位52元，压力位65元' },
      ],
    },
    {
      key: 'capital',
      label: '资金面',
      score: fiveD.capital,
      icon: DollarSign,
      color: '#F59E0B',
      details: [
        { name: '主力动向', value: 95, desc: '近5日净流入12.8亿元' },
        { name: '北向资金', value: 82, desc: '持股比例提升至3.2%' },
        { name: '融资融券', value: 78, desc: '融资余额增速15.3%' },
        { name: '龙虎榜', value: 88, desc: '机构席位净买入，游资参与' },
      ],
    },
    {
      key: 'news',
      label: '消息面',
      score: fiveD.news,
      icon: Newspaper,
      color: '#8B5CF6',
      details: [
        { name: '公告摘要', value: 82, desc: '近30日2项重大利好公告' },
        { name: '研报覆盖', value: 88, desc: '近30日12篇研报，8篇买入' },
        { name: '新闻热度', value: 78, desc: '正面新闻占比72%' },
      ],
    },
    {
      key: 'sentiment',
      label: '舆情面',
      score: fiveD.sentiment,
      icon: MessageCircle,
      color: '#EC4899',
      details: [
        { name: '社交情绪', value: 85, desc: '股吧正面情绪指数0.72' },
        { name: '讨论热度', value: 82, desc: '近7日讨论量环比增长45%' },
        { name: '情感倾向', value: 88, desc: '正面72%，负面15%，中性13%' },
      ],
    },
  ];

  const gradeConfig = {
    S: { color: '#06B6D4', bg: 'bg-[#06B6D4]/20', text: '强烈推荐' },
    A: { color: '#06B6D4', bg: 'bg-[#06B6D4]/15', text: '推荐' },
    B: { color: '#F59E0B', bg: 'bg-[#F59E0B]/15', text: '中性' },
    C: { color: '#EF4444', bg: 'bg-[#EF4444]/15', text: '谨慎' },
    D: { color: '#EF4444', bg: 'bg-[#EF4444]/20', text: '回避' },
  };

  const grade = gradeConfig[stock.aiGrade];

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#E2E8F0] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </motion.button>

          {/* Hero Card */}
          <ScrollReveal>
            <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6 sm:p-8 mb-8 glow-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#E2E8F0]">
                    {stock.name}
                    <span className="font-mono text-lg text-[#64748B] ml-3">({stock.code})</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="data-number text-3xl text-[#E2E8F0]">¥{stock.price.toFixed(2)}</span>
                    <span className={`flex items-center text-sm font-medium ${
                      stock.changePercent >= 0 ? 'text-[#F43F5E]' : 'text-[#10B981]'
                    }`}>
                      {stock.changePercent >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* AI Score Badge */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="data-number text-5xl" style={{ color: grade.color, textShadow: `0 0 20px ${grade.color}40` }}>
                      {stock.aiScore}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${grade.bg}`} style={{ color: grade.color }}>
                        {stock.aiGrade}级
                      </span>
                      <span className="text-xs text-[#94A3B8]">{grade.text}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: '总市值', value: `${(stock.marketCap ? stock.marketCap / 1e8 : 0).toFixed(0)}亿` },
                  { label: '成交量', value: stock.volume ? `${(stock.volume / 1e6).toFixed(0)}万手` : '-' },
                  { label: '换手率', value: '3.2%' },
                  { label: '市盈率', value: '42.5' },
                ].map((item) => (
                  <div key={item.label} className="bg-[#0F172A] rounded-lg p-3">
                    <div className="text-xs text-[#64748B] mb-1">{item.label}</div>
                    <div className="data-number text-sm text-[#E2E8F0]">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Five D Radar + Dimensions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Radar */}
            <ScrollReveal delay={0.1} className="lg:col-span-1">
              <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-[#E2E8F0] mb-4">五维雷达图</h3>
                <div className="relative">
                  <FiveDRadar data={fiveD} size={280} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="data-number text-2xl text-[#06B6D4]">{stock.aiScore}</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Dimension Breakdown */}
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
                          <div className="flex items-center gap-3">
                            <span className="data-number text-sm" style={{ color: dim.color }}>{dim.score}分</span>
                          </div>
                        </div>
                        {/* Progress */}
                        <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${dim.score}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: dim.color }}
                          />
                        </div>
                        {/* Sub-details */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

          {/* AI Report */}
          <ScrollReveal delay={0.3}>
            <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#06B6D4]" />
                  <h3 className="text-lg font-semibold text-[#E2E8F0]">AI深度研报</h3>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#164E63]/50 text-[#06B6D4] text-xs font-medium hover:bg-[#164E63] transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  导出PDF
                </button>
              </div>

              <div className="prose prose-invert prose-sm max-w-none">
                {aiAnalysisReport.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h3 key={i} className="text-base font-semibold text-[#E2E8F0] mt-6 mb-3">{line.replace('## ', '')}</h3>;
                  }
                  if (line.startsWith('**')) {
                    return <h4 key={i} className="text-sm font-medium text-[#06B6D4] mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={i} className="text-sm text-[#94A3B8] ml-4 mb-1">{line.replace('- ', '')}</li>;
                  }
                  if (line.startsWith('**投资建议') || line.startsWith('**目标') || line.startsWith('**建议')) {
                    return (
                      <div key={i} className="mt-3 p-3 bg-[#164E63]/20 border border-[#06B6D4]/20 rounded-lg">
                        <span className="text-sm font-medium text-[#06B6D4]">{line.replace(/\*\*/g, '')}</span>
                      </div>
                    );
                  }
                  if (line.trim() === '') return <div key={i} className="h-2" />;
                  return <p key={i} className="text-sm text-[#94A3B8] leading-relaxed mb-2">{line}</p>;
                })}
              </div>
            </div>
          </ScrollReveal>

          {/* Related News */}
          <ScrollReveal delay={0.4}>
            <div className="mt-8 bg-[#131821] border border-[#1E293B] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-5 h-5 text-[#06B6D4]" />
                <h3 className="text-lg font-semibold text-[#E2E8F0]">相关资讯</h3>
              </div>
              <div className="space-y-3">
                {newsData.map((news) => (
                  <div
                    key={news.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-[#0F172A] transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#E2E8F0] truncate">{news.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#64748B]">{news.source}</span>
                        <span className="text-xs text-[#64748B]">{news.time}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      news.sentiment === 'positive' ? 'bg-[#F43F5E]/15 text-[#F43F5E]' :
                      news.sentiment === 'negative' ? 'bg-[#10B981]/15 text-[#10B981]' :
                      'bg-[#64748B]/15 text-[#94A3B8]'
                    }`}>
                      {news.sentiment === 'positive' ? '利好' : news.sentiment === 'negative' ? '利空' : '中性'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Disclaimer */}
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
