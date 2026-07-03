import {
  CostCategoryItem,
  totalMonthCost,
  unitSAOCostValue,
  DATA_AS_OF,
} from '@/mocks/insightsData';

// Batch 1（数据与术语层）：从 ROAS/CPA/CPM 广告口径改为母本 ANA-005 五类成本
// （数据 / 模型 / 媒体 / 邮件 / 专家），并给出单位 SAO 分摊（北极星效率口径）。

interface ChannelBreakdownProps {
  items: CostCategoryItem[];
}

const fmtUSD = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

export default function ChannelBreakdown({ items }: ChannelBreakdownProps) {
  const maxCost = Math.max(...items.map((c) => c.cost));

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white text-sm font-semibold">成本口径（五类）</h3>
          <p className="text-foreground-500 text-xs mt-0.5">
            数据 · 模型 · 媒体 · 邮件 · 专家（非广告投放口径）
          </p>
        </div>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-5 gap-2 pb-2 border-b border-white/5">
        <span className="text-foreground-500 text-xs">成本类别</span>
        <span className="text-foreground-500 text-xs text-right">本月成本</span>
        <span className="text-foreground-500 text-xs text-right">占比</span>
        <span className="text-foreground-500 text-xs text-right">单位 SAO 分摊</span>
        <span className="text-foreground-500 text-xs">口径说明</span>
      </div>

      {/* Mobile header */}
      <div className="md:hidden grid grid-cols-3 gap-2 pb-2 border-b border-white/5 mb-2">
        <span className="text-foreground-500 text-xs">类别</span>
        <span className="text-foreground-500 text-xs text-right">本月成本</span>
        <span className="text-foreground-500 text-xs text-right">占比</span>
      </div>

      {/* Rows */}
      <div className="flex-1 space-y-2 mt-2 overflow-y-auto">
        {items.map((cat) => (
          <div key={cat.id}>
            {/* Desktop row */}
            <div className="hidden md:grid grid-cols-5 gap-2 items-center py-1.5 group hover:bg-white/5 rounded-lg px-1 -mx-1 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md flex items-center justify-center bg-primary-500/10">
                  <i className={`${cat.icon} text-xs text-primary-400`}></i>
                </span>
                <span className="text-foreground-300 text-xs">{cat.name}</span>
              </div>
              <div className="text-right">
                <span className="text-white text-xs font-mono font-medium">{fmtUSD(cat.cost)}</span>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500/60"
                      style={{ width: `${(cat.cost / maxCost) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-foreground-500 text-xs font-mono">
                    {cat.share.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-foreground-300 text-xs font-mono">{fmtUSD(cat.perSAO)}</span>
              </div>
              <div className="min-w-0">
                <span className="text-foreground-500 text-xs truncate block">{cat.note}</span>
              </div>
            </div>
            {/* Mobile row */}
            <div className="md:hidden grid grid-cols-3 gap-2 items-center py-2 hover:bg-white/5 rounded-lg px-1 -mx-1 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md flex items-center justify-center bg-primary-500/10">
                  <i className={`${cat.icon} text-[10px] text-primary-400`}></i>
                </span>
                <span className="text-foreground-300 text-xs truncate">{cat.name}</span>
              </div>
              <div className="text-right">
                <span className="text-white text-xs font-mono font-medium">{fmtUSD(cat.cost)}</span>
              </div>
              <div className="text-right">
                <span className="text-foreground-500 text-xs font-mono">
                  {cat.share.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <span className="text-foreground-500 text-xs">
          数据截至 {DATA_AS_OF} · 对齐 Campaign 已消耗预算
        </span>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-foreground-500">
            本月总成本:{' '}
            <span className="text-foreground-300 font-mono">{fmtUSD(totalMonthCost)}</span>
          </span>
          <span className="text-success">
            单位 SAO 成本: <span className="font-mono">{fmtUSD(unitSAOCostValue)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
