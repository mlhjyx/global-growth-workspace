// PG-003 Global Market Scan（母本 6.12.2、7.3.7 分维度评分、6.15 支持等级）
import { useState } from 'react';
import {
  marketCandidates,
  SCORE_DIMENSIONS,
  EVIDENCE_CATEGORY_LABELS,
  SUPPORT_LEVEL_LABELS,
  type MarketCandidate,
} from '@/mocks/researchData';
import { EvidenceDrawer, type EvidenceItem } from '@/components/governance';

const scoreColor = (v: number) =>
  v >= 70 ? 'bg-success/70' : v >= 50 ? 'bg-primary-400/70' : 'bg-warning/70';

const avg = (c: MarketCandidate) =>
  Math.round(
    SCORE_DIMENSIONS.reduce((s, d) => s + (c.scores[d.key] || 0), 0) / SCORE_DIMENSIONS.length,
  );

interface MarketScanProps {
  onEnterResearch: (candidate: MarketCandidate) => void;
}

export default function MarketScan({ onEnterResearch }: MarketScanProps) {
  const [industry, setIndustry] = useState<'光伏能源' | '建材'>('光伏能源');
  const [expanded, setExpanded] = useState<string | null>('mc_vn');
  const [compare, setCompare] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<{ title: string; items: EvidenceItem[] } | null>(null);

  const list = marketCandidates.filter((c) => c.industry === industry);
  const compareList = list.filter((c) => compare.includes(c.id));

  const toEvidenceItems = (c: MarketCandidate): EvidenceItem[] =>
    c.evidences.map((e) => ({
      id: e.id,
      subject: `${e.subject}（${EVIDENCE_CATEGORY_LABELS[e.category].label}）`,
      source: e.source,
      fetched_at: e.fetched_at,
      confidence: e.confidence,
      quote: e.quote,
    }));

  return (
    <div className="space-y-3">
      {/* 行业切换 + 说明 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {(['光伏能源', '建材'] as const).map((ind) => (
            <button
              key={ind}
              onClick={() => {
                setIndustry(ind);
                setCompare([]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer border ${
                industry === ind
                  ? 'bg-primary-500/15 text-primary-300 border-primary-500/30'
                  : 'text-foreground-500 border-white/10 hover:text-foreground-300'
              }`}
            >
              {ind}（{ind === '光伏能源' ? '东南亚' : '非洲'}）
            </button>
          ))}
        </div>
        <p className="text-foreground-600 text-[10px]">
          评分为分维度展示（母本 7.3.7，无单一黑盒分）· 数据截止 2026-06-28 · 试点范围见 PDR-001
        </p>
      </div>

      {/* 对比区 */}
      {compareList.length >= 2 && (
        <div className="rounded-xl border border-primary-500/15 bg-primary-500/5 p-3 overflow-x-auto">
          <p className="text-primary-300 text-xs font-medium mb-2">
            <i className="ri-scales-3-line mr-1"></i>市场对比（{compareList.length}）
          </p>
          <table className="w-full text-[11px] min-w-[480px]">
            <thead>
              <tr className="text-foreground-600">
                <th className="text-left py-1 pr-2 font-normal">维度</th>
                {compareList.map((c) => (
                  <th key={c.id} className="text-left py-1 pr-2 font-normal">
                    {c.flag} {c.country}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCORE_DIMENSIONS.map((d) => (
                <tr key={d.key} className="border-t border-white/5">
                  <td className="py-1 pr-2 text-foreground-500">{d.label}</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="py-1 pr-2">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-14 h-1.5 rounded bg-white/10 overflow-hidden">
                          <span
                            className={`block h-full ${scoreColor(c.scores[d.key])}`}
                            style={{ width: `${c.scores[d.key]}%` }}
                          ></span>
                        </span>
                        <span className="text-foreground-300">{c.scores[d.key]}</span>
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 候选卡列表 */}
      <div className="space-y-2">
        {list.map((c) => {
          const isOpen = expanded === c.id;
          const sl = SUPPORT_LEVEL_LABELS[c.support_level];
          return (
            <div key={c.id} className="rounded-xl border border-primary-500/10 bg-white/[0.03]">
              {/* 卡头 */}
              <div
                className="flex flex-wrap items-center gap-3 px-4 py-3 cursor-pointer"
                onClick={() => setExpanded(isOpen ? null : c.id)}
              >
                <span className="text-xl">{c.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-white text-sm font-medium">{c.country}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${sl.cls}`}>{sl.label}</span>
                  </div>
                  <p className="text-foreground-500 text-[11px] mt-0.5 truncate">{c.headline}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-lg font-semibold">{avg(c)}</p>
                  <p className="text-foreground-600 text-[9px]">综合（可展开 9 维）</p>
                </div>
                <label
                  className="flex items-center gap-1 text-[10px] text-foreground-500 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={compare.includes(c.id)}
                    onChange={(e) =>
                      setCompare((prev) =>
                        e.target.checked
                          ? [...prev, c.id].slice(-3)
                          : prev.filter((x) => x !== c.id),
                      )
                    }
                  />
                  对比
                </label>
                <i
                  className={`${isOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-foreground-500`}
                ></i>
              </div>

              {/* 展开：9 维评分 + 证据 + 风险 */}
              {isOpen && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3 grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    {SCORE_DIMENSIONS.map((d) => (
                      <div key={d.key} className="flex items-center gap-2 text-[11px]">
                        <span className="w-28 text-foreground-500 shrink-0">{d.label}</span>
                        <span className="flex-1 h-1.5 rounded bg-white/10 overflow-hidden">
                          <span
                            className={`block h-full ${scoreColor(c.scores[d.key])}`}
                            style={{ width: `${c.scores[d.key]}%` }}
                          ></span>
                        </span>
                        <span className="w-7 text-right text-foreground-300">
                          {c.scores[d.key]}
                        </span>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setDrawer({ title: `${c.country} · 评分依据`, items: toEvidenceItems(c) })
                      }
                      className="mt-1 text-[11px] text-primary-400 hover:text-primary-300 cursor-pointer"
                    >
                      <i className="ri-file-search-line mr-1"></i>查看依据（{c.evidences.length}{' '}
                      条证据）
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-foreground-400 text-[11px] font-medium mb-1">
                        证据构成（四分类）
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {c.evidences.map((e) => {
                          const cat = EVIDENCE_CATEGORY_LABELS[e.category];
                          return (
                            <span
                              key={e.id}
                              className={`text-[9px] px-1.5 py-0.5 rounded border ${cat.cls}`}
                              title={e.subject}
                            >
                              {cat.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    {c.risks.length > 0 && (
                      <div>
                        <p className="text-warning text-[11px] font-medium mb-1">风险</p>
                        {c.risks.map((r, i) => (
                          <p key={i} className="text-foreground-500 text-[11px]">
                            · {r}
                          </p>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => onEnterResearch(c)}
                      className="mt-1 px-3 py-1.5 rounded-lg text-xs bg-primary-500/15 text-primary-300 border border-primary-500/30 hover:bg-primary-500/25 cursor-pointer"
                    >
                      进入深度研究 <i className="ri-arrow-right-line"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <EvidenceDrawer
        open={!!drawer}
        onClose={() => setDrawer(null)}
        title={drawer?.title || ''}
        items={drawer?.items || []}
      />
    </div>
  );
}
