// M0-06 冒烟：旅程定义 ↔ 路由一致性 + 埋点聚合语义（EPIC-M0-06 T1/T2）。
import { beforeEach, describe, expect, it } from 'vitest';
import routes from '../src/router/config';
import { JOURNEYS } from '../src/journey/journeys';
import {
  clearGate1Events,
  getGate1Events,
  getGate1Metrics,
  track,
} from '../src/analytics/analytics';
import type { RouteObject } from 'react-router-dom';

function collectPaths(list: RouteObject[]): string[] {
  return list.flatMap((r) => [
    ...(r.path ? [r.path] : []),
    ...(r.children ? collectPaths(r.children) : []),
  ]);
}

describe('J-A/J-B 旅程定义', () => {
  const routePaths = collectPaths(routes);

  it('每个旅程步骤的承载页都在路由表中（防止串线断链）', () => {
    for (const journey of Object.values(JOURNEYS)) {
      for (const step of journey.steps) {
        expect(routePaths, `${journey.id}.${step.id} → ${step.path}`).toContain(step.path);
      }
    }
  });

  it('两个旅程都以目标开始、SAO 结束（Gate 1 出口口径）', () => {
    for (const journey of Object.values(JOURNEYS)) {
      expect(journey.steps[0]!.id).toBe('goal');
      expect(journey.steps[journey.steps.length - 1]!.id).toBe('sao');
      expect(journey.steps.length).toBe(8);
      // step id 不重复（completed 数组语义依赖）
      expect(new Set(journey.steps.map((s) => s.id)).size).toBe(journey.steps.length);
    }
  });
});

describe('Gate 1 埋点聚合', () => {
  beforeEach(() => clearGate1Events());

  it('track 落盘且指标聚合正确（完成率 = 完成/启动）', () => {
    track('journey_start', { journey: 'JA' });
    track('journey_step_complete', { journey: 'JA', step: 'goal' });
    track('journey_start', { journey: 'JB' });
    track('journey_complete', { journey: 'JA' });
    track('term_help_open', { title: 'ICP 依据' });
    track('error_recover', { item: 'x' });
    track('approval_decision', { decision: 'APPROVED' });

    const m = getGate1Metrics();
    expect(m.journeyStarts).toBe(2);
    expect(m.journeyCompletes).toBe(1);
    expect(m.completionRate).toBe(0.5);
    expect(m.stepCompletions).toBe(1);
    expect(m.termHelpOpens).toBe(1);
    expect(m.errorRecovers).toBe(1);
    expect(m.approvalDecisions).toBe(1);
    expect(getGate1Events()).toHaveLength(7);
  });

  it('无启动时完成率为 null（看板显示启动数而非除零）', () => {
    expect(getGate1Metrics().completionRate).toBeNull();
  });

  it('重置采集清零', () => {
    track('journey_start', { journey: 'JA' });
    clearGate1Events();
    expect(getGate1Events()).toHaveLength(0);
  });
});
