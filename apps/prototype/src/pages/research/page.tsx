// 研究页（一级导航第 2 项，母本 5.2）：PG-003 市场扫描 / PG-004 研究工作台 / 竞争情报
import { useState } from 'react';
import MarketScan from './components/MarketScan';
import ResearchWorkspace from './components/ResearchWorkspace';
import CompetitiveIntel from './components/CompetitiveIntel';
import type { MarketCandidate } from '@/mocks/researchData';

type Tab = 'scan' | 'workspace' | 'competitive';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'scan', label: '全球市场扫描', icon: 'ri-earth-line' },
  { key: 'workspace', label: '研究工作台', icon: 'ri-flask-line' },
  { key: 'competitive', label: '竞争情报', icon: 'ri-radar-line' },
];

export default function ResearchPage() {
  // 支持 ?tab= 直达（旧 /competitors 路由重定向到竞争情报 tab，不落在默认扫描页）
  const [params] = useSearchParams();
  const initialTab = params.get('tab');
  const [tab, setTab] = useState<Tab>(
    initialTab === 'workspace' || initialTab === 'competitive' ? initialTab : 'scan',
  );
  // 从扫描卡进入深度研究时携带所选市场，工作台据此展示对应上下文
  const [market, setMarket] = useState<MarketCandidate | null>(null);

  return (
    <div className="flex flex-col md:h-[calc(100vh-3.5rem)]">
      {/* 顶栏 */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between px-3 md:px-5 py-2.5 md:py-3 border-b border-primary-500/10 shrink-0 gap-2"
        style={{
          background: 'linear-gradient(90deg, rgba(12,10,26,0.8) 0%, rgba(26,16,60,0.6) 100%)',
        }}
      >
        <div>
          <h1 className="text-white text-base md:text-lg font-semibold">研究</h1>
          <p className="text-foreground-500 text-xs mt-0.5">
            全球市场扫描 · 深度研究 · 竞争监测（研究必须产出可执行对象，母本 7.3）
          </p>
        </div>
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1.5 border ${
                tab === t.key
                  ? 'bg-primary-500/15 text-primary-300 border-primary-500/30'
                  : 'text-foreground-500 border-transparent hover:text-foreground-300'
              }`}
            >
              <i className={t.icon}></i>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto p-3 md:p-5">
        {tab === 'scan' && (
          <MarketScan
            onEnterResearch={(c) => {
              setMarket(c);
              setTab('workspace');
            }}
          />
        )}
        {tab === 'workspace' && <ResearchWorkspace key={market?.id ?? 'active'} market={market} />}
        {tab === 'competitive' && <CompetitiveIntel />}
      </div>
    </div>
  );
}
