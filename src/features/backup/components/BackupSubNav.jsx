import React from 'react';
import { Database, CloudUpload, History, Clock } from 'lucide-react';
import { BACKUP_PROVIDERS } from '../backupConstants';

export default function BackupSubNav({
  activeSubTab,
  onTabChange,
  historyCount
}) {
  const tabs = [
    { id: 'providers', label: 'Nền tảng lưu trữ', icon: Database, count: BACKUP_PROVIDERS.length },
    { id: 'create', label: 'Tiến hành sao lưu', icon: CloudUpload },
    { id: 'history', label: 'Lịch sử & Phục hồi', icon: History, count: historyCount },
    { id: 'schedule', label: 'Lên lịch tự động', icon: Clock }
  ];

  return (
    <div style={{
      padding: '0 24px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      display: 'flex',
      gap: '4px',
      flexShrink: 0
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSubTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid var(--apidog-purple)' : '2px solid transparent',
              color: isActive ? 'var(--apidog-purple)' : '#64748B',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Icon size={15} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span style={{
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '9999px',
                backgroundColor: isActive ? '#EDE9FE' : '#F1F5F9',
                color: isActive ? 'var(--apidog-purple)' : '#64748B',
                fontWeight: 600
              }}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
