import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Plus,
  Trash2,
  Upload,
  ArrowRightLeft,
  Filter,
  Ban,
  Radio,
  FileText,
  Search,
  Check,
  Globe
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

export default function ProxyRequestModal() {
  const { activeProxyRequestModal, setActiveProxyRequestModal, addLog } = useBrowser();

  // Traffic metrics
  const [savedGb, setSavedGb] = useState(10.32);
  const [usedProxyMb, setUsedProxyMb] = useState(1006.28);
  const [savingRate, setSavingRate] = useState(91);

  // Common config
  const [commonHost, setCommonHost] = useState('0.0.0.0:8080');
  const [rotateInterval, setRotateInterval] = useState(5);
  const [isRotateActive, setIsRotateActive] = useState(false);
  const [telegramAlert, setTelegramAlert] = useState(true);
  const [killSwitch, setKillSwitch] = useState(false);

  // Upload proxy config
  const [uploadViaProxy, setUploadViaProxy] = useState(true);
  const [dedicatedUploadProxy, setDedicatedUploadProxy] = useState('138.16.105.129:63586');
  const [uploadInput, setUploadInput] = useState('');
  const [newProxyInput, setNewProxyInput] = useState('');

  // Active sub-view within modal: 'rules' (Giao diện giống ảnh 100%) or 'network' (Trình soi request lưu lượng & chặn API)
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'network'

  // Proxy Upstreams List
  const [proxyList, setProxyList] = useState([
    { id: 'px-up-1', status: 'UP', host: '109.111.37.36:49155', type: 'http', localPort: '0.0.0.0:8081', okCount: 8092, errCount: 0, lastErr: '-' },
    { id: 'px-up-2', status: 'UP', host: '109.111.36.117:50100', type: 'http', localPort: '0.0.0.0:8082', okCount: 2962, errCount: 0, lastErr: '-' }
  ]);

  // Routing Rules List
  const [rules, setRules] = useState([
    { id: 'r-1', pattern: 'tos*-up*.tiktokcdn*', action: 'DIRECT', source: 'rule (file)' },
    { id: 'r-2', pattern: 'tos*-up*.ibytedtos*', action: 'DIRECT', source: 'rule (file)' },
    { id: 'r-3', pattern: 'tos*-up*.byteoversea*', action: 'DIRECT', source: 'rule (file)' },
    { id: 'r-4', pattern: '*.tiktok.com', action: 'PROXY', source: 'rule (file)' },
    { id: 'r-5', pattern: '*.tiktokv.com', action: 'PROXY', source: 'rule (file)' },
    { id: 'r-6', pattern: '*.tiktokw.us', action: 'PROXY', source: 'rule (file)' },
    { id: 'r-7', pattern: '*.tiktokv.us', action: 'PROXY', source: 'rule (file)' },
    { id: 'r-8', pattern: '*.tiktokv.eu', action: 'PROXY', source: 'rule (file)' },
    { id: 'r-9', pattern: '*.tiktokapis.com', action: 'PROXY', source: 'rule (file)' },
    { id: 'r-10', pattern: '*.ttwstatic.com', action: 'PROXY', source: 'rule (file)' },
    { id: 'r-11', pattern: 'video-*.fbcdn.net', action: 'DIRECT', source: 'rule (file)' },
    { id: 'r-12', pattern: 'graph.facebook.com', action: 'PROXY', source: 'rule (file)' }
  ]);

  const [patternInput, setPatternInput] = useState('');
  const [ruleSearch, setRuleSearch] = useState('');

  // Live Network Requests (traffic consumption & API blocker)
  const [liveRequests, setLiveRequests] = useState([
    { id: 'req-1', method: 'POST', url: 'https://tos-va-up.tiktokcdn.com/upload/v1/video_chunk_01.mp4', size: '14.2 MB', domain: 'tos-va-up.tiktokcdn.com', route: 'DIRECT', status: 200, time: 'Vừa xong' },
    { id: 'req-2', method: 'POST', url: 'https://api16-normal-c-useast1a.tiktokv.com/passport/user/login/', size: '4.8 KB', domain: 'tiktokv.com', route: 'PROXY', status: 200, time: '2s trước' },
    { id: 'req-3', method: 'POST', url: 'https://analytics.tiktok.com/api/v2/track_telemetry_batch', size: '2.1 KB', domain: 'analytics.tiktok.com', route: 'BLOCKED', status: 403, time: '5s trước' },
    { id: 'req-4', method: 'GET', url: 'https://video-sin6-1.fbcdn.net/v/t39.102/reel_hd_720p.mp4', size: '8.6 MB', domain: 'video-sin6-1.fbcdn.net', route: 'DIRECT', status: 200, time: '8s trước' },
    { id: 'req-5', method: 'POST', url: 'https://graph.facebook.com/v19.0/act_88912/campaigns', size: '3.5 KB', domain: 'graph.facebook.com', route: 'PROXY', status: 200, time: '12s trước' },
    { id: 'req-6', method: 'GET', url: 'https://graph.instagram.com/logging_client_events', size: '1.9 KB', domain: 'graph.instagram.com', route: 'BLOCKED', status: 403, time: '15s trước' }
  ]);

  if (!activeProxyRequestModal) return null;

  // Add rule
  const handleAddRule = (actionType) => {
    if (!patternInput.trim()) return;
    const newRule = {
      id: `r-${Date.now()}`,
      pattern: patternInput.trim(),
      action: actionType, // 'DIRECT' | 'PROXY' | 'BLOCK'
      source: 'user (custom)'
    };
    setRules(prev => [newRule, ...prev]);
    setPatternInput('');
    addLog?.(`Đã thêm quy tắc định tuyến mạng: ${newRule.pattern} -> ${actionType}`, 'success');
  };

  // Add bulk TikTok Upload rule
  const handleAddTikTokUploadTemplate = () => {
    const templates = [
      { id: `r-${Date.now()}-1`, pattern: 'tos*-up*.tiktokcdn*', action: 'DIRECT', source: 'template (TikTok Upload)' },
      { id: `r-${Date.now()}-2`, pattern: 'tos*-up*.ibytedtos*', action: 'DIRECT', source: 'template (TikTok Upload)' },
      { id: `r-${Date.now()}-3`, pattern: 'tos*-up*.byteoversea*', action: 'DIRECT', source: 'template (TikTok Upload)' },
      { id: `r-${Date.now()}-4`, pattern: 'sf*-ttcdn-tos.pstatp.com', action: 'DIRECT', source: 'template (TikTok Upload)' }
    ];
    setRules(prev => [...templates, ...prev]);
    addLog?.('Đã nạp bộ quy tắc tối ưu băng thông upload TikTok (DIRECT bypass)', 'success');
  };

  // Toggle rule action
  const toggleRuleAction = (id) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const nextAction = r.action === 'DIRECT' ? 'PROXY' : r.action === 'PROXY' ? 'BLOCK' : 'DIRECT';
        return { ...r, action: nextAction };
      }
      return r;
    }));
  };

  // Delete rule
  const handleDeleteRule = (id) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  // Change request routing from live inspector
  const handleSetRouteForDomain = (domain, newRoute) => {
    const existing = rules.find(r => r.pattern.includes(domain));
    if (existing) {
      setRules(prev => prev.map(r => r.id === existing.id ? { ...r, action: newRoute } : r));
    } else {
      setRules(prev => [{
        id: `r-${Date.now()}`,
        pattern: `*${domain}*`,
        action: newRoute,
        source: 'inspector (quick)'
      }, ...prev]);
    }

    setLiveRequests(prev => prev.map(req => {
      if (req.domain === domain) {
        return { ...req, route: newRoute, status: newRoute === 'BLOCKED' ? 403 : 200 };
      }
      return req;
    }));

    addLog?.(`Đã thiết lập ${domain} sang chế độ [${newRoute}]`, 'info');
  };

  // Add new proxy to upstreams
  const handleAddProxyUpstream = () => {
    if (!newProxyInput.trim()) return;
    const newPort = `0.0.0.0:808${proxyList.length + 1}`;
    setProxyList(prev => [...prev, {
      id: `px-up-${Date.now()}`,
      status: 'UP',
      host: newProxyInput.trim(),
      type: 'http',
      localPort: newPort,
      okCount: 0,
      errCount: 0,
      lastErr: '-'
    }]);
    setNewProxyInput('');
    addLog?.(`Thêm proxy chuyển tiếp bypass mới: ${newProxyInput}`, 'success');
  };

  // Filter rules
  const filteredRules = rules.filter(r => {
    if (!ruleSearch) return true;
    return r.pattern.toLowerCase().includes(ruleSearch.toLowerCase()) || r.action.toLowerCase().includes(ruleSearch.toLowerCase());
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '16px'
    }}>
      {/* Outer Modal Container - Sleek Dark Palette matching user screenshot 1:1 */}
      <div style={{
        width: '100%',
        maxWidth: '1080px',
        maxHeight: '92vh',
        backgroundColor: '#0F172A',
        color: '#E2E8F0',
        borderRadius: '12px',
        border: '1px solid #1E293B',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>

        {/* ── HEADER BAR ── */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: '#0B1120',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#F1F5F9', letterSpacing: '0.02em' }}>
              bypass-proxy — quản lý v6
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>· 2026-08-19 · QUIC-autoblock + live-meter</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Tab switch between Screenshot Rules View & Live Traffic Inspector */}
            <div style={{ display: 'flex', backgroundColor: '#1E293B', borderRadius: '6px', padding: '2px' }}>
              <button
                onClick={() => setActiveTab('rules')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'rules' ? '#3B82F6' : 'transparent',
                  color: activeTab === 'rules' ? '#FFFFFF' : '#94A3B8'
                }}
              >
                Cấu Hình Định Tuyến & Rules
              </button>
              <button
                onClick={() => setActiveTab('network')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'network' ? '#F97316' : 'transparent',
                  color: activeTab === 'network' ? '#FFFFFF' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Activity size={12} /> Soi Request & Chặn API
              </button>
            </div>

            <button
              onClick={() => setActiveProxyRequestModal(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              title="Đóng"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── MODAL SCROLLABLE BODY ── */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>

          {/* 1. TOP STATS CARDS (Matching Screenshot 100%) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {/* Card 1: Tiết kiệm đi thẳng */}
            <div style={{ backgroundColor: '#131D33', padding: '16px 20px', borderRadius: '8px', border: '1px solid #1E293B' }}>
              <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>Tiết kiệm (đi thẳng, không qua proxy)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#F97316', marginTop: '6px', fontFamily: 'monospace' }}>
                {savedGb} GB
              </div>
            </div>

            {/* Card 2: Đã dùng qua proxy */}
            <div style={{ backgroundColor: '#131D33', padding: '16px 20px', borderRadius: '8px', border: '1px solid #1E293B' }}>
              <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>Đã dùng qua proxy</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#60A5FA', marginTop: '6px', fontFamily: 'monospace' }}>
                {usedProxyMb} MB
              </div>
            </div>

            {/* Card 3: Tỉ lệ tiết kiệm */}
            <div style={{ backgroundColor: '#131D33', padding: '16px 20px', borderRadius: '8px', border: '1px solid #1E293B' }}>
              <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>Tỉ lệ tiết kiệm</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#F8FAFC', marginTop: '6px', fontFamily: 'monospace' }}>
                {savingRate}%
              </div>
            </div>
          </div>

          {/* Bi-color Progress Bar (Orange for Direct savings, Blue for Proxy traffic) */}
          <div style={{ width: '100%', height: '7px', borderRadius: '4px', overflow: 'hidden', display: 'flex', backgroundColor: '#1E293B' }}>
            <div style={{ width: `${savingRate}%`, backgroundColor: '#F97316', transition: 'width 0.4s ease' }} title={`Tiết kiệm đi thẳng: ${savingRate}%`} />
            <div style={{ width: `${100 - savingRate}%`, backgroundColor: '#3B82F6', transition: 'width 0.4s ease' }} title={`Dùng qua proxy: ${100 - savingRate}%`} />
          </div>

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* TAB 1: RULES & CONFIGURATION (Identical to Screenshot)        */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {activeTab === 'rules' && (
            <>
              {/* Common Connection & Rotator Controls Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                fontSize: '12px',
                color: '#94A3B8',
                padding: '4px 0'
              }}>
                <div>
                  Kết nối chung (mọi proxy, có failover): <span style={{ fontFamily: 'monospace', color: '#34D399', fontWeight: 700 }}>{commonHost}</span>
                </div>

                <span>·</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Xoay IP:</span>
                  <input
                    type="checkbox"
                    checked={isRotateActive}
                    onChange={(e) => setIsRotateActive(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>bật mỗi</span>
                  <input
                    type="number"
                    value={rotateInterval}
                    onChange={(e) => setRotateInterval(Number(e.target.value))}
                    style={{
                      width: '45px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      color: '#F1F5F9',
                      borderRadius: '4px',
                      padding: '2px 4px',
                      textAlign: 'center',
                      fontSize: '11.5px'
                    }}
                  />
                  <span>phút</span>
                  <button
                    onClick={() => addLog?.(`Áp dụng chu kỳ xoay IP mỗi ${rotateInterval} phút`, 'success')}
                    style={{
                      backgroundColor: '#1E293B',
                      color: '#E2E8F0',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    Áp dụng
                  </button>
                  <span style={{ color: isRotateActive ? '#10B981' : '#64748B' }}>{isRotateActive ? 'bật' : 'tắt'}</span>
                </div>

                <span>·</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="checkbox"
                    checked={telegramAlert}
                    onChange={(e) => setTelegramAlert(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Thông báo Telegram (chỉ báo DIE)</span>
                  <span style={{ color: telegramAlert ? '#34D399' : '#64748B', fontWeight: 600 }}>
                    {telegramAlert ? 'đang bật' : 'tắt'}
                  </span>
                </div>

                <span>·</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="checkbox"
                    checked={killSwitch}
                    onChange={(e) => setKillSwitch(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Kill-switch (proxy die → chặn)</span>
                  <span style={{ color: killSwitch ? '#EF4444' : '#64748B' }}>{killSwitch ? 'bật' : 'tắt'}</span>
                </div>
              </div>

              {/* Proxy Thêm & Upload Proxy Row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <span style={{ color: '#94A3B8' }}>Proxy · thêm:</span>
                  <input
                    type="text"
                    placeholder="host:port:user:pass"
                    value={newProxyInput}
                    onChange={(e) => setNewProxyInput(e.target.value)}
                    style={{
                      width: '280px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <button
                    onClick={handleAddProxyUpstream}
                    style={{
                      backgroundColor: '#1E293B',
                      color: '#F8FAFC',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      fontSize: '11.5px',
                      cursor: 'pointer'
                    }}
                  >
                    + Thêm
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60A5FA' }}>
                    <Upload size={14} />
                    <span>Upload proxy:</span>
                  </div>
                  <input
                    type="text"
                    placeholder="host:port:user:pass"
                    value={uploadInput}
                    onChange={(e) => setUploadInput(e.target.value)}
                    style={{
                      width: '240px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <button
                    onClick={() => {
                      if (uploadInput) setDedicatedUploadProxy(uploadInput);
                      setUploadInput('');
                    }}
                    style={{
                      backgroundColor: '#D97706',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Đặt
                  </button>
                  <button
                    onClick={() => setDedicatedUploadProxy('')}
                    style={{
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      fontSize: '11.5px',
                      cursor: 'pointer'
                    }}
                  >
                    Xoá
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '10px' }}>
                    <input
                      type="checkbox"
                      checked={uploadViaProxy}
                      onChange={(e) => setUploadViaProxy(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ color: '#E2E8F0' }}>Upload QUA PROXY (bỏ tick = đi thẳng IP máy)</span>
                  </div>

                  {dedicatedUploadProxy && (
                    <span style={{ color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace', fontSize: '11.5px' }}>
                      <Check size={12} /> upload QUA proxy {dedicatedUploadProxy}
                    </span>
                  )}
                </div>
              </div>

              {/* Table 1: Proxy Upstream Ports (Matching Screenshot) */}
              <div style={{ backgroundColor: '#131D33', borderRadius: '6px', border: '1px solid #1E293B', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0B1120', borderBottom: '1px solid #1E293B', color: '#94A3B8', fontSize: '11.5px' }}>
                      <th style={{ padding: '8px 14px' }}>Trạng thái</th>
                      <th style={{ padding: '8px 14px' }}>Proxy</th>
                      <th style={{ padding: '8px 14px' }}>Loại</th>
                      <th style={{ padding: '8px 14px' }}>Cổng riêng</th>
                      <th style={{ padding: '8px 14px' }}>OK</th>
                      <th style={{ padding: '8px 14px' }}>Lỗi</th>
                      <th style={{ padding: '8px 14px' }}>Lỗi gần nhất</th>
                      <th style={{ padding: '8px 14px', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proxyList.map(px => (
                      <tr key={px.id} style={{ borderBottom: '1px solid #1E293B' }}>
                        <td style={{ padding: '8px 14px' }}>
                          <span style={{
                            backgroundColor: '#065F46',
                            color: '#34D399',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {px.status}
                          </span>
                        </td>
                        <td style={{ padding: '8px 14px', fontFamily: 'monospace', color: '#F1F5F9' }}>{px.host}</td>
                        <td style={{ padding: '8px 14px', color: '#94A3B8' }}>{px.type}</td>
                        <td style={{ padding: '8px 14px', fontFamily: 'monospace', color: '#F8FAFC' }}>{px.localPort}</td>
                        <td style={{ padding: '8px 14px', fontFamily: 'monospace', color: '#E2E8F0' }}>{px.okCount}</td>
                        <td style={{ padding: '8px 14px', fontFamily: 'monospace', color: px.errCount > 0 ? '#EF4444' : '#94A3B8' }}>{px.errCount}</td>
                        <td style={{ padding: '8px 14px', color: '#64748B' }}>{px.lastErr}</td>
                        <td style={{ padding: '8px 14px', textAlign: 'right' }}>
                          <button
                            onClick={() => setProxyList(prev => prev.filter(p => p.id !== px.id))}
                            style={{
                              backgroundColor: '#991B1B',
                              color: '#FEE2E2',
                              border: 'none',
                              borderRadius: '3px',
                              padding: '2px 8px',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                          >
                            Xoá
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table 2 Header & Action Toolbar (Matching Screenshot) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                paddingTop: '6px'
              }}>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>Danh sách quy tắc (đi thẳng / qua proxy) ·</span>

                <input
                  type="text"
                  placeholder="domain hoặc pattern, vd: tos-*-up.*"
                  value={patternInput}
                  onChange={(e) => setPatternInput(e.target.value)}
                  style={{
                    width: '260px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                />

                <button
                  onClick={() => handleAddRule('DIRECT')}
                  style={{
                    backgroundColor: '#EA580C',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 12px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  + DIRECT
                </button>

                <button
                  onClick={() => handleAddRule('PROXY')}
                  style={{
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 12px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  + PROXY
                </button>

                <button
                  onClick={handleAddTikTokUploadTemplate}
                  style={{
                    backgroundColor: '#1E293B',
                    color: '#E2E8F0',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    cursor: 'pointer'
                  }}
                >
                  + Mọi upload TikTok
                </button>

                <button
                  onClick={() => addLog?.('Đã nạp lại file cấu hình rules.txt', 'info')}
                  style={{
                    backgroundColor: '#1E293B',
                    color: '#E2E8F0',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RotateCw size={11} /> Nạp lại rules.txt
                </button>
              </div>

              {/* Table 2: Rules List (Matching Screenshot) */}
              <div style={{ backgroundColor: '#131D33', borderRadius: '6px', border: '1px solid #1E293B', overflow: 'hidden', maxHeight: '360px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0B1120', borderBottom: '1px solid #1E293B', color: '#94A3B8', fontSize: '11.5px', position: 'sticky', top: 0 }}>
                      <th style={{ padding: '8px 16px' }}>Pattern</th>
                      <th style={{ padding: '8px 16px' }}>Quy tắc</th>
                      <th style={{ padding: '8px 16px' }}>Nguồn</th>
                      <th style={{ padding: '8px 16px', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRules.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #1E293B' }}>
                        <td style={{ padding: '8px 16px', fontFamily: 'monospace', color: '#F1F5F9' }}>
                          {r.pattern}
                        </td>
                        <td style={{ padding: '8px 16px' }}>
                          <span
                            onClick={() => toggleRuleAction(r.id)}
                            style={{
                              fontWeight: 700,
                              fontSize: '11px',
                              cursor: 'pointer',
                              color: r.action === 'DIRECT' ? '#FB923C' : r.action === 'PROXY' ? '#60A5FA' : '#EF4444'
                            }}
                            title="Click để đổi DIRECT ↔ PROXY ↔ BLOCK"
                          >
                            {r.action}
                          </span>
                        </td>
                        <td style={{ padding: '8px 16px', color: '#64748B', fontSize: '11px' }}>
                          {r.source}
                        </td>
                        <td style={{ padding: '8px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteRule(r.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                              padding: '2px 4px'
                            }}
                            title="Xóa quy tắc này"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* TAB 2: LIVE NETWORK TRAFFIC INSPECTOR & API BLOCKER           */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {activeTab === 'network' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Top Banner */}
              <div style={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={16} color="#F97316" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>
                      Theo Dõi Băng Thông Request Thời Gian Thực & Chặn API Tốn Dung Lượng
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                      Xem API nào đang ngốn băng thông proxy. Bạn có thể nhấn 1-click để chuyển sang DIRECT (đi thẳng mạng máy để tiết kiệm GB) hoặc Chặn hoàn toàn (BLOCK) các API theo dõi/tracking.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => addLog?.('Đã xóa bộ nhớ đệm network log', 'info')}
                  style={{ backgroundColor: '#334155', color: '#F1F5F9', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}
                >
                  Xóa Log
                </button>
              </div>

              {/* Request Table */}
              <div style={{ backgroundColor: '#131D33', borderRadius: '8px', border: '1px solid #1E293B', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0B1120', borderBottom: '1px solid #1E293B', color: '#94A3B8', fontSize: '11.5px' }}>
                      <th style={{ padding: '10px 14px' }}>Phương thức</th>
                      <th style={{ padding: '10px 14px' }}>URL / API Endpoint</th>
                      <th style={{ padding: '10px 14px' }}>Dung lượng</th>
                      <th style={{ padding: '10px 14px' }}>Đường truyền</th>
                      <th style={{ padding: '10px 14px' }}>Trạng thái</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Hành động định tuyến</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveRequests.map(req => (
                      <tr key={req.id} style={{ borderBottom: '1px solid #1E293B' }}>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{
                            fontFamily: 'monospace',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '2px 5px',
                            borderRadius: '3px',
                            backgroundColor: req.method === 'POST' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            color: req.method === 'POST' ? '#60A5FA' : '#34D399'
                          }}>
                            {req.method}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', maxWidth: '380px' }}>
                          <div style={{ fontFamily: 'monospace', color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {req.url}
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#64748B' }}>Domain: {req.domain} · {req.time}</div>
                        </td>
                        <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: req.size.includes('MB') ? '#F97316' : '#E2E8F0' }}>
                          {req.size}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '4px',
                            backgroundColor: req.route === 'DIRECT' ? 'rgba(249, 115, 22, 0.15)' : req.route === 'PROXY' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: req.route === 'DIRECT' ? '#FB923C' : req.route === 'PROXY' ? '#60A5FA' : '#F87171'
                          }}>
                            {req.route}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '11.5px', color: req.status === 200 ? '#34D399' : '#EF4444' }}>
                          {req.status === 200 ? '200 OK' : '403 Blocked'}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {req.route !== 'DIRECT' && (
                              <button
                                onClick={() => handleSetRouteForDomain(req.domain, 'DIRECT')}
                                style={{
                                  backgroundColor: 'rgba(249, 115, 22, 0.2)',
                                  color: '#FB923C',
                                  border: '1px solid #EA580C',
                                  borderRadius: '3px',
                                  padding: '2px 6px',
                                  fontSize: '10.5px',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                                title="Cho đi thẳng mạng gốc để tiết kiệm dung lượng Proxy"
                              >
                                Đi DIRECT
                              </button>
                            )}
                            {req.route !== 'PROXY' && (
                              <button
                                onClick={() => handleSetRouteForDomain(req.domain, 'PROXY')}
                                style={{
                                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                  color: '#60A5FA',
                                  border: '1px solid #2563EB',
                                  borderRadius: '3px',
                                  padding: '2px 6px',
                                  fontSize: '10.5px',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                                title="Bắt buộc đi qua Proxy"
                              >
                                Đi PROXY
                              </button>
                            )}
                            {req.route !== 'BLOCKED' && (
                              <button
                                onClick={() => handleSetRouteForDomain(req.domain, 'BLOCKED')}
                                style={{
                                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                  color: '#F87171',
                                  border: '1px solid #DC2626',
                                  borderRadius: '3px',
                                  padding: '2px 6px',
                                  fontSize: '10.5px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                                title="Chặn hoàn toàn API này"
                              >
                                <Ban size={10} /> Chặn API
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* ── FOOTER BAR ── */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: '#0B1120',
          borderTop: '1px solid #1E293B',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11.5px',
          color: '#64748B'
        }}>
          <div>
            💡 <span style={{ color: '#94A3B8' }}>Mẹo tối ưu:</span> Đặt các domain tải video như <code style={{ color: '#FB923C' }}>tos*-up*.tiktokcdn*</code> hoặc <code style={{ color: '#FB923C' }}>*.fbcdn.net</code> thành <b>DIRECT</b> để tiết kiệm tới 90% chi phí dung lượng proxy dân cư (GB).
          </div>
          <button
            onClick={() => setActiveProxyRequestModal(false)}
            style={{
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 16px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
