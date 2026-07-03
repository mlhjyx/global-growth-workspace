import { useState } from 'react';
import { TrendDataPoint } from '@/mocks/insightsData';

interface TrendChartProps {
  data: TrendDataPoint[];
}

type MetricKey = 'impressions' | 'clicks' | 'conversions' | 'leads';

const metrics: { key: MetricKey; label: string; color: string }[] = [
  { key: 'impressions', label: '曝光量', color: '#A29BFE' },
  { key: 'clicks', label: '点击量', color: '#60A5FA' },
  { key: 'conversions', label: '转化数', color: '#00D4AA' },
  { key: 'leads', label: '线索数', color: '#FBBF24' },
];

export default function TrendChart({ data }: TrendChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('conversions');

  const maxVal = Math.max(...data.map(d => d[selectedMetric]));
  const chartHeight = 200;

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white text-sm font-semibold">12 周趋势</h3>
          <p className="text-foreground-500 text-xs mt-0.5">同比 +18.3%，环比 +5.2%</p>
        </div>
        <div className="flex items-center gap-1">
          {metrics.map(m => (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m.key)}
              className={`px-2.5 py-1 text-xs rounded-full transition-all whitespace-nowrap ${
                selectedMetric === m.key
                  ? 'text-white font-medium'
                  : 'text-foreground-500 hover:text-foreground-300'
              }`}
              style={selectedMetric === m.key ? { backgroundColor: `${m.color}20`, border: `1px solid ${m.color}40` } : {}}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div className="flex-1 flex items-end gap-1 relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <div key={ratio} className="border-t border-white/5 w-full" style={{ height: 1 }}></div>
          ))}
        </div>

        {data.map((point, idx) => {
          const height = (point[selectedMetric] / maxVal) * chartHeight;
          const selectedColor = metrics.find(m => m.key === selectedMetric)?.color || '#A29BFE';

          return (
            <div key={point.week} className="flex-1 flex flex-col items-center justify-end gap-1 relative z-10 group">
              {/* Value tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {point[selectedMetric].toLocaleString()}
              </div>
              {/* Bar */}
              <div
                className="w-full max-w-[28px] rounded-t-md transition-all duration-300 mx-auto"
                style={{
                  height: `${Math.max(height, 4)}px`,
                  background: `linear-gradient(180deg, ${selectedColor} 0%, ${selectedColor}40 100%)`,
                  opacity: idx >= data.length - 2 ? 1 : 0.7,
                }}
              ></div>
              {/* Label */}
              <span className="text-foreground-500 text-xs mt-1">{point.week}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
        {metrics.map(m => (
          <div key={m.key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: m.color }}></span>
            <span className={`text-xs ${selectedMetric === m.key ? 'text-white' : 'text-foreground-500'}`}>
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}