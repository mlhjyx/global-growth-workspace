// 目标启动器（EPIC-M0-04 T4，PG-001 第一区）：模板启动 / 自然语言输入 / 继续未完成目标。
// 验收口径：无企业资料时先建立最小企业上下文（引导去知识库）。
// M0-06 T1：找客户/找经销商模板启动 J-A/J-B 旅程（跨页导航条随之激活）。
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJourney } from '@/journey/journey-context';
import type { JourneyId } from '@/journey/journeys';

const GOAL_TEMPLATES: {
  icon: string;
  label: string;
  desc: string;
  to: string;
  journey?: JourneyId;
}[] = [
  {
    icon: 'ri-user-search-line',
    label: '找客户',
    desc: 'J-A 旅程：目标 → SAO 全链',
    to: '/research',
    journey: 'JA',
  },
  {
    icon: 'ri-store-2-line',
    label: '找经销商',
    desc: 'J-B 旅程：渠道伙伴招募',
    to: '/research',
    journey: 'JB',
  },
  { icon: 'ri-earth-line', label: '进入市场', desc: '全球扫描 → 深度研究', to: '/research' },
  { icon: 'ri-quill-pen-line', label: '做内容', desc: '基于 Approved Claim 生成', to: '/content' },
  { icon: 'ri-chat-3-line', label: '处理互动', desc: '统一收件箱与意向确认', to: '/engagement' },
];

export default function GoalLauncher() {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { startJourney } = useJourney();

  const launch = (tpl: (typeof GOAL_TEMPLATES)[number]) => {
    if (tpl.journey) {
      const first = startJourney(tpl.journey);
      navigate(first.path);
      return;
    }
    navigate(tpl.to);
  };

  return (
    <div className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-primary-500/10 p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-white text-sm font-semibold">
          <i className="ri-flag-2-line text-primary-400 mr-1.5"></i>目标启动器
        </h3>
        <Link to="/goal" className="text-[11px] text-primary-400 hover:text-primary-300">
          继续未完成目标：东南亚光伏经销商招募（研究中）
          <i className="ri-arrow-right-line ml-0.5"></i>
        </Link>
      </div>

      {/* 模板启动（找客户/找经销商启动 J-A/J-B 旅程） */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-3">
        {GOAL_TEMPLATES.map((g) => (
          <button
            key={g.label}
            onClick={() => launch(g)}
            className="text-left rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 hover:border-primary-500/40 hover:bg-primary-500/5 transition-colors cursor-pointer"
          >
            <p className="text-foreground-200 text-xs font-medium">
              <i className={`${g.icon} text-primary-400 mr-1`}></i>
              {g.label}
            </p>
            <p className="text-foreground-600 text-[10px] mt-0.5">{g.desc}</p>
          </button>
        ))}
      </div>

      {/* 自然语言输入（模拟） */}
      {submitted ? (
        <p className="text-success text-[11px]">
          <i className="ri-checkbox-circle-line mr-1"></i>
          已解析为目标草案（模拟）：系统将建议研究范围与 ICP 起点，确认后进入执行——AI
          只提出计划，启动仍需你确认
        </p>
      ) : (
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='用一句话描述目标，如"在肯尼亚找 20 家石膏板经销商"...'
            className="flex-1 px-3 py-2 text-xs bg-input-bg border-input-border rounded-lg"
          />
          <button
            disabled={!input.trim()}
            onClick={() => setSubmitted(true)}
            className="px-3 py-2 rounded-lg text-xs bg-primary-500/15 text-primary-300 border border-primary-500/30 hover:bg-primary-500/25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            启动（模拟）
          </button>
        </div>
      )}
      <p className="text-foreground-700 text-[10px] mt-2">
        企业资料不完整时会先引导建立最小企业上下文（
        <Link to="/knowledge" className="text-primary-400 hover:text-primary-300">
          去知识库补全
        </Link>
        ）
      </p>
    </div>
  );
}
