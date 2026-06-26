import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import StockDetail from './pages/StockDetail'
import Screener from './pages/Screener'
import StrategyCenter from './pages/StrategyCenter'
import UserCenter from './pages/UserCenter'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/stock/:code" element={<StockDetail />} />
      <Route path="/screener" element={<Screener />} />
      <Route path="/strategy" element={<StrategyCenter />} />
      <Route path="/user" element={<UserCenter />} />
    </Routes>
  )
}