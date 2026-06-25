import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Zap,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ScrollReveal from '@/components/ScrollReveal';
import { strategies } from '@/lib/data';

const strategyCategories = [
  { id: 'all', label: '全部策略' },
  { id: 'trend', label: '趋势跟踪' },
  { id: 'value', label: '价值投资' },
  { id: 'event', label: '事件驱动' },
  { id: 'tech', label: '技术形态' },
];

export default function StrategyCenter() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const filteredStrategies = activeCategory === 'all'
    ? strategies
    : strategies.filter((s) => s.type === activeCategory);

  const currentStrategy = strategies.find((s) => s.id === selectedStrategy);

  // Generate backtest data for selected strategy
  const backtestData = [
    { month: '1月', strategy: 5.2, benchmark: 2.1 },
    { month: '2月', strategy: -2.8, benchmark: -3.5 },
    { month: '3月', strategy: 8.5, benchmark: 4.2 },
    { month: '4月', strategy: 3.1, benchmark: 1.8 },
    { month: '5月', strategy: -1.5, benchmark: -0.5 },
    { month: '6月', strategy: 6.7, benchmark: 3.0 },
    { month: '7月', strategy: 4.3, benchmark: 2.5 },
    { month: '8月', strategy: -3.2, benchmark: -4.1 },
    { month: '9月', strategy: 7.8, benchmark: 3.8 },
    { month: '10月', strategy: 2.9, benchmark: 1.2 },
    { month: '11月', strategy: 5.6, benchmark: 2.8 },
    { month: '12月', strategy: 3.4, benchmark: 1.5 },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-[#06B6D4]" />
                <span className="text-sm font-medium text-[#06B6D4] uppercase tracking-wider">Strategy Center</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#E2E8F0]">策略中心</h1>
              <p className="text-sm text-[#94A3B8] mt-1">内置8种经典选股策略，支持回测验证与策略融合</p>
            </div>
          </ScrollReveal>

          {/* Category Tabs */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-8">
              {strategyCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-[#164E63]/50 text-[#06B6D4] border border-[#06B6D4]/30'
                      : 'bg-[#131821] text-[#94A3B8] border border-[#1E293B] hover:border-[#334155]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Strategy Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
              {filteredStrategies.map((strategy, index) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedStrategy(selectedStrategy === strategy.id ? null : strategy.id)}
                  className={`bg-[#131821] border rounded-2xl p-6 cursor-pointer transition-all ${
                    selectedStrategy === strategy.id
                      ? 'border-[#06B6D4]/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                      : 'border-[#1E293B] hover:border-[#334155]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#164E63]/30 flex items-center justify-center">
                        <LineChart className="w-5 h-5 text-[#06B6D4]" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#E2E8F0]">{strategy.name}</h3>
                        <span className="text-xs text-[#64748B]">{strategy.description}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      strategy.annualReturn > 20 ? 'bg-[#F43F5E]/15 text-[#F43F5E]' :
                      strategy.annualReturn > 15 ? 'bg-[#06B6D4]/15 text-[#06B6D4]' :
                      'bg-[#F59E0B]/15 text-[#F59E0B]'
                    }`}>
                      {strategy.annualReturn > 0 ? '+' : ''}{strategy.annualReturn}%
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-[#64748B] mb-1">年化收益</div>
                      <div className="data-number text-lg text-[#06B6D4]">{strategy.annualReturn}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#64748B] mb-1">最大回撤</div>
                      <div className="data-number text-lg text-[#EF4444]">{strategy.maxDrawdown}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#64748B] mb-1">市场适配度</div>
                      <div className="data-number text-lg text-[#F59E0B]">{strategy.suitability}%</div>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <div className="flex items-center justify-center mt-4 pt-4 border-t border-[#1E293B]">
                    <span className="text-xs text-[#64748B]">
                      {selectedStrategy === strategy.id ? '收起详情' : '查看回测'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Strategy Detail / Backtest */}
          <AnimatePresence>
            {currentStrategy && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#E2E8F0]">{currentStrategy.name} — 回测报告</h3>
                      <p className="text-sm text-[#94A3B8] mt-1">回测区间：2014-2024 | 基准：沪深300 | 调仓频率：月度</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#06B6D4] text-white text-sm font-medium hover:bg-[#06B6D4]/90 transition-colors">
                      <Zap className="w-4 h-4" />
                      运行回测
                    </button>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: '年化收益率', value: `${currentStrategy.annualReturn}%`, color: '#06B6D4', icon: TrendingUp },
                      { label: '最大回撤', value: `${currentStrategy.maxDrawdown}%`, color: '#EF4444', icon: TrendingDown },
                      { label: '夏普比率', value: '1.85', color: '#F59E0B', icon: BarChart3 },
                      { label: '胜率', value: '62.5%', color: '#10B981', icon: Target },
                    ].map((metric) => {
                      const Icon = metric.icon;
                      return (
                        <div key={metric.label} className="bg-[#0F172A] rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-4 h-4" style={{ color: metric.color }} />
                            <span className="text-xs text-[#94A3B8]">{metric.label}</span>
                          </div>
                          <div className="data-number text-xl" style={{ color: metric.color }}>
                            {metric.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Monthly Returns Table */}
                  <div>
                    <h4 className="text-sm font-medium text-[#E2E8F0] mb-3">月度收益对比</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#1E293B]">
                            <th className="text-left py-2 px-3 text-xs text-[#64748B] font-medium">月份</th>
                            {backtestData.map((d) => (
                              <th key={d.month} className="text-center py-2 px-2 text-xs text-[#64748B] font-medium">{d.month}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#1E293B]/50">
                            <td className="py-2 px-3 text-xs text-[#06B6D4] font-medium">策略</td>
                            {backtestData.map((d) => (
                              <td key={d.month} className={`text-center py-2 px-2 text-xs data-number ${
                                d.strategy >= 0 ? 'text-[#F43F5E]' : 'text-[#10B981]'
                              }`}>
                                {d.strategy >= 0 ? '+' : ''}{d.strategy}%
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-xs text-[#94A3B8] font-medium">基准</td>
                            {backtestData.map((d) => (
                              <td key={d.month} className={`text-center py-2 px-2 text-xs data-number ${
                                d.benchmark >= 0 ? 'text-[#F43F5E]' : 'text-[#10B981]'
                              }`}>
                                {d.benchmark >= 0 ? '+' : ''}{d.benchmark}%
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Strategy Fusion Promo */}
          <ScrollReveal delay={0.3}>
            <div className="mt-8 bg-gradient-to-r from-[#164E63]/30 to-[#06B6D4]/10 border border-[#06B6D4]/20 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#E2E8F0] mb-2">多策略融合引擎</h3>
                  <p className="text-sm text-[#94A3B8] max-w-lg">
                    同时运行多个策略，通过AI权重优化实现策略互补。回测显示，融合策略的年化夏普比率比单一策略平均提升35%。
                  </p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#06B6D4] text-white text-sm font-medium hover:bg-[#06B6D4]/90 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)] whitespace-nowrap">
                  <Zap className="w-4 h-4" />
                  创建融合策略
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
