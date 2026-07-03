import type { EngagementActivity } from '@/mocks/engagementData';

interface Props {
  activities: EngagementActivity[];
}

const typeIcons: Record<string, string> = {
  respond: 'ri-reply-line',
  convert: 'ri-user-follow-line',
  assign: 'ri-user-shared-line',
  escalate: 'ri-alert-line',
  ai_suggest: 'ri-robot-line',
  alert: 'ri-error-warning-line',
};

const typeColors: Record<string, string> = {
  respond: 'text-info',
  convert: 'text-success',
  assign: 'text-primary-400',
  escalate: 'text-warning',
  ai_suggest: 'text-ai-accent',
  alert: 'text-error',
};

const platformIcons: Record<string, string> = {
  linkedin: 'ri-linkedin-fill',
  twitter: 'ri-twitter-fill',
  email: 'ri-mail-fill',
  facebook: 'ri-facebook-fill',
};

const platformColors: Record<string, string> = {
  linkedin: 'text-info',
  twitter: 'text-foreground-400',
  email: 'text-warning',
  facebook: 'text-info',
};

export default function EngagementActivityStream({ activities }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-2.5 border-b border-primary-500/10 shrink-0 flex items-center gap-2">
        <span className="w-4 h-4 flex items-center justify-center text-foreground-500"><i className="ri-history-line text-xs"></i></span>
        <h3 className="text-white text-xs font-semibold">互动活动流</h3>
        <span className="text-foreground-600 text-[10px]">最近 24 小时</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-2.5">
        <div className="flex gap-3 overflow-x-auto">
          {activities.map(activity => (
            <div
              key={activity.id}
              className="flex items-start gap-2 shrink-0 px-3 py-2 rounded-lg bg-white/3 border border-primary-500/5 min-w-[260px]"
            >
              <div className="w-7 h-7 rounded-full bg-primary-500/10 flex items-center justify-center shrink-0">
                <span className="text-foreground-300 text-[10px] font-medium">{activity.userAvatar}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-white text-[11px] font-medium">{activity.user}</span>
                  <span className="text-foreground-500 text-[10px]">{activity.action}</span>
                </div>
                <p className="text-foreground-400 text-[10px] truncate">{activity.target}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`w-3 h-3 flex items-center justify-center ${typeColors[activity.type]}`}>
                    <i className={`${typeIcons[activity.type]} text-[10px]`}></i>
                  </span>
                  <span className={`w-3 h-3 flex items-center justify-center ${platformColors[activity.platform]}`}>
                    <i className={`${platformIcons[activity.platform]} text-[10px]`}></i>
                  </span>
                  <span className="text-foreground-600 text-[10px]">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}