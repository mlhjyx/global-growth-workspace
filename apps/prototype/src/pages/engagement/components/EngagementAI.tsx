import { useState } from 'react';
import type { EngagementAIInsight } from '@/mocks/engagementData';

interface Props {
  insights: EngagementAIInsight[];
  messageId: string;
}

const typeConfig: Record<string, { icon: string; color: string; label: string }> = {
  summary: { icon: 'ri-file-text-line', color: 'text-info', label: '摘要' },
  follow_up: { icon: 'ri-chat-smile-2-line', color: 'text-primary-400', label: '话术' },
  risk: { icon: 'ri-error-warning-line', color: 'text-warning', label: '风险' },
  opportunity: { icon: 'ri-rocket-line', color: 'text-success', label: '机会' },
};

export default function EngagementAI({ insights, messageId }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [copiedId, setCopiedId] = useState('');

  const relevantInsights = insights.filter((i) => i.messageId === messageId);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-primary-500/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center text-primary-400">
            <i className="ri-robot-line"></i>
          </span>
          <h3 className="text-white text-sm font-semibold">AI 跟进助手</h3>
        </div>
        <p className="text-foreground-600 text-[10px] mt-1">智能摘要、话术建议与转化分析</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {relevantInsights.length === 0 ? (
          <div className="text-center py-8">
            <span className="w-12 h-12 flex items-center justify-center text-foreground-600 mx-auto mb-2">
              <i className="ri-robot-line text-2xl"></i>
            </span>
            <p className="text-foreground-500 text-xs">选择一条消息</p>
            <p className="text-foreground-600 text-[10px] mt-1">查看 AI 生成的跟进建议</p>
          </div>
        ) : (
          relevantInsights.map((insight) => (
            <div
              key={insight.id}
              className="p-3 rounded-lg border border-primary-500/10 bg-white/3"
            >
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
              <p className="text-foreground-400 text-[11px] leading-relaxed">{insight.content}</p>

              {insight.suggestedReply && (
                <div className="mt-2 p-2.5 rounded-lg bg-primary-500/5 border border-primary-500/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-primary-400 text-[10px] font-medium">推荐回复</span>
                    <button
                      onClick={() => handleCopy(insight.suggestedReply!, insight.id)}
                      className="text-[10px] px-2 py-0.5 rounded bg-primary-500/15 text-primary-300 hover:bg-primary-500/25 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {copiedId === insight.id ? '已复制' : '复制'}
                    </button>
                  </div>
                  <p className="text-foreground-200 text-[11px] leading-relaxed">
                    {insight.suggestedReply}
                  </p>
                </div>
              )}

              {insight.actionable && insight.actionText && !insight.suggestedReply && (
                <button className="mt-2 text-[11px] px-2.5 py-1 rounded-md bg-primary-500/15 text-primary-300 hover:bg-primary-500/25 transition-colors cursor-pointer whitespace-nowrap">
                  {insight.actionText}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-primary-500/10 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="向 AI 提问跟进策略..."
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
