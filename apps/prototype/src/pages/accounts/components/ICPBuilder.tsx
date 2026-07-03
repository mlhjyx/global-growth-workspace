import { useState } from 'react';
import type { ICPProfile } from '@/mocks/accountData';
import ICPValidation from './ICPValidation';
import {
  ICP_STATUS_LABELS,
  BUYING_ROLE_LABELS,
  SCORE_DIMENSION_LABELS,
  signalTypeConfig,
} from '@/mocks/accountData';

interface ICPBuilderProps {
  icps: ICPProfile[];
  selectedICPId: string;
  onSelectICP: (id: string) => void;
}

export default function ICPBuilder({ icps, selectedICPId, onSelectICP }: ICPBuilderProps) {
  const [activeTab, setActiveTab] = useState<'profiles' | 'create'>('profiles');

  const selectedICP = icps.find((i) => i.id === selectedICPId) || icps[0];

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
                  ${
                    isSelected
                      ? 'bg-primary-500/15 border border-primary-500/25'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-primary-500/10'
                  }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {icp.active ? (
                    <span className="badge-success text-[10px]">
                      {ICP_STATUS_LABELS[icp.status] ?? icp.status}
                    </span>
                  ) : (
                    <span className="text-foreground-600 text-[10px]">
                      {ICP_STATUS_LABELS[icp.status] ?? icp.status}
                    </span>
                  )}
                  {icp.backtestPassed && <span className="badge-ai text-[10px]">回测通过</span>}
                  <span className="text-foreground-600 text-[10px]">v{icp.version}</span>
                </div>
                <p
                  className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-foreground-300'}`}
                >
                  {icp.name}
                </p>
                <p className="text-foreground-600 text-xs mt-0.5 line-clamp-2">{icp.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-foreground-600 text-[11px]">
                    <i className="ri-user-search-line mr-0.5 text-[10px]"></i>
                    {icp.matchCount} 命中账户
                  </span>
                  <span className="text-foreground-700">·</span>
                  <span className="text-foreground-600 text-[11px]">
                    {icp.marketScope.length} 个市场
                  </span>
                </div>
              </button>
            );
          })}

          {/* Selected ICP detail */}
          {selectedICP && (
            <div className="mt-3 p-3 rounded-lg bg-white/[0.02] border border-primary-500/10">
              <p className="text-foreground-500 text-[11px] uppercase tracking-wider font-medium mb-2">
                画像详情
              </p>

              <div className="space-y-2.5">
                <div>
                  <p className="text-foreground-600 text-[11px] mb-1">市场范围</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedICP.marketScope.map((g) => (
                      <span
                        key={g}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-foreground-400"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-foreground-600 text-[11px] mb-1">公司条件（Must / Nice）</p>
                  <div className="space-y-1">
                    {selectedICP.criteria.map((c) => (
                      <div key={c.criterionId} className="flex items-start gap-1.5">
                        <span
                          className={`text-[9px] px-1 py-0.5 rounded shrink-0 mt-0.5 ${
                            c.requirementLevel === 'MUST_HAVE'
                              ? 'bg-primary-500/15 text-primary-400'
                              : 'bg-white/5 text-foreground-500'
                          }`}
                        >
                          {c.requirementLevel === 'MUST_HAVE' ? 'Must' : 'Nice'}
                        </span>
                        <span
                          className="text-foreground-400 text-[10px] leading-snug"
                          title={c.rationale}
                        >
                          {c.field} {c.operator}{' '}
                          {Array.isArray(c.value) ? c.value.join(', ') : String(c.value ?? '')}
                          {typeof c.weight === 'number' && (
                            <span className="text-foreground-700"> · 权重 {c.weight}</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-foreground-600 text-[11px] mb-1">
                    排除条件（硬性，模型不可覆盖）
                  </p>
                  <div className="space-y-1">
                    {selectedICP.exclusions.map((x) => (
                      <div key={x.criterionId} className="flex items-start gap-1.5">
                        <span className="text-[9px] px-1 py-0.5 rounded bg-error/10 text-error shrink-0 mt-0.5">
                          排除
                        </span>
                        <span
                          className="text-foreground-500 text-[10px] leading-snug"
                          title={x.reason}
                        >
                          {x.reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-foreground-600 text-[11px] mb-1">触发信号</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedICP.triggerSignals.map((s) => {
                      const cfg = signalTypeConfig[s.signalType];
                      return (
                        <span
                          key={`${s.signalType}-${s.subtype}`}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success"
                          title={`${s.subtype} · 回看 ${s.lookbackDays} 天 · 最低强度 ${s.minStrength}`}
                        >
                          <i className={`${cfg.icon} mr-0.5 text-[10px]`}></i>
                          {cfg.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-foreground-600 text-[11px] mb-1">购买委员会</p>
                  <div className="space-y-1">
                    {selectedICP.committee.map((r) => (
                      <div key={r.id} className="p-1.5 rounded bg-white/[0.03]">
                        <p className="text-foreground-300 text-[10px]">
                          <span className="text-primary-400">
                            {BUYING_ROLE_LABELS[r.roleType] ?? r.roleType}
                          </span>
                          {' · '}
                          {r.name}
                          {r.requiredForQualification && (
                            <span
                              className="ml-1 text-warning text-[9px]"
                              title="确认合格线索所必需的角色"
                            >
                              必需
                            </span>
                          )}
                        </p>
                        <p className="text-foreground-600 text-[9px] mt-0.5">
                          {r.typicalTitles.join(' / ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-foreground-600 text-[11px] mb-1">六维评分权重</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(selectedICP.weights).map(([k, w]) => (
                      <span
                        key={k}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-foreground-400"
                      >
                        {SCORE_DIMENSION_LABELS[k] ?? k} {w}
                      </span>
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
            <p className="text-foreground-600 text-xs mb-4">
              描述您的目标客户，AI 将生成画像草案（Hypothesis，回测通过前不可激活）
            </p>
            <div className="relative">
              <textarea
                placeholder="例如：我们向东南亚出口 TOPCon 光伏组件，目标是越南、泰国有组件进口记录或在建项目管道的进口商与 EPC..."
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
              {[
                '东南亚光伏进口商 / EPC',
                '非洲建材经销商',
                '中东建材项目采购方',
                '南美光伏分销商',
              ].map((t) => (
                <button
                  key={t}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-foreground-400 hover:bg-white/5 hover:text-foreground-300 transition-colors cursor-pointer"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* EPIC-M0-03 T4：样例回测 + 查询预览（PG-005 后两区域，LED-004/005） */}
          <ICPValidation icpId={selectedICP.id} />
        </div>
      )}
    </div>
  );
}
