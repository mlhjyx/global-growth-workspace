import type { ActivityItem } from '@/mocks/campaignData';

interface ActivityStreamProps {
  activities: ActivityItem[];
}

const typeIcon: Record<string, string> = {
  create: 'ri-add-circle-line',
  update: 'ri-edit-circle-line',
  approve: 'ri-check-double-line',
  publish: 'ri-send-plane-line',
  comment: 'ri-message-2-line',
  alert: 'ri-error-warning-line',
};

const typeColor: Record<string, string> = {
  create: 'text-primary-400',
  update: 'text-info',
  approve: 'text-success',
  publish: 'text-primary-400',
  comment: 'text-foreground-500',
  alert: 'text-error',
};

export default function ActivityStream({ activities }: ActivityStreamProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-primary-500/10 shrink-0">
        <span className="w-4 h-4 flex items-center justify-center text-foreground-500">
          <i className="ri-history-line text-sm"></i>
        </span>
        <p className="text-foreground-500 text-xs font-medium">活动流</p>
        <span className="text-foreground-700 text-[11px]">·</span>
        <span className="text-foreground-600 text-[11px]">最近 24 小时</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.02] transition-colors"
            >
              <span className={`w-5 h-5 flex items-center justify-center ${typeColor[item.type]} shrink-0 mt-0.5`}>
                <i className={`${typeIcon[item.type]} text-sm`}></i>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-foreground-400 text-xs">
                  <span className="text-foreground-300 font-medium">{item.user}</span>
                  {' '}{item.action}{' '}
                  <span className="text-primary-400">{item.target}</span>
                </p>
                <p className="text-foreground-700 text-[11px] mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}