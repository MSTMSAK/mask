import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Zap, Quote } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { marketOverview, chartData5Days, sectorData, moneyFlowData } from '@/lib/data';

const chartTooltipStyle = {
  backgroundColor: '#131821',
  border: '1px solid #1E293B',
  borderRadius: '8px',
  color: '#E2E8F0',
  fontSize: '12px',
};

export default function MarketOverview() {
  return (
    <section id="market-overview" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-12 bg-[#0B0E14]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-[#06B6D4]" />
              <span className="text-sm font-medium text-[#06B6D4] uppercase tracking-wider">AI Daily Report</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#E2E8F0]">每日市场总览</h2>
          </div>
        </ScrollReveal>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: AI Summary */}
          <ScrollReveal delay={0.1} className="lg:col-span-1">
            <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6 h-full relative overflow-hidden">
              {/* Radial Spotlight */}
              <div className="absolute inset-0 radial-spotlight opacity-50 pointer-events-none" />

              <Quote className="w-8 h-8 text-[#06B6D4]/40 mb-4" />

              <p className="text-[#E2E8F0] text-base leading-relaxed mb-6 relative z-10">
                {marketOverview.aiSummary}
              </p>

              {/* Confidence Bar */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#94A3B8]">AI置信度</span>
                  <span className="data-number text-lg text-[#06B6D4]">{marketOverview.confidence}%</span>
                </div>
                <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${marketOverview.confidence}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#06B6D4] to-[#06B6D4]/60 rounded-full"
                  />
                </div>
              </div>

              {/* Sentiment Gauge */}
              <div className="mt-6 flex items-center gap-3 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#94A3B8]">市场情绪</span>
                    <span className={`text-xs font-medium ${
                      marketOverview.sentimentScore > 60 ? 'text-[#F43F5E]' :
                      marketOverview.sentimentScore > 40 ? 'text-[#F59E0B]' : 'text-[#10B981]'
                    }`}>
                      {marketOverview.sentimentScore > 60 ? '偏乐观' :
                       marketOverview.sentimentScore > 40 ? '中性' : '偏谨慎'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${marketOverview.sentimentScore}%`,
                        background: marketOverview.sentimentScore > 60
                          ? 'linear-gradient(90deg, #F43F5E, #F59E0B)'
                          : marketOverview.sentimentScore > 40
                          ? 'linear-gradient(90deg, #F59E0B, #F59E0B)'
                          : 'linear-gradient(90deg, #10B981, #F59E0B)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Up/Down Count */}
              <div className="mt-6 grid grid-cols-3 gap-3 relative z-10">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#F43F5E]" />
                    <span className="data-number text-lg text-[#F43F5E]">{marketOverview.upCount}</span>
                  </div>
                  <span className="text-xs text-[#64748B]">上涨</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="data-number text-lg text-[#10B981]">{marketOverview.downCount}</span>
                  </div>
                  <span className="text-xs text-[#64748B]">下跌</span>
                </div>
                <div className="text-center">
                  <span className="data-number text-lg text-[#94A3B8]">{marketOverview.flatCount}</span>
                  <span className="text-xs text-[#64748B] block">平盘</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Dashboard Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Index Trend */}
            <ScrollReveal delay={0.2}>
              <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#94A3B8]">指数趋势</span>
                  <Zap className="w-4 h-4 text-[#06B6D4]" />
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={chartData5Days}>
                    <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={{ stroke: '#1E293B' }} />
                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Line
                      type="monotone"
                      dataKey="sh"
                      stroke="#06B6D4"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: '#06B6D4' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>

            {/* Sector Heatmap */}
            <ScrollReveal delay={0.3}>
              <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#94A3B8]">板块热度</span>
                  <Activity className="w-4 h-4 text-[#F43F5E]" />
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={sectorData} layout="vertical">
                    <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      axisLine={false}
                      width={60}
                    />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="change" fill="#06B6D4" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>

            {/* Money Flow */}
            <ScrollReveal delay={0.4}>
              <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#94A3B8]">资金流向</span>
                  <TrendingUp className="w-4 h-4 text-[#10B981]" />
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={moneyFlowData}>
                    <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={{ stroke: '#1E293B' }} interval={2} />
                    <YAxis hide />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="inflow"
                      stroke="#06B6D4"
                      fill="#06B6D4"
                      fillOpacity={0.15}
                      strokeWidth={1.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>

            {/* Up/Down Distribution */}
            <ScrollReveal delay={0.5}>
              <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#94A3B8]">涨跌分布</span>
                  <Activity className="w-4 h-4 text-[#06B6D4]" />
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={[
                    { label: '涨>3%', value: 484 },
                    { label: '涨0-3%', value: 2263 },
                    { label: '平', value: 197 },
                    { label: '跌0-3%', value: 1923 },
                    { label: '跌>3%', value: 233 },
                  ]}>
                    <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={{ stroke: '#1E293B' }} />
                    <YAxis hide />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar
                      dataKey="value"
                      fill="#06B6D4"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
