// J-A / J-B 旅程定义（EPIC-M0-06 T1，母本 13.9）。
// 串线口径（Dev-Ready 包）：目标→研究→ICP→Lead→Campaign→授权→Inbox→SAO；
// J-B 按母本 13.9 增加 Pack/内容/专家环节。步骤 path 指向承载页，hint 是该步的任务判定。

export type JourneyId = 'JA' | 'JB';

export interface JourneyStep {
  id: string;
  label: string;
  path: string;
  /** 本步的用户任务与完成判定（UAT 脚本同源引用） */
  hint: string;
}

export interface JourneyDef {
  id: JourneyId;
  name: string;
  goal: string;
  steps: JourneyStep[];
}

export const JOURNEYS: Record<JourneyId, JourneyDef> = {
  JA: {
    id: 'JA',
    name: 'J-A 主动获客',
    goal: '无历史数据，从官网+产品出发拿到销售接受的海外机会（SAO）',
    steps: [
      { id: 'goal', label: '目标', path: '/dashboard', hint: '在目标启动器确认获客目标与范围' },
      { id: 'research', label: '研究', path: '/research', hint: '全球扫描并深读目标市场（含竞争情报）' },
      { id: 'icp', label: 'ICP', path: '/accounts', hint: '确认 ICP 画像与六维评分口径' },
      { id: 'lead', label: 'Lead', path: '/accounts', hint: '在四队列中确认一批合格线索' },
      { id: 'campaign', label: 'Campaign', path: '/campaigns', hint: '编排画布：受众/内容/序列就位' },
      { id: 'authorize', label: '授权', path: '/campaigns', hint: 'Dry-Run 预检后批准并签发执行授权' },
      { id: 'inbox', label: 'Inbox', path: '/engagement', hint: '在统一收件箱处理回复并确认意向' },
      { id: 'sao', label: 'SAO', path: '/insights', hint: '在结果链看到 QL→SAO 转化并确认机会' },
    ],
  },
  JB: {
    id: 'JB',
    name: 'J-B 经销商招募',
    goal: '指定国家/产品，招募合格渠道伙伴机会',
    steps: [
      { id: 'goal', label: '目标', path: '/dashboard', hint: '在目标启动器确认招募国家与产品线' },
      { id: 'pack', label: '市场包', path: '/research', hint: '查看 Market/Industry Pack 与准入要点' },
      { id: 'partners', label: '渠道线索', path: '/accounts', hint: '基于贸易/协会数据确认候选经销商' },
      { id: 'content', label: '内容', path: '/content', hint: '生成基于 Approved Claim 的招募内容' },
      { id: 'expert', label: '专家', path: '/expert', hint: '专家评审本地化与合规口径（占位页）' },
      { id: 'authorize', label: '授权', path: '/campaigns', hint: '编排招募 Campaign 并批准执行授权' },
      { id: 'inbox', label: 'Inbox', path: '/engagement', hint: '处理经销商回复并确认合作意向' },
      { id: 'sao', label: 'SAO', path: '/insights', hint: '在结果链确认合格渠道伙伴机会' },
    ],
  },
};
