import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, DollarSign, Newspaper, MessageCircle } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import FiveDRadar from '@/components/FiveDRadar';

const featuredStock = {
  name: '中芯国际',
  code: '688981',
  score: 94,
  grade: 'S',
  fiveD: {
    fundamental: 88,
    technical: 92,
    capital: 95,
    news: 85,
    sentiment: 90,
  },
};

const dimensionCards = [
  {
    key: 'fundamental' as const,
    label: '基本面',
    score: featuredStock.fiveD.fundamental,
    icon: Activity,
    color: '#06B6D4',
    desc: 'Q3营收同比增长35.8%，毛利率改善至26.3%，资产负债率控制在45%以下',
  },
  {
    key: 'technical' as const,
    label: '技术面',
    score: featuredStock.fiveD.technical,
    icon: TrendingUp,
    color: '#10B981',
    desc: '股价突破前期平台，MACD金叉形成，RSI(14)处于58仍有上行空间',
  },
  {
    key: 'capital' as const,
    label: '资金面',
    score: featuredStock.fiveD.capital,
    icon: DollarSign,
    color: '#F59E0B',
    desc: '近5日主力资金净流入12.8亿元，北向资金持股比例提升至3.2%',
  },
  {
    key: 'news' as const,
    label: '消息面',
    score: featuredStock.fiveD.news,
    icon: Newspaper,
    color: '#8B5CF6',
    desc: '国产替代政策持续加码，大基金三期注资落地，行业景气度回升',
  },
  {
    key: 'sentiment' as const,
    label: '舆情面',
    score: featuredStock.fiveD.sentiment,
    icon: MessageCircle,
    color: '#EC4899',
    desc: '社交媒体情绪积极，分析师评级以上调为主，搜索指数显著上升',
  },
];

export default function FiveDPreview() {
  const [activeDim, setActiveDim] = useState<string | null>(null);

  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-12 bg-[#0B0E14] overflow-hidden">
      {/* Radial Spotlight Background */}
      <div className="absolute inset-0 radial-spotlight opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-[#06B6D4]" />
              <span className="text-sm font-medium text-[#06B6D4] uppercase tracking-wider">5D Analysis</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#E2E8F0] mb-2">AI五维深度分析</h2>
            <p className="text-sm text-[#94A3B8] max-w-xl mx-auto">
              融合基本面、技术面、资金面、消息面、舆情面五维因子，加权生成0-100分综合评分
            </p>
          </div>
        </ScrollReveal>

        {/* Center Content */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Radar Chart */}
          <ScrollReveal delay={0.2}>
            <div className="relative">
              <FiveDRadar data={featuredStock.fiveD} size={360} showLabels={true} />

              {/* Center Score */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="data-number text-4xl text-[#06B6D4]" style={{ textShadow: '0 0 20px rgba(6,182,212,0.5)' }}>
                    {featuredStock.score}
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-1">综合评分</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Dimension Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 w-full max-w-md">
            {dimensionCards.map((dim, i) => {
              const Icon = dim.icon;
              const isActive = activeDim === dim.key;

              return (
                <ScrollReveal key={dim.key} delay={0.1 * i}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveDim(isActive ? null : dim.key)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-[#164E63]/30 border-[#06B6D4]/50'
                        : 'bg-[#131821] border-[#1E293B] hover:border-[#334155]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${dim.color}15` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: dim.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#E2E8F0]">{dim.label}</span>
                          <span className="data-number text-sm" style={{ color: dim.color }}>
                            {dim.score}分
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-1.5 h-1 bg-[#1E293B] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${dim.score}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: dim.color }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expandable Description */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isActive ? 'auto' : 0,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-[#94A3B8] mt-3 pl-12 leading-relaxed">
                        {dim.desc}
                      </p>
                    </motion.div>
                  </motion.button>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
