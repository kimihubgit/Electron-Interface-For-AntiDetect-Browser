import React from 'react';
import {
  Crown,
  Zap,
  ArrowRight,
  Radio,
  MousePointer,
  Keyboard,
  Scroll,
  Globe,
  Sliders,
  Sparkles
} from 'lucide-react';

export default function SyncSignalFlow({
  masterProfile,
  slaves = [],
  isSyncing,
  delayRange = 45,
  lastAction
}) {
  const activeSlaves = slaves.filter(s => s.isSyncActive);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '16px 20px',
      borderRadius: '12px',
      backgroundColor: 'var(--apidog-card-bg)',
      border: '1px solid var(--apidog-border)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={15} style={{ color: '#7C3AED' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
            SƠ ĐỒ PHÁT & NHẬN TÍN HIỆU ĐỒNG BỘ (SIGNAL DISPATCH DIAGRAM)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748B' }}>
          <span>Tình trạng đường truyền:</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: isSyncing ? '#059669' : '#64748B',
            fontWeight: 700
          }}>
            {isSyncing ? '● Đang truyền tín hiệu' : '○ Tạm ngắt'}
          </span>
        </div>
      </div>

      {/* Visual Pipeline Flow */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        backgroundColor: '#F8FAFC',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        {/* Node 1: Master Profile Node */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 16px',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          border: '2px solid #7C3AED',
          boxShadow: '0 4px 10px rgba(124, 58, 237, 0.1)',
          minWidth: '150px'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#EDE9FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7C3AED'
          }}>
            <Crown size={15} />
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E1B4B', textAlign: 'center' }}>
            {masterProfile?.name || 'Master Profile'}
          </span>
          <span style={{ fontSize: '10px', color: '#7C3AED', fontWeight: 600 }}>
            👑 CỬA SỔ PHÁT
          </span>
        </div>

        {/* Arrow to Dispatch Engine */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', flex: 1, minWidth: '60px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '9.5px',
            fontWeight: 700,
            color: '#7C3AED',
            backgroundColor: '#F5F3FF',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            <span>HOOK SỰ KIỆN</span>
            <ArrowRight size={10} />
          </div>
          <div style={{
            width: '100%',
            height: '2px',
            backgroundColor: isSyncing ? '#7C3AED' : '#CBD5E1',
            position: 'relative'
          }}>
            {isSyncing && (
              <div style={{
                position: 'absolute',
                top: '-3px',
                left: '45%',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#7C3AED',
                animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
              }} />
            )}
          </div>
        </div>

        {/* Node 2: Dispatcher & Anti-Bot Jitter Engine */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 16px',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #3B82F6',
          boxShadow: '0 4px 10px rgba(59, 130, 246, 0.1)',
          minWidth: '170px'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#DBEAFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563EB'
          }}>
            <Zap size={15} />
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E3A8A', textAlign: 'center' }}>
            Bộ Điều Phối Tín Hiệu
          </span>
          <span style={{ fontSize: '10px', color: '#2563EB', fontWeight: 600 }}>
            ⚡ Jitter: ~{delayRange}ms
          </span>
        </div>

        {/* Arrow to Slaves */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', flex: 1, minWidth: '60px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '9.5px',
            fontWeight: 700,
            color: '#2563EB',
            backgroundColor: '#EFF6FF',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            <span>NHÂN BẢN</span>
            <ArrowRight size={10} />
          </div>
          <div style={{
            width: '100%',
            height: '2px',
            backgroundColor: isSyncing ? '#2563EB' : '#CBD5E1',
            position: 'relative'
          }} />
        </div>

        {/* Node 3: Controlled Slaves Group */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 16px',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #10B981',
          boxShadow: '0 4px 10px rgba(16, 185, 129, 0.1)',
          minWidth: '160px'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#D1FAE5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#059669'
          }}>
            <Radio size={15} />
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#064E3B', textAlign: 'center' }}>
            {activeSlaves.length} Chrome Phụ (Slaves)
          </span>
          <span style={{ fontSize: '10px', color: '#059669', fontWeight: 600 }}>
            🎯 CỬA SỔ LÀM THEO
          </span>
        </div>
      </div>
    </div>
  );
}
