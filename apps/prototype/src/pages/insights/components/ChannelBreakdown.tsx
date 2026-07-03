import { ChannelPerformance } from '@/mocks/insightsData';

interface ChannelBreakdownProps {
  channels: ChannelPerformance[];
}

export default function ChannelBreakdown({ channels }: ChannelBreakdownProps) {
  const maxRevenue = Math.max(...channels.map(c => c.revenue));

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white text-sm font-semibold">渠道效能分解</h3>
          <p className="text-foreground-500 text-xs mt-0.5">ROAS · CPA · 转化率对比</p>
        </div>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-5 gap-2 pb-2 border-b border-white/5">
        <span className="text-foreground-500 text-xs">渠道</span>
        <span className="text-foreground-500 text-xs text-right">ROAS</span>
        <span className="text-foreground-500 text-xs text-right">CPA</span>
        <span className="text-foreground-500 text-xs text-right">转化率</span>
        <span className="text-foreground-500 text-xs text-right">收入</span>
      </div>

      {/* Mobile header */}
      <div className="md:hidden grid grid-cols-3 gap-2 pb-2 border-b border-white/5 mb-2">
        <span className="text-foreground-500 text-xs">渠道</span>
        <span className="text-foreground-500 text-xs text-right">ROAS</span>
        <span className="text-foreground-500 text-xs text-right">收入</span>
      </div>

      {/* Rows */}
      <div className="flex-1 space-y-2 mt-2 overflow-y-auto">
        {channels.map(ch => (
          <>
            {/* Desktop row */}
            <div key={ch.id} className="hidden md:grid grid-cols-5 gap-2 items-center py-1.5 group hover:bg-white/5 rounded-lg px-1 -mx-1 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${ch.trend === 'up' ? '#00D4AA' : ch.trend === 'down' ? '#FF6B6B' : '#FBBF24'}15` }}>
                  <i className={`${ch.icon} text-xs ${ch.trend === 'up' ? 'text-success' : ch.trend === 'down' ? 'text-error' : 'text-warning'}`}></i>
                </span>
                <span className="text-foreground-300 text-xs">{ch.name}</span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-mono font-medium ${ch.roas >= 4 ? 'text-success' : ch.roas >= 3 ? 'text-warning' : 'text-error'}`}>
                  {ch.roas.toFixed(1)}x
                </span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-mono ${ch.cpa <= 40 ? 'text-success' : ch.cpa <= 55 ? 'text-warning' : 'text-error'}`}>
                  ${ch.cpa.toFixed(0)}
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${ch.conversionRate >= 2 ? 'bg-success' : ch.conversionRate >= 1.5 ? 'bg-warning' : 'bg-error'}`}
                      style={{ width: `${Math.min(ch.conversionRate * 40, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-foreground-500 text-xs font-mono">{ch.conversionRate.toFixed(2)}%</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end">
                  <span className="text-white text-xs font-mono font-medium">${(ch.revenue / 1000).toFixed(1)}K</span>
                  <div className="w-full h-0.5 bg-white/5 rounded-full mt-0.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500/60"
                      style={{ width: `${(ch.revenue / maxRevenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile row */}
            <div key={`m-${ch.id}`} className="md:hidden grid grid-cols-3 gap-2 items-center py-2 hover:bg-white/5 rounded-lg px-1 -mx-1 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: `${ch.trend === 'up' ? '#00D4AA' : ch.trend === 'down' ? '#FF6B6B' : '#FBBF24'}15` }}>
                  <i className={`${ch.icon} text-[10px] ${ch.trend === 'up' ? 'text-success' : ch.trend === 'down' ? 'text-error' : 'text-warning'}`}></i>
                </span>
                <span className="text-foreground-300 text-xs truncate">{ch.name}</span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-mono font-medium ${ch.roas >= 4 ? 'text-success' : ch.roas >= 3 ? 'text-warning' : 'text-error'}`}>
                  {ch.roas.toFixed(1)}x
                </span>
              </div>
              <div className="text-right">
                <span className="text-white text-xs font-mono font-medium">${(ch.revenue / 1000).toFixed(1)}K</span>
              </div>
            </div>
          </>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <span className="text-foreground-500 text-xs">总计 {channels.length} 个渠道</span>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-foreground-500">
            总投入: <span className="text-foreground-300 font-mono">${channels.reduce((s, c) => s + c.cost, 0).toLocaleString()}</span>
          </span>
          <span className="text-success">
            总回报: <span className="font-mono">${channels.reduce((s, c) => s + c.revenue, 0).toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
}