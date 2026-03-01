import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { NewsItem } from '@/types/stock';
import { Globe, Calendar, TrendingUp, TrendingDown, Minus, Search, Filter, MapPin, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface NewsFeedProps {
  news: NewsItem[];
}

const GEOGRAPHIES = [
  'All',
  'USA',
  'Europe',
  'EU',
  'Asia-Pacific',
  'China',
  'India',
  'Middle East',
  'Latin America',
  'North America',
  'Global',
];

export function NewsFeed({ news }: NewsFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGeography, setSelectedGeography] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedNews, setExpandedNews] = useState<string[]>([]);

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGeography = 
        selectedGeography === 'All' || 
        item.geography?.includes(selectedGeography);
      
      return matchesSearch && matchesGeography;
    });
  }, [news, searchQuery, selectedGeography]);

  const toggleExpand = (id: string) => {
    setExpandedNews(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAIDirectionColor = (direction?: string) => {
    switch (direction) {
      case 'upward':
        return 'bg-green-500 text-white';
      case 'downward':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Market News
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-accent' : ''}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2 mt-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {showFilters && (
            <div className="flex flex-wrap gap-1">
              {GEOGRAPHIES.map((geo) => (
                <Button
                  key={geo}
                  variant={selectedGeography === geo ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedGeography(geo)}
                  className="text-xs h-7"
                >
                  {geo}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-3 p-4 pt-0">
            {filteredNews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No news found matching your criteria.
              </div>
            ) : (
              filteredNews.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm leading-tight mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {item.summary}
                      </p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {item.source}
                        </Badge>
                        
                        {item.geography?.map((geo) => (
                          <Badge
                            key={geo}
                            variant="secondary"
                            className="text-xs flex items-center gap-1"
                          >
                            <MapPin className="h-3 w-3" />
                            {geo}
                          </Badge>
                        ))}
                        
                        {item.sentiment && (
                          <Badge
                            variant="outline"
                            className={`text-xs flex items-center gap-1 ${getSentimentColor(item.sentiment)}`}
                          >
                            {getSentimentIcon(item.sentiment)}
                            {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                          </Badge>
                        )}
                      </div>

                      {/* AI Analysis Section */}
                      {item.aiAnalysis && (
                        <Collapsible 
                          open={expandedNews.includes(item.id)}
                          onOpenChange={() => toggleExpand(item.id)}
                          className="mt-2"
                        >
                          <CollapsibleTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full justify-between p-2 h-auto bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border border-purple-200"
                            >
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                <span className="text-sm font-medium">AI Analysis</span>
                                <Badge className={`text-xs ${getAIDirectionColor(item.aiAnalysis.direction)}`}>
                                  {item.aiAnalysis.direction === 'upward' && <TrendingUp className="h-3 w-3 mr-1" />}
                                  {item.aiAnalysis.direction === 'downward' && <TrendingDown className="h-3 w-3 mr-1" />}
                                  {item.aiAnalysis.direction === 'neutral' && <Minus className="h-3 w-3 mr-1" />}
                                  {item.aiAnalysis.direction.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {item.aiAnalysis.confidence}% confidence
                                </span>
                              </div>
                              {expandedNews.includes(item.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="p-3 mt-1 rounded-lg bg-gradient-to-r from-purple-50/50 to-blue-50/50 border border-purple-100">
                              <div className="space-y-2">
                                <div>
                                  <span className="text-xs font-medium text-purple-700">Reasoning:</span>
                                  <p className="text-sm text-gray-700">{item.aiAnalysis.reasoning}</p>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-purple-700">Key Factors:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.aiAnalysis.keyFactors.map((factor, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs bg-white">
                                        {factor}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(item.publishedAt))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
