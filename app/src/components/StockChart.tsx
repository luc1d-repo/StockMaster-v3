import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, LineSeries, AreaSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, CandlestickData, LineData, Time } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { HistoricalData } from '@/types/stock';
import { TrendingUp, BarChart3, Activity, Layers, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StockChartProps {
  data: HistoricalData[];
  symbol: string;
  activeIndicators: string[];
  onToggleIndicator: (name: string) => void;
  availableIndicators: { name: string; signal: string; chartable: boolean }[];
}

export function StockChart({ 
  data, 
  symbol, 
  activeIndicators, 
  onToggleIndicator,
  availableIndicators 
}: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<'Candlestick'> | ISeriesApi<'Line'> | ISeriesApi<'Area'> | null>(null);
  const indicatorSeriesRef = useRef<Record<string, ISeriesApi<'Line'>>>({});
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'>('1M');
  const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
      },
      grid: {
        vertLines: { color: '#e2e8f0' },
        horzLines: { color: '#e2e8f0' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#94a3b8',
          labelBackgroundColor: '#64748b',
        },
        horzLine: {
          color: '#94a3b8',
          labelBackgroundColor: '#64748b',
        },
      },
      rightPriceScale: {
        borderColor: '#e2e8f0',
      },
      timeScale: {
        borderColor: '#e2e8f0',
        timeVisible: true,
      },
      handleScroll: {
        vertTouchDrag: false,
      },
    });

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update main chart series
  useEffect(() => {
    if (!chartRef.current) return;

    // Clear main series
    if (mainSeriesRef.current) {
      chartRef.current.removeSeries(mainSeriesRef.current);
      mainSeriesRef.current = null;
    }

    // Filter data based on timeframe
    const now = new Date();
    const filteredData = data.filter(d => {
      const date = new Date(d.date);
      const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      switch (timeframe) {
        case '1D': return diffDays <= 1;
        case '1W': return diffDays <= 7;
        case '1M': return diffDays <= 30;
        case '3M': return diffDays <= 90;
        case '6M': return diffDays <= 180;
        case '1Y': return diffDays <= 365;
        default: return true;
      }
    });

    // Add main series
    if (chartType === 'candlestick') {
      const candlestickSeries = chartRef.current.addSeries(CandlestickSeries, {
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderUpColor: '#22c55e',
        borderDownColor: '#ef4444',
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });

      const candleData: CandlestickData[] = filteredData.map(d => ({
        time: d.date as Time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));

      candlestickSeries.setData(candleData);
      mainSeriesRef.current = candlestickSeries;
    } else if (chartType === 'line') {
      const lineSeries = chartRef.current.addSeries(LineSeries, {
        color: '#3b82f6',
        lineWidth: 2,
      });

      const lineData: LineData[] = filteredData.map(d => ({
        time: d.date as Time,
        value: d.close,
      }));

      lineSeries.setData(lineData);
      mainSeriesRef.current = lineSeries;
    } else if (chartType === 'area') {
      const areaSeries = chartRef.current.addSeries(AreaSeries, {
        lineColor: '#3b82f6',
        topColor: 'rgba(59, 130, 246, 0.4)',
        bottomColor: 'rgba(59, 130, 246, 0.05)',
        lineWidth: 2,
      });

      const areaData: LineData[] = filteredData.map(d => ({
        time: d.date as Time,
        value: d.close,
      }));

      areaSeries.setData(areaData);
      mainSeriesRef.current = areaSeries;
    }

    chartRef.current.timeScale().fitContent();
  }, [data, chartType, timeframe]);

  // Update indicator overlays
  useEffect(() => {
    if (!chartRef.current) return;

    // Clear existing indicator series
    Object.values(indicatorSeriesRef.current).forEach(series => {
      chartRef.current?.removeSeries(series);
    });
    indicatorSeriesRef.current = {};

    const filteredData = data.filter(d => {
      const date = new Date(d.date);
      const now = new Date();
      const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      switch (timeframe) {
        case '1D': return diffDays <= 1;
        case '1W': return diffDays <= 7;
        case '1M': return diffDays <= 30;
        case '3M': return diffDays <= 90;
        case '6M': return diffDays <= 180;
        case '1Y': return diffDays <= 365;
        default: return true;
      }
    });

    // Add active indicators
    activeIndicators.forEach(indicatorName => {
      if (indicatorName === 'SMA (50)' && chartRef.current) {
        const series = chartRef.current.addSeries(LineSeries, {
          color: '#f59e0b',
          lineWidth: 2,
          title: 'SMA 50',
        });
        const lineData: LineData[] = filteredData
          .filter(d => d.sma50)
          .map(d => ({ time: d.date as Time, value: d.sma50! }));
        series.setData(lineData);
        indicatorSeriesRef.current['SMA (50)'] = series;
      }
      
      if (indicatorName === 'SMA (200)' && chartRef.current) {
        const series = chartRef.current.addSeries(LineSeries, {
          color: '#8b5cf6',
          lineWidth: 2,
          title: 'SMA 200',
        });
        const lineData: LineData[] = filteredData
          .filter(d => d.sma200)
          .map(d => ({ time: d.date as Time, value: d.sma200! }));
        series.setData(lineData);
        indicatorSeriesRef.current['SMA (200)'] = series;
      }

      if (indicatorName === 'Bollinger Bands' && chartRef.current) {
        const upperSeries = chartRef.current.addSeries(LineSeries, {
          color: '#06b6d4',
          lineWidth: 1,
          lineStyle: 2,
          title: 'BB Upper',
        });
        const upperData: LineData[] = filteredData
          .filter(d => d.upperBand)
          .map(d => ({ time: d.date as Time, value: d.upperBand! }));
        upperSeries.setData(upperData);
        indicatorSeriesRef.current['BB Upper'] = upperSeries;

        const lowerSeries = chartRef.current.addSeries(LineSeries, {
          color: '#06b6d4',
          lineWidth: 1,
          lineStyle: 2,
          title: 'BB Lower',
        });
        const lowerData: LineData[] = filteredData
          .filter(d => d.lowerBand)
          .map(d => ({ time: d.date as Time, value: d.lowerBand! }));
        lowerSeries.setData(lowerData);
        indicatorSeriesRef.current['BB Lower'] = lowerSeries;
      }
    });
  }, [activeIndicators, data, timeframe]);

  const latestPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[data.length - 2]?.close || latestPrice;
  const priceChange = latestPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  const chartableIndicators = availableIndicators.filter(i => i.chartable);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <CardTitle className="text-xl font-bold">{symbol}</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">${latestPrice.toLocaleString()}</span>
              <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showIndicatorPanel ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowIndicatorPanel(!showIndicatorPanel)}
              className="flex items-center gap-1"
            >
              <Layers className="h-4 w-4" />
              Indicators
              {activeIndicators.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{activeIndicators.length}</Badge>
              )}
            </Button>
            <ToggleGroup type="single" value={chartType} onValueChange={(v) => v && setChartType(v as typeof chartType)}>
              <ToggleGroupItem value="candlestick" aria-label="Candlestick">
                <BarChart3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="line" aria-label="Line">
                <TrendingUp className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="area" aria-label="Area">
                <Activity className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        
        {/* Indicator Panel */}
        {showIndicatorPanel && (
          <div className="mt-2 p-2 rounded-lg bg-muted/50 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center mr-1">Overlay:</span>
            {chartableIndicators.map((indicator) => (
              <Button
                key={indicator.name}
                variant={activeIndicators.includes(indicator.name) ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToggleIndicator(indicator.name)}
                className="text-xs h-7"
              >
                {indicator.name}
                {activeIndicators.includes(indicator.name) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
        )}

        {/* Active Indicator Legend */}
        {activeIndicators.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {activeIndicators.includes('SMA (50)') && (
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-0.5 bg-amber-500"></div>
                <span className="text-muted-foreground">SMA 50</span>
              </div>
            )}
            {activeIndicators.includes('SMA (200)') && (
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-0.5 bg-violet-500"></div>
                <span className="text-muted-foreground">SMA 200</span>
              </div>
            )}
            {activeIndicators.includes('Bollinger Bands') && (
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-0.5 bg-cyan-500 border-dashed"></div>
                <span className="text-muted-foreground">Bollinger Bands</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-1 mt-2">
          {(['1D', '1W', '1M', '3M', '6M', '1Y'] as const).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="text-xs px-2 py-1 h-7"
            >
              {tf}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={chartContainerRef} className="w-full h-[400px]" />
      </CardContent>
    </Card>
  );
}
