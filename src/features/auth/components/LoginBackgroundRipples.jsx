import React from 'react';

/**
 * Concentric circular ripple rings radiating outward behind the login card
 */
export default function LoginBackgroundRipples() {
  const ringSizes = [460, 680, 920, 1160, 1420, 1700];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0
      }}
    >
      {ringSizes.map((size, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            border: '1px solid rgba(226, 232, 240, 0.65)',
            boxSizing: 'border-box'
          }}
        />
      ))}
    </div>
  );
}
