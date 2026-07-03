import { useState } from 'react';
import { teamMembers, pendingApprovals, auditLogs } from '@/mocks/teamData';
import type { TeamMember, PendingApproval } from '@/mocks/teamData';

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'approvals' | 'audit'>('members');
  const [approvalFilter, setApprovalFilter] = useState('all');

  const statusDot = (status: string) => {
    if (status === 'active') return 'bg-green-400';
    if (status === 'away') return 'bg-amber-400';
    return 'bg-foreground-700';
  };

  const approvalTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      content: 'ri-article-line',
      campaign: 'ri-flag-2-line',
      budget: 'ri-money-cny-circle-line',
      access: 'ri-key-2-line',
    };
    return icons[type] || 'ri-file-list-line';
  };

  const approvalTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      content: '内容',
      campaign: '战役',
      budget: '预算',
      access: '权限',
    };
    return labels[type] || type;
  };

  const priorityBadge = (p: string) => {
    const styles: Record<string, string> = {
      urgent: 'bg-red-500/15 text-red-400',
      normal: 'bg-amber-500/15 text-amber-400',
      low: 'bg-blue-500/15 text-blue-400',
    };
    return styles[p] || styles.low;
  };

  const logIcon = (type: string) => {
    const icons: Record<string, string> = {
      create: 'ri-add-circle-line text-green-400',
      update: 'ri-edit-line text-blue-400',
      delete: 'ri-delete-bin-line text-red-400',
      approve: 'ri-check-double-line text-green-400',
      reject: 'ri-close-circle-line text-red-400',
      login: 'ri-login-box-line text-foreground-500',
      export: 'ri-download-line text-primary-400',
    };
    return icons[type] || 'ri-file-list-line text-foreground-500';
  };

  const filteredApprovals =
    approvalFilter === 'all'
      ? pendingApprovals
      : pendingApprovals.filter((a) => a.type === approvalFilter);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-primary-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h1 className="text-xl font-semibold text-white">团队与审批</h1>
            <p className="text-sm text-foreground-500 mt-0.5">
              {teamMembers.length} 名成员 · {pendingApprovals.length} 条待审批 · 全链路审计日志
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs bg-primary-500/15 text-primary-400 px-3 py-1.5 rounded-full border border-primary-500/20 hover:bg-primary-500/25 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-user-add-line mr-1"></i>
              邀请成员
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-background-100/30 rounded-lg p-1 w-full md:w-fit overflow-x-auto">
          {[
            { key: 'members', label: '团队成员', icon: 'ri-team-line' },
            { key: 'approvals', label: '待审批', icon: 'ri-task-line' },
            { key: 'audit', label: '审计日志', icon: 'ri-shield-keyhole-line' },
          ].map((tab) => (
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
        {/* ===== MEMBERS TAB ===== */}
        {activeTab === 'members' && (
          <div className="bg-background-100/30 border border-primary-500/8 rounded-xl overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-primary-500/8">
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">
                    成员
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">
                    部门 / 角色
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">
                    状态
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">
                    活跃时间
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-foreground-500">
                    战役
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-foreground-500">
                    Qualified Lead
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((m: TeamMember) => (
                  <tr key={m.id} className="border-b border-primary-500/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-data-highlight flex items-center justify-center text-white text-xs font-semibold relative">
                          {m.avatar}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-deep-dark ${statusDot(m.status)}`}
                          ></span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white">{m.name}</p>
                          <p className="text-[11px] text-foreground-600">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-white">{m.department}</p>
                      <p className="text-[11px] text-foreground-600">{m.role}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full ${
                          m.status === 'active'
                            ? 'bg-green-500/15 text-green-400'
                            : m.status === 'away'
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-foreground-700/15 text-foreground-600'
                        }`}
                      >
                        {m.status === 'active' ? '在线' : m.status === 'away' ? '离开' : '离线'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground-500">{m.lastActive}</td>
                    <td className="px-4 py-3 text-center text-xs text-white">
                      {m.campaignsManaged}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-primary-400 font-medium">
                      {m.leadsConverted.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== APPROVALS TAB ===== */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-foreground-500">筛选类型：</span>
              {[
                { key: 'all', label: '全部' },
                { key: 'campaign', label: '战役' },
                { key: 'content', label: '内容' },
                { key: 'budget', label: '预算' },
                { key: 'access', label: '权限' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setApprovalFilter(f.key)}
                  className={`px-2.5 py-1 rounded-full text-xs cursor-pointer whitespace-nowrap ${
                    approvalFilter === f.key
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-foreground-500 hover:text-foreground-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredApprovals.map((a: PendingApproval) => (
                <div
                  key={a.id}
                  className="bg-background-100/30 border border-primary-500/8 rounded-xl p-4 hover:border-primary-500/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500/15 to-primary-300/15 flex items-center justify-center">
                        <i className={`${approvalTypeIcon(a.type)} text-primary-400 text-lg`}></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-white">{a.title}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${priorityBadge(a.priority)}`}
                          >
                            {a.priority === 'urgent'
                              ? '紧急'
                              : a.priority === 'normal'
                                ? '普通'
                                : '低优'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-foreground-500">
                            {approvalTypeLabel(a.type)}
                          </span>
                          <span className="text-[11px] text-foreground-700">·</span>
                          <span className="text-[11px] text-foreground-500">{a.requester}</span>
                          <span className="text-[11px] text-foreground-700">·</span>
                          <span className="text-[11px] text-foreground-600">{a.submittedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-xs bg-green-500/15 text-green-400 px-3 py-1.5 rounded-md hover:bg-green-500/25 transition-colors cursor-pointer">
                        批准
                      </button>
                      <button className="text-xs bg-red-500/15 text-red-400 px-3 py-1.5 rounded-md hover:bg-red-500/25 transition-colors cursor-pointer">
                        拒绝
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-foreground-600 mb-2">{a.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-foreground-600">
                    {a.budget && (
                      <span>
                        <i className="ri-money-cny-circle-line mr-1"></i>预算 {a.budget}
                      </span>
                    )}
                    {a.deadline && (
                      <span>
                        <i className="ri-calendar-line mr-1"></i>截止 {a.deadline}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== AUDIT LOGS TAB ===== */}
        {activeTab === 'audit' && (
          <div className="bg-background-100/30 border border-primary-500/8 rounded-xl overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-primary-500/8">
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">
                    操作
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">
                    用户
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">
                    对象
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">
                    时间
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-primary-500/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <i className={`${logIcon(log.type)} text-sm`}></i>
                        <span className="text-xs text-white">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-data-highlight flex items-center justify-center text-[9px] text-white font-semibold">
                          {log.userAvatar}
                        </div>
                        <span className="text-xs text-foreground-500">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground-500">{log.target}</td>
                    <td className="px-4 py-3 text-xs text-foreground-600">{log.timestamp}</td>
                    <td className="px-4 py-3 text-xs text-foreground-600 font-mono">
                      {log.ip || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
