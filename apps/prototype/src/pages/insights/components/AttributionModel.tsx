import { useState } from 'react';
import { AttributionChannel } from '@/mocks/insightsData';

interface AttributionModelProps {
  channels: AttributionChannel[];
}

// ANA-003 MVP 模型集合：First Touch / Last Meaningful Touch / Campaign Influence / 人工 Primary Source
// （多触点加权归因为后续版本，不在 MVP 提供）
type ModelType = 'firstTouch' | 'lastMeaningfulTouch' | 'campaignInfluence' | 'manualPrimary';

const modelLabels: { key: ModelType; label: string; desc: string }[] = [
  { key: 'firstTouch', label: 'First Touch', desc: '首个触点获得全部功劳' },
  {
    key: 'lastMeaningfulTouch',
    label: 'Last Meaningful Touch',
    desc: '最后一次有意义触点（回复/会议/表单）获得功劳',
  },
  {
    key: 'campaignInfluence',
    label: 'Campaign Influence',
    desc: '影响窗口内参与的 Campaign 均计入贡献',
  },
  {
    key: 'manualPrimary',
    label: '人工 Primary Source',
    desc: '由负责人人工指定主要来源（记录操作人与时间）',
  },
];

export default function AttributionModel({ channels }: AttributionModelProps) {
  const [model, setModel] = useState<ModelType>('lastMeaningfulTouch');
  const total = channels.reduce((sum, c) => sum + c[model], 0);

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-sm font-semibold">归因（规则）</h3>
            <p className="text-foreground-500 text-xs mt-0.5">各渠道归因计数分布</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-wrap mt-2">
          {modelLabels.map((m) => (
            <button
              key={m.key}
              onClick={() => setModel(m.key)}
              className={`px-2.5 py-1 text-xs rounded-full transition-all whitespace-nowrap ${
                model === m.key
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-foreground-500 hover:text-foreground-300'
              }`}
              title={m.desc}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model description + 常显声明（ANA-003） */}
      <div className="bg-white/5 rounded-lg px-3 py-2 mb-4 space-y-1">
        <p className="text-foreground-500 text-xs">
          {modelLabels.find((m) => m.key === model)?.desc}
        </p>
        <p className="text-warning text-[11px] flex items-center gap-1">
          <i className="ri-information-line text-[11px]"></i>
          规则归因，不代表确定因果（ANA-003）
        </p>
      </div>

      {/* Attribution bars */}
      <div className="flex-1 space-y-3">
        {channels.map((ch) => {
          const pct = ((ch[model] / total) * 100).toFixed(1);
          return (
            <div key={ch.id} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `${ch.color}20` }}
                  >
                    <i className={`${ch.icon} text-xs`} style={{ color: ch.color }}></i>
                  </span>
                  <span className="text-foreground-300 text-xs">{ch.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground-500 text-xs">{ch[model]} 归因计数</span>
                  <span className="text-white text-xs font-mono font-medium">{pct}%</span>
                </div>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${ch.color} 0%, ${ch.color}80 100%)`,
                  }}
                ></div>
              </div>
              {/* Channel meta */}
              <div className="flex items-center gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-foreground-500 text-xs">
                  成本分摊 ${ch.cost.toLocaleString()}
                </span>
                <span className="text-success text-xs">SAO 贡献 {ch.saoContribution}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <span className="text-foreground-500 text-xs">总计（数据截至 2026-07-02）</span>
        <span className="text-white text-xs font-mono font-medium">{total} 归因计数</span>
      </div>
    </div>
  );
}
