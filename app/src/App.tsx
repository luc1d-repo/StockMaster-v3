import { useState } from 'react';
import { useLiveStockData } from '@/hooks/useLiveStockData';
import { StockChart } from '@/components/StockChart';
import { NewsFeed } from '@/components/NewsFeed';
import { TechnicalAnalysis } from '@/components/TechnicalAnalysis';
import { MarketReport } from '@/components/MarketReport';
import { Watchlist } from '@/components/Watchlist';
import { StockInfo } from '@/components/StockInfo';
import { StockTicker } from '@/components/StockTicker';
import { FearGreedIndex } from '@/components/FearGreedIndex';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Menu, 
  TrendingUp, 
  Settings,
  Bell,
  User,
  Clock,
  Globe
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/sonner';
import type { StockData } from '@/types/stock';

function App() {
  const {
    selectedSymbol,
    setSelectedSymbol,
    stockData,
    historicalData,
    news,
    marketReport,
    watchlist,
    fearGreedIndex,
    marketHours,
    companyLogo,
    fetchData,
    searchStocks,
    addToWatchlist,
    removeFromWatchlist,
  } = useLiveStockData();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const results = searchStocks(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectStock = (symbol: string) => {
    setSelectedSymbol(symbol);
    setSearchQuery('');
    setSearchResults([]);
    fetchData(symbol);
  };

  // Format current time
  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Watchlist</h2>
                  <Watchlist
                    watchlist={watchlist}
                    selectedSymbol={selectedSymbol}
                    onSelectSymbol={(symbol) => {
                      handleSelectStock(symbol);
                      setSidebarOpen(false);
                    }}
                    onAddToWatchlist={addToWatchlist}
                    onRemoveFromWatchlist={removeFromWatchlist}
                    onSearch={searchStocks}
                  />
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg hidden md:inline">StockPro</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 px-4 md:px-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks or crypto (e.g., AAPL, BTC)..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 max-h-64 overflow-auto">
                  {searchResults.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => handleSelectStock(stock.symbol)}
                      className="w-full flex items-center justify-between p-3 hover:bg-accent text-left"
                    >
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-xs text-muted-foreground">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${stock.price.toLocaleString()}</div>
                        <div className={`text-xs ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Current Time & Market Status */}
          <div className="hidden md:flex items-center gap-4 mr-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{currentTime}</span>
            </div>
            <div className={`flex items-center gap-2 text-sm ${marketHours.isOpen ? 'text-green-600' : 'text-amber-600'}`}>
              <Globe className="h-4 w-4" />
              <span>{marketHours.isOpen ? 'Market Open' : 'Market Closed'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stock Ticker */}
      <StockTicker />

      {/* Main Content */}
      <div className="container py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Sidebar - Watchlist (Desktop) */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="sticky top-20 space-y-4">
              <Watchlist
                watchlist={watchlist}
                selectedSymbol={selectedSymbol}
                onSelectSymbol={handleSelectStock}
                onAddToWatchlist={addToWatchlist}
                onRemoveFromWatchlist={removeFromWatchlist}
                onSearch={searchStocks}
              />
              {/* Fear & Greed Index */}
              <FearGreedIndex 
                value={fearGreedIndex.value} 
                sentiment={fearGreedIndex.sentiment} 
                description={fearGreedIndex.description} 
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-4 md:space-y-6">
            {/* Stock Info & Chart Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="md:col-span-1">
                <StockInfo 
                  stock={stockData} 
                  logoUrl={companyLogo}
                  marketHours={marketHours}
                />
              </div>
              <div className="md:col-span-2">
                <StockChart 
                  data={historicalData} 
                  symbol={selectedSymbol}
                  activeIndicators={[]}
                  onToggleIndicator={() => {}}
                  availableIndicators={[]}
                />
              </div>
            </div>

            {/* Side-by-Side Dashboard: Technical Analysis & News */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <TechnicalAnalysis 
                indicators={[]}
                patternSignals={[]}
                activeIndicators={[]}
                onToggleIndicator={() => {}}
              />
              <NewsFeed news={news} />
            </div>

            {/* Analyst Ratings */}
            <MarketReport report={marketReport} />

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stockData?.assetType === 'crypto' ? (
                [
                  { label: '24h High', value: stockData.high24h ? `$${stockData.high24h.toLocaleString()}` : '-' },
                  { label: '24h Low', value: stockData.low24h ? `$${stockData.low24h.toLocaleString()}` : '-' },
                  { label: 'Market Cap', value: stockData.marketCap ? `$${(stockData.marketCap / 1e9).toFixed(2)}B` : '-' },
                  { label: 'Volume (24h)', value: stockData.volume ? `$${(stockData.volume / 1e9).toFixed(2)}B` : '-' },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-lg border bg-card">
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                    <div className="text-lg font-semibold">{stat.value}</div>
                  </div>
                ))
              ) : (
                [
                  { label: 'Day High', value: stockData ? `$${(stockData.price * 1.02).toFixed(2)}` : '-' },
                  { label: 'Day Low', value: stockData ? `$${(stockData.price * 0.98).toFixed(2)}` : '-' },
                  { label: 'Open', value: stockData ? `$${(stockData.price - stockData.change).toFixed(2)}` : '-' },
                  { label: 'Prev Close', value: stockData ? `$${(stockData.price - stockData.change).toFixed(2)}` : '-' },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-lg border bg-card">
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                    <div className="text-lg font-semibold">{stat.value}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
