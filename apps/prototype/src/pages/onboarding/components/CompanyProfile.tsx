import { OnboardingData } from '@/mocks/onboardingData';
import { industryOptions, companySizeOptions } from '@/mocks/onboardingData';

interface CompanyProfileProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

export default function CompanyProfile({ data, onChange }: CompanyProfileProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
          <span className="w-8 h-8 flex items-center justify-center text-primary-400">
            <i className="ri-building-4-line text-2xl"></i>
          </span>
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">介绍一下你的企业</h2>
        <p className="text-foreground-500 text-sm">
          AI 将根据这些信息为你定制增长策略、ICP 画像和内容建议
        </p>
      </div>

      <div className="space-y-5">
        {/* Company name + website */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground-300 text-xs font-medium mb-1.5">
              公司名称 *
            </label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => onChange({ companyName: e.target.value })}
              placeholder="例如：GrowthTech Inc."
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-foreground-300 text-xs font-medium mb-1.5">官网地址</label>
            <input
              type="text"
              value={data.companyWebsite}
              onChange={(e) => onChange({ companyWebsite: e.target.value })}
              placeholder="例如：www.growthtech.com"
              className="w-full"
            />
          </div>
        </div>

        {/* Industry + Company size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground-300 text-xs font-medium mb-1.5">
              所属行业 *
            </label>
            <select
              value={data.industry}
              onChange={(e) => onChange({ industry: e.target.value })}
              className="w-full"
            >
              <option value="">请选择行业</option>
              {industryOptions.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-foreground-300 text-xs font-medium mb-1.5">公司规模</label>
            <select
              value={data.companySize}
              onChange={(e) => onChange({ companySize: e.target.value })}
              className="w-full"
            >
              <option value="">请选择规模</option>
              {companySizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Company description */}
        <div>
          <label className="block text-foreground-300 text-xs font-medium mb-1.5">
            一句话描述你的业务
          </label>
          <textarea
            value={data.companyDescription}
            onChange={(e) => onChange({ companyDescription: e.target.value })}
            placeholder="例如：我们帮助出海企业在海外市场实现高效获客和增长..."
            className="w-full h-24 resize-none"
          />
        </div>

        {/* Target customers */}
        <div>
          <label className="block text-foreground-300 text-xs font-medium mb-1.5">
            你的目标客户是谁？
          </label>
          <textarea
            value={data.targetCustomers}
            onChange={(e) => onChange({ targetCustomers: e.target.value })}
            placeholder="例如：北美市场的中型 SaaS 公司技术决策者..."
            className="w-full h-20 resize-none"
          />
          <p className="text-foreground-500 text-xs mt-1">描述越具体，AI 生成的 ICP 越精准</p>
        </div>
      </div>
    </div>
  );
}
