import { useState } from 'react';
import type { SignalEvent } from '@/mocks/accountData';
import { signalTypeConfig } from '@/mocks/accountData';
import type { DataQualityReport } from '@/mocks/accountData';

interface SignalStreamProps {
  signals: SignalEvent[];
  dataQuality: DataQualityReport;
}

export default function SignalStream({ signals, dataQuality }: SignalStreamProps) {
  const [activeTab, setActiveTab] = useState<'signals' | 'quality'>('signals');

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-primary-500/10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('signals')}
            className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
              activeTab === 'signals' ? 'text-white' : 'text-foreground-500 hover:text-foreground-300'
            }`}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-radar-line text-sm"></i>
            </span>
            信号流
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
              activeTab === 'quality' ? 'text-white' : 'text-foreground-500 hover:text-foreground-300'
            }`}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-database-2-line text-sm"></i>
            </span>
            数据质量
          </button>
        </div>
        <span className="text-foreground-600 text-[11px]">{signals.filter(s => !s.read).length} 条未读</span>
      </div>

      {activeTab === 'signals' && (
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {signals.map((event) => {
              const config = signalTypeConfig[event.signalType];
              return (
                <div
                  key={event.id}
                  className={`flex items-start gap-2 p-2 rounded-lg transition-colors ${
                    event.read ? '' : 'bg-primary-500/5'
                  } hover:bg-white/[0.02]`}
                >
                  <span className={`w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 ${config.color}`}>
                    <i className={`${config.icon} text-sm`}></i>
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground-400 text-xs">
                      <span className="text-foreground-300 font-medium">{event.accountName}</span>
                      {' · '}
                      <span className="text-primary-400">{event.signalTitle}</span>
                    </p>
                    <p className="text-foreground-700 text-[11px] mt-0.5">{event.time}</p>
                  </div>
                  {!event.read && (
                    <span className="w-2 h-2 rounded-full bg-primary-400 shrink-0 mt-1"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'quality' && (
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div className="glass-card p-2.5 text-center">
              <p className="text-white text-lg font-semibold">{dataQuality.totalAccounts}</p>
              <p className="text-foreground-600 text-[11px]">总账户</p>
            </div>
            <div className="glass-card p-2.5 text-center">
              <p className="text-success text-lg font-semibold">{dataQuality.enrichedAccounts}</p>
              <p className="text-foreground-600 text-[11px]">已补全</p>
            </div>
            <div className="glass-card p-2.5 text-center">
              <p className="text-warning text-lg font-semibold">{dataQuality.duplicateCount}</p>
              <p className="text-foreground-600 text-[11px]">重复</p>
            </div>
            <div className="glass-card p-2.5 text-center">
              <p className="text-info text-lg font-semibold">{dataQuality.verifiedCount}</p>
              <p className="text-foreground-600 text-[11px]">已验证</p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-foreground-500 text-[11px]">数据补全率</span>
                <span className="text-white text-xs">{dataQuality.enrichmentRate}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-300"
                  style={{ width: `${dataQuality.enrichmentRate}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-foreground-500 text-[11px]">去重率</span>
                <span className="text-white text-xs">{dataQuality.dedupRate}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-success to-primary-400"
                  style={{ width: `${dataQuality.dedupRate}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-primary-500/10 flex-wrap">
              <span className="text-foreground-600 text-[11px]">
                <i className="ri-mail-line mr-0.5 text-[10px]"></i>缺失邮箱: {dataQuality.missingEmail}
              </span>
              <span className="text-foreground-600 text-[11px]">
                <i className="ri-phone-line mr-0.5 text-[10px]"></i>缺失电话: {dataQuality.missingPhone}
              </span>
              <span className="text-foreground-600 text-[11px]">
                <i className="ri-linkedin-box-line mr-0.5 text-[10px]"></i>缺失 LinkedIn: {dataQuality.missingLinkedIn}
              </span>
            </div>
            <p className="text-foreground-700 text-[11px] text-right">上次更新: {dataQuality.lastUpdate}</p>
          </div>
        </div>
      )}
    </div>
  );
}