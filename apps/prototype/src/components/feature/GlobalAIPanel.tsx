import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  time: string;
}

const quickActions = [
  { icon: 'ri-file-chart-line', label: '生成本周周报', prompt: '帮我生成本周的营销数据周报，包括战役表现、线索增长和内容数据。' },
  { icon: 'ri-lightbulb-line', label: '分析异常告警', prompt: '分析当前系统中的异常告警，给我优先级排序和行动建议。' },
  { icon: 'ri-user-search-line', label: '推荐潜客名单', prompt: '基于我的 ICP 画像，推荐本周最值得跟进的前 5 个潜客。' },
  { icon: 'ri-edit-line', label: '起草 LinkedIn 帖子', prompt: '帮我起草一篇关于出海企业 AI 增长趋势的 LinkedIn 帖子。' },
];

const mockGreeting: ChatMessage = {
  id: 'greeting',
  role: 'ai',
  content: '你好！我是 GrowthOS 的 AI 增长助手。我可以帮你分析数据、生成内容、推荐行动策略。试试下面的快捷操作，或者直接告诉我你需要什么～',
  time: '刚刚',
};

export default function GlobalAIPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([mockGreeting]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const simulateAIResponse = (userMessage: string) => {
    setIsThinking(true);
    const delay = 800 + Math.random() * 1200;

    setTimeout(() => {
      const responses = [
        `基于你当前的业务数据，我建议优先关注以下事项：

**1. 待审核内容** — 有 3 条内容等待审批，建议今天内完成，避免影响发布排期。

**2. 高意向机会** — TechNova Solutions 刚完成 B 轮 $45M 融资，正在扩招销售团队，匹配度 92%，建议本周内触达。

**3. LinkedIn 授权** — 授权将在 3 天后过期，建议尽快续期以保持自动发布功能。`,
        `我分析了当前数据，几个关键发现：

- **本周新增 47 条线索**，环比增长 18%，主要来自 LinkedIn 和内容营销
- **12 个活跃战役**中，Q3 北美 B2B 增长战役的 ROI 表现最佳
- **8 条内容待发布**，其中 3 条为高优先级

建议：优先处理高优先级内容发布，同时跟进 TechNova 和 GreenBuild 两个高意向机会。`,
        `好的，我来帮你分析一下。当前系统中有 3 条异常需要关注：

🔴 **严重** — 3 条 Twitter 内容发布失败（API 限流），已自动加入重试队列
🟡 **警告** — LinkedIn 授权即将过期（3 天后）
🔵 **提示** — 公司资料完整度 65%，缺少 GDPR 合规文件

建议处理顺序：Twitter 发布重试 → LinkedIn 续期 → 补充合规文件。`,
        `基于你的 ICP 画像和当前市场信号，本周推荐以下潜客：

1. **TechNova Solutions** ⭐92 — B轮$45M融资，扩招销售团队
2. **GreenBuild GmbH** ⭐87 — 从竞品迁移，有API集成需求
3. **DataVista Analytics** ⭐84 — 新CTO是大数据背景
4. **PacificTrade Corp** ⭐78 — 采购经理频繁互动行业内容

需要我帮你生成针对性的触达话术吗？`,
      ];

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)],
        time: '刚刚',
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, delay);
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      time: '刚刚',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    simulateAIResponse(trimmed);
  };

  const handleQuickAction = (prompt: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      time: '刚刚',
    };

    setMessages((prev) => [...prev, userMsg]);
    simulateAIResponse(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] flex flex-col animate-slide-in-right"
        style={{
          background: 'linear-gradient(180deg, rgba(14,10,32,0.98) 0%, rgba(22,16,52,0.98) 100%)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(108,92,231,0.12)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-primary-500/8 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <i className="ri-robot-2-fill text-white text-sm"></i>
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold">AI 增长助手</h3>
              <p className="text-foreground-600 text-[10px]">Powered by GrowthOS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-close-line text-sm"></i>
            </span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <i className="ri-robot-2-fill text-white text-[8px]"></i>
                    </div>
                    <span className="text-foreground-600 text-[10px]">AI 助手</span>
                  </div>
                )}
                <div
                  className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-500/15 text-white border border-primary-500/20 rounded-br-md'
                      : 'bg-white/[0.03] text-foreground-200 border border-primary-500/8 rounded-bl-md'
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {msg.content.split('\n').map((line, i) => {
                    // Bold markdown
                    const boldParts = line.split(/(\*\*[^*]+\*\*)/g);
                    return (
                      <p key={i} className={i > 0 ? 'mt-1' : ''}>
                        {boldParts.map((part, j) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>
                <p className="text-foreground-700 text-[10px] mt-1 ml-1">{msg.time}</p>
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex justify-start">
              <div className="max-w-[88%]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <i className="ri-robot-2-fill text-white text-[8px]"></i>
                  </div>
                  <span className="text-foreground-600 text-[10px]">AI 思考中...</span>
                </div>
                <div className="rounded-xl px-3.5 py-3 bg-white/[0.03] border border-primary-500/8 rounded-bl-md">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" style={{ animationDelay: '200ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" style={{ animationDelay: '400ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions */}
        {messages.length <= 1 && (
          <div className="px-4 pt-2 pb-3 shrink-0 border-t border-primary-500/8">
            <p className="text-foreground-500 text-[10px] font-medium mb-2.5 uppercase tracking-wider">快捷操作</p>
            <div className="grid grid-cols-2 gap-1.5">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.06] border border-primary-500/12 hover:border-primary-400/30 hover:bg-white/[0.10] transition-all duration-200 cursor-pointer text-left group"
                >
                  <span className="w-5 h-5 flex items-center justify-center text-primary-400 group-hover:text-primary-300 shrink-0">
                    <i className={`${action.icon} text-xs`}></i>
                  </span>
                  <span className="text-foreground-200 text-xs leading-tight group-hover:text-white">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-primary-500/8 shrink-0">
          <div className="relative flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="输入你的问题..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 pl-3.5 pr-3 py-2.5 text-sm bg-white/[0.04] border border-primary-500/12 focus:border-primary-400/40 text-white placeholder:text-foreground-600 rounded-xl outline-none transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary-500 text-white hover:bg-primary-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-send-plane-2-fill text-sm"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}