import { useState, useEffect, useRef } from 'react';
import { mockStats, mockNextActions, mockAnomalies, mockOpportunities } from '@/mocks/todayData';

interface DailyBriefModalProps {
  onClose: () => void;
}

export default function DailyBriefModal({ onClose }: DailyBriefModalProps) {
  const [stage, setStage] = useState<'generating' | 'done'>('generating');
  const progressRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      progressRef.current += Math.random() * 20 + 5;
      if (progressRef.current >= 100) {
        progressRef.current = 100;
        clearInterval(interval);
        setTimeout(() => setStage('done'), 400);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl animate-scale-in"
          style={{
            background: 'linear-gradient(180deg, rgba(20,14,44,0.98) 0%, rgba(28,18,56,0.98) 100%)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(108,92,231,0.15)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-primary-500/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <i className="ri-robot-2-fill text-white text-sm"></i>
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold">AI 今日简报</h3>
                <p className="text-foreground-600 text-[10px]">{dateStr}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-close-line text-sm"></i>
              </span>
            </button>
          </div>

          {stage === 'generating' ? (
            /* Generating state */
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/20 flex items-center justify-center mb-5">
                <i className="ri-robot-2-line text-primary-400 text-2xl animate-pulse"></i>
              </div>
              <p className="text-white text-sm font-medium mb-1">AI 正在分析今日数据...</p>
              <p className="text-foreground-500 text-xs mb-6">
                正在扫描 Campaign、Qualified Lead、机会与互动数据
              </p>

              {/* Progress */}
              <div className="w-full max-w-xs">
                <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
                    style={{ width: `${Math.min(progressRef.current, 100)}%` }}
                  />
                </div>
              </div>

              {/* Live status */}
              <div className="mt-6 space-y-2 w-full max-w-xs">
                {[
                  {
                    icon: 'ri-database-2-line',
                    text: '读取今日数据...',
                    done: progressRef.current > 15,
                  },
                  {
                    icon: 'ri-bar-chart-2-line',
                    text: '分析趋势指标...',
                    done: progressRef.current > 40,
                  },
                  {
                    icon: 'ri-alert-line',
                    text: '检测异常事件...',
                    done: progressRef.current > 65,
                  },
                  {
                    icon: 'ri-file-text-line',
                    text: '生成简报内容...',
                    done: progressRef.current > 85,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span
                      className={`w-4 h-4 flex items-center justify-center ${item.done ? 'text-success' : 'text-foreground-700'}`}
                    >
                      <i
                        className={`${item.done ? 'ri-checkbox-circle-fill' : item.icon} text-xs`}
                      ></i>
                    </span>
                    <span
                      className={`text-xs ${item.done ? 'text-foreground-400' : 'text-foreground-600'}`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Done state - Brief content */
            <div className="px-5 py-4 space-y-4">
              {/* Summary */}
              <div className="rounded-xl bg-white/[0.02] border border-primary-500/8 p-4">
                <h4 className="text-white text-sm font-semibold mb-2">总体摘要</h4>
                <p className="text-foreground-400 text-xs leading-relaxed">
                  今日系统运行正常。北极星口径：本月新增 SAO {mockStats[0]?.value} 个，Qualified
                  Lead {mockStats[1]?.value} 条， 单位 SAO 成本 {mockStats[2]?.value}，运行中
                  Campaign {mockStats[3]?.value} 个。 待处理事项 {mockNextActions.length}{' '}
                  项，其中高优先级 {mockNextActions.filter((a) => a.priority === 'high').length}{' '}
                  项。
                </p>
              </div>

              {/* Key metrics */}
              <div>
                <h4 className="text-foreground-500 text-[10px] font-medium uppercase tracking-wider mb-2">
                  北极星指标
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {mockStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg bg-white/[0.02] border border-primary-500/8 p-3 flex items-center justify-between"
                    >
                      <span className="text-foreground-500 text-xs">{stat.label}</span>
                      <span
                        className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-success' : stat.trend === 'down' ? 'text-error' : 'text-foreground-300'}`}
                      >
                        {stat.value} <span className="text-[10px] font-normal">{stat.change}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anomalies */}
              <div>
                <h4 className="text-foreground-500 text-[10px] font-medium uppercase tracking-wider mb-2">
                  异常关注
                </h4>
                <div className="space-y-1.5">
                  {mockAnomalies.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start gap-2.5 rounded-lg bg-white/[0.02] border border-primary-500/8 p-3"
                    >
                      <span
                        className={`w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 rounded-md ${
                          a.severity === 'critical'
                            ? 'bg-error/10 text-error'
                            : a.severity === 'warning'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-info/10 text-info'
                        }`}
                      >
                        <i
                          className={`${a.severity === 'critical' ? 'ri-error-warning-fill' : a.severity === 'warning' ? 'ri-alert-fill' : 'ri-information-fill'} text-xs`}
                        ></i>
                      </span>
                      <div>
                        <p className="text-white text-xs font-medium">{a.title}</p>
                        <p className="text-foreground-500 text-[11px] mt-0.5">{a.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top opportunities */}
              <div>
                <h4 className="text-foreground-500 text-[10px] font-medium uppercase tracking-wider mb-2">
                  商业机会进展 TOP 3
                </h4>
                <div className="space-y-1.5">
                  {mockOpportunities.slice(0, 3).map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-primary-500/8 p-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="min-w-8 h-8 px-1.5 rounded-lg bg-primary-500/10 flex items-center justify-center text-[11px] font-bold text-primary-400 whitespace-nowrap">
                          {o.stageLabel}
                        </span>
                        <div>
                          <p className="text-white text-xs font-medium">
                            {o.company}{' '}
                            <span className="text-foreground-500 font-normal">· {o.signal}</span>
                          </p>
                          <p className="text-foreground-500 text-[11px]">
                            下一步：{o.signalDetail}
                          </p>
                        </div>
                      </div>
                      <span className="text-foreground-600 text-[10px] shrink-0">{o.country}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next actions */}
              <div>
                <h4 className="text-foreground-500 text-[10px] font-medium uppercase tracking-wider mb-2">
                  今日行动建议
                </h4>
                <div className="space-y-1.5">
                  {mockNextActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-start gap-2.5 rounded-lg bg-white/[0.02] border border-primary-500/8 p-3"
                    >
                      <span
                        className={`w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 rounded-md ${
                          action.priority === 'high'
                            ? 'bg-error/10 text-error'
                            : action.priority === 'medium'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-foreground-500/10 text-foreground-500'
                        }`}
                      >
                        <i className="ri-flag-2-fill text-xs"></i>
                      </span>
                      <div>
                        <p className="text-white text-xs font-medium">{action.title}</p>
                        <p className="text-foreground-500 text-[11px] mt-0.5">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center gap-2 pt-1 pb-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-400 transition-colors cursor-pointer"
                >
                  我知道了
                </button>
                <button
                  onClick={() => {
                    const text = `Global Growth Workspace AI 今日简报 - ${dateStr}\n\n=== 北极星指标 ===\n${mockStats.map((s) => `${s.label}: ${s.value} (${s.change})`).join('\n')}\n\n=== 异常关注 ===\n${mockAnomalies.map((a) => `- ${a.title}: ${a.description}`).join('\n')}\n\n=== 商业机会（三级结果链） ===\n${mockOpportunities.map((o) => `- ${o.company} [${o.signal} · ${o.stageLabel}] 下一步: ${o.signalDetail}`).join('\n')}\n\n=== 今日行动 ===\n${mockNextActions.map((a) => `- ${a.title}`).join('\n')}`;
                    navigator.clipboard
                      .writeText(text)
                      .then(() => {
                        alert('简报已复制到剪贴板');
                      })
                      .catch(() => {
                        alert('复制失败，请重试');
                      });
                  }}
                  className="py-2.5 px-4 rounded-xl bg-white/[0.03] border border-primary-500/12 text-foreground-400 text-sm hover:text-white hover:border-primary-500/25 transition-all cursor-pointer"
                >
                  复制文本
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
