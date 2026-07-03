// EPIC-M0-03 T4：PG-005 后两区域 —— Sample Backtest（LED-004）+ Query Preview（LED-005）
// 验收：未回测 ICP = HYPOTHESIS（假设），不能启动批量搜索；查询计划显示数据源/成本/预计规模。
import { useState } from 'react';
import { accounts } from '@/data/fixtures';
import { CostBadge, PolicyBadge } from '@/components/governance';

type Verdict = 'MATCH' | 'BORDERLINE' | 'EXCLUDED';

const VERDICT_UI: Record<Verdict, { label: string; cls: string }> = {
  MATCH: { label: '匹配', cls: 'bg-success/10 text-success' },
  BORDERLINE: { label: '边界', cls: 'bg-warning/10 text-warning' },
  EXCLUDED: { label: '排除', cls: 'bg-error/10 text-error' },
};

// 从 fixtures 按 matched_icp_ids 取样：正例 = 命中该 ICP 的账户（最多 6），
// 负例 = 未命中账户（优先无任何 ICP 匹配的，2 个对照）——回测样本必须属于被验证的 ICP
const buildSamples = (icpId: string) => {
  const toName = (a: (typeof accounts)[number]) => a.legal_name || a.trading_names?.[0] || a.id;
  const positives = accounts
    .filter((a) => (a.matched_icp_ids ?? []).includes(icpId))
    .slice(0, 6)
    .map((a, i) => ({
      id: a.id,
      name: toName(a),
      country: a.country,
      hit: i % 3 === 2 ? '部分条件处于边界（规模接近下限）' : '行业/规模/市场条件命中',
      verdict: (i % 3 === 2 ? 'BORDERLINE' : 'MATCH') as Verdict,
    }));
  const negatives = accounts
    .filter((a) => !(a.matched_icp_ids ?? []).includes(icpId))
    .sort((a, b) => (a.matched_icp_ids?.length ?? 0) - (b.matched_icp_ids?.length ?? 0))
    .slice(0, 2)
    .map((a) => ({
      id: a.id,
      name: toName(a),
      country: a.country,
      hit: '未命中 ICP 条件（对照负例）',
      verdict: 'EXCLUDED' as Verdict,
    }));
  return [...positives, ...negatives];
};

// 查询计划（LED-005；供应商未定 = OD-07）
const QUERY_PLAN = {
  providers: [
    { type: 'TradeDataProvider', note: '贸易记录/进口商', status: '供应商未选定（OD-07）' },
    { type: 'B2BCompanyPersonProvider', note: '企业与联系人', status: '供应商未选定（OD-07）' },
    { type: 'PublicIntelligenceProvider', note: '官网/展会/协会', status: '批准来源白名单' },
  ],
  filters: '行业 + 目标市场 + 规模区间 + 排除条件（Must/Nice/Exclude 已结构化）',
  estimate: '预计 120-180 家企业 · 首批解锁联系人约 40 个',
};

interface ICPValidationProps {
  icpId: string;
}

export default function ICPValidation({ icpId }: ICPValidationProps) {
  const [reviews, setReviews] = useState<Record<string, 'accept' | 'reject'>>({});
  // 按 icpId 区分激活态：避免激活 ICP A 后切换到 B 时错误显示已激活（绕过 LED-004 回测门禁）
  const [activatedMap, setActivatedMap] = useState<Record<string, boolean>>({});
  const activated = !!activatedMap[icpId];
  const setActivated = (v: boolean) => setActivatedMap((p) => ({ ...p, [icpId]: v }));

  const samples = buildSamples(icpId);
  const accepted = samples.filter((s) => reviews[`${icpId}_${s.id}`] === 'accept').length;
  const rejected = samples.filter((s) => reviews[`${icpId}_${s.id}`] === 'reject').length;
  // 门禁看「认可数」而非「打分动作数」：全部点不认可不能开闸（LED-004）
  const threshold = Math.ceil(samples.length * 0.6);
  const backtestPassed = accepted >= threshold;
  // 剩余未评样本即使全部认可也到不了阈值 = 回测已失败，需调整 ICP 条件
  const backtestFailed = !backtestPassed && rejected > samples.length - threshold;
  const matchRate = Math.round(
    (samples.filter((s) => s.verdict === 'MATCH').length / Math.max(samples.length, 1)) * 100,
  );

  const mark = (sid: string, v: 'accept' | 'reject') =>
    setReviews((p) => ({ ...p, [`${icpId}_${sid}`]: v }));

  return (
    <div className="space-y-3 mt-3">
      {/* Sample Backtest（LED-004） */}
      <div className="rounded-xl border border-primary-500/10 bg-white/[0.03] p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <p className="text-white text-xs font-semibold">
            样例回测 Sample Backtest
            <span className="text-foreground-600 font-normal ml-2 text-[10px]">
              LED-004 · 确认「是不是我要找的客户」
            </span>
          </p>
          <span
            className={`text-[10px] px-2 py-0.5 rounded ${
              activated
                ? 'bg-success/10 text-success'
                : backtestPassed
                  ? 'bg-primary-500/10 text-primary-300'
                  : backtestFailed
                    ? 'bg-error/10 text-error'
                    : 'bg-warning/10 text-warning'
            }`}
          >
            {activated
              ? 'ACTIVE 已激活'
              : backtestPassed
                ? 'VALIDATING 待激活'
                : backtestFailed
                  ? '回测未达标'
                  : 'HYPOTHESIS 假设'}
          </span>
        </div>
        <p className="text-foreground-600 text-[10px] mb-2">
          系统判定命中率 {matchRate}% · 已认可 {accepted}/{samples.length} · 不认可 {rejected}
          （认可 ≥{threshold} 家方可激活，LED-004）
        </p>
        <div className="space-y-1.5 max-h-56 overflow-y-auto">
          {samples.map((s) => {
            const v = VERDICT_UI[s.verdict];
            const r = reviews[`${icpId}_${s.id}`];
            return (
              <div
                key={s.id}
                className="flex items-center gap-2 rounded-lg bg-white/[0.02] border border-white/5 px-2.5 py-1.5"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-foreground-300 text-[11px] truncate">
                    {s.name} <span className="text-foreground-600">· {s.country}</span>
                  </p>
                  <p className="text-foreground-600 text-[9px]">{s.hit}</p>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded shrink-0 ${v.cls}`}>
                  {v.label}
                </span>
                {r ? (
                  <span
                    className={`text-[10px] shrink-0 ${r === 'accept' ? 'text-success' : 'text-error'}`}
                  >
                    {r === 'accept' ? '✓ 认可' : '✗ 不认可'}
                  </span>
                ) : (
                  <span className="flex gap-1 shrink-0">
                    <button
                      onClick={() => mark(s.id, 'accept')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-success/10 text-success cursor-pointer"
                    >
                      认可
                    </button>
                    <button
                      onClick={() => mark(s.id, 'reject')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-foreground-500 cursor-pointer"
                    >
                      不认可
                    </button>
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {backtestFailed && (
          <p className="text-error text-[10px] mt-2">
            回测未达标：不认可样本过多，认可数已无法达到阈值 {threshold}。请调整 ICP 条件
            （Must/Exclude）后重新回测；当前 ICP 保持假设态，不能启动批量搜索（LED-004）。
          </p>
        )}
      </div>

      {/* Query Preview（LED-005） */}
      <div className="rounded-xl border border-primary-500/10 bg-white/[0.03] p-3.5">
        <p className="text-white text-xs font-semibold mb-2">
          查询预览 Query Preview
          <span className="text-foreground-600 font-normal ml-2 text-[10px]">
            LED-005 · 数据源、成本与预计规模先可见
          </span>
        </p>
        <div className="space-y-1.5 mb-2">
          {QUERY_PLAN.providers.map((p) => (
            <div key={p.type} className="flex items-center gap-2 text-[11px]">
              <span className="text-primary-300 font-mono text-[10px]">{p.type}</span>
              <span className="text-foreground-500">{p.note}</span>
              <span className="text-foreground-700 text-[9px] ml-auto">{p.status}</span>
            </div>
          ))}
        </div>
        <p className="text-foreground-500 text-[10px] mb-1">筛选：{QUERY_PLAN.filters}</p>
        <p className="text-foreground-500 text-[10px] mb-2">{QUERY_PLAN.estimate}</p>
        <div className="flex flex-wrap items-center gap-2">
          <CostBadge
            cost={{
              kind: 'ESTIMATED',
              amount: 96,
              currency: 'USD',
              category: 'DATA',
              detail: '企业发现 + 40 个联系人按需解锁',
            }}
          />
          <PolicyBadge
            policy={{ effect: 'LIMIT_VOLUME', reason: '联系人按需解锁，不批量购买（母本 2.2.5）' }}
          />
        </div>
        <div className="flex gap-2 mt-3">
          <button
            disabled={!backtestPassed && !activated}
            onClick={() => setActivated(true)}
            title={
              backtestPassed || activated
                ? ''
                : '认可样本达到 60% 后才能激活并启动批量搜索（LED-004）'
            }
            className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer ${
              backtestPassed || activated
                ? 'bg-primary-500/15 text-primary-300 border-primary-500/30 hover:bg-primary-500/25'
                : 'bg-white/5 text-foreground-600 border-white/10 cursor-not-allowed'
            }`}
          >
            {activated ? '✓ 已激活 · 可进入 Discover' : '激活 ICP 并启动批量搜索'}
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs text-foreground-500 border border-white/10 cursor-pointer hover:text-foreground-300">
            保存查询计划
          </button>
        </div>
      </div>
    </div>
  );
}
