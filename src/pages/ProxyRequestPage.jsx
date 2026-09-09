import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Activity,
  Play,
  Pause,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Ban,
  ArrowRightLeft,
  Zap,
  Download,
  Upload,
  RefreshCw,
  Globe,
  Radio,
  Sliders,
  ExternalLink,
  ChevronDown,
  Info,
  Server,
  Layers,
  FileText
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

export default function ProxyRequestPage() {
  const { profiles = [], proxies = [], addLog, setActiveTab } = useBrowser();

  // Capture Engine State
  const [isCapturing, setIsCapturing] = useState(true);
  const [selectedProfileFilter, setSelectedProfileFilter] = useState('All');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubView, setActiveSubView] = useState('stream'); // 'stream' | 'rules' | 'analytics'

  // Local Proxy Interceptor Settings
  const [localProxyPort, setLocalProxyPort] = useState(8899);
  const [upstreamProxy, setUpstreamProxy] = useState('154.21.32.88:1080 (SOCKS5)');
  const [autoDetectVideoCdn, setAutoDetectVideoCdn] = useState(true);

  // Bandwidth Metrics
  const [savedGb, setSavedGb] = useState(12.84);
  const [usedProxyMb, setUsedProxyMb] = useState(1480.20);
  const [blockedMb, setBlockedMb] = useState(485.50);

  // Active Routing Rules
  const [rules, setRules] = useState([
    { id: 'rule-1', pattern: 'tos*-up*.tiktokcdn.com/*', action: 'DIRECT', type: 'Video CDN', notes: 'Tải video TikTok đi thẳng máy thật', enabled: true },
    { id: 'rule-2', pattern: 'video-*.fbcdn.net/*', action: 'DIRECT', type: 'Video CDN', notes: 'Băng thông video Facebook Reels/Watch', enabled: true },
    { id: 'rule-3', pattern: '*.byteoversea.com/video/*', action: 'DIRECT', type: 'Media', notes: 'Máy chủ video phân phối ByteDance', enabled: true },
    { id: 'rule-4', pattern: 'api*.tiktokv.com/passport/*', action: 'PROXY', type: 'Auth API', notes: 'Bảo mật đăng nhập tài khoản', enabled: true },
    { id: 'rule-5', pattern: 'graph.facebook.com/v*/*', action: 'PROXY', type: 'Graph API', notes: 'API Facebook Ads & Trang', enabled: true },
    { id: 'rule-6', pattern: 'analytics.tiktok.com/*', action: 'BLOCKED', type: 'Telemetry', notes: 'Chặn thu thập vị trí và phân tích', enabled: true },
    { id: 'rule-7', pattern: '*.doubleclick.net/*', action: 'BLOCKED', type: 'Ad Tracker', notes: 'Chặn tracking quảng cáo rác', enabled: true },
    { id: 'rule-8', pattern: 'telemetry.google.com/*', action: 'BLOCKED', type: 'Telemetry', notes: 'Chặn telemetry hệ thống', enabled: true }
  ]);

  // Live Captured Network Requests
  const [requests, setRequests] = useState([
    {
      id: 'req-1',
      time: '20:58:12.450',
      profile: 'TikTok Store US #01',
      method: 'POST',
      url: 'https://tos-va-up.tiktokcdn.com/upload/v2/chunk_part_098.mp4',
      domain: 'tos-va-up.tiktokcdn.com',
      sizeBytes: 18450000,
      sizeFormatted: '18.45 MB',
      type: 'Media',
      route: 'DIRECT',
      status: 200,
      latency: 42
    },
    {
      id: 'req-2',
      time: '20:58:11.820',
      profile: 'TikTok Store US #01',
      method: 'POST',
      url: 'https://api16-normal-c-useast1a.tiktokv.com/passport/user/login_status/',
      domain: 'tiktokv.com',
      sizeBytes: 4200,
      sizeFormatted: '4.2 KB',
      type: 'API',
      route: 'PROXY',
      status: 200,
      latency: 85
    },
    {
      id: 'req-3',
      time: '20:58:10.140',
      profile: 'Facebook Ads - Account 01',
      method: 'POST',
      url: 'https://analytics.tiktok.com/api/v2/track_telemetry_batch',
      domain: 'analytics.tiktok.com',
      sizeBytes: 2800,
      sizeFormatted: '2.8 KB',
      type: 'Telemetry',
      route: 'BLOCKED',
      status: 403,
      latency: 2
    },
    {
      id: 'req-4',
      time: '20:58:08.660',
      profile: 'Facebook Ads - Account 01',
      method: 'GET',
      url: 'https://video-sin6-1.fbcdn.net/v/t39.102/reel_hd_720p_segment3.mp4',
      domain: 'video-sin6-1.fbcdn.net',
      sizeBytes: 12200000,
      sizeFormatted: '12.20 MB',
      type: 'Media',
      route: 'DIRECT',
      status: 200,
      latency: 35
    },
    {
      id: 'req-5',
      time: '20:58:06.310',
      profile: 'Crypto Airdrop #03',
      method: 'POST',
      url: 'https://graph.facebook.com/v19.0/act_88912/campaigns',
      domain: 'graph.facebook.com',
      sizeBytes: 3600,
      sizeFormatted: '3.6 KB',
      type: 'API',
      route: 'PROXY',
      status: 200,
      latency: 110
    },
    {
      id: 'req-6',
      time: '20:58:04.990',
      profile: 'Crypto Airdrop #03',
      method: 'GET',
      url: 'https://adservice.google.com/adsid/integrator.sync',
      domain: 'adservice.google.com',
      sizeBytes: 1500,
      sizeFormatted: '1.5 KB',
      type: 'Ad Tracker',
      route: 'BLOCKED',
      status: 403,
      latency: 1
    }
  ]);

  // Form states for adding rule
  const [newPattern, setNewPattern] = useState('');
  const [newAction, setNewAction] = useState('DIRECT');
  const [newNotes, setNewNotes] = useState('');
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);

  // Realtime request simulation when isCapturing is true
  useEffect(() => {
    if (!isCapturing) return;

    const interval = setInterval(() => {
      const randomProfiles = ['TikTok Store US #01', 'Facebook Ads - Account 01', 'Crypto Airdrop #03', 'Shopee Farm Store'];
      const prof = randomProfiles[Math.floor(Math.random() * randomProfiles.length)];
      const isLargeMedia = Math.random() > 0.6;

      let newReq;
      if (isLargeMedia) {
        const mb = (Math.random() * 8 + 2).toFixed(2);
        newReq = {
          id: `req-${Date.now()}`,
          time: new Date().toLocaleTimeString('vi-VN') + '.' + Math.floor(Math.random() * 900 + 100),
          profile: prof,
          method: 'POST',
          url: `https://tos-va-up.tiktokcdn.com/upload/chunk_${Math.floor(Math.random() * 1000)}.mp4`,
          domain: 'tos-va-up.tiktokcdn.com',
          sizeBytes: Math.round(mb * 1024 * 1024),
          sizeFormatted: `${mb} MB`,
          type: 'Media',
          route: 'DIRECT',
          status: 200,
          latency: Math.floor(30 + Math.random() * 40)
        };
        setSavedGb(prev => Number((prev + mb / 1024).toFixed(3)));
      } else {
        const isBlock = Math.random() > 0.7;
        const kb = (Math.random() * 5 + 1).toFixed(1);
        newReq = {
          id: `req-${Date.now()}`,
          time: new Date().toLocaleTimeString('vi-VN') + '.' + Math.floor(Math.random() * 900 + 100),
          profile: prof,
          method: isBlock ? 'GET' : 'POST',
          url: isBlock ? `https://analytics.tiktok.com/api/v2/log_${Math.floor(Math.random() * 50)}` : `https://api.tiktok.com/v1/auth/session_${Math.floor(Math.random() * 50)}`,
          domain: isBlock ? 'analytics.tiktok.com' : 'api.tiktok.com',
          sizeBytes: Math.round(kb * 1024),
          sizeFormatted: `${kb} KB`,
          type: isBlock ? 'Telemetry' : 'API',
          route: isBlock ? 'BLOCKED' : 'PROXY',
          status: isBlock ? 403 : 200,
          latency: isBlock ? 1 : Math.floor(70 + Math.random() * 60)
        };
        if (isBlock) {
          setBlockedMb(prev => Number((prev + kb / 1024).toFixed(2)));
        } else {
          setUsedProxyMb(prev => Number((prev + kb / 1024).toFixed(2)));
        }
      }

      setRequests(prev => [newReq, ...prev.slice(0, 49)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isCapturing]);

  // Action: Set Routing directly from table
  const handleAssignRoute = (domain, targetRoute) => {
    // Check if rule exists
    const ruleIndex = rules.findIndex(r => r.pattern.includes(domain));
    if (ruleIndex >= 0) {
      setRules(prev => prev.map((r, idx) => idx === ruleIndex ? { ...r, action: targetRoute } : r));
    } else {
      setRules(prev => [{
        id: `rule-${Date.now()}`,
        pattern: `*${domain}*`,
        action: targetRoute,
        type: targetRoute === 'DIRECT' ? 'Bypass' : targetRoute === 'BLOCKED' ? 'Blocked' : 'Proxy Tunnel',
        notes: `Tạo nhanh từ bảng bắt gói cho ${domain}`,
        enabled: true
      }, ...prev]);
    }

    // Update live requests matching domain
    setRequests(prev => prev.map(req => {
      if (req.domain === domain) {
        return {
          ...req,
          route: targetRoute,
          status: targetRoute === 'BLOCKED' ? 403 : 200
        };
      }
      return req;
    }));

    addLog?.(`Đã thiết lập tuyến đường cho [${domain}] sang chế độ ${targetRoute}`, 'success');
  };

  const handleAddRuleSubmit = (e) => {
    e.preventDefault();
    if (!newPattern.trim()) return;
    const ruleObj = {
      id: `rule-${Date.now()}`,
      pattern: newPattern.trim(),
      action: newAction,
      type: newAction === 'DIRECT' ? 'Bypass' : newAction === 'BLOCKED' ? 'Blacklist' : 'Proxy Tunnel',
      notes: newNotes.trim() || 'Quy tắc thủ công',
      enabled: true
    };
    setRules(prev => [ruleObj, ...prev]);
    setNewPattern('');
    setNewNotes('');
    setShowAddRuleModal(false);
    addLog?.(`Thêm quy tắc mới: ${ruleObj.pattern} -> ${newAction}`, 'success');
  };

  const handleApplyPreset = (presetType) => {
    if (presetType === 'tiktok') {
      const tiktokRules = [
        { id: `rule-${Date.now()}-1`, pattern: 'tos*-up*.tiktokcdn.com/*', action: 'DIRECT', type: 'Video CDN', notes: 'Upload video TikTok', enabled: true },
        { id: `rule-${Date.now()}-2`, pattern: 'tos*-up*.ibytedtos.com/*', action: 'DIRECT', type: 'Video CDN', notes: 'ByteDance TOS upload', enabled: true },
        { id: `rule-${Date.now()}-3`, pattern: '*.byteoversea.com/video/*', action: 'DIRECT', type: 'Video CDN', notes: 'Tải video phân phối', enabled: true },
        { id: `rule-${Date.now()}-4`, pattern: 'api*.tiktokv.com/*', action: 'PROXY', type: 'API', notes: 'API TikTok bảo mật danh tính', enabled: true }
      ];
      setRules(prev => [...tiktokRules, ...prev]);
      addLog?.('Đã nạp bộ mẫu tối ưu băng thông video TikTok (Bypass DIRECT)', 'success');
    } else if (presetType === 'facebook') {
      const fbRules = [
        { id: `rule-${Date.now()}-1`, pattern: 'video-*.fbcdn.net/*', action: 'DIRECT', type: 'Video CDN', notes: 'Băng thông video Facebook', enabled: true },
        { id: `rule-${Date.now()}-2`, pattern: 'upload.facebook.com/*', action: 'DIRECT', type: 'Media Upload', notes: 'Tải ảnh/video lên Facebook', enabled: true },
        { id: `rule-${Date.now()}-3`, pattern: 'graph.facebook.com/*', action: 'PROXY', type: 'Auth API', notes: 'API Facebook Ads bắt buộc qua Proxy', enabled: true }
      ];
      setRules(prev => [...fbRules, ...prev]);
      addLog?.('Đã nạp bộ mẫu tối ưu băng thông Facebook Ads & Video', 'success');
    } else if (presetType === 'block_trackers') {
      const blockRules = [
        { id: `rule-${Date.now()}-1`, pattern: 'analytics.tiktok.com/*', action: 'BLOCKED', type: 'Telemetry', notes: 'Chặn tracking TikTok', enabled: true },
        { id: `rule-${Date.now()}-2`, pattern: '*.doubleclick.net/*', action: 'BLOCKED', type: 'Ad Tracker', notes: 'Chặn Google DoubleClick', enabled: true },
        { id: `rule-${Date.now()}-3`, pattern: 'graph.instagram.com/logging*', action: 'BLOCKED', type: 'Telemetry', notes: 'Chặn telemetry Instagram', enabled: true }
      ];
      setRules(prev => [...blockRules, ...prev]);
      addLog?.('Đã nạp bộ mẫu chặn Telemetry & Tracker rác', 'warn');
    }
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (selectedProfileFilter !== 'All' && req.profile !== selectedProfileFilter) return false;
    if (selectedRouteFilter !== 'All' && req.route !== selectedRouteFilter) return false;
    if (selectedTypeFilter !== 'All' && req.type !== selectedTypeFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return req.url.toLowerCase().includes(term) || req.domain.toLowerCase().includes(term) || req.profile.toLowerCase().includes(term);
    }
    return true;
  });

  // Calculate percentage savings
  const totalTrafficMb = savedGb * 1024 + usedProxyMb + blockedMb;
  const savingPercentage = totalTrafficMb > 0 ? ((savedGb * 1024 / totalTrafficMb) * 100).toFixed(1) : 90;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#FFFFFF',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      {/* ── TOP HEADER TITLEBAR ── */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        backgroundColor: '#FFFFFF'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#EDE9FE',
              color: 'var(--apidog-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(124, 58, 237, 0.12)'
            }}>
              <Activity size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#111827', margin: 0 }}>
                Hệ Thống Bắt Gói Mạng & Phân Luồng Proxy (Traffic Router)
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6B7280', margin: '3px 0 0 0' }}>
                Đánh chặn và phân tích lưu lượng mạng thời gian thực: Xác định API nào đi thẳng (DIRECT) để tiết kiệm băng thông, API nào qua PROXY và API nào cần CHẶN
              </p>
            </div>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsCapturing(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isCapturing ? '#059669' : '#DC2626',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: isCapturing ? '0 2px 5px rgba(5, 150, 105, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {isCapturing ? <Pause size={14} /> : <Play size={14} />}
            {isCapturing ? 'Đang Bắt Gói (Capture ON)' : 'Đã Tạm Dừng (Capture OFF)'}
          </button>

          <button
            onClick={() => setRequests([])}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', padding: '8px 14px', borderRadius: '8px' }}
            title="Xóa danh sách request bắt được"
          >
            <Trash2 size={14} /> Xóa Log
          </button>

          <button
            onClick={() => setShowAddRuleModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', padding: '8px 16px', borderRadius: '8px', fontWeight: 600 }}
          >
            <Zap size={14} /> + Thêm Quy Tắc
          </button>
        </div>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>

        {/* ── 4 KPI STATS CARDS (White Theme with Vibrant Accents) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          
          {/* Card 1: Tiết kiệm đi thẳng DIRECT */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Tiết Kiệm Đi Thẳng (DIRECT)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', marginTop: '4px', fontFamily: 'monospace' }}>
                {savedGb} <span style={{ fontSize: '14px', fontWeight: 600 }}>GB</span>
              </div>
              <div style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 600 }}>
                <CheckCircle2 size={12} /> Bỏ qua video CDN, không tốn proxy
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={22} />
            </div>
          </div>

          {/* Card 2: Dùng qua PROXY */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Lưu Lượng Dùng Qua PROXY</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB', marginTop: '4px', fontFamily: 'monospace' }}>
                {usedProxyMb} <span style={{ fontSize: '14px', fontWeight: 600 }}>MB</span>
              </div>
              <div style={{ fontSize: '11px', color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 500 }}>
                <Shield size={12} /> Dành riêng cho API bảo mật tài khoản
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRightLeft size={22} />
            </div>
          </div>

          {/* Card 3: Đã Chặn BLOCKED */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Lưu Lượng Đã Chặn (BLOCKED)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', marginTop: '4px', fontFamily: 'monospace' }}>
                {blockedMb} <span style={{ fontSize: '14px', fontWeight: 600 }}>MB</span>
              </div>
              <div style={{ fontSize: '11px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 500 }}>
                <Ban size={12} /> Chặn telemetry, theo dõi & quảng cáo
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ban size={22} />
            </div>
          </div>

          {/* Card 4: Tỉ lệ tiết kiệm */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Tỉ Lệ Tiết Kiệm Băng Thông</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#7C3AED', marginTop: '4px', fontFamily: 'monospace' }}>
                {savingPercentage}%
              </div>
              <div style={{ fontSize: '11px', color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 600 }}>
                ⚡ Tối ưu chi phí proxy vượt trội
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={22} />
            </div>
          </div>
        </div>

        {/* Multi-segment Bandwidth Distribution Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '12px 16px',
          borderRadius: '10px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#4B5563' }}>
            <span style={{ fontWeight: 600 }}>Biểu Đồ Phân Phối Băng Thông Thực Tế:</span>
            <div style={{ display: 'flex', gap: '16px', fontSize: '11.5px' }}>
              <span style={{ color: '#059669', fontWeight: 600 }}>● DIRECT ({savedGb} GB)</span>
              <span style={{ color: '#2563EB', fontWeight: 600 }}>● PROXY ({usedProxyMb} MB)</span>
              <span style={{ color: '#DC2626', fontWeight: 600 }}>● BLOCKED ({blockedMb} MB)</span>
            </div>
          </div>

          <div style={{ width: '100%', height: '10px', borderRadius: '6px', overflow: 'hidden', display: 'flex', backgroundColor: '#F3F4F6' }}>
            <div style={{ width: `${savingPercentage}%`, backgroundColor: '#10B981', transition: 'width 0.4s ease' }} title={`Đi thẳng DIRECT: ${savingPercentage}%`} />
            <div style={{ width: `${(100 - savingPercentage) * 0.75}%`, backgroundColor: '#3B82F6', transition: 'width 0.4s ease' }} title="Dùng qua PROXY" />
            <div style={{ width: `${(100 - savingPercentage) * 0.25}%`, backgroundColor: '#EF4444', transition: 'width 0.4s ease' }} title="Đã Chặn" />
          </div>
        </div>

        {/* ── LOCAL PROXY INTERCEPTOR BAR ── */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12.5px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Server size={15} style={{ color: '#7C3AED' }} />
              <span style={{ color: '#475569' }}>Cổng Proxy Cục Bộ (Local Interceptor):</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}>
                127.0.0.1:{localProxyPort}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#475569' }}>Proxy Đích (Upstream):</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563EB' }}>
                {upstreamProxy}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> SSL MITM Decryption: Sẵn Sàng
              </span>
            </div>
          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500 }}>Nạp nhanh quy tắc mẫu:</span>
            <button
              onClick={() => handleApplyPreset('tiktok')}
              style={{ padding: '3px 8px', borderRadius: '5px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: '#0F172A' }}
            >
              + Mẫu TikTok
            </button>
            <button
              onClick={() => handleApplyPreset('facebook')}
              style={{ padding: '3px 8px', borderRadius: '5px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: '#0F172A' }}
            >
              + Mẫu Facebook
            </button>
            <button
              onClick={() => handleApplyPreset('block_trackers')}
              style={{ padding: '3px 8px', borderRadius: '5px', border: '1px solid #FCA5A5', background: '#FEF2F2', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: '#DC2626' }}
            >
              + Chặn Tracking
            </button>
          </div>
        </div>

        {/* ── SUB-TABS: LIVE STREAM VS RULES MANAGER ── */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', gap: '4px' }}>
          <button
            onClick={() => setActiveSubView('stream')}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeSubView === 'stream' ? '2.5px solid #7C3AED' : '2.5px solid transparent',
              color: activeSubView === 'stream' ? '#7C3AED' : '#6B7280',
              fontWeight: activeSubView === 'stream' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px'
            }}
          >
            <Activity size={15} />
            <span>Danh Sách Bắt Gói Mạng Thời Gian Thực ({filteredRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveSubView('rules')}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeSubView === 'rules' ? '2.5px solid #7C3AED' : '2.5px solid transparent',
              color: activeSubView === 'rules' ? '#7C3AED' : '#6B7280',
              fontWeight: activeSubView === 'rules' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px'
            }}
          >
            <Sliders size={15} />
            <span>Quản Lý Quy Tắc Định Tuyến Routing Rules ({rules.length})</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* VIEW 1: LIVE TRAFFIC STREAM & ROUTE CHANGER                     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeSubView === 'stream' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Filter controls row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {/* Search Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '6px 12px',
                width: '320px'
              }}>
                <Search size={14} color="#9CA3AF" />
                <input
                  type="text"
                  placeholder="Lọc theo URL, Host, Profile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12.5px', width: '100%', color: '#111827' }}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#9CA3AF', padding: 0 }}>✕</button>
                )}
              </div>

              {/* Filter Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Route filter */}
                <select
                  value={selectedRouteFilter}
                  onChange={(e) => setSelectedRouteFilter(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '12px', color: '#374151', backgroundColor: '#FFFFFF' }}
                >
                  <option value="All">Mọi Tuyến Đường</option>
                  <option value="DIRECT">Chỉ DIRECT (Đi thẳng)</option>
                  <option value="PROXY">Chỉ PROXY</option>
                  <option value="BLOCKED">Đã Bị CHẶN</option>
                </select>

                {/* Resource type filter */}
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '12px', color: '#374151', backgroundColor: '#FFFFFF' }}
                >
                  <option value="All">Mọi Loại Dữ Liệu</option>
                  <option value="Media">Media / Video</option>
                  <option value="API">API / Fetch</option>
                  <option value="Telemetry">Telemetry / Tracking</option>
                  <option value="Ad Tracker">Ad Tracker</option>
                </select>

                {/* Profile Filter */}
                <select
                  value={selectedProfileFilter}
                  onChange={(e) => setSelectedProfileFilter(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '12px', color: '#374151', backgroundColor: '#FFFFFF' }}
                >
                  <option value="All">Tất Cả Hồ Sơ</option>
                  {profiles.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Requests Stream Table */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '11.5px', fontWeight: 600 }}>
                    <th style={{ padding: '10px 14px' }}>Thời Gian</th>
                    <th style={{ padding: '10px 14px' }}>Hồ Sơ</th>
                    <th style={{ padding: '10px 14px' }}>Method</th>
                    <th style={{ padding: '10px 14px' }}>URL / API Endpoint</th>
                    <th style={{ padding: '10px 14px' }}>Loại & Dung Lượng</th>
                    <th style={{ padding: '10px 14px' }}>Tuyến Đường</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Thao Tác Định Tuyến 1-Click</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#9CA3AF' }}>
                        <Activity size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#4B5563' }}>Chưa có request mạng nào được bắt</div>
                        <div style={{ fontSize: '12px', marginTop: '3px' }}>Bật "Đang Bắt Gói (Capture ON)" và chạy một hồ sơ trình duyệt để xem luồng mạng.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map(req => {
                      const isDirect = req.route === 'DIRECT';
                      const isProxy = req.route === 'PROXY';
                      const isBlocked = req.route === 'BLOCKED';

                      return (
                        <tr key={req.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.1s ease' }}>
                          {/* Timestamp */}
                          <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#6B7280', fontSize: '11px', whiteSpace: 'nowrap' }}>
                            {req.time}
                          </td>

                          {/* Profile */}
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{
                              fontSize: '11.5px',
                              fontWeight: 600,
                              color: '#374151',
                              backgroundColor: '#F3F4F6',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              whiteSpace: 'nowrap'
                            }}>
                              {req.profile}
                            </span>
                          </td>

                          {/* Method */}
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: '11px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: req.method === 'POST' ? '#EFF6FF' : '#ECFDF5',
                              color: req.method === 'POST' ? '#2563EB' : '#059669',
                              border: `1px solid ${req.method === 'POST' ? '#BFDBFE' : '#A7F3D0'}`
                            }}>
                              {req.method}
                            </span>
                          </td>

                          {/* URL / Domain */}
                          <td style={{ padding: '10px 14px', maxWidth: '380px' }}>
                            <div style={{
                              fontFamily: 'monospace',
                              fontSize: '12px',
                              color: isBlocked ? '#9CA3AF' : '#111827',
                              fontWeight: 500,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              textDecoration: isBlocked ? 'line-through' : 'none'
                            }}>
                              {req.url}
                            </div>
                            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                              Domain: <span style={{ color: '#4B5563' }}>{req.domain}</span> · {req.latency}ms
                            </div>
                          </td>

                          {/* Type & Size */}
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                fontSize: '12px',
                                color: req.sizeFormatted.includes('MB') ? '#EA580C' : '#374151'
                              }}>
                                {req.sizeFormatted}
                              </span>
                              <span style={{ fontSize: '10.5px', color: '#9CA3AF' }}>({req.type})</span>
                            </div>
                          </td>

                          {/* Current Route */}
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: isDirect ? '#ECFDF5' : isProxy ? '#EFF6FF' : '#FEF2F2',
                              color: isDirect ? '#059669' : isProxy ? '#2563EB' : '#DC2626',
                              border: `1px solid ${isDirect ? '#A7F3D0' : isProxy ? '#BFDBFE' : '#FECACA'}`
                            }}>
                              {req.route}
                            </span>
                          </td>

                          {/* 1-Click Action Buttons */}
                          <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              {!isDirect && (
                                <button
                                  onClick={() => handleAssignRoute(req.domain, 'DIRECT')}
                                  style={{
                                    border: '1px solid #10B981',
                                    backgroundColor: '#ECFDF5',
                                    color: '#059669',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    padding: '3px 8px',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                  }}
                                  title="Chuyển domain này đi thẳng mạng gốc để tiết kiệm dung lượng Proxy"
                                >
                                  ⚡ Đi DIRECT
                                </button>
                              )}

                              {!isProxy && (
                                <button
                                  onClick={() => handleAssignRoute(req.domain, 'PROXY')}
                                  style={{
                                    border: '1px solid #3B82F6',
                                    backgroundColor: '#EFF6FF',
                                    color: '#2563EB',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    padding: '3px 8px',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                  }}
                                  title="Bắt buộc đi qua IP Proxy"
                                >
                                  🛡 Đi PROXY
                                </button>
                              )}

                              {!isBlocked && (
                                <button
                                  onClick={() => handleAssignRoute(req.domain, 'BLOCKED')}
                                  style={{
                                    border: '1px solid #EF4444',
                                    backgroundColor: '#FEF2F2',
                                    color: '#DC2626',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    padding: '3px 8px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                  title="Chặn hoàn toàn API này"
                                >
                                  <Ban size={11} /> Chặn API
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* VIEW 2: ACTIVE ROUTING RULES MANAGER                            */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeSubView === 'rules' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              padding: '12px 18px',
              borderRadius: '10px',
              border: '1px solid #E2E8F0'
            }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Danh Sách Quy Tắc Phân Luồng (Routing Table)</h4>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0 0' }}>
                  Mọi request từ trình duyệt sẽ được kiểm tra theo danh sách này theo thứ tự từ trên xuống dưới.
                </p>
              </div>
              <button
                onClick={() => setShowAddRuleModal(true)}
                className="btn btn-primary"
                style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '6px' }}
              >
                + Thêm Quy Tắc Mới
              </button>
            </div>

            {/* Rules Table */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '11.5px', fontWeight: 600 }}>
                    <th style={{ padding: '10px 16px' }}>Trạng Thái</th>
                    <th style={{ padding: '10px 16px' }}>Mẫu Nhận Diện (Pattern Wildcard)</th>
                    <th style={{ padding: '10px 16px' }}>Tuyến Đường</th>
                    <th style={{ padding: '10px 16px' }}>Loại & Ghi Chú</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map(rule => (
                    <tr key={rule.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '10px 16px' }}>
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setRules(prev => prev.map(r => r.id === rule.id ? { ...r, enabled: val } : r));
                          }}
                          style={{ cursor: 'pointer', accentColor: '#7C3AED' }}
                        />
                      </td>
                      <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A' }}>
                        {rule.pattern}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: rule.action === 'DIRECT' ? '#ECFDF5' : rule.action === 'PROXY' ? '#EFF6FF' : '#FEF2F2',
                          color: rule.action === 'DIRECT' ? '#059669' : rule.action === 'PROXY' ? '#2563EB' : '#DC2626',
                          border: `1px solid ${rule.action === 'DIRECT' ? '#A7F3D0' : rule.action === 'PROXY' ? '#BFDBFE' : '#FECACA'}`
                        }}>
                          {rule.action}
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px', color: '#4B5563' }}>
                        <span style={{ fontWeight: 600, color: '#111827' }}>[{rule.type}]</span> {rule.notes}
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => setRules(prev => prev.filter(r => r.id !== rule.id))}
                          className="btn-icon"
                          style={{ color: '#EF4444' }}
                          title="Xóa quy tắc này"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ── MODAL ADD RULE ── */}
      {showAddRuleModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            width: '100%', maxWidth: '480px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.06)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="#7C3AED" />
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#111827' }}>Thêm Quy Tắc Phân Luồng</h3>
              </div>
              <button onClick={() => setShowAddRuleModal(false)} className="btn-icon">✕</button>
            </div>

            <form onSubmit={handleAddRuleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Mẫu URL / Pattern Wildcard
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: *.tiktokcdn.com/* hoặc tos-*-up.*"
                  value={newPattern}
                  onChange={(e) => setNewPattern(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontFamily: 'monospace', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Tuyến Đường Phân Phối
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'DIRECT', label: 'DIRECT (Đi thẳng)', color: '#059669', bg: '#ECFDF5' },
                    { id: 'PROXY', label: 'PROXY (Qua proxy)', color: '#2563EB', bg: '#EFF6FF' },
                    { id: 'BLOCKED', label: 'BLOCKED (Chặn)', color: '#DC2626', bg: '#FEF2F2' }
                  ].map(act => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setNewAction(act.id)}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: `1.5px solid ${newAction === act.id ? act.color : '#E2E8F0'}`,
                        backgroundColor: newAction === act.id ? act.bg : '#FFFFFF',
                        color: newAction === act.id ? act.color : '#4B5563',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Ghi Chú Mục Đích
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tiết kiệm băng thông tải video"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAddRuleModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 600 }}>Tạo Quy Tắc</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
