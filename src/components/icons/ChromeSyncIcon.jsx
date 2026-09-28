import React from 'react';

/**
 * Icon 2 ô vuông hơi bo góc chồng lên nhau tối giản
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
      {/* Ô vuông 1 (phía sau bên trái, hơi bo góc) */}
      <path d="M4 16V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />

      {/* Ô vuông 2 (phía trước bên phải, hơi bo góc) */}
      <rect x="8" y="7" width="12" height="12" rx="2" />
    </svg>
  );
}
