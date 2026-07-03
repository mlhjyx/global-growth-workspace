// PG-002 Company & Knowledge —— Claim 审核台（EPIC-M0-03 T3，重做原文档库页）
// 母本 7.2：Claim 生命周期 INGESTED→EXTRACTED→NEEDS_REVIEW→APPROVED→EXPIRED/REVOKED（KNW-003）；
// 冲突不静默覆盖（KNW-004）；未审核事实不得用于对外内容（7.2.4 验收）。
import { useMemo, useState } from 'react';
import {
  knowledgeSources,
  claims as fixtureClaims,
  claimEvidences,
  companyProfiles,
} from '@/data/fixtures';
import { EvidenceDrawer, PageState, type EvidenceItem } from '@/components/governance';
import { knowledgeDocs } from '@/mocks/knowledgeData';

const CLAIM_TYPE_LABELS: Record<string, string> = {
  CERTIFICATION: '认证',
  PARAMETER: '参数',
  MOQ: 'MOQ',
  LEAD_TIME: '交期',
  CASE_STUDY: '客户案例',
  COMPLIANCE: '合规',
  FORBIDDEN_EXPRESSION: '禁用表达',
  CAPABILITY: '能力',
  COMPANY_FACT: '企业事实',
};

const STATUS_UI: Record<string, { label: string; cls: string }> = {
  NEEDS_REVIEW: { label: '待审核', cls: 'bg-warning/10 text-warning border-warning/30' },
  APPROVED: { label: '已批准', cls: 'bg-success/10 text-success border-success/30' },
  EXPIRED: { label: '已过期', cls: 'bg-error/10 text-error border-error/30' },
  REVOKED: { label: '已撤销', cls: 'bg-white/5 text-foreground-500 border-white/10' },
};

const FRESHNESS: Record<string, string> = {
  FRESH: 'text-success',
  STALE: 'text-warning',
  EXPIRED: 'text-error',
};

// 冲突演示对（KNW-004）：同一事实两来源不同值
const conflicts = [
  {
    id: 'cf1',
    field: '标准组件 MOQ',
    a: { value: '500 片', source: '官网产品页', date: '2026-05-12' },
    b: { value: '300 片（促销条款）', source: '2025 产品目录 PDF', date: '2025-11-03' },
  },
];

type Tab = 'NEEDS_REVIEW' | 'APPROVED' | 'EXPIRED' | 'ALL';

export default function KnowledgePage() {
  const [tab, setTab] = useState<Tab>('NEEDS_REVIEW');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<{ title: string; items: EvidenceItem[] } | null>(null);
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [conflictChoice, setConflictChoice] = useState<Record<string, string>>({});
  const [helpOpen, setHelpOpen] = useState(false);

  const company = companyProfiles[0];

  const list = useMemo(() => {
    let l = fixtureClaims;
    if (selectedSource) l = l.filter((c) => c.source_id === selectedSource);
    if (tab !== 'ALL') l = l.filter((c) => (decisions[c.id] || c.status) === tab);
    return l;
  }, [tab, selectedSource, decisions]);

  const counts = useMemo(() => {
    const eff = (c: any) => decisions[c.id] || c.status;
    return {
      NEEDS_REVIEW: fixtureClaims.filter((c) => eff(c) === 'NEEDS_REVIEW').length,
      APPROVED: fixtureClaims.filter((c) => eff(c) === 'APPROVED').length,
      EXPIRED: fixtureClaims.filter((c) => eff(c) === 'EXPIRED').length,
    };
  }, [decisions]);

  const openEvidence = (claim: any) => {
    const evs = claimEvidences.filter((e) => e.claim_id === claim.id);
    setDrawer({
      title: claim.statement.slice(0, 40) + '…',
      items: evs.map((e) => ({
        id: e.id,
        subject: `${CLAIM_TYPE_LABELS[claim.claim_type] || claim.claim_type} · ${e.extraction_method}`,
        source: knowledgeSources.find((s) => s.id === e.source_id)?.title || e.source_id,
        fetched_at: e.extracted_at?.slice(0, 10) || '2026-06-01',
        confidence: e.confidence,
        quote: e.snippet,
      })),
    });
  };

  const decide = (id: string, status: string) => setDecisions((p) => ({ ...p, [id]: status }));

  return (
    <div className="flex flex-col md:h-[calc(100vh-3.5rem)]">
      {/* 顶栏 */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between px-3 md:px-5 py-2.5 md:py-3 border-b border-primary-500/10 shrink-0 gap-2"
        style={{
          background: 'linear-gradient(90deg, rgba(12,10,26,0.8) 0%, rgba(26,16,60,0.6) 100%)',
        }}
      >
        <div>
          <h1 className="text-white text-base md:text-lg font-semibold">企业知识 · Claim 审核台</h1>
          <p className="text-foreground-500 text-xs mt-0.5">
            {company?.legal_name || '晶阳新能源'} · 未审核的数字/认证/案例不得用于对外内容（母本
            7.2.4）
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <button onClick={() => setTab('NEEDS_REVIEW')} className="text-warning cursor-pointer">
            待审核 <span className="font-semibold">{counts.NEEDS_REVIEW}</span>
          </button>
          <button onClick={() => setTab('APPROVED')} className="text-success cursor-pointer">
            已批准 <span className="font-semibold">{counts.APPROVED}</span>
          </button>
          <button onClick={() => setTab('EXPIRED')} className="text-error cursor-pointer">
            已过期 <span className="font-semibold">{counts.EXPIRED}</span>
          </button>
          <button
            onClick={() => setHelpOpen(!helpOpen)}
            className="text-foreground-500 hover:text-foreground-300 cursor-pointer"
          >
            <i className="ri-book-open-line"></i> 帮助文档
          </button>
        </div>
      </div>

      {/* 帮助文档（原文档库降级为折叠区，Gap Analysis B 组判定） */}
      {helpOpen && (
        <div className="px-5 py-2 border-b border-white/5 flex flex-wrap gap-2 bg-white/[0.02]">
          {knowledgeDocs.slice(0, 6).map((d) => (
            <span
              key={d.id}
              className="text-[10px] px-2 py-1 rounded bg-white/5 text-foreground-500"
            >
              <i className="ri-file-text-line mr-1"></i>
              {d.title}
            </span>
          ))}
          <span className="text-[10px] text-foreground-700 self-center">
            （帮助中心为独立能力，不占用企业知识主体）
          </span>
        </div>
      )}

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* 左：来源列表（KNW-001） */}
        <aside className="lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-primary-500/10 overflow-y-auto p-3 space-y-1.5">
          <button
            onClick={() => setSelectedSource(null)}
            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs cursor-pointer ${!selectedSource ? 'bg-primary-500/10 text-primary-300' : 'text-foreground-500 hover:bg-white/[0.03]'}`}
          >
            全部来源（{knowledgeSources.length}）
          </button>
          {knowledgeSources.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSource(s.id === selectedSource ? null : s.id)}
              className={`w-full text-left px-2.5 py-2 rounded-lg cursor-pointer ${selectedSource === s.id ? 'bg-primary-500/10' : 'hover:bg-white/[0.03]'}`}
            >
              <p className="text-foreground-300 text-[11px] truncate">{s.title}</p>
              <p className="text-[9px] mt-0.5 text-foreground-600">
                {s.source_type} ·{' '}
                <span className={FRESHNESS[s.freshness_status] || 'text-foreground-500'}>
                  {s.freshness_status === 'FRESH'
                    ? '新鲜'
                    : s.freshness_status === 'STALE'
                      ? '需刷新'
                      : '已过期'}
                </span>
              </p>
            </button>
          ))}
        </aside>

        {/* 中：Claim 审核队列 */}
        <main className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
          {/* 冲突区（KNW-004：不静默覆盖） */}
          {conflicts.map((cf) => (
            <div key={cf.id} className="rounded-xl border border-warning/25 bg-warning/5 p-3.5">
              <p className="text-warning text-xs font-medium mb-2">
                <i className="ri-git-branch-line mr-1"></i>知识冲突：{cf.field}
                （两来源不一致，需人工裁决 · KNW-004）
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[cf.a, cf.b].map((side, i) => (
                  <div
                    key={i}
                    className={`rounded-lg border p-2.5 ${conflictChoice[cf.id] === (i === 0 ? 'a' : 'b') ? 'border-success/40 bg-success/5' : 'border-white/10 bg-white/[0.03]'}`}
                  >
                    <p className="text-foreground-200 text-xs font-medium">{side.value}</p>
                    <p className="text-foreground-600 text-[10px] mt-0.5">
                      {side.source} · {side.date}
                    </p>
                    <button
                      onClick={() =>
                        setConflictChoice((p) => ({ ...p, [cf.id]: i === 0 ? 'a' : 'b' }))
                      }
                      className="mt-1.5 text-[10px] text-primary-400 hover:text-primary-300 cursor-pointer"
                    >
                      {conflictChoice[cf.id] === (i === 0 ? 'a' : 'b')
                        ? '✓ 已选择保留'
                        : '选择保留'}
                    </button>
                  </div>
                ))}
              </div>
              {conflictChoice[cf.id] && (
                <p className="text-success text-[10px] mt-2">
                  已裁决（模拟）· 另一来源标记为 SUPERSEDED，保留审计记录
                </p>
              )}
            </div>
          ))}

          {/* 状态 tab */}
          <div className="flex gap-1.5">
            {(['NEEDS_REVIEW', 'APPROVED', 'EXPIRED', 'ALL'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-2.5 py-1 rounded-lg text-[11px] cursor-pointer border ${tab === t ? 'bg-primary-500/15 text-primary-300 border-primary-500/30' : 'text-foreground-500 border-white/10'}`}
              >
                {t === 'ALL' ? '全部' : STATUS_UI[t].label}
              </button>
            ))}
          </div>

          {/* Claim 列表 */}
          {list.length === 0 ? (
            <PageState
              kind="EMPTY"
              title="该队列暂无 Claim"
              description="导入官网或上传资料后，系统自动提取候选事实进入审核队列（KNW-001/002）"
              action={{ label: '导入来源（模拟）', onClick: () => {} }}
            />
          ) : (
            list.map((c) => {
              const effStatus = decisions[c.id] || c.status;
              const st = STATUS_UI[effStatus] || STATUS_UI.NEEDS_REVIEW;
              const expired = effStatus === 'EXPIRED';
              return (
                <div
                  key={c.id}
                  className="rounded-xl border border-primary-500/10 bg-white/[0.03] p-3.5"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-300 border border-primary-500/20">
                      {CLAIM_TYPE_LABELS[c.claim_type] || c.claim_type}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border ${st.cls}`}>
                      {st.label}
                    </span>
                    <span className="text-[9px] text-foreground-600">
                      置信 {Math.round((c.confidence || 0) * 100)}% · {c.confidentiality_level}
                    </span>
                    {c.valid_until && (
                      <span
                        className={`text-[9px] ${expired ? 'text-error' : 'text-foreground-600'}`}
                      >
                        有效至 {String(c.valid_until).slice(0, 10)}
                      </span>
                    )}
                  </div>
                  <p className="text-foreground-200 text-xs mt-1.5 leading-relaxed">
                    {c.statement}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <button
                      onClick={() => openEvidence(c)}
                      className="text-[10px] text-primary-400 hover:text-primary-300 cursor-pointer"
                    >
                      <i className="ri-file-search-line"></i> 证据（
                      {claimEvidences.filter((e) => e.claim_id === c.id).length}）
                    </button>
                    <span className="text-[9px] text-foreground-600">
                      适用：
                      {(c.applicable_markets?.length ? c.applicable_markets : ['全部市场']).join(
                        '/',
                      )}{' '}
                      · 用途 {(c.allowed_purposes || []).length} 类
                    </span>
                    {effStatus === 'NEEDS_REVIEW' && (
                      <span className="flex gap-1.5 ml-auto">
                        <button
                          onClick={() => decide(c.id, 'APPROVED')}
                          className="px-2 py-1 rounded text-[10px] bg-success/15 text-success border border-success/30 cursor-pointer"
                        >
                          批准
                        </button>
                        <button
                          onClick={() => decide(c.id, 'REVOKED')}
                          className="px-2 py-1 rounded text-[10px] bg-white/5 text-foreground-400 border border-white/10 cursor-pointer"
                        >
                          退回修改
                        </button>
                      </span>
                    )}
                    {effStatus === 'APPROVED' && (
                      <button
                        onClick={() => decide(c.id, 'EXPIRED')}
                        className="ml-auto px-2 py-1 rounded text-[10px] text-foreground-500 hover:text-warning cursor-pointer"
                      >
                        标记过期
                      </button>
                    )}
                    {expired && (
                      <span className="ml-auto text-[10px] text-error">
                        <i className="ri-alert-line"></i> 阻止用于高风险对外内容（KNW-009）
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </main>
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
