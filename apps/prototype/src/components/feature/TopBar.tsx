import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCampaigns } from '@/mocks/campaignData';
import { mockAccounts } from '@/mocks/accountData';
import { mockContentItems } from '@/mocks/contentData';
import { mockOpportunities } from '@/mocks/todayData';

interface TopBarProps {
  onToggleMobileMenu?: () => void;
  mobileMenuOpen?: boolean;
}

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryLabel: string;
  icon: string;
  path: string;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'warning' | 'critical' | 'info' | 'success';
  icon: string;
  read: boolean;
  path?: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'LinkedIn 账号授权即将过期',
    description: '企业主页的 OAuth 授权将在 3 天后过期，届时将无法自动发布内容。',
    time: '09:15',
    type: 'warning',
    icon: 'ri-alert-line',
    read: false,
    path: '/integrations',
  },
  {
    id: 'n2',
    title: '3 条内容发布失败',
    description: 'Twitter API 限流导致部分内容未能按时发布，已自动加入重试队列。',
    time: '08:00',
    type: 'critical',
    icon: 'ri-close-circle-line',
    read: false,
    path: '/publish',
  },
  {
    id: 'n3',
    title: '新审批：东南亚 SaaS 行业白皮书终稿',
    description: 'Mia Wang 提交内容审批，等待您的确认。',
    time: '14:30',
    type: 'info',
    icon: 'ri-file-check-line',
    read: false,
    path: '/team',
  },
  {
    id: 'n4',
    title: '新增高意向机会：TechNova Solutions',
    description: '完成 B 轮 $45M 融资，正在扩招销售团队，匹配度 92%。',
    time: '2天前',
    type: 'success',
    icon: 'ri-flashlight-line',
    read: true,
    path: '/accounts',
  },
  {
    id: 'n5',
    title: '公司资料完整度提示',
    description: '缺少目标市场合规文件，部分 AI 功能受限。建议补充 GDPR 合规声明。',
    time: '昨天',
    type: 'info',
    icon: 'ri-information-line',
    read: true,
    path: '/knowledge',
  },
];

const helpShortcuts = [
  { keys: ['Ctrl', 'K'], desc: '全局搜索', icon: 'ri-search-line' },
  { keys: ['Ctrl', 'N'], desc: '快速创建', icon: 'ri-add-line' },
  { keys: ['Ctrl', 'B'], desc: '切换侧边栏', icon: 'ri-sidebar-fold-line' },
  { keys: ['Ctrl', '/'], desc: '查看快捷键', icon: 'ri-keyboard-line' },
];

const helpTips = [
  {
    icon: 'ri-robot-2-line',
    text: '使用 AI 助手可以自动生成内容、分析数据和回复评论。',
    color: 'text-ai-accent',
  },
  {
    icon: 'ri-search-line',
    text: '全局搜索支持跨模块查找战役、客户、内容和机会信号。',
    color: 'text-primary-400',
  },
  {
    icon: 'ri-flag-2-line',
    text: '在战役看板中拖拽计划项卡片即可快速改变其状态。',
    color: 'text-foreground-400',
  },
  {
    icon: 'ri-rocket-line',
    text: '发布中心支持将已审批内容排期到多个获授权平台（入口在「内容」域）。',
    color: 'text-ai-accent',
  },
];

export default function TopBar({ onToggleMobileMenu, mobileMenuOpen }: TopBarProps) {
  const [searchValue, setSearchValue] = useState('');

  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const navigate = useNavigate();

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false);
      }
    };
    if (notifOpen || helpOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen, helpOpen]);

  useEffect(() => {
    const handleSearchClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    if (searchFocused) {
      document.addEventListener('mousedown', handleSearchClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleSearchClickOutside);
  }, [searchFocused]);

  // Keyboard shortcut: Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>('input[type="search"]');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = useMemo<SearchResultItem[]>(() => {
    if (!searchValue.trim()) return [];
    const q = searchValue.toLowerCase();

    const results: SearchResultItem[] = [];

    mockCampaigns.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.goal.toLowerCase().includes(q)) {
        results.push({
          id: `campaign-${c.id}`,
          title: c.name,
          subtitle: c.goal,
          category: 'campaign',
          categoryLabel: '战役',
          icon: 'ri-flag-2-line',
          path: '/campaigns',
        });
      }
    });

    mockAccounts.forEach((a) => {
      if (
        a.company.toLowerCase().includes(q) ||
        a.industry.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q)
      ) {
        results.push({
          id: `account-${a.id}`,
          title: a.company,
          subtitle: `${a.industry} · ${a.country} · 评分 ${a.score}`,
          category: 'account',
          categoryLabel: '客户',
          icon: 'ri-user-search-line',
          path: '/accounts',
        });
      }
    });

    mockContentItems.forEach((c) => {
      if (c.title.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q))) {
        results.push({
          id: `content-${c.id}`,
          title: c.title,
          subtitle: `${c.type} · ${c.status} · ${c.language}`,
          category: 'content',
          categoryLabel: '内容',
          icon: 'ri-file-text-line',
          path: '/content',
        });
      }
    });

    mockOpportunities.forEach((o) => {
      if (
        o.company.toLowerCase().includes(q) ||
        o.signal.toLowerCase().includes(q) ||
        o.industry.toLowerCase().includes(q)
      ) {
        results.push({
          id: `opportunity-${o.id}`,
          title: `${o.company} · ${o.signal}`,
          subtitle: o.signalDetail,
          category: 'opportunity',
          categoryLabel: '机会信号',
          icon: 'ri-flashlight-line',
          path: '/accounts',
        });
      }
    });

    return results.slice(0, 8);
  }, [searchValue]);

  const handleSearchSelect = useCallback(
    (item: SearchResultItem) => {
      setSearchFocused(false);
      setSearchValue('');
      navigate(item.path);
    },
    [navigate],
  );

  const handleNotifClick = useCallback(
    (item: NotificationItem) => {
      setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
      setNotifOpen(false);
      if (item.path) navigate(item.path);
    },
    [navigate],
  );

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const categoryIconColor: Record<string, string> = {
    campaign: 'text-primary-400',
    account: 'text-success',
    content: 'text-warning',
    opportunity: 'text-data-highlight',
  };

  const notifTypeColor: Record<string, string> = {
    critical: 'text-error bg-error/10 border-error/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    info: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    success: 'text-success bg-success/10 border-success/20',
  };

  return (
    <header
      className="sticky top-0 z-40 h-14 flex items-center justify-between px-3 md:px-5 border-b border-primary-500/10"
      style={{
        background: 'linear-gradient(90deg, rgba(12,10,26,0.95) 0%, rgba(26,16,60,0.95) 100%)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Mobile hamburger */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden w-9 h-9 shrink-0 flex items-center justify-center rounded-lg text-foreground-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-lg`}></i>
            </span>
          </button>
        )}

        <div ref={searchRef} className="relative w-full max-w-md min-w-0">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
            <i className="ri-search-line text-foreground-600 text-sm"></i>
          </span>
          <input
            type="search"
            placeholder="搜索战役、客户、内容... (Ctrl+K)"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (!searchFocused) setSearchFocused(true);
            }}
            onFocus={() => setSearchFocused(true)}
            className="w-full pl-11 pr-3 py-2 text-sm bg-white/6 border border-primary-500/15 focus:border-primary-400/60 text-white placeholder:text-foreground-600 rounded-lg outline-none transition-colors"
          />

          {/* Search results dropdown */}
          {searchFocused && searchValue.trim() && (
            <div
              className="absolute left-0 top-full mt-2 w-full rounded-xl py-2 animate-fade-in z-50"
              style={{
                background:
                  'linear-gradient(135deg, rgba(22,18,48,0.98) 0%, rgba(30,20,56,0.98) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(108,92,231,0.15)',
              }}
            >
              {searchResults.length > 0 ? (
                <>
                  <div className="px-3 pb-1.5 flex items-center justify-between">
                    <p className="text-foreground-500 text-[11px] font-medium tracking-wider uppercase">
                      搜索结果 · {searchResults.length} 项
                    </p>
                  </div>
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearchSelect(item)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-all duration-150 cursor-pointer group"
                    >
                      <span className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center shrink-0 group-hover:bg-white/[0.06] transition-colors">
                        <span
                          className={`w-4 h-4 flex items-center justify-center ${categoryIconColor[item.category] || 'text-foreground-500'}`}
                        >
                          <i className={`${item.icon} text-sm`}></i>
                        </span>
                      </span>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-white text-sm truncate">{item.title}</span>
                        <span className="text-foreground-500 text-xs truncate">
                          {item.subtitle}
                        </span>
                      </div>
                      <span className="text-foreground-600 text-[11px] shrink-0">
                        {item.categoryLabel}
                      </span>
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-3 py-6 text-center">
                  <span className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-2">
                    <i className="ri-search-line text-foreground-600 text-sm"></i>
                  </span>
                  <p className="text-foreground-500 text-sm">未找到匹配结果</p>
                  <p className="text-foreground-600 text-xs mt-0.5">尝试其他关键词</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0 ml-2">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-foreground-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-notification-3-line text-lg"></i>
            </span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-error text-white text-[9px] font-bold px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 rounded-xl py-2 animate-fade-in z-50"
              style={{
                background:
                  'linear-gradient(135deg, rgba(22,18,48,0.98) 0%, rgba(30,20,56,0.98) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(108,92,231,0.15)',
              }}
            >
              <div className="px-3 pb-1.5 flex items-center justify-between">
                <p className="text-foreground-500 text-[11px] font-medium tracking-wider uppercase">
                  通知
                </p>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
                  >
                    全部已读
                  </button>
                )}
              </div>
              <div className="max-h-[360px] overflow-y-auto">
                {notifications.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNotifClick(item)}
                    className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-all duration-150 cursor-pointer group"
                  >
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${notifTypeColor[item.type]}`}
                    >
                      <span className="w-4 h-4 flex items-center justify-center">
                        <i className={`${item.icon} text-sm`}></i>
                      </span>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-white text-xs font-medium ${!item.read ? '' : 'text-foreground-400'}`}
                        >
                          {item.title}
                        </span>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-primary-400 shrink-0"></span>
                        )}
                      </div>
                      <p className="text-foreground-500 text-[11px] mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                      <span className="text-foreground-700 text-[10px] mt-1 block">
                        {item.time}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-3 pt-2 border-t border-primary-500/10 mt-1">
                <button
                  onClick={() => {
                    setNotifOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs text-foreground-500 hover:text-foreground-300 transition-colors cursor-pointer"
                >
                  查看全部通知
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <div ref={helpRef} className="relative">
          <button
            onClick={() => setHelpOpen(!helpOpen)}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-foreground-500 hover:text-foreground-300 hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-question-line text-lg"></i>
            </span>
          </button>

          {helpOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-72 rounded-xl py-2 animate-fade-in z-50"
              style={{
                background:
                  'linear-gradient(135deg, rgba(22,18,48,0.98) 0%, rgba(30,20,56,0.98) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(108,92,231,0.15)',
              }}
            >
              {/* Keyboard shortcuts */}
              <div className="px-3 pb-2">
                <p className="text-foreground-500 text-[11px] font-medium tracking-wider uppercase mb-2">
                  键盘快捷键
                </p>
                <div className="space-y-1">
                  {helpShortcuts.map((sc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-foreground-500">
                          <i className={`${sc.icon} text-xs`}></i>
                        </span>
                        <span className="text-foreground-400 text-xs">{sc.desc}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {sc.keys.map((k, j) => (
                          <span
                            key={j}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-foreground-500 font-mono"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-3 border-t border-primary-500/10"></div>

              {/* Tips */}
              <div className="px-3 pt-2">
                <p className="text-foreground-500 text-[11px] font-medium tracking-wider uppercase mb-2">
                  使用技巧
                </p>
                <div className="space-y-2">
                  {helpTips.map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span
                        className={`w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 ${tip.color}`}
                      >
                        <i className={`${tip.icon} text-xs`}></i>
                      </span>
                      <span className="text-foreground-500 text-xs leading-relaxed">
                        {tip.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-3 my-2 border-t border-primary-500/10"></div>

              {/* Footer links */}
              <div className="px-3 flex items-center justify-between text-[10px] text-foreground-600">
                <a href="#" className="hover:text-foreground-400 transition-colors cursor-pointer">
                  帮助中心
                </a>
                <a href="#" className="hover:text-foreground-400 transition-colors cursor-pointer">
                  反馈建议
                </a>
                <span className="text-foreground-800">v2.4.1</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
