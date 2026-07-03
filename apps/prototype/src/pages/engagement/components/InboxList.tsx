import { useState, useMemo } from 'react';
import type { EngagementMessage } from '@/mocks/engagementData';
import { HIGH_INTENT_CATEGORIES, INTENT_CATEGORY_LABELS } from '@/mocks/engagementData';

interface Props {
  messages: EngagementMessage[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const platformConfig: Record<string, { icon: string; label: string; color: string }> = {
  linkedin: { icon: 'ri-linkedin-fill', label: 'LinkedIn', color: 'text-info' },
  twitter: { icon: 'ri-twitter-fill', label: 'Twitter/X', color: 'text-foreground-300' },
  email: { icon: 'ri-mail-fill', label: '邮件', color: 'text-warning' },
  facebook: { icon: 'ri-facebook-fill', label: 'Facebook', color: 'text-info' },
};

const typeLabels: Record<string, string> = {
  comment: '评论',
  private_message: '私信',
  mention: '提及',
  review: '评价',
};

const priorityColor: Record<string, string> = {
  high: 'border-l-error',
  medium: 'border-l-warning',
  low: 'border-l-transparent',
};

export default function InboxList({ messages, selectedId, onSelect }: Props) {
  const [platformFilter, setPlatformFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchPlatform = platformFilter === 'all' || m.platform === platformFilter;
      const matchType = typeFilter === 'all' || m.type === typeFilter;
      const matchSearch =
        !search ||
        m.sender.name.toLowerCase().includes(search.toLowerCase()) ||
        m.sender.company.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase());
      return matchPlatform && matchType && matchSearch;
    });
  }, [messages, platformFilter, typeFilter, search]);

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const highIntentCount = messages.filter(
    (m) => HIGH_INTENT_CATEGORIES.includes(m.intent.category) && m.status !== 'converted',
  ).length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2 shrink-0">
        <h3 className="text-white text-sm font-semibold mb-1 flex items-center gap-2">
          <span className="w-4 h-4 flex items-center justify-center text-primary-400">
            <i className="ri-message-3-line"></i>
          </span>
          统一 Inbox
        </h3>
        <div className="flex items-center gap-2 mb-3">
          {unreadCount > 0 && (
            <span className="text-[10px] bg-primary-500/20 text-primary-300 px-1.5 py-0.5 rounded-full">
              {unreadCount} 未读
            </span>
          )}
          {highIntentCount > 0 && (
            <span className="text-[10px] bg-error/15 text-error px-1.5 py-0.5 rounded-full">
              {highIntentCount} 高意向
            </span>
          )}
          <span className="text-foreground-600 text-[10px] ml-auto">{messages.length} 条</span>
        </div>

        <div className="relative mb-2">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 flex items-center justify-center text-foreground-600">
            <i className="ri-search-line text-xs"></i>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索发件人或公司..."
            className="w-full bg-white/5 border border-primary-500/10 rounded-lg py-1.5 pl-7.5 pr-3 text-white text-xs placeholder:text-foreground-600 focus:outline-none focus:border-primary-500/30"
          />
        </div>

        <div className="flex gap-1 flex-wrap mb-1.5">
          {['all', 'linkedin', 'twitter', 'email'].map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                platformFilter === p
                  ? 'bg-primary-500/20 text-primary-300'
                  : 'bg-white/5 text-foreground-500 hover:bg-white/10'
              }`}
            >
              {p === 'all' ? '全部平台' : platformConfig[p]?.label || p}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {['all', 'private_message', 'comment', 'mention'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                typeFilter === t
                  ? 'bg-primary-500/20 text-primary-300'
                  : 'bg-white/5 text-foreground-500 hover:bg-white/10'
              }`}
            >
              {t === 'all' ? '全部类型' : typeLabels[t] || t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-foreground-600 text-xs">无匹配消息</div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((msg) => (
              <button
                key={msg.id}
                onClick={() => onSelect(msg.id)}
                className={`w-full text-left p-2.5 rounded-lg transition-all cursor-pointer border-l-2 ${
                  msg.id === selectedId
                    ? 'bg-primary-500/10 border-primary-400'
                    : `bg-white/3 hover:bg-white/5 ${priorityColor[msg.priority]}`
                } ${!msg.isRead ? 'ring-1 ring-primary-500/15' : ''}`}
              >
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-500/15 flex items-center justify-center shrink-0 relative">
                    <span className="text-foreground-300 text-[10px] font-semibold">
                      {msg.sender.avatar}
                    </span>
                    {!msg.isRead && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary-400 rounded-full"></span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white text-xs font-medium truncate">
                        {msg.sender.name}
                      </span>
                      <span
                        className={`text-[10px] px-1 py-0 rounded-full shrink-0 ${
                          HIGH_INTENT_CATEGORIES.includes(msg.intent.category)
                            ? 'bg-error/15 text-error'
                            : msg.intent.category === 'COMPLAINT' ||
                                msg.intent.category === 'UNSUBSCRIBE'
                              ? 'bg-warning/15 text-warning'
                              : 'bg-white/5 text-foreground-500'
                        }`}
                      >
                        {INTENT_CATEGORY_LABELS[msg.intent.category]} {msg.intent.confidence}%
                      </span>
                    </div>
                    <p className="text-foreground-500 text-[10px] truncate">
                      {msg.sender.company} · {msg.sender.title}
                    </p>
                    <p className="text-foreground-400 text-[11px] truncate mt-0.5">{msg.preview}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span
                        className={`text-[9px] px-1 py-0 rounded flex items-center gap-0.5 ${platformConfig[msg.platform]?.color} bg-white/5`}
                      >
                        <i className={`${platformConfig[msg.platform]?.icon} text-[8px]`}></i>
                        {typeLabels[msg.type]}
                      </span>
                      <span className="text-foreground-600 text-[9px]">
                        {msg.timestamp.split('T')[1]?.slice(0, 5) || ''}
                      </span>
                      {msg.status === 'converted' && (
                        <span className="text-[9px] text-success bg-success/10 px-1 py-0 rounded">
                          已创建机会（SAO 候选）
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
