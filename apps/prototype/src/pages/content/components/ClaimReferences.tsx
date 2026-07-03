// 内容 Claim 引用条（EPIC-M0-04 T3，KNW-003/006 + CRT 验收）：
// 关键说法必须引用 Approved Claim；EXPIRED/NEEDS_REVIEW 的引用阻断发布。
import { claims } from '@/data/fixtures';

const STATUS_UI: Record<string, { label: string; cls: string }> = {
  APPROVED: { label: '已批准', cls: 'bg-success/10 text-success border-success/30' },
  NEEDS_REVIEW: { label: '待审核', cls: 'bg-warning/10 text-warning border-warning/30' },
  EXPIRED: { label: '已过期', cls: 'bg-error/10 text-error border-error/30' },
};

// 模拟关联：按 contentId 确定性取 3 条 fixtures Claim（M1 由内容-Claim 关联表提供真实引用）
const pickClaims = (contentId: string) => {
  let h = 0;
  for (const ch of contentId) h = (h * 31 + ch.charCodeAt(0)) % 997;
  const start = h % Math.max(claims.length - 3, 1);
  return claims.slice(start, start + 3);
};

interface ClaimReferencesProps {
  contentId: string;
}

export default function ClaimReferences({ contentId }: ClaimReferencesProps) {
  const refs = pickClaims(contentId);
  const blocked = refs.filter((c) => c.status !== 'APPROVED');

  return (
    <div className="px-3 md:px-5 py-2 border-b border-primary-500/10 shrink-0 bg-white/[0.015]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-foreground-500 text-[10px] font-medium">
          <i className="ri-double-quotes-l mr-1"></i>事实引用 Claim（模拟关联）
        </span>
        {refs.map((c) => {
          const st = STATUS_UI[c.status] ?? {
            label: c.status,
            cls: 'bg-white/5 text-foreground-500 border-white/10',
          };
          return (
            <span
              key={c.id}
              title={c.statement}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] ${st.cls}`}
            >
              <span className="max-w-[220px] truncate">{c.statement}</span>
              <span className="shrink-0">· {st.label}</span>
            </span>
          );
        })}
        {blocked.length > 0 ? (
          <span className="text-error text-[10px] ml-auto">
            <i className="ri-forbid-line mr-1"></i>
            {blocked.length} 条引用非 Approved：该内容不能进入发布/审批（KNW-003）
          </span>
        ) : (
          <span className="text-success text-[10px] ml-auto">
            <i className="ri-checkbox-circle-line mr-1"></i>引用全部为 Approved，可进入审批
          </span>
        )}
      </div>
    </div>
  );
}
