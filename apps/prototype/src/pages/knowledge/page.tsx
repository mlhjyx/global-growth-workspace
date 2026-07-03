import { useState, useMemo } from 'react';
import { knowledgeCategories, knowledgeDocs, recentSearches } from '@/mocks/knowledgeData';
import type { KnowledgeDoc } from '@/mocks/knowledgeData';

const typeColors: Record<string, { bg: string; text: string; icon: string }> = {
  article: { bg: 'bg-ai-accent/10', text: 'text-ai-accent', icon: 'ri-article-line' },
  guide: { bg: 'bg-primary-500/10', text: 'text-primary-400', icon: 'ri-guide-line' },
  playbook: { bg: 'bg-foreground-500/10', text: 'text-foreground-400', icon: 'ri-book-open-line' },
  template: { bg: 'bg-green-500/10', text: 'text-green-400', icon: 'ri-file-copy-line' },
  faq: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: 'ri-questionnaire-line' },
};

const typeLabels: Record<string, string> = {
  article: '文章',
  guide: '指南',
  playbook: '剧本',
  template: '模板',
  faq: 'FAQ',
};

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    () => new Set(knowledgeDocs.filter((d) => d.isBookmarked).map((d) => d.id)),
  );

  const filteredDocs = useMemo(() => {
    let docs = [...knowledgeDocs];
    if (activeCategory !== 'all') {
      docs = docs.filter((d) => d.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          d.author.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q),
      );
    }
    return docs;
  }, [searchQuery, activeCategory]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-primary-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h1 className="text-xl font-semibold text-white">企业知识库</h1>
            <p className="text-sm text-foreground-500 mt-0.5">
              {knowledgeDocs.length} 篇文档 · 覆盖战役、ICP、内容、集成等 6 大领域
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground-600 bg-background-100/50 px-3 py-1.5 rounded-full">
              <i className="ri-bookmark-line mr-1"></i>
              {bookmarkedIds.size} 收藏
            </span>
            <button className="text-xs bg-primary-500/15 text-primary-400 px-3 py-1.5 rounded-full border border-primary-500/20 hover:bg-primary-500/25 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-add-line mr-1"></i>
              新建文档
            </button>
          </div>
        </div>

        {/* Search + Categories */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-500 text-sm"></i>
            <input
              type="text"
              placeholder="搜索文档、标签、作者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background-100/40 border border-primary-500/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-foreground-600 focus:outline-none focus:border-primary-500/30"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'bg-background-100/30 text-foreground-500 border border-primary-500/8 hover:bg-background-100/50'
              }`}
            >
              全部
            </button>
            {knowledgeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-background-100/30 text-foreground-500 border border-primary-500/8 hover:bg-background-100/50'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Recent searches */}
        {recentSearches.length > 0 && !searchQuery && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-foreground-600">最近搜索：</span>
            {recentSearches.map((s) => (
              <button
                key={s}
                onClick={() => setSearchQuery(s)}
                className="text-xs text-foreground-500 hover:text-primary-400 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Document Grid */}
      <div className="flex-1 overflow-auto px-4 md:px-6 py-4">
        {filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-3">
              <i className="ri-search-2-line text-primary-400 text-xl"></i>
            </div>
            <p className="text-foreground-500 text-sm">未找到匹配的文档</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="text-xs text-primary-400 mt-2 hover:underline cursor-pointer"
            >
              清除筛选
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDocs.map((doc: KnowledgeDoc) => {
              const typeStyle = typeColors[doc.type];
              return (
                <div
                  key={doc.id}
                  className="group bg-background-100/30 border border-primary-500/8 rounded-xl p-4 hover:border-primary-500/20 hover:bg-background-100/50 transition-all cursor-pointer"
                >
                  {/* Type + bookmark */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${typeStyle.bg} ${typeStyle.text}`}
                    >
                      <i className={`${typeStyle.icon}`}></i>
                      {typeLabels[doc.type]}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(doc.id);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <i
                        className={`${
                          bookmarkedIds.has(doc.id)
                            ? 'ri-bookmark-fill text-primary-400'
                            : 'ri-bookmark-line text-foreground-600'
                        } text-sm`}
                      ></i>
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-medium text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                    {doc.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-foreground-600 mb-3 line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    {doc.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded bg-background-200/40 text-[10px] text-foreground-600"
                      >
                        {tag}
                      </span>
                    ))}
                    {doc.tags.length > 3 && (
                      <span className="text-[10px] text-foreground-600">
                        +{doc.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-3 border-t border-primary-500/8">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-data-highlight flex items-center justify-center text-[9px] text-white font-semibold">
                        {doc.authorAvatar}
                      </div>
                      <span className="text-[11px] text-foreground-500">{doc.author}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-foreground-600">
                      <span>
                        <i className="ri-time-line mr-0.5"></i>
                        {doc.readTime}
                      </span>
                      <span>
                        <i className="ri-eye-line mr-0.5"></i>
                        {doc.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
