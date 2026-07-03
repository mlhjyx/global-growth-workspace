import { useState } from 'react';
import {
  settingSections,
  notificationSettings,
  securitySessions,
  usageStats,
} from '@/mocks/settingsData';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [notifSettings, setNotifSettings] = useState(notificationSettings);
  const [showMFA, setShowMFA] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleNotif = (idx: number, field: 'email' | 'inApp' | 'slack') => {
    setNotifSettings(prev =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: !item[field] } : item))
    );
  };

  const copySession = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-white">个人资料</h2>
            <div className="bg-background-100/30 border border-primary-500/8 rounded-xl p-5 space-y-4 max-w-full md:max-w-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-data-highlight flex items-center justify-center text-white text-lg font-semibold">
                  L
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Leo Chen</p>
                  <p className="text-xs text-foreground-500">管理员 · leo.chen@growthos.ai</p>
                </div>
                <button className="ml-auto text-xs bg-primary-500/15 text-primary-400 px-3 py-1.5 rounded-md border border-primary-500/20 hover:bg-primary-500/25 transition-colors cursor-pointer">
                  更换头像
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-xs text-foreground-500 block mb-1">显示名称</label>
                  <input type="text" defaultValue="Leo Chen" className="w-full bg-background-100/50 border border-primary-500/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/30" />
                </div>
                <div>
                  <label className="text-xs text-foreground-500 block mb-1">职位</label>
                  <input type="text" defaultValue="增长运营总监" className="w-full bg-background-100/50 border border-primary-500/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/30" />
                </div>
                <div>
                  <label className="text-xs text-foreground-500 block mb-1">时区</label>
                  <select className="w-full bg-background-100/50 border border-primary-500/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/30">
                    <option>Asia/Shanghai (UTC+8)</option>
                    <option>Europe/Berlin (UTC+1)</option>
                    <option>America/New_York (UTC-5)</option>
                    <option>Asia/Singapore (UTC+8)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-foreground-500 block mb-1">语言</label>
                  <select className="w-full bg-background-100/50 border border-primary-500/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/30">
                    <option>简体中文</option>
                    <option>English</option>
                    <option>Deutsch</option>
                    <option>日本語</option>
                  </select>
                </div>
              </div>
              <button className="text-xs bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
                保存更改
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-white">通知偏好</h2>
            <div className="bg-background-100/30 border border-primary-500/8 rounded-xl overflow-x-auto max-w-full md:max-w-2xl">
              <table className="w-full min-w-[480px]">
                <thead>
                  <tr className="border-b border-primary-500/8">
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">事件类型</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-foreground-500">邮件</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-foreground-500">应用内</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-foreground-500">Slack</th>
                  </tr>
                </thead>
                <tbody>
                  {notifSettings.map((row, idx) => (
                    <tr key={idx} className="border-b border-primary-500/5">
                      <td className="px-4 py-3 text-xs text-white">{row.channel}</td>
                      <td className="px-4 py-3 text-center">
                        <input type="checkbox" checked={row.email} onChange={() => toggleNotif(idx, 'email')} className="cursor-pointer" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input type="checkbox" checked={row.inApp} onChange={() => toggleNotif(idx, 'inApp')} className="cursor-pointer" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input type="checkbox" checked={row.slack} onChange={() => toggleNotif(idx, 'slack')} className="cursor-pointer" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-5">
            <h2 className="text-sm font-medium text-white">安全与认证</h2>

            {/* Password */}
            <div className="bg-background-100/30 border border-primary-500/8 rounded-xl p-5 max-w-full md:max-w-xl">
              <h3 className="text-xs font-medium text-white mb-3">密码</h3>
              <p className="text-xs text-foreground-600 mb-3">上次修改：2025-04-15 · 建议使用强密码并定期更换</p>
              <button className="text-xs bg-primary-500/15 text-primary-400 px-3 py-1.5 rounded-md border border-primary-500/20 hover:bg-primary-500/25 transition-colors cursor-pointer">
                修改密码
              </button>
            </div>

            {/* MFA */}
            <div className="bg-background-100/30 border border-primary-500/8 rounded-xl p-5 max-w-full md:max-w-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-medium text-white">双因素认证 (2FA)</h3>
                  <p className="text-xs text-foreground-600 mt-0.5">使用身份验证器 App 增强账户安全</p>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">未启用</span>
              </div>
              <button
                onClick={() => setShowMFA(!showMFA)}
                className="text-xs bg-primary-500/15 text-primary-400 px-3 py-1.5 rounded-md border border-primary-500/20 hover:bg-primary-500/25 transition-colors cursor-pointer"
              >
                {showMFA ? '取消' : '启用 2FA'}
              </button>

              {showMFA && (
                <div className="mt-4 p-4 bg-background-100/50 rounded-lg border border-primary-500/10">
                  <p className="text-xs text-foreground-500 mb-3">请使用身份验证器扫描以下二维码：</p>
                  <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-3">
                    <div className="w-24 h-24 bg-foreground-950 rounded-sm" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 4px, #fff 4px, #fff 8px), repeating-linear-gradient(90deg, #000 0px, #000 4px, #fff 4px, #fff 8px)' }}></div>
                  </div>
                  <p className="text-[11px] text-foreground-600 font-mono mb-2">JBSW Y3DP EHPK 3PXP</p>
                  <input type="text" placeholder="输入 6 位验证码" className="w-32 bg-background-100/50 border border-primary-500/10 rounded-lg px-3 py-2 text-sm text-white placeholder-foreground-600 focus:outline-none focus:border-primary-500/30" />
                  <button className="ml-2 text-xs bg-primary-500 text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
                    验证
                  </button>
                </div>
              )}
            </div>

            {/* Sessions */}
            <div className="bg-background-100/30 border border-primary-500/8 rounded-xl p-5 max-w-full md:max-w-xl">
              <h3 className="text-xs font-medium text-white mb-3">活跃会话</h3>
              <div className="space-y-3">
                {securitySessions.map(s => (
                  <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-primary-500/5 last:border-0 gap-2">
                    <div className="flex items-center gap-3">
                      <i className="ri-computer-line text-foreground-500 text-sm"></i>
                      <div>
                        <p className="text-xs text-white">
                          {s.device} · {s.browser}
                          {s.isCurrent && <span className="text-[10px] text-green-400 ml-2">(当前)</span>}
                        </p>
                        <p className="text-[11px] text-foreground-600">{s.location} · {s.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-foreground-600">{s.lastActive}</span>
                      {!s.isCurrent && (
                        <button
                          onClick={() => copySession(s.id)}
                          className="text-[11px] text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          {copiedId === s.id ? '已终止' : '终止'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'workspace':
        return (
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-white">工作区设置</h2>
            <div className="bg-background-100/30 border border-primary-500/8 rounded-xl p-5 space-y-4 max-w-full md:max-w-xl">
              <div>
                <label className="text-xs text-foreground-500 block mb-1">企业名称</label>
                <input type="text" defaultValue="GrowthOS 科技" className="w-full bg-background-100/50 border border-primary-500/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/30" />
              </div>
              <div>
                <label className="text-xs text-foreground-500 block mb-1">企业官网</label>
                <input type="text" defaultValue="https://growthos.ai" className="w-full bg-background-100/50 border border-primary-500/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/30" />
              </div>
              <div>
                <label className="text-xs text-foreground-500 block mb-1">行业</label>
                <select className="w-full bg-background-100/50 border border-primary-500/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500/30">
                  <option>B2B 营销技术</option>
                  <option>SaaS</option>
                  <option>跨境电商</option>
                  <option>制造业</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-foreground-500 block mb-1">品牌主色</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-500 border border-primary-500/30"></div>
                  <div className="w-8 h-8 rounded-lg bg-ai-accent border border-ai-accent/30"></div>
                  <div className="w-8 h-8 rounded-lg bg-foreground-500 border border-foreground-500/30"></div>
                  <span className="text-xs text-foreground-600 ml-2">由 StyleSystem 自动生成</span>
                </div>
              </div>
              <button className="text-xs bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
                保存更改
              </button>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-5">
            <h2 className="text-sm font-medium text-white">计费与套餐</h2>

            {/* Plan Card */}
            <div className="bg-gradient-to-r from-primary-500/15 to-ai-accent/15 border border-primary-500/20 rounded-xl p-5 max-w-full md:max-w-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <div>
                  <p className="text-sm font-medium text-white">企业专业版</p>
                  <p className="text-xs text-foreground-500">年付 · 下一账单日 2026-01-15</p>
                </div>
                <span className="text-sm font-semibold text-white">$299/月</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs bg-primary-500 text-white px-3 py-1.5 rounded-md hover:bg-primary-600 transition-colors cursor-pointer">
                  升级套餐
                </button>
                <button className="text-xs bg-background-100/50 text-foreground-500 px-3 py-1.5 rounded-md hover:bg-background-100/70 transition-colors cursor-pointer">
                  查看发票
                </button>
              </div>
            </div>

            {/* Usage */}
            <div className="bg-background-100/30 border border-primary-500/8 rounded-xl p-5 max-w-full md:max-w-xl">
              <h3 className="text-xs font-medium text-white mb-4">用量概览</h3>
              <div className="space-y-4">
                {[
                  { label: '联系人', used: usageStats.contactsUsed, limit: usageStats.contactsLimit },
                  { label: '战役', used: usageStats.campaignsUsed, limit: usageStats.campaignsLimit },
                  { label: '存储空间', used: usageStats.storageUsed, limit: usageStats.storageLimit, unit: 'GB' },
                  { label: '团队成员', used: usageStats.teamMembers, limit: usageStats.teamLimit },
                ].map(item => {
                  const pct = (item.used / item.limit) * 100;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-foreground-500">{item.label}</span>
                        <span className="text-xs text-white">
                          {item.used.toLocaleString()}{item.unit || ''} / {item.limit.toLocaleString()}{item.unit || ''}
                        </span>
                      </div>
                      <div className="h-1.5 bg-background-200/40 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-amber-400' : 'bg-primary-400'}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:h-full">
      {/* Sidebar nav */}
      <div className="w-full md:w-[220px] shrink-0 border-r border-b md:border-b-0 border-primary-500/10 p-2 md:p-4 flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1 md:space-y-1">
        <p className="hidden md:block px-3 py-1 text-[11px] text-foreground-600 uppercase tracking-wider font-medium mb-2">设置</p>
        {settingSections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`w-auto md:w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer shrink-0 md:shrink ${
              activeSection === s.id
                ? 'bg-primary-500/15 text-white border border-primary-500/25'
                : 'text-foreground-500 hover:text-foreground-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className={`${s.icon} ${activeSection === s.id ? 'text-primary-400' : 'text-foreground-600'}`}></i>
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium whitespace-nowrap md:whitespace-normal">{s.title}</p>
              <p className="hidden md:block text-[10px] text-foreground-600 truncate">{s.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto px-4 md:px-6 py-4 md:py-5">
        {renderSection()}
      </div>
    </div>
  );
}