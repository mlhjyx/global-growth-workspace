import { useState } from 'react';
import type { CampaignStage } from '@/mocks/campaignData';

interface CampaignStagesProps {
  stages: CampaignStage[];
  selectedStageId: string;
  onSelectStage: (id: string) => void;
}

const statusIcon: Record<string, string> = {
  completed: 'ri-check-line',
  in_progress: 'ri-loader-4-line',
  pending: 'ri-circle-line',
};

const statusColor: Record<string, string> = {
  completed: 'text-success',
  in_progress: 'text-primary-400',
  pending: 'text-foreground-600',
};

export default function CampaignStages({ stages, selectedStageId, onSelectStage }: CampaignStagesProps) {
  const [expandedStages, setExpandedStages] = useState<string[]>(
    stages.filter(s => s.status !== 'pending').map(s => s.id)
  );

  const toggleExpand = (id: string) => {
    setExpandedStages(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-2 space-y-1">
        {stages.map((stage) => {
          const isExpanded = expandedStages.includes(stage.id);
          const isSelected = stage.id === selectedStageId;
          const completedTasks = stage.tasks.filter(t => t.status === 'completed').length;
          return (
            <div key={stage.id}>
              <button
                onClick={() => {
                  onSelectStage(stage.id);
                  toggleExpand(stage.id);
                }}
                className={`w-full text-left p-2.5 rounded-lg transition-all duration-200 cursor-pointer group
                  ${isSelected
                    ? 'bg-primary-500/10 border border-primary-500/20'
                    : 'hover:bg-white/[0.03] border border-transparent'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 flex items-center justify-center ${statusColor[stage.status]}`}>
                    <i className={`${statusIcon[stage.status]} text-sm`}></i>
                  </span>
                  <span className={`text-sm font-medium flex-1 ${isSelected ? 'text-white' : 'text-foreground-300'}`}>
                    {stage.order}. {stage.name}
                  </span>
                  <span className="text-foreground-600 text-[11px] shrink-0">
                    {completedTasks}/{stage.tasks.length}
                  </span>
                  <span className={`w-3 h-3 flex items-center justify-center text-foreground-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    <i className="ri-arrow-down-s-line text-xs"></i>
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 pl-6">
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stage.status === 'completed' ? 'bg-success' :
                        stage.status === 'in_progress' ? 'bg-gradient-to-r from-primary-500 to-primary-300' :
                        'bg-foreground-700'
                      }`}
                      style={{ width: `${stage.progress}%` }}
                    ></div>
                  </div>
                </div>
              </button>
              {isExpanded && (
                <div className="ml-4 pl-4 border-l border-primary-500/10 space-y-0.5 mt-0.5">
                  {stage.tasks.map((task) => {
                    const isTaskDone = task.status === 'completed';
                    return (
                      <button
                        key={task.id}
                        className="w-full text-left p-2 rounded-md hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start gap-2">
                          <span className={`w-3.5 h-3.5 flex items-center justify-center rounded-sm mt-0.5 shrink-0 ${
                            isTaskDone
                              ? 'bg-success/20 text-success'
                              : 'bg-white/5 text-foreground-600'
                          }`}>
                            <i className={`${isTaskDone ? 'ri-check-line' : 'ri-checkbox-blank-line'} text-[10px]`}></i>
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs ${isTaskDone ? 'text-foreground-600 line-through' : 'text-foreground-400'}`}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-400 to-data-highlight flex items-center justify-center text-white text-[8px] font-semibold">
                                {task.assigneeAvatar}
                              </span>
                              <span className="text-foreground-700 text-[10px]">{task.assignee}</span>
                              {task.priority === 'high' && (
                                <span className="text-error text-[10px]">高</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}