import { useState } from 'react';
import type { LocalizationRecord, ComplianceIssue } from '@/mocks/contentData';

interface Props {
  localizations: LocalizationRecord[];
  complianceIssues: ComplianceIssue[];
  selectedContentTitle: string;
}

const modeLabels: Record<string, string> = {
  translation: '翻译',
  transcreation: '转写',
  cultural_adaptation: '文化适配',
  compliance_rewrite: '合规改写',
};

const modeColors: Record<string, string> = {
  translation: 'bg-info/15 text-info border-info/30',
  transcreation: 'bg-primary-500/15 text-primary-300 border-primary-500/30',
  cultural_adaptation: 'bg-ai-accent/15 text-ai-accent border-ai-accent/30',
  compliance_rewrite: 'bg-warning/15 text-warning border-warning/30',
};

const severityColor: Record<string, string> = {
  critical: 'text-error border-error/30 bg-error/10',
  warning: 'text-warning border-warning/30 bg-warning/10',
  info: 'text-info border-info/30 bg-info/10',
};

export default function ContentComparison({
  localizations,
  complianceIssues,
  selectedContentTitle,
}: Props) {
  const [activeTab, setActiveTab] = useState<'localization' | 'compliance'>('localization');
  const [selectedLocId, setSelectedLocId] = useState(localizations[0]?.id || '');

  const selectedLoc = localizations.find((l) => l.id === selectedLocId) || localizations[0];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center border-b border-primary-500/10 shrink-0">
        <button
          onClick={() => setActiveTab('localization')}
          className={`px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'localization'
              ? 'text-primary-300 border-b border-primary-400'
              : 'text-foreground-500 hover:text-foreground-300'
          }`}
        >
          本地化对比
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'compliance'
              ? 'text-warning border-b border-warning'
              : 'text-foreground-500 hover:text-foreground-300'
          }`}
        >
          合规检查
          {complianceIssues.length > 0 && (
            <span className="text-[10px] bg-error/20 text-error px-1.5 py-0.5 rounded-full">
              {complianceIssues.filter((i) => i.severity === 'critical').length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'localization' ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Locale record selector */}
          {localizations.length > 1 && (
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-primary-500/10 shrink-0 overflow-x-auto">
              {localizations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocId(loc.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap cursor-pointer transition-colors ${
                    loc.id === selectedLocId
                      ? 'bg-primary-500/15 text-primary-300'
                      : 'bg-white/5 text-foreground-500 hover:bg-white/10'
                  }`}
                >
                  {modeLabels[loc.mode]} ({loc.targetLanguage.toUpperCase()})
                </button>
              ))}
            </div>
          )}

          {/* Three-column comparison */}
          {selectedLoc ? (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Column 1: Source */}
              <div className="flex-1 flex flex-col border-r border-b md:border-b-0 border-primary-500/10 min-w-0 min-h-[160px]">
                <div className="px-4 py-2.5 border-b border-primary-500/10 shrink-0">
                  <span className="text-foreground-500 text-[11px] font-medium">
                    中文原文 <span className="text-foreground-600">(CN)</span>
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <p className="text-foreground-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedLoc.sourceText}
                  </p>
                </div>
              </div>

              {/* Column 2: Adapted */}
              <div className="flex-1 flex flex-col border-r border-b md:border-b-0 border-primary-500/10 min-w-0 min-h-[160px]">
                <div className="px-4 py-2.5 border-b border-primary-500/10 shrink-0 flex items-center justify-between">
                  <span className="text-primary-300 text-[11px] font-medium">
                    适配草案{' '}
                    <span className="text-foreground-600">
                      ({selectedLoc.targetLanguage.toUpperCase()} · {selectedLoc.targetMarket})
                    </span>
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 border rounded ${modeColors[selectedLoc.mode]}`}
                  >
                    {modeLabels[selectedLoc.mode]}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <p className="text-foreground-100 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedLoc.adaptedText}
                  </p>
                </div>
              </div>

              {/* Column 3: AI Explanation */}
              <div className="w-full md:w-[280px] flex flex-col shrink-0 min-w-0 min-h-[160px]">
                <div className="px-4 py-2.5 border-b border-primary-500/10 shrink-0">
                  <span className="text-ai-accent text-[11px] font-medium">
                    AI 解释 (置信度 {selectedLoc.confidence}%)
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <p className="text-foreground-400 text-xs leading-relaxed">
                    {selectedLoc.aiExplanation}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-foreground-600 text-sm">
              该内容暂无本地化记录
            </div>
          )}
        </div>
      ) : (
        /* Compliance tab */
        <div className="flex-1 overflow-y-auto p-4">
          {complianceIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-foreground-600">
              <span className="w-12 h-12 flex items-center justify-center text-success text-3xl mb-2">
                <i className="ri-check-double-line"></i>
              </span>
              <p className="text-sm">无合规问题</p>
              <p className="text-xs mt-1">该内容已通过所有合规检查</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white text-sm font-medium">合规问题清单</h4>
                <span className="text-foreground-600 text-xs">{complianceIssues.length} 项</span>
              </div>
              {complianceIssues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-3 rounded-lg border ${severityColor[issue.severity]}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 flex items-center justify-center mt-0.5 shrink-0">
                      {issue.severity === 'critical' ? (
                        <i className="ri-error-warning-line text-error"></i>
                      ) : issue.severity === 'warning' ? (
                        <i className="ri-alert-line text-warning"></i>
                      ) : (
                        <i className="ri-information-line text-info"></i>
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-foreground-100 text-xs font-medium">
                          {issue.title}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            issue.severity === 'critical'
                              ? 'bg-error/20 text-error'
                              : issue.severity === 'warning'
                                ? 'bg-warning/20 text-warning'
                                : 'bg-info/20 text-info'
                          }`}
                        >
                          {issue.severity === 'critical'
                            ? '严重'
                            : issue.severity === 'warning'
                              ? '警告'
                              : '提示'}
                        </span>
                      </div>
                      <p className="text-foreground-400 text-xs leading-relaxed mb-1">
                        {issue.description}
                      </p>
                      <div className="flex items-start gap-1.5 mt-2 p-2 rounded bg-background-50/30 border border-primary-500/5">
                        <span className="w-4 h-4 flex items-center justify-center text-success shrink-0 mt-px">
                          <i className="ri-lightbulb-line text-xs"></i>
                        </span>
                        <p className="text-foreground-300 text-xs leading-relaxed">
                          {issue.suggestion}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-foreground-600 text-[10px]">
                          关联字段: {issue.field}
                        </span>
                        <span className="text-foreground-600 text-[10px]">
                          检查于: {issue.checkedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
