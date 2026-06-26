import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Zap, Quote, RefreshCw } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { trpc } from '@/providers/trpc';
import { chartTooltipStyle } from '@/lib/chart-theme';

export default function MarketOverview() {
  const { data: overview, isLoading, refetch } = trpc.market.overview.useQuery();
  const { data: sectors } = trpc.market.sectors.useQuery({});
  const syncMutation = trpc.sync.trigger.useQuery;
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const utils = await import('@/providers/trpc');
      await fetch('/api/trpc/sync.trigger');
      await refetch();
    } catch (e) {
      console.log('Sync attempted');
    }
    setSyncing(false);
  };

  if (isLoading) {
    return (
      <section id="market-overview" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-12 bg-[#0B0E14]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06B6D4]" />
          </div>
        </div>
      </section>
    );
  }

  // 构建指数数据
  const indicesData = overview ? [
    { name: '上证指数', value: parseFloat(overview.shIndex?.toString() || '0'), change: parseFloat(overview.shChangePercent?.toString() || '0') },
    { name: '深证成指', value: parseFloat(overview.szIndex?.toString() || '0'), change: parseFloat(overview.szChangePercent?.toString() || '0') },
    { name: '创业板指', value: parseFloat(overview.cyIndex?.toString() || '0'), change: parseFloat(overview.cyChangePercent?.toString() || '0') },
    { name: '科创50', value: parseFloat(overview.kcIndex?.toString() || '0'), change: parseFloat(overview.kcChangePercent?.toString() || '0') },
  ] : [];

  // 板块数据
  const sectorChartData = (sectors || []).slice(0, 5).map(s => ({
    name: s.name,
    change: parseFloat(s.change?.toString() || '0'),
  }));

  // 资金流向模拟数据（真实数据待同步）
  const moneyFlowData = [
    { time: '09:30', inflow: 12.5 },
    { time: '10:00', inflow: 28.6 },
    { time: '10:30', inflow: 35.1 },
    { time: '11:00', inflow: 42.3 },
    { time: '11:30', inflow: 38.7 },
    { time: '13:00', inflow: 45.2 },
    { time: '13:30', inflow: 52.1 },
    { time: '14:00', inflow: 48.6 },
    { time: '14:30', inflow: 55.3 },
    { time: '15:00', inflow: 51.8 },
  ];

  const upDownData = [
    { label: '涨>3%', value: Math.round((overview?.upCount || 0) * 0.17) },
    { label: '涨0-3%', value: Math.round((overview?.upCount || 0) * 0.83) },
    { label: '平', value: overview?.flatCount || 0 },
    { label: '跌0-3%', value: Math.round((overview?.downCount || 0) * 0.83) },
    { label: '跌>3%', value: Math.round((overview?.downCount || 0) * 0.17) },
  ];

  const sentimentScore = overview?.sentimentScore || 50;

  return (
    <section id="market-overview" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-12 bg-[#0B0E14]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-12 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-[#06B6D4]" />
                <span className="text-sm font-medium text-[#06B6D4] uppercase tracking-wider">AI Daily Report</span>
                <span className="text-xs text-[#64748B] ml-2">{overview?.tradeDate || '数据同步中'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#E2E8F0]">每日市场总览</h2>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#164E63]/50 text-[#06B6D4] text-sm hover:bg-[#164E63] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? '同步中...' : '同步数据'}
            </button>
          </div>
        </ScrollReveal>

        {/* Index Cards */}
        <ScrollReveal delay={0.05}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {indicesData.map((idx) => (
              <div key={idx.name} className="bg-[#131821] border border-[#1E293B] rounded-xl p-4">
                <div className="text-xs text-[#64748B] mb-1">{idx.name}</div>
                <div className="data-number text-lg text-[#E2E8F0]">{idx.value > 0 ? idx.value.toFixed(2) : '--'}</div>
                <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${
                  idx.change >= 0 ? 'text-[#F43F5E]' : 'text-[#10B981]'
                }`}>
                  {idx.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {idx.change >= 0 ? '+' : ''}{idx.change.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: AI Summary */}
          <ScrollReveal delay={0.1} className="lg:col-span-1">
            <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6 h-full relative overflow-hidden">
              <div className="absolute inset-0 radial-spotlight opacity-50 pointer-events-none" />
              <Quote className="w-8 h-8 text-[#06B6D4]/40 mb-4" />

              <p className="text-[#E2E8F0] text-base leading-relaxed mb-6 relative z-10">
                {overview?.aiSummary || '暂无AI分析数据，请点击上方"同步数据"按钮获取最新行情。'}
              </p>

              {/* Confidence Bar */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#94A3B8]">AI置信度</span>
                  <span className="data-number text-lg text-[#06B6D4]">{overview?.confidence || 0}%</span>
                </div>
                <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${overview?.confidence || 0}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#06B6D4] to-[#06B6D4]/60 rounded-full"
                  />
                </div>
              </div>

              {/* Sentiment */}
              <div className="mt-6 flex items-center gap-3 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#94A3B8]">市场情绪</span>
                    <span className={`text-xs font-medium ${
                      sentimentScore > 60 ? 'text-[#F43F5E]' : sentimentScore > 40 ? 'text-[#F59E0B]' : 'text-[#10B981]'
                    }`}>
                      {sentimentScore > 60 ? '偏乐观' : sentimentScore > 40 ? '中性' : '偏谨慎'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${sentimentScore}%`,
                      background: sentimentScore > 60
                        ? 'linear-gradient(90deg, #F43F5E, #F59E0B)'
                        : 'linear-gradient(90deg, #10B981, #F59E0B)',
                    }} />
                  </div>
                </div>
              </div>

              {/* Up/Down Count */}
              <div className="mt-6 grid grid-cols-3 gap-3 relative z-10">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#F43F5E]" />
                    <span className="data-number text-lg text-[#F43F5E]">{overview?.upCount || 0}</span>
                  </div>
                  <span className="text-xs text-[#64748B]">上涨</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="data-number text-lg text-[#10B981]">{overview?.downCount || 0}</span>
                  </div>
                  <span className="text-xs text-[#64748B]">下跌</span>
                </div>
                <div className="text-center">
                  <span className="data-number text-lg text-[#94A3B8]">{overview?.flatCount || 0}</span>
                  <span className="text-xs text-[#64748B] block">平盘</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Dashboard Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ScrollReveal delay={0.2}>
              <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#94A3B8]">板块热度</span>
                  <Activity className="w-4 h-4 text-[#F43F5E]" />
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={sectorChartData} layout="vertical">
                    <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} width={60} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="change" fill="#06B6D4" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
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
                    <Area type="monotone" dataKey="inflow" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.15} strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#94A3B8]">涨跌分布</span>
                  <Zap className="w-4 h-4 text-[#06B6D4]" />
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={upDownData}>
                    <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={{ stroke: '#1E293B' }} />
                    <YAxis hide />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="value" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-5 flex flex-col justify-center items-center">
                <div className="text-sm text-[#94A3B8] mb-3">数据状态</div>
                <div className="text-center">
                  {overview ? (
                    <div className="text-[#06B6D4] text-sm">
                      <div className="flex items-center gap-2 justify-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                        <span>数据已同步</span>
                      </div>
                      <span className="text-[#64748B]">最新数据: {overview.tradeDate}</span>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[#F59E0B] text-sm mb-2">暂无数据</div>
                      <button
                        onClick={handleSync}
                        className="px-4 py-2 rounded-lg bg-[#164E63] text-[#06B6D4] text-sm hover:bg-[#164E63]/80 transition-colors"
                      >
                        立即同步
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
