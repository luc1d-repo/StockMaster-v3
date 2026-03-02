import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge } from 'lucide-react';

interface FearGreedIndexProps {
  value: number;
  sentiment: string;
  description: string;
}

export function FearGreedIndex({ value, sentiment, description }: FearGreedIndexProps) {
  // Calculate gauge color based on value
  const getGaugeColor = (val: number): string => {
    if (val <= 20) return '#ef4444'; // Extreme Fear - Red
    if (val <= 40) return '#f97316'; // Fear - Orange
    if (val <= 60) return '#eab308'; // Neutral - Yellow
    if (val <= 80) return '#22c55e'; // Greed - Green
    return '#10b981'; // Extreme Greed - Emerald
  };

  const getGaugePosition = (val: number): number => {
    // Map 0-100 to -90 to 90 degrees
    return (val / 100) * 180 - 90;
  };

  const color = getGaugeColor(value);
  const rotation = getGaugePosition(value);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Fear & Greed Index
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gauge */}
        <div className="relative flex justify-center">
          <div className="relative w-40 h-20 overflow-hidden">
            {/* Gauge background arc */}
            <svg viewBox="0 0 200 100" className="w-full h-full">
              {/* Background gradient arc */}
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="25%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="75%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="20"
                strokeLinecap="round"
              />
              {/* Needle */}
              <g transform={`rotate(${rotation}, 100, 100)`}>
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="30"
                  stroke="#1f2937"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="8" fill="#1f2937" />
              </g>
            </svg>
          </div>
          {/* Value display */}
          <div className="absolute bottom-0 text-center">
            <div className="text-3xl font-bold" style={{ color }}>{value}</div>
          </div>
        </div>

        {/* Sentiment */}
        <div className="text-center">
          <div 
            className="text-lg font-semibold"
            style={{ color }}
          >
            {sentiment}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Extreme Fear</span>
          <span>Neutral</span>
          <span>Extreme Greed</span>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-5 gap-1 text-[10px] text-center">
          <div className="p-1 rounded bg-red-100 text-red-700">0-20</div>
          <div className="p-1 rounded bg-orange-100 text-orange-700">21-40</div>
          <div className="p-1 rounded bg-yellow-100 text-yellow-700">41-60</div>
          <div className="p-1 rounded bg-green-100 text-green-700">61-80</div>
          <div className="p-1 rounded bg-emerald-100 text-emerald-700">81-100</div>
        </div>
      </CardContent>
    </Card>
  );
}
