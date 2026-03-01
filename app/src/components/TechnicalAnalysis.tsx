import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { TechnicalIndicator, PatternSignal } from '@/types/stock';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BarChart3, 
  LineChart,
  Zap,
  Sparkles,
  Layers
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface TechnicalAnalysisProps {
  indicators: TechnicalIndicator[];
  patternSignals: PatternSignal[];
  activeIndicators: string[];
  onToggleIndicator: (name: string) => void;
}

export function TechnicalAnalysis({ 
  indicators, 
  patternSignals,
  activeIndicators,
  onToggleIndicator 
}: TechnicalAnalysisProps) {
  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'sell':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'sell':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case 'buy':
        return <Badge className="bg-green-500">Buy</Badge>;
      case 'sell':
        return <Badge className="bg-red-500">Sell</Badge>;
      default:
        return <Badge variant="secondary">Neutral</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'momentum':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'trend':
        return <LineChart className="h-4 w-4 text-orange-500" />;
      case 'volatility':
        return <BarChart3 className="h-4 w-4 text-purple-500" />;
      case 'pattern':
        return <Sparkles className="h-4 w-4 text-pink-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPatternStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Calculate overall sentiment
  const buySignals = indicators.filter(i => i.signal === 'buy').length;
  const sellSignals = indicators.filter(i => i.signal === 'sell').length;
  const neutralSignals = indicators.filter(i => i.signal === 'neutral').length;
  const totalSignals = indicators.length;
  
  const buyPercentage = totalSignals > 0 ? (buySignals / totalSignals) * 100 : 0;
  const sellPercentage = totalSignals > 0 ? (sellSignals / totalSignals) * 100 : 0;
  const neutralPercentage = totalSignals > 0 ? (neutralSignals / totalSignals) * 100 : 0;

  const overallSignal = buyPercentage > 50 ? 'Bullish' : sellPercentage > 50 ? 'Bearish' : 'Neutral';

  // Separate chartable indicators
  const chartableIndicators = indicators.filter(i => i.chartable);
  const nonChartableIndicators = indicators.filter(i => !i.chartable);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Technical Analysis
          </CardTitle>
          <Badge 
            variant={overallSignal === 'Bullish' ? 'default' : overallSignal === 'Bearish' ? 'destructive' : 'secondary'}
            className="text-sm"
          >
            {overallSignal}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Sentiment */}
        <div className="p-3 rounded-lg bg-muted/50">
          <div className="text-sm font-medium mb-2">Signal Distribution</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs w-12 text-green-600">Buy</span>
              <Progress value={buyPercentage} className="flex-1 h-2 bg-gray-200" />
              <span className="text-xs w-8 text-right">{buySignals}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs w-12 text-yellow-600">Neutral</span>
              <Progress value={neutralPercentage} className="flex-1 h-2 bg-gray-200" />
              <span className="text-xs w-8 text-right">{neutralSignals}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs w-12 text-red-600">Sell</span>
              <Progress value={sellPercentage} className="flex-1 h-2 bg-gray-200" />
              <span className="text-xs w-8 text-right">{sellSignals}</span>
            </div>
          </div>
        </div>

        {/* Pattern Signals */}
        {patternSignals.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Pattern Signals
            </div>
            <div className="space-y-2">
              {patternSignals.map((pattern, idx) => (
                <div 
                  key={idx}
                  className={`p-2 rounded-md border ${
                    pattern.signal === 'buy' ? 'border-green-200 bg-green-50' : 
                    pattern.signal === 'sell' ? 'border-red-200 bg-red-50' : 
                    'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {pattern.type === 'golden_cross' && <TrendingUp className="h-4 w-4 text-green-600" />}
                      {pattern.type === 'death_cross' && <TrendingDown className="h-4 w-4 text-red-600" />}
                      {pattern.type === 'bullish_engulfing' && <BarChart3 className="h-4 w-4 text-green-600" />}
                      {pattern.type === 'bearish_engulfing' && <BarChart3 className="h-4 w-4 text-red-600" />}
                      <span className="text-sm font-medium">{pattern.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getPatternStrengthColor(pattern.strength)}`}>
                        {pattern.strength}
                      </Badge>
                      {getSignalBadge(pattern.signal)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{pattern.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chartable Indicators */}
        <div className="space-y-2">
          <div className="text-sm font-medium flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Chart Overlays
            <span className="text-xs text-muted-foreground">(Click to toggle on chart)</span>
          </div>
          <TooltipProvider>
            <div className="grid gap-2">
              {chartableIndicators.map((indicator) => (
                <Tooltip key={indicator.name}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeIndicators.includes(indicator.name) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onToggleIndicator(indicator.name)}
                      className="w-full justify-between h-auto py-2"
                    >
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(indicator.category)}
                        <span className="text-sm font-medium">{indicator.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {indicator.value.toFixed(2)}
                        </span>
                        <div className={getSignalColor(indicator.signal)}>
                          {getSignalIcon(indicator.signal)}
                        </div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{indicator.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click to {activeIndicators.includes(indicator.name) ? 'remove from' : 'add to'} chart
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Other Indicators */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Additional Indicators</div>
          <TooltipProvider>
            <div className="grid gap-2">
              {nonChartableIndicators.map((indicator) => (
                <Tooltip key={indicator.name}>
                  <TooltipTrigger asChild>
                    <div 
                      className="flex items-center justify-between p-2 rounded-md border hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(indicator.category)}
                        <span className="text-sm font-medium">{indicator.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {indicator.value.toFixed(2)}
                        </span>
                        <div className={getSignalColor(indicator.signal)}>
                          {getSignalIcon(indicator.signal)}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{indicator.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {indicator.value.toFixed(2)} | Signal: {indicator.signal.toUpperCase()}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Summary */}
        <div className="p-3 rounded-lg border bg-card">
          <div className="text-sm font-medium mb-2">Technical Summary</div>
          <div className="flex flex-wrap gap-2">
            {getSignalBadge(overallSignal === 'Bullish' ? 'buy' : overallSignal === 'Bearish' ? 'sell' : 'neutral')}
            <Badge variant="outline">{buySignals} Buy Signals</Badge>
            <Badge variant="outline">{neutralSignals} Neutral</Badge>
            <Badge variant="outline">{sellSignals} Sell Signals</Badge>
            {patternSignals.length > 0 && (
              <Badge variant="outline" className="bg-amber-50">{patternSignals.length} Patterns</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Based on {totalSignals} technical indicators. Consider combining with fundamental analysis for investment decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
