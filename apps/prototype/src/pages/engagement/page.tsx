import { useState, useMemo } from 'react';
import InboxList from './components/InboxList';
import MessageDetail from './components/MessageDetail';
import EngagementAI from './components/EngagementAI';
import ContextPanel from './components/ContextPanel';
import EngagementActivityStream from './components/EngagementActivity';
import {
  mockEngagementMessages,
  mockConversations,
  mockEngagementAIInsights,
  mockEngagementActivities,
  HIGH_INTENT_CATEGORIES,
} from '@/mocks/engagementData';

export default function EngagementPage() {
  const [selectedMessageId, setSelectedMessageId] = useState(mockEngagementMessages[0].id);
  // EPIC-M0-05 T1：右栏在 Context 面板与 AI 助手间切换（PG-010）
  const [rightTab, setRightTab] = useState<'context' | 'ai'>('context');

  const selectedMessage = mockEngagementMessages.find((m) => m.id === selectedMessageId) || null;
  const conversation = useMemo(
    () => mockConversations[selectedMessageId] || [],
    [selectedMessageId],
  );

  const unreadCount = mockEngagementMessages.filter((m) => !m.isRead).length;
  const highIntentCount = mockEngagementMessages.filter(
    (m) => HIGH_INTENT_CATEGORIES.includes(m.intent.category) && m.status !== 'converted',
  ).length;
  const convertedCount = mockEngagementMessages.filter((m) => m.status === 'converted').length;

  return (
    <div className="flex flex-col md:h-[calc(100vh-3.5rem)]">
      {/* Top bar */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between px-3 md:px-5 py-2.5 md:py-3 border-b border-primary-500/10 shrink-0 gap-1.5 md:gap-0"
        style={{
          background: 'linear-gradient(90deg, rgba(12,10,26,0.8) 0%, rgba(26,16,60,0.6) 100%)',
        }}
      >
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-white text-base md:text-lg font-semibold">互动管理</h1>
            <p className="text-foreground-500 text-xs mt-0.5">
              统一跨平台 Inbox · 意图分类（ENG-004）· 三级结果链转化
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 md:gap-4 text-[11px] md:text-xs">
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <i className="ri-message-3-line text-xs"></i>
            </span>
            <span>
              总消息: <span className="text-foreground-300">{mockEngagementMessages.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center text-primary-400">
              <i className="ri-circle-fill text-[6px]"></i>
            </span>
            <span>
              未读: <span className="text-primary-300">{unreadCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center text-error">
              <i className="ri-fire-line text-xs"></i>
            </span>
            <span>
              高意向: <span className="text-error">{highIntentCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center text-success">
              <i className="ri-user-follow-line text-xs"></i>
            </span>
            <span>
              机会（SAO 候选）: <span className="text-success">{convertedCount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden overflow-y-auto">
        {/* Left: Inbox list */}
        <div
          className="w-full md:w-[310px] flex flex-col border-r border-b md:border-b-0 border-primary-500/10 shrink-0"
          style={{
            background: 'linear-gradient(180deg, rgba(12,10,26,0.9) 0%, rgba(26,16,60,0.7) 100%)',
          }}
        >
          <InboxList
            messages={mockEngagementMessages}
            selectedId={selectedMessageId}
            onSelect={setSelectedMessageId}
          />
        </div>

        {/* Center: Message detail */}
        <div
          className="flex-1 min-w-0 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(12,10,26,0.7) 0%, rgba(26,16,60,0.4) 100%)',
          }}
        >
          <MessageDetail message={selectedMessage} conversation={conversation} />
        </div>

        {/* Right: Context 面板 / AI 助手（PG-010） */}
        <div
          className="w-full md:w-[300px] flex flex-col border-l border-t md:border-t-0 border-primary-500/10 shrink-0"
          style={{
            background: 'linear-gradient(180deg, rgba(12,10,26,0.9) 0%, rgba(26,16,60,0.7) 100%)',
          }}
        >
          <div className="flex border-b border-primary-500/10 shrink-0">
            {(
              [
                { k: 'context', label: '上下文', icon: 'ri-links-line' },
                { k: 'ai', label: 'AI 助手', icon: 'ri-robot-2-line' },
              ] as const
            ).map((t) => (
              <button
                key={t.k}
                onClick={() => setRightTab(t.k)}
                className={`flex-1 py-2 text-[11px] cursor-pointer flex items-center justify-center gap-1 ${
                  rightTab === t.k
                    ? 'text-primary-300 border-b-2 border-primary-400'
                    : 'text-foreground-500 hover:text-foreground-300'
                }`}
              >
                <i className={t.icon}></i>
                {t.label}
              </button>
            ))}
          </div>
          {rightTab === 'context' ? (
            <ContextPanel messageId={selectedMessageId} />
          ) : (
            <EngagementAI insights={mockEngagementAIInsights} messageId={selectedMessageId} />
          )}
        </div>
      </div>

      {/* Bottom: Activity stream */}
      <div
        className="h-auto md:h-[160px] min-h-[120px] border-t border-primary-500/10 shrink-0"
        style={{
          background: 'linear-gradient(90deg, rgba(12,10,26,0.95) 0%, rgba(26,16,60,0.85) 100%)',
        }}
      >
        <EngagementActivityStream activities={mockEngagementActivities} />
      </div>
    </div>
  );
}
