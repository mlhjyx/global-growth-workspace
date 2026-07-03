import { useState, useCallback } from 'react';
import type { PlanSection, GoalOption } from '@/mocks/goalData';
import { useNavigate } from 'react-router-dom';

interface PlanBuilderProps {
  goal: GoalOption;
  plan: PlanSection[];
  onBack: () => void;
}

export default function PlanBuilder({ goal, plan, onBack }: PlanBuilderProps) {
  const navigate = useNavigate();
  const [sections, setSections] = useState(plan);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleStartEdit = (section: PlanSection) => {
    setEditingId(section.id);
    setEditContent(section.content);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    setSections(sections.map(s => s.id === editingId ? { ...s, content: editContent } : s));
    setEditingId(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleEnterWorkspace = useCallback(() => {
    localStorage.setItem('growthos_onboarding_completed', 'true');
    localStorage.setItem('growthos_goal_completed', 'true');
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-success/30 bg-success/10 text-success text-xs font-mono tracking-wide mb-6">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          STEP 3 / 3
        </div>

        {/* Goal chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
          <span className="w-5 h-5 flex items-center justify-center text-primary-400">
            <i className={`${goal.icon} text-sm`}></i>
          </span>
          <span className="text-primary-300 text-sm font-medium">{goal.title}</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          你的专属增长计划
        </h2>
        <p className="text-foreground-400 text-sm md:text-base max-w-lg">
          AI 已根据你的信息生成结构化计划。你可以编辑每个阶段的内容，确认后进入工作台执行。
        </p>
      </div>

      {/* Plan sections */}
      <div className="w-full space-y-4">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className="glass-card p-5 md:p-6 animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
          >
            {editingId === section.id ? (
              /* Edit mode */
              <div>
                <label className="block text-white font-semibold text-base mb-3">
                  {section.title}
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  className="w-full resize-none mb-3"
                  autoFocus
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={handleCancelEdit}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    保存修改
                  </button>
                </div>
              </div>
            ) : (
              /* Display mode */
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-white font-semibold text-base">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 text-xs font-mono mr-2">
                      {idx + 1}
                    </span>
                    {section.title}
                  </h3>
                  {section.editable && (
                    <button
                      onClick={() => handleStartEdit(section)}
                      className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-foreground-500 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
                      title="编辑此阶段"
                    >
                      <i className="ri-edit-line text-sm"></i>
                    </button>
                  )}
                </div>
                <p className="text-foreground-400 text-sm leading-relaxed pl-8">
                  {section.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 mb-12 w-full max-w-md">
        <button
          onClick={handleEnterWorkspace}
          className="btn-primary w-full sm:flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-rocket-line text-base"></i>
          </span>
          进入工作台，开始执行
        </button>

        <button
          onClick={onBack}
          className="btn-secondary w-full sm:w-auto px-6 py-3 text-sm flex items-center justify-center gap-2"
        >
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-arrow-left-line text-sm"></i>
          </span>
          重新设置
        </button>
      </div>
    </div>
  );
}