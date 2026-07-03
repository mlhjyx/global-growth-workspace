import { useState } from 'react';
import type { Anomaly } from '@/mocks/todayData';

interface AnomalyCardProps {
  anomalies: Anomaly[];
}

const severityConfig = {
  critical: {
    icon: 'ri-error-warning-fill',
    color: 'text-error',
    bg: 'bg-error/10',
    border: 'border-error/30',
  },
  warning: {
    icon: 'ri-alert-fill',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
  },
  info: {
    icon: 'ri-information-fill',
    color: 'text-info',
    bg: 'bg-info/10',
    border: 'border-info/30',
  },
};

const statusLabel: Record<string, string> = {
  new: '新',
  acknowledged: '已确认',
  in_progress: '处理中',
};

export default function AnomalyCard({ anomalies }: AnomalyCardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const criticalCount = anomalies.filter((a) => a.severity === 'critical').length;

  return (
    <div className="glass-card p-4 md:p-5 flex flex-col gap-3 md:gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center text-error">
            <i className="ri-shield-flash-line text-lg"></i>
          </span>
          <h3 className="text-white font-semibold text-sm">异常中心</h3>
          {criticalCount > 0 && (
            <span className="badge-error text-[11px]">{criticalCount} 条严重</span>
          )}
        </div>
        <button className="text-xs text-link-color hover:text-primary-300 transition-colors cursor-pointer whitespace-nowrap">
          查看全部
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {anomalies.map((item) => {
          const severity = severityConfig[item.severity];
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-lg bg-white/[0.02] border border-transparent hover:border-primary-500/10 transition-all duration-200"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="flex items-center gap-3 p-3 w-full cursor-pointer text-left"
              >
                <div
                  className={`w-7 h-7 rounded-lg ${severity.bg} ${severity.border} border flex items-center justify-center shrink-0`}
                >
                  <span className={`w-4 h-4 flex items-center justify-center ${severity.color}`}>
                    <i className={`${severity.icon} text-sm`}></i>
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-foreground-600 text-[11px]">{item.source}</span>
                    <span className="text-foreground-700 text-[11px]">·</span>
                    <span className="text-foreground-600 text-[11px]">{item.time}</span>
                  </div>
                </div>
                <span className="text-foreground-500 text-[11px] shrink-0">
                  {statusLabel[item.status]}
                </span>
                <span
                  className={`w-4 h-4 flex items-center justify-center text-foreground-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                >
                  <i className="ri-arrow-down-s-line text-sm"></i>
                </span>
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 pt-0 animate-slide-up">
                  <p className="text-foreground-400 text-xs leading-relaxed pl-10">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 pl-10">
                    <button className="text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-foreground-300 transition-colors cursor-pointer whitespace-nowrap">
                      查看详情
                    </button>
                    <button className="text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-foreground-300 transition-colors cursor-pointer whitespace-nowrap">
                      重试
                    </button>
                    <button className="text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-foreground-500 transition-colors cursor-pointer whitespace-nowrap">
                      忽略
                    </button>
                    <button className="text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-foreground-300 transition-colors cursor-pointer whitespace-nowrap">
                      分配处理
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
