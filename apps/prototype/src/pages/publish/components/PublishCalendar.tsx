import { useState } from 'react';
import { publishHistory } from '@/mocks/publishData';

export default function PublishCalendar() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'history'>('schedule');

  const scheduled = publishHistory.filter((p) => p.status === 'scheduled');
  const history = publishHistory.filter((p) => p.status !== 'scheduled' && p.status !== 'draft');
  const drafts = publishHistory.filter((p) => p.status === 'draft');

  const platformBadge = (platforms: string[]) => {
    const map: Record<string, { color: string; icon: string; name: string }> = {
      linkedin: { color: '#0A66C2', icon: 'ri-linkedin-box-fill', name: 'LinkedIn' },
      twitter: { color: '#000000', icon: 'ri-twitter-x-fill', name: 'X' },
      wechat: { color: '#07C160', icon: 'ri-wechat-fill', name: '微信' },
      xiaohongshu: { color: '#FF2442', icon: 'ri-book-marked-fill', name: '小红书' },
      weibo: { color: '#E6162D', icon: 'ri-microscope-fill', name: '微博' },
      tiktok: { color: '#000000', icon: 'ri-music-fill', name: '抖音' },
      bilibili: { color: '#FB7299', icon: 'ri-tv-fill', name: 'B站' },
      facebook: { color: '#0866FF', icon: 'ri-facebook-box-fill', name: 'FB' },
    };
    return platforms.map((pid) => {
      const info = map[pid];
      if (!info) return null;
      return (
        <span
          key={pid}
          className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: `${info.color}15`,
            color: info.color,
            border: `1px solid ${info.color}25`,
          }}
        >
          <i className={info.icon}></i>
          {info.name}
        </span>
      );
    });
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string; icon: string }> = {
      published: {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        label: '已发布',
        icon: 'ri-checkbox-circle-line',
      },
      scheduled: {
        bg: 'bg-primary-500/10',
        text: 'text-primary-400',
        label: '已排期',
        icon: 'ri-time-line',
      },
      failed: {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        label: '发布失败',
        icon: 'ri-error-warning-line',
      },
      draft: {
        bg: 'bg-foreground-900/30',
        text: 'text-foreground-600',
        label: '草稿',
        icon: 'ri-draft-line',
      },
    };
    const s = map[status] || map.draft;
    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${s.bg} ${s.text} border border-current/20`}
      >
        <i className={s.icon}></i>
        {s.label}
      </span>
    );
  };

  return (
    <div className="rounded-2xl bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary-500/10 flex items-center justify-center">
            <i className="ri-calendar-todo-line text-primary-400 text-sm"></i>
          </span>
          <h3 className="text-white font-medium text-sm">发布管理</h3>
        </div>
        <div className="flex bg-white/[0.03] rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-foreground-600 hover:text-foreground-400'
            }`}
          >
            发布日程
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-foreground-600 hover:text-foreground-400'
            }`}
          >
            发布历史
          </button>
        </div>
      </div>

      {activeTab === 'schedule' ? (
        <div className="space-y-2">
          {scheduled.length === 0 && drafts.length === 0 ? (
            <div className="text-center py-8 text-foreground-700 text-sm">
              <i className="ri-calendar-line text-2xl mb-2 block"></i>
              暂无排期内容
            </div>
          ) : (
            <>
              {scheduled.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="shrink-0 w-12 text-center">
                    <div className="text-[10px] text-foreground-700">
                      {item.scheduledAt?.split(' ')[0].split('-')[1]}月
                    </div>
                    <div className="text-lg font-bold text-white leading-tight">
                      {item.scheduledAt?.split(' ')[0].split('-')[2]}
                    </div>
                    <div className="text-[10px] text-foreground-700">
                      {item.scheduledAt?.split(' ')[1]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{item.title}</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {platformBadge(item.platforms)}
                    </div>
                  </div>
                  <div className="shrink-0">{statusBadge(item.status)}</div>
                </div>
              ))}
              {drafts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                >
                  <div className="shrink-0 w-12 text-center">
                    <div className="text-[10px] text-foreground-800">草稿</div>
                    <div className="text-lg font-bold text-foreground-600 leading-tight">—</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground-400 text-sm font-medium truncate">
                      {item.title}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {platformBadge(item.platforms)}
                    </div>
                  </div>
                  <div className="shrink-0">{statusBadge(item.status)}</div>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-8 text-foreground-700 text-sm">
              <i className="ri-history-line text-2xl mb-2 block"></i>
              暂无发布记录
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="shrink-0 w-12 text-center">
                  <div className="text-[10px] text-foreground-700">
                    {item.publishedAt?.split(' ')[0].split('-')[1]}月
                  </div>
                  <div className="text-lg font-bold text-white leading-tight">
                    {item.publishedAt?.split(' ')[0].split('-')[2]}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{item.title}</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">{platformBadge(item.platforms)}</div>
                  {item.engagement && (
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-foreground-700">
                      <span className="flex items-center gap-1">
                        <i className="ri-eye-line"></i>
                        {item.engagement.impressions.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ri-heart-3-line"></i>
                        {item.engagement.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ri-share-forward-line"></i>
                        {item.engagement.shares.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ri-cursor-line"></i>
                        {item.engagement.clicks.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="shrink-0">{statusBadge(item.status)}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
