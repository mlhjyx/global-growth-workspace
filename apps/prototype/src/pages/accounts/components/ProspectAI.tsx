import { useState } from 'react';
import type { ProspectAIInsight } from '@/mocks/accountData';

interface ProspectAIProps {
  insights: ProspectAIInsight[];
}

const typeConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  suggestion: {
    icon: 'ri-lightbulb-line',
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
    label: '建议',
  },
  warning: { icon: 'ri-alert-line', color: 'text-warning', bg: 'bg-warning/10', label: '预警' },
  evidence: { icon: 'ri-bar-chart-2-line', color: 'text-info', bg: 'bg-info/10', label: '证据' },
  risk: { icon: 'ri-error-warning-line', color: 'text-error', bg: 'bg-error/10', label: '风险' },
};

export default function ProspectAI({ insights }: ProspectAIProps) {
  const [expandedId, setExpandedId] = useState<string | null>(insights[0]?.id || null);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-primary-500/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-300 flex items-center justify-center">
            <i className="ri-robot-2-fill text-white text-sm"></i>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold">AI 客户洞察</h3>
            <p className="text-foreground-600 text-[11px]">{insights.length} 条智能建议</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {insights.map((insight) => {
          const config = typeConfig[insight.type];
          const isExpanded = expandedId === insight.id;
          return (
            <div
              key={insight.id}
              className={`rounded-lg border transition-all duration-200 overflow-hidden
                ${
                  isExpanded
                    ? 'bg-primary-500/5 border-primary-500/15'
                    : 'bg-white/[0.02] border-transparent hover:border-primary-500/10'
                }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                className="w-full text-left p-2.5 cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`w-6 h-6 rounded-md ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <span
                      className={`w-3.5 h-3.5 flex items-center justify-center ${config.color}`}
                    >
                      <i className={`${config.icon} text-xs`}></i>
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${config.bg} ${config.color}`}
                      >
                        {config.label}
                      </span>
                      <span className="text-foreground-600 text-[10px]">
                        {insight.confidence}% 置信度
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium mt-1 truncate">{insight.title}</p>
                    {insight.relatedTo && (
                      <p className="text-foreground-600 text-[11px] mt-0.5">{insight.relatedTo}</p>
                    )}
                  </div>
                </div>
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 animate-slide-up">
                  <p className="text-foreground-400 text-xs leading-relaxed pl-8">
                    {insight.content}
                  </p>
                  {insight.actionable && insight.actionText && (
                    <button className="ml-8 mt-2 btn-primary text-xs px-3 py-1.5 inline-flex items-center gap-1">
                      <i className="ri-magic-line text-xs"></i>
                      {insight.actionText}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-primary-500/10 shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="询问客户洞察..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full pl-3 pr-9 py-2 text-xs bg-input-bg border-input-border rounded-lg"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors cursor-pointer">
            <i className="ri-send-plane-2-line text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
