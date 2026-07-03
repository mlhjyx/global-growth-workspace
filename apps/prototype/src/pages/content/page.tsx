import { useState, useMemo } from 'react';
import ContentLibrary from './components/ContentLibrary';
import ContentComparison from './components/ContentComparison';
import ContentAI from './components/ContentAI';
import ContentActivityStream from './components/ContentActivity';
import {
  mockContentItems,
  mockLocalizations,
  mockComplianceIssues,
  mockContentAIInsights,
  mockContentActivities,
} from '@/mocks/contentData';

export default function ContentPage() {
  const [selectedContentId, setSelectedContentId] = useState(mockContentItems[0].id);

  const selectedContent = mockContentItems.find(c => c.id === selectedContentId) || mockContentItems[0];

  const contentLocalizations = useMemo(
    () => mockLocalizations.filter(l => l.contentId === selectedContentId),
    [selectedContentId],
  );

  const contentComplianceIssues = useMemo(
    () => mockComplianceIssues.filter(i => i.contentId === selectedContentId),
    [selectedContentId],
  );

  const statusLabel: Record<string, string> = {
    draft: '草稿',
    review: '审核中',
    approved: '已审批',
    published: '已发布',
    archived: '已归档',
  };

  const statusColor: Record<string, string> = {
    draft: 'text-foreground-500',
    review: 'text-warning',
    approved: 'text-info',
    published: 'text-success',
    archived: 'text-foreground-600',
  };

  return (
    <div className="flex flex-col md:h-[calc(100vh-3.5rem)]">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-3 md:px-5 py-2.5 md:py-3 border-b border-primary-500/10 shrink-0 gap-1.5 md:gap-0"
        style={{ background: 'linear-gradient(90deg, rgba(12,10,26,0.8) 0%, rgba(26,16,60,0.6) 100%)' }}
      >
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-white text-base md:text-lg font-semibold">内容中心</h1>
            <p className="text-foreground-500 text-xs mt-0.5">内容管理、本地化适配与合规审查</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 md:gap-4 text-[11px] md:text-xs">
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-file-list-3-line text-xs"></i></span>
            <span>内容总数: <span className="text-foreground-300">{mockContentItems.length}</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-translate text-xs"></i></span>
            <span>本地化条目: <span className="text-foreground-300">{mockLocalizations.length}</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-shield-check-line text-xs"></i></span>
            <span>合规问题: <span className="text-warning">{mockComplianceIssues.filter(i => i.severity === 'critical').length} 严重</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className={`${statusColor[selectedContent.status]} text-[10px] font-medium`}>
              {statusLabel[selectedContent.status]}
            </span>
          </div>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden overflow-y-auto">
        {/* Left: Content Library */}
        <div className="w-full md:w-[280px] flex flex-col border-r border-b md:border-b-0 border-primary-500/10 shrink-0"
          style={{ background: 'linear-gradient(180deg, rgba(12,10,26,0.9) 0%, rgba(26,16,60,0.7) 100%)' }}
        >
          <ContentLibrary
            items={mockContentItems}
            selectedId={selectedContentId}
            onSelect={setSelectedContentId}
          />
        </div>

        {/* Center: Comparison & Compliance */}
        <div className="flex-1 min-w-0 overflow-hidden"
          style={{ background: 'linear-gradient(180deg, rgba(12,10,26,0.7) 0%, rgba(26,16,60,0.4) 100%)' }}
        >
          <ContentComparison
            localizations={contentLocalizations}
            complianceIssues={contentComplianceIssues}
            selectedContentTitle={selectedContent.title}
          />
        </div>

        {/* Right: AI Assistant */}
        <div className="w-full md:w-[300px] flex flex-col border-l border-t md:border-t-0 border-primary-500/10 shrink-0"
          style={{ background: 'linear-gradient(180deg, rgba(12,10,26,0.9) 0%, rgba(26,16,60,0.7) 100%)' }}
        >
          <ContentAI insights={mockContentAIInsights} />
        </div>
      </div>

      {/* Bottom: Activity stream */}
      <div className="h-auto md:h-[160px] min-h-[120px] border-t border-primary-500/10 shrink-0"
        style={{ background: 'linear-gradient(90deg, rgba(12,10,26,0.95) 0%, rgba(26,16,60,0.85) 100%)' }}
      >
        <ContentActivityStream activities={mockContentActivities} />
      </div>
    </div>
  );
}