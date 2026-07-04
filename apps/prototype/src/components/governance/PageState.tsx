// PageState —— 母本 6.10 通用页面状态骨架（M0 原型子集）
// Empty：价值+样例+最短下一步；Error：发生了什么/系统做了什么/用户能做什么；Partial：保留成功、单独重试。
// M0-06 T2：恢复动作与单独重试记 error_recover（Gate 1 错误恢复探针）
import { track } from '@/analytics/analytics';
import type { PageStateKind } from './types';

interface PageStateProps {
  kind: PageStateKind;
  title?: string;
  description?: string;
  /** 主恢复动作 */
  action?: { label: string; onClick: () => void };
  /** Partial Success：失败明细 */
  failures?: { item: string; reason: string; onRetry?: () => void }[];
}

const PRESET: Record<PageStateKind, { icon: string; cls: string; defaultTitle: string }> = {
  EMPTY: { icon: 'ri-inbox-line', cls: 'text-foreground-600', defaultTitle: '这里还没有内容' },
  LOADING: { icon: 'ri-loader-4-line', cls: 'text-primary-400', defaultTitle: '正在处理…' },
  ERROR: { icon: 'ri-error-warning-line', cls: 'text-error', defaultTitle: '出错了' },
  PERMISSION: { icon: 'ri-lock-line', cls: 'text-warning', defaultTitle: '没有权限查看' },
  PARTIAL_SUCCESS: {
    icon: 'ri-checkbox-multiple-line',
    cls: 'text-warning',
    defaultTitle: '部分成功',
  },
  NEEDS_REVIEW: { icon: 'ri-eye-line', cls: 'text-warning', defaultTitle: '需要人工确认' },
  NEEDS_ACTION: { icon: 'ri-tools-line', cls: 'text-warning', defaultTitle: '需要处理' },
  BLOCKED: { icon: 'ri-forbid-line', cls: 'text-error', defaultTitle: '已被策略阻断' },
};

export default function PageState({ kind, title, description, action, failures }: PageStateProps) {
  const p = PRESET[kind];
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <i
        className={`${p.icon} text-3xl ${p.cls} ${kind === 'LOADING' ? 'animate-spin inline-block' : ''}`}
      ></i>
      <p className="text-foreground-300 text-sm font-medium mt-3">{title || p.defaultTitle}</p>
      {description && (
        <p className="text-foreground-600 text-xs mt-1.5 max-w-md leading-relaxed">{description}</p>
      )}
      {failures && failures.length > 0 && (
        <div className="mt-3 w-full max-w-md rounded-lg bg-white/[0.03] border border-warning/20 divide-y divide-white/5 text-left">
          {failures.map((f, i) => (
            <div key={i} className="px-3 py-2 flex items-center justify-between gap-2 text-[11px]">
              <div className="min-w-0">
                <span className="text-foreground-300">{f.item}</span>
                <span className="text-foreground-600 ml-1.5">{f.reason}</span>
              </div>
              {f.onRetry && (
                <button
                  onClick={() => {
                    track('error_recover', { kind, item: f.item });
                    f.onRetry?.();
                  }}
                  className="text-primary-400 hover:text-primary-300 cursor-pointer shrink-0"
                >
                  单独重试
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {action && (
        <button
          onClick={() => {
            if (kind === 'ERROR' || kind === 'PARTIAL_SUCCESS') {
              track('error_recover', { kind, action: action.label });
            }
            action.onClick();
          }}
          className="mt-4 px-4 py-2 rounded-lg text-xs bg-primary-500/15 text-primary-300 border border-primary-500/30 hover:bg-primary-500/25 cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
