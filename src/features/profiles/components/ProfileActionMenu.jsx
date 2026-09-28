import React from 'react';
import {
  Bot,
  Copy,
  FileText,
  ExternalLink,
  Cloud
} from 'lucide-react';

/**
 * 3-dot dropdown context menu for a specific profile row or card
 */
export default function ProfileActionMenu({
  profile,
  isUpward = false,
  onClose,
  saveProfile,
  cloneProfile,
  onSave,
  onClone,
  onRunCookieRobot,
  addLog
}) {
  const save = saveProfile || onSave;
  const clone = cloneProfile || onClone;

  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '7px 12px',
    borderRadius: '6px',
    fontSize: '12.5px',
    fontWeight: 500,
    color: '#1E293B',
    cursor: 'pointer',
    transition: 'all 0.12s ease',
    whiteSpace: 'nowrap'
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      data-no-drag="true"
      style={{
        position: 'absolute',
        [isUpward ? 'bottom' : 'top']: 'calc(100% + 4px)',
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
        padding: '6px 4px',
        minWidth: '195px',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        animation: 'fadeInModal 0.15s ease',
        textAlign: 'left'
      }}
    >
      {/* 1. Run Cookie Robot */}
      <div
        onClick={() => {
          onClose?.();
          if (onRunCookieRobot) {
            onRunCookieRobot(profile);
          } else {
            addLog?.(`Đang khởi chạy Cookie Robot cho "${profile.name}"`, 'success');
            alert(`🤖 Bắt đầu chạy Cookie Robot cho profile "${profile.name}"!`);
          }
        }}
        style={menuItemStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F5F3FF';
          e.currentTarget.style.color = '#7C3AED';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#1E293B';
        }}
      >
        <Bot size={15} style={{ color: '#7C3AED' }} />
        <span style={{ fontWeight: 600 }}>Run Cookie Robot</span>
      </div>

      {/* 2. Nhân bản Profile */}
      <div
        onClick={() => {
          onClose?.();
          clone?.(profile.id);
        }}
        style={menuItemStyle}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Copy size={15} style={{ color: '#475569' }} />
        <span>Nhân bản Profile</span>
      </div>

      {/* 6. Nhập cookie */}
      <div
        onClick={() => {
          onClose?.();
          const raw = prompt(`Dán chuỗi Cookies (JSON hoặc Netscape) cho "${profile.name}":`);
          if (raw) {
            saveProfile({ ...profile, cookies: raw.trim() });
            addLog?.(`Đã nhập cookies cho "${profile.name}"`, 'success');
            alert(`Đã nhập cookies thành công cho "${profile.name}"!`);
          }
        }}
        style={menuItemStyle}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <FileText size={15} style={{ color: '#475569' }} />
        <span>Nhập cookie</span>
      </div>

      {/* 7. Xuất cookie */}
      <div
        onClick={() => {
          onClose?.();
          const sampleCookies = [
            { domain: ".google.com", name: "SID", value: "DQAA" + Math.random().toString(36).substring(2) },
            { domain: ".facebook.com", name: "c_user", value: "1000" + Math.floor(Math.random() * 899999999 + 100000000) }
          ];
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sampleCookies, null, 2));
          const dlAnchor = document.createElement('a');
          dlAnchor.setAttribute("href", dataStr);
          dlAnchor.setAttribute("download", `cookies_${profile.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
          document.body.appendChild(dlAnchor);
          dlAnchor.click();
          dlAnchor.remove();
          addLog?.(`Đã xuất file cookies cho "${profile.name}"`, 'info');
        }}
        style={menuItemStyle}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <ExternalLink size={15} style={{ color: '#475569' }} />
        <span>Xuất cookie</span>
      </div>

      {/* 8. Bật đồng bộ */}
      <div
        onClick={() => {
          onClose?.();
          const isSync = !profile.cloudSync;
          saveProfile({ ...profile, cloudSync: isSync });
          addLog?.(`${isSync ? 'Đã bật' : 'Đã tắt'} đồng bộ đám mây cho "${profile.name}"`, 'info');
          alert(`${isSync ? 'Đã bật' : 'Đã tắt'} đồng bộ đám mây cho "${profile.name}"!`);
        }}
        style={menuItemStyle}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Cloud size={15} style={{ color: profile.cloudSync ? 'var(--apidog-purple)' : '#475569' }} />
        <span>{profile.cloudSync ? 'Tắt đồng bộ' : 'Bật đồng bộ'}</span>
      </div>
    </div>
  );
}
