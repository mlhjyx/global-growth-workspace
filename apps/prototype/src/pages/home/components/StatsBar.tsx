import type { StatItem } from '@/mocks/todayData';

interface StatsBarProps {
  stats: StatItem[];
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="glass-card p-4 flex items-start justify-between animate-fade-in"
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <div className="flex flex-col gap-1">
            <span className="text-foreground-500 text-xs">{stat.label}</span>
            <span className="text-white text-2xl font-semibold tracking-tight">{stat.value}</span>
            <span
              className={`text-xs flex items-center gap-1 ${
                stat.trend === 'up'
                  ? 'text-success'
                  : stat.trend === 'down'
                    ? 'text-error'
                    : 'text-foreground-500'
              }`}
            >
              <span className="w-3 h-3 flex items-center justify-center">
                <i
                  className={`${stat.trend === 'up' ? 'ri-arrow-up-line' : stat.trend === 'down' ? 'ri-arrow-down-line' : 'ri-subtract-line'} text-xs`}
                ></i>
              </span>
              {stat.change}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
            <span className="w-4 h-4 flex items-center justify-center text-primary-400">
              <i className={`${stat.icon} text-base`}></i>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
