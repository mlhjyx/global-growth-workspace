import { useState } from 'react';
import type { ContentItem } from '@/mocks/contentData';

interface Props {
  items: ContentItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const typeIcons: Record<string, string> = {
  blog: 'ri-article-line',
  social: 'ri-share-line',
  email: 'ri-mail-line',
  whitepaper: 'ri-file-text-line',
  video: 'ri-video-line',
  landing: 'ri-pages-line',
  'case-study': 'ri-lightbulb-line',
};

const typeLabels: Record<string, string> = {
  blog: '博客',
  social: '社交媒体',
  email: '邮件',
  whitepaper: '白皮书',
  video: '视频',
  landing: '落地页',
  'case-study': '案例',
};

const statusLabels: Record<string, string> = {
  draft: '草稿',
  review: '审核中',
  approved: '已审批',
  published: '已发布',
  archived: '已归档',
};

const statusColor: Record<string, string> = {
  draft: 'bg-foreground-500/20 text-foreground-500',
  review: 'bg-warning/20 text-warning',
  approved: 'bg-info/20 text-info',
  published: 'bg-success/20 text-success',
  archived: 'bg-foreground-600/20 text-foreground-600',
};

const scoreColor = (score: number): string => {
  if (score >= 90) return 'text-success';
  if (score >= 70) return 'text-warning';
  return 'text-error';
};

export default function ContentLibrary({ items, selectedId, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = items.filter((item) => {
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || item.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2 shrink-0">
        <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-4 h-4 flex items-center justify-center text-primary-400">
            <i className="ri-folder-3-line"></i>
          </span>
          内容库
          <span className="text-foreground-600 text-xs font-normal ml-auto">{items.length} 条</span>
        </h3>
        <div className="relative mb-3">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 flex items-center justify-center text-foreground-600">
            <i className="ri-search-line text-xs"></i>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索内容..."
            className="w-full bg-white/5 border border-primary-500/10 rounded-lg py-1.5 pl-7.5 pr-3 text-white text-xs placeholder:text-foreground-600 focus:outline-none focus:border-primary-500/30"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {['all', 'whitepaper', 'social', 'email', 'landing', 'blog'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                typeFilter === t
                  ? 'bg-primary-500/20 text-primary-300'
                  : 'bg-white/5 text-foreground-500 hover:bg-white/10'
              }`}
            >
              {t === 'all' ? '全部' : typeLabels[t] || t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3">
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-foreground-600 text-xs">无匹配内容</div>
        ) : (
          <div className="space-y-1">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full text-left p-2.5 rounded-lg transition-all cursor-pointer ${
                  item.id === selectedId
                    ? 'bg-primary-500/10 border border-primary-500/20'
                    : 'bg-white/3 border border-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`w-5 h-5 flex items-center justify-center text-xs mt-0.5 shrink-0 ${item.id === selectedId ? 'text-primary-400' : 'text-foreground-500'}`}
                  >
                    <i className={typeIcons[item.type] || 'ri-file-line'}></i>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${statusColor[item.status]}`}
                      >
                        {statusLabels[item.status]}
                      </span>
                      <span className={`text-[10px] ${scoreColor(item.complianceScore)}`}>
                        合规 {item.complianceScore}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-foreground-600 text-[10px]">
                        {item.language.toUpperCase()}
                      </span>
                      <span className="text-foreground-600 text-[10px]">{item.targetMarket}</span>
                      <span className="text-foreground-600 text-[10px]">{item.wordCount}字</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
