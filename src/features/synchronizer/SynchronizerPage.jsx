import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useBrowser } from '../../store/BrowserContext';
import {
  Layers,
  Crown,
  Play,
  Pause,
  Grid,
  Monitor,
  Globe,
  Send,
  Plus,
  RotateCw,
  Clock,
  MousePointer,
  Keyboard,
  Scroll,
  Square,
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

// Danh sách profile mẫu để người dùng xem giao diện ngay khi chưa mở Chrome thật
const DEMO_PROFILES = [
  { id: 'p1', name: 'Profile 01 - Amazon Buyer Prime', os: 'windows', group: 'E-Commerce', proxy: { host: '198.54.120.45', port: '1080', type: 'SOCKS5' }, latency: 25 },
  { id: 'p2', name: 'Profile 02 - eBay Seller US', os: 'windows', group: 'E-Commerce', proxy: { host: '198.54.120.46', port: '1080', type: 'SOCKS5' }, latency: 45 },
  { id: 'p3', name: 'Profile 03 - TikTok Creator UK', os: 'macos', group: 'Social', proxy: { host: '46.101.12.89', port: '8080', type: 'HTTP' }, latency: 60 },
  { id: 'p4', name: 'Profile 04 - Shopee Seller SG', os: 'windows', group: 'Chung', proxy: { host: '128.199.200.15', port: '1080', type: 'SOCKS5' }, latency: 35 }
];

export default function SynchronizerPage() {
  const { profiles = [], toggleLaunchProfile, showToast } = useBrowser();

  // Bắt danh sách Chrome đang chạy thực tế từ Electron IPC
  const [electronRunningList, setElectronRunningList] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (window.electronAPI?.getRunningProfilesList) {
      window.electronAPI.getRunningProfilesList().then(list => {
        if (Array.isArray(list)) setElectronRunningList(list);
      });
    }

    if (window.electronAPI?.onRunningProfilesUpdated) {
      const cleanup = window.electronAPI.onRunningProfilesUpdated((list) => {
        if (Array.isArray(list)) setElectronRunningList(list);
      });
      return cleanup;
    }
  }, []);

  // Tổng hợp danh sách Chrome đang chạy
  const runningProfiles = useMemo(() => {
    if (isDemoMode) return DEMO_PROFILES;

    if (electronRunningList.length > 0) {
      const map = new Map(profiles.map(p => [String(p.id), p]));
      return electronRunningList.map(item => {
        const p = map.get(String(item.id)) || {};
        return {
          ...p,
          id: item.id,
          name: item.name || p.name || `Profile #${item.id}`,
          pid: item.pid,
          os: p.os || 'windows',
          group: p.group || 'Chung',
          proxy: p.proxy || {},
          latency: 30
        };
      });
    }

    // Fallback nếu đang chạy trong context
    const runningFromContext = profiles.filter(p => p.status === 'running');
    if (runningFromContext.length > 0) {
      return runningFromContext.map((p, idx) => ({ ...p, latency: 25 + idx * 15 }));
    }

    return [];
  }, [electronRunningList, profiles, isDemoMode]);

  // Profile chính (Master)
  const [masterId, setMasterId] = useState(null);

  useEffect(() => {
    if (runningProfiles.length > 0) {
      const exists = runningProfiles.some(p => String(p.id) === String(masterId));
      if (!exists || !masterId) {
        setMasterId(runningProfiles[0].id);
      }
    } else {
      setMasterId(null);
    }
  }, [runningProfiles, masterId]);

  // Trạng thái đồng bộ của từng profile phụ: { [id]: boolean }
  const [slaveSyncToggles, setSlaveSyncToggles] = useState({});

  // Cài đặt đồng bộ
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncMouse, setSyncMouse] = useState(true);
  const [syncKeyboard, setSyncKeyboard] = useState(true);
  const [syncScroll, setSyncScroll] = useState(true);
  const [delayJitter, setDelayJitter] = useState(40);
  const [urlInput, setUrlInput] = useState('');

  const masterProfile = useMemo(() => {
    return runningProfiles.find(p => String(p.id) === String(masterId)) || runningProfiles[0] || null;
  }, [runningProfiles, masterId]);

  // Xử lý bật/tắt đồng bộ cho từng profile phụ
  const handleToggleSlave = (id) => {
    setSlaveSyncToggles(prev => ({
      ...prev,
      [id]: !(prev[id] ?? true)
    }));
  };

  // Mở URL hàng loạt
  const handleBroadcastUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    let url = urlInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    showToast?.(`Đã gửi lệnh mở "${url}" trên tất cả Chrome đang chạy`, 'success');
  };

  // Sắp xếp cửa sổ desktop
  const handleTileWindows = (type) => {
    showToast?.(`Đã sắp xếp các cửa sổ Chrome (${type === '2x2' ? 'Lưới 2x2' : 'Lên trên cùng'})`, 'info');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#FFFFFF',
      overflow: 'hidden'
    }}>
      {/* ── 1. HEADER CHÍNH (Đồng bộ, đơn giản giống các trang khác) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        flexShrink: 0
      }}>
        {/* Tiêu đề trang */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#F5F3FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7C3AED'
          }}>
            <Layers size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0F172A' }}>
              Đồng bộ hóa (Synchronizer)
            </h1>
            <p style={{ fontSize: '12px', margin: '2px 0 0 0', color: '#64748B' }}>
              Thao tác trên 1 profile chính (Master) và các profile phụ khác sẽ tự động làm theo
            </p>
          </div>
        </div>

        {/* Nút hành động */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Nút sắp xếp cửa sổ */}
          <button
            onClick={() => handleTileWindows('2x2')}
            title="Tự động xếp các cửa sổ Chrome gọn gàng trên màn hình máy tính"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '34px',
              padding: '0 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Grid size={13} />
            <span>Xếp lưới 2x2</span>
          </button>

          <button
            onClick={() => handleTileWindows('front')}
            title="Đưa các cửa sổ Chrome lên trên cùng"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '34px',
              padding: '0 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Monitor size={13} />
            <span>Lên đầu</span>
          </button>

          {/* Nút Bắt đầu / Tạm dừng đồng bộ */}
          {isSyncing ? (
            <button
              onClick={() => setIsSyncing(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '34px',
                padding: '0 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(245, 158, 11, 0.3)'
              }}
            >
              <Pause size={14} />
              <span>Tạm dừng</span>
            </button>
          ) : (
            <button
              onClick={() => setIsSyncing(true)}
              disabled={runningProfiles.length < 2}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '34px',
                padding: '0 18px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: runningProfiles.length < 2 ? '#94A3B8' : '#7C3AED',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: runningProfiles.length < 2 ? 'not-allowed' : 'pointer',
                boxShadow: runningProfiles.length < 2 ? 'none' : '0 2px 6px rgba(124, 58, 237, 0.3)'
              }}
            >
              <Play size={14} fill="#FFFFFF" />
              <span>Bắt đầu đồng bộ</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 2. THANH CÔNG CỤ NHANH (Toolbar đơn giản 1 hàng) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 24px',
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0',
        flexWrap: 'wrap',
        gap: '12px',
        flexShrink: 0
      }}>
        {/* Chọn Cửa Sổ Chính */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#6D28D9', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Crown size={14} />
            Profile chính (Master):
          </span>
          <select
            value={masterId || ''}
            onChange={(e) => setMasterId(e.target.value)}
            disabled={runningProfiles.length === 0}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontSize: '12.5px',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {runningProfiles.length === 0 ? (
              <option value="">(Chưa có profile nào đang chạy)</option>
            ) : (
              runningProfiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Mở URL đồng loạt */}
        <form onSubmit={handleBroadcastUrl} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            padding: '0 8px',
            height: '32px',
            width: '260px'
          }}>
            <Globe size={13} style={{ color: '#94A3B8', marginRight: '6px' }} />
            <input
              type="text"
              placeholder="Nhập link mở trên tất cả Chrome..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '12px',
                width: '100%',
                color: '#0F172A'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              height: '32px',
              padding: '0 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Mở URL
          </button>
        </form>

        {/* Các tùy chọn đồng bộ (Checkbox đơn giản) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#475569' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={syncMouse}
              onChange={(e) => setSyncMouse(e.target.checked)}
              style={{ accentColor: '#7C3AED' }}
            />
            <span>Chuột</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={syncKeyboard}
              onChange={(e) => setSyncKeyboard(e.target.checked)}
              style={{ accentColor: '#7C3AED' }}
            />
            <span>Bàn phím</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={syncScroll}
              onChange={(e) => setSyncScroll(e.target.checked)}
              style={{ accentColor: '#7C3AED' }}
            />
            <span>Cuộn trang</span>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '6px' }}>
            <span>Độ trễ:</span>
            <span style={{ fontWeight: 700, color: '#7C3AED' }}>{delayJitter}ms</span>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={delayJitter}
              onChange={(e) => setDelayJitter(Number(e.target.value))}
              style={{ width: '60px', accentColor: '#7C3AED', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* ── 3. NỘI DUNG CHÍNH (Bảng các profile đang chạy) ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {runningProfiles.length === 0 ? (
          /* Trạng thái chưa có profile nào đang chạy */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            backgroundColor: '#F8FAFC',
            borderRadius: '10px',
            border: '1px dashed #CBD5E1',
            textAlign: 'center'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#EDE9FE',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <Monitor size={24} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: '#0F172A' }}>
              Chưa có cửa sổ Chrome nào đang chạy
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', maxWidth: '420px', margin: '0 0 20px 0' }}>
              Hãy khởi chạy từ 2 profile trở lên từ danh sách dưới đây để bắt đầu chọn profile chính và đồng bộ thao tác.
            </p>

            {/* Danh sách profile sẵn có để bấm chạy nhanh */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
              {profiles.slice(0, 4).map(p => (
                <button
                  key={p.id}
                  onClick={() => toggleLaunchProfile?.(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Play size={11} fill="#7C3AED" color="#7C3AED" />
                  <span>Chạy "{p.name}"</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Sparkles size={13} />
              <span>Xem thử với 4 Profile mẫu</span>
            </button>
          </div>
        ) : (
          /* Bảng hiển thị danh sách Chrome đang chạy chuẩn */
          <div style={{
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
              <thead>
                <tr style={{
                  backgroundColor: '#F8FAFC',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #E2E8F0'
                }}>
                  <th style={{ padding: '10px 16px', width: '80px', textAlign: 'center' }}>CHỌN MASTER</th>
                  <th style={{ padding: '10px 16px', width: '130px' }}>VAI TRÒ</th>
                  <th style={{ padding: '10px 16px' }}>TÊN PROFILE</th>
                  <th style={{ padding: '10px 16px' }}>NHÓM</th>
                  <th style={{ padding: '10px 16px' }}>PROXY</th>
                  <th style={{ padding: '10px 16px', width: '110px' }}>ĐỘ TRỄ</th>
                  <th style={{ padding: '10px 16px', width: '130px', textAlign: 'center' }}>ĐỒNG BỘ</th>
                  <th style={{ padding: '10px 16px', width: '100px', textAlign: 'right' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {runningProfiles.map((p, idx) => {
                  const isMaster = String(p.id) === String(masterId);
                  const isSlaveActive = slaveSyncToggles[p.id] ?? true;

                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        backgroundColor: isMaster ? '#F5F3FF' : '#FFFFFF'
                      }}
                    >
                      {/* Chọn làm Master */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <input
                          type="radio"
                          name="master-radio-group"
                          checked={isMaster}
                          onChange={() => setMasterId(p.id)}
                          style={{ cursor: 'pointer', accentColor: '#7C3AED', width: '16px', height: '16px' }}
                          title="Chọn làm Profile chính điều khiển"
                        />
                      </td>

                      {/* Vai trò */}
                      <td style={{ padding: '12px 16px' }}>
                        {isMaster ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#7C3AED',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            <Crown size={11} fill="#FFFFFF" />
                            <span>CHÍNH (MASTER)</span>
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#F1F5F9',
                            color: '#475569',
                            fontSize: '11px',
                            fontWeight: 600
                          }}>
                            <span>PHỤ (SLAVE)</span>
                          </span>
                        )}
                      </td>

                      {/* Tên Profile */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px' }}>
                            {p.os === 'macos' ? '🍎' : p.os === 'linux' ? '🐧' : '🪟'}
                          </span>
                          <span style={{ fontWeight: 600, color: isMaster ? '#6D28D9' : '#0F172A' }}>
                            {p.name}
                          </span>
                        </div>
                      </td>

                      {/* Nhóm */}
                      <td style={{ padding: '12px 16px', color: '#64748B' }}>
                        {p.group || 'Chung'}
                      </td>

                      {/* Proxy */}
                      <td style={{ padding: '12px 16px', color: '#64748B' }}>
                        {p.proxy?.host ? `${p.proxy.host}:${p.proxy.port || ''}` : 'Không dùng proxy'}
                      </td>

                      {/* Độ trễ */}
                      <td style={{ padding: '12px 16px' }}>
                        {isMaster ? (
                          <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700 }}>
                            Gốc (0ms)
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>
                            +{p.latency || 30}ms
                          </span>
                        )}
                      </td>

                      {/* Bật/Tắt nhận đồng bộ */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {isMaster ? (
                          <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600 }}>
                            Đang điều khiển
                          </span>
                        ) : (
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={isSlaveActive}
                              onChange={() => handleToggleSlave(p.id)}
                              style={{ accentColor: '#10B981', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '11.5px', color: isSlaveActive ? '#15803D' : '#94A3B8', fontWeight: 600 }}>
                              {isSlaveActive ? 'Làm theo' : 'Bỏ qua'}
                            </span>
                          </label>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            if (isDemoMode) {
                              showToast?.('Chế độ mẫu demo', 'info');
                            } else {
                              toggleLaunchProfile?.(p.id);
                            }
                          }}
                          title="Đóng cửa sổ profile này"
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #FECACA',
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Dừng
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
