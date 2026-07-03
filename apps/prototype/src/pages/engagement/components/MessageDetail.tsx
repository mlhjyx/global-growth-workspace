import { useState } from 'react';
import type { EngagementMessage, ConversationReply } from '@/mocks/engagementData';
import { HIGH_INTENT_CATEGORIES, INTENT_CATEGORY_LABELS } from '@/mocks/engagementData';

interface Props {
  message: EngagementMessage | null;
  conversation: ConversationReply[];
}

const platformConfig: Record<string, { icon: string; label: string; bg: string }> = {
  linkedin: {
    icon: 'ri-linkedin-fill',
    label: 'LinkedIn',
    bg: 'bg-info/10 text-info border-info/20',
  },
  twitter: {
    icon: 'ri-twitter-fill',
    label: 'Twitter/X',
    bg: 'bg-foreground-500/10 text-foreground-300 border-foreground-500/20',
  },
  email: {
    icon: 'ri-mail-fill',
    label: '邮件',
    bg: 'bg-warning/10 text-warning border-warning/20',
  },
  facebook: {
    icon: 'ri-facebook-fill',
    label: 'Facebook',
    bg: 'bg-info/10 text-info border-info/20',
  },
};

export default function MessageDetail({ message, conversation }: Props) {
  const [replyText, setReplyText] = useState('');
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertCRM, setConvertCRM] = useState('none');
  const [convertOwner, setConvertOwner] = useState('David Müller');
  const [convertSLA, setConvertSLA] = useState('4h');

  if (!message) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <span className="w-16 h-16 flex items-center justify-center text-foreground-600 mx-auto mb-3">
            <i className="ri-message-3-line text-3xl"></i>
          </span>
          <p className="text-foreground-500 text-sm">选择一条消息查看详情</p>
          <p className="text-foreground-600 text-xs mt-1">左侧 Inbox 中有 {10} 条待处理互动</p>
        </div>
      </div>
    );
  }

  const platform = platformConfig[message.platform];

  return (
    <div className="flex flex-col h-full">
      {/* Message header */}
      <div className="px-5 py-3 border-b border-primary-500/10 shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-500/15 flex items-center justify-center shrink-0">
              <span className="text-foreground-300 text-sm font-semibold">
                {message.sender.avatar}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-white text-sm font-semibold">{message.sender.name}</h3>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${platform?.bg}`}>
                  <i className={`${platform?.icon} text-[9px] mr-0.5`}></i>
                  {platform?.label}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    HIGH_INTENT_CATEGORIES.includes(message.intent.category)
                      ? 'bg-error/15 text-error'
                      : message.intent.category === 'COMPLAINT' ||
                          message.intent.category === 'UNSUBSCRIBE'
                        ? 'bg-warning/15 text-warning'
                        : 'bg-white/5 text-foreground-400'
                  }`}
                >
                  意图: {INTENT_CATEGORY_LABELS[message.intent.category]} · 置信度{' '}
                  {message.intent.confidence}%
                </span>
              </div>
              <p className="text-foreground-500 text-xs">
                {message.sender.title} · {message.sender.company}
              </p>
              <p className="text-foreground-600 text-[10px]">
                {message.sender.location} · {message.timestamp}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowConvertModal(true)}
              className="px-3 py-1.5 rounded-lg bg-success/15 text-success text-xs font-medium hover:bg-success/20 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
            >
              <span className="w-3.5 h-3.5 flex items-center justify-center">
                <i className="ri-user-follow-line text-[11px]"></i>
              </span>
              确认为 Qualified Lead
            </button>
          </div>
        </div>

        {/* Intent signals */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          <span className="text-foreground-600 text-[10px] shrink-0">意向信号:</span>
          {message.intentSignals.map((signal, i) => (
            <span
              key={i}
              className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-300"
            >
              {signal}
            </span>
          ))}
        </div>
      </div>

      {/* Conversation thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <div className="mb-2">
          <h4 className="text-white text-xs font-semibold">{message.subject}</h4>
        </div>

        {conversation.length > 0 ? (
          conversation.map((reply, idx) => (
            <div
              key={reply.id}
              className={`flex ${reply.from === 'user' || reply.from === 'ai_suggested' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] ${reply.from === 'user' || reply.from === 'ai_suggested' ? 'order-1' : ''}`}
              >
                <div
                  className={`p-3 rounded-xl ${
                    reply.from === 'user'
                      ? 'bg-primary-500/15 border border-primary-500/20 rounded-br-sm'
                      : reply.from === 'ai_suggested'
                        ? 'bg-ai-accent/10 border border-ai-accent/20 rounded-br-sm'
                        : 'bg-white/5 border border-primary-500/10 rounded-bl-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-[11px] font-semibold">
                      {reply.senderName || '你'}
                    </span>
                    {reply.from === 'ai_suggested' && (
                      <span className="text-[9px] bg-ai-accent/20 text-ai-accent px-1 py-0 rounded">
                        AI 建议
                      </span>
                    )}
                    <span className="text-foreground-600 text-[9px] ml-auto">
                      {reply.timestamp.split('T')[1]?.slice(0, 5) || ''}
                    </span>
                  </div>
                  <p className="text-foreground-200 text-xs leading-relaxed whitespace-pre-wrap">
                    {reply.body}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 rounded-xl bg-white/5 border border-primary-500/10 rounded-bl-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white text-[11px] font-semibold">{message.sender.name}</span>
              <span className="text-foreground-600 text-[9px] ml-auto">
                {message.timestamp.split('T')[1]?.slice(0, 5) || ''}
              </span>
            </div>
            <p className="text-foreground-200 text-xs leading-relaxed whitespace-pre-wrap">
              {message.body}
            </p>
          </div>
        )}
      </div>

      {/* Reply input */}
      <div className="px-5 py-3 border-t border-primary-500/10 shrink-0">
        <div className="flex items-start gap-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`回复 ${message.sender.name}...`}
            rows={2}
            className="flex-1 bg-white/5 border border-primary-500/10 rounded-lg py-2 px-3 text-white text-xs placeholder:text-foreground-600 focus:outline-none focus:border-primary-500/30 resize-none"
          />
          <button className="px-3 py-2 rounded-lg bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 transition-colors cursor-pointer shrink-0">
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-send-plane-line text-sm"></i>
            </span>
          </button>
        </div>
      </div>

      {/* Convert to Lead Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowConvertModal(false)}
          ></div>
          <div
            className="relative w-full max-w-md mx-4 rounded-xl border border-primary-500/20 p-6"
            style={{
              background:
                'linear-gradient(135deg, rgba(26,16,60,0.98) 0%, rgba(12,10,26,0.98) 100%)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-base font-semibold">
                确认为 Qualified Lead · 创建机会（SAO 候选）
              </h3>
              <button
                onClick={() => setShowConvertModal(false)}
                className="w-6 h-6 flex items-center justify-center text-foreground-500 hover:text-white cursor-pointer"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-foreground-400 text-xs mb-1.5 block">
                  同步到外部 CRM（可选 · 同步目标，非主库）
                </label>
                <div className="flex gap-2">
                  {['none', 'salesforce', 'hubspot'].map((crm) => (
                    <button
                      key={crm}
                      onClick={() => setConvertCRM(crm)}
                      className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors whitespace-nowrap ${
                        convertCRM === crm
                          ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                          : 'bg-white/5 text-foreground-500 border border-transparent hover:bg-white/10'
                      }`}
                    >
                      {crm === 'none'
                        ? '暂不同步'
                        : crm === 'salesforce'
                          ? 'Salesforce'
                          : 'HubSpot'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-foreground-400 text-xs mb-1.5 block">分配负责人</label>
                <div className="flex gap-2 flex-wrap">
                  {['Leo Chen', 'Sarah Weber', 'David Müller'].map((owner) => (
                    <button
                      key={owner}
                      onClick={() => setConvertOwner(owner)}
                      className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors whitespace-nowrap ${
                        convertOwner === owner
                          ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                          : 'bg-white/5 text-foreground-500 border border-transparent hover:bg-white/10'
                      }`}
                    >
                      {owner}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-foreground-400 text-xs mb-1.5 block">SLA 响应时间</label>
                <div className="flex gap-2">
                  {['1h', '4h', '24h'].map((sla) => (
                    <button
                      key={sla}
                      onClick={() => setConvertSLA(sla)}
                      className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors whitespace-nowrap ${
                        convertSLA === sla
                          ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                          : 'bg-white/5 text-foreground-500 border border-transparent hover:bg-white/10'
                      }`}
                    >
                      {sla}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-success/5 border border-success/10">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 flex items-center justify-center text-success shrink-0 mt-px">
                    <i className="ri-information-line text-xs"></i>
                  </span>
                  <div>
                    <p className="text-foreground-300 text-xs font-medium">
                      机会创建在平台内并保留会话来源（ENG-007）
                    </p>
                    <p className="text-foreground-500 text-[11px] mt-0.5">
                      三级结果链: Qualified Lead → SAO → Verified Outcome；外部 CRM
                      仅为可选同步目标（ENG-011），导出/同步动作需经策略检查
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setShowConvertModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-foreground-400 text-xs hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                取消
              </button>
              <button
                onClick={() => setShowConvertModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-primary-500/20 text-primary-300 text-xs font-medium hover:bg-primary-500/25 transition-colors cursor-pointer whitespace-nowrap"
              >
                确认为 Qualified Lead
              </button>
              <button
                onClick={() => setShowConvertModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-success/20 text-success text-xs font-medium hover:bg-success/25 transition-colors cursor-pointer whitespace-nowrap"
              >
                创建机会（SAO 候选）
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
