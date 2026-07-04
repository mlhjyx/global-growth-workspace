// 旅程 Context 与 hook（与 Provider 分文件：react-refresh 要求组件文件只导出组件）
import { createContext, useContext } from 'react';
import type { JourneyDef, JourneyId, JourneyStep } from './journeys';

export interface JourneyContextValue {
  journey: JourneyDef | null;
  completed: string[];
  /** 第一个未完成步骤；旅程走完时为 null */
  currentStep: JourneyStep | null;
  startJourney: (id: JourneyId) => JourneyStep;
  completeStep: (stepId: string) => void;
  resetJourney: () => void;
}

export const JourneyContext = createContext<JourneyContextValue | null>(null);

export function useJourney(): JourneyContextValue {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error('useJourney 必须在 JourneyProvider 内使用');
  return ctx;
}
