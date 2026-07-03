import { useState } from 'react';
import { WeeklyReportTemplate } from '@/mocks/insightsData';

interface ReportGeneratorProps {
  templates: WeeklyReportTemplate[];
}

export default function ReportGenerator({ templates }: ReportGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0].id);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [includeCompetitor, setIncludeCompetitor] = useState(false);
  const [includeForecast, setIncludeForecast] = useState(true);

  const activeTemplate = templates.find(t => t.id === selectedTemplate);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white text-sm font-semibold">周报生成器</h3>
          <p className="text-foreground-500 text-xs mt-0.5">AI 自动生成数据分析报告</p>
        </div>
        {generated && (
          <span className="badge-success text-xs">已生成</span>
        )}
      </div>

      {/* Template selection */}
      <div className="space-y-2 mb-4">
        {templates.map(t => (
          <button
            key={t.id}
            onClick={() => { setSelectedTemplate(t.id); setGenerated(false); }}
            className={`w-full text-left p-3 rounded-lg transition-all border ${
              selectedTemplate === t.id
                ? 'bg-primary-500/10 border-primary-500/30'
                : 'bg-white/5 border-transparent hover:bg-white/8'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                selectedTemplate === t.id ? 'bg-primary-500/20' : 'bg-white/10'
              }`}>
                <i className={`${t.icon} text-xs ${selectedTemplate === t.id ? 'text-primary-400' : 'text-foreground-500'}`}></i>
              </span>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-medium block truncate ${selectedTemplate === t.id ? 'text-white' : 'text-foreground-300'}`}>
                  {t.name}
                </span>
                <span className="text-foreground-500 text-xs truncate block">{t.description}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {t.sections.map(s => (
                <span key={s} className="text-foreground-500 text-xs bg-white/5 px-1.5 py-0.5 rounded">{s}</span>
              ))}
            </div>
            {t.lastGenerated && (
              <p className="text-foreground-500 text-xs mt-1.5">上次生成: {t.lastGenerated}</p>
            )}
          </button>
        ))}
      </div>

      {/* Extra options */}
      <div className="space-y-2 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeForecast}
            onChange={e => setIncludeForecast(e.target.checked)}
            className="w-3.5 h-3.5 rounded accent-primary-500"
          />
          <span className="text-foreground-500 text-xs">包含下周预测</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeCompetitor}
            onChange={e => setIncludeCompetitor(e.target.checked)}
            className="w-3.5 h-3.5 rounded accent-primary-500"
          />
          <span className="text-foreground-500 text-xs">包含竞品动态</span>
        </label>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
      >
        {generating ? (
          <>
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-loader-4-line animate-spin text-sm"></i>
            </span>
            AI 正在分析数据...
          </>
        ) : generated ? (
          <>
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-check-line text-sm"></i>
            </span>
            重新生成
          </>
        ) : (
          <>
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-robot-2-line text-sm"></i>
            </span>
            生成报告
          </>
        )}
      </button>

      {/* Generated preview */}
      {generated && (
        <div className="mt-4 p-3 bg-success/5 border border-success/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded flex items-center justify-center bg-success/10">
              <i className="ri-file-text-line text-xs text-success"></i>
            </span>
            <span className="text-white text-xs font-medium">报告已生成</span>
          </div>
          <p className="text-foreground-500 text-xs mb-2">
            {activeTemplate?.name} · {new Date().toLocaleDateString('zh-CN')} · 含 {activeTemplate?.sections.length} 个板块
          </p>
          <div className="flex items-center gap-2">
            <button className="btn-secondary flex-1 flex items-center justify-center gap-1 py-1.5 text-xs whitespace-nowrap">
              <span className="w-3.5 h-3.5 flex items-center justify-center">
                <i className="ri-eye-line text-xs"></i>
              </span>
              预览
            </button>
            <button className="btn-primary flex-1 flex items-center justify-center gap-1 py-1.5 text-xs whitespace-nowrap">
              <span className="w-3.5 h-3.5 flex items-center justify-center">
                <i className="ri-download-line text-xs"></i>
              </span>
              下载 PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}