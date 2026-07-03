import { useState } from 'react';
import StatsBar from './components/StatsBar';
import NextActionsCard from './components/NextActionsCard';
import ApprovalsCard from './components/ApprovalsCard';
import AnomalyCard from './components/AnomalyCard';
import OpportunityCard from './components/OpportunityCard';
import DailyBriefModal from './components/DailyBriefModal';
import { mockStats, mockNextActions, mockPendingApprovals, mockAnomalies, mockOpportunities } from '@/mocks/todayData';

export default function Home() {
  const [showBrief, setShowBrief] = useState(false);
  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const hour = today.getHours();
  const greeting = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';

  const handleExportDaily = () => {
    const text = [
      `GrowthOS 日报 - ${dateStr}`,
      '',
      '=== 核心指标 ===',
      ...mockStats.map(s => `${s.label}: ${s.value} (${s.change})`),
      '',
      '=== 待办事项 ===',
      ...mockNextActions.map(a => `[${a.priority === 'high' ? '高' : a.priority === 'medium' ? '中' : '低'}] ${a.title}`),
      '',
      '=== 待审批 ===',
      ...mockPendingApprovals.map(a => `- ${a.title} (提交人: ${a.submittedBy})`),
      '',
      '=== 异常告警 ===',
      ...mockAnomalies.map(a => `[${a.severity === 'critical' ? '严重' : a.severity === 'warning' ? '警告' : '提示'}] ${a.title}`),
      '',
      '=== 机会信号 ===',
      ...mockOpportunities.map(o => `- ${o.company} (${o.score}分) ${o.signal}: ${o.signalDetail}`),
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      alert('日报内容已复制到剪贴板');
    }).catch(() => {
      alert('复制失败，请手动复制');
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1400px] mx-auto">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
        <div>
          <h1 className="text-white text-xl font-semibold">
            {greeting}，<span className="text-primary-400">Leo</span>
          </h1>
          <p className="text-foreground-500 text-sm mt-0.5">{dateStr} · 今日待办 {mockNextActions.length} 项</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportDaily} className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-sm cursor-pointer">
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-download-line text-sm"></i>
            </span>
            导出日报
          </button>
          <button onClick={() => setShowBrief(true)} className="btn-primary flex items-center gap-1.5 px-4 py-2 text-sm cursor-pointer">
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-robot-2-line text-sm"></i>
            </span>
            生成今日简报
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <StatsBar stats={mockStats} />

      {/* Main content: 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column: Next Actions + Anomaly */}
        <div className="flex flex-col gap-4">
          <NextActionsCard actions={mockNextActions} />
          <AnomalyCard anomalies={mockAnomalies} />
        </div>

        {/* Right column: Approvals + Opportunities */}
        <div className="flex flex-col gap-4">
          <ApprovalsCard approvals={mockPendingApprovals} />
          <OpportunityCard opportunities={mockOpportunities} />
        </div>
      </div>

      {/* Daily Brief Modal */}
      {showBrief && <DailyBriefModal onClose={() => setShowBrief(false)} />}
    </div>
  );
}