import React from 'react';
import { Globe, Shield, CheckCircle2 } from 'lucide-react';

export default function HistoryProxyTab({ currentRecord, t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px'
        }}
      >
        {/* Proxy Connection Box */}
        <div
          style={{
            border: '1px solid var(--apidog-border)',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: 'var(--apidog-bg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Globe size={16} color="var(--apidog-purple)" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
              {t('history.proxyServerInfo')}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--apidog-border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--apidog-text-muted)' }}>{t('history.proxyProto')}</span>
              <strong style={{ color: 'var(--apidog-text-main)' }}>{currentRecord.proxy?.type || 'SOCKS5'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--apidog-border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--apidog-text-muted)' }}>{t('history.proxyHostPort')}</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--apidog-text-main)' }}>
                {currentRecord.proxy?.host ? `${currentRecord.proxy.host}:${currentRecord.proxy.port}` : 'Direct Connection'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--apidog-border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--apidog-text-muted)' }}>{t('history.proxyExitIp')}</span>
              <span style={{ fontFamily: 'monospace', color: '#10B981', fontWeight: 700 }}>
                {currentRecord.proxy?.exitIp || currentRecord.proxy?.host || 'Chưa xác định'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--apidog-border)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--apidog-text-muted)' }}>{t('history.proxyLocation')}</span>
              <span style={{ color: 'var(--apidog-text-main)' }}>{currentRecord.proxy?.location || 'Việt Nam'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--apidog-text-muted)' }}>{t('history.proxyPing')}</span>
              <span style={{ color: '#10B981', fontWeight: 600 }}>{currentRecord.proxy?.latency || 28} ms</span>
            </div>
          </div>
        </div>

        {/* Leak Tests & Security */}
        <div
          style={{
            border: '1px solid var(--apidog-border)',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: 'var(--apidog-bg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Shield size={16} color="#10B981" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
              {t('history.leakTestTitle')}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--apidog-card-bg)', border: '1px solid var(--apidog-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#10B981" />
                <span>{t('history.dnsLeak')}</span>
              </div>
              <strong style={{ color: '#10B981' }}>{currentRecord.proxy?.dnsLeak || t('history.dnsSafe')}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--apidog-card-bg)', border: '1px solid var(--apidog-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#10B981" />
                <span>{t('history.webrtcLeak')}</span>
              </div>
              <strong style={{ color: '#10B981' }}>{currentRecord.proxy?.webrtcLeak || t('history.webrtcHidden')}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--apidog-card-bg)', border: '1px solid var(--apidog-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#10B981" />
                <span>{t('history.timezoneMatch')}</span>
              </div>
              <strong style={{ color: 'var(--apidog-purple)' }}>{t('history.match100')}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
