import { useState, useCallback } from 'react';

interface ContentEditorProps {
  title: string;
  content: string;
  tags: string[];
  selectedPlatforms: string[];
  platformCharLimits: Record<string, number>;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onTagsChange: (v: string[]) => void;
}

export default function ContentEditor({
  title,
  content,
  tags,
  selectedPlatforms,
  platformCharLimits,
  onTitleChange,
  onContentChange,
  onTagsChange,
}: ContentEditorProps) {
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const minCharLimit =
    selectedPlatforms.length > 0
      ? Math.min(...selectedPlatforms.map((id) => platformCharLimits[id] || 99999))
      : 99999;
  const contentLength = content.length;
  const isOverLimit = minCharLimit !== 99999 && contentLength > minCharLimit;

  const handleAddTag = useCallback(() => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
      setNewTag('');
    }
  }, [newTag, tags, onTagsChange]);

  const handleRemoveTag = useCallback(
    (tag: string) => {
      onTagsChange(tags.filter((t) => t !== tag));
    },
    [tags, onTagsChange],
  );

  const getPlatformPreview = (platformId: string) => {
    const limit = platformCharLimits[platformId] || 99999;
    if (contentLength <= limit) return content;
    return content.slice(0, limit - 3) + '...';
  };

  return (
    <div className="rounded-2xl bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-foreground-500/10 flex items-center justify-center">
            <i className="ri-edit-line text-foreground-400 text-sm"></i>
          </span>
          <h3 className="text-white font-medium text-sm">内容编辑器</h3>
        </div>
        <div className="flex bg-white/[0.03] rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-foreground-600 hover:text-foreground-400'
            }`}
          >
            编辑
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-foreground-600 hover:text-foreground-400'
            }`}
          >
            多平台预览
          </button>
        </div>
      </div>

      {activeTab === 'edit' ? (
        <div className="space-y-4">
          {/* 标题 */}
          <div>
            <label className="text-foreground-500 text-xs mb-1.5 flex items-center gap-2">
              标题
              <span
                className={`text-[10px] ${title.length > 100 ? 'text-red-400' : 'text-foreground-700'}`}
              >
                {title.length}/100
              </span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="输入内容标题..."
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-foreground-700 focus:outline-none focus:border-primary-500/30 transition-colors"
            />
          </div>

          {/* 正文 */}
          <div>
            <label className="text-foreground-500 text-xs mb-1.5 flex items-center gap-2">
              正文内容
              {selectedPlatforms.length > 0 && (
                <span
                  className={`text-[10px] ${isOverLimit ? 'text-red-400' : 'text-foreground-700'}`}
                >
                  {contentLength} / 最短限制 {minCharLimit}
                  {isOverLimit && ' (超出)'}
                </span>
              )}
            </label>
            <textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="输入或粘贴内容正文... 也可使用左侧 AI 生成"
              rows={10}
              className={`w-full bg-white/[0.03] border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-foreground-700 focus:outline-none focus:border-primary-500/30 transition-colors resize-none ${
                isOverLimit ? 'border-red-500/30' : 'border-white/[0.06]'
              }`}
            />
            {/* 快捷工具栏 */}
            <div className="flex items-center gap-1 mt-1.5">
              {['#话题', '@提及', '插入链接', '插入数据'].map((tool) => (
                <button
                  key={tool}
                  className="text-[10px] px-2 py-1 rounded bg-white/[0.03] text-foreground-600 hover:text-foreground-400 hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>

          {/* 标签 */}
          <div>
            <label className="text-foreground-500 text-xs mb-1.5 block">标签 / 话题</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-primary-500/8 text-primary-400"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="添加标签，回车确认"
                className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-foreground-700 focus:outline-none focus:border-primary-500/30 transition-colors"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-foreground-500 hover:text-white hover:bg-white/[0.06] transition-colors text-xs cursor-pointer"
              >
                添加
              </button>
            </div>
          </div>

          {/* 图片上传模拟 */}
          <div>
            <label className="text-foreground-500 text-xs mb-1.5 block">封面 / 配图</label>
            <div className="border-2 border-dashed border-white/[0.06] rounded-lg p-6 text-center hover:border-primary-500/20 transition-colors cursor-pointer bg-white/[0.01]">
              <i className="ri-image-add-line text-2xl text-foreground-700 mb-2"></i>
              <p className="text-xs text-foreground-600">拖拽图片到此处，或点击上传</p>
              <p className="text-[10px] text-foreground-800 mt-1">支持 JPG、PNG、GIF，最大 10MB</p>
            </div>
          </div>
        </div>
      ) : (
        /* 多平台预览 */
        <div className="space-y-3">
          {selectedPlatforms.length === 0 ? (
            <div className="text-center py-8 text-foreground-700 text-sm">
              <i className="ri-eye-off-line text-2xl mb-2 block"></i>
              请先选择发布平台以查看预览
            </div>
          ) : (
            selectedPlatforms.map((pid) => {
              const limit = platformCharLimits[pid] || 99999;
              const preview = getPlatformPreview(pid);
              const over = contentLength > limit;
              return (
                <div key={pid} className="rounded-lg bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white font-medium capitalize">{pid}</span>
                    <span
                      className={`text-[10px] ${over ? 'text-red-400' : 'text-foreground-700'}`}
                    >
                      {contentLength}/{limit} 字符
                    </span>
                  </div>
                  <div className="text-xs text-foreground-500 whitespace-pre-wrap">{preview}</div>
                  {over && (
                    <div className="mt-2 text-[10px] text-red-400 flex items-center gap-1">
                      <i className="ri-error-warning-line"></i>
                      内容超出该平台限制，发布时将自动截断
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
