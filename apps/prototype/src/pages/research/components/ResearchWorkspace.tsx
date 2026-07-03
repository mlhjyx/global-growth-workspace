// PG-004 Market Research Workspace（母本 6.12.2：Brief/问题树/证据/Action Outputs）
import { useState } from 'react';
import {
  activeResearch,
  QUESTION_STATUS_LABELS,
  SUPPORT_LEVEL_LABELS,
  type MarketCandidate,
  type ResearchQuestion,
} from '@/mocks/researchData';
import { EvidenceDrawer, PageState, type EvidenceItem } from '@/components/governance';

const LAYERS = [
  '全球市场筛选',
  '产品与贸易',
  '竞争情报',
  '买家地图',
  '渠道研究',
  '内容与传播',
  '准入与风险',
  '行动计划',
];

interface ResearchWorkspaceProps {
  // 从市场扫描进入时携带的候选市场；null/未传 = 直接打开工作台，展示进行中的研究
  market?: MarketCandidate | null;
}

// 所选市场尚无进行中研究时的草稿态：Brief 取自候选卡，问题树为空（创建后才生成）
const draftResearch = (m: MarketCandidate): typeof activeResearch => ({
  ...activeResearch,
  id: `rp_draft_${m.id}`,
  market_id: m.id,
  title: `${m.country}${m.industry}市场深度研究（未创建）`,
  brief: {
    offering: activeResearch.brief.offering,
    market: `${m.flag} ${m.country}（${SUPPORT_LEVEL_LABELS[m.support_level].label}）`,
    depth: '待选择',
    budget_used: '未消耗',
    started_at: '—',
  },
  progress: { answered: 0, total: 0 },
  data_as_of: m.data_as_of,
  questions: [] as ResearchQuestion[],
  action_outputs: [],
});

export default function ResearchWorkspace({ market }: ResearchWorkspaceProps) {
  const isDraft = !!market && market.id !== activeResearch.market_id;
  const r = isDraft && market ? draftResearch(market) : activeResearch;
  const [openLayers, setOpenLayers] = useState<string[]>(['准入与风险', '行动计划']);
  const [drawer, setDrawer] = useState<ResearchQuestion | null>(null);
  const [outputs, setOutputs] = useState(r.action_outputs);

  const toggle = (l: string) =>
    setOpenLayers((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));

  const mockEvidence = (q: ResearchQuestion): EvidenceItem[] =>
    Array.from({ length: q.evidence_count }, (_, i) => ({
      id: `${q.id}_ev${i}`,
      subject: `${q.question} · 证据 ${i + 1}`,
      source: i % 2 === 0 ? '贸易数据（样例）' : '公开来源（样例）',
      fetched_at: '2026-06-30',
      confidence: 0.6 + (i % 3) * 0.1,
    }));

  const runOutput = (id: string) =>
    setOutputs((prev) => prev.map((o) => (o.id === id ? { ...o, done: true } : o)));

  return (
    <div className="grid lg:grid-cols-3 gap-3">
      {/* 左：Brief + 进度 */}
      <div className="space-y-3">
        <div className="rounded-xl border border-primary-500/10 bg-white/[0.03] p-4">
          <p className="text-white text-sm font-semibold">{r.title}</p>
          <div className="mt-2 space-y-1 text-[11px]">
            <p className="text-foreground-500">
              产品：<span className="text-foreground-300">{r.brief.offering}</span>
            </p>
            <p className="text-foreground-500">
              市场：<span className="text-foreground-300">{r.brief.market}</span>
            </p>
            <p className="text-foreground-500">
              深度：<span className="text-foreground-300">{r.brief.depth}</span>
            </p>
            <p className="text-foreground-500">
              研究成本：<span className="text-foreground-300">{r.brief.budget_used}</span>
            </p>
            <p className="text-foreground-600 text-[10px] mt-1.5">
              开始于 {r.brief.started_at} · 数据截止 {r.data_as_of}
            </p>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-foreground-500 mb-1">
              <span>问题树进度</span>
              <span>
                {r.progress.answered}/{r.progress.total}
              </span>
            </div>
            <div className="h-1.5 rounded bg-white/10 overflow-hidden">
              <span
                className="block h-full bg-primary-400/70"
                style={{
                  width: `${r.progress.total ? (r.progress.answered / r.progress.total) * 100 : 0}%`,
                }}
              ></span>
            </div>
          </div>
        </div>

        {/* Action Outputs（研究不止于报告，母本 7.3.9） */}
        <div className="rounded-xl border border-primary-500/15 bg-primary-500/5 p-4">
          <p className="text-primary-300 text-xs font-medium mb-2">
            <i className="ri-flashlight-line mr-1"></i>可执行输出（Action Outputs）
          </p>
          {outputs.length === 0 && (
            <p className="text-foreground-600 text-[10px]">
              研究推进后生成可执行输出（转 ICP / Lead / Campaign 草案）
            </p>
          )}
          <div className="space-y-2">
            {outputs.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-foreground-200 text-[11px]">{o.label}</p>
                  <p className="text-foreground-600 text-[10px] truncate">{o.desc}</p>
                </div>
                {o.done ? (
                  <span className="text-success text-[10px] shrink-0">
                    <i className="ri-checkbox-circle-line"></i> 已创建
                  </span>
                ) : (
                  <button
                    onClick={() => runOutput(o.id)}
                    className="shrink-0 px-2 py-1 rounded text-[10px] bg-primary-500/15 text-primary-300 border border-primary-500/30 hover:bg-primary-500/25 cursor-pointer"
                  >
                    创建
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-foreground-700 text-[9px] mt-2">
            （模拟）创建后进入对应模块草稿，非直接执行
          </p>
        </div>
      </div>

      {/* 中+右：问题树 */}
      <div className="lg:col-span-2 rounded-xl border border-primary-500/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white text-sm font-semibold">研究问题树（八层模型，母本 7.3.6）</p>
          <span className="text-[10px] text-warning">
            {r.questions.filter((q) => q.status === 'NEEDS_EXPERT').length} 项需专家确认
          </span>
        </div>
        {r.questions.length === 0 ? (
          <PageState
            kind="EMPTY"
            description={
              isDraft && market
                ? `${market.country} 尚未创建深度研究：创建后按八层模型生成问题树（模拟环境以越南研究为进行中示例）`
                : '创建研究后自动生成结构化问题树'
            }
          />
        ) : (
          <div className="space-y-1.5">
            {LAYERS.map((layer) => {
              const qs = r.questions.filter((q) => q.layer === layer);
              if (qs.length === 0) return null;
              const open = openLayers.includes(layer);
              return (
                <div key={layer} className="rounded-lg border border-white/5">
                  <button
                    onClick={() => toggle(layer)}
                    className="w-full flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <span className="text-foreground-300 text-xs font-medium">{layer}</span>
                    <span className="flex items-center gap-2 text-[10px] text-foreground-600">
                      {qs.filter((q) => q.status === 'ANSWERED').length}/{qs.length}
                      <i className={open ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}></i>
                    </span>
                  </button>
                  {open && (
                    <div className="border-t border-white/5 divide-y divide-white/5">
                      {qs.map((q) => {
                        const st = QUESTION_STATUS_LABELS[q.status];
                        return (
                          <div key={q.id} className="px-3 py-2">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-foreground-300 text-[11px] flex-1">{q.question}</p>
                              <span className={`text-[10px] shrink-0 ${st.cls}`}>{st.label}</span>
                            </div>
                            {q.conclusion && (
                              <p className="text-foreground-500 text-[10px] mt-0.5">
                                → {q.conclusion}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-1">
                              {q.evidence_count > 0 && (
                                <button
                                  onClick={() => setDrawer(q)}
                                  className="text-[10px] text-primary-400 hover:text-primary-300 cursor-pointer"
                                >
                                  <i className="ri-file-search-line"></i> 证据 {q.evidence_count}
                                </button>
                              )}
                              {q.status === 'NEEDS_EXPERT' && (
                                <span className="text-[10px] text-warning">
                                  <i className="ri-user-star-line"></i>{' '}
                                  已生成专家请求候选（EXP-002，模拟）
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <EvidenceDrawer
        open={!!drawer}
        onClose={() => setDrawer(null)}
        title={drawer?.question || ''}
        items={drawer ? mockEvidence(drawer) : []}
      />
    </div>
  );
}
