// EvidenceDrawer —— 母本 6.13：任何 AI 结论/关键字段两次点击内可查看依据（KNW-006、4.4 可解释）
import { useEffect } from 'react';
import type { EvidenceItem } from './types';
import { ConfidenceBadge } from './Badges';

interface EvidenceDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  items: EvidenceItem[];
}

export default function EvidenceDrawer({ open, onClose, title, items }: EvidenceDrawerProps) {
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose}></div>
      <aside
        className="fixed right-0 top-0 h-screen w-full sm:w-[380px] z-[70] flex flex-col border-l border-primary-500/15 animate-fade-in"
        style={{
          background: 'linear-gradient(160deg, rgba(18,14,40,0.99) 0%, rgba(26,16,60,0.99) 100%)',
          backdropFilter: 'blur(20px)',
        }}
        role="dialog"
        aria-label="证据抽屉"
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-primary-500/10 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <i className="ri-file-search-line text-primary-400"></i>
            <div className="min-w-0">
              <h3 className="text-white text-sm font-semibold truncate">证据与来源</h3>
              <p className="text-foreground-600 text-[10px] truncate">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground-500 hover:text-white hover:bg-white/5 cursor-pointer"
            aria-label="关闭"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
          {items.length === 0 && (
            <div className="text-center py-10">
              <i className="ri-inbox-line text-2xl text-foreground-700"></i>
              <p className="text-foreground-500 text-xs mt-2">暂无证据记录</p>
              <p className="text-foreground-700 text-[10px] mt-1">
                无证据支持的说法不得用于对外内容（母本 KNW 域验收）
              </p>
            </div>
          )}
          {items.map((ev) => {
            const expired = ev.expires_at && new Date(ev.expires_at) < new Date('2026-07-03');
            return (
              <div
                key={ev.id}
                className="rounded-lg border border-primary-500/10 bg-white/[0.03] p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-foreground-200 text-xs font-medium flex-1">{ev.subject}</p>
                  <ConfidenceBadge value={ev.confidence} />
                </div>
                {ev.quote && (
                  <p className="mt-1.5 text-foreground-500 text-[11px] border-l-2 border-primary-500/30 pl-2 italic">
                    “{ev.quote}”
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-foreground-600">
                  <span className="inline-flex items-center gap-1">
                    <i className="ri-database-2-line"></i>
                    {ev.source_url ? (
                      <a
                        href={ev.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-400 hover:underline"
                      >
                        {ev.source}
                      </a>
                    ) : (
                      ev.source
                    )}
                  </span>
                  <span>抓取 {ev.fetched_at.slice(0, 10)}</span>
                  {ev.expires_at && (
                    <span className={expired ? 'text-error' : ''}>
                      {expired ? '已过期' : `有效至 ${ev.expires_at.slice(0, 10)}`}
                    </span>
                  )}
                </div>
                {(ev.allowed_to_display === false ||
                  ev.allowed_to_export === false ||
                  ev.allowed_for_outreach === false) && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5 text-[9px]">
                    {ev.allowed_to_display === false && (
                      <span className="px-1 py-0.5 rounded bg-error/10 text-error">展示受限</span>
                    )}
                    {ev.allowed_to_export === false && (
                      <span className="px-1 py-0.5 rounded bg-warning/10 text-warning">
                        禁止导出
                      </span>
                    )}
                    {ev.allowed_for_outreach === false && (
                      <span className="px-1 py-0.5 rounded bg-warning/10 text-warning">
                        禁止外联
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-4 py-2.5 border-t border-primary-500/10 text-[10px] text-foreground-600 shrink-0">
          字段级来源与数据权利见母本 DAT-005/006；本抽屉为 M0 模拟数据。
        </div>
      </aside>
    </>
  );
}
