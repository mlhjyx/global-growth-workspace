import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './components/StepIndicator';
import CompanyProfile from './components/CompanyProfile';
import TargetMarkets from './components/TargetMarkets';
import ICPPreview from './components/ICPPreview';
import FirstCampaign from './components/FirstCampaign';
import SuccessFinish from './components/SuccessFinish';
import { OnboardingData, defaultOnboardingData, aiGeneratedICPs } from '@/mocks/onboardingData';

const steps = [
  { title: '企业画像', subtitle: 'Step 1' },
  { title: '目标市场', subtitle: 'Step 2' },
  { title: 'ICP 预览', subtitle: 'Step 3' },
  { title: '首个战役', subtitle: 'Step 4' },
  { title: '初战告捷', subtitle: 'Step 5' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [data, setData] = useState<OnboardingData>(() => {
    const saved = sessionStorage.getItem('onboarding_data');
    return saved ? { ...JSON.parse(saved), step: JSON.parse(saved).step || 0 } : { ...defaultOnboardingData };
  });

  // Guard: redirect based on auth and completion state
  useEffect(() => {
    const authToken = localStorage.getItem('growthos_auth_token');
    const onboardingCompleted = localStorage.getItem('growthos_onboarding_completed') === 'true';
    const goalCompleted = localStorage.getItem('growthos_goal_completed') === 'true';

    if (!authToken) {
      navigate('/', { replace: true });
      return;
    }

    if (onboardingCompleted && goalCompleted) {
      navigate('/dashboard', { replace: true });
      return;
    }

    if (onboardingCompleted && !goalCompleted) {
      navigate('/goal', { replace: true });
      return;
    }

    setIsChecking(false);
  }, [navigate]);

  const updateData = (partial: Partial<OnboardingData>) => {
    setData(prev => {
      const next = { ...prev, ...partial };
      sessionStorage.setItem('onboarding_data', JSON.stringify(next));
      return next;
    });
  };

  const handleNext = () => {
    const nextStep = data.step + 1;
    updateData({ step: nextStep });
  };

  const handleBack = () => {
    const prevStep = Math.max(0, data.step - 1);
    updateData({ step: prevStep });
  };

  const handleStepClick = (step: number) => {
    updateData({ step });
  };

  const handleICPGenerate = () => {
    updateData({ icps: aiGeneratedICPs });
  };

  const handleFinish = () => {
    // 从 Step 3（首个战役）进入 Step 4（初战告捷总结页）
    updateData({ step: 4 });
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('growthos_onboarding_completed', 'true');
    navigate('/goal');
  };

  const canProceed = () => {
    switch (data.step) {
      case 0: return data.companyName && data.industry;
      case 1: return data.regions.length > 0;
      case 2: return data.icps.length > 0;
      case 3: return data.campaignName;
      case 4: return true;
      default: return false;
    }
  };

  // Show loading while checking auth state
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0C0A1A 0%, #1A103C 100%)' }}>
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line animate-spin text-2xl text-primary-400"></i>
          <span className="text-sm text-foreground-500">正在加载...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative" style={{ background: 'linear-gradient(135deg, #0C0A1A 0%, #1A103C 100%)' }}>
      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(108,92,231,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(108,92,231,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}></div>

      {/* Glow orbs */}
      <div className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0 top-[-10%] right-[-8%]" style={{ background: 'radial-gradient(circle, rgba(108,92,231,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }}></div>
      <div className="fixed w-[350px] h-[350px] rounded-full pointer-events-none z-0 bottom-[-8%] left-[-5%]" style={{ background: 'radial-gradient(circle, rgba(162,155,254,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }}></div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Step indicator */}
        <StepIndicator
          currentStep={data.step}
          totalSteps={steps.length}
          steps={steps}
          onStepClick={handleStepClick}
        />

        {/* Content area */}
        <div className="glass-card p-6 md:p-8 min-h-[420px]">
          {data.step === 0 && (
            <CompanyProfile data={data} onChange={updateData} />
          )}
          {data.step === 1 && (
            <TargetMarkets data={data} onChange={updateData} />
          )}
          {data.step === 2 && (
            <ICPPreview icps={data.icps} onUpdate={(icps) => updateData({ icps })} onGenerate={handleICPGenerate} />
          )}
          {data.step === 3 && (
            <FirstCampaign data={data} onChange={updateData} />
          )}
          {data.step === 4 && (
            <SuccessFinish data={data} onComplete={handleOnboardingComplete} />
          )}
        </div>

        {/* Navigation buttons */}
        {data.step < 4 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={data.step === 0}
              className={`btn-secondary flex items-center gap-1.5 px-4 py-2 text-sm whitespace-nowrap ${
                data.step === 0 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-left-line text-sm"></i>
              </span>
              上一步
            </button>

            <div className="flex items-center gap-3">
              <span className="text-foreground-500 text-xs">
                {data.step + 1} / {steps.length}
              </span>
              {data.step < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`btn-primary flex items-center gap-1.5 px-5 py-2 text-sm whitespace-nowrap ${
                    !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  下一步
                  <span className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-arrow-right-line text-sm"></i>
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={!canProceed()}
                  className={`btn-primary flex items-center gap-1.5 px-5 py-2 text-sm whitespace-nowrap ${
                    !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                  完成设置
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}