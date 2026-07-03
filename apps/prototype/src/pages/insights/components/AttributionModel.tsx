import { useState } from 'react';
import { AttributionChannel } from '@/mocks/insightsData';

interface AttributionModelProps {
  channels: AttributionChannel[];
}

type ModelType = 'firstTouch' | 'lastTouch' | 'multiTouch';

const modelLabels: { key: ModelType; label: string; desc: string }[] = [
  { key: 'firstTouch', label: '首次触点', desc: '首个引入渠道获全部功劳' },
  { key: 'lastTouch', label: '末次触点', desc: '最后接触渠道获全部功劳' },
  { key: 'multiTouch', label: '多触点', desc: '按权重分配各触点贡献' },
];

export default function AttributionModel({ channels }: AttributionModelProps) {
  const [model, setModel] = useState<ModelType>('multiTouch');
  const total = channels.reduce((sum, c) => sum + c[model], 0);

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white text-sm font-semibold">归因模型</h3>
          <p className="text-foreground-500 text-xs mt-0.5">各渠道转化贡献分布</p>
        </div>
        <div className="flex items-center gap-1">
          {modelLabels.map(m => (
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

      {/* Model description */}
      <div className="bg-white/5 rounded-lg px-3 py-2 mb-4">
        <p className="text-foreground-500 text-xs">
          {modelLabels.find(m => m.key === model)?.desc}
        </p>
      </div>

      {/* Attribution bars */}
      <div className="flex-1 space-y-3">
        {channels.map(ch => {
          const pct = ((ch[model] / total) * 100).toFixed(1);
          return (
            <div key={ch.id} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: `${ch.color}20` }}>
                    <i className={`${ch.icon} text-xs`} style={{ color: ch.color }}></i>
                  </span>
                  <span className="text-foreground-300 text-xs">{ch.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground-500 text-xs">{ch[model]} 转化</span>
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
                <span className="text-foreground-500 text-xs">投入 ${ch.cost.toLocaleString()}</span>
                <span className="text-success text-xs">回报 ${ch.revenue.toLocaleString()}</span>
                <span className="text-foreground-500 text-xs">ROAS {(ch.revenue / ch.cost).toFixed(1)}x</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <span className="text-foreground-500 text-xs">总计</span>
        <span className="text-white text-xs font-mono font-medium">{total} 转化</span>
      </div>
    </div>
  );
}