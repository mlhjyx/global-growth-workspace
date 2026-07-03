import { useState } from 'react';
import KPIBar from './components/KPIBar';
import TrendChart from './components/TrendChart';
import AttributionModel from './components/AttributionModel';
import ChannelBreakdown from './components/ChannelBreakdown';
import ReportGenerator from './components/ReportGenerator';
import InsightsAI from './components/InsightsAI';
import EventStream from './components/EventStream';
import {
  mockKPIs,
  mockTrendData,
  mockAttributionChannels,
  mockChannelPerformance,
  mockReportTemplates,
  mockAIInsights,
  mockEventStream,
} from '@/mocks/insightsData';

export default function InsightsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30天');

  return (
    <div className="flex flex-col md:h-[calc(100vh-3.5rem)]">
      {/* Top bar: KPI overview + time selector */}
      <KPIBar
        kpis={mockKPIs}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      {/* Main content: full-screen dashboard grid */}
      <div className="flex-1 md:overflow-hidden overflow-y-auto">
        <div className="md:h-full flex flex-col md:flex-row gap-4 p-4 overflow-y-auto">
          {/* Left column: Trend + Channel Breakdown */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Trend chart - large */}
            <div className="h-[280px] md:h-[320px] shrink-0">
              <TrendChart data={mockTrendData} />
            </div>
            {/* Channel breakdown */}
            <div className="flex-1 min-h-[300px]">
              <ChannelBreakdown channels={mockChannelPerformance} />
            </div>
          </div>

          {/* Right column: Attribution + Report + AI Insights */}
          <div className="w-full md:w-[380px] shrink-0 flex flex-col gap-4">
            {/* Attribution model */}
            <div className="h-[300px] md:h-[340px] shrink-0">
              <AttributionModel channels={mockAttributionChannels} />
            </div>
            {/* Report generator + AI insights split */}
            <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto">
                <ReportGenerator templates={mockReportTemplates} />
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                <InsightsAI insights={mockAIInsights} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Event stream */}
      <div className="h-auto md:h-[180px] min-h-[140px] shrink-0">
        <EventStream events={mockEventStream} />
      </div>
    </div>
  );
}