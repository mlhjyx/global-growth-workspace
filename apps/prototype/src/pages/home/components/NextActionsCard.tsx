import type { NextAction } from '@/mocks/todayData';

interface NextActionsCardProps {
  actions: NextAction[];
}

const priorityConfig = {
  high: { color: 'text-error', bg: 'bg-error/10', border: 'border-error/30' },
  medium: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
  low: { color: 'text-foreground-500', bg: 'bg-foreground-500/10', border: 'border-foreground-500/20' },
};

const typeIcon: Record<string, string> = {
  review: 'ri-eye-line',
  approve: 'ri-check-double-line',
  publish: 'ri-send-plane-line',
  respond: 'ri-reply-line',
  analyze: 'ri-bar-chart-line',
};

export default function NextActionsCard({ actions }: NextActionsCardProps) {
  return (
    <div className="glass-card p-4 md:p-5 flex flex-col gap-3 md:gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center text-primary-400">
            <i className="ri-play-list-2-line text-lg"></i>
          </span>
          <h3 className="text-white font-semibold text-sm">下一步行动</h3>
          <span className="badge-error text-[11px]">{actions.filter(a => a.priority === 'high').length} 项高优先</span>
        </div>
        <button className="text-xs text-link-color hover:text-primary-300 transition-colors cursor-pointer whitespace-nowrap">
          查看全部
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {actions.map((action) => {
          const config = priorityConfig[action.priority];
          return (
            <button
              key={action.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-primary-500/10 transition-all duration-200 cursor-pointer text-left w-full"
            >
              <div className={`w-8 h-8 rounded-lg ${config.bg} ${config.border} border flex items-center justify-center shrink-0 mt-0.5`}>
                <span className={`w-4 h-4 flex items-center justify-center ${config.color}`}>
                  <i className={`${typeIcon[action.type]} text-sm`}></i>
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{action.title}</p>
                <p className="text-foreground-500 text-xs mt-0.5 line-clamp-1">{action.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-foreground-600 text-[11px]">{action.time}</span>
                  {action.campaign && (
                    <>
                      <span className="text-foreground-700">·</span>
                      <span className="text-primary-400 text-[11px] truncate">{action.campaign}</span>
                    </>
                  )}
                </div>
              </div>
              <span className={`text-[11px] font-medium ${config.color} shrink-0`}>
                {action.priority === 'high' ? '高' : action.priority === 'medium' ? '中' : '低'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}