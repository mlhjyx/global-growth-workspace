// M0-06 冒烟：应用真实渲染 + J-A 旅程启动/推进（EPIC-M0-06；PR #17 延后项的最小闭环）。
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';

function seedWorkspaceSession() {
  localStorage.setItem('ggw_auth_token', 'smoke-test');
  localStorage.setItem('ggw_onboarding_completed', 'true');
  localStorage.setItem('ggw_goal_completed', 'true');
}

describe('应用冒烟（真实路由渲染）', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });
  afterEach(cleanup);

  it('落地页渲染：品牌与入口可见', () => {
    render(<App />);
    // 品牌词 hero 拆分为 Growth/OS 两个节点，断言副标题与入口
    expect(screen.getAllByText('AI 原生增长引擎').length).toBeGreaterThan(0);
    expect(screen.getAllByText('进入工作台').length).toBeGreaterThan(0);
  });

  it('工作台渲染：目标启动器与旅程模板可见', () => {
    seedWorkspaceSession();
    window.history.pushState({}, '', '/dashboard');
    render(<App />);
    expect(screen.getByText('目标启动器')).toBeTruthy();
    expect(screen.getByText('找客户')).toBeTruthy();
    expect(screen.getByText('找经销商')).toBeTruthy();
  });

  it('点击找客户启动 J-A：旅程导航条出现、goal 已完成、进入研究步', async () => {
    seedWorkspaceSession();
    window.history.pushState({}, '', '/dashboard');
    render(<App />);

    fireEvent.click(screen.getByText('找客户'));

    await waitFor(() => {
      expect(screen.getByText('J-A 主动获客')).toBeTruthy();
      expect(screen.getByText('完成本步')).toBeTruthy();
    });
    const journey = JSON.parse(localStorage.getItem('ggw_journey')!);
    expect(journey.id).toBe('JA');
    expect(journey.completed).toContain('goal');
    expect(window.location.pathname).toBe('/research');
  });

  it('完成本步推进：completed 增长且落埋点', async () => {
    seedWorkspaceSession();
    window.history.pushState({}, '', '/dashboard');
    render(<App />);
    fireEvent.click(screen.getByText('找经销商'));
    await waitFor(() => expect(screen.getByText('完成本步')).toBeTruthy());

    fireEvent.click(screen.getByText('完成本步'));

    await waitFor(() => {
      const journey = JSON.parse(localStorage.getItem('ggw_journey')!);
      expect(journey.id).toBe('JB');
      expect(journey.completed.length).toBe(2);
    });
    const events = JSON.parse(localStorage.getItem('ggw_gate1_events')!) as { event: string }[];
    expect(events.filter((e) => e.event === 'journey_start')).toHaveLength(1);
    expect(events.filter((e) => e.event === 'journey_step_complete')).toHaveLength(2);
  });
});
