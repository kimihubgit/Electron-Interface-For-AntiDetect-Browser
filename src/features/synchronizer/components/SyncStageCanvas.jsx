import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Crown,
  MousePointer,
  Search,
  ShoppingCart,
  Heart,
  CheckCircle2,
  Lock,
  ExternalLink,
  RotateCw,
  Power,
  Zap,
  Globe,
  Monitor,
  Eye,
  Sliders,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function SyncStageCanvas({
  isSyncing,
  masterProfile,
  followers = [],
  onToggleFollowerSync,
  onRemoveFollower,
  delayRange = 45,
  currentUrl = 'https://www.google.com',
  onLogAction
}) {
  // Master mouse coordinate state
  const [masterCoords, setMasterCoords] = useState({ x: 180, y: 140 });
  const [isHoveringMaster, setIsHoveringMaster] = useState(false);
  const [masterClickRipples, setMasterClickRipples] = useState([]);
  
  // Slave cursor coordinates (each with randomized slight jitter)
  const [slaveCoordsMap, setSlaveCoordsMap] = useState({});
  const [slaveRipplesMap, setSlaveRipplesMap] = useState({});

  // Interactive Test State across windows
  const [masterInputText, setMasterInputText] = useState('');
  const [buttonPressed, setButtonPressed] = useState(null);
  const [checkboxState, setCheckboxState] = useState(true);

  const masterCanvasRef = useRef(null);

  // Helper to parse spintext: {a|b|c}
  const parseSpinText = (text, index) => {
    return text.replace(/\{([^{}]+)\}/g, (_, choices) => {
      const parts = choices.split('|');
      return parts[index % parts.length] || parts[0];
    });
  };

  // Handle Mouse Movement on Master
  const handleMasterMouseMove = useCallback((e) => {
    if (!masterCanvasRef.current) return;
    const rect = masterCanvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const relX = Math.round(x);
    const relY = Math.round(y);
    setMasterCoords({ x: relX, y: relY });

    if (!isSyncing) return;

    // Disperse to followers with realistic organic delay & minor jitter
    followers.forEach((f, idx) => {
      if (!f.isSyncEnabled) return;
      const jitterX = (Math.random() - 0.5) * 6;
      const jitterY = (Math.random() - 0.5) * 6;
      const calculatedDelay = Math.max(10, delayRange + (idx * 15) + Math.random() * 20);

      setTimeout(() => {
        setSlaveCoordsMap(prev => ({
          ...prev,
          [f.id]: {
            x: Math.round(relX + jitterX),
            y: Math.round(relY + jitterY)
          }
        }));
      }, calculatedDelay);
    });
  }, [isSyncing, followers, delayRange]);

  // Handle Click on Master Canvas
  const handleMasterClick = useCallback((e) => {
    if (!masterCanvasRef.current) return;
    const rect = masterCanvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Spawn ripple on master
    const rippleId = Date.now() + Math.random();
    setMasterClickRipples(prev => [...prev.slice(-4), { id: rippleId, x, y }]);
    setTimeout(() => {
      setMasterClickRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 700);

    onLogAction?.({
      type: 'click',
      x,
      y,
      target: e.target.tagName.toLowerCase(),
      time: new Date().toLocaleTimeString()
    });

    if (!isSyncing) return;

    // Propagate click ripples to followers
    followers.forEach((f, idx) => {
      if (!f.isSyncEnabled) return;
      const delay = Math.max(15, delayRange + (idx * 20));
      setTimeout(() => {
        const slaveRippleId = Date.now() + Math.random();
        setSlaveRipplesMap(prev => ({
          ...prev,
          [f.id]: [...(prev[f.id] || []).slice(-3), { id: slaveRippleId, x, y }]
        }));
        setTimeout(() => {
          setSlaveRipplesMap(prev => ({
            ...prev,
            [f.id]: (prev[f.id] || []).filter(r => r.id !== slaveRippleId)
          }));
        }, 700);
      }, delay);
    });
  }, [isSyncing, followers, delayRange, onLogAction]);

  return (
    <div style={{
      flex: 1,
      display: 'grid',
      gridTemplateColumns: 'minmax(420px, 1.25fr) minmax(460px, 1.75fr)',
      gap: '16px',
      padding: '16px 20px',
      overflowY: 'auto',
      backgroundColor: 'var(--apidog-bg)',
      minHeight: 0
    }}>
      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── LEFT PANE: MASTER WINDOW (CỬA SỔ GỐC ĐIỀU KHIỂN) ──── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        backgroundColor: 'var(--apidog-card-bg)',
        border: '2px solid #7C3AED',
        boxShadow: '0 8px 24px rgba(124, 58, 237, 0.15)',
        overflow: 'hidden',
        minHeight: '520px'
      }}>
        {/* Master Window Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0'
        }}>
          {/* Mac-style Window Controls + Crown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: '#EDE9FE',
              color: '#6D28D9',
              fontSize: '11px',
              fontWeight: 700
            }}>
              <Crown size={12} fill="#6D28D9" />
              <span>CỬA SỔ ĐIỀU KHIỂN CHÍNH (MASTER)</span>
            </div>
          </div>

          {/* Mouse Coordinate & Size Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: '#F1F5F9',
              color: '#475569',
              fontWeight: 600
            }}>
              X: {masterCoords.x} | Y: {masterCoords.y}
            </span>
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: '#EDE9FE',
              color: '#7C3AED',
              fontWeight: 600
            }}>
              1280 × 720
            </span>
          </div>
        </div>

        {/* Master Simulated Chrome Browser Address Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #F1F5F9'
        }}>
          <RotateCw size={13} style={{ color: '#94A3B8', cursor: 'pointer' }} />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#F8FAFC',
            borderRadius: '6px',
            padding: '4px 10px',
            border: '1px solid #E2E8F0',
            fontSize: '12px',
            color: '#334155'
          }}>
            <Lock size={11} style={{ color: '#10B981', marginRight: '6px' }} />
            <span style={{ fontWeight: 500 }}>{currentUrl}</span>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: '6px',
            backgroundColor: '#FEF3C7',
            color: '#B45309'
          }}>
            {masterProfile?.name || 'Hồ sơ Master #1'}
          </span>
        </div>

        {/* Master Interactive Browser Canvas */}
        <div
          ref={masterCanvasRef}
          onMouseEnter={() => setIsHoveringMaster(true)}
          onMouseLeave={() => setIsHoveringMaster(false)}
          onMouseMove={handleMasterMouseMove}
          onClick={handleMasterClick}
          style={{
            flex: 1,
            position: 'relative',
            backgroundColor: '#FAFAFC',
            overflow: 'hidden',
            cursor: 'crosshair',
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 20px'
          }}
        >
          {/* Instruction Pill */}
          <div style={{
            alignSelf: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(124, 58, 237, 0.08)',
            border: '1px dashed #C4B5FD',
            fontSize: '11px',
            color: '#6D28D9',
            marginBottom: '20px'
          }}>
            <Sparkles size={12} />
            <span>Mọi hành động di chuột, click, cuộn trang & gõ phím ở đây sẽ được nhân bản sang các cửa sổ bên phải</span>
          </div>

          {/* Simulated Webpage Elements on Master */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Simulated Search & SpinText Test Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>
                Thử nghiệm gõ đồng bộ bàn phím (hỗ trợ cú pháp SpinText):
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '6px 12px',
                gap: '8px'
              }}>
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input
                  type="text"
                  value={masterInputText}
                  onChange={(e) => {
                    setMasterInputText(e.target.value);
                    onLogAction?.({
                      type: 'typing',
                      text: e.target.value,
                      time: new Date().toLocaleTimeString()
                    });
                  }}
                  placeholder="Gõ thử: {Xin chào|Hello|Hi} Antidetect Browser..."
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '12.5px',
                    color: '#0F172A'
                  }}
                />
              </div>
              <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                * Mẹo: Cú pháp <code>{'{A|B|C}'}</code> sẽ tự động gán ngẫu nhiên cho mỗi cửa sổ con một từ khác nhau!
              </span>
            </div>

            {/* Simulated Interactive Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setButtonPressed('search');
                  setTimeout(() => setButtonPressed(null), 300);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: buttonPressed === 'search' ? '#5B21B6' : '#7C3AED',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transform: buttonPressed === 'search' ? 'scale(0.96)' : 'scale(1)',
                  transition: 'all 0.1s ease'
                }}
              >
                <Search size={12} />
                <span>Tìm kiếm</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setButtonPressed('cart');
                  setTimeout(() => setButtonPressed(null), 300);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: buttonPressed === 'cart' ? '#F1F5F9' : '#FFFFFF',
                  color: '#1E293B',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transform: buttonPressed === 'cart' ? 'scale(0.96)' : 'scale(1)',
                  transition: 'all 0.1s ease'
                }}
              >
                <ShoppingCart size={12} />
                <span>Thêm vào giỏ</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setButtonPressed('like');
                  setTimeout(() => setButtonPressed(null), 300);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: '1px solid #FECDD3',
                  backgroundColor: buttonPressed === 'like' ? '#FFE4E6' : '#FFF1F2',
                  color: '#E11D48',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transform: buttonPressed === 'like' ? 'scale(0.96)' : 'scale(1)',
                  transition: 'all 0.1s ease'
                }}
              >
                <Heart size={12} fill="#E11D48" />
                <span>Thích bài viết</span>
              </button>
            </div>

            {/* Checkbox item */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setCheckboxState(!checkboxState);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#334155'
              }}
            >
              <input
                type="checkbox"
                checked={checkboxState}
                onChange={() => {}}
                style={{ accentColor: '#7C3AED', width: '15px', height: '15px', cursor: 'pointer' }}
              />
              <span>Tự động đồng bộ các cookie và phiên đăng nhập tương ứng</span>
            </div>
          </div>

          {/* Master Glowing Cursor Tracker */}
          {isHoveringMaster && (
            <div style={{
              position: 'absolute',
              left: `${masterCoords.x}px`,
              top: `${masterCoords.y}px`,
              transform: 'translate(-3px, -3px)',
              pointerEvents: 'none',
              zIndex: 50
            }}>
              <MousePointer size={18} fill="#7C3AED" color="#FFFFFF" />
              <div style={{
                position: 'absolute',
                top: '18px',
                left: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                color: '#FFFFFF',
                fontSize: '9.5px',
                padding: '2px 5px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                backdropFilter: 'blur(4px)'
              }}>
                MASTER ({masterCoords.x}, {masterCoords.y})
              </div>
            </div>
          )}

          {/* Master Click Ripples */}
          {masterClickRipples.map(ripple => (
            <div
              key={ripple.id}
              style={{
                position: 'absolute',
                left: `${ripple.x}px`,
                top: `${ripple.y}px`,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid #7C3AED',
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                transform: 'translate(-50%, -50%) scale(1)',
                animation: 'ripple 0.6s cubic-bezier(0, 0, 0.2, 1) forwards',
                pointerEvents: 'none'
              }}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── RIGHT PANE: CONTROLLED SLAVE PROFILES GRID ─────────── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflowY: 'auto',
        minHeight: 0
      }}>
        {/* Followers Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          borderRadius: '8px',
          backgroundColor: 'var(--apidog-card-bg)',
          border: '1px solid var(--apidog-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Monitor size={15} style={{ color: '#2563EB' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
              CÁC CỬA SỔ CON ĐỒNG BỘ ({followers.filter(f => f.isSyncEnabled).length}/{followers.length})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>Đang phản hồi theo Master:</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: isSyncing ? '#DCFCE7' : '#F1F5F9',
              color: isSyncing ? '#15803D' : '#64748B',
              fontSize: '11px',
              fontWeight: 700
            }}>
              {isSyncing ? '🔴 LIVE MIRROR' : '⏸️ PAUSED'}
            </span>
          </div>
        </div>

        {/* Followers Grid (2x2 or responsive cards) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px'
        }}>
          {followers.map((follower, idx) => {
            const slaveCoords = slaveCoordsMap[follower.id] || { x: 180, y: 140 };
            const slaveRipples = slaveRipplesMap[follower.id] || [];
            const spunText = parseSpinText(masterInputText, idx + 1);

            return (
              <div
                key={follower.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '10px',
                  backgroundColor: 'var(--apidog-card-bg)',
                  border: `1.5px solid ${follower.isSyncEnabled && isSyncing ? '#3B82F6' : 'var(--apidog-border)'}`,
                  boxShadow: follower.isSyncEnabled && isSyncing ? '0 4px 12px rgba(59, 130, 246, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                  opacity: follower.isSyncEnabled ? 1 : 0.65,
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Follower Card Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                    <span style={{ fontSize: '13px' }}>{follower.countryFlag || '🌐'}</span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E293B',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}>
                      {follower.name}
                    </span>
                  </div>

                  {/* Delay Offset & Sync Switch */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      fontWeight: 600
                    }}>
                      +{follower.baseLatency || (35 + idx * 15)}ms
                    </span>
                    <button
                      onClick={() => onToggleFollowerSync?.(follower.id)}
                      title={follower.isSyncEnabled ? 'Nhấn để tạm dừng đồng bộ profile này' : 'Bật đồng bộ lại'}
                      style={{
                        padding: '3px 7px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: follower.isSyncEnabled ? '#3B82F6' : '#94A3B8',
                        color: '#FFFFFF',
                        fontSize: '10px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {follower.isSyncEnabled ? 'BẬT' : 'TẮT'}
                    </button>
                  </div>
                </div>

                {/* Follower Mini Viewport Preview */}
                <div style={{
                  position: 'relative',
                  height: '190px',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {/* Mirrored Search & SpinText */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    color: '#0F172A',
                    overflow: 'hidden'
                  }}>
                    <Search size={11} style={{ color: '#94A3B8', marginRight: '5px', flexShrink: 0 }} />
                    <span style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: spunText ? '#1E293B' : '#94A3B8',
                      fontStyle: spunText ? 'normal' : 'italic'
                    }}>
                      {spunText || 'Đang chờ nhập liệu từ Master...'}
                    </span>
                  </div>

                  {/* Mirrored Action Buttons */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: buttonPressed === 'search' ? '#5B21B6' : '#EDE9FE',
                      color: buttonPressed === 'search' ? '#FFFFFF' : '#7C3AED',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      transition: 'all 0.1s ease'
                    }}>
                      Tìm kiếm
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: buttonPressed === 'cart' ? '#CBD5E1' : '#F1F5F9',
                      color: '#475569',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      transition: 'all 0.1s ease'
                    }}>
                      Thêm giỏ
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: buttonPressed === 'like' ? '#FECDD3' : '#FFF1F2',
                      color: '#E11D48',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      transition: 'all 0.1s ease'
                    }}>
                      ❤️
                    </div>
                  </div>

                  {/* Mirrored Checkbox */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: '#64748B' }}>
                    <input
                      type="checkbox"
                      checked={checkboxState}
                      readOnly
                      style={{ accentColor: '#3B82F6', width: '13px', height: '13px' }}
                    />
                    <span>Ghi nhớ phiên đăng nhập</span>
                  </div>

                  {/* Follower Mirrored Animated Cursor */}
                  {isSyncing && follower.isSyncEnabled && (
                    <div style={{
                      position: 'absolute',
                      left: `${Math.min(220, Math.max(10, (slaveCoords.x * 0.45)))}px`,
                      top: `${Math.min(160, Math.max(10, (slaveCoords.y * 0.45)))}px`,
                      transform: 'translate(-3px, -3px)',
                      pointerEvents: 'none',
                      transition: 'left 0.08s ease-out, top 0.08s ease-out',
                      zIndex: 30
                    }}>
                      <MousePointer size={15} fill="#3B82F6" color="#FFFFFF" />
                      <div style={{
                        position: 'absolute',
                        top: '14px',
                        left: '8px',
                        backgroundColor: '#1E293B',
                        color: '#FFFFFF',
                        fontSize: '8.5px',
                        padding: '1px 4px',
                        borderRadius: '3px',
                        whiteSpace: 'nowrap'
                      }}>
                        Slave #{idx + 1}
                      </div>
                    </div>
                  )}

                  {/* Follower Mirrored Click Ripple */}
                  {slaveRipples.map(ripple => (
                    <div
                      key={ripple.id}
                      style={{
                        position: 'absolute',
                        left: `${Math.min(220, Math.max(10, ripple.x * 0.45))}px`,
                        top: `${Math.min(160, Math.max(10, ripple.y * 0.45))}px`,
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        border: '2px solid #3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        transform: 'translate(-50%, -50%) scale(1)',
                        animation: 'ripple 0.6s cubic-bezier(0, 0, 0.2, 1) forwards',
                        pointerEvents: 'none'
                      }}
                    />
                  ))}
                </div>

                {/* Follower Footer / Proxy Info */}
                <div style={{
                  padding: '6px 10px',
                  backgroundColor: '#F8FAFC',
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '10.5px',
                  color: '#64748B'
                }}>
                  <span>Proxy: {follower.proxyIp || 'Direct IP'}</span>
                  <span>{follower.os || 'Windows 11'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
