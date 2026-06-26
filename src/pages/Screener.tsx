import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, ChevronDown, TrendingUp,
  TrendingDown, Sparkles, X, Check, BarChart3,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ScrollReveal from '@/components/ScrollReveal';
import { trpc } from '@/providers/trpc';

interface FilterCondition {
  id: string; category: string; label: string; active: boolean;
}

const defaultFilters: FilterCondition[] = [
  { id: 'pe-low', category: '基本面', label: 'PE < 30', active: false },
  { id: 'roe-high', category: '基本面', label: '高成长性', active: false },
  { id: 'revenue-growth', category: '基本面', label: '营收增长 > 20%', active: false },
  { id: 'macd-gold', category: '技术面', label: 'MACD金叉', active: false },
  { id: 'ma-bull', category: '技术面', label: '均线多头排列', active: false },
  { id: 'breakout', category: '技术面', label: '突破形态', active: false },
  { id: 'main-inflow', category: '资金面', label: '主力净流入', active: false },
  { id: 'high-turnover', category: '资金面', label: '换手率 > 3%', active: false },
];

export default function Screener() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterCondition[]>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: searchedStocks, isLoading: searching } = trpc.screener.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length >= 2 }
  );

  const { data: filteredStocks, isLoading: filtering } = trpc.screener.filter.useQuery({
    limit: 50,
  });

  const categories = [...new Set(filters.map((f) => f.category))];
  const activeFilters = filters.filter((f) => f.active);

  const toggleFilter = (id: string) => {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));
  };

  // 显示搜索结果或筛选结果
  const displayStocks = searchQuery.length >= 2 ? (searchedStocks || []) : (filteredStocks || []);
  const isLoading = searchQuery.length >= 2 ? searching : filtering;

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#06B6D4]" />
                <span className="text-sm font-medium text-[#06B6D4] uppercase tracking-wider">AI Screener</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#E2E8F0]">AI智能选股</h1>
              <p className="text-sm text-[#94A3B8] mt-1">多维度条件筛选 + 自然语言搜索</p>
            </div>
          </ScrollReveal>

          {/* Search + Filter */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="输入股票名称、代码进行搜索..."
                  className="w-full pl-10 pr-4 py-3 bg-[#131821] border border-[#1E293B] rounded-xl text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:border-[#06B6D4]/50 transition-colors"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  showFilters || activeFilters.length > 0
                    ? 'bg-[#164E63]/50 text-[#06B6D4] border border-[#06B6D4]/30'
                    : 'bg-[#131821] text-[#94A3B8] border border-[#1E293B] hover:border-[#334155]'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                筛选
                {activeFilters.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#06B6D4] text-white text-xs flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>
            </div>
          </ScrollReveal>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-6"
              >
                <div className="bg-[#131821] border border-[#1E293B] rounded-xl p-5">
                  {activeFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {activeFilters.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => toggleFilter(f.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#164E63]/30 text-[#06B6D4] text-xs font-medium border border-[#06B6D4]/20 hover:bg-[#164E63]/50"
                        >
                          {f.label}
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                      <button
                        onClick={() => setFilters((prev) => prev.map((f) => ({ ...f, active: false })))}
                        className="text-xs text-[#64748B] hover:text-[#94A3B8] px-2"
                      >
                        清除全部
                      </button>
                    </div>
                  )}
                  <div className="space-y-4">
                    {categories.map((cat) => (
                      <div key={cat}>
                        <div className="flex items-center gap-2 text-sm font-medium text-[#E2E8F0] mb-2">
                          <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                          {cat}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {filters.filter((f) => f.category === cat).map((f) => (
                            <button
                              key={f.id}
                              onClick={() => toggleFilter(f.id)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                f.active
                                  ? 'bg-[#164E63]/40 text-[#06B6D4] border border-[#06B6D4]/30'
                                  : 'bg-[#0F172A] text-[#94A3B8] border border-[#1E293B] hover:border-[#334155]'
                              }`}
                            >
                              {f.active && <Check className="w-3 h-3" />}
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06B6D4]" />
            </div>
          ) : displayStocks.length === 0 ? (
            <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-8 text-center">
              <p className="text-[#94A3B8]">{searchQuery.length >= 2 ? '未找到匹配的股票' : '暂无股票数据，请先同步数据'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayStocks.map((stock, index) => (
                <ScrollReveal key={stock.code} delay={0.05 * index}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-[#131821] border border-[#1E293B] rounded-2xl p-5 cursor-pointer transition-shadow hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:border-[#334155]"
                    onClick={() => navigate(`/stock/${stock.code}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-[#E2E8F0]">{stock.name}</h3>
                        <span className="font-mono text-xs text-[#64748B]">{stock.code}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        stock.aiGrade === 'S' ? 'bg-[#06B6D4]/20 text-[#06B6D4]' :
                        stock.aiGrade === 'A' ? 'bg-[#06B6D4]/15 text-[#06B6D4]' :
                        'bg-[#F59E0B]/15 text-[#F59E0B]'
                      }`}>
                        {stock.aiGrade}
                      </span>
                    </div>

                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="data-number text-2xl text-[#E2E8F0]">
                          {stock.price > 0 ? `¥${stock.price.toFixed(2)}` : '--'}
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-medium mt-1 ${
                          stock.changePercent >= 0 ? 'text-[#F43F5E]' : 'text-[#10B981]'
                        }`}>
                          {stock.changePercent >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="data-number text-xl" style={{
                          color: stock.aiScore >= 85 ? '#06B6D4' : stock.aiScore >= 70 ? '#E2E8F0' : '#F59E0B'
                        }}>
                          {stock.aiScore}
                        </div>
                        <span className="text-xs text-[#64748B]">AI评分</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {stock.logic?.split('+').slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-[#0F172A] text-[#94A3B8] text-xs">
                          {tag.trim()}
                        </span>
                      )) || <span className="text-xs text-[#64748B]">暂无入选逻辑</span>}
                    </div>

                    {stock.fiveD && (
                      <div className="grid grid-cols-5 gap-1">
                        {[
                          { label: '基', score: stock.fiveD.fundamental },
                          { label: '技', score: stock.fiveD.technical },
                          { label: '资', score: stock.fiveD.capital },
                          { label: '消', score: stock.fiveD.news },
                          { label: '舆', score: stock.fiveD.sentiment },
                        ].map((d) => (
                          <div key={d.label} className="text-center">
                            <div className="h-8 bg-[#0F172A] rounded-md overflow-hidden relative">
                              <motion.div
                                initial={{ height: 0 }}
                                whileInView={{ height: `${d.score}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="absolute bottom-0 left-0 right-0 rounded-md"
                                style={{
                                  backgroundColor: d.score >= 85 ? '#06B6D4' : d.score >= 60 ? '#94A3B8' : '#F59E0B',
                                  opacity: 0.7,
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-[#64748B] mt-1 block">{d.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
