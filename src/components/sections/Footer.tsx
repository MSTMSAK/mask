import { Cpu, Mail, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#0B0E14] border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-[#06B6D4]" />
              <span className="text-lg font-bold text-[#E2E8F0]">智投<span className="text-[#06B6D4]">AI</span></span>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-sm leading-relaxed mb-4">
              基于AI驱动的A股每日智能分析平台，为上班族投资者提供深度市场研判、精选股票池与五维风险评估。
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-[#131821] border border-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:text-[#06B6D4] hover:border-[#06B6D4]/30 transition-colors"><Mail className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-lg bg-[#131821] border border-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:text-[#06B6D4] hover:border-[#06B6D4]/30 transition-colors"><Github className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-lg bg-[#131821] border border-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:text-[#06B6D4] hover:border-[#06B6D4]/30 transition-colors"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#E2E8F0] mb-4">核心功能</h4>
            <ul className="space-y-2">
              {['AI每日研判', '智能选股', '五维分析', '策略中心', '深度研报'].map((item) => (
                <li key={item}><a href="#" className="text-sm text-[#94A3B8] hover:text-[#06B6D4] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#E2E8F0] mb-4">关于</h4>
            <ul className="space-y-2">
              {['产品理念', '技术架构', '使用指南', '隐私政策', '免责声明'].map((item) => (
                <li key={item}><a href="#" className="text-sm text-[#94A3B8] hover:text-[#06B6D4] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-[#1E293B]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#64748B]">&copy; 2026 智投AI. All rights reserved.</p>
            <p className="text-xs text-[#64748B] text-center sm:text-right">本页面所有分析结果由AI模型生成，仅供参考，不构成任何投资建议。投资有风险，入市需谨慎。</p>
          </div>
        </div>
      </div>
    </footer>
  );
}