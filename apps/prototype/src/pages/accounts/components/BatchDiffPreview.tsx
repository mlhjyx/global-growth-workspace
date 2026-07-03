// 批量重评分差异预览（EPIC-M0-04 T1）：批量变更必须先展示差异、经确认才应用，
// 与 DryRun→授权同一治理语义（母本 6.13）；M0 为模拟，差异为静态演示数据。
import { useState } from 'react';
import type { Account, LeadQueue } from '@/mocks/accountData';
import { queueConfig } from '@/mocks/accountData';
import { CostBadge } from '@/components/governance';

interface BatchDiffPreviewProps {
  open: boolean;
  accounts: Account[];
  onClose: () => void;
}

// 模拟重评分增量（确定性，不用随机数）：信号更新导致的分数变化
const DELTAS = [-8, 6, 0, 9, -4, 0, 3, -12];

const queueForScore = (score: number, current: LeadQueue): LeadQueue => {
  if (current === 'DO_NOT_CONTACT' || current === 'REJECTED') return current; // 硬状态不受重评分影响
  return score >= 75 ? 'RECOMMENDED' : 'NEEDS_CONFIRMATION';
};

export default function BatchDiffPreview({ open, accounts, onClose }: BatchDiffPreviewProps) {
  const [applied, setApplied] = useState(false);
  if (!open) return null;

  // 排除 Suppression/硬性排除对象：它们不参与批量重评分
  const eligible = accounts.filter((a) => !a.suppressionApplied && !a.hardExclusionApplied);
  const rows = eligible.slice(0, DELTAS.length).map((a, i) => {
    const delta = DELTAS[i % DELTAS.length];
    const newScore = Math.max(0, Math.min(100, a.score + delta));
    const newQueue = queueForScore(newScore, a.queue);
    return { account: a, delta, newScore, newQueue, queueChanged: newQueue !== a.queue };
  });
  const changed = rows.filter((r) => r.delta !== 0);
  const excluded = accounts.length - eligible.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div
        className="relative w-full max-w-[560px] max-h-[80vh] overflow-y-auto rounded-2xl border border-primary-500/20 p-4"
        style={{
          background: 'linear-gradient(180deg, rgba(12,10,26,0.98) 0%, rgba(26,16,60,0.96) 100%)',
        }}
      >
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-white text-sm font-semibold">批量重评分 · 差异预览</h3>
          <button
            onClick={onClose}
            className="text-foreground-500 hover:text-white cursor-pointer"
            aria-label="关闭"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        <p className="text-foreground-600 text-[10px] mb-3">
          先看差异、确认后才应用（与 Dry Run 同一治理语义）；{changed.length} 条将变化，
          {rows.length - changed.length} 条不变
          {excluded > 0 && `，${excluded} 条 Suppression/硬性排除对象不参与`}。
        </p>

        <div className="rounded-xl border border-white/10 overflow-hidden mb-3">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-white/10 text-foreground-600">
                <th className="px-3 py-2 font-medium">公司</th>
                <th className="px-3 py-2 font-medium">综合优先级</th>
                <th className="px-3 py-2 font-medium">队列</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ account: a, delta, newScore, newQueue, queueChanged }) => (
                <tr key={a.id} className="border-b border-white/5">
                  <td className="px-3 py-1.5 text-foreground-300">{a.company}</td>
                  <td className="px-3 py-1.5">
                    {delta === 0 ? (
                      <span className="text-foreground-600">{a.score}（不变）</span>
                    ) : (
                      <span className="text-foreground-300">
                        {a.score} → <span className="text-white font-medium">{newScore}</span>{' '}
                        <span className={delta > 0 ? 'text-success' : 'text-error'}>
                          （{delta > 0 ? '+' : ''}
                          {delta}）
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-1.5">
                    {queueChanged ? (
                      <span>
                        <span className="text-foreground-600">{queueConfig[a.queue].label}</span>
                        <i className="ri-arrow-right-line mx-1 text-foreground-600"></i>
                        <span className={queueConfig[newQueue].color}>
                          {queueConfig[newQueue].label}
                        </span>
                      </span>
                    ) : (
                      <span className="text-foreground-600">{queueConfig[a.queue].label}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <CostBadge
            cost={{
              kind: 'ESTIMATED',
              amount: 2.4,
              currency: 'USD',
              category: 'MODEL',
              detail: `${rows.length} 条线索重评分（信号聚合 + 规则重算）`,
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-foreground-400 border border-white/10 cursor-pointer hover:text-foreground-200"
            >
              取消
            </button>
            <button
              disabled={applied}
              onClick={() => setApplied(true)}
              className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer ${
                applied
                  ? 'bg-success/10 text-success border-success/30 cursor-default'
                  : 'bg-primary-500/15 text-primary-300 border-primary-500/30 hover:bg-primary-500/25'
              }`}
            >
              {applied ? '✓ 已应用（模拟）' : `应用 ${changed.length} 条变更`}
            </button>
          </div>
        </div>
        {applied && (
          <p className="text-foreground-600 text-[10px] mt-2">
            （模拟）真实实现中由确定性作业执行并写入审计日志，队列变化会通知相关 Campaign。
          </p>
        )}
      </div>
    </div>
  );
}
