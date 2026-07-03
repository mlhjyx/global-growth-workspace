import { useState } from 'react';
import { contentTemplates, toneOptions } from '@/mocks/publishData';

interface AIGeneratorProps {
  onApply: (title: string, content: string, tags: string[]) => void;
}

const mockGeneratedContents = [
  {
    title: 'AI 驱动的 B2B 出海获客：2024 年最有效的方法论',
    content:
      '在全球化竞争日益激烈的今天，B2B 企业如何通过 AI 技术实现精准获客？\n\n我们分析了 1,200 家出海企业的数据，发现采用 AI 辅助获客的企业平均线索转化率提升了 3.2 倍。核心策略包括：\n\n1. ICP 动态画像：利用 AI 实时分析目标客户的商业信号\n2. 多渠道触点自动化：根据客户旅程自动触发个性化内容\n3. 预测性评分模型：优先跟进高转化概率的潜客\n\n这些方法的组合使用，使得获客成本降低了 47%，而销售周期缩短了 35%。',
    tags: ['B2B获客', 'AI营销', '出海增长', '精准营销'],
  },
  {
    title: '为什么你的内容营销没有效果？3 个被忽视的关键点',
    content:
      '大多数 B2B 企业的内容营销陷入了一个怪圈：产出大量内容，却看不到实际转化。\n\n问题不在于内容数量，而在于内容策略。我们发现高效的内容营销团队普遍做到了以下三点：\n\n第一，内容与销售漏斗严格对齐。TOFU 内容负责引流，MOFU 内容负责培育，BOFU 内容负责转化。\n\n第二，利用数据反馈实时优化。不再凭感觉创作，而是根据阅读完成率、分享率和转化率来调整内容方向。\n\n第三，建立内容复用体系。一篇深度报告可以拆解成 10+ 条社交媒体内容、3 封邮件和 1 场 webinar。',
    tags: ['内容营销', '转化优化', 'B2B策略'],
  },
  {
    title: '从 0 到 1：东南亚 SaaS 市场进入完全指南',
    content:
      '东南亚数字经济正在以年均 20% 的速度增长，SaaS 渗透率仅为北美的 1/5，这意味着巨大的增长空间。\n\n然而，进入东南亚市场需要理解几个关键差异：\n\n首先，支付方式高度本地化。信用卡普及率低，电子钱包（GrabPay、PayNow、DANA）是主流。\n\n其次，决策链条更长。B2B 采购通常需要 5-7 个利益相关者参与，建立信任比展示功能更重要。\n\n最后，内容本地化不能仅停留在翻译层面。印尼、泰国、越南的文化语境差异巨大，需要本土团队深度参与。',
    tags: ['东南亚市场', 'SaaS出海', '市场进入'],
  },
];

export default function AIGenerator({ onApply }: AIGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [template, setTemplate] = useState('industry-insight');
  const [tone, setTone] = useState('professional');
  const [audience, setAudience] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<(typeof mockGeneratedContents)[0] | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setGenerated(null);
    setProgress(0);
    setProgressText('正在分析主题和受众...');

    const stages = [
      { pct: 25, text: '正在分析主题和受众...' },
      { pct: 55, text: '检索行业数据和趋势...' },
      { pct: 80, text: '生成内容结构和文案...' },
      { pct: 100, text: '优化标题和标签建议...' },
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      stageIdx += 1;
      if (stageIdx < stages.length) {
        setProgress(stages[stageIdx].pct);
        setProgressText(stages[stageIdx].text);
      }
    }, 700);

    setTimeout(() => {
      clearInterval(interval);
      const randomContent =
        mockGeneratedContents[Math.floor(Math.random() * mockGeneratedContents.length)];
      setGenerated(randomContent);
      setGenerating(false);
    }, 3000);
  };

  const handleApply = () => {
    if (!generated) return;
    onApply(generated.title, generated.content, generated.tags);
  };

  return (
    <div className="rounded-2xl bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-7 h-7 rounded-lg bg-primary-500/10 flex items-center justify-center">
          <i className="ri-sparkling-line text-primary-400 text-sm"></i>
        </span>
        <h3 className="text-white font-medium text-sm">AI 内容生成</h3>
        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-primary-500/8 text-primary-400">
          GPT-4o
        </span>
      </div>

      <div className="space-y-3">
        {/* 主题输入 */}
        <div>
          <label className="text-foreground-500 text-xs mb-1 block">内容主题 / 关键词</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：B2B AI 获客方法论、东南亚 SaaS 市场机会..."
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder:text-foreground-700 focus:outline-none focus:border-primary-500/30 transition-colors"
          />
        </div>

        {/* 内容类型 + 语气 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-foreground-500 text-xs mb-1.5 block">内容类型</label>
            <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
              {contentTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                    template === t.id
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-foreground-500 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="font-medium">{t.name}</div>
                  <div className="text-[10px] text-foreground-700 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-foreground-500 text-xs mb-1.5 block">语气风格</label>
            <div className="space-y-1">
              {toneOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                    tone === t.id
                      ? 'bg-foreground-500/10 text-foreground-400'
                      : 'text-foreground-500 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="font-medium">{t.name}</div>
                  <div className="text-[10px] text-foreground-700 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 目标受众 */}
        <div>
          <label className="text-foreground-500 text-xs mb-1 block">目标受众（可选）</label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="例如：北美 SaaS 技术决策者、东南亚电商运营负责人..."
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder:text-foreground-700 focus:outline-none focus:border-primary-500/30 transition-colors"
          />
        </div>

        {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
          disabled={generating || !topic.trim()}
          className="w-full py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <i className="ri-loader-4-line animate-spin"></i>
              生成中...
            </>
          ) : (
            <>
              <i className="ri-magic-line"></i>
              AI 生成内容
            </>
          )}
        </button>

        {/* 生成进度 */}
        {generating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground-500">{progressText}</span>
              <span className="text-primary-400">{progress}%</span>
            </div>
            <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-300 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* 生成结果 */}
        {generated && (
          <div className="rounded-lg bg-primary-500/5 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-primary-400 flex items-center gap-1">
                <i className="ri-check-line"></i>
                AI 生成完成
              </span>
              <button
                onClick={handleApply}
                className="text-[11px] px-2.5 py-1 rounded-md bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors cursor-pointer"
              >
                应用到编辑器
              </button>
            </div>
            <div className="text-white text-sm font-medium">{generated.title}</div>
            <div className="text-foreground-500 text-xs line-clamp-3">{generated.content}</div>
            <div className="flex flex-wrap gap-1">
              {generated.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/8 text-primary-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
