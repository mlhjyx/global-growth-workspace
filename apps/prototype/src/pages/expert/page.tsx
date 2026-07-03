// PG-011 Expert Workspace 低保真占位（EPIC-M0-05 T3；EXP 域 M1 实装）。
// 硬验收：客户私有资料不得进入通用知识（母本 6.12.7 相邻表）。
const ZONES = [
  {
    icon: 'ri-file-list-3-line',
    name: 'Expert Brief',
    desc: '任务背景、范围、结论用途、截止时间',
    acc: '上下文完整才可派发',
  },
  {
    icon: 'ri-folder-lock-line',
    name: '文件与资料',
    desc: '脱敏后的客户资料、公开材料',
    acc: '客户私有资料不得进入通用知识',
  },
  {
    icon: 'ri-question-answer-line',
    name: '补充问题',
    desc: '专家↔平台双向澄清线程',
    acc: '问答留痕可审计',
  },
  { icon: 'ri-time-line', name: 'SLA', desc: '响应/交付时限、超时升级', acc: '超时自动提醒 Owner' },
  {
    icon: 'ri-file-check-line',
    name: '交付',
    desc: '结论、依据、置信度、适用边界',
    acc: '高风险结论必须专家署名（D-018）',
  },
  {
    icon: 'ri-share-circle-line',
    name: '知识回流',
    desc: '结论转 Claim 候选进审核台',
    acc: '经 KNW 生命周期，不直接入库',
  },
];

export default function ExpertPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-white text-lg font-semibold">
        专家工作台 Expert Workspace
        <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-warning/10 text-warning align-middle">
          PG-011 低保真占位 · EXP 域 M1-M2 实装
        </span>
      </h1>
      <p className="text-foreground-500 text-xs mt-1 mb-4">
        法律/财税/认证/价格等高风险结论由专家确认，LLM 不做最终结论（D-018）
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ZONES.map((z) => (
          <div
            key={z.name}
            className="rounded-xl border border-dashed border-primary-500/20 bg-white/[0.02] p-4"
          >
            <p className="text-white text-xs font-semibold">
              <i className={`${z.icon} text-primary-400 mr-1.5`}></i>
              {z.name}
            </p>
            <p className="text-foreground-400 text-[11px] mt-1">{z.desc}</p>
            <p className="text-[10px] mt-1.5">
              <span className="text-foreground-600">验收：</span>
              <span className="text-primary-300">{z.acc}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
