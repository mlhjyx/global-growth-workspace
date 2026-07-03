import { useState } from 'react';
import type { CampaignStage, CampaignTask } from '@/mocks/campaignData';
import { teamMembers } from '@/mocks/teamData';

interface CampaignBoardProps {
  stages: CampaignStage[];
  selectedStageId: string;
  onSelectStage: (id: string) => void;
}

const priorityConfig = {
  high: { color: 'border-error/40', label: '高' },
  medium: { color: 'border-warning/40', label: '中' },
  low: { color: 'border-foreground-500/20', label: '低' },
};

const statusConfig: Record<string, { bg: string; label: string; icon: string }> = {
  completed: { bg: 'bg-success/10 text-success border-success/30', label: '已完成', icon: 'ri-check-line' },
  in_progress: { bg: 'bg-primary-500/10 text-primary-400 border-primary-500/30', label: '进行中', icon: 'ri-loader-4-line' },
  pending: { bg: 'bg-white/5 text-foreground-600 border-white/10', label: '待开始', icon: 'ri-time-line' },
  blocked: { bg: 'bg-error/10 text-error border-error/30', label: '阻塞', icon: 'ri-close-circle-line' },
};

interface NewTaskForm {
  title: string;
  assignee: string;
  priority: CampaignTask['priority'];
  dueDate: string;
  tags: string;
  description: string;
}

const emptyForm: NewTaskForm = {
  title: '',
  assignee: teamMembers[0].name,
  priority: 'medium',
  dueDate: '',
  tags: '',
  description: '',
};

export default function CampaignBoard({ stages, selectedStageId, onSelectStage }: CampaignBoardProps) {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingTask, setEditingTask] = useState<CampaignTask | null>(null);
  const [form, setForm] = useState<NewTaskForm>(emptyForm);
  const [localTasks, setLocalTasks] = useState<CampaignTask[]>([]);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof NewTaskForm, string>>>();

  const selectedStage = stages.find(s => s.id === selectedStageId) || stages[0];

  const allTasks = [...selectedStage.tasks, ...localTasks];

  const tasksByStatus: Record<string, CampaignTask[]> = {
    completed: allTasks.filter(t => t.status === 'completed'),
    in_progress: allTasks.filter(t => t.status === 'in_progress'),
    pending: allTasks.filter(t => t.status === 'pending'),
    blocked: allTasks.filter(t => t.status === 'blocked'),
  };

  const handleOpenCreate = () => {
    setForm({ ...emptyForm });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const handleFormChange = (field: keyof NewTaskForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = () => {
    const errors: Partial<Record<keyof NewTaskForm, string>> = {};
    if (!form.title.trim()) errors.title = '请输入任务标题';
    if (!form.dueDate) errors.dueDate = '请选择截止日期';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const assigneeMember = teamMembers.find(m => m.name === form.assignee);
    const newTask: CampaignTask = {
      id: `local-${Date.now()}`,
      title: form.title.trim(),
      assignee: form.assignee,
      assigneeAvatar: assigneeMember?.avatar || form.assignee.charAt(0),
      status: 'pending',
      priority: form.priority,
      dueDate: form.dueDate,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      description: form.description.trim() || undefined,
    };

    setLocalTasks(prev => [...prev, newTask]);
    setShowCreateModal(false);
    setForm(emptyForm);
  };

  const handleOpenDetail = (task: CampaignTask) => {
    setEditingTask(task);
    setShowDetailModal(true);
  };

  const handleTaskStatusChange = (task: CampaignTask, newStatus: CampaignTask['status']) => {
    if (task.id.startsWith('local-')) {
      setLocalTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    }
    setEditingTask(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const handleDeleteTask = (task: CampaignTask) => {
    if (task.id.startsWith('local-')) {
      setLocalTasks(prev => prev.filter(t => t.id !== task.id));
    }
    setShowDetailModal(false);
    setEditingTask(null);
  };

  const handleSaveEdit = () => {
    if (!editingTask) return;
    if (editingTask.id.startsWith('local-')) {
      setLocalTasks(prev => prev.map(t => t.id === editingTask.id ? editingTask : t));
    }
    setShowDetailModal(false);
    setEditingTask(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.slice(5);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary-500/10 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-white font-semibold text-sm">
            {selectedStage.order}. {selectedStage.name}
          </h2>
          <div className="flex items-center gap-1.5">
            {stages.map(s => (
              <button
                key={s.id}
                onClick={() => onSelectStage(s.id)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                  s.id === selectedStageId ? 'bg-primary-400 ring-2 ring-primary-400/30' :
                  s.status === 'completed' ? 'bg-success' :
                  s.status === 'in_progress' ? 'bg-primary-500' :
                  'bg-foreground-700'
                }`}
                title={s.name}
              ></button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setViewMode('board')}
            className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors cursor-pointer
              ${viewMode === 'board' ? 'bg-primary-500/20 text-primary-400' : 'text-foreground-600 hover:text-foreground-300'}`}
          >
            <i className="ri-layout-grid-line text-sm"></i>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors cursor-pointer
              ${viewMode === 'list' ? 'bg-primary-500/20 text-primary-400' : 'text-foreground-600 hover:text-foreground-300'}`}
          >
            <i className="ri-list-check text-sm"></i>
          </button>
          <button
            onClick={handleOpenCreate}
            className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 ml-1 cursor-pointer"
          >
            <i className="ri-add-line text-xs"></i>
            新建任务
          </button>
        </div>
      </div>

      {/* Board view */}
      {viewMode === 'board' && (
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-3 min-w-[680px] h-full">
            {Object.entries(tasksByStatus).map(([status, tasks]) => {
              if (tasks.length === 0) return null;
              const config = statusConfig[status];
              return (
                <div key={status} className="flex-1 min-w-[200px] flex flex-col">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className={`w-2 h-2 rounded-full ${config.bg.split(' ')[0]}`}></span>
                    <span className="text-foreground-500 text-xs font-medium">
                      {config.label}
                    </span>
                    <span className="text-foreground-600 text-[11px]">{tasks.length}</span>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                    {tasks.map((task) => {
                      const pri = priorityConfig[task.priority];
                      return (
                        <div
                          key={task.id}
                          onClick={() => handleOpenDetail(task)}
                          className={`glass-card p-3 border-l-2 ${pri.color} hover:border-primary-500/30 transition-all duration-200 cursor-pointer group`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${config.bg} border`}>
                              <i className={`${config.icon} text-[10px]`}></i>
                              {config.label}
                            </div>
                            <span className={`text-[10px] font-medium ${
                              task.priority === 'high' ? 'text-error' :
                              task.priority === 'medium' ? 'text-warning' :
                              'text-foreground-500'
                            }`}>
                              {pri.label}
                            </span>
                          </div>
                          <p className="text-white text-sm font-medium mb-2 leading-snug">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-foreground-500 text-xs mb-2 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-data-highlight flex items-center justify-center text-white text-[9px] font-semibold">
                                {task.assigneeAvatar}
                              </span>
                              <span className="text-foreground-600 text-[11px]">{task.assignee}</span>
                            </div>
                            <span className="text-foreground-700 text-[11px]">{task.dueDate.slice(5)}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {task.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-foreground-500">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <div className="flex-1 overflow-auto p-4">
          <div className="glass-card overflow-hidden min-w-[680px]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary-500/10">
                  <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">任务</th>
                  <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">负责人</th>
                  <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">状态</th>
                  <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">优先级</th>
                  <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">截止日期</th>
                  <th className="px-3 py-2.5 text-foreground-600 text-[11px] font-medium">标签</th>
                </tr>
              </thead>
              <tbody>
                {allTasks.map((task) => {
                  const config = statusConfig[task.status];
                  const pri = priorityConfig[task.priority];
                  return (
                    <tr key={task.id} onClick={() => handleOpenDetail(task)} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <td className="px-3 py-2.5">
                        <p className="text-white text-sm">{task.title}</p>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-data-highlight flex items-center justify-center text-white text-[9px] font-semibold">
                            {task.assigneeAvatar}
                          </span>
                          <span className="text-foreground-400 text-xs">{task.assignee}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] ${config.bg} border`}>
                          <i className={`${config.icon} text-[10px]`}></i>
                          {config.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`text-xs ${
                          task.priority === 'high' ? 'text-error' :
                          task.priority === 'medium' ? 'text-warning' :
                          'text-foreground-500'
                        }`}>
                          {pri.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-foreground-500 text-xs">{task.dueDate.slice(5)}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-foreground-500">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          ></div>

          {/* Modal content */}
          <div className="relative w-full max-w-md mx-4 rounded-2xl animate-fade-in"
            style={{ background: 'linear-gradient(135deg, rgba(22,18,48,0.98) 0%, rgba(30,20,56,0.98) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(108,92,231,0.2)' }}
          >
            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-sm">新建任务</h3>
                  <p className="text-foreground-500 text-xs mt-0.5">
                    添加到 {selectedStage.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-foreground-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-foreground-400 text-xs font-medium mb-1.5">任务标题 <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="输入任务标题"
                  className={`w-full px-3 py-2 text-sm bg-white/6 border rounded-lg text-white placeholder:text-foreground-600 outline-none transition-colors ${formErrors.title ? 'border-error/50 focus:border-error' : 'border-primary-500/15 focus:border-primary-400/60'}`}
                />
                {formErrors.title && <p className="text-error text-xs mt-1">{formErrors.title}</p>}
              </div>

              {/* Assignee & Priority row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground-400 text-xs font-medium mb-1.5">负责人</label>
                  <div className="relative">
                    <select
                      value={form.assignee}
                      onChange={(e) => handleFormChange('assignee', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white/6 border border-primary-500/15 focus:border-primary-400/60 rounded-lg text-white outline-none transition-colors appearance-none cursor-pointer"
                    >
                      {teamMembers.map((m) => (
                        <option key={m.id} value={m.name} className="bg-deep-dark text-white">
                          {m.name} · {m.role}
                        </option>
                      ))}
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-foreground-600 text-sm pointer-events-none"></i>
                  </div>
                </div>
                <div>
                  <label className="block text-foreground-400 text-xs font-medium mb-1.5">优先级</label>
                  <div className="flex gap-1.5 p-1 rounded-lg bg-white/5">
                    {(['high', 'medium', 'low'] as const).map((pri) => (
                      <button
                        key={pri}
                        onClick={() => handleFormChange('priority', pri)}
                        className={`flex-1 py-1.5 text-xs rounded-md font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                          form.priority === pri
                            ? pri === 'high' ? 'bg-error/15 text-error' : pri === 'medium' ? 'bg-warning/15 text-warning' : 'bg-foreground-500/15 text-foreground-400'
                            : 'text-foreground-600 hover:text-foreground-400'
                        }`}
                      >
                        {priorityConfig[pri].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Due date & Tags row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground-400 text-xs font-medium mb-1.5">截止日期 <span className="text-error">*</span></label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => handleFormChange('dueDate', e.target.value)}
                    className={`w-full px-3 py-2 text-sm bg-white/6 border rounded-lg text-white outline-none transition-colors [color-scheme:dark] ${formErrors.dueDate ? 'border-error/50 focus:border-error' : 'border-primary-500/15 focus:border-primary-400/60'}`}
                  />
                  {formErrors.dueDate && <p className="text-error text-xs mt-1">{formErrors.dueDate}</p>}
                </div>
                <div>
                  <label className="block text-foreground-400 text-xs font-medium mb-1.5">标签</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => handleFormChange('tags', e.target.value)}
                    placeholder="用逗号分隔，如: 设计, 前端"
                    className="w-full px-3 py-2 text-sm bg-white/6 border border-primary-500/15 focus:border-primary-400/60 rounded-lg text-white placeholder:text-foreground-600 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-foreground-400 text-xs font-medium mb-1.5">描述</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="添加任务描述（可选）"
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-white/6 border border-primary-500/15 focus:border-primary-400/60 rounded-lg text-white placeholder:text-foreground-600 outline-none transition-colors resize-none"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-sm rounded-lg border border-primary-500/15 text-foreground-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 btn-primary px-4 py-2 text-sm cursor-pointer whitespace-nowrap"
                >
                  创建任务
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {showDetailModal && editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowDetailModal(false); setEditingTask(null); }}
          ></div>

          <div className="relative w-full max-w-md mx-4 rounded-2xl animate-fade-in"
            style={{ background: 'linear-gradient(135deg, rgba(22,18,48,0.98) 0%, rgba(30,20,56,0.98) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(108,92,231,0.2)' }}
          >
            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="w-full text-white font-semibold text-sm bg-transparent border-none outline-none"
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-400 to-data-highlight flex items-center justify-center text-white text-[8px] font-semibold">
                        {editingTask.assigneeAvatar}
                      </span>
                      <span className="text-foreground-400 text-xs">{editingTask.assignee}</span>
                    </div>
                    <span className="text-foreground-700">·</span>
                    <span className="text-foreground-500 text-xs">{editingTask.dueDate.slice(5)}</span>
                  </div>
                </div>
                <button
                  onClick={() => { setShowDetailModal(false); setEditingTask(null); }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-foreground-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>

              {/* Status changer */}
              <div>
                <label className="block text-foreground-400 text-xs font-medium mb-2">状态</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.entries(statusConfig) as [CampaignTask['status'], typeof statusConfig[string]][]).map(([status, config]) => (
                    <button
                      key={status}
                      onClick={() => handleTaskStatusChange(editingTask, status)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer
                        ${editingTask.status === status
                          ? `${config.bg} border font-medium`
                          : 'bg-white/5 text-foreground-600 hover:text-foreground-400 border border-transparent'
                        }`}
                    >
                      <span className={`w-3.5 h-3.5 flex items-center justify-center ${editingTask.status === status ? '' : 'text-foreground-500'}`}>
                        <i className={`${config.icon} text-[11px]`}></i>
                      </span>
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-foreground-400 text-xs font-medium mb-1.5">描述</label>
                <textarea
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value || undefined })}
                  placeholder="添加任务描述"
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-white/6 border border-primary-500/15 focus:border-primary-400/60 rounded-lg text-white placeholder:text-foreground-600 outline-none transition-colors resize-none"
                ></textarea>
              </div>

              {/* Tags */}
              {editingTask.tags.length > 0 && (
                <div>
                  <label className="block text-foreground-400 text-xs font-medium mb-1.5">标签</label>
                  <div className="flex flex-wrap gap-1.5">
                    {editingTask.tags.map(tag => (
                      <span key={tag} className="text-[11px] px-2 py-1 rounded-md bg-white/5 text-foreground-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleDeleteTask(editingTask)}
                  className="px-4 py-2 text-sm rounded-lg border border-error/20 text-error/70 hover:text-error hover:bg-error/5 transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                >
                  <span className="w-3.5 h-3.5 flex items-center justify-center">
                    <i className="ri-delete-bin-line text-sm"></i>
                  </span>
                  删除
                </button>
                <div className="flex-1"></div>
                <button
                  onClick={() => { setShowDetailModal(false); setEditingTask(null); }}
                  className="px-4 py-2 text-sm rounded-lg border border-primary-500/15 text-foreground-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="btn-primary px-5 py-2 text-sm cursor-pointer whitespace-nowrap"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}