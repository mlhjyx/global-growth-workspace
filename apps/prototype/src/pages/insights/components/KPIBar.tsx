import { KPIItem } from '@/mocks/insightsData';

interface KPIBarProps {
  kpis: KPIItem[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export default function KPIBar({ kpis, selectedPeriod, onPeriodChange }: KPIBarProps) {
  const periods = ['7天', '30天', '90天', '本年'];

  return (
    <div className="px-5 py-4 border-b border-primary-500/10 shrink-0"
      style={{ background: 'linear-gradient(90deg, rgba(12,10,26,0.8) 0%, rgba(26,16,60,0.6) 100%)' }}
    >
      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h1 className="text-white text-lg font-semibold">洞察分析</h1>
          <p className="text-foreground-500 text-xs mt-0.5">全维度数据视图 · 归因模型 · 智能周报</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          <div className="flex bg-white/5 rounded-lg p-0.5">
            {periods.map(p => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`px-3 py-1.5 text-xs rounded-md transition-all whitespace-nowrap ${
                  selectedPeriod === p
                    ? 'bg-primary-500 text-white'
                    : 'text-foreground-500 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs whitespace-nowrap">
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <i className="ri-calendar-line text-xs"></i>
            </span>
            2026-06-25 → 2026-07-02
          </button>
          <button className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs whitespace-nowrap">
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <i className="ri-download-2-line text-xs"></i>
            </span>
            导出数据
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(kpi => (
          <div
            key={kpi.id}
            className="glass-card p-3 cursor-pointer hover:border-primary-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground-500 text-xs">{kpi.label}</span>
              <span className={`w-6 h-6 rounded-md flex items-center justify-center ${
                kpi.trend === 'up' ? 'bg-success/10' : kpi.trend === 'down' ? 'bg-error/10' : 'bg-white/5'
              }`}>
                <i className={`${kpi.icon} text-xs ${
                  kpi.trend === 'up' ? 'text-success' : kpi.trend === 'down' ? 'text-error' : 'text-foreground-500'
                }`}></i>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-white text-xl font-bold font-mono">{kpi.value}</span>
              <span className={`text-xs font-medium ${
                kpi.trend === 'up' ? 'text-success' : kpi.trend === 'down' ? 'text-error' : 'text-foreground-500'
              }`}>
                {kpi.change}
              </span>
            </div>
            {kpi.description && (
              <p className="text-foreground-500 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {kpi.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}