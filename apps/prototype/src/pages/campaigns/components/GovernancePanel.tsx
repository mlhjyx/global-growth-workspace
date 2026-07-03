// Campaign 治理面板（EPIC-M0-04 T2，CAM-007/008/011）：执行授权状态 + 停止条件 + Dry Run 入口。
// 硬边界 1：任何对外执行必须 Dry Run→ExecutionAuthorization，授权即冻结范围（不可变快照）。
import { useState } from 'react';
import type { Campaign } from '@/mocks/campaignData';
import { executionAuthorizations, stopConditions } from '@/data/fixtures';
import { DryRunModal, type DryRunReport } from '@/components/governance';

const AUTH_STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: '生效中', cls: 'bg-success/10 text-success' },
  REVOKED: { label: '已撤销', cls: 'bg-error/10 text-error' },
  EXPIRED: { label: '已过期', cls: 'bg-white/5 text-foreground-500' },
  SUPERSEDED: { label: '已被替代', cls: 'bg-white/5 text-foreground-500' },
};

const STOP_TYPE_LABELS: Record<string, string> = {
  BOUNCE_RATE: '退信率',
  COMPLAINT_RATE: '投诉率',
  UNSUBSCRIBE_RATE: '退订率',
  NEGATIVE_REPLY_RATE: '负面回复率',
  BUDGET_CONSUMED: '预算消耗',
  ERROR_RATE: '错误率',
};

const STOP_ACTION_LABELS: Record<string, string> = {
  PAUSE_CAMPAIGN: '暂停 Campaign',
  PAUSE_CHANNEL: '暂停渠道',
  STOP_SEQUENCE: '停止序列',
  NOTIFY_ONLY: '仅通知',
};

const COMPARISON_SIGNS: Record<string, string> = { GTE: '≥', GT: '>', LTE: '≤', LT: '<' };

const fmtThreshold = (t: any) => {
  const v = t?.threshold_value ?? 0;
  const pct = v > 0 && v < 1 ? `${Math.round(v * 100)}%` : String(v);
  const win = t?.window_minutes ? ` · ${Math.round(t.window_minutes / 60)}h 窗口` : '';
  const min = t?.min_sample_size ? ` · n≥${t.min_sample_size}` : '';
  return `${COMPARISON_SIGNS[t?.comparison] ?? ''}${pct}${win}${min}`;
};

interface GovernancePanelProps {
  campaign: Campaign;
}

export default function GovernancePanel({ campaign }: GovernancePanelProps) {
  const [dryRunOpen, setDryRunOpen] = useState(false);
  // Dry Run 决策结果（模拟）：按 campaign id 记录，切换 Campaign 不串
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const decision = decisions[campaign.id];

  const auths = executionAuthorizations.filter((a) => a.campaign_id === campaign.id);
  const stops = stopConditions.filter((s) => s.campaign_id === campaign.id);

  const report: DryRunReport = {
    campaign_name: campaign.name,
    audience_size: campaign.leads,
    audience_frozen: true,
    samples: [
      {
        channel: 'EMAIL',
        recipient: 'proc***@mekong-solar.example.com（已遮罩）',
        preview: '首触达：引用对方近 180 天进口增长信号 + 产品认证清单（样例）',
      },
      {
        channel: 'EMAIL',
        recipient: 'purchasing***@example-build.ng（已遮罩）',
        preview: '跟进：SONCAP 认证与账期方案，含退订链接与合规署名（样例）',
      },
    ],
    schedule_summary: `${campaign.startDate} 起 · 收件人时区 09:00-11:00 · 每日上限 40`,
    cost: {
      kind: 'ESTIMATED',
      amount: 18,
      currency: 'USD',
      category: 'EMAIL',
      detail: `${campaign.leads} 人名单 × 序列 3 步（模拟估算）`,
    },
    rights_check: { total: campaign.leads, blocked_outreach: 3, suppressed: 2 },
    policy: {
      effect: 'REQUIRE_APPROVAL',
      reason: '对外发送属默认人工审批动作（母本 OPEN DECISION 8）',
      reason_codes: ['OUTBOUND_SEND'],
    },
    risks: [
      '2 位联系人邮箱验证状态 UNKNOWN，建议发送前先验证',
      '目标市场含需专家确认的准入条款，相关话术已标记 EXPERT_REVIEW（D-018）',
    ],
    authorization_bounds: [
      { label: '渠道', value: campaign.channels.join(' / ') },
      { label: '最大动作数', value: '900' },
      { label: '有效期', value: '签发后 14 天' },
      { label: '受众快照', value: '冻结名单 · 版本与哈希固化' },
    ],
  };

  return (
    <div className="px-3 md:px-5 py-2 border-b border-primary-500/10 shrink-0 bg-white/[0.015]">
      <div className="grid md:grid-cols-3 gap-2">
        {/* 执行授权状态（CAM-008：无授权=执行阻断） */}
        <div className="rounded-lg border border-white/10 px-3 py-2">
          <p className="text-foreground-500 text-[10px] font-medium mb-1">
            <i className="ri-shield-check-line mr-1"></i>执行授权 ExecutionAuthorization
          </p>
          {auths.length === 0 && !decision && (
            <p className="text-warning text-[11px]">
              <i className="ri-alert-line mr-1"></i>
              无有效授权：外部执行被阻断，先运行 Dry Run（CAM-007）
            </p>
          )}
          {auths.map((a) => {
            const st = AUTH_STATUS_LABELS[a.status] ?? {
              label: a.status,
              cls: 'bg-white/5 text-foreground-500',
            };
            return (
              <div key={a.id} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${st.cls}`}>{st.label}</span>
                <span className="text-foreground-400">
                  {(a.scope?.channels ?? []).join('/')} · 上限 {a.scope?.max_total_actions ?? '—'}{' '}
                  动作
                </span>
                <span className="text-foreground-600 text-[10px]">
                  签发 {String(a.issued_at ?? '').slice(0, 10)} · 模板 {(a.templates ?? []).length}{' '}
                  个 · 快照已冻结
                </span>
              </div>
            );
          })}
          {decision === 'AUTHORIZED' && (
            <p className="text-success text-[11px] mt-0.5">
              <i className="ri-checkbox-circle-line mr-1"></i>
              新授权已生成（模拟）：范围按 Dry Run 报告固化
            </p>
          )}
          {decision === 'SCOPE_LIMITED' && (
            <p className="text-primary-300 text-[11px] mt-0.5">
              <i className="ri-contract-left-right-line mr-1"></i>
              已按限制范围授权（模拟）：先发 20% 观察停止条件
            </p>
          )}
          {decision === 'RETURNED' && (
            <p className="text-warning text-[11px] mt-0.5">
              <i className="ri-arrow-go-back-line mr-1"></i>已退回修改（模拟）：执行保持阻断
            </p>
          )}
        </div>

        {/* 停止条件（CAM-011：运行中自动护栏） */}
        <div className="rounded-lg border border-white/10 px-3 py-2">
          <p className="text-foreground-500 text-[10px] font-medium mb-1">
            <i className="ri-stop-circle-line mr-1"></i>停止条件 StopConditions
          </p>
          {stops.length === 0 ? (
            <p className="text-foreground-600 text-[11px]">
              未配置——授权前必须至少一条（CAM-011 验收）
            </p>
          ) : (
            <div className="space-y-0.5">
              {stops.map((s) => (
                <p key={s.id} className="text-[11px] text-foreground-400">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                      s.enabled ? 'bg-success' : 'bg-foreground-600'
                    }`}
                  ></span>
                  {STOP_TYPE_LABELS[s.condition_type] ?? s.condition_type}{' '}
                  {fmtThreshold(s.threshold)} → {STOP_ACTION_LABELS[s.action] ?? s.action}
                  {(s.trigger_count ?? 0) > 0 && (
                    <span className="text-warning ml-1">已触发 {s.trigger_count} 次</span>
                  )}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Dry Run 入口 */}
        <div className="rounded-lg border border-primary-500/20 bg-primary-500/5 px-3 py-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-primary-300 text-[10px] font-medium">
              <i className="ri-flask-line mr-1"></i>Dry Run 模拟
            </p>
            <p className="text-foreground-600 text-[10px] mt-0.5">
              真实执行前必经：对象/样例/成本/权利/风险 → 授权
            </p>
          </div>
          <button
            onClick={() => setDryRunOpen(true)}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs bg-primary-500/15 text-primary-300 border border-primary-500/30 hover:bg-primary-500/25 cursor-pointer"
          >
            运行 Dry Run
          </button>
        </div>
      </div>

      {/* 条件挂载：关闭即卸载，内部“已决策”状态不会泄漏到下次打开或其他 Campaign */}
      {dryRunOpen && (
        <DryRunModal
          open
          onClose={() => setDryRunOpen(false)}
          report={report}
          onDecide={(d) => setDecisions((p) => ({ ...p, [campaign.id]: d }))}
        />
      )}
    </div>
  );
}
