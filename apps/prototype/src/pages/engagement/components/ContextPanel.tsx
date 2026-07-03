// Inbox Context 面板（EPIC-M0-05 T1，PG-010 唯一整缺区）：
// 会话 → Account/Contact/来源 Campaign/触点历史/Opportunity 关联；高风险回复不能自动发送（ENG-009）。
import { Link } from 'react-router-dom';
import { contextForMessage } from '@/mocks/engagementData';
import { LEAD_STATE_LABELS, OPPORTUNITY_STAGE_LABELS } from '@/data/fixtures';
import { PageState } from '@/components/governance';

const toDay = (iso?: string) => (iso ? String(iso).slice(0, 10) : '—');

export default function ContextPanel({ messageId }: { messageId: string }) {
  const ctx = contextForMessage(messageId);
  if (!ctx) return <PageState kind="EMPTY" description="该会话尚未关联账户（模拟）" />;
  const { account, lead, contacts, opportunities, touchpoints, campaign } = ctx;

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      <p className="text-foreground-600 text-[9px]">
        （模拟关联）M1 由 conversation.account_id 真实关联；会话与原平台 ID 保留（PG-010 验收）
      </p>

      {/* Account */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <div className="flex items-center justify-between">
          <p className="text-white text-xs font-semibold truncate">
            {account.legal_name || account.trading_names?.[0] || account.id}
          </p>
          <Link
            to="/accounts"
            className="text-primary-400 text-[10px] shrink-0 hover:text-primary-300"
          >
            打开 <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
        <p className="text-foreground-600 text-[10px] mt-0.5">
          {account.country} · 员工 {account.employee_range || '—'} · 质量分{' '}
          {Math.round((account.quality_score ?? 0) * 100)}
        </p>
        {lead && (
          <p className="text-[10px] mt-1">
            <span className="text-foreground-600">Lead 状态：</span>
            <span className="text-primary-300">{LEAD_STATE_LABELS[lead.state] ?? lead.state}</span>
          </p>
        )}
      </div>

      {/* Contacts */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <p className="text-foreground-500 text-[10px] font-medium mb-1.5">
          联系人（{contacts.length}）
        </p>
        {contacts.slice(0, 3).map((c: any) => (
          <p key={c.id} className="text-[10px] text-foreground-400 truncate">
            {c.full_name || c.id}
            <span className="text-foreground-600"> · {c.current_role?.title || '—'}</span>
          </p>
        ))}
        {contacts.length === 0 && (
          <p className="text-foreground-600 text-[10px]">暂无（按需解锁）</p>
        )}
      </div>

      {/* 来源 Campaign */}
      {campaign && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <p className="text-foreground-500 text-[10px] font-medium mb-1">来源 Campaign</p>
          <p className="text-foreground-300 text-[11px] truncate">{campaign.name}</p>
          <p className="text-foreground-600 text-[10px]">{campaign.status}</p>
        </div>
      )}

      {/* 触点历史 */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <p className="text-foreground-500 text-[10px] font-medium mb-1.5">
          触点历史（{touchpoints.length}）
        </p>
        <div className="space-y-1">
          {touchpoints.map((t: any) => (
            <p key={t.id} className="text-[10px] text-foreground-400">
              <span className="text-foreground-600">{toDay(t.occurred_at)}</span> {t.channel} ·{' '}
              {t.touchpoint_type}
            </p>
          ))}
          {touchpoints.length === 0 && <p className="text-foreground-600 text-[10px]">暂无记录</p>}
        </div>
      </div>

      {/* Opportunity 关联 */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <p className="text-foreground-500 text-[10px] font-medium mb-1.5">
          关联机会（{opportunities.length}）
        </p>
        {opportunities.map((o: any) => (
          <p key={o.id} className="text-[10px] text-foreground-400 truncate">
            {OPPORTUNITY_STAGE_LABELS[o.stage] ?? o.stage}
            <span className="text-foreground-600"> · {toDay(o.created_at)}</span>
          </p>
        ))}
        {opportunities.length === 0 && (
          <p className="text-foreground-600 text-[10px]">
            暂无——高意向确认后经 Sales Acceptance 创建（不自动生成）
          </p>
        )}
      </div>

      <p className="text-warning text-[9px]">
        <i className="ri-alert-line mr-1"></i>
        高风险回复（价格/法务/认证承诺）不能自动发送，须走审批（ENG-009/D-018）
      </p>
    </div>
  );
}
