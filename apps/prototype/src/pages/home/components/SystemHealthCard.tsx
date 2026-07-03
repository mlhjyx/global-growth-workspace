// 系统健康区（EPIC-M0-04 T4，PG-001 第六区）：数据/模型/渠道/邮件/成本/配额摘要。
// 验收口径：接近预算、账号风险、供应商降级要可见；入口指向 Operations Console（PG-013，M1）。
const HEALTH_ITEMS: {
  icon: string;
  label: string;
  status: 'ok' | 'warn' | 'off';
  summary: string;
}[] = [
  {
    icon: 'ri-database-2-line',
    label: '数据源',
    status: 'warn',
    summary: '公开来源正常 · 贸易/企业供应商未选定（OD-07，Bake-off 待启动）',
  },
  {
    icon: 'ri-cpu-line',
    label: '模型 Gateway',
    status: 'ok',
    summary: '正常 · 今日 Token 成本 USD 4.2 / 日预算 20',
  },
  {
    icon: 'ri-share-forward-line',
    label: '发布渠道',
    status: 'off',
    summary: '未连接（M0 模拟 · 首批平台待决策 OD-04）',
  },
  {
    icon: 'ri-mail-line',
    label: '邮件基础设施',
    status: 'off',
    summary: '未配置（草稿 vs 真实发送未决策 OD-05）',
  },
  {
    icon: 'ri-money-dollar-circle-line',
    label: '本月成本',
    status: 'warn',
    summary: 'USD 86 / 预算 200（43%）· 研究占 72%',
  },
  {
    icon: 'ri-stack-line',
    label: '配额',
    status: 'ok',
    summary: '联系人解锁 40/100 · 视频渲染 0/10（M1 启用）',
  },
];

const DOT: Record<string, string> = {
  ok: 'bg-success',
  warn: 'bg-warning',
  off: 'bg-foreground-600',
};

export default function SystemHealthCard() {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-primary-500/10 p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-sm font-semibold">
          <i className="ri-heart-pulse-line text-primary-400 mr-1.5"></i>系统健康
        </h3>
        <Link
          to="/ops"
          className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-foreground-500 hover:text-primary-300"
          title="Operations Console（PG-013）占位，M1 实装"
        >
          Operations Console <i className="ri-arrow-right-line"></i>
        </Link>
      </div>
      <div className="space-y-2">
        {HEALTH_ITEMS.map((h) => (
          <div key={h.label} className="flex items-start gap-2">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${DOT[h.status]}`}></span>
            <div className="min-w-0">
              <p className="text-foreground-300 text-xs">
                <i className={`${h.icon} mr-1 text-foreground-500`}></i>
                {h.label}
              </p>
              <p className="text-foreground-600 text-[10px] mt-0.5">{h.summary}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-foreground-700 text-[10px] mt-3">
        （M0 静态模拟）真实实现：接近预算/账号风险/供应商降级实时告警，异常带恢复动作
      </p>
    </div>
  );
}
