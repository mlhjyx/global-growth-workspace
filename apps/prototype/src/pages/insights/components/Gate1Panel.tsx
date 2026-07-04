// Gate 1 验证埋点看板（EPIC-M0-06 T2）：点亮 M0-05 占位条——读取真实埋点聚合。
// UAT 用法（docs/testing/UAT_SCRIPTS_M0.md）：每位受试者开始前「重置采集」，结束后「导出」进采集表。
import { useEffect, useState } from 'react';
import {
  clearGate1Events,
  exportGate1Events,
  getGate1Metrics,
  type Gate1Metrics,
} from '@/analytics/analytics';

export default function Gate1Panel() {
  const [metrics, setMetrics] = useState<Gate1Metrics>(() => getGate1Metrics());
  const [copied, setCopied] = useState(false);

  // 简易刷新：进入页面时读取一次 + 每 3s 轮询（原型级，无事件总线）
  useEffect(() => {
    const timer = setInterval(() => setMetrics(getGate1Metrics()), 3000);
    return () => clearInterval(timer);
  }, []);

  const items: { label: string; value: string }[] = [
    {
      label: '旅程完成率',
      value:
        metrics.completionRate === null
          ? `${metrics.journeyStarts} 启动`
          : `${Math.round(metrics.completionRate * 100)}%（${metrics.journeyCompletes}/${metrics.journeyStarts}）`,
    },
    { label: '步骤完成', value: String(metrics.stepCompletions) },
    { label: '术语/证据求助', value: String(metrics.termHelpOpens) },
    { label: '错误恢复', value: String(metrics.errorRecovers) },
    { label: '审批决策', value: String(metrics.approvalDecisions) },
  ];

  const handleExport = async () => {
    try {
      await navigator.clipboard.writeText(exportGate1Events());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 剪贴板不可用时退化为控制台输出（UAT 主持人可从 DevTools 取）
      console.info('[gate1 export]', exportGate1Events());
    }
  };

  return (
    <div className="mx-4 mb-2 rounded-lg border border-primary-500/20 bg-primary-500/5 px-3 py-2 flex flex-wrap items-center gap-x-4 gap-y-1 shrink-0">
      <span className="text-primary-300 text-[10px] font-medium">
        <i className="ri-flag-line mr-1"></i>Gate 1 验证埋点
      </span>
      {items.map((m) => (
        <span key={m.label} className="text-[10px] text-foreground-500">
          {m.label} <span className="text-foreground-200 font-medium">{m.value}</span>
        </span>
      ))}
      <span className="ml-auto flex items-center gap-2">
        <button
          onClick={handleExport}
          className="text-[10px] text-primary-400 hover:text-primary-300 cursor-pointer"
          title="复制事件明细 JSON（UAT 采集表附件）"
        >
          <i className="ri-download-2-line mr-0.5"></i>
          {copied ? '已复制' : '导出'}
        </button>
        <button
          onClick={() => {
            clearGate1Events();
            setMetrics(getGate1Metrics());
          }}
          className="text-[10px] text-foreground-600 hover:text-foreground-400 cursor-pointer"
          title="UAT 会话重置（每位受试者开始前清零）"
        >
          <i className="ri-restart-line mr-0.5"></i>重置采集
        </button>
      </span>
    </div>
  );
}
