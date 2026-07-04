// 旅程导航条（EPIC-M0-06 T1）：激活旅程时挂在 TopBar 下方，跨页可见。
// 步骤态：✓ 已完成 / 高亮 当前 / 灰 待做；点击步骤跳承载页；「完成本步」推进并自动前往下一步。
import { useLocation, useNavigate } from 'react-router-dom';
import { useJourney } from './JourneyContext';

export default function JourneyRail() {
  const { journey, completed, currentStep, completeStep, resetJourney } = useJourney();
  const navigate = useNavigate();
  const location = useLocation();

  if (!journey) return null;

  const done = journey.steps.every((s) => completed.includes(s.id));

  const handleCompleteCurrent = () => {
    if (!currentStep) return;
    completeStep(currentStep.id);
    const idx = journey.steps.findIndex((s) => s.id === currentStep.id);
    const next = journey.steps[idx + 1];
    if (next && next.path !== location.pathname) navigate(next.path);
  };

  return (
    <div className="sticky top-0 z-30 border-b border-primary-500/15 bg-deep/85 backdrop-blur px-3 py-1.5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[10px] font-semibold text-primary-300 shrink-0">
          <i className="ri-route-line mr-1"></i>
          {journey.name}
        </span>

        {/* 步骤链 */}
        <div className="flex items-center gap-1 flex-wrap">
          {journey.steps.map((s, i) => {
            const isDone = completed.includes(s.id);
            const isCurrent = currentStep?.id === s.id;
            return (
              <span key={s.id} className="flex items-center gap-1">
                {i > 0 && <i className="ri-arrow-right-s-line text-foreground-700 text-[10px]"></i>}
                <button
                  onClick={() => navigate(s.path)}
                  title={s.hint}
                  className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                    isDone
                      ? 'bg-success/10 text-success border-success/30'
                      : isCurrent
                        ? 'bg-primary-500/20 text-primary-300 border-primary-500/40'
                        : 'bg-white/[0.03] text-foreground-600 border-white/10 hover:border-primary-500/30'
                  }`}
                >
                  {isDone && <i className="ri-check-line mr-0.5"></i>}
                  {s.label}
                </button>
              </span>
            );
          })}
        </div>

        {/* 当前任务与推进 */}
        <div className="flex items-center gap-2 ml-auto">
          {done ? (
            <span className="text-[10px] text-success">
              <i className="ri-trophy-line mr-1"></i>旅程走通：目标 → SAO 全链完成
            </span>
          ) : (
            currentStep && (
              <>
                <span className="text-[10px] text-foreground-500 hidden md:inline max-w-[320px] truncate">
                  当前：{currentStep.hint}
                </span>
                <button
                  onClick={handleCompleteCurrent}
                  className="text-[10px] px-2 py-0.5 rounded bg-primary-500/15 text-primary-300 border border-primary-500/30 hover:bg-primary-500/25 cursor-pointer shrink-0"
                >
                  完成本步 <i className="ri-arrow-right-line"></i>
                </button>
              </>
            )
          )}
          <button
            onClick={resetJourney}
            title="退出旅程（不清除已采集埋点）"
            className="text-[10px] text-foreground-600 hover:text-foreground-400 cursor-pointer shrink-0"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
