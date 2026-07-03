import { useState } from 'react';
import {
  connectedPlatforms,
  availableIntegrations,
  apiTokens,
} from '@/mocks/integrationData';

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'connected' | 'available' | 'api'>('connected');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewToken, setShowNewToken] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const statusIcon = (status: string) => {
    if (status === 'connected') return <span className="w-2 h-2 rounded-full bg-green-400"></span>;
    if (status === 'syncing') return <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>;
    if (status === 'error') return <span className="w-2 h-2 rounded-full bg-red-400"></span>;
    return <span className="w-2 h-2 rounded-full bg-foreground-700"></span>;
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, string> = {
      connected: '已连接',
      syncing: '同步中',
      error: '异常',
      disconnected: '未连接',
    };
    return labels[status] || status;
  };

  const copyToken = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAvailable = availableIntegrations.filter(i =>
    !searchQuery || i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-primary-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h1 className="text-xl font-semibold text-white">集成与账号</h1>
            <p className="text-sm text-foreground-500 mt-0.5">
              {connectedPlatforms.filter(p => p.status === 'connected').length} 个已连接平台 · {apiTokens.length} 个 API Token
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-background-100/30 rounded-lg p-1 w-full md:w-fit overflow-x-auto">
          {[
            { key: 'connected', label: '已连接', icon: 'ri-plug-line' },
            { key: 'available', label: '可添加', icon: 'ri-apps-line' },
            { key: 'api', label: 'API Token', icon: 'ri-key-2-line' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-foreground-500 hover:text-foreground-300'
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 md:px-6 py-4">
        {/* ===== CONNECTED PLATFORMS ===== */}
        {activeTab === 'connected' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedPlatforms.map(p => (
              <div
                key={p.id}
                className="bg-background-100/30 border border-primary-500/8 rounded-xl p-4 hover:border-primary-500/20 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500/15 to-primary-300/15 flex items-center justify-center">
                      <i className={`${p.icon} text-primary-400 text-lg`}></i>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{p.name}</h3>
                      <p className="text-[11px] text-foreground-500">{p.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {statusIcon(p.status)}
                    <span className={
                      p.status === 'connected' ? 'text-green-400' :
                      p.status === 'syncing' ? 'text-amber-400' :
                      p.status === 'error' ? 'text-red-400' :
                      'text-foreground-600'
                    }>
                      {statusLabel(p.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground-600">账号</span>
                    <span className="text-white">{p.accountName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground-600">同步数据</span>
                    <span className="text-white">{p.dataSynced}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground-600">最后同步</span>
                    <span className="text-foreground-500">{p.lastSync}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-primary-500/8">
                  <button className="flex-1 text-xs bg-primary-500/10 text-primary-400 py-1.5 rounded-md hover:bg-primary-500/20 transition-colors cursor-pointer">
                    立即同步
                  </button>
                  {p.status === 'error' && (
                    <button className="flex-1 text-xs bg-red-500/10 text-red-400 py-1.5 rounded-md hover:bg-red-500/20 transition-colors cursor-pointer">
                      重新授权
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== AVAILABLE INTEGRATIONS ===== */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            <div className="relative max-w-md">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-500 text-sm"></i>
              <input
                type="text"
                placeholder="搜索集成..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-background-100/40 border border-primary-500/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-foreground-600 focus:outline-none focus:border-primary-500/30"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailable.map(i => (
                <div
                  key={i.id}
                  className="bg-background-100/30 border border-primary-500/8 rounded-xl p-4 hover:border-primary-500/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-foreground-500/15 to-foreground-300/15 flex items-center justify-center">
                        <i className={`${i.icon} text-foreground-400 text-lg`}></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-white">{i.name}</h3>
                          {i.isEnterprise && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-ai-accent/15 text-ai-accent">企业版</span>
                          )}
                        </div>
                        <p className="text-[11px] text-foreground-500">{i.category}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-foreground-600 mb-3">{i.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-primary-500/8">
                    <span className="text-[11px] text-foreground-600">
                      <i className="ri-user-line mr-1"></i>
                      {i.popularity.toLocaleString()} 用户
                    </span>
                    <button className="text-xs bg-primary-500/15 text-primary-400 px-3 py-1.5 rounded-md hover:bg-primary-500/25 transition-colors cursor-pointer">
                      连接
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== API TOKENS ===== */}
        {activeTab === 'api' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <p className="text-xs text-foreground-500">
                管理 GrowthOS API 访问令牌。Token 前缀为可识别标识，完整密钥仅在创建时显示一次。
              </p>
              <button
                onClick={() => setShowNewToken(!showNewToken)}
                className="text-xs bg-primary-500/15 text-primary-400 px-3 py-1.5 rounded-md border border-primary-500/20 hover:bg-primary-500/25 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className={`${showNewToken ? 'ri-close-line' : 'ri-add-line'} mr-1`}></i>
                {showNewToken ? '取消' : '新建 Token'}
              </button>
            </div>

            {showNewToken && (
              <div className="bg-background-100/40 border border-primary-500/15 rounded-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3">新建 API Token</h3>
                <div className="space-y-3 max-w-lg">
                  <div>
                    <label className="text-xs text-foreground-500 block mb-1">Token 名称</label>
                    <input
                      type="text"
                      placeholder="例如：生产环境 Webhook"
                      className="w-full bg-background-100/50 border border-primary-500/10 rounded-lg px-3 py-2 text-sm text-white placeholder-foreground-600 focus:outline-none focus:border-primary-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-foreground-500 block mb-1">权限范围</label>
                    <div className="flex flex-wrap gap-2">
                      {['campaigns:read', 'contacts:write', 'analytics:read', 'webhooks:manage', 'deals:sync'].map(scope => (
                        <label key={scope} className="flex items-center gap-1.5 text-xs text-foreground-400 cursor-pointer">
                          <input type="checkbox" className="rounded border-primary-500/20 bg-background-100/50" />
                          {scope}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button className="text-xs bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
                    生成 Token
                  </button>
                </div>
              </div>
            )}

            <div className="bg-background-100/30 border border-primary-500/8 rounded-xl overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-primary-500/8">
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">名称</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">密钥前缀</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">权限</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">最后使用</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-foreground-500">状态</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-foreground-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {apiTokens.map(token => (
                    <tr key={token.id} className="border-b border-primary-500/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-xs text-white">{token.name}</td>
                      <td className="px-4 py-3 text-xs text-foreground-500 font-mono">{token.prefix}********</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {token.scopes.map(s => (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-background-200/40 text-foreground-600">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground-500">{token.lastUsed}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${token.isActive ? 'bg-green-500/15 text-green-400' : 'bg-foreground-700/15 text-foreground-600'}`}>
                          {token.isActive ? '活跃' : '已停用'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => copyToken(token.id)}
                          className="text-[11px] text-primary-400 hover:text-primary-300 cursor-pointer"
                        >
                          {copiedId === token.id ? '已复制' : '复制'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}