import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { ChevronDown, TrendingUp, TrendingDown, Sparkles, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import FiveDRadar from '@/components/FiveDRadar';
import { topStocks } from '@/lib/data';
import type { Stock } from '@/types';

function StockRow({ stock, index }: { stock: Stock; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      className="relative"
    >
      {/* Main Row */}
      <div
        onClick={() => setExpanded(!expanded)}
        className={`grid grid-cols-12 gap-2 sm:gap-4 items-center px-4 sm:px-6 py-4 cursor-pointer transition-colors rounded-xl ${
          expanded ? 'bg-[#164E63]/20' : 'hover:bg-[#0F172A]'
        }`}
      >
        {/* Rank */}
        <div className="col-span-1">
          <span className="data-number text-sm text-[#64748B]">#{index + 1}</span>
        </div>

        {/* Code + Name */}
        <div className="col-span-3 sm:col-span-2">
          <div className="font-medium text-sm text-[#E2E8F0] truncate">{stock.name}</div>
          <div className="font-mono text-xs text-[#64748B]">{stock.code}</div>
        </div>

        {/* Price */}
        <div className="col-span-2 sm:col-span-2 text-right">
          <div className="data-number text-sm text-[#E2E8F0]">¥{stock.price.toFixed(2)}</div>
        </div>

        {/* Change */}
        <div className="col-span-2 sm:col-span-2 text-right">
          <div className={`flex items-center justify-end gap-1 text-sm font-medium ${
            stock.changePercent >= 0 ? 'text-[#F43F5E]' : 'text-[#10B981]'
          }`}>
            {stock.changePercent >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
          </div>
        </div>

        {/* AI Score */}
        <div className="col-span-2 sm:col-span-2 text-center">
          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
            stock.aiGrade === 'S' ? 'bg-[#06B6D4]/20 text-[#06B6D4] shadow-[0_0_10px_rgba(6,182,212,0.3)]' :
            stock.aiGrade === 'A' ? 'bg-[#06B6D4]/15 text-[#06B6D4]' :
            stock.aiGrade === 'B' ? 'bg-[#F59E0B]/15 text-[#F59E0B]' :
            'bg-[#64748B]/15 text-[#64748B]'
          }`}>
            {stock.aiGrade}
          </span>
        </div>

        {/* Logic */}
        <div className="hidden sm:block col-span-2">
          <span className="text-xs text-[#94A3B8] truncate">{stock.logic}</span>
        </div>

        {/* Expand Icon */}
        <div className="col-span-2 sm:col-span-1 flex justify-end">
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          </motion.div>
        </div>

        {/* Left Glow Indicator */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#06B6D4] rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Expanded Detail */}
      <AnimatePresence>
        {expanded && stock.fiveD && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-6 pt-2">
              <div className="bg-[#0F172A] rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
                {/* Radar Chart */}
                <div className="flex-shrink-0">
                  <FiveDRadar data={stock.fiveD} size={220} showLabels={true} />
                </div>

                {/* Detail Info */}
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-5 gap-3 mb-4">
                    {[
                      { label: '基本面', score: stock.fiveD.fundamental },
                      { label: '技术面', score: stock.fiveD.technical },
                      { label: '资金面', score: stock.fiveD.capital },
                      { label: '消息面', score: stock.fiveD.news },
                      { label: '舆情面', score: stock.fiveD.sentiment },
                    ].map((dim) => (
                      <div key={dim.label} className="text-center">
                        <div className="text-xs text-[#94A3B8] mb-1">{dim.label}</div>
                        <div className={`data-number text-lg ${
                          dim.score >= 85 ? 'text-[#06B6D4]' :
                          dim.score >= 70 ? 'text-[#E2E8F0]' :
                          dim.score >= 55 ? 'text-[#F59E0B]' :
                          'text-[#EF4444]'
                        }`}>
                          {dim.score}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-[#94A3B8] mb-4">
                    <span className="text-[#06B6D4]">AI诊断：</span>
                    {stock.logic}，综合评分{stock.aiScore}分，{stock.aiGrade === 'S' ? '强烈推荐关注' : stock.aiGrade === 'A' ? '建议关注' : '保持跟踪'}。
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/stock/${stock.code}`);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#164E63]/50 text-[#06B6D4] text-sm font-medium hover:bg-[#164E63] transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    查看深度分析
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function StockPool() {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-12 bg-[#0B0E14]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#06B6D4]" />
              <span className="text-sm font-medium text-[#06B6D4] uppercase tracking-wider">AI Stock Pool</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#E2E8F0] mb-2">AI精选股票池</h2>
            <p className="text-sm text-[#94A3B8]">基于五维因子模型，每日从全市场5000+只股票中精选Top10标的</p>
          </div>
        </ScrollReveal>

        {/* Table Header */}
        <ScrollReveal delay={0.1}>
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 text-xs text-[#64748B] uppercase tracking-wider border-b border-[#1E293B]">
            <div className="col-span-1">排名</div>
            <div className="col-span-2">股票</div>
            <div className="col-span-2 text-right">最新价</div>
            <div className="col-span-2 text-right">涨跌幅</div>
            <div className="col-span-2 text-center">AI评分</div>
            <div className="col-span-2">入选逻辑</div>
            <div className="col-span-1"></div>
          </div>
        </ScrollReveal>

        {/* Stock Rows */}
        <div className="divide-y divide-[#1E293B]/50">
          {topStocks.map((stock, index) => (
            <ScrollReveal key={stock.code} delay={0.05 * index}>
              <StockRow stock={stock} index={index} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
