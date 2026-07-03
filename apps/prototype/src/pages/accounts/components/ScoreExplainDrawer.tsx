// Score Explain 完整版（EPIC-M0-04 T1，LED-006/010）：六维独立展示 + 权重快照 + 每维证据台账。
// 不给单一黑盒分做解释——解释对象是每个维度的分数、方法与证据贡献。
import type { Account } from '@/mocks/accountData';
import { SCORE_METHOD_LABELS } from '@/mocks/accountData';

interface ScoreExplainDrawerProps {
  account: Account | null;
  /** 打开时聚焦的维度 key；其余维度折叠显示在下方 */
  focusKey?: string | null;
  onClose: () => void;
}

const toDay = (iso?: string) => (iso ? String(iso).slice(0, 10) : '—');

export default function ScoreExplainDrawer({
  account,
  focusKey,
  onClose,
}: ScoreExplainDrawerProps) {
  if (!account) return null;

  // 聚焦维度排最前，其余保持原顺序
  const dims = [...account.dimensions].sort((a, b) =>
    a.key === focusKey ? -1 : b.key === focusKey ? 1 : 0,
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div
        className="relative w-full max-w-[420px] h-full overflow-y-auto border-l border-primary-500/20 p-4"
        style={{
          background: 'linear-gradient(180deg, rgba(12,10,26,0.98) 0%, rgba(26,16,60,0.96) 100%)',
        }}
      >
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-white text-sm font-semibold">评分解释 Score Explain</h3>
            <p className="text-foreground-500 text-[11px] mt-0.5">
              {account.company} · 综合优先级 {account.score}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-foreground-500 hover:text-white cursor-pointer"
            aria-label="关闭"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        <p className="text-foreground-600 text-[10px] mb-3">
          六维独立可解释（LED-006，无单一黑盒分）；综合优先级按当前 ICP 权重快照组合，
          Suppression/硬性排除不参与加权、模型不得覆盖。
        </p>

        {(account.suppressionApplied || account.hardExclusionApplied) && (
          <div className="rounded-lg border border-error/40 bg-error/10 px-3 py-2 mb-3 text-error text-[11px]">
            <i className="ri-forbid-line mr-1"></i>
            {account.suppressionApplied
              ? '命中全局 Suppression（禁止联系）：不进入任何发送队列，解除需人工审批。'
              : '命中硬性排除（LED-007）：综合优先级置 0，模型不得覆盖。'}
          </div>
        )}

        <div className="space-y-3">
          {dims.map((dim) => {
            const weight = account.weightsSnapshot[dim.key];
            const focused = dim.key === focusKey;
            return (
              <div
                key={dim.key}
                className={`rounded-xl border p-3 ${
                  focused
                    ? 'border-primary-500/40 bg-primary-500/5'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-medium">{dim.label}</span>
                  <span className="text-white text-sm font-semibold">{dim.score}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-[10px] text-foreground-600">
                  <span>方法：{SCORE_METHOD_LABELS[dim.method] ?? dim.method}</span>
                  {weight !== undefined && <span>权重：{Math.round(weight * 100)}%</span>}
                  <span>计算于 {toDay(dim.computedAt)}</span>
                  {dim.expiresAt && <span>有效期至 {toDay(dim.expiresAt)}</span>}
                </div>
                <div className="mt-2 space-y-1.5">
                  {dim.evidence.length === 0 && (
                    <p className="text-foreground-700 text-[10px]">
                      无证据条目——该维度不可用于对外解释（LED-010）
                    </p>
                  )}
                  {dim.evidence.map((ev, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-white/[0.03] border border-white/5 px-2.5 py-1.5"
                    >
                      <p className="text-foreground-300 text-[11px]">{ev.description}</p>
                      <div className="flex flex-wrap items-center gap-x-2 mt-0.5 text-[9px] text-foreground-600">
                        <span className="px-1 py-px rounded bg-white/5">{ev.evidenceType}</span>
                        {ev.fieldName && <span className="font-mono">{ev.fieldName}</span>}
                        <span>观测于 {toDay(ev.observedAt)}</span>
                        {ev.contribution !== undefined && (
                          <span
                            className={`ml-auto font-medium ${
                              ev.contribution >= 0 ? 'text-success' : 'text-error'
                            }`}
                          >
                            贡献 {ev.contribution >= 0 ? '+' : ''}
                            {ev.contribution}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-foreground-700 text-[9px] mt-3">
          证据均可追溯到来源与观测时间；过期维度需重算后才能继续用于队列排序（M0 为契约 fixtures
          模拟）。
        </p>
      </div>
    </div>
  );
}
