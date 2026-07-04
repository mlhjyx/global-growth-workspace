// 旅程状态层（EPIC-M0-06 T1）：跨页状态传递的唯一事实源，localStorage 持久化（ggw_journey）。
// 埋点在此集中触发（journey_start / journey_step_complete / journey_complete），页面不重复上报。
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { track } from '@/analytics/analytics';
import { JOURNEYS, type JourneyDef, type JourneyId, type JourneyStep } from './journeys';

const STORE_KEY = 'ggw_journey';

interface JourneyState {
  id: JourneyId;
  completed: string[]; // 已完成 step id（有序）
  startedAt: string;
}

interface JourneyContextValue {
  journey: JourneyDef | null;
  completed: string[];
  /** 第一个未完成步骤；旅程走完时为 null */
  currentStep: JourneyStep | null;
  startJourney: (id: JourneyId) => JourneyStep;
  completeStep: (stepId: string) => void;
  resetJourney: () => void;
}

function readState(): JourneyState | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as JourneyState) : null;
  } catch {
    return null;
  }
}

function writeState(state: JourneyState | null): void {
  try {
    if (state === null) localStorage.removeItem(STORE_KEY);
    else localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    /* 存储不可用不阻断（隐私模式）；旅程退化为单页体验 */
  }
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<JourneyState | null>(() => readState());

  const startJourney = useCallback((id: JourneyId): JourneyStep => {
    const def = JOURNEYS[id];
    // 目标步骤在启动动作本身中完成（启动器/向导确认即目标已立）
    const next: JourneyState = {
      id,
      completed: ['goal'],
      startedAt: new Date().toISOString(),
    };
    setState(next);
    writeState(next);
    track('journey_start', { journey: id });
    track('journey_step_complete', { journey: id, step: 'goal' });
    return def.steps.find((s) => !next.completed.includes(s.id)) ?? def.steps[0]!;
  }, []);

  const completeStep = useCallback((stepId: string) => {
    setState((prev) => {
      if (!prev || prev.completed.includes(stepId)) return prev;
      const def = JOURNEYS[prev.id];
      const next: JourneyState = { ...prev, completed: [...prev.completed, stepId] };
      writeState(next);
      track('journey_step_complete', { journey: prev.id, step: stepId });
      if (def.steps.every((s) => next.completed.includes(s.id))) {
        track('journey_complete', { journey: prev.id });
      }
      return next;
    });
  }, []);

  const resetJourney = useCallback(() => {
    setState(null);
    writeState(null);
  }, []);

  const value = useMemo<JourneyContextValue>(() => {
    const journey = state ? JOURNEYS[state.id] : null;
    const completed = state?.completed ?? [];
    return {
      journey,
      completed,
      currentStep: journey ? (journey.steps.find((s) => !completed.includes(s.id)) ?? null) : null,
      startJourney,
      completeStep,
      resetJourney,
    };
  }, [state, startJourney, completeStep, resetJourney]);

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney(): JourneyContextValue {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error('useJourney 必须在 JourneyProvider 内使用');
  return ctx;
}
