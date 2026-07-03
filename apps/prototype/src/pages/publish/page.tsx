import { useState } from 'react';
import AIGenerator from './components/AIGenerator';
import ContentEditor from './components/ContentEditor';
import PlatformSelector from './components/PlatformSelector';
import PublishCalendar from './components/PublishCalendar';
import { platforms, publishHistory } from '@/mocks/publishData';

const quickTemplates: Record<string, { title: string; content: string; tags: string[]; platforms: string[] }> = {
  '行业洞察 + 数据支撑': {
    title: '2026 B2B 行业趋势洞察：数据驱动的新增长范式',
    content: '根据最新行业数据显示，全球 B2B 营销正在经历一场深刻的范式转变。\n\n📊 关键数据：\n- 76% 的 B2B 买家期望个性化体验\n- AI 辅助内容创作效率提升 4.2 倍\n- 多渠道触点策略使线索转化率提升 2.8 倍\n\n💡 核心洞察：\n传统"广撒网"式的获客模式正在被精准化、数据化的 ABM 策略取代。企业需要建立完整的客户数据平台，实现从线索识别到转化的全链路智能化。\n\n我们分析了 2,000+ 家企业的增长数据，以下是我们发现的三大趋势：',
    tags: ['行业洞察', 'B2B趋势', '数据驱动', '增长范式'],
    platforms: ['linkedin', 'wechat'],
  },
  '客户成功案例': {
    title: '客户案例 | 某头部 SaaS 企业 6 个月内实现海外营收翻倍',
    content: '🎯 挑战：一家面向北美市场的 SaaS 企业，面临获客成本高、线索转化率低的双重困境。\n\n💡 解决方案：\n1. 部署 AI 驱动 ICP 画像系统，精准定位高价值潜客\n2. 建立多渠道自动化内容分发体系\n3. 实施预测性线索评分模型\n\n📈 核心成果：\n- 海外营收增长 127%\n- 获客成本降低 42%\n- 销售周期缩短 35%\n- 线索到商机转化率提升 3.2 倍\n\n点击阅读完整案例 →',
    tags: ['客户案例', 'SaaS出海', '增长故事', '数据成果'],
    platforms: ['linkedin', 'twitter', 'wechat'],
  },
  '产品更新公告': {
    title: '产品更新 | [功能名称] 正式上线，带来三大核心升级',
    content: '我们很高兴地宣布，[功能名称] 正式发布！\n\n✨ 核心升级：\n\n1️⃣ [功能一名称]\n简洁描述这个功能解决什么问题\n\n2️⃣ [功能二名称]\n简洁描述这个功能带来的价值\n\n3️⃣ [功能三名称]\n简洁描述这个功能的独特之处\n\n🔗 了解更多：预约 demo 体验全新功能',
    tags: ['产品更新', '新功能发布', '产品动态'],
    platforms: ['linkedin', 'twitter', 'wechat', 'facebook'],
  },
  '节日/热点借势': {
    title: '[节日/热点] | 致敬每一个[主题]的人',
    content: '今天是[节日/热点]，我们想聊聊[主题]。\n\n在[行业/领域]，有这样一群人——\n他们[描述1]\n他们[描述2]\n他们[描述3]\n\n正是这些[形容词]的力量，推动着[行业/领域]不断向前。\n\n这个[节日]，致敬每一个在[领域]默默耕耘的你。\n\n#趁势营销 #品牌温度',
    tags: ['节日营销', '品牌温度', '热点借势'],
    platforms: ['linkedin', 'twitter', 'xiaohongshu', 'wechat'],
  },
  '团队文化展示': {
    title: '走进 [公司名] | 这就是我们打造伟大产品的方式',
    content: '很多人好奇，[公司名] 的团队是如何工作的？\n\n今天带大家走进我们的日常——\n\n🌅 早晨：站会和目标对齐\n我们每天以 15 分钟的站会开始，确保每个人都知道今天最重要的三件事。\n\n💻 工作中：深度专注 + 高效协作\n上午是深度工作时间，下午则是跨团队协作和创意碰撞的时刻。\n\n🎉 我们相信：\n- 透明沟通胜过层层汇报\n- 结果导向胜过加班文化\n- 持续学习胜过经验主义\n\n想加入我们？在招岗位 → [链接]',
    tags: ['团队文化', '雇主品牌', '工作方式', '招聘'],
    platforms: ['linkedin', 'xiaohongshu', 'wechat'],
  },
};

export default function PublishPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin', 'twitter']);
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const platformCharLimits: Record<string, number> = {};
  platforms.forEach((p) => {
    platformCharLimits[p.id] = p.charLimit;
  });

  const handleApplyGenerated = (newTitle: string, newContent: string, newTags: string[]) => {
    setTitle(newTitle);
    setContent(newContent);
    setTags(newTags);
    setSelectedTemplate(null);
  };

  const handleApplyTemplate = (templateName: string) => {
    const tpl = quickTemplates[templateName];
    if (!tpl) return;
    setTitle(tpl.title);
    setContent(tpl.content);
    setTags(tpl.tags);
    setSelectedPlatforms(tpl.platforms);
    setSelectedTemplate(templateName);
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim() || selectedPlatforms.length === 0) return;
    setShowPublishConfirm(true);
  };

  const confirmPublish = () => {
    setShowPublishConfirm(false);
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);
      setTitle('');
      setContent('');
      setTags([]);
      setSelectedTemplate(null);
    }, 2000);
  };

  const connectedCount = platforms.filter((p) => p.connected).length;
  const selectedConnected = selectedPlatforms.filter((id) => {
    const p = platforms.find((plat) => plat.id === id);
    return p?.connected;
  });

  const templateList = Object.keys(quickTemplates);

  const published = publishHistory.filter((p) => p.status === 'published');
  const scheduled = publishHistory.filter((p) => p.status === 'scheduled');

  const stats = [
    { label: '本月已发布', value: published.length.toString(), color: 'text-white' },
    { label: '待排期', value: scheduled.length.toString(), color: 'text-primary-400' },
    { label: '总曝光量', value: '126K', color: 'text-ai-accent' },
    { label: '平均点击率', value: '3.2%', color: 'text-foreground-400' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-white text-xl font-bold">AI 发布中心</h1>
            <p className="text-foreground-600 text-xs mt-0.5">
              AI 生成内容，一键分发至多平台 · 已连接 {connectedCount} 个账号
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-1">
              <button
                onClick={() => setScheduleMode('now')}
                className={`px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer whitespace-nowrap ${
                  scheduleMode === 'now'
                    ? 'bg-primary-500/15 text-primary-400'
                    : 'text-foreground-600 hover:text-foreground-400'
                }`}
              >
                立即发布
              </button>
              <button
                onClick={() => setScheduleMode('schedule')}
                className={`px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer whitespace-nowrap ${
                  scheduleMode === 'schedule'
                    ? 'bg-primary-500/15 text-primary-400'
                    : 'text-foreground-600 hover:text-foreground-400'
                }`}
              >
                定时发布
              </button>
            </div>
            {scheduleMode === 'schedule' && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary-500/30"
                />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary-500/30"
                />
              </div>
            )}
            <button
              onClick={handlePublish}
              disabled={!title.trim() || !content.trim() || selectedConnected.length === 0 || publishing}
              className="px-5 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              {publishing ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  发布中...
                </>
              ) : (
                <>
                  <i className="ri-send-plane-fill"></i>
                  {scheduleMode === 'now' ? '一键发布' : '定时发布'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success toast */}
        {publishSuccess && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-green-500/8 border border-green-500/15 flex items-center gap-2.5">
            <i className="ri-checkbox-circle-line text-green-400"></i>
            <span className="text-green-400 text-sm">
              内容已成功{scheduleMode === 'now' ? '发布' : '排期'}至 {selectedConnected.length} 个平台
            </span>
          </div>
        )}

        {/* Main 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          {/* Left: Content Workspace */}
          <div className="lg:col-span-7 space-y-4 md:space-y-5">
            <AIGenerator onApply={handleApplyGenerated} />
            <ContentEditor
              title={title}
              content={content}
              tags={tags}
              selectedPlatforms={selectedPlatforms}
              platformCharLimits={platformCharLimits}
              onTitleChange={setTitle}
              onContentChange={setContent}
              onTagsChange={setTags}
            />
          </div>

          {/* Right: Publishing Sidebar */}
          <div className="lg:col-span-5 space-y-4 md:space-y-5">
            <PlatformSelector selected={selectedPlatforms} onChange={setSelectedPlatforms} />
            <PublishCalendar />

            {/* Quick Stats + Tips + Templates */}
            <div className="rounded-2xl bg-white/[0.02] p-5">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-5">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] text-foreground-700 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.04] mb-4"></div>

              {/* AI Tips */}
              <h4 className="text-white text-xs font-medium mb-3 flex items-center gap-1.5">
                <i className="ri-lightbulb-line text-ai-accent text-sm"></i>
                AI 优化建议
              </h4>
              <div className="space-y-2 mb-4">
                {[
                  { text: 'LinkedIn 最佳发布时间：周二/周四 8:00-10:00' },
                  { text: '建议添加 #B2B增长 #AI营销 提升曝光' },
                  { text: '配图内容点击率平均提升 65%' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-foreground-600 leading-relaxed">
                    <span className="w-1 h-1 rounded-full bg-foreground-700 mt-1.5 shrink-0"></span>
                    <span>{tip.text}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.04] mb-4"></div>

              {/* Quick Templates */}
              <h4 className="text-white text-xs font-medium mb-2">快捷模板</h4>
              <div className="space-y-1">
                {templateList.map((t) => {
                  const isActive = selectedTemplate === t;
                  return (
                    <button
                      key={t}
                      onClick={() => handleApplyTemplate(t)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'text-primary-400 bg-primary-500/8'
                          : 'text-foreground-500 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publish Confirm Modal */}
      {showPublishConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 rounded-2xl bg-[#1a1a2e] border border-white/[0.06] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                <i className="ri-question-line text-primary-400 text-lg"></i>
              </div>
              <div>
                <h3 className="text-white font-semibold">确认{scheduleMode === 'now' ? '发布' : '排期'}？</h3>
                <p className="text-foreground-600 text-xs mt-0.5">
                  内容将{scheduleMode === 'now' ? '立即' : `于 ${scheduleDate} ${scheduleTime}`}分发至以下平台
                </p>
              </div>
            </div>
            <div className="space-y-1.5 mb-4 max-h-[180px] overflow-y-auto">
              {selectedConnected.map((pid) => {
                const p = platforms.find((plat) => plat.id === pid);
                if (!p) return null;
                return (
                  <div key={pid} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03]">
                    <i className={`${p.icon} text-sm`} style={{ color: p.color }}></i>
                    <span className="text-white text-xs">{p.name}</span>
                    <span className="ml-auto text-[10px] text-foreground-700">{p.followerCount.toLocaleString()} 粉丝</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPublishConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-white/[0.08] text-foreground-500 hover:text-white hover:bg-white/[0.03] transition-colors text-sm cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={confirmPublish}
                className="flex-1 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <i className="ri-send-plane-fill"></i>
                确认{scheduleMode === 'now' ? '发布' : '排期'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}