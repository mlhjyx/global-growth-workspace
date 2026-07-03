import { useState } from 'react';
import type { GoalOption, GoalQuestion } from '@/mocks/goalData';

interface GoalQuestionsProps {
  goal: GoalOption;
  questions: GoalQuestion[];
  onSubmit: (answers: Record<string, string | string[]>) => void;
  onBack: () => void;
  isGenerating: boolean;
}

export default function GoalQuestions({
  goal,
  questions,
  onSubmit,
  onBack,
  isGenerating,
}: GoalQuestionsProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const currentQuestion = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  const handleSingleSelect = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    if (!isLast) {
      setDirection('forward');
      setTimeout(() => setCurrentIdx(currentIdx + 1), 150);
    }
  };

  const handleMultiSelect = (value: string) => {
    const current = (answers[currentQuestion.id] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setAnswers({ ...answers, [currentQuestion.id]: updated });
  };

  const handleTextChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (isLast && !isGenerating) {
      onSubmit(answers);
      return;
    }
    setDirection('forward');
    setTimeout(() => setCurrentIdx(currentIdx + 1), 150);
  };

  const handleBack = () => {
    if (currentIdx === 0) {
      onBack();
      return;
    }
    setDirection('backward');
    setTimeout(() => setCurrentIdx(currentIdx - 1), 150);
  };

  const canProceed = () => {
    if (!currentQuestion.required) return true;
    const val = answers[currentQuestion.id];
    if (Array.isArray(val)) return val.length > 0;
    return val && val.toString().trim().length > 0;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-300 text-xs font-mono tracking-wide mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          STEP 2 / 3
        </div>

        {/* Selected goal chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
          <span className="w-5 h-5 flex items-center justify-center text-primary-400">
            <i className={`${goal.icon} text-sm`}></i>
          </span>
          <span className="text-primary-300 text-sm font-medium">{goal.title}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">补充关键信息</h2>
        <p className="text-foreground-400 text-sm">
          第 {currentIdx + 1} / {questions.length} 个问题
        </p>

        {/* Progress bar */}
        <div className="mt-4 w-full max-w-xs mx-auto h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-300 transition-all duration-500 ease-out"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full glass-card p-6 md:p-8 animate-slide-up" key={currentQuestion.id}>
        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
            {currentQuestion.question}
          </h3>
          <p className="text-foreground-400 text-sm">{currentQuestion.description}</p>
        </div>

        {/* Answers */}
        <div className="space-y-3">
          {currentQuestion.type === 'single' && currentQuestion.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQuestion.options.map((opt) => {
                const selected = answers[currentQuestion.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSingleSelect(opt)}
                    className={`text-left px-4 py-3 rounded-lg border transition-all duration-200 text-sm cursor-pointer ${
                      selected
                        ? 'border-primary-400 bg-primary-500/10 text-white'
                        : 'border-white/10 bg-white/[0.03] text-foreground-300 hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'multiple' && currentQuestion.options && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQuestion.options.map((opt) => {
                  const selected = ((answers[currentQuestion.id] as string[]) || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => handleMultiSelect(opt)}
                      className={`text-left px-4 py-3 rounded-lg border transition-all duration-200 text-sm cursor-pointer flex items-center gap-3 ${
                        selected
                          ? 'border-primary-400 bg-primary-500/10 text-white'
                          : 'border-white/10 bg-white/[0.03] text-foreground-300 hover:border-white/20 hover:bg-white/[0.06]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 flex items-center justify-center rounded border transition-colors flex-shrink-0 ${
                          selected
                            ? 'border-primary-400 bg-primary-500 text-white'
                            : 'border-white/20'
                        }`}
                      >
                        {selected && <i className="ri-check-line text-xs"></i>}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {!currentQuestion.required && (
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-lg border border-dashed border-white/15 text-foreground-400 text-sm hover:border-white/30 hover:text-foreground-300 transition-colors cursor-pointer"
                >
                  跳过此问题
                </button>
              )}
            </div>
          )}

          {(currentQuestion.type === 'text' || currentQuestion.type === 'select') && (
            <div>
              {currentQuestion.type === 'select' && currentQuestion.options ? (
                <select
                  value={(answers[currentQuestion.id] as string) || ''}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="w-full"
                >
                  <option value="">请选择...</option>
                  {currentQuestion.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={(answers[currentQuestion.id] as string) || ''}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full"
                />
              )}
            </div>
          )}

          {currentQuestion.type === 'textarea' && (
            <textarea
              value={(answers[currentQuestion.id] as string) || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={currentQuestion.placeholder}
              rows={3}
              className="w-full resize-none"
              maxLength={500}
            />
          )}

          {/* Navigation for text/select/textarea/multi */}
          {currentQuestion.type !== 'single' && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <button
                onClick={handleBack}
                className="text-foreground-500 hover:text-white text-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-arrow-left-line text-sm"></i>
                </span>
                {currentIdx === 0 ? '返回选择目标' : '上一题'}
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed() || isGenerating}
                className={`btn-primary px-6 py-2.5 text-sm flex items-center gap-2 ${
                  !canProceed() || isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-loader-4-line text-sm animate-spin"></i>
                    </span>
                    生成计划中...
                  </>
                ) : isLast ? (
                  <>
                    生成计划
                    <span className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-magic-line text-sm"></i>
                    </span>
                  </>
                ) : (
                  <>
                    下一题
                    <span className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-arrow-right-line text-sm"></i>
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
