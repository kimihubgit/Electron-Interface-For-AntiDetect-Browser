import React from 'react';
import { Clock, Cpu, Globe, Cookie as CookieIcon } from 'lucide-react';

export default function HistoryMetricCards({ currentRecord, t }) {
  return (
    <div
      style={{
        padding: '12px 18px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        backgroundColor: 'var(--apidog-bg)',
        borderBottom: '1px solid var(--apidog-border)',
        flexShrink: 0
      }}
    >
      {/* Card 1: Thời lượng chạy */}
      <div
        style={{
          backgroundColor: 'var(--apidog-card-bg)',
          border: '1px solid var(--apidog-border)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--apidog-text-muted)', fontSize: '11px', fontWeight: 600 }}>
          <span>{t('history.cardDuration')}</span>
          <Clock size={13} color="var(--apidog-purple)" />
        </div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
          {currentRecord.duration || '00:00:00'}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--apidog-text-muted)' }}>
          {t('common.status')}: {currentRecord.endTime || t('history.statusRunning')}
        </div>
      </div>

      {/* Card 2: Tài nguyên & PID */}
      <div
        style={{
          backgroundColor: 'var(--apidog-card-bg)',
          border: '1px solid var(--apidog-border)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--apidog-text-muted)', fontSize: '11px', fontWeight: 600 }}>
          <span>{t('history.cardPidRam')}</span>
          <Cpu size={13} color="#3B82F6" />
        </div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
          PID: {currentRecord.processPid || 'N/A'} • {currentRecord.memoryUsage || '0 MB'}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--apidog-text-muted)' }}>
          CPU: {currentRecord.cpuUsage || '0%'} • Chromium Sandbox
        </div>
      </div>

      {/* Card 3: Proxy & Vị trí IP */}
      <div
        style={{
          backgroundColor: 'var(--apidog-card-bg)',
          border: '1px solid var(--apidog-border)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--apidog-text-muted)', fontSize: '11px', fontWeight: 600 }}>
          <span>{t('history.cardProxyIp')}</span>
          <Globe size={13} color="#10B981" />
        </div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--apidog-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {currentRecord.proxy?.host ? `${currentRecord.proxy.type || 'SOCKS5'}://${currentRecord.proxy.host}` : 'Direct Connection'}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--apidog-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {currentRecord.proxy?.location || 'Mặc định máy chủ'} ({currentRecord.proxy?.latency || 25}ms)
        </div>
      </div>

      {/* Card 4: Cookies & Kho dữ liệu */}
      <div
        style={{
          backgroundColor: 'var(--apidog-card-bg)',
          border: '1px solid var(--apidog-border)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--apidog-text-muted)', fontSize: '11px', fontWeight: 600 }}>
          <span>{t('history.cardCookies')}</span>
          <CookieIcon size={13} color="#F59E0B" />
        </div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
          Nạp: {currentRecord.cookiesLoaded || 0} • Lưu: {currentRecord.cookiesSaved || 0}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--apidog-text-muted)' }}>
          Trạng thái: Đã mã hóa AES-256
        </div>
      </div>
    </div>
  );
}
