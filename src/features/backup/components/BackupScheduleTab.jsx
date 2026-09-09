import React from 'react';
import { Clock, Shield, Bell, Check, Save } from 'lucide-react';
import { BACKUP_PROVIDERS } from '../backupConstants';

export default function BackupScheduleTab({ schedule, onUpdateSchedule, configs }) {
  return (
    <div style={{
      maxWidth: '680px',
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      <div>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
          Lên lịch tự động sao lưu định kỳ (Auto Backup)
        </h3>
        <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>
          Tự động đồng bộ hồ sơ lên Cloud / Telegram theo lịch trình đã đặt mà không cần thao tác thủ công.
        </p>
      </div>

      {/* Main toggle */}
      <div style={{
        padding: '14px 16px',
        backgroundColor: '#F8FAFC',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>
            Bật tính năng Tự động Sao lưu
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
            Ứng dụng sẽ tự động chạy tiến trình ngầm và đẩy file mã hóa lên nền tảng đã chọn.
          </div>
        </div>
        <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '24px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={schedule.enabled}
            onChange={(e) => onUpdateSchedule({ enabled: e.target.checked })}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: schedule.enabled ? 'var(--apidog-purple)' : '#CBD5E1',
            borderRadius: '9999px',
            transition: '0.2s'
          }}>
            <span style={{
              position: 'absolute',
              height: '18px',
              width: '18px',
              left: schedule.enabled ? '20px' : '3px',
              bottom: '3px',
              backgroundColor: '#FFFFFF',
              borderRadius: '50%',
              transition: '0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }} />
          </span>
        </label>
      </div>

      {/* Settings Grid */}
      <div style={{
        opacity: schedule.enabled ? 1 : 0.45,
        pointerEvents: schedule.enabled ? 'auto' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'opacity 0.2s ease'
      }}>
        {/* Destination provider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
            Nền tảng Cloud tự động đồng bộ
          </label>
          <select
            value={schedule.providerId}
            onChange={(e) => onUpdateSchedule({ providerId: e.target.value })}
            style={{
              height: '38px',
              padding: '0 12px',
              borderRadius: '7px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '13px',
              color: '#0F172A',
              outline: 'none'
            }}
          >
            {BACKUP_PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {configs[p.id]?.isConfigured ? '✓ (Đã kết nối)' : '(Chưa cấu hình)'}
              </option>
            ))}
          </select>
        </div>

        {/* Interval options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
            Tần suất sao lưu
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { id: 'on_close', title: 'Sau mỗi lần tắt app', desc: 'Đồng bộ ngay khi đóng trình duyệt' },
              { id: 'daily', title: 'Hàng ngày (02:00 AM)', desc: 'Chạy định kỳ vào ban đêm' },
              { id: 'weekly', title: 'Hàng tuần (Chủ Nhật)', desc: 'Tối ưu dung lượng lưu trữ' }
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => onUpdateSchedule({ interval: opt.id })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: schedule.interval === opt.id ? '1.5px solid var(--apidog-purple)' : '1px solid #E2E8F0',
                  backgroundColor: schedule.interval === opt.id ? '#FAF5FF' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: schedule.interval === opt.id ? 'var(--apidog-purple)' : '#0F172A' }}>
                  {opt.title}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
                  {opt.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Options: Auto-encrypt, notify telegram */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '6px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: '#1E293B' }}>
            <input
              type="checkbox"
              checked={schedule.autoEncrypt}
              onChange={(e) => onUpdateSchedule({ autoEncrypt: e.target.checked })}
              style={{ accentColor: 'var(--apidog-purple)' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={13} style={{ color: 'var(--apidog-purple)' }} />
              <span>Tự động mã hóa AES-256 trước khi tải lên Cloud</span>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: '#1E293B' }}>
            <input
              type="checkbox"
              checked={schedule.notifyTelegram}
              onChange={(e) => onUpdateSchedule({ notifyTelegram: e.target.checked })}
              style={{ accentColor: 'var(--apidog-purple)' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bell size={13} style={{ color: '#0284C7' }} />
              <span>Gửi tin nhắn Telegram thông báo kết quả sau mỗi phiên sao lưu tự động</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
