import { EventStreamItem } from '@/mocks/insightsData';

interface EventStreamProps {
  events: EventStreamItem[];
}

const typeConfig: Record<string, { icon: string; color: string }> = {
  conversion: { icon: 'ri-exchange-dollar-line', color: '#00D4AA' },
  click: { icon: 'ri-cursor-line', color: '#60A5FA' },
  impression: { icon: 'ri-eye-line', color: '#A29BFE' },
  lead: { icon: 'ri-user-add-line', color: '#FBBF24' },
  alert: { icon: 'ri-error-warning-line', color: '#FF6B6B' },
  system: { icon: 'ri-settings-3-line', color: '#8B7FF0' },
};

export default function EventStream({ events }: EventStreamProps) {
  return (
    <div
      className="h-full border-t border-primary-500/10 px-5 py-3 overflow-hidden"
      style={{ background: 'linear-gradient(90deg, rgba(12,10,26,0.95) 0%, rgba(26,16,60,0.85) 100%)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-white text-sm font-semibold">实时事件流</h3>
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
          <span className="text-success text-xs">Live</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span className="text-foreground-500">转化</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning"></span>
            <span className="text-foreground-500">线索</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-error"></span>
            <span className="text-foreground-500">告警</span>
          </div>
          <button className="text-foreground-500 hover:text-white transition-colors whitespace-nowrap">
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-filter-3-line text-xs"></i>
            </span>
          </button>
        </div>
      </div>

      {/* Horizontal scroll event cards */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {events.map(event => {
          const config = typeConfig[event.type];
          return (
            <div
              key={event.id}
              className="shrink-0 glass-card p-3 w-[260px] hover:border-primary-500/30 transition-all cursor-pointer group relative"
            >
              {event.isNew && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-400 animate-pulse"></span>
              )}
              <div className="flex items-start gap-2.5">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${config.color}15` }}
                >
                  <i className={`${config.icon} text-sm`} style={{ color: config.color }}></i>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="text-xs font-medium px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${config.color}15`, color: config.color }}
                    >
                      {event.type === 'conversion' ? '转化' :
                       event.type === 'click' ? '点击' :
                       event.type === 'impression' ? '曝光' :
                       event.type === 'lead' ? '线索' :
                       event.type === 'alert' ? '告警' : '系统'}
                    </span>
                  </div>
                  <p className="text-foreground-300 text-xs leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                    {event.title}
                  </p>
                  {event.value && (
                    <span className="text-primary-400 text-xs font-mono mt-1 block">{event.value}</span>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-foreground-500 text-xs">{event.source}</span>
                    <span className="text-foreground-500 text-xs">{event.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}