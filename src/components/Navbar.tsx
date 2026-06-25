import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu, BarChart3, Search, LineChart, User, Settings } from 'lucide-react';

const navItems = [
  { label: '首页', path: '/', icon: BarChart3 },
  { label: 'AI选股', path: '/screener', icon: Search },
  { label: '策略中心', path: '/strategy', icon: LineChart },
  { label: '深度研报', path: '/stock/688981', icon: Cpu },
  { label: '用户中心', path: '/user', icon: User },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          scrolled ? 'scale-[0.95]' : 'scale-100'
        }`}
        style={{ width: 'calc(100% - 2rem)', maxWidth: '1200px' }}
      >
        <div
          className={`liquid-glass rounded-2xl px-4 md:px-6 py-3 transition-shadow duration-300 ${
            scrolled ? 'shadow-lg shadow-cyan-900/20' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 group"
            >
              <Cpu className="w-6 h-6 text-[#06B6D4] group-hover:animate-pulse" />
              <span className="text-lg font-bold tracking-tight text-[#E2E8F0]">
                智投<span className="text-[#06B6D4]">AI</span>
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-[#06B6D4] bg-[#164E63]/30'
                        : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#06B6D4] rounded-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/screener')}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#06B6D4] text-white text-sm font-medium hover:bg-[#06B6D4]/90 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Settings className="w-4 h-4" />
                开始分析
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-[#94A3B8] hover:text-[#E2E8F0]"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 liquid-glass rounded-2xl p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-[#06B6D4] bg-[#164E63]/30'
                        : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
