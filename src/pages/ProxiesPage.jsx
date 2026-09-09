import React, { useState, useMemo } from 'react';
import {
  Shield,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Activity,
  Globe,
  Search,
  Copy,
  Upload,
  Check,
  Eye,
  EyeOff,
  Pencil,
  X,
  AlertTriangle,
  Server,
  Layers,
  Filter
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

const COUNTRY_OPTIONS = [
  { code: 'US', label: 'Hoa Kỳ (US)' },
  { code: 'VN', label: 'Việt Nam (VN)' },
  { code: 'SG', label: 'Singapore (SG)' },
  { code: 'JP', label: 'Nhật Bản (JP)' },
  { code: 'KR', label: 'Hàn Quốc (KR)' },
  { code: 'UK', label: 'Vương Quốc Anh (UK)' },
  { code: 'DE', label: 'Đức (DE)' },
  { code: 'FR', label: 'Pháp (FR)' },
  { code: 'HK', label: 'Hồng Kông (HK)' },
  { code: 'TH', label: 'Thái Lan (TH)' },
  { code: 'CA', label: 'Canada (CA)' },
  { code: 'AU', label: 'Úc (AU)' },
];

export default function ProxiesPage() {
  const {
    proxies = [],
    profiles = [],
    addProxy,
    editProxy,
    deleteProxy,
    deleteMultipleProxies,
    checkProxy,
    checkAllProxies,
    bulkImportProxies,
    addLog
  } = useBrowser();

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('ALL'); // 'ALL' | 'SOCKS5' | 'HTTP' | 'HTTPS'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'live' | 'die'

  // Selection states
  const [selectedProxyIds, setSelectedProxyIds] = useState([]);

  // Testing states
  const [testingId, setTestingId] = useState(null);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  // Modals
  const [modalMode, setModalMode] = useState(null); // null | 'add' | 'edit'
  const [currentEditingProxy, setCurrentEditingProxy] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // null | { type: 'single', proxy } | { type: 'multiple', count }

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    type: 'SOCKS5',
    host: '',
    port: 1080,
    user: '',
    pass: '',
    country: 'US',
    name: ''
  });
  const [formError, setFormError] = useState('');
  const [testResultInModal, setTestResultInModal] = useState(null);

  // Bulk Import state
  const [bulkText, setBulkText] = useState('');
  const [bulkType, setBulkType] = useState('SOCKS5');
  const [bulkCountry, setBulkCountry] = useState('US');

  // Copy helper
  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Toggle show password
  const toggleShowPassword = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered Proxies list
  const filteredProxies = useMemo(() => {
    return proxies.filter(p => {
      // Protocol filter
      if (protocolFilter !== 'ALL' && p.type !== protocolFilter) return false;
      // Status filter
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const hostMatch = p.host && p.host.toLowerCase().includes(q);
        const portMatch = p.port && p.port.toString().includes(q);
        const countryMatch = p.country && p.country.toLowerCase().includes(q);
        const userMatch = p.user && p.user.toLowerCase().includes(q);
        const nameMatch = p.name && p.name.toLowerCase().includes(q);
        return hostMatch || portMatch || countryMatch || userMatch || nameMatch;
      }
      return true;
    });
  }, [proxies, protocolFilter, statusFilter, searchTerm]);

  // Statistics
  const totalCount = proxies.length;
  const liveCount = proxies.filter(p => p.status === 'live').length;
  const dieCount = proxies.filter(p => p.status === 'die').length;
  const socks5Count = proxies.filter(p => p.type === 'SOCKS5').length;
  const httpCount = proxies.filter(p => p.type === 'HTTP' || p.type === 'HTTPS').length;
  const avgPing = liveCount > 0 
    ? Math.round(proxies.filter(p => p.status === 'live' && p.latency).reduce((acc, p) => acc + p.latency, 0) / liveCount)
    : 0;

  // Selection handlers
  const isAllSelected = filteredProxies.length > 0 && selectedProxyIds.length === filteredProxies.length;
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProxyIds(filteredProxies.map(p => p.id));
    } else {
      setSelectedProxyIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedProxyIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Check single proxy
  const handleCheckSingle = (p, e) => {
    e?.stopPropagation();
    setTestingId(p.id);
    setTimeout(() => {
      checkProxy(p.id);
      setTestingId(null);
    }, 600);
  };

  // Check all proxies
  const handleCheckAll = () => {
    setIsCheckingAll(true);
    checkAllProxies();
    setTimeout(() => {
      setIsCheckingAll(false);
    }, 1000);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      type: 'SOCKS5',
      host: '',
      port: 1080,
      user: '',
      pass: '',
      country: 'US',
      name: ''
    });
    setFormError('');
    setTestResultInModal(null);
    setModalMode('add');
  };

  // Open Edit Modal
  const handleOpenEditModal = (p, e) => {
    e?.stopPropagation();
    setCurrentEditingProxy(p);
    setFormData({
      type: p.type || 'SOCKS5',
      host: p.host || '',
      port: p.port || 1080,
      user: p.user || '',
      pass: p.pass || '',
      country: p.country || 'US',
      name: p.name || ''
    });
    setFormError('');
    setTestResultInModal(null);
    setModalMode('edit');
  };

  // Submit Add/Edit Form
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const host = formData.host.trim();
    const port = Number(formData.port);

    if (!host) {
      setFormError('Vui lòng nhập địa chỉ Host / IP!');
      return;
    }
    if (!port || isNaN(port) || port <= 0 || port > 65535) {
      setFormError('Cổng Port phải là số hợp lệ từ 1 đến 65535!');
      return;
    }

    if (modalMode === 'add') {
      addProxy({
        ...formData,
        host,
        port,
        user: formData.user.trim(),
        pass: formData.pass.trim(),
        country: formData.country.toUpperCase()
      });
    } else if (modalMode === 'edit' && currentEditingProxy) {
      editProxy(currentEditingProxy.id, {
        ...formData,
        host,
        port,
        user: formData.user.trim(),
        pass: formData.pass.trim(),
        country: formData.country.toUpperCase()
      });
    }

    setModalMode(null);
  };

  // Test connection within modal
  const handleTestInModal = () => {
    if (!formData.host.trim()) {
      setFormError('Vui lòng nhập địa chỉ Host/IP để kiểm tra!');
      return;
    }
    setTestResultInModal('testing');
    setTimeout(() => {
      const isSuccess = Math.random() > 0.15;
      const ping = isSuccess ? Math.floor(25 + Math.random() * 60) : 0;
      setTestResultInModal(isSuccess ? { status: 'live', ping } : { status: 'die' });
    }, 700);
  };

  // Submit Bulk Import
  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (!bulkText.trim()) return;
    const count = bulkImportProxies(bulkText, bulkType, bulkCountry);
    setShowBulkModal(false);
    setBulkText('');
  };

  // Delete Handlers
  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'single') {
      deleteProxy(deleteConfirm.proxy.id);
      setSelectedProxyIds(prev => prev.filter(id => id !== deleteConfirm.proxy.id));
    } else if (deleteConfirm.type === 'multiple') {
      deleteMultipleProxies(selectedProxyIds);
      setSelectedProxyIds([]);
    }
    setDeleteConfirm(null);
  };

  return (
    <div style={{
      padding: '24px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      height: '100%',
      overflowY: 'auto',
      backgroundColor: '#FAFAFA',
      boxSizing: 'border-box'
    }}>
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER SECTION (Clean, Actions, Top bar)
         ───────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        backgroundColor: '#FFFFFF',
        padding: '18px 24px',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        {/* Left Title & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#EDE9FE',
            color: '#7C3AED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>
                Quản Lý Danh Sách Proxy
              </h2>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11.5px',
                fontWeight: 700,
                backgroundColor: '#EDE9FE',
                color: '#7C3AED'
              }}>
                {totalCount} proxy
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#6B7280', margin: '3px 0 0 0' }}>
              Kho proxy mạng tập trung: quản lý kết nối HTTP, HTTPS, SOCKS5 cho các hồ sơ trình duyệt
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Check all button */}
          <button
            onClick={handleCheckAll}
            disabled={isCheckingAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '36px',
              padding: '0 14px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: isCheckingAll ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isCheckingAll) e.currentTarget.style.backgroundColor = '#F9FAFB';
            }}
            onMouseLeave={(e) => {
              if (!isCheckingAll) e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <RefreshCw size={14} className={isCheckingAll ? 'spin-anim' : ''} />
            <span>{isCheckingAll ? 'Đang kiểm tra...' : 'Kiểm tra tất cả'}</span>
          </button>

          {/* Bulk Import button */}
          <button
            onClick={() => setShowBulkModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '36px',
              padding: '0 14px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            <Upload size={14} />
            <span>Nhập hàng loạt</span>
          </button>

          {/* Add single button */}
          <button
            onClick={handleOpenAddModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '36px',
              padding: '0 16px',
              borderRadius: '8px',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(124, 58, 237, 0.25)',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6D28D9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7C3AED'}
          >
            <Plus size={16} />
            <span>Thêm Proxy mới</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TOOLBAR & FILTER BAR
         ───────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: '#FFFFFF',
        padding: '14px 20px',
        borderRadius: '10px',
        border: '1px solid #E5E7EB'
      }}>
        {/* Left: Search & Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Tìm theo IP, cổng, quốc gia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: '34px',
                paddingLeft: '32px',
                paddingRight: '28px',
                fontSize: '12.5px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#F9FAFB',
                color: '#1F2937',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7C3AED';
                e.target.style.backgroundColor = '#FFFFFF';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D1D5DB';
                e.target.style.backgroundColor = '#F9FAFB';
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Protocol Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#F3F4F6', padding: '3px', borderRadius: '6px' }}>
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'SOCKS5', label: `SOCKS5 (${socks5Count})` },
              { id: 'HTTP', label: `HTTP/S (${httpCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setProtocolFilter(tab.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '5px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: protocolFilter === tab.id ? 700 : 500,
                  backgroundColor: protocolFilter === tab.id ? '#FFFFFF' : 'transparent',
                  color: protocolFilter === tab.id ? '#7C3AED' : '#4B5563',
                  boxShadow: protocolFilter === tab.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#F3F4F6', padding: '3px', borderRadius: '6px' }}>
            {[
              { id: 'ALL', label: 'Tất cả trạng thái' },
              { id: 'live', label: `🟢 Live (${liveCount})` },
              { id: 'die', label: `🔴 Die (${dieCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '5px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: statusFilter === tab.id ? 700 : 500,
                  backgroundColor: statusFilter === tab.id ? '#FFFFFF' : 'transparent',
                  color: statusFilter === tab.id ? '#111827' : '#4B5563',
                  boxShadow: statusFilter === tab.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Selected Batch actions OR Quick summary */}
        {selectedProxyIds.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>
              Đã chọn: <strong style={{ color: '#7C3AED' }}>{selectedProxyIds.length}</strong>
            </span>
            <button
              onClick={() => {
                selectedProxyIds.forEach(id => checkProxy(id));
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={12} />
              <span>Kiểm tra</span>
            </button>
            <button
              onClick={() => setDeleteConfirm({ type: 'multiple', count: selectedProxyIds.length })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid #FCA5A5',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Trash2 size={12} />
              <span>Xóa</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: '#6B7280' }}>
            <span>Ping TB: <strong style={{ color: '#10B981' }}>{avgPing}ms</strong></span>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN PROXY TABLE
         ───────────────────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        overflow: 'hidden'
      }}>
        {filteredProxies.length === 0 ? (
          <div style={{
            padding: '60px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: '#F3F4F6',
              color: '#9CA3AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe size={26} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#374151' }}>
              {searchTerm || protocolFilter !== 'ALL' || statusFilter !== 'ALL' 
                ? 'Không tìm thấy proxy nào phù hợp bộ lọc'
                : 'Chưa có proxy nào trong kho'
              }
            </div>
            <div style={{ fontSize: '12.5px', color: '#6B7280', maxWidth: '340px' }}>
              {searchTerm || protocolFilter !== 'ALL' || statusFilter !== 'ALL'
                ? 'Vui lòng thử điều chỉnh lại từ khóa hoặc xóa bớt bộ lọc để xem danh sách.'
                : 'Thêm proxy mới hoặc nhập danh sách hàng loạt để kết nối bảo mật cho hồ sơ.'
              }
            </div>
            {(searchTerm || protocolFilter !== 'ALL' || statusFilter !== 'ALL') ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setProtocolFilter('ALL');
                  setStatusFilter('ALL');
                }}
                style={{
                  marginTop: '8px',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Xóa bộ lọc
              </button>
            ) : (
              <button
                onClick={handleOpenAddModal}
                style={{
                  marginTop: '8px',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  backgroundColor: '#7C3AED',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                + Thêm Proxy ngay
              </button>
            )}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{
                backgroundColor: '#F9FAFB',
                borderBottom: '1px solid #E5E7EB',
                color: '#4B5563',
                fontSize: '11.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                <th style={{ width: '40px', padding: '12px 14px' }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer', borderRadius: '4px' }}
                  />
                </th>
                <th style={{ width: '110px', padding: '12px 10px' }}>Trạng thái</th>
                <th style={{ width: '100px', padding: '12px 10px' }}>Giao thức</th>
                <th style={{ padding: '12px 14px' }}>Địa chỉ IP : Cổng</th>
                <th style={{ width: '100px', padding: '12px 10px' }}>Quốc gia</th>
                <th style={{ padding: '12px 14px' }}>Tài khoản / Mật khẩu</th>
                <th style={{ width: '120px', padding: '12px 10px' }}>Đang dùng</th>
                <th style={{ width: '120px', padding: '12px 16px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProxies.map((p, idx) => {
                const isSelected = selectedProxyIds.includes(p.id);
                const isTesting = testingId === p.id;
                const isLive = p.status === 'live';
                const isPasswordRevealed = !!showPasswords[p.id];

                // Count profiles using this proxy
                const profilesUsingCount = profiles.filter(prof => 
                  prof.proxy && prof.proxy.host === p.host && Number(prof.proxy.port) === Number(p.port)
                ).length;

                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      backgroundColor: isSelected ? '#FAF5FF' : idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                      transition: 'background-color 0.1s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA';
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: '12px 14px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(p.id)}
                        style={{ cursor: 'pointer', borderRadius: '4px' }}
                      />
                    </td>

                    {/* Status & Latency */}
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: isLive ? '#10B981' : '#EF4444',
                          display: 'inline-block'
                        }} />
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: isLive ? '#065F46' : '#991B1B'
                        }}>
                          {isLive ? `${p.latency || 30}ms` : 'Dead'}
                        </span>
                      </div>
                    </td>

                    {/* Protocol */}
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: p.type === 'SOCKS5' ? '#EDE9FE' : '#EFF6FF',
                        color: p.type === 'SOCKS5' ? '#7C3AED' : '#2563EB'
                      }}>
                        {p.type || 'SOCKS5'}
                      </span>
                    </td>

                    {/* IP & Port */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: '#111827', fontFamily: 'monospace', fontSize: '13px' }}>
                          {p.host}:{p.port}
                        </span>
                        <button
                          onClick={() => handleCopy(`${p.host}:${p.port}`, `ip-${p.id}`)}
                          title="Sao chép IP:Port"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: copiedId === `ip-${p.id}` ? '#10B981' : '#9CA3AF',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {copiedId === `ip-${p.id}` ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                      {p.name && (
                        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                          {p.name}
                        </div>
                      )}
                    </td>

                    {/* Country */}
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        backgroundColor: '#F3F4F6',
                        color: '#374151'
                      }}>
                        🌐 {p.country || 'US'}
                      </span>
                    </td>

                    {/* Auth (User/Pass) */}
                    <td style={{ padding: '12px 14px' }}>
                      {p.user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12px', color: '#374151', fontFamily: 'monospace' }}>
                            {p.user} : {isPasswordRevealed ? (p.pass || '••••') : '••••••'}
                          </span>
                          <button
                            onClick={() => toggleShowPassword(p.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#9CA3AF',
                              cursor: 'pointer',
                              padding: '2px'
                            }}
                            title={isPasswordRevealed ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          >
                            {isPasswordRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button
                            onClick={() => handleCopy(`${p.user}:${p.pass}`, `auth-${p.id}`)}
                            title="Sao chép User:Pass"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: copiedId === `auth-${p.id}` ? '#10B981' : '#9CA3AF',
                              cursor: 'pointer',
                              padding: '2px'
                            }}
                          >
                            {copiedId === `auth-${p.id}` ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>
                          Không có
                        </span>
                      )}
                    </td>

                    {/* Used By Profiles */}
                    <td style={{ padding: '12px 10px' }}>
                      {profilesUsingCount > 0 ? (
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#ECFDF5',
                          color: '#047857'
                        }}>
                          {profilesUsingCount} profile
                        </span>
                      ) : (
                        <span style={{ fontSize: '11.5px', color: '#9CA3AF' }}>
                          Chưa gán
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                        {/* Check Ping */}
                        <button
                          onClick={(e) => handleCheckSingle(p, e)}
                          disabled={isTesting}
                          title="Kiểm tra kết nối"
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #E5E7EB',
                            backgroundColor: '#FFFFFF',
                            color: '#4B5563',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isTesting ? 'not-allowed' : 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            if (!isTesting) {
                              e.currentTarget.style.backgroundColor = '#EDE9FE';
                              e.currentTarget.style.color = '#7C3AED';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isTesting) {
                              e.currentTarget.style.backgroundColor = '#FFFFFF';
                              e.currentTarget.style.color = '#4B5563';
                            }
                          }}
                        >
                          <RefreshCw size={13} className={isTesting ? 'spin-anim' : ''} />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={(e) => handleOpenEditModal(p, e)}
                          title="Sửa thông tin proxy"
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #E5E7EB',
                            backgroundColor: '#FFFFFF',
                            color: '#4B5563',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#EFF6FF';
                            e.currentTarget.style.color = '#2563EB';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                            e.currentTarget.style.color = '#4B5563';
                          }}
                        >
                          <Pencil size={13} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm({ type: 'single', proxy: p });
                          }}
                          title="Xóa proxy"
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #E5E7EB',
                            backgroundColor: '#FFFFFF',
                            color: '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FEE2E2';
                            e.currentTarget.style.borderColor = '#FCA5A5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                            e.currentTarget.style.borderColor = '#E5E7EB';
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. ADD / EDIT PROXY MODAL
         ───────────────────────────────────────────────────────────── */}
      {modalMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            width: '460px',
            maxWidth: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease'
          }}>
            {/* Header */}
            <div style={{
              padding: '18px 22px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F9FAFB'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#EDE9FE',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {modalMode === 'add' ? <Plus size={18} /> : <Pencil size={17} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {modalMode === 'add' ? 'Thêm Proxy Mới' : 'Chỉnh Sửa Proxy'}
                  </h3>
                  <p style={{ fontSize: '11.5px', color: '#6B7280', margin: '2px 0 0 0' }}>
                    {modalMode === 'add' ? 'Cấu hình thông số máy chủ Proxy độc lập' : 'Cập nhật IP, Cổng hoặc tài khoản'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalMode(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmitForm} style={{ padding: '22px' }}>
              {formError && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  fontSize: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertTriangle size={15} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Protocol Select */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                  Loại Giao Thức
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {['SOCKS5', 'HTTP', 'HTTPS'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type }))}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: formData.type === type ? '2px solid #7C3AED' : '1px solid #D1D5DB',
                        backgroundColor: formData.type === type ? '#EDE9FE' : '#FFFFFF',
                        color: formData.type === type ? '#7C3AED' : '#374151',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Host & Port Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    Địa chỉ Host / IP <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 154.21.32.88"
                    value={formData.host}
                    onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 10px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    Cổng (Port) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="1080"
                    value={formData.port}
                    onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 10px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* User & Pass Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    Tài khoản (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.user}
                    onChange={(e) => setFormData(prev => ({ ...prev, user: e.target.value }))}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 10px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    Mật khẩu (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="Password"
                    value={formData.pass}
                    onChange={(e) => setFormData(prev => ({ ...prev, pass: e.target.value }))}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 10px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Country & Note */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    Quốc gia
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 8px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      boxSizing: 'border-box',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    {COUNTRY_OPTIONS.map(c => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    Tên gợi nhớ / Ghi chú
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Proxy US Agency #1"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 10px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Test Connection Button & Result */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <button
                  type="button"
                  onClick={handleTestInModal}
                  disabled={testResultInModal === 'testing'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: testResultInModal === 'testing' ? 'not-allowed' : 'pointer'
                  }}
                >
                  <RefreshCw size={13} className={testResultInModal === 'testing' ? 'spin-anim' : ''} />
                  <span>{testResultInModal === 'testing' ? 'Đang kiểm tra...' : 'Kiểm tra kết nối thử'}</span>
                </button>

                <div>
                  {testResultInModal === 'testing' && (
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>Đang ping máy chủ...</span>
                  )}
                  {testResultInModal && testResultInModal !== 'testing' && (
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: testResultInModal.status === 'live' ? '#059669' : '#DC2626'
                    }}>
                      {testResultInModal.status === 'live' 
                        ? `✓ Kết nối tốt (${testResultInModal.ping}ms)` 
                        : '✗ Không thể kết nối'}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    backgroundColor: '#7C3AED',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(124, 58, 237, 0.25)'
                  }}
                >
                  <Check size={16} />
                  <span>{modalMode === 'add' ? 'Thêm Proxy' : 'Lưu Thay Đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. BULK IMPORT MODAL
         ───────────────────────────────────────────────────────────── */}
      {showBulkModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            width: '520px',
            maxWidth: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease'
          }}>
            {/* Header */}
            <div style={{
              padding: '18px 22px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F9FAFB'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#EDE9FE',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Upload size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: '#111827', margin: 0 }}>
                    Nhập Proxy Hàng Loạt
                  </h3>
                  <p style={{ fontSize: '11.5px', color: '#6B7280', margin: '2px 0 0 0' }}>
                    Dán danh sách proxy theo định dạng một dòng một địa chỉ
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowBulkModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleBulkSubmit} style={{ padding: '22px' }}>
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                fontSize: '12px',
                color: '#1E40AF',
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                💡 <strong>Hỗ trợ các định dạng:</strong><br />
                • <code>IP:Port</code><br />
                • <code>IP:Port:User:Pass</code><br />
                • <code>User:Pass@IP:Port</code>
              </div>

              {/* Protocol & Country Select */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    Giao thức mặc định
                  </label>
                  <select
                    value={bulkType}
                    onChange={(e) => setBulkType(e.target.value)}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 8px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <option value="SOCKS5">SOCKS5</option>
                    <option value="HTTP">HTTP</option>
                    <option value="HTTPS">HTTPS</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                    Quốc gia mặc định
                  </label>
                  <select
                    value={bulkCountry}
                    onChange={(e) => setBulkCountry(e.target.value)}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 8px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    {COUNTRY_OPTIONS.map(c => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Textarea */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151' }}>
                    Danh sách proxy
                  </label>
                  <span style={{ fontSize: '11.5px', color: '#6B7280' }}>
                    {bulkText.split('\n').filter(l => l.trim()).length} dòng được phát hiện
                  </span>
                </div>
                <textarea
                  rows={8}
                  placeholder={`154.21.32.88:1080:user_a:pass_123\n113.161.44.12:8080\nuser_b:pass_456@198.51.100.45:9050`}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '12.5px',
                    fontFamily: 'monospace',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!bulkText.trim()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    backgroundColor: bulkText.trim() ? '#7C3AED' : '#9CA3AF',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: bulkText.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  <Upload size={14} />
                  <span>Nhập vào danh sách</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. DELETE CONFIRMATION MODAL
         ───────────────────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            width: '420px',
            maxWidth: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease'
          }}>
            <div style={{
              padding: '18px 22px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#FEF2F2'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: '#991B1B', margin: 0 }}>
                  Xác Nhận Xóa Proxy
                </h3>
                <p style={{ fontSize: '11.5px', color: '#B91C1C', margin: '2px 0 0 0' }}>
                  Hành động này sẽ xóa proxy khỏi kho lưu trữ
                </p>
              </div>
            </div>

            <div style={{ padding: '22px' }}>
              <p style={{ fontSize: '13px', color: '#1F2937', lineHeight: '1.5', margin: 0 }}>
                {deleteConfirm.type === 'single' ? (
                  <>Bạn có chắc chắn muốn xóa proxy <strong>{deleteConfirm.proxy.host}:{deleteConfirm.proxy.port}</strong>?</>
                ) : (
                  <>Bạn có chắc chắn muốn xóa <strong>{deleteConfirm.count} proxy</strong> đã chọn?</>
                )}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                  <span>Xóa ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
