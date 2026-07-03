import type { PendingApproval } from '@/mocks/todayData';

interface ApprovalsCardProps {
  approvals: PendingApproval[];
}

const typeLabel: Record<string, string> = {
  content: '内容',
  campaign: '战役',
  budget: '预算',
  account: '客户',
};

const urgencyConfig = {
  urgent: { color: 'text-error', bg: 'bg-error/10', label: '紧急' },
  normal: { color: 'text-warning', bg: 'bg-warning/10', label: '普通' },
  low: { color: 'text-foreground-500', bg: 'bg-foreground-500/10', label: '低优先' },
};

export default function ApprovalsCard({ approvals }: ApprovalsCardProps) {
  return (
    <div className="glass-card p-4 md:p-5 flex flex-col gap-3 md:gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center text-warning">
            <i className="ri-timer-line text-lg"></i>
          </span>
          <h3 className="text-white font-semibold text-sm">待审批</h3>
          <span className="badge-warning text-[11px]">{approvals.length} 项</span>
        </div>
        <button className="text-xs text-link-color hover:text-primary-300 transition-colors cursor-pointer whitespace-nowrap">
          全部审批
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {approvals.map((item) => {
          const urgency = urgencyConfig[item.urgency];
          return (
            <button
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-primary-500/10 transition-all duration-200 cursor-pointer text-left w-full"
            >
              <div className="w-2 h-2 rounded-full bg-warning shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-foreground-500 text-xs">由 {item.submittedBy} 提交</span>
                  <span className="text-foreground-700 text-[11px]">·</span>
                  <span className="text-foreground-600 text-[11px]">{item.submittedTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="badge-info text-[11px]">{typeLabel[item.type] || item.type}</span>
                <span
                  className={`${urgency.color} ${urgency.bg} text-[11px] px-2 py-0.5 rounded-full`}
                >
                  {urgency.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
