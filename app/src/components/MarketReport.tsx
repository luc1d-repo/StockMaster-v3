import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { MarketReport as MarketReportType } from '@/types/stock';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  Calendar,
  Building2,
  ChevronDown,
  ChevronUp,
  Star,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MarketReportProps {
  report: MarketReportType | null;
}

const RATING_COLORS: Record<string, string> = {
  'Strong Buy': 'bg-green-600 text-white',
  'Buy': 'bg-green-500 text-white',
  'Hold': 'bg-yellow-500 text-white',
  'Sell': 'bg-red-500 text-white',
  'Strong Sell': 'bg-red-600 text-white',
};

const RATING_ICONS: Record<string, React.ReactNode> = {
  'Strong Buy': <CheckCircle2 className="h-5 w-5" />,
  'Buy': <TrendingUp className="h-5 w-5" />,
  'Hold': <AlertTriangle className="h-5 w-5" />,
  'Sell': <TrendingDown className="h-5 w-5" />,
  'Strong Sell': <TrendingDown className="h-5 w-5" />,
};

export function MarketReport({ report }: MarketReportProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!report) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full py-8">
          <div className="text-muted-foreground">No market report available</div>
        </CardContent>
      </Card>
    );
  }

  const upsideColor = report.upsidePotential > 0 ? 'text-green-500' : 'text-red-500';
  const upsideIcon = report.upsidePotential > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;

  // Count ratings
  const ratingCounts: Record<string, number> = {};
  report.recommendations.forEach(rec => {
    ratingCounts[rec.rating] = (ratingCounts[rec.rating] || 0) + 1;
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5" />
            Analyst Ratings
          </CardTitle>
          <Badge className={RATING_COLORS[report.overallRating]}>
            {report.overallRating}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price Target Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="h-4 w-4" />
              <span className="text-xs">Price Target</span>
            </div>
            <div className="text-xl font-bold">${report.consensusPriceTarget.toFixed(2)}</div>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Upside Potential</span>
            </div>
            <div className={`text-xl font-bold flex items-center gap-1 ${upsideColor}`}>
              {upsideIcon}
              {report.upsidePotential > 0 ? '+' : ''}{report.upsidePotential.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Current vs Target */}
        <div className="p-3 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Current Price</span>
            <span className="text-sm font-medium">${report.currentPrice.toFixed(2)}</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.min(100, (report.currentPrice / report.consensusPriceTarget) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">$0</span>
            <span className="text-xs font-medium text-blue-600">Target: ${report.consensusPriceTarget.toFixed(2)}</span>
          </div>
        </div>

        {/* Analyst Count */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Based on <strong>{report.analystCount}</strong> analyst ratings</span>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Rating Distribution</div>
          <div className="space-y-1">
            {Object.entries(RATING_COLORS).map(([rating]) => {
              const count = ratingCounts[rating] || 0;
              const percentage = (count / report.recommendations.length) * 100;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs w-20">{rating}</span>
                  <Progress value={percentage} className="flex-1 h-2 bg-gray-200" />
                  <span className="text-xs w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual Recommendations */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-between p-2">
              <span className="text-sm font-medium">Recent Recommendations</span>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2 mt-2">
              {report.recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 rounded-md border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{rec.firm}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {rec.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`text-xs ${RATING_COLORS[rec.rating]}`}>
                      {rec.rating}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      Target: ${rec.priceTarget.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Investment Recommendation */}
        <div className={`p-3 rounded-lg border-2 ${
          report.overallRating === 'Strong Buy' || report.overallRating === 'Buy' 
            ? 'border-green-200 bg-green-50' 
            : report.overallRating === 'Strong Sell' || report.overallRating === 'Sell'
            ? 'border-red-200 bg-red-50'
            : 'border-yellow-200 bg-yellow-50'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {RATING_ICONS[report.overallRating]}
            <span className="font-semibold">Investment Recommendation</span>
          </div>
          <p className="text-sm">
            {report.overallRating === 'Strong Buy' && 'Strong buy signal based on analyst consensus. Consider adding to portfolio.'}
            {report.overallRating === 'Buy' && 'Positive outlook with buy recommendation from analysts.'}
            {report.overallRating === 'Hold' && 'Neutral stance recommended. Monitor for changes in fundamentals.'}
            {report.overallRating === 'Sell' && 'Negative outlook. Consider reducing position.'}
            {report.overallRating === 'Strong Sell' && 'Strong sell signal. Consider exiting position.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
