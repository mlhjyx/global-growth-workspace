// CostBadge / PolicyBadge / ConfidenceBadge —— 母本 6.13「证据、来源、置信度、成本和风险与结果同时可见」
import type { CostInfo, PolicyInfo, PolicyEffect } from './types';

const COST_CATEGORY_LABELS: Record<string, string> = {
  DATA: '数据',
  MODEL: '模型',
  MEDIA: '媒体',
  EMAIL: '邮件',
  EXPERT: '专家',
};

export function CostBadge({ cost }: { cost: CostInfo }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-foreground-400 whitespace-nowrap"
      title={cost.detail || ''}
    >
      <i className="ri-coins-line text-[10px]"></i>
      {cost.kind === 'ESTIMATED' ? '预估' : '实际'}
      {cost.category ? ` · ${COST_CATEGORY_LABELS[cost.category]}` : ''} {cost.currency}{' '}
      {cost.amount.toLocaleString()}
    </span>
  );
}

const POLICY_STYLE: Record<PolicyEffect, { label: string; cls: string; icon: string }> = {
  ALLOW: {
    label: '策略允许',
    cls: 'text-success border-success/30 bg-success/10',
    icon: 'ri-shield-check-line',
  },
  ALLOW_WITH_DISCLOSURE: {
    label: '允许（需披露）',
    cls: 'text-success border-success/30 bg-success/10',
    icon: 'ri-shield-check-line',
  },
  REQUIRE_APPROVAL: {
    label: '需人工审批',
    cls: 'text-warning border-warning/30 bg-warning/10',
    icon: 'ri-shield-user-line',
  },
  MASK_FIELDS: {
    label: '字段遮罩',
    cls: 'text-warning border-warning/30 bg-warning/10',
    icon: 'ri-eye-off-line',
  },
  LIMIT_VOLUME: {
    label: '限制规模',
    cls: 'text-warning border-warning/30 bg-warning/10',
    icon: 'ri-speed-mini-line',
  },
  REQUIRE_EXPERT: {
    label: '需专家确认',
    cls: 'text-warning border-warning/30 bg-warning/10',
    icon: 'ri-user-star-line',
  },
  DENY: {
    label: '策略阻止',
    cls: 'text-error border-error/30 bg-error/10',
    icon: 'ri-shield-cross-line',
  },
};

export function PolicyBadge({ policy }: { policy: PolicyInfo }) {
  const s = POLICY_STYLE[policy.effect];
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border whitespace-nowrap ${s.cls}`}
      title={[policy.reason, ...(policy.reason_codes || [])].filter(Boolean).join(' · ')}
    >
      <i className={`${s.icon} text-[10px]`}></i>
      {s.label}
    </span>
  );
}

export function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const cls = pct >= 80 ? 'text-success' : pct >= 60 ? 'text-warning' : 'text-error';
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] ${cls}`} title="模型/数据置信度">
      <i className="ri-focus-2-line text-[10px]"></i>
      {pct}%
    </span>
  );
}
