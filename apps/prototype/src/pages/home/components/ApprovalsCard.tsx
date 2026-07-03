// Today 审批区 —— 硬边界 1 界面载体（母本 6.12.1）。接入治理组件库 ApprovalCard。
import type { ApprovalProposal } from '@/components/governance';
import { ApprovalCard, PageState } from '@/components/governance';

interface ApprovalsCardProps {
  proposals: ApprovalProposal[];
  onShowEvidence: (title: string, proposal: ApprovalProposal) => void;
}

export default function ApprovalsCard({ proposals, onShowEvidence }: ApprovalsCardProps) {
  const pending = proposals.filter((p) => p.status === 'PENDING');

  return (
    <div className="glass-card p-4 md:p-5 flex flex-col gap-3 md:gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center text-warning">
            <i className="ri-timer-line text-lg"></i>
          </span>
          <h3 className="text-white font-semibold text-sm">待审批</h3>
          <span className="badge-warning text-[11px]">{pending.length} 项</span>
        </div>
        <button className="text-xs text-link-color hover:text-primary-300 transition-colors cursor-pointer whitespace-nowrap">
          全部审批
        </button>
      </div>

      {proposals.length === 0 ? (
        <PageState
          kind="EMPTY"
          title="暂无待审批动作"
          description="对外发送、发布、数据导出和跨境调用会在此汇总，逐项审批后才会执行。"
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {proposals.map((p) => (
            <ApprovalCard
              key={p.id}
              proposal={p}
              onShowEvidence={(proposal) => onShowEvidence(proposal.title, proposal)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
