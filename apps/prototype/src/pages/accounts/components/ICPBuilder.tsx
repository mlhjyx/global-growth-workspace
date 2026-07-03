import { useState } from 'react';
import type { ICPProfile } from '@/mocks/accountData';

interface ICPBuilderProps {
  icps: ICPProfile[];
  selectedICPId: string;
  onSelectICP: (id: string) => void;
}

export default function ICPBuilder({ icps, selectedICPId, onSelectICP }: ICPBuilderProps) {
  const [activeTab, setActiveTab] = useState<'profiles' | 'create'>('profiles');

  const selectedICP = icps.find(i => i.id === selectedICPId) || icps[0];

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-primary-500/10">
        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex-1 text-center py-1.5 text-xs rounded-md transition-all cursor-pointer whitespace-nowrap
            ${activeTab === 'profiles' ? 'bg-primary-500/15 text-white' : 'text-foreground-500 hover:text-foreground-300'}`}
        >
          已保存画像
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 text-center py-1.5 text-xs rounded-md transition-all cursor-pointer whitespace-nowrap
            ${activeTab === 'create' ? 'bg-primary-500/15 text-white' : 'text-foreground-500 hover:text-foreground-300'}`}
        >
          新建画像
        </button>
      </div>

      {activeTab === 'profiles' && (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {icps.map((icp) => {
            const isSelected = icp.id === selectedICPId;
            return (
              <button
                key={icp.id}
                onClick={() => onSelectICP(icp.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer
                  ${isSelected
                    ? 'bg-primary-500/15 border border-primary-500/25'
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-primary-500/10'
                  }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs ${isSelected ? 'text-primary-400' : 'text-foreground-500'}`}>
                    {icp.aiGenerated ? (
                      <span className="badge-ai text-[10px]">AI 生成</span>
                    ) : (
                      <span className="text-foreground-600 text-[10px]">手动</span>
                    )}
                  </span>
                  {icp.active && (
                    <span className="badge-success text-[10px]">激活中</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-foreground-300'}`}>
                  {icp.name}
                </p>
                <p className="text-foreground-600 text-xs mt-0.5 line-clamp-2">
                  {icp.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-foreground-600 text-[11px]">
                    <i className="ri-user-search-line mr-0.5 text-[10px]"></i>{icp.matchCount} 匹配
                  </span>
                  <span className="text-foreground-700">·</span>
                  <span className="text-foreground-600 text-[11px]">{icp.createdBy}</span>
                </div>
              </button>
            );
          })}

          {/* Selected ICP detail */}
          {selectedICP && (
            <div className="mt-3 p-3 rounded-lg bg-white/[0.02] border border-primary-500/10">
              <p className="text-foreground-500 text-[11px] uppercase tracking-wider font-medium mb-2">画像详情</p>

              <div className="space-y-2">
                <div>
                  <p className="text-foreground-600 text-[11px] mb-1">公司规模</p>
                  <p className="text-white text-xs">{selectedICP.criteria.companySize}</p>
                </div>
                <div>
                  <p className="text-foreground-600 text-[11px] mb-1">行业</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedICP.criteria.industry.map(i => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-foreground-400">{i}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-foreground-600 text-[11px] mb-1">地区</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedICP.criteria.geography.map(g => (
                      <span key={g} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-foreground-400">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-foreground-600 text-[11px] mb-1">目标客户</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedICP.persona.title.map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-400">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-foreground-600 text-[11px] mb-1">购买信号</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedICP.criteria.buyingSignals.map(s => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary-500/10 flex items-center justify-center mb-3">
              <i className="ri-robot-2-line text-primary-400 text-xl"></i>
            </div>
            <p className="text-white text-sm font-medium mb-1">AI 辅助 ICP 构建</p>
            <p className="text-foreground-600 text-xs mb-4">描述您的目标客户，AI 将自动生成画像</p>
            <div className="relative">
              <textarea
                placeholder="例如：我们希望触达年收入 1000 万美元以上的 SaaS 企业，技术决策者关注数据分析和 AI 自动化..."
                className="w-full h-24 text-xs resize-none"
              />
            </div>
            <button className="btn-primary w-full mt-2 text-xs py-2 flex items-center justify-center gap-1">
              <i className="ri-magic-line text-xs"></i>
              生成画像草案
            </button>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-primary-500/10">
            <p className="text-foreground-500 text-[11px] font-medium mb-2">或选择快速模板</p>
            <div className="space-y-1">
              {['B2B SaaS 决策者', '制造业采购方', '金融科技 CTO', 'DTC 品牌创始人'].map(t => (
                <button key={t} className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-foreground-400 hover:bg-white/5 hover:text-foreground-300 transition-colors cursor-pointer">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}