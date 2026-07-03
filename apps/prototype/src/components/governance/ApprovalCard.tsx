// ApprovalCard —— 硬边界 1 的界面载体：外部动作 = ActionProposal → Policy → 人工审批 → ExecutionAuthorization
// 母本 6.12.1 审批区规定操作：批准 / 退回 / 限制范围 / 查看差异；审批人必须看到变更差异、风险与成本。
import { useState } from 'react';
import type { ApprovalProposal } from './types';
import { GOVERNED_ACTION_LABELS } from './types';
import { CostBadge, PolicyBadge } from './Badges';

const RISK_STYLE: Record<string, string> = {
  L1: 'bg-white/5 text-foreground-400 border-white/10',
  L2: 'bg-warning/10 text-warning border-warning/30',
  L3: 'bg-error/10 text-error border-error/30',
};

interface ApprovalCardProps {
  proposal: ApprovalProposal;
  onDecide?: (
    id: string,
    decision: 'APPROVED' | 'RETURNED' | 'SCOPE_LIMITED',
    note?: string,
  ) => void;
  onShowEvidence?: (proposal: ApprovalProposal) => void;
}

export default function ApprovalCard({ proposal: p, onDecide, onShowEvidence }: ApprovalCardProps) {
  const [showDiff, setShowDiff] = useState(false);
  const [note, setNote] = useState('');
  const [decided, setDecided] = useState<null | string>(p.status !== 'PENDING' ? p.status : null);

  const decide = (d: 'APPROVED' | 'RETURNED' | 'SCOPE_LIMITED') => {
    setDecided(d);
    onDecide?.(p.id, d, note || undefined);
  };

  return (
    <div className="rounded-xl border border-primary-500/10 bg-white/[0.03] p-3.5">
      {/* 头部：动作类型 + 风险 + 状态 */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-300 border border-primary-500/20">
              {GOVERNED_ACTION_LABELS[p.action]}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded border ${RISK_STYLE[p.risk_level]}`}
            >
              风险 {p.risk_level}
            </span>
            {p.policy && <PolicyBadge policy={p.policy} />}
            {p.cost && <CostBadge cost={p.cost} />}
          </div>
          <p className="text-white text-sm font-medium mt-1.5">{p.title}</p>
          <p className="text-foreground-500 text-[11px] mt-0.5">
            {p.proposed_by} 提案 · {p.proposed_at.slice(5, 16).replace('T', ' ')} · 影响范围：
            {p.scope_summary}
            {p.expires_at && ` · 授权有效至 ${p.expires_at.slice(0, 10)}`}
          </p>
        </div>
      </div>

      {/* 差异对比（审批人必须能看到改了什么） */}
      {p.diff && p.diff.length > 0 && (
        <div className="mt-2.5">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="text-[11px] text-primary-400 hover:text-primary-300 cursor-pointer inline-flex items-center gap-1"
          >
            <i className={showDiff ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}></i>
            查看差异（{p.diff.length} 项变更）
          </button>
          {showDiff && (
            <div className="mt-1.5 rounded-lg bg-black/20 border border-white/5 divide-y divide-white/5">
              {p.diff.map((d, i) => (
                <div key={i} className="px-2.5 py-1.5 text-[11px]">
                  <span className="text-foreground-500">{d.field}：</span>
                  <span className="text-error/80 line-through mr-1.5">{d.before}</span>
                  <i className="ri-arrow-right-line text-foreground-600 text-[10px] mr-1.5"></i>
                  <span className="text-success">{d.after}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 证据入口（两次点击内可达，母本 KNW-006） */}
      {p.evidence && p.evidence.length > 0 && (
        <button
          onClick={() => onShowEvidence?.(p)}
          className="mt-2 text-[11px] text-foreground-400 hover:text-primary-300 cursor-pointer inline-flex items-center gap-1"
        >
          <i className="ri-file-search-line"></i>
          查看依据（{p.evidence.length} 条证据）
        </button>
      )}

      {/* 决策区 */}
      {decided ? (
        <div
          className={`mt-3 rounded-lg px-3 py-2 text-xs inline-flex items-center gap-1.5 ${
            decided === 'APPROVED'
              ? 'bg-success/10 text-success'
              : decided === 'RETURNED'
                ? 'bg-error/10 text-error'
                : 'bg-warning/10 text-warning'
          }`}
        >
          <i
            className={
              decided === 'APPROVED'
                ? 'ri-checkbox-circle-line'
                : decided === 'RETURNED'
                  ? 'ri-arrow-go-back-line'
                  : 'ri-scissors-cut-line'
            }
          ></i>
          {decided === 'APPROVED'
            ? '已批准 · 已生成执行授权（模拟）· 全程审计'
            : decided === 'RETURNED'
              ? '已退回提案人'
              : '已限制范围后批准（模拟）'}
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="审批意见（退回/限制范围时必填）…"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-foreground-300 placeholder:text-foreground-700 outline-none focus:border-primary-500/40"
          />
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => decide('APPROVED')}
              className="px-3 py-1.5 rounded-lg text-xs bg-success/15 text-success border border-success/30 hover:bg-success/25 cursor-pointer"
            >
              批准并签发授权
            </button>
            <button
              onClick={() => note.trim() && decide('SCOPE_LIMITED')}
              className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer ${
                note.trim()
                  ? 'bg-warning/10 text-warning border-warning/30 hover:bg-warning/20'
                  : 'bg-white/5 text-foreground-600 border-white/10 cursor-not-allowed'
              }`}
              title={note.trim() ? '' : '需先填写限制说明'}
            >
              限制范围
            </button>
            <button
              onClick={() => note.trim() && decide('RETURNED')}
              className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer ${
                note.trim()
                  ? 'bg-error/10 text-error border-error/30 hover:bg-error/20'
                  : 'bg-white/5 text-foreground-600 border-white/10 cursor-not-allowed'
              }`}
              title={note.trim() ? '' : '需先填写退回原因'}
            >
              退回
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
