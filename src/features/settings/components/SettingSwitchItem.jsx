import React from 'react';
import { Crown } from 'lucide-react';

export default function SettingSwitchItem({ label, subtitle, checked, onChange, hasCrown = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Switch pill */}
        <div
          onClick={() => onChange(!checked)}
          style={{
            width: '38px',
            height: '21px',
            borderRadius: '12px',
            backgroundColor: checked ? '#3B82F6' : '#CBD5E1',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
            cursor: 'pointer',
            transition: 'background-color 0.18s ease',
            flexShrink: 0,
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              width: '17px',
              height: '17px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              transform: checked ? 'translateX(17px)' : 'translateX(0px)',
              transition: 'transform 0.18s ease'
            }}
          />
        </div>

        {/* Label + Crown if VIP */}
        <div
          onClick={() => onChange(!checked)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
            {label}
          </span>
          {hasCrown && (
            <Crown size={13} style={{ color: '#F59E0B' }} />
          )}
        </div>
      </div>

      {/* Subtitle description */}
      {subtitle && (
        <span style={{ fontSize: '11.5px', color: '#94A3B8', paddingLeft: '48px', userSelect: 'none', lineHeight: '1.3' }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
