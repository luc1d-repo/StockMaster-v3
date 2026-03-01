import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { WatchlistItem, StockData } from '@/types/stock';
import { 
  Search, 
  Plus, 
  X, 
  TrendingUp, 
  TrendingDown,
  Star,
  Building2,
  Coins,
  Bitcoin
} from 'lucide-react';

interface WatchlistProps {
  watchlist: WatchlistItem[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  onAddToWatchlist: (symbol: string) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  onSearch: (query: string) => StockData[];
}

export function Watchlist({ 
  watchlist, 
  selectedSymbol, 
  onSelectSymbol, 
  onAddToWatchlist, 
  onRemoveFromWatchlist,
  onSearch
}: WatchlistProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [localResults, setLocalResults] = useState<StockData[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const results = onSearch(query);
      setLocalResults(results);
    } else {
      setLocalResults([]);
    }
  };

  const handleAddStock = (symbol: string) => {
    onAddToWatchlist(symbol);
    setSearchQuery('');
    setLocalResults([]);
    setShowSearch(false);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5" />
            Watchlist
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {showSearch && (
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks or crypto..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
              autoFocus
            />
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 max-h-48 overflow-auto">
                {localResults.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">No assets found</div>
                ) : (
                  localResults.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => handleAddStock(stock.symbol)}
                      className="w-full flex items-center justify-between p-3 hover:bg-accent text-left"
                    >
                      <div className="flex items-center gap-2">
                        {stock.assetType === 'crypto' ? (
                          <Bitcoin className="h-4 w-4 text-orange-500" />
                        ) : (
                          <Building2 className="h-4 w-4 text-blue-500" />
                        )}
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-xs text-muted-foreground">{stock.name}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {stock.assetType === 'crypto' ? 'Crypto' : 'Stock'}
                      </Badge>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-1 p-4 pt-0 max-h-[400px] overflow-auto">
          {watchlist.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Your watchlist is empty</p>
              <p className="text-xs">Add stocks or crypto to track them</p>
            </div>
          ) : (
            watchlist.map((item) => (
              <div
                key={item.symbol}
                onClick={() => onSelectSymbol(item.symbol)}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedSymbol === item.symbol 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedSymbol === item.symbol 
                      ? 'bg-primary-foreground/20' 
                      : 'bg-muted'
                  }`}>
                    {item.assetType === 'crypto' ? (
                      <Coins className="h-5 w-5" />
                    ) : (
                      <Building2 className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{item.symbol}</span>
                      {item.assetType === 'crypto' && (
                        <Badge variant="outline" className={`text-[10px] px-1 ${
                          selectedSymbol === item.symbol 
                            ? 'border-primary-foreground/30 text-primary-foreground' 
                            : ''
                        }`}>
                          24/7
                        </Badge>
                      )}
                    </div>
                    <div className={`text-xs ${
                      selectedSymbol === item.symbol 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {item.name}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">${item.price.toLocaleString()}</div>
                  <div className={`flex items-center gap-1 text-xs ${
                    item.change >= 0 
                      ? selectedSymbol === item.symbol 
                        ? 'text-green-200' 
                        : 'text-green-500'
                      : selectedSymbol === item.symbol 
                        ? 'text-red-200' 
                        : 'text-red-500'
                  }`}>
                    {item.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromWatchlist(item.symbol);
                  }}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                    selectedSymbol === item.symbol 
                      ? 'hover:bg-primary-foreground/20' 
                      : ''
                  }`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
