import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import WaveGridCanvas from '@/components/WaveGridCanvas';
import ParticleField from '@/components/ParticleField';
import GlitchText from '@/components/GlitchText';
import { indicesData } from '@/lib/data';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <WaveGridCanvas />
      <ParticleField />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
          <GlitchText text="每日开盘，AI先知" as="h1" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#E2E8F0] mb-6" />
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ duration: 1, delay: 0.8 }} className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
          基于5000+ A股全量数据的深度神经推演，每日盘前为您生成市场格局、精选股票池与五维风险评估
        </motion.p>
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)' }} whileTap={{ scale: 0.98 }}
          onClick={() => document.getElementById('market-overview')?.scrollIntoView({ behavior: 'smooth' })}
          className="liquid-glass px-8 py-4 rounded-full text-white font-medium text-base inline-flex items-center gap-3 group cursor-pointer"
        >
          <span>立即查看今日AI报告</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.5 }} className="absolute bottom-8 left-0 right-0 z-10 px-4">
        <div className="max-w-4xl mx-auto liquid-glass rounded-xl px-4 sm:px-6 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {indicesData.map((index) => (
              <div key={index.code} className="text-center">
                <div className="text-xs text-[#64748B] mb-1">{index.name}</div>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="data-number text-sm text-[#E2E8F0]">{index.value.toFixed(2)}</span>
                  <span className={`flex items-center text-xs font-medium ${index.changePercent >= 0 ? 'text-[#F43F5E]' : 'text-[#10B981]'}`}>
                    {index.changePercent >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                    {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0E14] to-transparent z-[5] pointer-events-none" />
    </section>
  );
}