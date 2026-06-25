import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import MarketOverview from '@/components/sections/MarketOverview';
import StockPool from '@/components/sections/StockPool';
import FiveDPreview from '@/components/sections/FiveDPreview';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <Navbar />
      <HeroSection />
      <MarketOverview />
      <StockPool />
      <FiveDPreview />
      <Footer />
    </div>
  );
}
