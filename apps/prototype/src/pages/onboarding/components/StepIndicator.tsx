interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; subtitle: string }[];
  onStepClick: (step: number) => void;
}

export default function StepIndicator({ currentStep, totalSteps, steps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Step labels */}
      <div className="flex items-center justify-between mb-3">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => idx < currentStep ? onStepClick(idx) : undefined}
            className={`flex flex-col items-center gap-1 transition-all ${idx <= currentStep ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <span className={`text-xs font-medium whitespace-nowrap ${
              idx === currentStep ? 'text-white' :
              idx < currentStep ? 'text-primary-400' :
              'text-foreground-500'
            }`}>
              {step.title}
            </span>
            <span className="text-foreground-500 text-xs whitespace-nowrap hidden sm:block">{step.subtitle}</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-300 transition-all duration-500"
            style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
        {/* Step dots */}
        <div className="absolute inset-0 flex items-center justify-between px-0 pointer-events-none">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                idx <= currentStep
                  ? 'bg-primary-500 border-primary-400'
                  : 'bg-background-50/80 border-white/10'
              }`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}