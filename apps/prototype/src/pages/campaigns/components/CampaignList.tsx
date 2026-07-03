import { useState } from 'react';
import type { Campaign } from '@/mocks/campaignData';

interface CampaignListProps {
  campaigns: Campaign[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const statusConfig = {
  active: { label: '进行中', color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' },
  draft: { label: '草稿', color: 'text-foreground-500', bg: 'bg-foreground-500/10', border: 'border-foreground-500/20' },
  completed: { label: '已完成', color: 'text-info', bg: 'bg-info/10', border: 'border-info/30' },
  paused: { label: '已暂停', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
};

export default function CampaignList({ campaigns, selectedId, onSelect }: CampaignListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = campaigns.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.goal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-primary-500/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground-600 text-xs"></i>
            <input
              type="search"
              placeholder="搜索战役..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 text-xs bg-input-bg border-input-border rounded-md"
            />
          </div>
          <button className="w-7 h-7 flex items-center justify-center rounded-md bg-primary-500/15 text-primary-400 hover:bg-primary-500/25 transition-colors cursor-pointer">
            <i className="ri-add-line text-sm"></i>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.map((campaign) => {
          const isSelected = campaign.id === selectedId;
          const status = statusConfig[campaign.status];
          return (
            <button
              key={campaign.id}
              onClick={() => onSelect(campaign.id)}
              className={`w-full text-left p-2.5 rounded-lg transition-all duration-200 cursor-pointer group
                ${isSelected
                  ? 'bg-primary-500/15 border border-primary-500/25'
                  : 'bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-primary-500/10'
                }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${status.bg} ${status.color} ${status.border} border whitespace-nowrap`}>
                  {status.label}
                </span>
                <span className="text-foreground-600 text-[11px] truncate">{campaign.owner}</span>
              </div>
              <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-foreground-300'}`}>
                {campaign.name}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-300 transition-all duration-500"
                    style={{ width: `${campaign.progress}%` }}
                  ></div>
                </div>
                <span className="text-foreground-600 text-[11px] shrink-0">{campaign.progress}%</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-foreground-600 text-[11px]">
                  <i className="ri-user-line mr-0.5 text-[10px]"></i>{campaign.leads}
                </span>
                <span className="text-foreground-700">·</span>
                <span className="text-foreground-600 text-[11px]">
                  <i className="ri-file-text-line mr-0.5 text-[10px]"></i>{campaign.content}
                </span>
                <span className="text-foreground-700">·</span>
                <span className="text-foreground-600 text-[11px]">
                  {campaign.startDate.slice(5)} → {campaign.endDate.slice(5)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}