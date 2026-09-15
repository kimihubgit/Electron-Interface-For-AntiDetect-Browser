import React from 'react';
import { ShieldCheck, Copy, Check } from 'lucide-react';

export default function HistoryFingerprintTab({
  currentRecord,
  handleCopy,
  copiedKey,
  t
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderRadius: '8px',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={18} color="#10B981" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#10B981' }}>
              {t('history.fpScore')}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--apidog-text-muted)' }}>
              {t('history.fpIsolated')}
            </div>
          </div>
        </div>
        <button
          onClick={() => handleCopy(currentRecord.fingerprintSnapshot, 'fingerprint')}
          className="btn-secondary"
          style={{ fontSize: '11.5px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          {copiedKey === 'fingerprint' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
          <span>{copiedKey === 'fingerprint' ? t('common.copied') : t('history.copyFingerprint')}</span>
        </button>
      </div>

      {/* Fingerprint Parameters Table */}
      <div
        style={{
          border: '1px solid var(--apidog-border)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--apidog-bg)', borderBottom: '1px solid var(--apidog-border)', textAlign: 'left' }}>
              <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '220px' }}>{t('history.fpColProp')}</th>
              <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '120px' }}>{t('history.fpColCat')}</th>
              <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600 }}>{t('history.fpColVal')}</th>
              <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '60px', textAlign: 'center' }}>{t('common.copy')}</th>
            </tr>
          </thead>
          <tbody>
            {(currentRecord.fingerprintSnapshot || []).map((item, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: idx === currentRecord.fingerprintSnapshot.length - 1 ? 'none' : '1px solid var(--apidog-border-light, var(--apidog-border))',
                  backgroundColor: idx % 2 === 0 ? 'var(--apidog-card-bg)' : 'var(--apidog-bg)'
                }}
              >
                <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--apidog-text-main)' }}>
                  {item.label}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--apidog-bg)',
                      border: '1px solid var(--apidog-border)',
                      color: 'var(--apidog-text-muted)'
                    }}
                  >
                    {item.category || 'Hệ thống'}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--apidog-text-main)', wordBreak: 'break-all' }}>
                  {item.value}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleCopy(item.value, `fp-${idx}`)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--apidog-text-muted)',
                      padding: '2px'
                    }}
                    title={t('common.copy')}
                  >
                    {copiedKey === `fp-${idx}` ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
