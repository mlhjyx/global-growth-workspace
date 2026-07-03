import { useState } from 'react';
import { GeneratedICP } from '@/mocks/onboardingData';
import { aiGeneratedICPs } from '@/mocks/onboardingData';

interface ICPPreviewProps {
  icps: GeneratedICP[];
  onUpdate: (icps: GeneratedICP[]) => void;
  onGenerate: () => void;
}

export default function ICPPreview({ icps, onUpdate, onGenerate }: ICPPreviewProps) {
  const [generating, setGenerating] = useState(false);
  const [expandedICP, setExpandedICP] = useState<string | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      onGenerate();
      setGenerating(false);
    }, 2500);
  };

  const toggleExpand = (id: string) => {
    setExpandedICP(expandedICP === id ? null : id);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
          <span className="w-8 h-8 flex items-center justify-center text-primary-400">
            <i className="ri-user-search-line text-2xl"></i>
          </span>
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">AI 生成理想客户画像</h2>
        <p className="text-foreground-500 text-sm">
          基于你的企业信息和目标市场，AI 自动生成了 {icps.length > 0 ? icps.length : '3'} 个 ICP
          画像
        </p>
      </div>

      {icps.length === 0 ? (
        /* Generating state */
        <div className="text-center py-12">
          {generating ? (
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary-500/10 flex items-center justify-center">
                <span className="w-10 h-10 flex items-center justify-center">
                  <i className="ri-loader-4-line text-3xl text-primary-400 animate-spin"></i>
                </span>
              </div>
              <div>
                <p className="text-white font-medium mb-1">AI 正在分析你的业务数据...</p>
                <p className="text-foreground-500 text-sm">
                  识别市场信号 · 匹配行业模式 · 构建精准画像
                </p>
              </div>
              {/* Loading steps */}
              <div className="space-y-2 max-w-xs mx-auto mt-4">
                {['分析目标市场特征...', '识别高价值客户模式...', '生成 ICP 画像草稿...'].map(
                  (step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-foreground-500">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-primary-500/50 animate-pulse"
                        style={{ animationDelay: `${idx * 0.3}s` }}
                      ></span>
                      {step}
                    </div>
                  ),
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <i className="ri-robot-2-line text-sm"></i>
              </span>
              开始 AI 生成
            </button>
          )}
        </div>
      ) : (
        /* Generated ICPs */
        <div className="space-y-4">
          {icps.map((icp, idx) => {
            const isExpanded = expandedICP === icp.id;
            return (
              <div
                key={icp.id}
                className={`glass-card overflow-hidden transition-all ${isExpanded ? 'border-primary-500/30' : ''}`}
              >
                {/* Header */}
                <button
                  onClick={() => toggleExpand(icp.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 font-bold text-sm">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-white text-sm font-semibold">{icp.name}</h4>
                      <p className="text-foreground-500 text-xs mt-0.5">{icp.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge-ai text-xs">{icp.estimatedMatchCount} 家匹配</span>
                    <span
                      className={`w-6 h-6 flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <i className="ri-arrow-down-s-line text-foreground-500"></i>
                    </span>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-foreground-500 text-xs mb-2">公司规模</p>
                        <p className="text-foreground-300 text-xs">{icp.criteria.companySize}</p>
                      </div>
                      <div>
                        <p className="text-foreground-500 text-xs mb-2">营收范围</p>
                        <p className="text-foreground-300 text-xs">{icp.criteria.revenue}</p>
                      </div>
                      <div>
                        <p className="text-foreground-500 text-xs mb-2">决策角色</p>
                        <p className="text-foreground-300 text-xs">{icp.persona.seniority}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-foreground-500 text-xs mb-1.5">目标行业</p>
                      <div className="flex flex-wrap gap-1.5">
                        {icp.criteria.industry.map((ind) => (
                          <span
                            key={ind}
                            className="text-xs bg-white/5 px-2 py-0.5 rounded text-foreground-400"
                          >
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-foreground-500 text-xs mb-1.5">地区</p>
                      <div className="flex flex-wrap gap-1.5">
                        {icp.criteria.geography.map((geo) => (
                          <span
                            key={geo}
                            className="text-xs bg-white/5 px-2 py-0.5 rounded text-foreground-400"
                          >
                            {geo}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-foreground-500 text-xs mb-1.5">痛点</p>
                      <div className="flex flex-wrap gap-1.5">
                        {icp.criteria.painPoints.map((pp) => (
                          <span
                            key={pp}
                            className="text-xs bg-error/10 text-error px-2 py-0.5 rounded"
                          >
                            {pp}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-foreground-500 text-xs mb-1.5">技术栈</p>
                      <div className="flex flex-wrap gap-1.5">
                        {icp.criteria.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button className="btn-secondary flex items-center gap-1 px-3 py-1.5 text-xs whitespace-nowrap">
                        <span className="w-3.5 h-3.5 flex items-center justify-center">
                          <i className="ri-edit-line text-xs"></i>
                        </span>
                        编辑画像
                      </button>
                      <button className="btn-secondary flex items-center gap-1 px-3 py-1.5 text-xs whitespace-nowrap">
                        <span className="w-3.5 h-3.5 flex items-center justify-center">
                          <i className="ri-refresh-line text-xs"></i>
                        </span>
                        重新生成
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
