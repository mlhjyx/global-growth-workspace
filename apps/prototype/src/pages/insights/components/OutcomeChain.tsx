// 三级结果链视图（EPIC-M0-05 T2，ENG-016/ANA-013）：Qualified Lead → SAO → Verified Outcome。
// 北极星口径：SAO 必须由 Sales Acceptance 产生；撤回/降级为模拟操作；7/30/90 天回写展示。
import { useState } from 'react';
import { mockAccounts } from '@/mocks/accountData';
import { opportunities, commercialOutcomes, OPPORTUNITY_STAGE_LABELS } from '@/data/fixtures';

const QUALIFIED_STATES = ['QUALIFIED', 'CONTACTED', 'CONVERTED'];
const OUTCOME_LABELS: Record<string, string> = {
  MEETING: '会议完成',
  SAMPLE: '样品确认',
  ORDER: '首单',
  REPEAT: '复购',
};

export default function OutcomeChain() {
  // 模拟撤回/降级：按机会 id 记录（WITHDRAWN/DOWNGRADED），不改 fixtures
  const [overrides, setOverrides] = useState<Record<string, 'WITHDRAWN' | 'DOWNGRADED'>>({});

  const qualified = mockAccounts.filter((a) => QUALIFIED_STATES.includes(a.leadStatus));
  const stageOf = (o: any) => overrides[o.id] ?? o.stage;
  const active = opportunities.filter(
    (o: any) => !['WITHDRAWN', 'DOWNGRADED', 'LOST'].includes(stageOf(o)),
  );
  const dropped = opportunities.filter((o: any) =>
    ['WITHDRAWN', 'DOWNGRADED', 'LOST'].includes(stageOf(o)),
  );

  return (
    <div className="mx-4 mt-4 rounded-2xl border border-primary-500/10 bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-white text-sm font-semibold">
          三级结果链{' '}
          <span className="text-foreground-600 text-[10px] font-normal">
            Qualified Lead → SAO → Verified Outcome（北极星口径，ENG-016/ANA-013）
          </span>
        </p>
        <p className="text-foreground-600 text-[10px]">
          SAO 必须由 Sales Acceptance 产生，不自动生成
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {/* L1 Qualified Lead */}
        <div className="rounded-xl border border-white/10 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-primary-300 text-xs font-medium">Qualified Lead</p>
            <span className="text-white text-lg font-semibold">{qualified.length}</span>
          </div>
          {qualified.slice(0, 3).map((a) => (
            <p key={a.id} className="text-[10px] text-foreground-400 truncate">
              {a.company} <span className="text-foreground-600">· {a.country}</span>
            </p>
          ))}
          <p className="text-foreground-700 text-[9px] mt-2">确认合格才进入本列（LED 验收）</p>
        </div>

        {/* L2 SAO */}
        <div className="rounded-xl border border-success/20 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-success text-xs font-medium">SAO（销售接受机会）</p>
            <span className="text-white text-lg font-semibold">{active.length}</span>
          </div>
          <div className="space-y-1.5">
            {active.map((o: any) => (
              <div
                key={o.id}
                className="rounded-lg bg-white/[0.03] border border-white/5 px-2 py-1.5"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] text-foreground-300">
                    {OPPORTUNITY_STAGE_LABELS[stageOf(o)] ?? stageOf(o)}
                  </span>
                  <span className="flex gap-1">
                    <button
                      onClick={() => setOverrides((p) => ({ ...p, [o.id]: 'WITHDRAWN' }))}
                      className="px-1.5 py-0.5 rounded text-[9px] text-foreground-500 border border-white/10 cursor-pointer hover:text-error"
                      title="撤回（模拟）：需原因并回写来源 Campaign"
                    >
                      撤回
                    </button>
                    <button
                      onClick={() => setOverrides((p) => ({ ...p, [o.id]: 'DOWNGRADED' }))}
                      className="px-1.5 py-0.5 rounded text-[9px] text-foreground-500 border border-white/10 cursor-pointer hover:text-warning"
                      title="降级（模拟）：回到培育队列"
                    >
                      降级
                    </button>
                  </span>
                </div>
              </div>
            ))}
            {dropped.map((o: any) => (
              <div
                key={o.id}
                className="rounded-lg bg-white/[0.02] border border-white/5 px-2 py-1.5 opacity-60"
              >
                <span className="text-[10px] text-foreground-500">
                  {OPPORTUNITY_STAGE_LABELS[stageOf(o)] ?? stageOf(o)}
                  {overrides[o.id] && (
                    <span className="text-[9px]">（模拟：原因待填，回写归因）</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* L3 Verified Outcome */}
        <div className="rounded-xl border border-data-highlight/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-data-highlight text-xs font-medium">Verified Outcome</p>
            <span className="text-white text-lg font-semibold">{commercialOutcomes.length}</span>
          </div>
          <div className="space-y-1.5">
            {commercialOutcomes.map((c: any) => (
              <div
                key={c.id}
                className="rounded-lg bg-white/[0.03] border border-white/5 px-2 py-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-foreground-300">
                    {OUTCOME_LABELS[c.outcome_type] ?? c.outcome_type}
                  </span>
                  <span
                    className={`text-[9px] px-1 py-px rounded ${
                      c.verification_status === 'VERIFIED'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {c.verification_status === 'VERIFIED' ? '已验证' : '待验证'}
                  </span>
                </div>
                <p className="text-foreground-600 text-[9px] mt-0.5">
                  回写窗口：
                  {[7, 30, 90].map((w) => (
                    <span
                      key={w}
                      className={`ml-1 px-1 rounded ${
                        c.followup_window === w
                          ? 'bg-primary-500/15 text-primary-300'
                          : 'bg-white/5 text-foreground-600'
                      }`}
                    >
                      {w}天
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
          <p className="text-foreground-700 text-[9px] mt-2">
            7/30/90 天回写验证（模拟）——未验证不计入北极星
          </p>
        </div>
      </div>
    </div>
  );
}
