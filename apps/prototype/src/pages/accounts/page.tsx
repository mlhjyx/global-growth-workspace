import { useState } from 'react';
import ICPBuilder from './components/ICPBuilder';
import ProspectList from './components/ProspectList';
import ProspectAI from './components/ProspectAI';
import SignalStream from './components/SignalStream';
import { mockICPs, mockAccounts, mockSignalEvents, mockDataQuality, mockAIInsights } from '@/mocks/accountData';

export default function AccountsPage() {
  const [selectedICPId, setSelectedICPId] = useState(mockICPs[0].id);

  return (
    <div className="flex flex-col md:h-[calc(100vh-3.5rem)]">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-3 md:px-5 py-2.5 md:py-3 border-b border-primary-500/10 shrink-0 gap-1.5 md:gap-0"
        style={{ background: 'linear-gradient(90deg, rgba(12,10,26,0.8) 0%, rgba(26,16,60,0.6) 100%)' }}
      >
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-white text-base md:text-lg font-semibold">客户发现</h1>
            <p className="text-foreground-500 text-xs mt-0.5">基于 ICP 发现、评分和跟踪潜客</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 md:gap-4 text-[11px] md:text-xs">
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-user-search-line text-xs"></i></span>
            <span>活跃 ICP: <span className="text-foreground-300">{mockICPs.filter(i => i.active).length}</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-building-line text-xs"></i></span>
            <span>潜客: <span className="text-foreground-300">{mockAccounts.length}</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center"><i className="ri-radar-line text-xs"></i></span>
            <span>今日信号: <span className="text-foreground-300">{mockSignalEvents.filter(s => !s.read).length}</span></span>
          </div>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden overflow-y-auto">
        {/* Left: ICP Builder */}
        <div className="w-full md:w-[280px] flex flex-col border-r border-b md:border-b-0 border-primary-500/10 shrink-0"
          style={{ background: 'linear-gradient(180deg, rgba(12,10,26,0.9) 0%, rgba(26,16,60,0.7) 100%)' }}
        >
          <ICPBuilder
            icps={mockICPs}
            selectedICPId={selectedICPId}
            onSelectICP={setSelectedICPId}
          />
        </div>

        {/* Center: Prospect List */}
        <div className="flex-1 min-w-0 overflow-hidden"
          style={{ background: 'linear-gradient(180deg, rgba(12,10,26,0.7) 0%, rgba(26,16,60,0.4) 100%)' }}
        >
          <ProspectList accounts={mockAccounts} />
        </div>

        {/* Right: AI Assistant */}
        <div className="w-full md:w-[300px] flex flex-col border-l border-t md:border-t-0 border-primary-500/10 shrink-0"
          style={{ background: 'linear-gradient(180deg, rgba(12,10,26,0.9) 0%, rgba(26,16,60,0.7) 100%)' }}
        >
          <ProspectAI insights={mockAIInsights} />
        </div>
      </div>

      {/* Bottom: Signal Stream */}
      <div className="h-auto md:h-[160px] min-h-[120px] border-t border-primary-500/10 shrink-0"
        style={{ background: 'linear-gradient(90deg, rgba(12,10,26,0.95) 0%, rgba(26,16,60,0.85) 100%)' }}
      >
        <SignalStream signals={mockSignalEvents} dataQuality={mockDataQuality} />
      </div>
    </div>
  );
}