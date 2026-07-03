import { AIInsightItem } from '@/mocks/insightsData';

interface InsightsAIProps {
  insights: AIInsightItem[];
}

const typeConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  discovery: { icon: 'ri-lightbulb-line', color: 'text-primary-400', bg: 'bg-primary-500/10', label: '发现' },
  warning: { icon: 'ri-error-warning-line', color: 'text-warning', bg: 'bg-warning/10', label: '预警' },
  opportunity: { icon: 'ri-rocket-line', color: 'text-success', bg: 'bg-success/10', label: '机会' },
  anomaly: { icon: 'ri-alert-line', color: 'text-error', bg: 'bg-error/10', label: '异常' },
};

export default function InsightsAI({ insights }: InsightsAIProps) {
  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white text-sm font-semibold">AI 数据洞察</h3>
          <p className="text-foreground-500 text-xs mt-0.5">{insights.length} 条智能发现</p>
        </div>
        <span className="badge-ai text-xs flex items-center gap-1">
          <i className="ri-robot-2-line text-xs"></i>
          AI 驱动
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {insights.map(insight => {
          const config = typeConfig[insight.type];
          return (
            <div
              key={insight.id}
              className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary-500/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-2.5">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${config.bg}`}>
                  <i className={`${config.icon} text-xs ${config.color}`}></i>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                    <span className="text-foreground-500 text-xs">{insight.confidence}% 置信度</span>
                  </div>
                  <h4 className="text-white text-xs font-medium mb-1">{insight.title}</h4>
                  <p className="text-foreground-500 text-xs leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                    {insight.content}
                  </p>
                  {insight.relatedMetric && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                      <span className="text-foreground-500 text-xs">关联指标: {insight.relatedMetric}</span>
                    </div>
                  )}
                </div>
              </div>
              {insight.actionable && insight.actionText && (
                <button className="mt-2 w-full btn-secondary flex items-center justify-center gap-1 py-1.5 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="w-3.5 h-3.5 flex items-center justify-center">
                    <i className="ri-flashlight-line text-xs"></i>
                  </span>
                  {insight.actionText}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}