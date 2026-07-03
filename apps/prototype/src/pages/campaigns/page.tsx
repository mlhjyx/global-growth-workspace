import { useState } from 'react';
import CampaignList from './components/CampaignList';
import CampaignStages from './components/CampaignStages';
import CampaignBoard from './components/CampaignBoard';
import AIAssistantPanel from './components/AIAssistantPanel';
import ActivityStream from './components/ActivityStream';
import {
  mockCampaigns,
  mockStages,
  mockActivities,
  mockAIInsights,
  CAMPAIGN_STATUS_UI,
  formatMoney,
} from '@/mocks/campaignData';

export default function CampaignsPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState(mockCampaigns[0].id);
  const [selectedStageId, setSelectedStageId] = useState(mockStages[1].id);

  const selectedCampaign =
    mockCampaigns.find((c) => c.id === selectedCampaignId) || mockCampaigns[0];
  const statusUI = CAMPAIGN_STATUS_UI[selectedCampaign.status];

  return (
    <div className="flex flex-col md:h-[calc(100vh-3.5rem)]">
      {/* Top bar: campaign info */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between px-3 md:px-5 py-2.5 md:py-3 border-b border-primary-500/10 shrink-0 gap-1.5 md:gap-0"
        style={{
          background: 'linear-gradient(90deg, rgba(12,10,26,0.8) 0%, rgba(26,16,60,0.6) 100%)',
        }}
      >
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white text-base md:text-lg font-semibold">
                {selectedCampaign.name}
              </h1>
              <span className={`text-xs ${statusUI.color}`}>{statusUI.label}</span>
            </div>
            <p className="text-foreground-500 text-xs mt-0.5">{selectedCampaign.goal}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 md:gap-4 text-[11px] md:text-xs">
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <i className="ri-user-3-line text-xs"></i>
            </span>
            <span>
              负责人: <span className="text-foreground-300">{selectedCampaign.owner}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-xs"></i>
            </span>
            <span>
              预算:{' '}
              <span className="text-foreground-300">
                {formatMoney(selectedCampaign.budget.total)}
              </span>
              {selectedCampaign.budget.consumed && (
                <span>
                  {' '}
                  · 已消耗{' '}
                  <span className="text-warning">
                    {formatMoney(selectedCampaign.budget.consumed)}
                  </span>
                </span>
              )}
              {selectedCampaign.budget.hardCap && (
                <span>
                  {' '}
                  · 硬上限{' '}
                  <span className="text-foreground-300">
                    {formatMoney(selectedCampaign.budget.hardCap)}
                  </span>
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <i className="ri-calendar-line text-xs"></i>
            </span>
            <span>
              {selectedCampaign.startDate} → {selectedCampaign.endDate}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-300"
                style={{ width: `${selectedCampaign.progress}%` }}
              ></div>
            </div>
            <span className="text-primary-400 text-xs font-medium">
              {selectedCampaign.progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden overflow-y-auto">
        {/* Left column: Campaign selector + Stages */}
        <div
          className="w-full md:w-[280px] flex flex-col border-r border-b md:border-b-0 border-primary-500/10 shrink-0"
          style={{
            background: 'linear-gradient(180deg, rgba(12,10,26,0.9) 0%, rgba(26,16,60,0.7) 100%)',
          }}
        >
          {/* Campaign selector */}
          <div className="md:h-[45%] min-h-[200px] overflow-hidden">
            <CampaignList
              campaigns={mockCampaigns}
              selectedId={selectedCampaignId}
              onSelect={(id) => {
                setSelectedCampaignId(id);
                setSelectedStageId(mockStages[0].id);
              }}
            />
          </div>
          {/* Divider */}
          <div className="shrink-0 px-3 py-1.5 flex items-center gap-2 bg-primary-500/[0.03] border-y border-primary-500/[0.08]">
            <span className="w-1 h-1 rounded-full bg-primary-400/60"></span>
            <span className="text-foreground-600 text-[10px] uppercase tracking-wider font-medium">
              Campaign 计划项
            </span>
          </div>
          {/* Stage navigator */}
          <div className="flex-1 overflow-hidden">
            <CampaignStages
              stages={mockStages}
              selectedStageId={selectedStageId}
              onSelectStage={setSelectedStageId}
            />
          </div>
        </div>

        {/* Center column: Board */}
        <div
          className="flex-1 min-w-0 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(12,10,26,0.7) 0%, rgba(26,16,60,0.4) 100%)',
          }}
        >
          <CampaignBoard
            stages={mockStages}
            selectedStageId={selectedStageId}
            onSelectStage={setSelectedStageId}
          />
        </div>

        {/* Right column: AI Assistant */}
        <div
          className="w-full md:w-[300px] flex flex-col border-l border-t md:border-t-0 border-primary-500/10 shrink-0"
          style={{
            background: 'linear-gradient(180deg, rgba(12,10,26,0.9) 0%, rgba(26,16,60,0.7) 100%)',
          }}
        >
          <AIAssistantPanel insights={mockAIInsights} />
        </div>
      </div>

      {/* Bottom: Activity stream */}
      <div
        className="h-auto md:h-[160px] min-h-[120px] border-t border-primary-500/10 shrink-0"
        style={{
          background: 'linear-gradient(90deg, rgba(12,10,26,0.95) 0%, rgba(26,16,60,0.85) 100%)',
        }}
      >
        <ActivityStream activities={mockActivities} />
      </div>
    </div>
  );
}
