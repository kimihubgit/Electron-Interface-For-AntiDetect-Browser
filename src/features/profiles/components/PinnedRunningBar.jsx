import React from 'react';
import { Square, Pin, Layers, ChevronDown, RotateCw } from 'lucide-react';

/**
 * Sticky pinned running profiles banner displaying stacking visuals & hover dropdown list
 */
export default function PinnedRunningBar({
  runningProfiles = [],
  isPinnedHovered,
  setIsPinnedHovered,
  toggleLaunchProfile,
  startingProfileIds = [],
  batchStopProfiles
}) {
  if (!runningProfiles || runningProfiles.length === 0) return null;

  return (
    <div
      data-no-drag="true"
      style={{
        position: 'sticky',
        top: '40px',
        zIndex: 20
      }}
      onMouseEnter={() => setIsPinnedHovered(true)}
      onMouseLeave={() => setIsPinnedHovered(false)}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '44px minmax(260px, 2.5fr) 1.8fr 1.1fr 1.6fr 70px 100px',
          alignItems: 'center',
          padding: '10px 24px',
          borderBottom: '2px solid #C7D2FE',
          backgroundColor: '#F5F7FF',
          borderLeft: '4px solid #4F46E5',
          fontSize: '12.5px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease'
        }}
      >
        {/* Col 1: Pin / Stack Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            title={`Đang ghim (${runningProfiles.length} hồ sơ đang chạy)`}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: '#EEF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #C7D2FE',
              boxShadow: runningProfiles.length > 1 ? '1px 1px 0px #818CF8, 2px 2px 0px #4F46E5' : 'none'
            }}
          >
            {runningProfiles.length > 1 ? (
              <Layers size={14} style={{ color: '#4F46E5' }} />
            ) : (
              <Pin size={13} style={{ color: '#4F46E5', transform: 'rotate(45deg)' }} />
            )}
          </div>
        </div>

        {/* Col 2: Name & Running summary with Stack Effect */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, overflow: 'hidden' }}>
          {/* Stacked Cards Deck Visual */}
          <div style={{
            position: 'relative',
            width: '36px',
            height: '34px',
            flexShrink: 0
          }}>
            {runningProfiles.length >= 3 && (
              <div style={{
                position: 'absolute',
                top: '-3px',
                left: '6px',
                width: '27px',
                height: '27px',
                borderRadius: '6px',
                backgroundColor: '#E0E7FF',
                border: '1px solid #C7D2FE',
                transform: 'rotate(8deg)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                zIndex: 1
              }}>
                {runningProfiles[2]?.os === 'macos' ? '🍎' : runningProfiles[2]?.os === 'linux' ? '🐧' : '🪟'}
              </div>
            )}
            {runningProfiles.length >= 2 && (
              <div style={{
                position: 'absolute',
                top: '-1px',
                left: '3px',
                width: '29px',
                height: '29px',
                borderRadius: '6px',
                backgroundColor: '#EDE9FE',
                border: '1px solid #A5B4FC',
                transform: 'rotate(-5deg)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                zIndex: 2
              }}>
                {runningProfiles[1]?.os === 'macos' ? '🍎' : runningProfiles[1]?.os === 'linux' ? '🐧' : '🪟'}
              </div>
            )}
            <div style={{
              position: 'relative',
              width: '31px',
              height: '31px',
              borderRadius: '7px',
              backgroundColor: '#DCFCE7',
              border: '1.5px solid #86EFAC',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              zIndex: 3
            }}>
              {runningProfiles[0].os === 'macos' ? '🍎' : runningProfiles[0].os === 'linux' ? '🐧' : '🪟'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#4F46E5',
                backgroundColor: '#EEF2FF',
                padding: '1px 5px',
                borderRadius: '3px',
                border: '1px solid #C7D2FE'
              }}>
                #1
              </span>
              <span style={{
                fontWeight: 700,
                color: '#0F172A',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {runningProfiles[0].name}
              </span>
              {runningProfiles.length > 1 && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: '#4338CA',
                  backgroundColor: '#EEF2FF',
                  padding: '1px 7px',
                  borderRadius: '10px',
                  border: '1px solid #C7D2FE',
                  boxShadow: '1px 1px 0px #A5B4FC, 2px 2px 0px #6366F1',
                  whiteSpace: 'nowrap'
                }}>
                  <Layers size={10} />
                  <span>{runningProfiles.length} xếp chồng</span>
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#6366F1', marginTop: '1px' }}>
              <span style={{ fontWeight: 500 }}>Rê chuột để thao tác</span>
              <ChevronDown size={12} style={{ transform: isPinnedHovered ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </div>
          </div>
        </div>

        {/* Col 3: Proxy */}
        <div>
          {runningProfiles[0].proxy?.host ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '1px 6px',
                borderRadius: '4px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                fontSize: '10.5px',
                fontWeight: 600
              }}>
                🌐 {runningProfiles[0].proxy.type || 'SOCKS5'}
              </span>
              <span style={{ fontSize: '11.5px', color: '#0F172A', fontFamily: 'monospace', fontWeight: 500 }}>
                {runningProfiles[0].proxy.host}:{runningProfiles[0].proxy.port}
              </span>
            </div>
          ) : (
            <span style={{ color: '#94A3B8', fontSize: '11.5px', fontStyle: 'italic' }}>
              Direct (Không Proxy)
            </span>
          )}
        </div>

        {/* Col 4: Group */}
        <div>
          <span style={{
            display: 'inline-block',
            padding: '3px 9px',
            borderRadius: '12px',
            backgroundColor: '#EEF2FF',
            border: '1px solid #C7D2FE',
            color: '#4338CA',
            fontSize: '11.5px',
            fontWeight: 600
          }}>
            {runningProfiles[0].group || 'Chung'}
          </span>
        </div>

        {/* Col 5: Fingerprint / Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11.5px',
            fontWeight: 600,
            color: '#15803D',
            backgroundColor: '#DCFCE7',
            padding: '3px 9px',
            borderRadius: '12px',
            border: '1px solid #86EFAC'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#16A34A',
              boxShadow: '0 0 6px #16A34A'
            }} />
            {runningProfiles.length === 1 ? 'Đang chạy' : `${runningProfiles.length} đang chạy`}
          </span>
        </div>

        {/* Col 6: Quick Stop Icon for #1 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLaunchProfile(runningProfiles[0].id);
            }}
            title={`Ngưng chạy ${runningProfiles[0].name}`}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: '1px solid #FECACA',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              padding: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEE2E2';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FEF2F2';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Square size={13} fill="currentColor" />
          </button>
        </div>

        {/* Col 7: Thao tác / Stop all */}
        <div style={{ textAlign: 'right' }}>
          {runningProfiles.length > 1 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                batchStopProfiles(runningProfiles.map(p => p.id));
              }}
              title="Dừng tất cả các hồ sơ đang mở"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '5px',
                border: '1px solid #FECACA',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
            >
              <Square size={10} fill="currentColor" />
              <span>Dừng hết</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLaunchProfile(runningProfiles[0].id);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '5px',
                border: '1px solid #FECACA',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Square size={10} fill="currentColor" />
              <span>Ngưng chạy</span>
            </button>
          )}
        </div>
      </div>

      {/* ── HOVER DROPDOWN PANEL (DISPLAYS ALL RUNNING PROFILES IN ORDER) ── */}
      {isPinnedHovered && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '380px',
            backgroundColor: '#FFFFFF',
            borderRadius: '0 0 10px 10px',
            border: '1px solid #CBD5E1',
            borderTop: '2px solid #4F46E5',
            boxShadow: '0 16px 36px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(15, 23, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 50
          }}
        >
          {/* Dropdown List Items */}
          <div style={{ overflowY: 'auto', maxHeight: '320px' }}>
            {runningProfiles.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 24px',
                  borderBottom: idx === runningProfiles.length - 1 ? 'none' : '1px solid #F1F5F9',
                  transition: 'background-color 0.12s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {/* Left details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                  {/* Order number */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '26px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: '#EEF2FF',
                    color: '#4F46E5',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: '1px solid #C7D2FE'
                  }}>
                    #{idx + 1}
                  </span>

                  {/* OS Icon */}
                  <span style={{ fontSize: '15px' }}>
                    {p.os === 'macos' ? '🍎' : p.os === 'linux' ? '🐧' : '🪟'}
                  </span>

                  {/* Profile Name & ID */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0F172A',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>
                      ID: {p.id} • Nhóm: {p.group || 'Chung'}
                    </div>
                  </div>

                  {/* Proxy tag */}
                  <div style={{ marginLeft: '12px' }}>
                    {p.proxy?.host ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#065F46',
                        fontSize: '11px'
                      }}>
                        <span>🌐 {p.proxy.type || 'SOCKS5'}</span>
                        <span style={{ fontFamily: 'monospace' }}>{p.proxy.host}:{p.proxy.port}</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontStyle: 'italic' }}>
                        Direct IP
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Running status badge + Ngưng Chạy button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '12px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#15803D',
                    backgroundColor: '#DCFCE7',
                    padding: '3px 9px',
                    borderRadius: '12px'
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#16A34A'
                    }} />
                    Đang chạy
                  </span>

                  {/* Prominent STOP button */}
                  {startingProfileIds.includes(String(p.id)) ? (
                    <button
                      disabled
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '30px',
                        padding: '0 12px',
                        borderRadius: '6px',
                        border: '1px solid #BFDBFE',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'wait',
                        pointerEvents: 'none'
                      }}
                    >
                      <RotateCw size={12} className="spin" />
                      <span>Đang xử lý...</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLaunchProfile(p.id);
                      }}
                      title="Ngưng chạy hồ sơ này"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '30px',
                        padding: '0 12px',
                        borderRadius: '6px',
                        border: '1px solid #FECACA',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FEE2E2';
                        e.currentTarget.style.borderColor = '#F87171';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FEF2F2';
                        e.currentTarget.style.borderColor = '#FECACA';
                      }}
                    >
                      <Square size={12} fill="currentColor" />
                      <span>Ngưng chạy</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Clean bottom action bar if multiple profiles running */}
          {runningProfiles.length > 1 && (
            <div style={{
              padding: '7px 20px',
              backgroundColor: '#F8FAFC',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  batchStopProfiles(runningProfiles.map(p => p.id));
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '5px',
                  border: '1px solid #FECACA',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
              >
                <Square size={10} fill="currentColor" />
                <span>Dừng tất cả {runningProfiles.length} hồ sơ</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
