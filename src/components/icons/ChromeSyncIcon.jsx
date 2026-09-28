import React from 'react';

/**
 * Icon 2 tab Chrome chồng lên nhau theo hướng ngang
 * Chuẩn Lucide SVG (viewBox 0 0 24 24, strokeWidth 2px)
 */
export default function ChromeSyncIcon({
  size = 18,
  color = 'currentColor',
  strokeWidth = 2,
  style,
  className,
  ...props
}) {
  const currentStroke = style?.strokeWidth || strokeWidth;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={currentStroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      {...props}
    >
      {/* Tab/Cửa sổ Chrome 1 (phía sau bên trái) */}
      <path d="M3 17V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <path d="M3 9.5h12" />
      <path d="M6 7h2" />

      {/* Tab/Cửa sổ Chrome 2 (chồng đè sang hướng ngang bên phải) */}
      <rect x="8" y="7" width="13" height="13" rx="2" />
      <path d="M8 12h13" />
      <circle cx="11.5" cy="9.5" r="0.75" fill={color} />
      <circle cx="14" cy="9.5" r="0.75" fill={color} />
    </svg>
  );
}
