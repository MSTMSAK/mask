import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Bookmark,
  BarChart3,
  Shield,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Star,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ScrollReveal from '@/components/ScrollReveal';
import { topStocks } from '@/lib/data';

const riskLevels = [
  { value: 'conservative', label: '保守型', desc: '优先保本，低风险偏好' },
  { value: 'moderate', label: '稳健型', desc: '平衡收益与风险' },
  { value: 'aggressive', label: '积极型', desc: '追求较高收益' },
  { value: 'radical', label: '激进型', desc: '高风险高收益' },
];

const investmentStyles = [
  '价值投资', '成长投资', '趋势跟踪', '量化交易', '事件驱动',
];

const experienceLevels = [
  { value: 'novice', label: '新手 (< 1年)' },
  { value: 'beginner', label: '初级 (1-3年)' },
  { value: 'intermediate', label: '中级 (3-5年)' },
  { value: 'advanced', label: '高级 (5-10年)' },
  { value: 'expert', label: '资深 (> 10年)' },
];

export default function UserCenter() {
  const [risk, setRisk] = useState('moderate');
  const [styles, setStyles] = useState<string[]>(['价值投资', '趋势跟踪']);
  const [experience, setExperience] = useState('intermediate');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  const toggleStyle = (style: string) => {
    setStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  // Get user's watchlist stocks
  const watchlistStocks = topStocks.slice(0, 5);

  // Portfolio mock data
  const portfolioValue = 286500;
  const portfolioChange = +12500;
  const portfolioChangePercent = +4.56;

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-[#06B6D4]" />
                <span className="text-sm font-medium text-[#06B6D4] uppercase tracking-wider">User Center</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#E2E8F0]">用户中心</h1>
            </div>
          </ScrollReveal>

          {/* Profile Card */}
          <ScrollReveal delay={0.1}>
            <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#164E63] flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-[#E2E8F0]">投资者</h2>
                  <p className="text-sm text-[#94A3B8]">
                    {riskLevels.find((r) => r.value === risk)?.label} · 
                    {experienceLevels.find((e) => e.value === experience)?.label}
                  </p>
                </div>
                <div className="text-right">
                  <div className="data-number text-2xl text-[#06B6D4]">
                    {portfolioValue.toLocaleString()}
                  </div>
                  <div className={`flex items-center justify-end gap-1 text-sm font-medium ${
                    portfolioChange >= 0 ? 'text-[#F43F5E]' : 'text-[#10B981]'
                  }`}>
                    {portfolioChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {portfolioChange >= 0 ? '+' : ''}{portfolioChangePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Settings */}
            <div className="space-y-6">
              {/* Risk Preference */}
              <ScrollReveal delay={0.2}>
                <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-[#06B6D4]" />
                    <h3 className="text-base font-semibold text-[#E2E8F0]">风险偏好</h3>
                  </div>
                  <div className="space-y-2">
                    {riskLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setRisk(level.value)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          risk === level.value
                            ? 'bg-[#164E63]/30 border-[#06B6D4]/30'
                            : 'bg-[#0F172A] border-transparent hover:border-[#334155]'
                        }`}
                      >
                        <div className="text-left">
                          <div className={`text-sm font-medium ${
                            risk === level.value ? 'text-[#06B6D4]' : 'text-[#E2E8F0]'
                          }`}>
                            {level.label}
                          </div>
                          <div className="text-xs text-[#64748B]">{level.desc}</div>
                        </div>
                        {risk === level.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-[#06B6D4] flex items-center justify-center"
                          >
                            <Zap className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Investment Style */}
              <ScrollReveal delay={0.3}>
                <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-[#06B6D4]" />
                    <h3 className="text-base font-semibold text-[#E2E8F0]">投资风格</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {investmentStyles.map((style) => (
                      <button
                        key={style}
                        onClick={() => toggleStyle(style)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          styles.includes(style)
                            ? 'bg-[#164E63]/40 text-[#06B6D4] border border-[#06B6D4]/30'
                            : 'bg-[#0F172A] text-[#94A3B8] border border-[#1E293B] hover:border-[#334155]'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Experience */}
              <ScrollReveal delay={0.4}>
                <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-[#06B6D4]" />
                    <h3 className="text-base font-semibold text-[#E2E8F0]">投资经验</h3>
                  </div>
                  <div className="space-y-2">
                    {experienceLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setExperience(level.value)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                          experience === level.value
                            ? 'bg-[#164E63]/30 text-[#06B6D4] border border-[#06B6D4]/30'
                            : 'bg-[#0F172A] text-[#94A3B8] border border-transparent hover:border-[#334155]'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Notification Settings */}
              <ScrollReveal delay={0.5}>
                <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-4 h-4 text-[#06B6D4]" />
                    <h3 className="text-base font-semibold text-[#E2E8F0]">推送设置</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-[#E2E8F0]">每日AI报告推送</div>
                        <div className="text-xs text-[#64748B]">每个交易日盘前7:30推送</div>
                      </div>
                      <button
                        onClick={() => setPushEnabled(!pushEnabled)}
                        className={`w-11 h-6 rounded-full transition-colors ${
                          pushEnabled ? 'bg-[#06B6D4]' : 'bg-[#1E293B]'
                        }`}
                      >
                        <motion.div
                          animate={{ x: pushEnabled ? 20 : 2 }}
                          className="w-5 h-5 rounded-full bg-white shadow"
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-[#E2E8F0]">邮件报告</div>
                        <div className="text-xs text-[#64748B]">每日收盘后发送邮件摘要</div>
                      </div>
                      <button
                        onClick={() => setEmailEnabled(!emailEnabled)}
                        className={`w-11 h-6 rounded-full transition-colors ${
                          emailEnabled ? 'bg-[#06B6D4]' : 'bg-[#1E293B]'
                        }`}
                      >
                        <motion.div
                          animate={{ x: emailEnabled ? 20 : 2 }}
                          className="w-5 h-5 rounded-full bg-white shadow"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Watchlist */}
            <div className="space-y-6">
              <ScrollReveal delay={0.3}>
                <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-[#06B6D4]" />
                      <h3 className="text-base font-semibold text-[#E2E8F0]">我的自选</h3>
                    </div>
                    <span className="text-xs text-[#64748B]">{watchlistStocks.length} 只</span>
                  </div>

                  <div className="space-y-2">
                    {watchlistStocks.map((stock) => (
                      <div
                        key={stock.code}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            stock.aiGrade === 'S' ? 'bg-[#06B6D4]/20 text-[#06B6D4]' :
                            stock.aiGrade === 'A' ? 'bg-[#06B6D4]/15 text-[#06B6D4]' :
                            'bg-[#F59E0B]/15 text-[#F59E0B]'
                          }`}>
                            {stock.aiGrade}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#E2E8F0]">{stock.name}</div>
                            <div className="font-mono text-xs text-[#64748B]">{stock.code}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="data-number text-sm text-[#E2E8F0]">¥{stock.price.toFixed(2)}</div>
                          <div className={`text-xs font-medium ${
                            stock.changePercent >= 0 ? 'text-[#F43F5E]' : 'text-[#10B981]'
                          }`}>
                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Membership */}
              <ScrollReveal delay={0.4}>
                <div className="bg-gradient-to-r from-[#164E63]/30 to-[#06B6D4]/10 border border-[#06B6D4]/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="w-5 h-5 text-[#F59E0B]" />
                    <h3 className="text-base font-semibold text-[#E2E8F0]">专业会员</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] text-xs font-medium">
                      已开通
                    </span>
                  </div>
                  <p className="text-sm text-[#94A3B8] mb-4">
                    享受完整AI深度研报、多策略融合选股、实时异动预警等全部高级功能。
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0F172A]/50 rounded-lg p-3 text-center">
                      <div className="data-number text-lg text-[#06B6D4]">68元/月</div>
                      <div className="text-xs text-[#94A3B8]">专业版</div>
                    </div>
                    <div className="bg-[#0F172A]/50 rounded-lg p-3 text-center">
                      <div className="data-number text-lg text-[#F59E0B]">198元/月</div>
                      <div className="text-xs text-[#94A3B8]">VIP版</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Quick Stats */}
              <ScrollReveal delay={0.5}>
                <div className="bg-[#131821] border border-[#1E293B] rounded-2xl p-6">
                  <h3 className="text-base font-semibold text-[#E2E8F0] mb-4">使用统计</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0F172A] rounded-lg p-4 text-center">
                      <div className="data-number text-2xl text-[#06B6D4]">32</div>
                      <div className="text-xs text-[#94A3B8] mt-1">已读报告</div>
                    </div>
                    <div className="bg-[#0F172A] rounded-lg p-4 text-center">
                      <div className="data-number text-2xl text-[#F59E0B]">86</div>
                      <div className="text-xs text-[#94A3B8] mt-1">AI分析次数</div>
                    </div>
                    <div className="bg-[#0F172A] rounded-lg p-4 text-center">
                      <div className="data-number text-2xl text-[#10B981]">12</div>
                      <div className="text-xs text-[#94A3B8] mt-1">保存策略</div>
                    </div>
                    <div className="bg-[#0F172A] rounded-lg p-4 text-center">
                      <div className="data-number text-2xl text-[#F43F5E]">5</div>
                      <div className="text-xs text-[#94A3B8] mt-1">连续签到</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
