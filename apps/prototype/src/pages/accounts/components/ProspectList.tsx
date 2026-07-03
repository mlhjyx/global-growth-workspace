import { useState } from 'react';
import type { Account, AccountSignal } from '@/mocks/accountData';
import { signalTypeConfig, statusConfig } from '@/mocks/accountData';

interface ProspectListProps {
  accounts: Account[];
}

export default function ProspectList({ accounts }: ProspectListProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(accounts[0]?.id || null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'quality'>('score');

  const filtered = accounts.filter(a => filterStatus === 'all' || a.status === filterStatus);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'date') return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    return b.dataQuality - a.dataQuality;
  });

  const selectedAccount = sorted.find(a => a.id === selectedAccountId) || sorted[0];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-primary-400';
    if (score >= 70) return 'text-warning';
    return 'text-foreground-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-success/10 border-success/30';
    if (score >= 80) return 'bg-primary-500/10 border-primary-500/30';
    if (score >= 70) return 'bg-warning/10 border-warning/30';
    return 'bg-white/5 border-white/10';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary-500/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-semibold">潜客列表</span>
          <span className="text-foreground-600 text-xs">({filtered.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs py-1 px-2 bg-input-bg border-input-border rounded-md"
          >
            <option value="all">全部状态</option>
            <option value="new">新潜客</option>
            <option value="contacted">已联系</option>
            <option value="engaged">互动中</option>
            <option value="qualified">已认证</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'date' | 'quality')}
            className="text-xs py-1 px-2 bg-input-bg border-input-border rounded-md"
          >
            <option value="score">按评分</option>
            <option value="date">按活跃度</option>
            <option value="quality">按数据质量</option>
          </select>
          <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
            <i className="ri-add-line text-xs"></i>
            导入
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="glass-card overflow-hidden m-4 min-w-[680px]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary-500/10">
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium w-12">评分</th>
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">公司</th>
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">信号</th>
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">地区/行业</th>
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">状态</th>
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">数据质量</th>
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">最近活动</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((account) => {
                const status = statusConfig[account.status];
                const hotSignals = account.signals.filter(s => s.isHot);
                return (
                  <tr
                    key={account.id}
                    onClick={() => setSelectedAccountId(account.id)}
                    className={`border-b border-white/5 cursor-pointer transition-colors
                      ${selectedAccountId === account.id ? 'bg-primary-500/5' : 'hover:bg-white/[0.02]'}`}
                  >
                    <td className="px-3 py-2.5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${getScoreBg(account.score)}`}>
                        <span className={`text-sm font-bold ${getScoreColor(account.score)}`}>{account.score}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">{account.company}</span>
                        <span className="text-foreground-600 text-[11px]">{account.domain} · {account.employees} 人 · {account.revenue}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col gap-1">
                        {hotSignals.slice(0, 2).map(signal => {
                          const config = signalTypeConfig[signal.type];
                          return (
                            <span key={signal.id} className="inline-flex items-center gap-1 text-[11px]">
                              <span className={`w-3 h-3 flex items-center justify-center ${config.color}`}>
                                <i className={`${config.icon} text-[10px]`}></i>
                              </span>
                              <span className="text-foreground-400">{signal.title}</span>
                            </span>
                          );
                        })}
                        {account.signals.length > 2 && (
                          <span className="text-foreground-700 text-[10px]">+{account.signals.length - 2} 条信号</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col">
                        <span className="text-foreground-400 text-xs">{account.country}</span>
                        <span className="text-foreground-600 text-[11px]">{account.industry}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${status.bg} ${status.color} border border-opacity-30`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-success to-primary-400"
                            style={{ width: `${account.dataQuality}%` }}
                          ></div>
                        </div>
                        <span className="text-foreground-600 text-[11px]">{account.dataQuality}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-foreground-600 text-xs">{account.lastActivity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account detail panel (shown when selected) */}
      {selectedAccount && (
        <div className="h-auto md:h-[200px] border-t border-primary-500/10 shrink-0 p-4 overflow-y-auto"
          style={{ background: 'linear-gradient(90deg, rgba(12,10,26,0.95) 0%, rgba(26,16,60,0.85) 100%)' }}
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getScoreBg(selectedAccount.score)}`}>
                <span className={`text-lg font-bold ${getScoreColor(selectedAccount.score)}`}>{selectedAccount.score}</span>
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold">{selectedAccount.company}</h3>
                <p className="text-foreground-500 text-xs">{selectedAccount.domain} · {selectedAccount.city}, {selectedAccount.country}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                <i className="ri-chat-new-line text-xs"></i>
                发起互动
              </button>
              <button className="btn-secondary text-xs px-3 py-1.5">
                转为线索
              </button>
            </div>
          </div>

          {/* Signals */}
          <div className="mb-3">
            <p className="text-foreground-500 text-[11px] uppercase tracking-wider font-medium mb-1.5">信号摘要</p>
            <div className="flex gap-2 flex-wrap">
              {selectedAccount.signals.map(signal => {
                const config = signalTypeConfig[signal.type];
                return (
                  <div key={signal.id} className="glass-card px-2.5 py-1.5 flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 flex items-center justify-center ${config.color}`}>
                      <i className={`${config.icon} text-xs`}></i>
                    </span>
                    <div>
                      <p className="text-white text-xs">{signal.title}</p>
                      <p className="text-foreground-600 text-[10px]">{signal.description.slice(0, 40)}...</p>
                    </div>
                    {signal.isHot && (
                      <span className="badge-error text-[10px]">Hot</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contacts + Tech Stack */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-foreground-500 text-[11px] uppercase tracking-wider font-medium mb-1.5">联系人</p>
              <div className="flex gap-2 flex-wrap">
                {selectedAccount.contacts.map(contact => (
                  <div key={contact.id} className="glass-card px-2.5 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-data-highlight flex items-center justify-center text-white text-[8px] font-semibold">
                        {contact.name.charAt(0)}
                      </span>
                      <div>
                        <p className="text-white text-xs">{contact.name}</p>
                        <p className="text-foreground-600 text-[10px]">{contact.title}</p>
                      </div>
                      {contact.isPrimary && (
                        <span className="badge-success text-[9px]">主</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-foreground-500 text-[11px] uppercase tracking-wider font-medium mb-1.5">技术栈</p>
              <div className="flex gap-1 flex-wrap">
                {selectedAccount.techStack.map(tech => (
                  <span key={tech} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-foreground-400">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}