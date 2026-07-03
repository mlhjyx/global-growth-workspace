// Suppression 视图（EPIC-M0-04 T1，LED-007/DAT-006）：全局禁止联系与硬性排除名单。
// 硬约束语义：评分与模型不得覆盖；解除属默认人工审批项（OPEN DECISION 8 / OD-08）。
import type { Account } from '@/mocks/accountData';

interface SuppressionViewProps {
  open: boolean;
  accounts: Account[];
  onClose: () => void;
}

// M0 模拟原因（真实实现来自 suppression 记录的 reason_code）
const SUPPRESSION_REASONS = [
  '收到退订请求（UNSUBSCRIBE）',
  '投诉记录（COMPLAINT）',
  '法务名单（LEGAL_LIST）',
];

export default function SuppressionView({ open, accounts, onClose }: SuppressionViewProps) {
  if (!open) return null;

  const suppressedAccounts = accounts.filter((a) => a.suppressionApplied);
  const excludedAccounts = accounts.filter((a) => a.hardExclusionApplied && !a.suppressionApplied);
  const suppressedContacts = accounts.flatMap((a) =>
    a.contacts.filter((c) => c.suppressed).map((c) => ({ account: a, contact: c })),
  );

  const rows = [
    ...suppressedAccounts.map((a, i) => ({
      key: a.id,
      name: a.company,
      kind: '账户',
      mechanism: '全局 Suppression（禁止联系）',
      mechanismCls: 'bg-error/10 text-error',
      reason: SUPPRESSION_REASONS[i % SUPPRESSION_REASONS.length],
    })),
    ...suppressedContacts.map(({ account, contact }, i) => ({
      key: contact.id,
      name: `${contact.name}（${account.company}）`,
      kind: '联系人',
      mechanism: '全局 Suppression（禁止联系）',
      mechanismCls: 'bg-error/10 text-error',
      reason: SUPPRESSION_REASONS[(i + 1) % SUPPRESSION_REASONS.length],
    })),
    ...excludedAccounts.map((a) => ({
      key: a.id,
      name: a.company,
      kind: '账户',
      mechanism: '硬性排除（LED-007）',
      mechanismCls: 'bg-warning/10 text-warning',
      reason: '命中 ICP Exclude 条件（业务拒绝），综合优先级置 0',
    })),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div
        className="relative w-full max-w-[600px] max-h-[80vh] overflow-y-auto rounded-2xl border border-error/30 p-4"
        style={{
          background: 'linear-gradient(180deg, rgba(12,10,26,0.98) 0%, rgba(26,16,60,0.96) 100%)',
        }}
      >
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-white text-sm font-semibold">
            <i className="ri-forbid-line text-error mr-1.5"></i>
            Suppression 与硬性排除名单
          </h3>
          <button
            onClick={onClose}
            className="text-foreground-500 hover:text-white cursor-pointer"
            aria-label="关闭"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        <p className="text-foreground-600 text-[10px] mb-3">
          全局硬约束：名单内对象不进入任何发送/外联队列，评分与模型不得覆盖；
          解除属默认人工审批项（母本 OPEN DECISION 8）。
        </p>

        {rows.length === 0 ? (
          <p className="text-foreground-600 text-xs py-6 text-center">当前名单为空</p>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-white/10 text-foreground-600">
                  <th className="px-3 py-2 font-medium">对象</th>
                  <th className="px-3 py-2 font-medium">类型</th>
                  <th className="px-3 py-2 font-medium">机制</th>
                  <th className="px-3 py-2 font-medium">原因</th>
                  <th className="px-3 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} className="border-b border-white/5">
                    <td className="px-3 py-2 text-foreground-300">{r.name}</td>
                    <td className="px-3 py-2 text-foreground-500">{r.kind}</td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${r.mechanismCls}`}>
                        {r.mechanism}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-foreground-500">{r.reason}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        disabled
                        title="解除需人工审批（M0 不提供该操作）"
                        className="px-2 py-0.5 rounded text-[10px] text-foreground-600 border border-white/10 cursor-not-allowed"
                      >
                        申请解除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-foreground-700 text-[9px] mt-3">
          M0 模拟：名单来自 fixtures 的 suppression/硬性排除标记；原因码为演示样例。
          真实实现中每条记录带来源、生效时间与审计链（DAT-006）。
        </p>
      </div>
    </div>
  );
}
