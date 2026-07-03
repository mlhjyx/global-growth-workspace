// PG-013 Operations Console 低保真占位（EPIC-M0-05 T3；M1 实装，系统健康卡已指向此处）。
// 硬验收：管理员可暂停单 Provider、单 Campaign 或整个 Workspace（Kill Switch，R3 变更）。
const ZONES = [
  {
    icon: 'ri-database-2-line',
    name: 'Provider 管理',
    desc: '数据/模型/媒体/渠道 Provider 状态与配额',
    acc: '可暂停单 Provider',
  },
  {
    icon: 'ri-cpu-line',
    name: '模型与路由',
    desc: 'Model Gateway 路由、预算、降级',
    acc: '跨境调用按 Workspace 授权（OD-13）',
  },
  {
    icon: 'ri-apps-2-line',
    name: '平台连接',
    desc: '发布/互动平台 Token 健康、App Review 状态',
    acc: 'Token 过期=Needs Action 态',
  },
  {
    icon: 'ri-stack-line',
    name: '队列与作业',
    desc: 'Outbox/DLQ 深度、Workflow 运行、重试',
    acc: 'DLQ 可见可重放（BE-05）',
  },
  {
    icon: 'ri-money-dollar-circle-line',
    name: '成本',
    desc: '五类成本口径（ANA-005）与预算告警',
    acc: '接近预算先告警后熔断',
  },
  {
    icon: 'ri-shield-keyhole-line',
    name: '审计与事故',
    desc: '审计日志检索、事故时间线、Kill Switch',
    acc: '暂停 Campaign/Workspace 留痕（R3）',
  },
];

export default function OpsPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-white text-lg font-semibold">
        运维控制台 Operations Console
        <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-warning/10 text-warning align-middle">
          PG-013 低保真占位 · M1 实装
        </span>
      </h1>
      <p className="text-foreground-500 text-xs mt-1 mb-4">
        Kill Switch 变更属 R3（必须人工批准）；Today 系统健康卡为其摘要入口
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
