import { OnboardingData } from '@/mocks/onboardingData';
import { channelOptions, budgetOptions, durationOptions } from '@/mocks/onboardingData';

interface FirstCampaignProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

export default function FirstCampaign({ data, onChange }: FirstCampaignProps) {
  const toggleChannel = (id: string) => {
    const next = data.campaignChannels.includes(id)
      ? data.campaignChannels.filter(c => c !== id)
      : [...data.campaignChannels, id];
    onChange({ campaignChannels: next });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
          <span className="w-8 h-8 flex items-center justify-center text-primary-400">
            <i className="ri-rocket-2-line text-2xl"></i>
          </span>
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">创建你的首个增长战役</h2>
        <p className="text-foreground-500 text-sm">
          AI 已根据你的 ICP 和目标市场生成了战役建议，你可以直接使用或自定义
        </p>
      </div>

      <div className="space-y-5">
        {/* AI suggestion banner */}
        <div className="p-4 rounded-lg bg-primary-500/5 border border-primary-500/15">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
              <i className="ri-robot-2-line text-sm text-primary-400"></i>
            </span>
            <div>
              <p className="text-primary-300 text-xs font-medium mb-1">AI 建议</p>
              <p className="text-foreground-400 text-xs leading-relaxed">
                基于你的 {data.companyName || '企业'} 画像和 {data.regions.length > 0 ? '选定的目标市场' : '业务特征'}，
                建议首个战役聚焦 LinkedIn + 邮件营销组合，目标获取 100+ 高意向线索，周期 3 个月。
              </p>
            </div>
          </div>
        </div>

        {/* Campaign name */}
        <div>
          <label className="block text-foreground-300 text-xs font-medium mb-1.5">战役名称 *</label>
          <input
            type="text"
            value={data.campaignName}
            onChange={e => onChange({ campaignName: e.target.value })}
            placeholder="例如：Q3 北美市场增长战役"
            className="w-full"
          />
        </div>

        {/* Campaign goal */}
        <div>
          <label className="block text-foreground-300 text-xs font-medium mb-1.5">核心目标</label>
          <textarea
            value={data.campaignGoal}
            onChange={e => onChange({ campaignGoal: e.target.value })}
            placeholder="例如：获取 200 条高质量销售线索，覆盖北美 SaaS 和智能制造行业决策者"
            className="w-full h-20 resize-none"
          />
        </div>

        {/* Duration + Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground-300 text-xs font-medium mb-1.5">战役周期</label>
            <select
              value={data.campaignDuration}
              onChange={e => onChange({ campaignDuration: e.target.value })}
              className="w-full"
            >
              <option value="">选择周期</option>
              {durationOptions.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-foreground-300 text-xs font-medium mb-1.5">预算范围</label>
            <select
              value={data.campaignBudget}
              onChange={e => onChange({ campaignBudget: e.target.value })}
              className="w-full"
            >
              <option value="">选择预算</option>
              {budgetOptions.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Channels */}
        <div>
          <label className="block text-foreground-300 text-xs font-medium mb-1.5">触达渠道</label>
          <div className="grid grid-cols-2 gap-2">
            {channelOptions.map(ch => (
              <button
                key={ch.id}
                onClick={() => toggleChannel(ch.id)}
                className={`flex items-center gap-2.5 p-3 rounded-lg border text-left text-sm transition-all ${
                  data.campaignChannels.includes(ch.id)
                    ? 'bg-primary-500/10 border-primary-500/40 text-white'
                    : 'bg-white/5 border-white/5 text-foreground-500 hover:bg-white/8'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  data.campaignChannels.includes(ch.id) ? 'bg-primary-500/20 text-primary-400' : 'bg-white/10'
                }`}>
                  <i className={`${ch.icon} text-xs`}></i>
                </span>
                <div className="min-w-0">
                  <span className={`text-xs block truncate ${data.campaignChannels.includes(ch.id) ? 'text-white' : 'text-foreground-400'}`}>
                    {ch.name}
                  </span>
                  <span className="text-foreground-500 text-xs block truncate">{ch.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}