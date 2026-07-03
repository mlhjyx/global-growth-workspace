import { useState } from 'react';
import {
  competitors,
  marketTrends,
  featureComparisons,
  competitorAlerts,
} from '@/mocks/competitorData';
import type { Competitor } from '@/mocks/competitorData';

export default function CompetitorsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'alerts'>('overview');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [alertFilter, setAlertFilter] = useState<string>('all');

  const threatBadge = (level: string) => {
    const styles: Record<string, string> = {
      high: 'bg-red-500/15 text-red-400 border-red-500/20',
      medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
      low: 'bg-green-500/15 text-green-400 border-green-500/20',
    };
    return styles[level] || styles.low;
  };

  const impactBadge = (impact: string) => {
    const styles: Record<string, string> = {
      high: 'bg-red-500/15 text-red-400',
      medium: 'bg-amber-500/15 text-amber-400',
      low: 'bg-blue-500/15 text-blue-400',
    };
    return styles[impact] || styles.low;
  };

  const alertSeverity = (s: string) => {
    const styles: Record<string, string> = {
      critical: 'bg-red-500/15 text-red-400',
      warning: 'bg-amber-500/15 text-amber-400',
      info: 'bg-blue-500/15 text-blue-400',
    };
    return styles[s] || styles.info;
  };

  const yesNo = (v: string) => {
    if (v === 'yes') return <i className="ri-check-line text-green-400"></i>;
    if (v === 'partial') return <i className="ri-subtract-line text-amber-400"></i>;
    return <i className="ri-close-line text-foreground-700"></i>;
  };

  const filteredAlerts = alertFilter === 'all'
    ? competitorAlerts
    : competitorAlerts.filter(a => a.competitor === alertFilter);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-primary-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h1 className="text-xl font-semibold text-white">市场与竞品</h1>
            <p className="text-sm text-foreground-500 mt-0.5">
              监控 {competitors.length} 家竞品 · {competitorAlerts.length} 条最新动态
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs bg-primary-500/15 text-primary-400 px-3 py-1.5 rounded-full border border-primary-500/20 hover:bg-primary-500/25 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-add-line mr-1"></i>
              添加竞品
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-background-100/30 rounded-lg p-1 w-full md:w-fit overflow-x-auto">
          {[
            { key: 'overview', label: '概览', icon: 'ri-radar-line' },
            { key: 'comparison', label: '功能对比', icon: 'ri-scales-3-line' },
            { key: 'alerts', label: '动态告警', icon: 'ri-alarm-warning-line' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-foreground-500 hover:text-foreground-300'
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 md:px-6 py-4">
        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Market Trends */}
            <div>
              <h2 className="text-sm font-medium text-white mb-3">市场趋势</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {marketTrends.map(trend => (
                  <div
                    key={trend.id}
                    className="bg-background-100/30 border border-primary-500/8 rounded-xl p-4 hover:border-primary-500/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${impactBadge(trend.impact)}`}>
                        {trend.impact === 'high' ? '高影响' : trend.impact === 'medium' ? '中影响' : '低影响'}
                      </span>
                      <i className={`${trend.trend === 'up' ? 'ri-arrow-up-line text-green-400' : trend.trend === 'down' ? 'ri-arrow-down-line text-red-400' : 'ri-arrow-right-line text-foreground-500'} text-sm`}></i>
                    </div>
                    <p className="text-sm font-medium text-white mb-1">{trend.title}</p>
                    <p className="text-xs text-foreground-600 leading-relaxed mb-2">{trend.description}</p>
                    <div className="flex items-center gap-2 text-[11px] text-foreground-600">
                      <span>{trend.category}</span>
                      <span>·</span>
                      <span>{trend.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Cards */}
            <div>
              <h2 className="text-sm font-medium text-white mb-3">竞品概览</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {competitors.map((comp: Competitor) => (
                  <div
                    key={comp.id}
                    className="bg-background-100/30 border border-primary-500/8 rounded-xl p-4 hover:border-primary-500/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-300/20 flex items-center justify-center text-white font-bold text-sm">
                          {comp.logo}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white">{comp.name}</h3>
                          <p className="text-xs text-foreground-500">{comp.industry}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${threatBadge(comp.threatLevel)}`}>
                        {comp.threatLevel === 'high' ? '高威胁' : comp.threatLevel === 'medium' ? '中威胁' : '低威胁'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-white">{comp.marketShare}%</p>
                        <p className="text-[10px] text-foreground-600">市场份额</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-green-400">+{comp.growthRate}%</p>
                        <p className="text-[10px] text-foreground-600">增长率</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-white">{comp.revenue}</p>
                        <p className="text-[10px] text-foreground-600">营收</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-white">{comp.sentiment}</p>
                        <p className="text-[10px] text-foreground-600">口碑</p>
                      </div>
                    </div>

                    <p className="text-xs text-foreground-500 mb-3">{comp.positioning}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-foreground-600">
                        <i className="ri-flashlight-line mr-1"></i>
                        {comp.lastActivity}
                      </span>
                      <button
                        onClick={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
                        className="text-[11px] text-primary-400 hover:text-primary-300 cursor-pointer"
                      >
                        {expandedId === comp.id ? '收起' : '详情'}
                      </button>
                    </div>

                    {expandedId === comp.id && (
                      <div className="mt-3 pt-3 border-t border-primary-500/8 space-y-2">
                        <div>
                          <p className="text-[11px] font-medium text-green-400 mb-1">核心优势</p>
                          <div className="flex flex-wrap gap-1.5">
                            {comp.strengths.map(s => (
                              <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium text-red-400 mb-1">潜在弱点</p>
                          <div className="flex flex-wrap gap-1.5">
                            {comp.weaknesses.map(w => (
                              <span key={w} className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400">{w}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-foreground-600">
                          <span>{comp.hq}</span>
                          <span>{comp.employees} 员工</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== COMPARISON TAB ===== */}
        {activeTab === 'comparison' && (
          <div className="bg-background-100/30 border border-primary-500/8 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-primary-500/8">
              <h2 className="text-sm font-medium text-white">功能矩阵对比</h2>
              <p className="text-xs text-foreground-500 mt-0.5">
                GrowthOS vs Demandbase · 6sense · Apollo.io · ZoomInfo
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary-500/8">
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground-500 w-[260px]">功能</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-primary-400">GrowthOS</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-foreground-500">Demandbase</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-foreground-500">6sense</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-foreground-500">Apollo.io</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparisons.map((row, idx) => (
                    <tr key={idx} className="border-b border-primary-500/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5 text-xs text-white">{row.feature}</td>
                      <td className="text-center px-4 py-2.5">{yesNo(row.us)}</td>
                      <td className="text-center px-4 py-2.5">{yesNo(row.competitorA)}</td>
                      <td className="text-center px-4 py-2.5">{yesNo(row.competitorB)}</td>
                      <td className="text-center px-4 py-2.5">{yesNo(row.competitorC)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-primary-500/8 flex items-center gap-4 text-[11px] text-foreground-600">
              <span className="flex items-center gap-1"><i className="ri-check-line text-green-400"></i> 完全支持</span>
              <span className="flex items-center gap-1"><i className="ri-subtract-line text-amber-400"></i> 部分支持</span>
              <span className="flex items-center gap-1"><i className="ri-close-line text-foreground-700"></i> 不支持</span>
            </div>
          </div>
        )}

        {/* ===== ALERTS TAB ===== */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-foreground-500">筛选竞品：</span>
              <button
                onClick={() => setAlertFilter('all')}
                className={`px-2.5 py-1 rounded-full text-xs cursor-pointer whitespace-nowrap ${
                  alertFilter === 'all' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-foreground-500 hover:text-foreground-300'
                }`}
              >
                全部
              </button>
              {competitors.map(c => (
                <button
                  key={c.id}
                  onClick={() => setAlertFilter(c.name)}
                  className={`px-2.5 py-1 rounded-full text-xs cursor-pointer whitespace-nowrap ${
                    alertFilter === c.name ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-foreground-500 hover:text-foreground-300'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="bg-background-100/30 border border-primary-500/8 rounded-xl p-4 hover:border-primary-500/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${alertSeverity(alert.severity)}`}>
                      <i className={`${
                        alert.type === 'funding' ? 'ri-money-cny-circle-line' :
                        alert.type === 'product' ? 'ri-product-hunt-line' :
                        alert.type === 'pricing' ? 'ri-price-tag-3-line' :
                        alert.type === 'campaign' ? 'ri-megaphone-line' :
                        'ri-user-add-line'
                      } text-sm`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-white">{alert.competitor}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${alertSeverity(alert.severity)}`}>
                          {alert.severity === 'critical' ? '关键' : alert.severity === 'warning' ? '警示' : '信息'}
                        </span>
                      </div>
                      <p className="text-sm text-white mb-1">{alert.title}</p>
                      <p className="text-[11px] text-foreground-600">{alert.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}