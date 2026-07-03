import type { Opportunity } from '@/mocks/todayData';

interface OpportunityCardProps {
  opportunities: Opportunity[];
}

export default function OpportunityCard({ opportunities }: OpportunityCardProps) {
  return (
    <div className="glass-card p-4 md:p-5 flex flex-col gap-3 md:gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center text-success">
            <i className="ri-sparkling-line text-lg"></i>
          </span>
          <h3 className="text-white font-semibold text-sm">机会提醒</h3>
          <span className="badge-ai text-[11px]">AI 发现</span>
        </div>
        <button className="text-xs text-link-color hover:text-primary-300 transition-colors cursor-pointer whitespace-nowrap">
          查看全部
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {opportunities.map((opp) => (
          <button
            key={opp.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-primary-500/10 transition-all duration-200 cursor-pointer text-left w-full"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              opp.score >= 90 ? 'bg-success/10 border border-success/30' :
              opp.score >= 80 ? 'bg-primary-500/10 border border-primary-500/30' :
              'bg-white/5 border border-white/10'
            }`}>
              <span className={`text-sm font-semibold ${
                opp.score >= 90 ? 'text-success' :
                opp.score >= 80 ? 'text-primary-400' :
                'text-foreground-400'
              }`}>{opp.score}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-medium truncate">{opp.company}</p>
                <span className="badge-info text-[10px]">{opp.signal}</span>
              </div>
              <p className="text-foreground-400 text-xs mt-0.5 line-clamp-1">{opp.signalDetail}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-foreground-600 text-[11px]">{opp.country}</span>
                <span className="text-foreground-700 text-[11px]">·</span>
                <span className="text-foreground-600 text-[11px]">{opp.industry}</span>
                <span className="text-foreground-700 text-[11px]">·</span>
                <span className="text-foreground-600 text-[11px]">{opp.time}</span>
              </div>
            </div>
            <span className="w-5 h-5 flex items-center justify-center text-foreground-500 shrink-0">
              <i className="ri-arrow-right-s-line text-sm"></i>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}