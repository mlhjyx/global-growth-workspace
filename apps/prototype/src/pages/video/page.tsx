// PG-008 Video Studio 低保真占位（EPIC-M0-04 T3，母本 6.12.6 七区骨架；CRT/VID 域 M1-M2 实装）。
// 骨架先立验收语义：素材权利（RightsRecord）与企业事实（Claim）必须可追溯，未审批/无权利不能发布。
const ZONES = [
  {
    key: 'brief',
    icon: 'ri-target-line',
    name: 'Brief',
    content: '目标、受众、平台、语言、时长、CTA、品牌',
    action: '从 Campaign 继承 / 修改 / 选择模板',
    acceptance: '上下文完整性检查',
  },
  {
    key: 'script',
    icon: 'ri-file-text-line',
    name: 'Script 脚本',
    content: 'Hook、场景、旁白、字幕、事实引用',
    action: '编辑 / 重写 / 锁定段落 / 事实检查',
    acceptance: '关键说法有 Claim',
  },
  {
    key: 'storyboard',
    icon: 'ri-layout-grid-line',
    name: 'Storyboard 分镜',
    content: '镜头、素材类型、画面、转场、时长',
    action: '拖排 / 替换 / 生成镜头',
    acceptance: '支持生成与素材编排混合',
  },
  {
    key: 'assets',
    icon: 'ri-image-2-line',
    name: 'Assets 素材',
    content: '客户素材、图库、生成素材、音乐、字体',
    action: '上传 / 授权 / 搜索 / 替换',
    acceptance: '每项有 RightsRecord',
  },
  {
    key: 'voice',
    icon: 'ri-mic-line',
    name: 'Voice / Caption',
    content: '声音、语速、语言、字幕、术语',
    action: '试听 / 校正 / 重新生成',
    acceptance: '专有名词和数字正确',
  },
  {
    key: 'render',
    icon: 'ri-film-line',
    name: 'Render 渲染',
    content: '比例、分辨率、成本、队列、版本',
    action: '预览 / 取消 / 重试 / 生成变体',
    acceptance: '失败保留中间产物',
  },
  {
    key: 'approval',
    icon: 'ri-shield-check-line',
    name: 'Approval / Publish',
    content: '事实、品牌、版权、平台预览',
    action: '提交审批 / 进入日历',
    acceptance: '未审批 / 无权利不能发布',
  },
];

export default function VideoPage() {
  return (
    <div className="flex flex-col md:h-[calc(100vh-3.5rem)]">
      <div
        className="flex flex-col md:flex-row md:items-center justify-between px-3 md:px-5 py-2.5 md:py-3 border-b border-primary-500/10 shrink-0 gap-2"
        style={{
          background: 'linear-gradient(90deg, rgba(12,10,26,0.8) 0%, rgba(26,16,60,0.6) 100%)',
        }}
      >
        <div>
          <h1 className="text-white text-base md:text-lg font-semibold">视频工作室 Video Studio</h1>
          <p className="text-foreground-500 text-xs mt-0.5">
            PG-008 七区骨架（低保真占位）· 素材权利与企业事实必须可追溯（母本 6.12.6）
          </p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded bg-warning/10 text-warning self-start md:self-auto">
          M1-M2 实装（CRT/VID 域）· 视频渲染经 Video Gateway，不直连厂商
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {ZONES.map((z, i) => (
            <div
              key={z.key}
              className="rounded-xl border border-dashed border-primary-500/20 bg-white/[0.02] p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-xs font-semibold">
                  <i className={`${z.icon} text-primary-400 mr-1.5`}></i>
                  {i + 1}. {z.name}
                </p>
                <span className="text-[9px] text-foreground-700">占位</span>
              </div>
              <p className="text-foreground-400 text-[11px]">{z.content}</p>
              <p className="text-foreground-600 text-[10px] mt-1.5">操作：{z.action}</p>
              <p className="text-[10px] mt-1.5">
                <span className="text-foreground-600">验收：</span>
                <span className="text-primary-300">{z.acceptance}</span>
              </p>
            </div>
          ))}

          {/* 治理硬约束卡（与七区并列展示，提醒占位期也不放松边界） */}
          <div className="rounded-xl border border-error/30 bg-error/5 p-4">
            <p className="text-error text-xs font-semibold mb-2">
              <i className="ri-forbid-line mr-1.5"></i>硬约束（占位期即生效的验收口径）
            </p>
            <ul className="text-foreground-400 text-[11px] space-y-1">
              <li>· 关键说法无 Approved Claim → 脚本不能锁定</li>
              <li>· 素材无 RightsRecord → 不能进入渲染队列</li>
              <li>· 未过审批 → 不能进入发布日历（PG-009）</li>
              <li>· 渲染失败保留中间产物，成本可解释（ANA-005）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
