import { platforms as allPlatforms } from '@/mocks/publishData';

interface PlatformSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  const connectedPlatforms = allPlatforms.filter((p) => p.connected);
  const disconnectedPlatforms = allPlatforms.filter((p) => !p.connected);

  const togglePlatform = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const selectAllConnected = () => {
    onChange(connectedPlatforms.map((p) => p.id));
  };

  const clearAll = () => {
    onChange([]);
  };

  const PlatformCard = ({ platform }: { platform: typeof allPlatforms[0] }) => {
    const isSelected = selected.includes(platform.id);
    const isConnected = platform.connected;

    return (
      <button
        onClick={() => isConnected && togglePlatform(platform.id)}
        disabled={!isConnected}
        className={`relative w-full text-left rounded-lg p-3 transition-all cursor-pointer ${
          isSelected
            ? 'bg-primary-500/8'
            : isConnected
              ? 'bg-white/[0.02] hover:bg-white/[0.04]'
              : 'bg-white/[0.01] opacity-40 cursor-not-allowed'
        }`}
      >
        <div className="flex items-start gap-2.5">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: isConnected ? `${platform.color}15` : 'transparent' }}
          >
            <i
              className={`${platform.icon} text-base`}
              style={{ color: isConnected ? platform.color : '#4b5563' }}
            ></i>
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-white text-xs font-medium">{platform.name}</span>
              {!isConnected && (
                <span className="text-[9px] px-1 py-0.5 rounded bg-foreground-900/40 text-foreground-700">
                  未连接
                </span>
              )}
            </div>
            <div className="text-[10px] text-foreground-700 mt-0.5">{platform.format}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-foreground-800">
                限 {platform.charLimit.toLocaleString()} 字
              </span>
              {isConnected && platform.followerCount > 0 && (
                <span className="text-[10px] text-foreground-800">
                  {platform.followerCount.toLocaleString()} 粉丝
                </span>
              )}
            </div>
          </div>
          {isConnected && (
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                isSelected
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-foreground-700 bg-transparent'
              }`}
            >
              {isSelected && <i className="ri-check-line text-white text-[10px]"></i>}
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="rounded-2xl bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-ai-accent/10 flex items-center justify-center">
            <i className="ri-share-forward-line text-ai-accent text-sm"></i>
          </span>
          <h3 className="text-white font-medium text-sm">发布平台</h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={selectAllConnected}
            className="text-[10px] px-2 py-1 rounded bg-white/[0.03] text-foreground-600 hover:text-foreground-400 hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            全选
          </button>
          <button
            onClick={clearAll}
            className="text-[10px] px-2 py-1 rounded bg-white/[0.03] text-foreground-600 hover:text-foreground-400 hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            清空
          </button>
        </div>
      </div>

      {/* 已连接平台 */}
      <div className="space-y-2">
        <div className="text-[10px] text-foreground-700 uppercase tracking-wider font-medium mb-2">
          已连接 ({connectedPlatforms.length})
        </div>
        <div className="grid grid-cols-1 gap-2">
          {connectedPlatforms.map((p) => (
            <PlatformCard key={p.id} platform={p} />
          ))}
        </div>
      </div>

      {/* 分割线 */}
      <div className="my-3 border-t border-white/[0.04]"></div>

      {/* 未连接平台 */}
      <div className="space-y-2">
        <div className="text-[10px] text-foreground-700 uppercase tracking-wider font-medium mb-2">
          可连接 ({disconnectedPlatforms.length})
        </div>
        <div className="grid grid-cols-1 gap-2">
          {disconnectedPlatforms.map((p) => (
            <PlatformCard key={p.id} platform={p} />
          ))}
        </div>
      </div>

      {/* 已选统计 */}
      {selected.length > 0 && (
        <div className="mt-3 p-2.5 rounded-lg bg-primary-500/5">
          <div className="text-[10px] text-primary-400 flex items-center gap-1.5">
            <i className="ri-check-double-line"></i>
            已选择 {selected.length} 个平台
            <span className="text-foreground-700">
              （预估覆盖 {selected.reduce((sum, id) => {
                const p = allPlatforms.find((ap) => ap.id === id);
                return sum + (p?.followerCount || 0);
              }, 0).toLocaleString()} 粉丝）
            </span>
          </div>
        </div>
      )}
    </div>
  );
}