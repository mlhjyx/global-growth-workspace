import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  key: string;
  label: string;
  icon: string;
  path: string;
}

interface SecondaryNavItem {
  key: string;
  label: string;
  icon: string;
  path: string;
}

// 一级导航七项 = 母本 5.2 一级信息架构（今日/研究/客户/战役/内容/互动/洞察）；
// 发布归入「内容」域（内容页内入口）；市场与竞品已并入研究页（EPIC-M0-03）
const primaryNavItems: NavItem[] = [
  { key: 'home', label: '今日', icon: 'ri-home-5-line', path: '/dashboard' },
  { key: 'research', label: '研究', icon: 'ri-compass-3-line', path: '/research' },
  { key: 'accounts', label: '客户', icon: 'ri-user-search-line', path: '/accounts' },
  { key: 'campaigns', label: '战役', icon: 'ri-flag-2-line', path: '/campaigns' },
  { key: 'content', label: '内容', icon: 'ri-file-text-line', path: '/content' },
  { key: 'engagement', label: '互动', icon: 'ri-chat-3-line', path: '/engagement' },
  { key: 'insights', label: '洞察', icon: 'ri-line-chart-line', path: '/insights' },
];

const secondaryNavItems: SecondaryNavItem[] = [
  { key: 'knowledge', label: '企业知识', icon: 'ri-book-open-line', path: '/knowledge' },
  { key: 'integrations', label: '集成与账号', icon: 'ri-plug-line', path: '/integrations' },
  { key: 'team', label: '团队与审批', icon: 'ri-team-line', path: '/team' },
  { key: 'settings', label: '设置与安全', icon: 'ri-settings-3-line', path: '/settings' },
];

interface SidebarProps {
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export default function Sidebar({ mobileMenuOpen, onCloseMobileMenu }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile && onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  const showLabels = !collapsed || isMobile;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300
        w-[260px] ${collapsed ? 'md:w-[68px]' : 'md:w-[220px]'}
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:translate-x-0
        bg-gradient-to-b from-deep-dark via-deep-dark to-deep-purple
        border-r border-primary-500/10 backdrop-blur-xl`}
    >
      {/* Logo area */}
      <div className="flex items-center h-14 px-4 border-b border-primary-500/10 shrink-0">
        <button
          onClick={() => !isMobile && setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-300 flex items-center justify-center shrink-0">
            <i className="ri-rocket-2-fill text-white text-sm"></i>
          </div>
          {showLabels && (
            <span className="text-white font-semibold text-sm whitespace-nowrap">
              Global Growth Workspace
            </span>
          )}
        </button>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        <div className="space-y-0.5">
          {primaryNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer group
                  ${
                    active
                      ? 'bg-primary-500/10 text-white'
                      : 'text-foreground-500 hover:text-foreground-300 hover:bg-white/[0.03]'
                  }
                  ${collapsed && !isMobile ? 'justify-center px-2' : ''}`}
              >
                <span
                  className={`w-5 h-5 flex items-center justify-center shrink-0 ${active ? 'text-primary-400' : ''}`}
                >
                  <i className={`${item.icon} text-base`}></i>
                </span>
                {showLabels && <span className="text-sm whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-3 mx-3 border-t border-primary-500/8"></div>

        {/* Secondary navigation */}
        <div className="space-y-0.5">
          {secondaryNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer group
                  ${
                    active
                      ? 'bg-primary-500/10 text-white'
                      : 'text-foreground-500 hover:text-foreground-300 hover:bg-white/[0.03]'
                  }
                  ${collapsed && !isMobile ? 'justify-center px-2' : ''}`}
              >
                <span
                  className={`w-5 h-5 flex items-center justify-center shrink-0 ${active ? 'text-primary-400' : ''}`}
                >
                  <i className={`${item.icon} text-base`}></i>
                </span>
                {showLabels && <span className="text-sm whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User area */}
      <div className="p-2 border-t border-primary-500/10 shrink-0">
        <button
          className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-white/5
            ${collapsed && !isMobile ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}`}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-data-highlight flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">L</span>
          </div>
          {showLabels && (
            <div className="flex flex-col items-start min-w-0">
              <span className="text-white text-sm truncate w-full">Leo Chen</span>
              <span className="text-foreground-600 text-xs">管理员</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
