// DryRunModal —— Campaign Dry Run → ExecutionAuthorization 流（CAM-007/008，M0 全模拟）
// 母本 6.12.5 Dry Run 区：展示对象、样例、时间、成本、权利和风险 → 批准生成不可变授权 / 限制规模 / 退回。
import { useState } from 'react';
import type { CostInfo, PolicyInfo } from './types';
import { CostBadge, PolicyBadge } from './Badges';

export interface DryRunReport {
  campaign_name: string;
  /** 目标人群 */
  audience_size: number;
  audience_frozen: boolean;
  /** 样例（抽样展示将发送/发布的实际内容对象） */
  samples: { channel: string; recipient: string; preview: string }[];
  schedule_summary: string;
  cost: CostInfo;
  /** 数据权利检查结果 */
  rights_check: { total: number; blocked_outreach: number; suppressed: number };
  policy: PolicyInfo;
  risks: string[];
  /** 授权边界（批准后固化，不可变） */
  authorization_bounds: { label: string; value: string }[];
}

interface DryRunModalProps {
  open: boolean;
  onClose: () => void;
  report: DryRunReport;
  onDecide?: (decision: 'AUTHORIZED' | 'SCOPE_LIMITED' | 'RETURNED') => void;
}

export default function DryRunModal({ open, onClose, report: r, onDecide }: DryRunModalProps) {
  const [decided, setDecided] = useState<null | string>(null);
  if (!open) return null;

  const decide = (d: 'AUTHORIZED' | 'SCOPE_LIMITED' | 'RETURNED') => {
    setDecided(d);
    onDecide?.(d);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60]" onClick={onClose}></div>
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl z-[70] border border-primary-500/15 animate-fade-in"
        style={{
          background: 'linear-gradient(160deg, rgba(18,14,40,0.99) 0%, rgba(26,16,60,0.99) 100%)',
          backdropFilter: 'blur(20px)',
        }}
        role="dialog"
        aria-label="Dry Run 模拟报告"
      >
        <div className="sticky top-0 flex items-center justify-between px-5 h-14 border-b border-primary-500/10 bg-inherit z-10">
          <div className="flex items-center gap-2">
            <i className="ri-flask-line text-primary-400"></i>
            <h3 className="text-white text-sm font-semibold">Dry Run 模拟 · {r.campaign_name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground-500 hover:text-white hover:bg-white/5 cursor-pointer"
            aria-label="关闭"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* 概览 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
              <p className="text-foreground-600 text-[10px]">目标人群</p>
              <p className="text-white text-sm font-semibold mt-0.5">{r.audience_size} 位联系人</p>
              <p className="text-foreground-600 text-[9px] mt-0.5">
                {r.audience_frozen ? '名单已冻结（批次可追溯）' : '动态名单'}
              </p>
            </div>
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
              <p className="text-foreground-600 text-[10px]">排期</p>
              <p className="text-foreground-200 text-xs mt-0.5 leading-snug">
                {r.schedule_summary}
              </p>
            </div>
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
              <p className="text-foreground-600 text-[10px]">预估成本</p>
              <div className="mt-1">
                <CostBadge cost={r.cost} />
              </div>
            </div>
            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
              <p className="text-foreground-600 text-[10px]">策略检查</p>
              <div className="mt-1">
                <PolicyBadge policy={r.policy} />
              </div>
            </div>
          </div>

          {/* 数据权利检查（DAT-006：外联前逐字段 Policy Check） */}
          <div className="rounded-lg border border-primary-500/10 bg-white/[0.02] p-3">
            <p className="text-foreground-300 text-xs font-medium mb-1.5">
              <i className="ri-shield-keyhole-line mr-1 text-primary-400"></i>数据权利检查
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              <span className="text-foreground-400">
                可外联{' '}
                <span className="text-success">
                  {r.rights_check.total -
                    r.rights_check.blocked_outreach -
                    r.rights_check.suppressed}
                </span>
              </span>
              <span className="text-foreground-400">
                许可限制排除 <span className="text-warning">{r.rights_check.blocked_outreach}</span>
              </span>
              <span className="text-foreground-400">
                Suppression 排除 <span className="text-error">{r.rights_check.suppressed}</span>
                <span className="text-foreground-700 ml-1">（不可覆盖）</span>
              </span>
            </div>
          </div>

          {/* 样例 */}
          <div>
            <p className="text-foreground-300 text-xs font-medium mb-1.5">
              <i className="ri-mail-open-line mr-1 text-primary-400"></i>发送样例（抽样{' '}
              {r.samples.length} 条）
            </p>
            <div className="space-y-1.5">
              {r.samples.map((s, i) => (
                <div key={i} className="rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2">
                  <p className="text-[10px] text-foreground-600">
                    {s.channel} → {s.recipient}
                  </p>
                  <p className="text-foreground-300 text-[11px] mt-0.5 line-clamp-2">{s.preview}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 风险 */}
          {r.risks.length > 0 && (
            <div className="rounded-lg border border-warning/20 bg-warning/5 p-3">
              <p className="text-warning text-xs font-medium mb-1">
                <i className="ri-alert-line mr-1"></i>风险提示
              </p>
              <ul className="space-y-0.5">
                {r.risks.map((risk, i) => (
                  <li key={i} className="text-foreground-400 text-[11px]">
                    · {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 授权边界（批准后固化为不可变 ExecutionAuthorization，CAM-008） */}
          <div className="rounded-lg border border-primary-500/15 bg-primary-500/5 p-3">
            <p className="text-primary-300 text-xs font-medium mb-1.5">
              <i className="ri-key-2-line mr-1"></i>
              将签发的执行授权边界（批准后不可变，超界动作需重新审批）
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {r.authorization_bounds.map((b, i) => (
                <div key={i} className="text-[11px]">
                  <span className="text-foreground-600">{b.label}：</span>
                  <span className="text-foreground-300">{b.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 决策 */}
          {decided ? (
            <div
              className={`rounded-lg px-3 py-2.5 text-xs inline-flex items-center gap-1.5 ${
                decided === 'AUTHORIZED'
                  ? 'bg-success/10 text-success'
                  : decided === 'SCOPE_LIMITED'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-error/10 text-error'
              }`}
            >
              <i className="ri-checkbox-circle-line"></i>
              {decided === 'AUTHORIZED'
                ? '已签发执行授权（ISSUED → ACTIVE，模拟）· 执行服务只接受有效授权（CAM-008）'
                : decided === 'SCOPE_LIMITED'
                  ? '已限制规模后签发授权（模拟）'
                  : '已退回计划，未签发任何授权'}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => decide('AUTHORIZED')}
                className="px-4 py-2 rounded-lg text-xs bg-success/15 text-success border border-success/30 hover:bg-success/25 cursor-pointer"
              >
                批准并签发授权
              </button>
              <button
                onClick={() => decide('SCOPE_LIMITED')}
                className="px-4 py-2 rounded-lg text-xs bg-warning/10 text-warning border border-warning/30 hover:bg-warning/20 cursor-pointer"
              >
                限制规模后批准
              </button>
              <button
                onClick={() => decide('RETURNED')}
                className="px-4 py-2 rounded-lg text-xs bg-error/10 text-error border border-error/30 hover:bg-error/20 cursor-pointer"
              >
                退回
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
