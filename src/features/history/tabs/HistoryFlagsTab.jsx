import React from 'react';
import { Copy, Check } from 'lucide-react';

export default function HistoryFlagsTab({
  currentRecord,
  handleCopy,
  copiedKey,
  t
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--apidog-text-main)' }}>
          {t('history.cliFlagsDesc')}
        </div>
        <button
          onClick={() => handleCopy((currentRecord.launchArgs || []).join(' '), 'allFlags')}
          className="btn-secondary"
          style={{ fontSize: '12px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {copiedKey === 'allFlags' ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
          <span>{t('history.copyCliFlags')}</span>
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#0F172A',
          color: '#38BDF8',
          padding: '16px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '12px',
          lineHeight: 1.8,
          border: '1px solid #1E293B',
          overflowX: 'auto'
        }}
      >
        <div style={{ color: '#94A3B8', marginBottom: '8px' }}># Chromium Process Executable:</div>
        <div style={{ color: '#F8FAFC', marginBottom: '12px' }}>
          "C:\Program Files\AntidetectBrowser\App\chrome.exe"
        </div>
        <div style={{ color: '#94A3B8', marginBottom: '6px' }}># Arguments:</div>
        {(
          currentRecord.launchArgs || [
            '--disable-blink-features=AutomationControlled',
            '--no-first-run',
            '--password-store=basic'
          ]
        ).map((arg, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px' }}>
            <span style={{ color: '#64748B' }}>\</span>
            <span style={{ color: arg.startsWith('--proxy') ? '#F59E0B' : arg.startsWith('--user-data') ? '#A78BFA' : '#38BDF8' }}>
              {arg}
            </span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '11.5px', color: 'var(--apidog-text-muted)', lineHeight: 1.5 }}>
        * Ghi chú: Cờ <code>--disable-blink-features=AutomationControlled</code> loại bỏ hoàn toàn thuộc tính <code>navigator.webdriver = true</code> nhằm vượt qua Cloudflare Turnstile, DataDome, và Akamai Bot Manager.
      </div>
    </div>
  );
}
