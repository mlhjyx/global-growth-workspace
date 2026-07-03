import { useState } from 'react';
import type { SignalEvent, DataQualityReport } from '@/mocks/accountData';
import { signalTypeConfig, SIGNAL_STATUS_LABELS } from '@/mocks/accountData';

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
              activeTab === 'signals'
                ? 'text-white'
                : 'text-foreground-500 hover:text-foreground-300'
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
              activeTab === 'quality'
                ? 'text-white'
                : 'text-foreground-500 hover:text-foreground-300'
            }`}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-database-2-line text-sm"></i>
            </span>
            数据质量
          </button>
        </div>
        <span className="text-foreground-600 text-[11px]">
          {signals.filter((s) => !s.read).length} 条未读
        </span>
      </div>

      {activeTab === 'signals' && (
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {signals.map((event) => {
              const config = signalTypeConfig[event.signal_type];
              const expired = event.status !== 'ACTIVE';
              return (
                <div
                  key={event.id}
                  className={`flex items-start gap-2 p-2 rounded-lg transition-colors ${
                    event.read ? '' : 'bg-primary-500/5'
                  } hover:bg-white/[0.02]`}
                >
                  <span
                    className={`w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 ${expired ? 'text-foreground-600' : config.color}`}
                  >
                    <i className={`${config.icon} text-sm`}></i>
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground-400 text-xs">
                      <span
                        className={`text-[9px] px-1 py-0.5 rounded mr-1 ${expired ? 'bg-white/5 text-foreground-500' : 'bg-primary-500/10 text-primary-400'}`}
                      >
                        {config.label}
                      </span>
                      <span className="text-foreground-300 font-medium">{event.accountName}</span>
                      {' · '}
                      <span className={expired ? 'text-foreground-500' : 'text-primary-400'}>
                        {event.title}
                      </span>
                      {expired && (
                        <span
                          className="ml-1.5 text-warning text-[10px]"
                          title="信号过期自动降低 Intent（LED-014）"
                        >
                          <i className="ri-time-line"></i> {SIGNAL_STATUS_LABELS[event.status]} ·
                          Intent 已降权
                        </span>
                      )}
                    </p>
                    <p className="text-foreground-700 text-[11px] mt-0.5">
                      {event.timeLabel}
                      {' · 强度 '}
                      {event.strength.toFixed(2)}
                      {' · 置信 '}
                      {Math.round(event.confidence * 100)}%{' · 来源 '}
                      {event.source.provider_id}
                    </p>
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
              <p className="text-success text-lg font-semibold">{dataQuality.emailVerified}</p>
              <p className="text-foreground-600 text-[11px]">邮箱已验证</p>
            </div>
            <div className="glass-card p-2.5 text-center">
              <p className="text-warning text-lg font-semibold">{dataQuality.emailUnverified}</p>
              <p className="text-foreground-600 text-[11px]">邮箱未验证</p>
            </div>
            <div className="glass-card p-2.5 text-center">
              <p className="text-error text-lg font-semibold">{dataQuality.maskedFields}</p>
              <p className="text-foreground-600 text-[11px]">遮罩字段</p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-foreground-500 text-[11px]">平均质量分</span>
                <span className="text-white text-xs">{dataQuality.avgQualityScore}</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-300"
                  style={{ width: `${dataQuality.avgQualityScore}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-foreground-500 text-[11px]">字段证据在有效期内</span>
                <span className="text-white text-xs">
                  {dataQuality.evidenceFresh}/{dataQuality.evidenceTotal}
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-success to-primary-400"
                  style={{
                    width: `${Math.round((dataQuality.evidenceFresh / Math.max(dataQuality.evidenceTotal, 1)) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-primary-500/10 flex-wrap">
              <span className="text-foreground-600 text-[11px]">
                <i className="ri-download-2-line mr-0.5 text-[10px]"></i>禁止导出字段:{' '}
                {dataQuality.exportRestricted}
              </span>
              <span className="text-foreground-600 text-[11px]">
                <i className="ri-mail-send-line mr-0.5 text-[10px]"></i>禁止外联字段:{' '}
                {dataQuality.outreachRestricted}
              </span>
              <span className="text-foreground-600 text-[11px]">
                <i className="ri-shield-check-line mr-0.5 text-[10px]"></i>
                字段级数据权利（展示/导出/AI/外联分别检查）
              </span>
            </div>
            <p className="text-foreground-700 text-[11px] text-right">
              最近抓取: {dataQuality.lastUpdate}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
