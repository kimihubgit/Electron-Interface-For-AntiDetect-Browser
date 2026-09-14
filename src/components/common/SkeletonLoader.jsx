import React from 'react';

/**
 * SkeletonLoader - Hiệu ứng loading dạng skeleton placeholder
 * Khớp hoàn toàn với thiết kế người dùng yêu cầu (các thanh ngang bo tròn với hiệu ứng shimmer)
 * 
 * @param {'lines' | 'table' | 'cards'} type - Kiểu hiển thị skeleton
 * @param {number} count - Số dòng hoặc số item
 * @param {string} className - Class tùy biến thêm
 */
export default function SkeletonLoader({
  type = 'lines',
  count = 4,
  dark = false,
  style = {},
  className = ''
}) {
  const shimmerClass = dark ? 'skeleton-shimmer-dark' : 'skeleton-shimmer';

  if (type === 'table') {
    return (
      <div style={{ width: '100%', padding: '16px 20px', ...style }} className={className}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 0',
              borderBottom: dark ? '1px solid #334155' : '1px solid #F1F5F9'
            }}
          >
            <div className={shimmerClass} style={{ width: '20px', height: '14px', borderRadius: '4px' }} />
            <div className={shimmerClass} style={{ width: '24px', height: '16px', borderRadius: '3px' }} />
            <div className={shimmerClass} style={{ width: '22%', height: '14px' }} />
            <div className={shimmerClass} style={{ width: '28%', height: '14px' }} />
            <div className={shimmerClass} style={{ width: '12%', height: '14px' }} />
            <div className={shimmerClass} style={{ width: '15%', height: '14px' }} />
            <div className={shimmerClass} style={{ width: '10%', height: '14px', marginLeft: 'auto' }} />
          </div>
        ))}
      </div>
    );
  }

  // Default 'lines' type: đúng y như hình người dùng gửi:
  // Dòng 1: ~35-40% width
  // Dòng 2: 100% width
  // Dòng 3: 100% width
  // Dòng 4: ~60-65% width
  const lineWidths = ['38%', '100%', '100%', '62%', '85%', '45%'];

  return (
    <div
      style={{
        width: '100%',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        ...style
      }}
      className={className}
    >
      {Array.from({ length: count }).map((_, idx) => {
        const width = lineWidths[idx % lineWidths.length];
        return (
          <div
            key={idx}
            className={shimmerClass}
            style={{
              width,
              height: '14px',
              borderRadius: '9999px',
              maxWidth: '100%'
            }}
          />
        );
      })}
    </div>
  );
}
