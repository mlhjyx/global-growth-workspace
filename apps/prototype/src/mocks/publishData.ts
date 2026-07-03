export interface PublishPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  charLimit: number;
  format: string;
  followerCount: number;
}

export interface PublishRecord {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  status: 'scheduled' | 'published' | 'failed' | 'draft';
  scheduledAt?: string;
  publishedAt?: string;
  engagement?: {
    impressions: number;
    clicks: number;
    likes: number;
    shares: number;
  };
  tags: string[];
  imageUrl?: string;
}

export const platforms: PublishPlatform[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'ri-linkedin-box-fill',
    color: '#0A66C2',
    connected: true,
    charLimit: 3000,
    format: '专业长文 / 短动态',
    followerCount: 2847,
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: 'ri-twitter-x-fill',
    color: '#000000',
    connected: true,
    charLimit: 280,
    format: '短文本 + 话题',
    followerCount: 5620,
  },
  {
    id: 'wechat',
    name: '微信公众号',
    icon: 'ri-wechat-fill',
    color: '#07C160',
    connected: true,
    charLimit: 20000,
    format: '长图文文章',
    followerCount: 12580,
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: 'ri-book-marked-fill',
    color: '#FF2442',
    connected: true,
    charLimit: 1000,
    format: '图文笔记',
    followerCount: 3420,
  },
  {
    id: 'weibo',
    name: '微博',
    icon: 'ri-microscope-fill',
    color: '#E6162D',
    connected: false,
    charLimit: 5000,
    format: '短文 + 话题',
    followerCount: 0,
  },
  {
    id: 'tiktok',
    name: '抖音',
    icon: 'ri-music-fill',
    color: '#000000',
    connected: false,
    charLimit: 500,
    format: '短视频描述',
    followerCount: 0,
  },
  {
    id: 'bilibili',
    name: 'Bilibili',
    icon: 'ri-tv-fill',
    color: '#FB7299',
    connected: false,
    charLimit: 2000,
    format: '视频简介 + 标签',
    followerCount: 0,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'ri-facebook-box-fill',
    color: '#0866FF',
    connected: true,
    charLimit: 63206,
    format: '帖子 / 图文',
    followerCount: 1890,
  },
];

export const publishHistory: PublishRecord[] = [
  {
    id: 'pub-001',
    title: '2024 B2B 出海增长白皮书：AI 驱动的精准获客方法论',
    content: '基于 GrowthOS 平台 10,000+ 企业客户的数据洞察，我们发布了这份年度出海增长白皮书...',
    platforms: ['linkedin', 'wechat'],
    status: 'published',
    publishedAt: '2026-06-28 09:30',
    engagement: { impressions: 12470, clicks: 832, likes: 456, shares: 128 },
    tags: ['B2B增长', '出海营销', 'AI获客'],
  },
  {
    id: 'pub-002',
    title: '如何用 ICP 画像将线索转化率提升 3 倍？',
    content: '大多数 B2B 企业在做获客时，往往陷入"广撒网"的误区...',
    platforms: ['linkedin', 'twitter', 'xiaohongshu'],
    status: 'published',
    publishedAt: '2026-06-25 14:00',
    engagement: { impressions: 8930, clicks: 621, likes: 342, shares: 89 },
    tags: ['ICP画像', '线索转化', '精准营销'],
  },
  {
    id: 'pub-003',
    title: 'GrowthOS 新功能发布：AI 内容助手 2.0',
    content: '我们很高兴宣布 AI 内容助手迎来重大升级，新增多语言生成、风格迁移和一键合规检查...',
    platforms: ['linkedin', 'twitter', 'wechat', 'facebook'],
    status: 'published',
    publishedAt: '2026-06-20 10:00',
    engagement: { impressions: 21560, clicks: 1843, likes: 967, shares: 312 },
    tags: ['产品更新', 'AI助手', '内容营销'],
  },
  {
    id: 'pub-004',
    title: '东南亚 SaaS 市场：下一个十亿级增长机会',
    content: '东南亚数字经济正在以年均 20% 的速度增长，SaaS 渗透率仅为北美的 1/5...',
    platforms: ['linkedin', 'wechat', 'xiaohongshu'],
    status: 'scheduled',
    scheduledAt: '2026-07-05 08:00',
    tags: ['东南亚市场', 'SaaS趋势', '出海机会'],
  },
  {
    id: 'pub-005',
    title: '客户案例：某工业软件企业 6 个月实现海外营收翻倍',
    content: '这家位于苏州的工业软件企业，通过 GrowthOS 的 AI 获客引擎...',
    platforms: ['linkedin', 'wechat'],
    status: 'scheduled',
    scheduledAt: '2026-07-08 14:30',
    tags: ['客户案例', '工业软件', '海外营收'],
  },
  {
    id: 'pub-006',
    title: '7 月全球 B2B 营销热点日历',
    content: '7 月有哪些值得关注的 B2B 营销节点？我们从全球视角为你整理...',
    platforms: ['twitter', 'xiaohongshu', 'weibo'],
    status: 'draft',
    tags: ['热点日历', 'B2B营销', '7月'],
  },
  {
    id: 'pub-007',
    title: '邮件营销已死？数据告诉你真相',
    content: '有人说邮件营销已经过时了，但我们的数据显示...',
    platforms: ['linkedin', 'twitter'],
    status: 'failed',
    publishedAt: '2026-06-18 11:00',
    tags: ['邮件营销', '数据洞察', '渠道分析'],
  },
  {
    id: 'pub-008',
    title: 'AI 时代的内容合规：GDPR 3.0 对营销人的影响',
    content: '随着 GDPR 3.0 草案的发布，AI 生成内容的合规要求变得更加严格...',
    platforms: ['linkedin', 'wechat', 'facebook'],
    status: 'scheduled',
    scheduledAt: '2026-07-12 09:00',
    tags: ['合规', 'GDPR', 'AI内容'],
  },
];

export const contentTemplates = [
  { id: 'industry-insight', name: '行业洞察', desc: '基于数据和趋势的专业分析文章' },
  { id: 'product-update', name: '产品更新', desc: '新功能发布和产品动态' },
  { id: 'case-study', name: '客户案例', desc: '成功案例和数据成果展示' },
  { id: 'thought-leadership', name: '思想领袖', desc: '观点输出和趋势预判' },
  { id: 'how-to-guide', name: '操作指南', desc: '实用教程和最佳实践' },
  { id: 'event-promo', name: '活动推广', desc: ' webinar、峰会等活动宣传' },
];

export const toneOptions = [
  { id: 'professional', name: '专业严谨', desc: '数据驱动、逻辑清晰' },
  { id: 'casual', name: '轻松活泼', desc: '口语化、亲和力强' },
  { id: 'authoritative', name: '权威可信', desc: '行业专家、背书感' },
  { id: 'friendly', name: '亲切友好', desc: '温暖对话、用户视角' },
  { id: 'data-driven', name: '数据驱动', desc: '图表、数字、洞察' },
];