import React from 'react';
import { Copy, Check } from 'lucide-react';

export default function HistoryCookiesTab({
  currentRecord,
  handleCopy,
  copiedKey,
  t
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--apidog-text-main)' }}>
          {t('history.cookiesRecorded', { count: currentRecord.cookies?.length || 0 })}
        </div>
        <button
          onClick={() => handleCopy(currentRecord.cookies, 'allCookies')}
          className="btn-secondary"
          style={{ fontSize: '12px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {copiedKey === 'allCookies' ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
          <span>{t('history.copyAllCookies')}</span>
        </button>
      </div>

      {!currentRecord.cookies || currentRecord.cookies.length === 0 ? (
        <div
          style={{
            padding: '30px',
            textAlign: 'center',
            color: 'var(--apidog-text-muted)',
            backgroundColor: 'var(--apidog-bg)',
            borderRadius: '8px',
            border: '1px solid var(--apidog-border)',
            fontSize: '12.5px'
          }}
        >
          {t('history.noCookies')}
        </div>
      ) : (
        <div
          style={{
            border: '1px solid var(--apidog-border)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--apidog-bg)', borderBottom: '1px solid var(--apidog-border)', textAlign: 'left' }}>
                <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '160px' }}>Tên Cookie</th>
                <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '180px' }}>Domain</th>
                <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600 }}>Value</th>
                <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '120px' }}>Expires</th>
                <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '50px', textAlign: 'center' }}>{t('common.copy')}</th>
              </tr>
            </thead>
            <tbody>
              {currentRecord.cookies.map((c, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx === currentRecord.cookies.length - 1 ? 'none' : '1px solid var(--apidog-border-light, var(--apidog-border))',
                    backgroundColor: idx % 2 === 0 ? 'var(--apidog-card-bg)' : 'var(--apidog-bg)'
                  }}
                >
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--apidog-purple)', fontFamily: 'monospace' }}>
                    {c.name}
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--apidog-text-main)', fontFamily: 'monospace' }}>
                    {c.domain}
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--apidog-text-muted)', wordBreak: 'break-all' }}>
                    {c.value}
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--apidog-text-muted)' }}>
                    {c.expires}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleCopy(c.value, `cookie-${idx}`)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--apidog-text-muted)', padding: '2px' }}
                      title={t('common.copy')}
                    >
                      {copiedKey === `cookie-${idx}` ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
