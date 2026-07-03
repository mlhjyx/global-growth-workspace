import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalSelector from './components/GoalSelector';
import GoalQuestions from './components/GoalQuestions';
import PlanBuilder from './components/PlanBuilder';
import { goalOptions, goalQuestionsMap, samplePlanMap } from '@/mocks/goalData';
import type { GoalOption } from '@/mocks/goalData';

type WizardStep = 'select' | 'questions' | 'plan';

export default function GoalPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>('select');
  const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<
    (typeof samplePlanMap)[keyof typeof samplePlanMap] | null
  >(null);
  const [isChecking, setIsChecking] = useState(true);

  // Onboarding guard: redirect based on auth and completion state
  // localStorage key 迁移：growthos_* → ggw_*（读取时兼容旧 key，避免未迁移页面写入旧 key 时断流）
  useEffect(() => {
    const authToken =
      localStorage.getItem('ggw_auth_token') ?? localStorage.getItem('growthos_auth_token');
    const onboardingCompleted =
      localStorage.getItem('ggw_onboarding_completed') ??
      localStorage.getItem('growthos_onboarding_completed');
    const goalCompleted =
      localStorage.getItem('ggw_goal_completed') ?? localStorage.getItem('growthos_goal_completed');

    if (!authToken) {
      // Not logged in -> back to landing
      navigate('/', { replace: true });
      return;
    }

    if (!onboardingCompleted) {
      // Haven't done onboarding yet -> go to onboarding first
      navigate('/onboarding', { replace: true });
      return;
    }

    if (goalCompleted) {
      // Both onboarding and goal done -> dashboard
      navigate('/dashboard', { replace: true });
      return;
    }

    setIsChecking(false);
  }, [navigate]);

  const handleGoalSelect = (goal: GoalOption) => {
    setSelectedGoal(goal);
    setStep('questions');
  };

  const handleQuestionsSubmit = (_answers: Record<string, string | string[]>) => {
    if (!selectedGoal) return;
    setIsGenerating(true);

    // Simulate AI plan generation delay
    setTimeout(() => {
      const plan = samplePlanMap[selectedGoal.id] || [];
      setGeneratedPlan(plan);
      setIsGenerating(false);
      setStep('plan');
    }, 1800);
  };

  const handleBackToSelect = () => {
    setStep('select');
    setSelectedGoal(null);
    setGeneratedPlan(null);
  };

  const handleBackToQuestions = () => {
    setStep('questions');
    setGeneratedPlan(null);
  };

  // Show loading while checking auth state
  if (isChecking) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-deep-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line animate-spin text-2xl text-primary-400"></i>
          <span className="text-sm text-foreground-500">正在加载...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-deep-dark">
      {/* Ambient glow orbs */}
      <div className="glow-orb glow-orb-1"></div>
      <div className="glow-orb glow-orb-2"></div>
      <div className="glow-orb glow-orb-3"></div>

      {/* Grid texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(108, 92, 231, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108, 92, 231, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Top bar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-500/20 text-primary-400">
            <i className="ri-hexagon-line text-lg"></i>
          </span>
          <span className="text-lg font-bold text-white tracking-wider">
            Global Growth Workspace
          </span>
        </div>
        <div className="flex items-center gap-3">
          {step !== 'select' && (
            <button
              onClick={step === 'plan' ? handleBackToQuestions : handleBackToSelect}
              className="text-sm text-foreground-500 hover:text-white transition-colors cursor-pointer"
            >
              返回上一步
            </button>
          )}
          <span className="text-xs text-foreground-500 font-mono bg-white/[0.04] px-3 py-1 rounded-full border border-white/5">
            {step === 'select' ? '1/3' : step === 'questions' ? '2/3' : '3/3'}
          </span>
        </div>
      </nav>

      {/* Main content */}
      <main
        className="relative z-10 flex flex-col items-center justify-center py-10 md:py-16 px-4"
        style={{ minHeight: 'calc(100vh - 80px)' }}
      >
        {step === 'select' && <GoalSelector options={goalOptions} onSelect={handleGoalSelect} />}

        {step === 'questions' && selectedGoal && (
          <GoalQuestions
            goal={selectedGoal}
            questions={goalQuestionsMap[selectedGoal.id] || []}
            onSubmit={handleQuestionsSubmit}
            onBack={handleBackToSelect}
            isGenerating={isGenerating}
          />
        )}

        {step === 'plan' && selectedGoal && generatedPlan && (
          <PlanBuilder goal={selectedGoal} plan={generatedPlan} onBack={handleBackToQuestions} />
        )}
      </main>
    </div>
  );
}
