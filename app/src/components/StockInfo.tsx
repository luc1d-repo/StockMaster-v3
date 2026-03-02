import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StockData } from '@/types/stock';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  Activity,
  Clock,
  Coins,
  Globe
} from 'lucide-react';

interface StockInfoProps {
  stock: StockData | null;
  logoUrl: string;
  marketHours: { isOpen: boolean; timeUntil: string };
}

export function StockInfo({ stock, logoUrl, marketHours }: StockInfoProps) {
  if (!stock) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full py-8">
          <div className="text-muted-foreground">Select a stock to view details</div>
        </CardContent>
      </Card>
    );
  }

  const isCrypto = stock.assetType === 'crypto';

  const formatNumber = (num: number | undefined, suffix: string = '') => {
    if (num === undefined || num === null) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T${suffix}`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B${suffix}`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M${suffix}`;
    return `$${num.toLocaleString()}${suffix}`;
  };

  const formatVolume = (num: number | undefined) => {
    if (num === undefined || num === null) return 'N/A';
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  const formatCryptoAmount = (num: number | undefined) => {
    if (num === undefined || num === null) return 'N/A';
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
  };

  const isPositive = stock.change >= 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={stock.symbol} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`fallback-icon ${logoUrl ? 'hidden' : ''}`}>
                {isCrypto ? <Coins className="h-6 w-6 text-primary" /> : <Building2 className="h-6 w-6 text-primary" />}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{stock.symbol}</CardTitle>
                <Badge variant={isCrypto ? 'secondary' : 'outline'} className="text-xs">
                  {isCrypto ? 'Crypto' : 'Stock'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{stock.name}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price Display */}
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-3xl font-bold">${stock.price.toLocaleString()}</div>
          <div className={`flex items-center justify-center gap-1 text-sm mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </div>
          {isCrypto && (
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              24h change
            </div>
          )}
        </div>

        {/* Market Hours */}
        {!isCrypto && (
          <div className={`flex items-center justify-between p-3 rounded-lg ${marketHours.isOpen ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-center gap-2">
              <Globe className={`h-4 w-4 ${marketHours.isOpen ? 'text-green-600' : 'text-amber-600'}`} />
              <span className={`text-sm font-medium ${marketHours.isOpen ? 'text-green-700' : 'text-amber-700'}`}>
                {marketHours.isOpen ? 'Market Open' : 'Market Closed'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{marketHours.timeUntil}</span>
          </div>
        )}

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <PieChart className="h-4 w-4" />
              <span className="text-xs">Market Cap</span>
            </div>
            <div className="font-semibold">{formatNumber(stock.marketCap)}</div>
          </div>
          
          <div className="p-3 rounded-lg border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">{isCrypto ? '24h Volume' : 'Volume'}</span>
            </div>
            <div className="font-semibold">{formatVolume(stock.volume)}</div>
          </div>
          
          {!isCrypto ? (
            <>
              <div className="p-3 rounded-lg border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs">P/E Ratio</span>
                </div>
                <div className="font-semibold">{stock.peRatio?.toFixed(2) || 'N/A'}</div>
              </div>
              
              <div className="p-3 rounded-lg border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs">Avg Volume</span>
                </div>
                <div className="font-semibold">{formatVolume(stock.avgVolume)}</div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 rounded-lg border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Coins className="h-4 w-4" />
                  <span className="text-xs">Circulating Supply</span>
                </div>
                <div className="font-semibold">{formatCryptoAmount(stock.circulatingSupply)}</div>
              </div>
              
              {stock.totalSupply && (
                <div className="p-3 rounded-lg border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Activity className="h-4 w-4" />
                    <span className="text-xs">Total Supply</span>
                  </div>
                  <div className="font-semibold">{formatCryptoAmount(stock.totalSupply)}</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Range Display */}
        <div className="p-3 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {isCrypto ? '24h Range' : '52 Week Range'}
            </span>
            <span className="text-xs text-muted-foreground">
              ${isCrypto ? stock.low24h?.toLocaleString() : stock.low52Week?.toFixed(2)} - 
              ${isCrypto ? stock.high24h?.toLocaleString() : stock.high52Week?.toFixed(2)}
            </span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-blue-500 rounded-full"
              style={{ 
                left: '0%',
                width: isCrypto 
                  ? stock.high24h && stock.low24h 
                    ? `${((stock.price - stock.low24h) / (stock.high24h - stock.low24h)) * 100}%` 
                    : '50%'
                  : stock.high52Week && stock.low52Week 
                    ? `${((stock.price - stock.low52Week) / (stock.high52Week - stock.low52Week)) * 100}%` 
                    : '50%'
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">Low</span>
            <span className="text-xs font-medium">Current: ${stock.price.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>

        {/* Trading Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${marketHours.isOpen || isCrypto ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-sm">{isCrypto ? '24/7 Trading' : marketHours.isOpen ? 'Market Open' : 'Market Closed'}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {isCrypto ? 'Live updates every 30s' : marketHours.isOpen ? 'Real-time data' : marketHours.timeUntil}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
