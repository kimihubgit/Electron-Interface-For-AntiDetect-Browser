import React from 'react';

/**
 * AppSpinningLogo - Clover 4 cánh xoay tròn khớp với hiệu ứng reload của ứng dụng
 */
export function AppSpinningLogo({ size = 26, color = '#C084FC', style = {} }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'spin 1s linear infinite',
        transformOrigin: 'center',
        ...style
      }}
    >
      <svg
        width={Math.round(size * 0.85)}
        height={Math.round(size * 0.85)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="3" width="7.5" height="7.5" rx="2.5" fill={color} />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.5" fill={color} />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.5" fill={color} />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.5" fill={color} />
      </svg>
    </div>
  );
}

/**
 * AppLoadingScreen - Màn hình loading khi tải trang / chờ API phản hồi
 * Hiển thị chính giữa giống như khi người dùng bấm nút reload lại trang
 */
export default function AppLoadingScreen({ text = '', minHeight = '320px', style = {} }) {
  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        minHeight,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        userSelect: 'none',
        ...style
      }}
    >
      <AppSpinningLogo size={28} />
      {text && (
        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
          {text}
        </span>
      )}
    </div>
  );
}
