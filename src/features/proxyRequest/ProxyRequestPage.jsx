import React, { useState, useEffect } from 'react';
import { Activity, Sliders } from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';
import { INITIAL_RULES, INITIAL_REQUESTS } from './data/defaultRules';
import ProxyRequestHeader from './components/ProxyRequestHeader';
import ProxyRequestStats from './components/ProxyRequestStats';
import ProxyInterceptorBar from './components/ProxyInterceptorBar';
import ProxyStreamTable from './components/ProxyStreamTable';
import ProxyRulesTable from './components/ProxyRulesTable';
import AddRuleModal from './modals/AddRuleModal';

export default function ProxyRequestPage() {
  const { profiles = [], proxies = [], addLog, setActiveTab } = useBrowser();

  // Capture Engine State
  const [isCapturing, setIsCapturing] = useState(true);
  const [selectedProfileFilter, setSelectedProfileFilter] = useState('All');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubView, setActiveSubView] = useState('stream'); // 'stream' | 'rules'

  // Local Proxy Interceptor Settings
  const [localProxyPort, setLocalProxyPort] = useState(8899);
  const [upstreamProxy, setUpstreamProxy] = useState('154.21.32.88:1080 (SOCKS5)');

  // Bandwidth Metrics
  const [savedGb, setSavedGb] = useState(12.84);
  const [usedProxyMb, setUsedProxyMb] = useState(1480.20);
  const [blockedMb, setBlockedMb] = useState(485.50);

  // Active Routing Rules & Live Requests
  const [rules, setRules] = useState(INITIAL_RULES);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

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
        setSavedGb((prev) => Number((prev + mb / 1024).toFixed(3)));
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
          setBlockedMb((prev) => Number((prev + kb / 1024).toFixed(2)));
        } else {
          setUsedProxyMb((prev) => Number((prev + kb / 1024).toFixed(2)));
        }
      }

      setRequests((prev) => [newReq, ...prev.slice(0, 49)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isCapturing]);

  // Action: Set Routing directly from table
  const handleAssignRoute = (domain, targetRoute) => {
    const ruleIndex = rules.findIndex((r) => r.pattern.includes(domain));
    if (ruleIndex >= 0) {
      setRules((prev) => prev.map((r, idx) => (idx === ruleIndex ? { ...r, action: targetRoute } : r)));
    } else {
      setRules((prev) => [
        {
          id: `rule-${Date.now()}`,
          pattern: `*${domain}*`,
          action: targetRoute,
          type: targetRoute === 'DIRECT' ? 'Bypass' : targetRoute === 'BLOCKED' ? 'Blocked' : 'Proxy Tunnel',
          notes: `Tạo nhanh từ bảng bắt gói cho ${domain}`,
          enabled: true
        },
        ...prev
      ]);
    }

    setRequests((prev) =>
      prev.map((req) => {
        if (req.domain === domain) {
          return {
            ...req,
            route: targetRoute,
            status: targetRoute === 'BLOCKED' ? 403 : 200
          };
        }
        return req;
      })
    );

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
    setRules((prev) => [ruleObj, ...prev]);
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
      setRules((prev) => [...tiktokRules, ...prev]);
      addLog?.('Đã nạp bộ mẫu tối ưu băng thông video TikTok (Bypass DIRECT)', 'success');
    } else if (presetType === 'facebook') {
      const fbRules = [
        { id: `rule-${Date.now()}-1`, pattern: 'video-*.fbcdn.net/*', action: 'DIRECT', type: 'Video CDN', notes: 'Băng thông video Facebook', enabled: true },
        { id: `rule-${Date.now()}-2`, pattern: 'upload.facebook.com/*', action: 'DIRECT', type: 'Media Upload', notes: 'Tải ảnh/video lên Facebook', enabled: true },
        { id: `rule-${Date.now()}-3`, pattern: 'graph.facebook.com/*', action: 'PROXY', type: 'Auth API', notes: 'API Facebook Ads bắt buộc qua Proxy', enabled: true }
      ];
      setRules((prev) => [...fbRules, ...prev]);
      addLog?.('Đã nạp bộ mẫu tối ưu băng thông Facebook Ads & Video', 'success');
    } else if (presetType === 'block_trackers') {
      const blockRules = [
        { id: `rule-${Date.now()}-1`, pattern: 'analytics.tiktok.com/*', action: 'BLOCKED', type: 'Telemetry', notes: 'Chặn tracking TikTok', enabled: true },
        { id: `rule-${Date.now()}-2`, pattern: '*.doubleclick.net/*', action: 'BLOCKED', type: 'Ad Tracker', notes: 'Chặn Google DoubleClick', enabled: true },
        { id: `rule-${Date.now()}-3`, pattern: 'graph.instagram.com/logging*', action: 'BLOCKED', type: 'Telemetry', notes: 'Chặn telemetry Instagram', enabled: true }
      ];
      setRules((prev) => [...blockRules, ...prev]);
      addLog?.('Đã nạp bộ mẫu chặn Telemetry & Tracker rác', 'warn');
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#FFFFFF',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Top Header Titlebar */}
      <ProxyRequestHeader
        isCapturing={isCapturing}
        onToggleCapture={() => setIsCapturing((prev) => !prev)}
        onClearRequests={() => setRequests([])}
        onOpenAddRule={() => setShowAddRuleModal(true)}
      />

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        {/* 2. KPI Stats & Bandwidth Distribution */}
        <ProxyRequestStats
          savedGb={savedGb}
          usedProxyMb={usedProxyMb}
          blockedMb={blockedMb}
          savingPercentage={savingPercentage}
        />

        {/* 3. Local Proxy Interceptor Status Bar */}
        <ProxyInterceptorBar
          localProxyPort={localProxyPort}
          upstreamProxy={upstreamProxy}
          onApplyPreset={handleApplyPreset}
        />

        {/* 4. Sub-Navigation Tabs */}
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

        {/* 5. View 1: Stream Table */}
        {activeSubView === 'stream' && (
          <ProxyStreamTable
            filteredRequests={filteredRequests}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRouteFilter={selectedRouteFilter}
            setSelectedRouteFilter={setSelectedRouteFilter}
            selectedTypeFilter={selectedTypeFilter}
            setSelectedTypeFilter={setSelectedTypeFilter}
            selectedProfileFilter={selectedProfileFilter}
            setSelectedProfileFilter={setSelectedProfileFilter}
            profiles={profiles}
            onAssignRoute={handleAssignRoute}
          />
        )}

        {/* 6. View 2: Rules Table */}
        {activeSubView === 'rules' && (
          <ProxyRulesTable
            rules={rules}
            setRules={setRules}
            onOpenAddRule={() => setShowAddRuleModal(true)}
          />
        )}
      </div>

      {/* 7. Modal Add Rule */}
      <AddRuleModal
        isOpen={showAddRuleModal}
        onClose={() => setShowAddRuleModal(false)}
        newPattern={newPattern}
        setNewPattern={setNewPattern}
        newAction={newAction}
        setNewAction={setNewAction}
        newNotes={newNotes}
        setNewNotes={setNewNotes}
        onSubmit={handleAddRuleSubmit}
      />
    </div>
  );
}
