export interface Stock {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  aiScore: number;
  aiGrade: 'S' | 'A' | 'B' | 'C' | 'D';
  logic: string;
  fiveD?: FiveDScore;
  volume?: number;
  marketCap?: number;
}

export interface FiveDScore {
  fundamental: number;
  technical: number;
  capital: number;
  news: number;
  sentiment: number;
}

export interface IndexData {
  name: string;
  code: string;
  value: number;
  change: number;
  changePercent: number;
  volume: string;
}

export interface MarketOverview {
  indices: IndexData[];
  aiSummary: string;
  confidence: number;
  upCount: number;
  downCount: number;
  flatCount: number;
  sentimentScore: number;
}

export interface Strategy {
  id: string;
  name: string;
  type: 'trend' | 'value' | 'event' | 'tech';
  description: string;
  annualReturn: number;
  maxDrawdown: number;
  suitability: number;
}

export interface NewsItem {
  id: string;
  title: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  source: string;
}

export interface UserProfile {
  riskPreference: 'conservative' | 'moderate' | 'aggressive' | 'radical';
  investmentStyle: string[];
  experience: string;
  watchlist: string[];
}
