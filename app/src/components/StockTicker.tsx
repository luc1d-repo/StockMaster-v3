import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  assetType: 'stock' | 'crypto';
}

// Top stocks and crypto for ticker
const MOCK_TICKER_DATA: TickerItem[] = [
  // Top Stocks
  { symbol: 'AAPL', price: 178.35, change: 2.45, changePercent: 1.39, assetType: 'stock' },
  { symbol: 'MSFT', price: 421.65, change: -1.23, changePercent: -0.29, assetType: 'stock' },
  { symbol: 'GOOGL', price: 175.98, change: 3.12, changePercent: 1.81, assetType: 'stock' },
  { symbol: 'AMZN', price: 186.45, change: 1.87, changePercent: 1.01, assetType: 'stock' },
  { symbol: 'TSLA', price: 248.50, change: -5.23, changePercent: -2.06, assetType: 'stock' },
  { symbol: 'NVDA', price: 875.28, change: 12.45, changePercent: 1.44, assetType: 'stock' },
  { symbol: 'META', price: 505.68, change: 8.92, changePercent: 1.79, assetType: 'stock' },
  { symbol: 'AVGO', price: 1425.80, change: 18.50, changePercent: 1.31, assetType: 'stock' },
  { symbol: 'AMD', price: 164.25, change: 3.85, changePercent: 2.40, assetType: 'stock' },
  { symbol: 'JPM', price: 198.50, change: 2.85, changePercent: 1.46, assetType: 'stock' },
  { symbol: 'V', price: 285.40, change: 3.85, changePercent: 1.37, assetType: 'stock' },
  { symbol: 'JNJ', price: 158.40, change: 1.85, changePercent: 1.18, assetType: 'stock' },
  { symbol: 'UNH', price: 525.80, change: 8.50, changePercent: 1.64, assetType: 'stock' },
  { symbol: 'LLY', price: 725.40, change: 15.80, changePercent: 2.23, assetType: 'stock' },
  { symbol: 'WMT', price: 68.50, change: 0.85, changePercent: 1.26, assetType: 'stock' },
  { symbol: 'XOM', price: 118.50, change: 1.85, changePercent: 1.59, assetType: 'stock' },
  { symbol: 'MA', price: 485.80, change: 6.50, changePercent: 1.36, assetType: 'stock' },
  { symbol: 'PG', price: 168.50, change: 2.15, changePercent: 1.29, assetType: 'stock' },
  { symbol: 'HD', price: 355.80, change: 5.20, changePercent: 1.48, assetType: 'stock' },
  { symbol: 'CVX', price: 158.40, change: 2.45, changePercent: 1.57, assetType: 'stock' },
  { symbol: 'MRK', price: 125.80, change: 1.65, changePercent: 1.33, assetType: 'stock' },
  { symbol: 'PEP', price: 175.40, change: 2.35, changePercent: 1.36, assetType: 'stock' },
  { symbol: 'KO', price: 62.85, change: 0.75, changePercent: 1.21, assetType: 'stock' },
  { symbol: 'BAC', price: 37.85, change: 0.45, changePercent: 1.20, assetType: 'stock' },
  { symbol: 'ABBV', price: 185.60, change: 2.40, changePercent: 1.31, assetType: 'stock' },
  { symbol: 'TMO', price: 585.40, change: 8.50, changePercent: 1.47, assetType: 'stock' },
  { symbol: 'COST', price: 785.40, change: 12.50, changePercent: 1.62, assetType: 'stock' },
  { symbol: 'DIS', price: 112.80, change: 2.45, changePercent: 2.22, assetType: 'stock' },
  { symbol: 'MCD', price: 285.60, change: 4.20, changePercent: 1.49, assetType: 'stock' },
  { symbol: 'NKE', price: 95.40, change: 1.85, changePercent: 1.98, assetType: 'stock' },
  { symbol: 'ABT', price: 115.80, change: 1.45, changePercent: 1.27, assetType: 'stock' },
  { symbol: 'VZ', price: 42.80, change: 0.55, changePercent: 1.30, assetType: 'stock' },
  { symbol: 'CRM', price: 285.40, change: 4.20, changePercent: 1.49, assetType: 'stock' },
  { symbol: 'TXN', price: 185.60, change: 3.20, changePercent: 1.75, assetType: 'stock' },
  { symbol: 'LIN', price: 425.80, change: 5.50, changePercent: 1.31, assetType: 'stock' },
  { symbol: 'ADBE', price: 525.60, change: 7.80, changePercent: 1.51, assetType: 'stock' },
  { symbol: 'WFC', price: 52.40, change: 0.65, changePercent: 1.26, assetType: 'stock' },
  { symbol: 'BMY', price: 52.40, change: 0.65, changePercent: 1.26, assetType: 'stock' },
  { symbol: 'ACN', price: 345.80, change: 4.80, changePercent: 1.41, assetType: 'stock' },
  { symbol: 'NEE', price: 72.50, change: 0.95, changePercent: 1.33, assetType: 'stock' },
  { symbol: 'RTX', price: 95.80, change: 1.45, changePercent: 1.54, assetType: 'stock' },
  { symbol: 'HON', price: 205.40, change: 2.85, changePercent: 1.41, assetType: 'stock' },
  { symbol: 'INTC', price: 43.85, change: -0.45, changePercent: -1.02, assetType: 'stock' },
  { symbol: 'QCOM', price: 175.80, change: 3.25, changePercent: 1.88, assetType: 'stock' },
  { symbol: 'AMGN', price: 285.40, change: 4.20, changePercent: 1.49, assetType: 'stock' },
  { symbol: 'UPS', price: 145.80, change: 2.15, changePercent: 1.50, assetType: 'stock' },
  { symbol: 'SBUX', price: 95.80, change: 1.45, changePercent: 1.54, assetType: 'stock' },
  { symbol: 'GS', price: 485.60, change: 6.80, changePercent: 1.42, assetType: 'stock' },
  { symbol: 'MS', price: 98.50, change: 1.25, changePercent: 1.29, assetType: 'stock' },
  { symbol: 'CAT', price: 358.40, change: 6.50, changePercent: 1.85, assetType: 'stock' },
  { symbol: 'GE', price: 165.80, change: 3.20, changePercent: 1.97, assetType: 'stock' },
  { symbol: 'IBM', price: 185.60, change: 2.80, changePercent: 1.53, assetType: 'stock' },
  { symbol: 'LMT', price: 465.80, change: 6.50, changePercent: 1.42, assetType: 'stock' },
  { symbol: 'BLK', price: 825.40, change: 12.50, changePercent: 1.54, assetType: 'stock' },
  { symbol: 'AXP', price: 225.60, change: 3.20, changePercent: 1.44, assetType: 'stock' },
  { symbol: 'MDT', price: 85.40, change: 1.20, changePercent: 1.42, assetType: 'stock' },
  { symbol: 'T', price: 18.50, change: 0.25, changePercent: 1.37, assetType: 'stock' },
  { symbol: 'CVS', price: 72.80, change: 1.15, changePercent: 1.60, assetType: 'stock' },
  { symbol: 'LOW', price: 245.80, change: 3.60, changePercent: 1.49, assetType: 'stock' },
  { symbol: 'SPGI', price: 425.60, change: 5.80, changePercent: 1.38, assetType: 'stock' },
  { symbol: 'DHR', price: 245.60, change: 3.80, changePercent: 1.57, assetType: 'stock' },
  { symbol: 'GILD', price: 78.50, change: 1.25, changePercent: 1.62, assetType: 'stock' },
  { symbol: 'F', price: 12.85, change: 0.25, changePercent: 1.98, assetType: 'stock' },
  { symbol: 'GM', price: 45.80, change: 0.85, changePercent: 1.89, assetType: 'stock' },
  { symbol: 'BA', price: 185.60, change: 3.80, changePercent: 2.09, assetType: 'stock' },
  { symbol: 'UBER', price: 78.50, change: 1.85, changePercent: 2.41, assetType: 'stock' },
  { symbol: 'NFLX', price: 685.20, change: 12.50, changePercent: 1.86, assetType: 'stock' },
  { symbol: 'ORCL', price: 128.45, change: 1.25, changePercent: 0.98, assetType: 'stock' },
  { symbol: 'NOW', price: 785.40, change: 18.50, changePercent: 2.41, assetType: 'stock' },
  { symbol: 'PLTR', price: 25.80, change: 1.25, changePercent: 5.09, assetType: 'stock' },
  { symbol: 'SNOW', price: 185.60, change: 4.80, changePercent: 2.66, assetType: 'stock' },
  { symbol: 'ZM', price: 68.25, change: 1.45, changePercent: 2.17, assetType: 'stock' },
  { symbol: 'SHOP', price: 78.50, change: 2.85, changePercent: 3.77, assetType: 'stock' },
  { symbol: 'SQ', price: 82.50, change: 3.25, changePercent: 4.10, assetType: 'stock' },
  { symbol: 'ROKU', price: 85.40, change: 4.20, changePercent: 5.17, assetType: 'stock' },
  { symbol: 'CRWD', price: 325.80, change: 12.50, changePercent: 4.00, assetType: 'stock' },
  { symbol: 'PANW', price: 185.60, change: 4.80, changePercent: 2.66, assetType: 'stock' },
  { symbol: 'DDOG', price: 125.80, change: 4.50, changePercent: 3.71, assetType: 'stock' },
  { symbol: 'NET', price: 95.80, change: 3.25, changePercent: 3.51, assetType: 'stock' },
  { symbol: 'MDB', price: 285.40, change: 8.50, changePercent: 3.07, assetType: 'stock' },
  { symbol: 'ZS', price: 185.80, change: 6.50, changePercent: 3.62, assetType: 'stock' },
  { symbol: 'FTNT', price: 72.50, change: 1.85, changePercent: 2.62, assetType: 'stock' },
  { symbol: 'OKTA', price: 95.40, change: 3.80, changePercent: 4.15, assetType: 'stock' },
  { symbol: 'SPLK', price: 155.60, change: 3.20, changePercent: 2.10, assetType: 'stock' },
  { symbol: 'TEAM', price: 185.60, change: 5.80, changePercent: 3.23, assetType: 'stock' },
  { symbol: 'TWLO', price: 65.80, change: 2.85, changePercent: 4.53, assetType: 'stock' },
  { symbol: 'FSLY', price: 25.40, change: 1.25, changePercent: 5.18, assetType: 'stock' },
  { symbol: 'DOCU', price: 58.50, change: 2.15, changePercent: 3.82, assetType: 'stock' },
  { symbol: 'ASAN', price: 18.25, change: 0.85, changePercent: 4.88, assetType: 'stock' },
  { symbol: 'MNDY', price: 225.80, change: 8.50, changePercent: 3.91, assetType: 'stock' },
  { symbol: 'CFLT', price: 32.50, change: 1.45, changePercent: 4.67, assetType: 'stock' },
  { symbol: 'ESTC', price: 95.80, change: 3.85, changePercent: 4.18, assetType: 'stock' },
  { symbol: 'GTLB', price: 58.40, change: 2.85, changePercent: 5.13, assetType: 'stock' },
  { symbol: 'S', price: 22.50, change: 1.15, changePercent: 5.38, assetType: 'stock' },
  { symbol: 'HCP', price: 28.50, change: 1.25, changePercent: 4.59, assetType: 'stock' },
  { symbol: 'SUMO', price: 12.85, change: 0.65, changePercent: 5.33, assetType: 'stock' },
  { symbol: 'BIGC', price: 8.50, change: 0.45, changePercent: 5.59, assetType: 'stock' },
  { symbol: 'AI', price: 28.50, change: 1.85, changePercent: 6.94, assetType: 'stock' },
  { symbol: 'PATH', price: 22.50, change: 1.25, changePercent: 5.88, assetType: 'stock' },
  { symbol: 'RBLX', price: 42.80, change: 2.15, changePercent: 5.29, assetType: 'stock' },
  { symbol: 'U', price: 35.60, change: 1.85, changePercent: 5.48, assetType: 'stock' },
  { symbol: 'MTTR', price: 5.85, change: 0.35, changePercent: 6.36, assetType: 'stock' },
  { symbol: 'VRM', price: 12.50, change: 0.85, changePercent: 7.30, assetType: 'stock' },
  { symbol: 'OPEN', price: 3.25, change: 0.25, changePercent: 8.33, assetType: 'stock' },
  { symbol: 'LCID', price: 3.25, change: 0.15, changePercent: 4.84, assetType: 'stock' },
  { symbol: 'RIVN', price: 15.60, change: 0.85, changePercent: 5.76, assetType: 'stock' },
  { symbol: 'NIO', price: 5.85, change: 0.35, changePercent: 6.36, assetType: 'stock' },
  { symbol: 'XPEV', price: 8.50, change: 0.55, changePercent: 6.92, assetType: 'stock' },
  { symbol: 'LI', price: 32.50, change: 2.15, changePercent: 7.08, assetType: 'stock' },
  
  // Top 20 Crypto
  { symbol: 'BTC', price: 67542.30, change: 1245.50, changePercent: 1.88, assetType: 'crypto' },
  { symbol: 'ETH', price: 3521.75, change: 89.20, changePercent: 2.60, assetType: 'crypto' },
  { symbol: 'BNB', price: 612.45, change: 8.30, changePercent: 1.37, assetType: 'crypto' },
  { symbol: 'SOL', price: 142.85, change: -3.45, changePercent: -2.36, assetType: 'crypto' },
  { symbol: 'XRP', price: 0.6234, change: 0.0234, changePercent: 3.90, assetType: 'crypto' },
  { symbol: 'DOGE', price: 0.1585, change: 0.0085, changePercent: 5.66, assetType: 'crypto' },
  { symbol: 'TON', price: 5.85, change: 0.25, changePercent: 4.46, assetType: 'crypto' },
  { symbol: 'ADA', price: 0.485, change: 0.0185, changePercent: 3.97, assetType: 'crypto' },
  { symbol: 'SHIB', price: 0.0000285, change: 0.0000012, changePercent: 4.40, assetType: 'crypto' },
  { symbol: 'AVAX', price: 38.85, change: 1.85, changePercent: 5.00, assetType: 'crypto' },
  { symbol: 'DOT', price: 7.85, change: 0.35, changePercent: 4.67, assetType: 'crypto' },
  { symbol: 'LINK', price: 18.95, change: 0.95, changePercent: 5.28, assetType: 'crypto' },
  { symbol: 'TRX', price: 0.125, change: 0.005, changePercent: 4.17, assetType: 'crypto' },
  { symbol: 'NEAR', price: 6.85, change: 0.45, changePercent: 7.03, assetType: 'crypto' },
  { symbol: 'MATIC', price: 0.725, change: 0.035, changePercent: 5.07, assetType: 'crypto' },
  { symbol: 'ICP', price: 12.85, change: 0.85, changePercent: 7.08, assetType: 'crypto' },
  { symbol: 'LTC', price: 85.40, change: 3.20, changePercent: 3.89, assetType: 'crypto' },
  { symbol: 'UNI', price: 9.85, change: 0.65, changePercent: 7.07, assetType: 'crypto' },
  { symbol: 'APT', price: 9.25, change: 0.75, changePercent: 8.82, assetType: 'crypto' },
  { symbol: 'ETC', price: 28.50, change: 1.85, changePercent: 6.94, assetType: 'crypto' },
];

export function StockTicker() {
  const [tickerData, setTickerData] = useState<TickerItem[]>(MOCK_TICKER_DATA);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prev => prev.map(item => {
        const volatility = item.assetType === 'crypto' ? 0.005 : 0.002;
        const priceChange = (Math.random() - 0.5) * item.price * volatility;
        const newPrice = item.price + priceChange;
        const newChange = item.change + priceChange;
        const newChangePercent = (newChange / (item.price - item.change)) * 100;
        return {
          ...item,
          price: Number(newPrice.toFixed(item.assetType === 'crypto' && newPrice < 1 ? 6 : 2)),
          change: Number(newChange.toFixed(item.assetType === 'crypto' && newPrice < 1 ? 6 : 2)),
          changePercent: Number(newChangePercent.toFixed(2)),
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (item: TickerItem) => {
    if (item.assetType === 'crypto' && item.price < 1) {
      return `$${item.price.toFixed(6)}`;
    }
    if (item.assetType === 'crypto' && item.price < 100) {
      return `$${item.price.toFixed(4)}`;
    }
    return `$${item.price.toLocaleString()}`;
  };

  return (
    <div className="w-full bg-muted/50 border-b overflow-hidden">
      <div 
        className="flex items-center gap-8 py-2 px-4"
        style={{
          animation: 'scroll-x 60s linear infinite',
        }}
      >
        {[...tickerData, ...tickerData].map((item, index) => (
          <div key={`${item.symbol}-${index}`} className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-semibold text-sm">{item.symbol}</span>
            <span className="text-sm">{formatPrice(item)}</span>
            <span className={`flex items-center gap-0.5 text-xs ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {item.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
            </span>
            {item.assetType === 'crypto' && (
              <span className="text-[10px] text-muted-foreground">24/7</span>
            )}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-x:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
