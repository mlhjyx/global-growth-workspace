import { useState } from 'react';
import type { ContentAIInsight } from '@/mocks/contentData';

interface Props {
  insights: ContentAIInsight[];
}

const typeConfig: Record<string, { icon: string; color: string; label: string }> = {
  suggestion: { icon: 'ri-lightbulb-flash-line', color: 'text-primary-400', label: '建议' },
  warning: { icon: 'ri-alert-line', color: 'text-warning', label: '预警' },
  evidence: { icon: 'ri-bar-chart-box-line', color: 'text-info', label: '证据' },
  risk: { icon: 'ri-error-warning-line', color: 'text-error', label: '风险' },
};

export default function ContentAI({ insights }: Props) {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-primary-500/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center text-primary-400">
            <i className="ri-robot-line"></i>
          </span>
          <h3 className="text-white text-sm font-semibold">内容智能助手</h3>
        </div>
        <p className="text-foreground-600 text-[10px] mt-1">实时内容优化、本地化和合规建议</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="p-3 rounded-lg border border-primary-500/10 bg-white/3">
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className={`w-4 h-4 flex items-center justify-center ${typeConfig[insight.type].color}`}
              >
                <i className={`${typeConfig[insight.type].icon} text-xs`}></i>
              </span>
              <span className={`text-[10px] font-medium ${typeConfig[insight.type].color}`}>
                {typeConfig[insight.type].label}
              </span>
              <span className="text-foreground-600 text-[10px] ml-auto">
                置信度 {insight.confidence}%
              </span>
            </div>
            <h4 className="text-white text-xs font-medium mb-1">{insight.title}</h4>
            <p className="text-foreground-400 text-[11px] leading-relaxed mb-2">
              {insight.content}
            </p>
            {insight.actionable && insight.actionText && (
              <button className="text-[11px] px-2.5 py-1 rounded-md bg-primary-500/15 text-primary-300 hover:bg-primary-500/25 transition-colors cursor-pointer whitespace-nowrap">
                {insight.actionText}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-primary-500/10 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="向 AI 提问内容优化..."
            className="w-full bg-white/5 border border-primary-500/10 rounded-lg py-1.5 pl-3 pr-8 text-white text-xs placeholder:text-foreground-600 focus:outline-none focus:border-primary-500/30"
          />
          <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-primary-400 hover:text-primary-300 cursor-pointer">
            <i className="ri-send-plane-line text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
