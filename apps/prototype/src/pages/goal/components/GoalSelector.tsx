import type { GoalOption } from '@/mocks/goalData';

interface GoalSelectorProps {
  options: GoalOption[];
  onSelect: (goal: GoalOption) => void;
}

export default function GoalSelector({ options, onSelect }: GoalSelectorProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-300 text-xs font-mono tracking-wide mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          STEP 1 / 3
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          我要完成什么？
        </h2>
        <p className="text-foreground-400 text-sm md:text-base max-w-lg">
          选择一个核心目标，GrowthOS 将为你构建专属的增长作战计划
        </p>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {options.map((goal, idx) => (
          <button
            key={goal.id}
            onClick={() => onSelect(goal)}
            className="group relative text-left glass-card p-5 md:p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
          >
            {/* Hover glow */}
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${goal.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

            <div className="relative z-10 flex items-start gap-4">
              {/* Icon */}
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${goal.color} border border-white/10 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${goal.icon} text-xl text-white`}></i>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base mb-1 group-hover:text-white transition-colors">
                  {goal.title}
                </h3>
                <p className="text-foreground-500 text-xs font-mono uppercase tracking-wider mb-2">
                  {goal.subtitle}
                </p>
                <p className="text-foreground-400 text-sm leading-relaxed line-clamp-2">
                  {goal.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <span className="w-6 h-6 flex items-center justify-center text-primary-400">
                  <i className="ri-arrow-right-line text-lg"></i>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}