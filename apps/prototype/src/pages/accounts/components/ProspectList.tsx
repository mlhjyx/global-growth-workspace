import { useState } from 'react';
import type { Account, LeadQueue } from '@/mocks/accountData';
import {
  signalTypeConfig,
  statusConfig,
  queueConfig,
  signalsByAccount,
  BUYING_ROLE_LABELS,
  SCORE_METHOD_LABELS,
  VERIFICATION_LABELS,
} from '@/mocks/accountData';

interface ProspectListProps {
  accounts: Account[];
}

const QUEUE_FILTERS: LeadQueue[] = [
  'RECOMMENDED',
  'NEEDS_CONFIRMATION',
  'REJECTED',
  'DO_NOT_CONTACT',
];

export default function ProspectList({ accounts }: ProspectListProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    accounts[0]?.id || null,
  );
  const [filterQueue, setFilterQueue] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'quality'>('score');

  const filtered = accounts.filter((a) => filterQueue === 'all' || a.queue === filterQueue);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'date')
      return new Date(b.lastVerifiedAt).getTime() - new Date(a.lastVerifiedAt).getTime();
    return b.dataQuality - a.dataQuality;
  });

  const selectedAccount = sorted.find((a) => a.id === selectedAccountId) || sorted[0];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success';
    if (score >= 75) return 'text-primary-400';
    if (score >= 60) return 'text-warning';
    return 'text-foreground-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-success/10 border-success/30';
    if (score >= 75) return 'bg-primary-500/10 border-primary-500/30';
    if (score >= 60) return 'bg-warning/10 border-warning/30';
    return 'bg-white/5 border-white/10';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary-500/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-semibold">线索列表（Lead）</span>
          <span className="text-foreground-600 text-xs">({filtered.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterQueue}
            onChange={(e) => setFilterQueue(e.target.value)}
            className="text-xs py-1 px-2 bg-input-bg border-input-border rounded-md"
          >
            <option value="all">全部队列</option>
            {QUEUE_FILTERS.map((q) => (
              <option key={q} value={q}>
                {queueConfig[q].label}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'date' | 'quality')}
            className="text-xs py-1 px-2 bg-input-bg border-input-border rounded-md"
          >
            <option value="score">按综合优先级</option>
            <option value="date">按最近验证</option>
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
        <div className="glass-card overflow-hidden m-4 min-w-[760px]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary-500/10">
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium w-12">
                  优先级
                </th>
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">公司</th>
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">信号</th>
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">
                  地区/行业
                </th>
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">状态</th>
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">队列</th>
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">
                  数据质量
                </th>
                <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">
                  最近验证
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((account) => {
                const status = statusConfig[account.leadStatus];
                const queue = queueConfig[account.queue];
                const signals = signalsByAccount(account.id);
                return (
                  <tr
                    key={account.id}
                    onClick={() => setSelectedAccountId(account.id)}
                    className={`border-b border-white/5 cursor-pointer transition-colors
                      ${selectedAccountId === account.id ? 'bg-primary-500/5' : 'hover:bg-white/[0.02]'}`}
                  >
                    <td className="px-3 py-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center border ${getScoreBg(account.score)}`}
                      >
                        <span className={`text-sm font-bold ${getScoreColor(account.score)}`}>
                          {account.score}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">{account.company}</span>
                        <span className="text-foreground-600 text-[11px]">
                          {account.domain} · {account.employees} 人 · {account.revenue}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col gap-1">
                        {signals.slice(0, 2).map((signal) => {
                          const config = signalTypeConfig[signal.signal_type];
                          return (
                            <span
                              key={signal.id}
                              className="inline-flex items-center gap-1 text-[11px]"
                            >
                              <span
                                className={`w-3 h-3 flex items-center justify-center ${config.color}`}
                              >
                                <i className={`${config.icon} text-[10px]`}></i>
                              </span>
                              <span className="text-foreground-400">{signal.title}</span>
                              {signal.status === 'EXPIRED' && (
                                <span className="text-warning text-[10px]">已过期</span>
                              )}
                            </span>
                          );
                        })}
                        {signals.length === 0 && (
                          <span className="text-foreground-700 text-[10px]">—</span>
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
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${status.bg} ${status.color}`}
                      >
                        {status.icon && <i className={`${status.icon} text-[11px]`}></i>}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${queue.bg} ${queue.color}`}
                      >
                        {queue.icon && <i className={`${queue.icon} text-[11px]`}></i>}
                        {queue.label}
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
                        <span className="text-foreground-600 text-[11px]">
                          {account.dataQuality}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-foreground-600 text-xs">
                      {account.lastVerifiedAt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead detail panel (shown when selected) */}
      {selectedAccount && (
        <div
          className="h-auto md:h-[240px] border-t border-primary-500/10 shrink-0 p-4 overflow-y-auto"
          style={{
            background: 'linear-gradient(90deg, rgba(12,10,26,0.95) 0%, rgba(26,16,60,0.85) 100%)',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getScoreBg(selectedAccount.score)}`}
              >
                <span className={`text-lg font-bold ${getScoreColor(selectedAccount.score)}`}>
                  {selectedAccount.score}
                </span>
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold">{selectedAccount.company}</h3>
                <p className="text-foreground-500 text-xs">
                  {selectedAccount.domain} · {selectedAccount.country} ·{' '}
                  {selectedAccount.industries.join(' / ')}
                </p>
                {(selectedAccount.suppressionApplied || selectedAccount.hardExclusionApplied) && (
                  <p
                    className={`text-[11px] mt-0.5 ${selectedAccount.suppressionApplied ? 'text-error' : 'text-foreground-400'}`}
                  >
                    {selectedAccount.suppressionApplied && (
                      <span className="inline-flex items-center gap-1">
                        <i className="ri-forbid-line"></i>命中全局
                        Suppression（禁止联系），模型不得覆盖
                      </span>
                    )}
                    {selectedAccount.hardExclusionApplied && (
                      <span className="inline-flex items-center gap-1">
                        <i className="ri-close-circle-line"></i>
                        命中硬性排除（业务拒绝），综合优先级置 0
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={
                  selectedAccount.suppressionApplied || selectedAccount.hardExclusionApplied
                }
              >
                <i className="ri-chat-new-line text-xs"></i>
                生成外联提案
              </button>
              <button
                className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={
                  selectedAccount.suppressionApplied || selectedAccount.hardExclusionApplied
                }
              >
                推进为 SAO
              </button>
            </div>
          </div>

          {/* Six-dimension score（六维评分分项，不用单一黑盒分） */}
          <div className="mb-3">
            <p className="text-foreground-500 text-[11px] uppercase tracking-wider font-medium mb-1.5">
              六维评分{' '}
              <span className="normal-case text-foreground-700">
                综合优先级 {selectedAccount.score}（按 ICP 权重组合，各维度独立展示）
              </span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {selectedAccount.dimensions.map((dim) => (
                <div key={dim.key} className="glass-card px-2.5 py-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-500 text-[10px]">{dim.label}</span>
                    <span className="text-foreground-700 text-[9px]">
                      {SCORE_METHOD_LABELS[dim.method] ?? dim.method}
                    </span>
                  </div>
                  <p className={`text-sm font-semibold ${getScoreColor(dim.score)}`}>{dim.score}</p>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-300"
                      style={{ width: `${dim.score}%` }}
                    ></div>
                  </div>
                  {dim.evidence[0] && (
                    <p
                      className="text-foreground-700 text-[9px] mt-1 line-clamp-2"
                      title={dim.evidence[0].description}
                    >
                      {dim.evidence[0].description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contacts + FieldEvidence 数据权利 */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-foreground-500 text-[11px] uppercase tracking-wider font-medium mb-1.5">
                联系人
              </p>
              <div className="flex gap-2 flex-wrap">
                {selectedAccount.contacts.map((contact) => (
                  <div key={contact.id} className="glass-card px-2.5 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-data-highlight flex items-center justify-center text-white text-[8px] font-semibold">
                        {contact.name.charAt(0)}
                      </span>
                      <div>
                        <p className="text-white text-xs">
                          {contact.name}
                          {contact.suppressed && (
                            <span className="ml-1 text-error text-[9px]">
                              <i className="ri-forbid-line"></i> 禁止联系
                            </span>
                          )}
                        </p>
                        <p className="text-foreground-600 text-[10px]">
                          {contact.title} ·{' '}
                          {BUYING_ROLE_LABELS[contact.buyingRole] ?? contact.buyingRole}
                        </p>
                        <p className="text-foreground-600 text-[10px]">
                          <span className={contact.emailMasked ? 'text-foreground-500 italic' : ''}>
                            {contact.email}
                          </span>
                          {contact.emailMasked && (
                            <span
                              className="ml-1 text-warning text-[9px]"
                              title="allowed_to_display=false，按数据权利遮罩"
                            >
                              <i className="ri-eye-off-line"></i> 已遮罩
                            </span>
                          )}
                          <span
                            className={`ml-1 text-[9px] ${contact.emailVerification === 'VALID' ? 'text-success' : 'text-warning'}`}
                          >
                            {VERIFICATION_LABELS[contact.emailVerification] ??
                              contact.emailVerification}
                          </span>
                        </p>
                      </div>
                      {contact.isPrimary && <span className="badge-success text-[9px]">主</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-[300px]">
              <p className="text-foreground-500 text-[11px] uppercase tracking-wider font-medium mb-1.5">
                字段证据与数据权利
              </p>
              <div className="space-y-1">
                {selectedAccount.evidences.map((ev, idx) => (
                  <div
                    key={`${ev.entityId}-${ev.fieldName}-${idx}`}
                    className="glass-card px-2.5 py-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-300 text-[10px]">
                        {ev.entityLabel} · {ev.fieldName}
                      </span>
                      <span className="text-foreground-700 text-[9px]">
                        {ev.providerId} · {ev.fetchedAt}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[9px] ${ev.allowedToDisplay ? 'text-success' : 'text-error'}`}
                      >
                        <i className={ev.allowedToDisplay ? 'ri-eye-line' : 'ri-eye-off-line'}></i>{' '}
                        展示{ev.allowedToDisplay ? '' : '（遮罩）'}
                      </span>
                      <span
                        className={`text-[9px] ${ev.allowedToExport ? 'text-success' : 'text-foreground-500'}`}
                      >
                        <i className="ri-download-2-line"></i> 导出
                        {ev.allowedToExport ? '' : '（禁止）'}
                      </span>
                      <span
                        className={`text-[9px] ${ev.allowedForOutreach ? 'text-success' : 'text-foreground-500'}`}
                      >
                        <i className="ri-mail-send-line"></i> 外联
                        {ev.allowedForOutreach ? '' : '（禁止）'}
                      </span>
                      <span className="text-foreground-700 text-[9px] ml-auto">
                        置信 {Math.round(ev.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
