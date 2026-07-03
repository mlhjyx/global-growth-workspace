import { useState } from 'react';
import StatsBar from './components/StatsBar';
import NextActionsCard from './components/NextActionsCard';
import ApprovalsCard from './components/ApprovalsCard';
import AnomalyCard from './components/AnomalyCard';
import OpportunityCard from './components/OpportunityCard';
import DailyBriefModal from './components/DailyBriefModal';
import GoalLauncher from './components/GoalLauncher';
import SystemHealthCard from './components/SystemHealthCard';
import { EvidenceDrawer, type EvidenceItem, type ApprovalProposal } from '@/components/governance';
import {
  mockStats,
  mockNextActions,
  mockApprovalProposals,
  mockAnomalies,
  mockOpportunities,
  workspaceName,
  DATA_AS_OF,
} from '@/mocks/todayData';

export default function HomePage() {
  const [briefOpen, setBriefOpen] = useState(false);
  // 页面级共享证据抽屉（母本 6.13：任意 AI 结论/关键字段两次点击内可查依据）
  const [drawer, setDrawer] = useState<{ open: boolean; title: string; items: EvidenceItem[] }>({
    open: false,
    title: '',
    items: [],
  });

  const showEvidence = (title: string, proposal: ApprovalProposal) => {
    setDrawer({ open: true, title, items: proposal.evidence ?? [] });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-white text-xl md:text-2xl font-bold">今日</h1>
          <p className="text-foreground-500 text-sm mt-1">
            {workspaceName} · 数据截止 {DATA_AS_OF}
          </p>
        </div>
        <button
          onClick={() => setBriefOpen(true)}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-sparkling-line"></i>
          </span>
          AI 今日简报
        </button>
      </div>

      {/* Bento grid layout（PG-001 六区：目标启动器/今日重点/审批/异常/机会/系统健康） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        <GoalLauncher />
        <StatsBar stats={mockStats} />
        <NextActionsCard actions={mockNextActions} />
        <ApprovalsCard proposals={mockApprovalProposals} onShowEvidence={showEvidence} />
        <AnomalyCard anomalies={mockAnomalies} />
        <OpportunityCard opportunities={mockOpportunities} />
        <SystemHealthCard />
      </div>

      {briefOpen && <DailyBriefModal onClose={() => setBriefOpen(false)} />}

      <EvidenceDrawer
        open={drawer.open}
        onClose={() => setDrawer((d) => ({ ...d, open: false }))}
        title={drawer.title}
        items={drawer.items}
      />
    </div>
  );
}
