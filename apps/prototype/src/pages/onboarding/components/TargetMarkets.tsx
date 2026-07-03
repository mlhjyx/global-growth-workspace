import { OnboardingData } from '@/mocks/onboardingData';
import { regionOptions, targetIndustryOptions, languageOptions } from '@/mocks/onboardingData';

interface TargetMarketsProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

export default function TargetMarkets({ data, onChange }: TargetMarketsProps) {
  const toggleRegion = (id: string) => {
    const next = data.regions.includes(id)
      ? data.regions.filter((r) => r !== id)
      : [...data.regions, id];
    onChange({ regions: next });
  };

  const toggleIndustry = (ind: string) => {
    const next = data.targetIndustries.includes(ind)
      ? data.targetIndustries.filter((i) => i !== ind)
      : [...data.targetIndustries, ind];
    onChange({ targetIndustries: next });
  };

  const toggleLanguage = (id: string) => {
    const next = data.languages.includes(id)
      ? data.languages.filter((l) => l !== id)
      : [...data.languages, id];
    onChange({ languages: next });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
          <span className="w-8 h-8 flex items-center justify-center text-primary-400">
            <i className="ri-global-line text-2xl"></i>
          </span>
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">选择目标市场</h2>
        <p className="text-foreground-500 text-sm">
          选择你希望触达的地区、行业和内容语言，AI 将为你优化出海策略
        </p>
      </div>

      <div className="space-y-6">
        {/* Target regions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 flex items-center justify-center text-primary-400">
              <i className="ri-map-pin-line text-sm"></i>
            </span>
            <label className="text-foreground-300 text-sm font-medium">目标地区</label>
            <span className="text-foreground-500 text-xs">（多选）</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {regionOptions.map((region) => (
              <button
                key={region.id}
                onClick={() => toggleRegion(region.id)}
                className={`flex items-center gap-2.5 p-3 rounded-lg border text-left text-sm transition-all ${
                  data.regions.includes(region.id)
                    ? 'bg-primary-500/10 border-primary-500/40 text-white'
                    : 'bg-white/5 border-white/5 text-foreground-500 hover:bg-white/8'
                }`}
              >
                <span
                  className={`w-5 h-5 flex items-center justify-center ${data.regions.includes(region.id) ? 'text-primary-400' : ''}`}
                >
                  <i className={`${region.icon} text-sm`}></i>
                </span>
                <span className="truncate">{region.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Target industries */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 flex items-center justify-center text-primary-400">
              <i className="ri-building-2-line text-sm"></i>
            </span>
            <label className="text-foreground-300 text-sm font-medium">目标行业</label>
            <span className="text-foreground-500 text-xs">（多选）</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {targetIndustryOptions.map((ind) => (
              <button
                key={ind}
                onClick={() => toggleIndustry(ind)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all whitespace-nowrap ${
                  data.targetIndustries.includes(ind)
                    ? 'bg-primary-500/15 border-primary-500/40 text-primary-300'
                    : 'bg-white/5 border-white/5 text-foreground-500 hover:text-white hover:bg-white/8'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Content languages */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 flex items-center justify-center text-primary-400">
              <i className="ri-translate-2 text-sm"></i>
            </span>
            <label className="text-foreground-300 text-sm font-medium">内容语言</label>
            <span className="text-foreground-500 text-xs">（多选）</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => (
              <button
                key={lang.id}
                onClick={() => toggleLanguage(lang.id)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all whitespace-nowrap ${
                  data.languages.includes(lang.id)
                    ? 'bg-primary-500/15 border-primary-500/40 text-primary-300'
                    : 'bg-white/5 border-white/5 text-foreground-500 hover:text-white hover:bg-white/8'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
