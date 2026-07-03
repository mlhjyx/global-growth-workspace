import { OnboardingData } from '@/mocks/onboardingData';
import { regionOptions } from '@/mocks/onboardingData';
import { channelOptions } from '@/mocks/onboardingData';
import { useNavigate } from 'react-router-dom';

interface SuccessFinishProps {
  data: OnboardingData;
  onComplete: () => void;
}

export default function SuccessFinish({ data, onComplete }: SuccessFinishProps) {
  const navigate = useNavigate();
  const regionCount = data.regions.length;
  const icpCount = data.icps.length;
  const channelCount = data.campaignChannels.length;

  const regionNames = data.regions
    .map((r) => regionOptions.find((o) => o.id === r)?.name || r)
    .join('、');

  const channelNames = data.campaignChannels
    .map((c) => channelOptions.find((o) => o.id === c)?.name || c)
    .join('、');

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Celebration */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center">
            <span className="w-10 h-10 flex items-center justify-center text-success">
              <i className="ri-check-double-line text-3xl"></i>
            </span>
          </div>
          {/* Particles */}
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success animate-pulse"></span>
          <span
            className="absolute bottom-0 -left-2 w-2 h-2 rounded-full bg-primary-400 animate-pulse"
            style={{ animationDelay: '0.5s' }}
          ></span>
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">设置完成，准备起飞！</h2>
        <p className="text-foreground-500 text-sm">
          {data.companyName || '你的团队'} 的增长引擎已配置就绪，以下是你的初始配置摘要
        </p>
      </div>

      {/* Summary cards */}
      <div className="space-y-3 mb-8">
        {/* Company info */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
              <i className="ri-building-4-line text-lg"></i>
            </span>
            <div>
              <p className="text-white text-sm font-semibold">{data.companyName || '未填写'}</p>
              <p className="text-foreground-500 text-xs">
                {data.industry || '行业未选择'} · {data.companySize || '规模未选择'}
              </p>
            </div>
          </div>
        </div>

        {/* Markets */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
              <i className="ri-global-line text-lg"></i>
            </span>
            <div>
              <p className="text-white text-sm font-semibold">{regionCount} 个目标地区</p>
              <p className="text-foreground-500 text-xs truncate max-w-[300px]">
                {regionNames || '未选择地区'}
              </p>
            </div>
          </div>
        </div>

        {/* ICP */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
              <i className="ri-user-search-line text-lg"></i>
            </span>
            <div>
              <p className="text-white text-sm font-semibold">{icpCount} 个 ICP 画像</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.icps.map((icp) => (
                  <span
                    key={icp.id}
                    className="text-xs bg-white/5 px-2 py-0.5 rounded text-foreground-400"
                  >
                    {icp.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Campaign */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
              <i className="ri-rocket-2-line text-lg"></i>
            </span>
            <div>
              <p className="text-white text-sm font-semibold">
                {data.campaignName || '首个增长战役'}
              </p>
              <p className="text-foreground-500 text-xs">
                {data.campaignBudget || '预算未设'} · {data.campaignDuration || '周期未设'} ·{' '}
                {channelCount} 个渠道
              </p>
              {channelCount > 0 && (
                <p className="text-foreground-500 text-xs mt-0.5">{channelNames}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats highlights */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-white font-mono">{regionCount}</p>
          <p className="text-foreground-500 text-xs mt-1">目标市场</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-white font-mono">{icpCount}</p>
          <p className="text-foreground-500 text-xs mt-1">ICP 画像</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-white font-mono">{channelCount}</p>
          <p className="text-foreground-500 text-xs mt-1">触达渠道</p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-foreground-500 text-xs mb-4">
          一切就绪！现在可以进入工作台开始你的增长之旅了
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onComplete}
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-arrow-right-line text-sm"></i>
            </span>
            继续设置策略
          </button>
          <button
            onClick={() => navigate('/campaigns')}
            className="btn-secondary inline-flex items-center gap-2 px-6 py-3 text-sm"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-flag-2-line text-sm"></i>
            </span>
            查看战役
          </button>
        </div>
      </div>
    </div>
  );
}
