import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';
import CountryFlag from '../common/CountryFlag';

export const SERVERS_LIST = [
  { id: 'auto-default-1', name: 'Auto (Default (1))', location: 'Global', countryCode: 'WW', ping: 18 },
  { id: 'default-1', name: 'Default (1)', location: 'Global', countryCode: 'WW', ping: 22 },
  { id: 'default-2', name: 'Default (2)', location: 'Global', countryCode: 'WW', ping: 25 },
  { id: 'default-3', name: 'Default (3)', location: 'Global', countryCode: 'WW', ping: 28 },
  { id: 'ru-3', name: 'Russian Federation (3)', location: 'Russia', countryCode: 'RU', ping: 55 },
  { id: 'de-1', name: 'Germany (1)', location: 'Germany', countryCode: 'DE', ping: 42 },
  { id: 'ru-1', name: 'Russian Federation (1)', location: 'Russia', countryCode: 'RU', ping: 58 },
  { id: 'de-2', name: 'Germany (2)', location: 'Germany', countryCode: 'DE', ping: 44 },
  { id: 'de-3', name: 'Germany (3)', location: 'Germany', countryCode: 'DE', ping: 47 },
  { id: 'ru-2', name: 'Russian Federation (2)', location: 'Russia', countryCode: 'RU', ping: 60 },
  { id: 'fi-1', name: 'Finland (1)', location: 'Finland', countryCode: 'FI', ping: 52 },
  { id: 'ua-1', name: 'Ukraine (1)', location: 'Ukraine', countryCode: 'UA', ping: 63 },
  { id: 'ua-2', name: 'Ukraine (2)', location: 'Ukraine', countryCode: 'UA', ping: 65 },
  { id: 'sg-1', name: 'Singapore (1)', location: 'Singapore', countryCode: 'SG', ping: 15 },
  { id: 'us-1', name: 'United States (1)', location: 'United States', countryCode: 'US', ping: 80 }
];

export default function SelectServerModal({
  isOpen,
  onClose,
  currentServer = 'Auto (Default (1))',
  onSelectServer
}) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(() => {
    const found = SERVERS_LIST.find(s => s.name === currentServer);
    return found ? found.id : SERVERS_LIST[0].id;
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleConfirm = () => {
    const found = SERVERS_LIST.find(s => s.id === selectedId);
    if (found) {
      onSelectServer?.(found);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Main Modal Dialog matching the screenshot */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInModal 0.18s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px 14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #F1F5F9'
          }}
        >
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#1E293B' }}>
            {t('server.title', 'Select server')}
          </span>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#64748B',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Subtitle & Refresh link */}
        <div style={{ padding: '16px 20px 12px 20px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#475569', lineHeight: 1.4 }}>
            {t('server.desc', "If you're having trouble connecting, try changing the server.")}
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#3B82F6',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            {isRefreshing && <RefreshCw size={12} className="animate-spin" />}
            <span>{t('server.refresh', 'Refresh list')}</span>
          </button>
        </div>

        {/* Server Table */}
        <div
          style={{
            borderTop: '1px solid #F1F5F9',
            maxHeight: '380px',
            overflowY: 'auto'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #F1F5F9', color: '#334155', fontWeight: 600 }}>
                <th style={{ padding: '10px 16px', textAlign: 'center', width: '60px' }}>{t('server.active', 'Active')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>{t('server.serverName', 'Name')}</th>
                <th style={{ padding: '10px 24px', textAlign: 'right', width: '90px' }}>{t('server.location', 'Location')}</th>
              </tr>
            </thead>
            <tbody>
              {SERVERS_LIST.map((srv) => {
                const isSelected = selectedId === srv.id;
                return (
                  <tr
                    key={srv.id}
                    onClick={() => setSelectedId(srv.id)}
                    style={{
                      cursor: 'pointer',
                      borderBottom: '1px solid #F8FAFC',
                      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.04)' : 'transparent',
                      transition: 'background-color 0.1s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Radio Button with outer ring and inner dot matching screenshot */}
                    <td style={{ padding: '11px 16px', textAlign: 'center' }}>
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #3B82F6' : '1.5px solid #CBD5E1',
                          backgroundColor: '#FFFFFF',
                          margin: '0 auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.12s ease',
                          boxSizing: 'border-box'
                        }}
                      >
                        {isSelected && (
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#3B82F6'
                            }}
                          />
                        )}
                      </div>
                    </td>

                    {/* Server Name */}
                    <td style={{ padding: '11px 12px', color: '#1E293B', fontWeight: isSelected ? 600 : 400 }}>
                      {srv.name}
                    </td>

                    {/* Location Flag / Text */}
                    <td style={{ padding: '11px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }} title={srv.location}>
                        <CountryFlag code={srv.countryCode || 'WW'} width={20} height={14} />
                        <span style={{ color: '#475569', fontSize: '12px' }}>
                          {srv.location}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Buttons */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            backgroundColor: '#FAFAFA'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '7px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#F1F5F9',
              color: '#334155',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E2E8F0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
          >
            {t('common.cancel', 'Cancel')}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            style={{
              padding: '7px 22px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(59, 130, 246, 0.25)',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3B82F6')}
          >
            {t('common.confirm', 'Confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
