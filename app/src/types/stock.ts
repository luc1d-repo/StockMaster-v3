export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  high52Week?: number;
  low52Week?: number;
  avgVolume?: number;
  high24h?: number;
  low24h?: number;
  circulatingSupply?: number;
  totalSupply?: number;
  maxSupply?: number;
  assetType: 'stock' | 'crypto';
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma50?: number;
  sma200?: number;
  ema12?: number;
  ema26?: number;
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  upperBand?: number;
  lowerBand?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url?: string;
  relatedStocks?: string[];
  geography?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  aiAnalysis?: {
    direction: 'upward' | 'downward' | 'neutral';
    confidence: number;
    reasoning: string;
    keyFactors: string[];
  };
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  description: string;
  category: 'momentum' | 'trend' | 'volatility' | 'pattern';
  chartable: boolean;
}

export interface PatternSignal {
  name: string;
  type: 'golden_cross' | 'death_cross' | 'bullish_engulfing' | 'bearish_engulfing' | 'support_break' | 'resistance_break';
  signal: 'buy' | 'sell' | 'neutral';
  description: string;
  strength: 'weak' | 'moderate' | 'strong';
}

export interface AnalystRecommendation {
  firm: string;
  rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  priceTarget: number;
  date: string;
}

export interface MarketReport {
  overallRating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  consensusPriceTarget: number;
  currentPrice: number;
  upsidePotential: number;
  analystCount: number;
  recommendations: AnalystRecommendation[];
}

export interface ChartSettings {
  type: 'candlestick' | 'line' | 'area';
  timeframe: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';
  indicators: string[];
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  assetType: 'stock' | 'crypto';
}
