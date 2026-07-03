// 竞争情报 tab（八层模型的竞争情报层 + MKT-012 监测告警；原 competitors 页按 Gap Analysis 迁入）
// 注意：这里是客户视角的市场竞争对手（MKT-005 CompetitorProfile），不是本平台的竞品。
import { useState } from 'react';
import { competitorIntel, competitorAlerts } from '@/mocks/researchData';

const THREAT = {
  high: { label: '高威胁', cls: 'bg-error/10 text-error' },
  medium: { label: '中威胁', cls: 'bg-warning/10 text-warning' },
  low: { label: '低威胁', cls: 'bg-white/5 text-foreground-500' },
};

const ALERT_ICON: Record<string, string> = {
  pricing: 'ri-price-tag-3-line',
  channel: 'ri-route-line',
  product: 'ri-box-3-line',
  policy: 'ri-government-line',
};

const SEVERITY = {
  critical: 'bg-error/10 text-error border-error/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  info: 'bg-white/5 text-foreground-500 border-white/10',
};

export default function CompetitiveIntel() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const alerts =
    filter === 'all' ? competitorAlerts : competitorAlerts.filter((a) => a.competitor === filter);

  return (
    <div className="grid lg:grid-cols-2 gap-3">
      {/* 竞争对手档案 */}
      <div className="space-y-2">
        <p className="text-foreground-400 text-xs font-medium">
          市场竞争对手（客户视角 · MKT-005）· 数据截止 2026-06-28
        </p>
        {competitorIntel.map((c) => {
          const open = expanded === c.id;
          const t = THREAT[c.threat];
          return (
            <div key={c.id} className="rounded-xl border border-primary-500/10 bg-white/[0.03]">
              <button
                onClick={() => setExpanded(open ? null : c.id)}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 cursor-pointer text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-white text-xs font-medium">{c.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${t.cls}`}>{t.label}</span>
                  </div>
                  <p className="text-foreground-600 text-[10px] mt-0.5">
                    {c.origin} · {c.industry} · {c.focus_markets.join('/')}
                  </p>
                </div>
                <i
                  className={`${open ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-foreground-500`}
                ></i>
              </button>
              {open && (
                <div className="px-3.5 pb-3 border-t border-white/5 pt-2 grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <p className="text-success mb-1">优势</p>
                    <div className="flex flex-wrap gap-1">
                      {c.strengths.map((s, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-success/10 text-success">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-warning mb-1">弱点（我方机会）</p>
                    <div className="flex flex-wrap gap-1">
                      {c.weaknesses.map((s, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-warning/10 text-warning">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 动态告警（MKT-012 Monitoring） */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <p className="text-foreground-400 text-xs font-medium">动态监测告警（MKT-012）</p>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] text-foreground-400"
          >
            <option value="all">全部来源</option>
            {competitorIntel.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={`rounded-lg border px-3 py-2 flex items-start gap-2 ${SEVERITY[a.severity]}`}
            >
              <i className={`${ALERT_ICON[a.type]} mt-0.5`}></i>
              <div className="min-w-0">
                <p className="text-[11px]">{a.title}</p>
                <p className="text-[9px] opacity-70 mt-0.5">
                  {a.competitor} · {a.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-foreground-700 text-[9px] mt-2">
          变化达到阈值生成 Alert，不静默覆盖已批准结论（MKT-012 验收）
        </p>
      </div>
    </div>
  );
}
