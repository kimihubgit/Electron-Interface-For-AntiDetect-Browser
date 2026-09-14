import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Filter,
  ArrowRightLeft,
  Smartphone,
  Cpu,
  Play,
  RotateCw,
  ExternalLink,
  ChevronDown,
  Clock,
  Sparkles,
  Link2,
  Wifi,
  User,
  Lock,
  Hash,
  Zap,
  Info,
  FileText,
  Radio
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';
import { useTranslation } from '../i18n/I18nContext';
import CountryFlag from '../components/common/CountryFlag';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { testProxyConnection, parseProxyString } from '../features/profiles/utils/proxyUtils';

const COUNTRY_OPTIONS = [
  { code: 'US', label: 'Hoa Kỳ (US)' },
  { code: 'VN', label: 'Việt Nam (VN)' },
  { code: 'SG', label: 'Singapore (SG)' },
  { code: 'JP', label: 'Nhật Bản (JP)' },
  { code: 'DE', label: 'Đức (DE)' },
  { code: 'GB', label: 'Vương Quốc Anh (GB)' },
  { code: 'KR', label: 'Hàn Quốc (KR)' },
  { code: 'TH', label: 'Thái Lan (TH)' }
];

const getFlag = (code) => {
  return <CountryFlag code={code} width={18} height={12} />;
};

export default function ProxiesPage() {
  const { t } = useTranslation();
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
    rotatingProxies = [],
    addRotatingProxy,
    deleteRotatingProxy,
    triggerRotateProxy,
    dcomDevices = [],
    addDcomDevice,
    deleteDcomDevice,
    triggerDcomRotate,
    generatedIpv6List = [],
    generateIpv6Batch,
    addGeneratedIpv6ToPool,
    addLog,
    showToast
  } = useBrowser();

  // ── SUB-TAB NAVIGATION (Matching Apidog / Antidetect Browser Standards) ──
  // 'pool' | 'rotating' | 'dcom' | 'ipv6'
  const [activeSubTab, setActiveSubTab] = useState('pool');

  // Search & Filter states for Static Pool
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
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [assignModalProxy, setAssignModalProxy] = useState(null); // proxy to assign
  const [selectedTargetProfileId, setSelectedTargetProfileId] = useState('');

  // Screenshot-aligned table states
  const [showNoteText, setShowNoteText] = useState(false);
  const [ipQueryChannel, setIpQueryChannel] = useState('IPRust.io');
  const [editingNoteProxy, setEditingNoteProxy] = useState(null);
  const [noteInputText, setNoteInputText] = useState('');

  const handleOpenNoteModal = (p) => {
    setEditingNoteProxy(p);
    setNoteInputText(p.name || p.notes || '');
  };

  const handleSaveNote = async () => {
    if (!editingNoteProxy) return;
    try {
      await editProxy(editingNoteProxy.id, {
        ...editingNoteProxy,
        name: noteInputText,
        notes: noteInputText
      });
      showToast?.('Đã cập nhật ghi chú proxy');
    } catch (e) {
      console.error(e);
    } finally {
      setEditingNoteProxy(null);
    }
  };

  // Form state for Add/Edit Single Proxy
  const [formData, setFormData] = useState({
    type: 'SOCKS5',
    ipVersion: 'IPv4',
    host: '',
    port: 1080,
    user: '',
    pass: '',
    country: '',
    name: ''
  });
  const [formError, setFormError] = useState('');
  const [testResultInModal, setTestResultInModal] = useState(null);
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);
  const [quickParseInput, setQuickParseInput] = useState('');
  const singleFileInputRef = useRef(null);

  // Bulk Import state
  const [bulkText, setBulkText] = useState('');
  const [bulkType, setBulkType] = useState('SOCKS5');
  const [bulkIpVersion, setBulkIpVersion] = useState('IPv4');
  const bulkFileInputRef = useRef(null);

  // Dropdown for Add Proxy Split Button
  const [isAddProxyDropdownOpen, setIsAddProxyDropdownOpen] = useState(false);
  const proxyDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (proxyDropdownRef.current && !proxyDropdownRef.current.contains(e.target)) {
        setIsAddProxyDropdownOpen(false);
      }
    };
    if (isAddProxyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAddProxyDropdownOpen]);

  // Add Rotating Proxy Form Modal
  const [showAddRotatingModal, setShowAddRotatingModal] = useState(false);
  const [rotatingFormData, setRotatingFormData] = useState({
    name: '',
    provider: 'TMProxy',
    rotateUrl: '',
    protocol: 'HTTP',
    cooldown: 60
  });

  // Add DCOM Modal
  const [showAddDcomModal, setShowAddDcomModal] = useState(false);
  const [dcomFormData, setDcomFormData] = useState({
    name: 'Huawei E3372 4G #1',
    comPort: 'COM3',
    localPort: 20001,
    carrier: 'Viettel 4G'
  });

  // IPv6 Subnet Generator Form
  const [ipv6Config, setIpv6Config] = useState({
    prefix: '2402:800:6000:a1b2::/64',
    count: 20,
    startPort: 20000,
    userPrefix: 'ipv6_user',
    customPass: 'secure_pass123'
  });

  // Copy helper
  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast?.('Đã sao chép vào clipboard');
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Toggle show password
  const toggleShowPassword = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered Proxies list
  const filteredProxies = useMemo(() => {
    return proxies.filter(p => {
      if (protocolFilter !== 'ALL' && p.type !== protocolFilter) return false;
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
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
  const handleCheckSingle = async (p, e) => {
    e?.stopPropagation();
    setTestingId(p.id);
    await checkProxy(p.id);
    setTestingId(null);
  };

  // Check all proxies
  const handleCheckAll = async () => {
    setIsCheckingAll(true);
    await checkAllProxies();
    setIsCheckingAll(false);
  };

  // Flexible proxy string parser supporting IPv4/IPv6, protocol prefixes, auth formats
  const parseProxyFlexible = (raw) => {
    if (!raw || typeof raw !== 'string') return null;
    let str = raw.trim();
    let detectedType = null;
    let detectedIpVersion = 'IPv4';

    if (/^socks5:\/\//i.test(str)) {
      detectedType = 'SOCKS5';
      str = str.replace(/^socks5:\/\//i, '');
    } else if (/^socks4:\/\//i.test(str)) {
      detectedType = 'SOCKS4';
      str = str.replace(/^socks4:\/\//i, '');
    } else if (/^https:\/\//i.test(str)) {
      detectedType = 'HTTPS';
      str = str.replace(/^https:\/\//i, '');
    } else if (/^http:\/\//i.test(str)) {
      detectedType = 'HTTP';
      str = str.replace(/^http:\/\//i, '');
    }

    let host = '', port = 1080, user = '', pass = '';

    // Handle IPv6 bracket notation [2402:...]:1080
    if (str.startsWith('[')) {
      detectedIpVersion = 'IPv6';
      const closeIdx = str.indexOf(']');
      if (closeIdx !== -1) {
        host = str.substring(1, closeIdx);
        const rest = str.substring(closeIdx + 1);
        if (rest.startsWith(':')) {
          const parts = rest.substring(1).split(':');
          port = Number(parts[0]) || 1080;
          if (parts.length >= 3) {
            user = parts[1];
            pass = parts.slice(2).join(':');
          }
        }
      }
    } else if (str.includes('@')) {
      const [auth, hostPort] = str.split('@');
      const authParts = auth.split(':');
      user = authParts[0] || '';
      pass = authParts.slice(1).join(':') || '';

      const hpParts = hostPort.split(':');
      host = hpParts[0];
      port = Number(hpParts[1]) || 1080;
    } else {
      const parts = str.split(':');
      if (parts.length === 2) {
        host = parts[0];
        port = Number(parts[1]) || 1080;
      } else if (parts.length >= 4) {
        host = parts[0];
        port = Number(parts[1]) || 1080;
        user = parts[2];
        pass = parts.slice(3).join(':');
      } else {
        host = parts[0];
      }
    }

    if (host.includes(':')) {
      detectedIpVersion = 'IPv6';
    }

    return { host, port, user, pass, type: detectedType, ipVersion: detectedIpVersion };
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      type: 'SOCKS5',
      ipVersion: 'IPv4',
      host: '',
      port: 1080,
      user: '',
      pass: '',
      country: '',
      name: ''
    });
    setQuickParseInput('');
    setShowPasswordInModal(false);
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
      ipVersion: p.ipVersion || (p.host?.includes(':') ? 'IPv6' : 'IPv4'),
      host: p.host || '',
      port: p.port || 1080,
      user: p.user || '',
      pass: p.pass || '',
      country: p.country || '',
      name: p.name || ''
    });
    setQuickParseInput('');
    setShowPasswordInModal(false);
    setFormError('');
    setTestResultInModal(null);
    setModalMode('edit');
  };

  // Paste single proxy from clipboard
  const handlePasteSingleProxy = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        showToast?.('Clipboard trống, không có dữ liệu proxy!');
        return;
      }
      const parsed = parseProxyFlexible(text.trim());
      if (parsed && parsed.host) {
        setFormData(prev => ({
          ...prev,
          host: parsed.host,
          port: parsed.port || prev.port,
          user: parsed.user || '',
          pass: parsed.pass || '',
          type: parsed.type || prev.type,
          ipVersion: parsed.ipVersion || (parsed.host.includes(':') ? 'IPv6' : prev.ipVersion)
        }));
        setFormError('');
        showToast?.('Đã dán và tự động điền proxy thành công!');
      } else {
        setFormData(prev => ({ ...prev, host: text.trim() }));
        showToast?.('Đã dán chuỗi vào ô Host!');
      }
    } catch (err) {
      showToast?.('Không thể đọc từ clipboard: ' + (err.message || ''));
    }
  };

  // Handle Ctrl+V directly on Host input
  const handleHostPaste = (e) => {
    const pastedText = e.clipboardData?.getData('text');
    if (pastedText && pastedText.includes(':')) {
      const parsed = parseProxyFlexible(pastedText.trim());
      if (parsed && parsed.host && parsed.port) {
        e.preventDefault();
        setFormData(prev => ({
          ...prev,
          host: parsed.host,
          port: parsed.port || prev.port,
          user: parsed.user || '',
          pass: parsed.pass || '',
          type: parsed.type || prev.type,
          ipVersion: parsed.ipVersion || (parsed.host.includes(':') ? 'IPv6' : prev.ipVersion)
        }));
        setFormError('');
        showToast?.('Đã tự động nhận diện và điền các trường proxy!');
      }
    }
  };

  // Choose file for single proxy
  const handleSingleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result || '';
      const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) {
        showToast?.('File trống!');
        return;
      }
      const parsed = parseProxyFlexible(lines[0]);
      if (parsed && parsed.host) {
        setFormData(prev => ({
          ...prev,
          host: parsed.host,
          port: parsed.port || prev.port,
          user: parsed.user || '',
          pass: parsed.pass || '',
          type: parsed.type || prev.type,
          ipVersion: parsed.ipVersion || (parsed.host.includes(':') ? 'IPv6' : prev.ipVersion)
        }));
        setFormError('');
        showToast?.(`Đã tải proxy từ file "${file.name}"!`);
      } else {
        showToast?.('Không nhận diện được định dạng proxy trong file!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Paste into bulk textarea
  const handlePasteBulk = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        showToast?.('Clipboard trống!');
        return;
      }
      setBulkText(prev => prev ? `${prev}\n${text.trim()}` : text.trim());
      showToast?.('Đã dán danh sách proxy từ clipboard!');
    } catch (err) {
      showToast?.('Không thể đọc clipboard: ' + (err.message || ''));
    }
  };

  // Choose file for bulk import
  const handleBulkFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result || '';
      setBulkText(content.trim());
      showToast?.(`Đã nạp file "${file.name}"!`);
    };
    reader.readAsText(file);
    e.target.value = '';
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
        ipVersion: formData.ipVersion || (host.includes(':') ? 'IPv6' : 'IPv4'),
        country: (formData.country || '').toUpperCase()
      });
      showToast?.('Thêm proxy mới thành công');
    } else if (modalMode === 'edit' && currentEditingProxy) {
      editProxy(currentEditingProxy.id, {
        ...formData,
        host,
        port,
        user: formData.user.trim(),
        pass: formData.pass.trim(),
        ipVersion: formData.ipVersion || (host.includes(':') ? 'IPv6' : 'IPv4'),
        country: (formData.country || '').toUpperCase()
      });
      showToast?.('Cập nhật proxy thành công');
    }

    setModalMode(null);
  };

  // Test connection within modal
  const handleTestInModal = async () => {
    if (!formData.host.trim()) {
      setFormError('Vui lòng nhập địa chỉ Host/IP để kiểm tra!');
      return;
    }
    setFormError('');
    setTestResultInModal({ status: 'testing', message: 'Đang kết nối socket & định vị quốc gia...' });

    const res = await testProxyConnection(formData);
    const isOk = res.status === 'live';

    if (isOk && res.country) {
      setFormData(prev => ({ ...prev, country: res.country }));
    }

    setTestResultInModal({
      status: isOk ? 'success' : 'error',
      latency: res.latency,
      country: res.country || formData.country || '',
      ip: isOk ? formData.host : null,
      message: res.message || (isOk ? `Kết nối thành công (${res.latency}ms)` : 'Không thể kết nối đến máy chủ Proxy!')
    });
  };

  // Bulk Import submit
  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (!bulkText.trim()) {
      showToast?.('Vui lòng nhập danh sách proxy!');
      return;
    }
    const count = bulkImportProxies(bulkText, bulkType, '', bulkIpVersion);
    setShowBulkModal(false);
    setBulkText('');
    showToast?.(`Đã nhập thành công ${count} proxy vào kho!`);
  };

  // Count lines in bulk text
  const bulkLineCount = useMemo(() => {
    return bulkText.split('\n').map(l => l.trim()).filter(Boolean).length;
  }, [bulkText]);

  // Assign Proxy to Profile
  const handleAssignToProfile = () => {
    if (!assignModalProxy || !selectedTargetProfileId) return;
    const targetProfile = profiles.find(p => p.id === selectedTargetProfileId);
    if (!targetProfile) return;

    // Gán proxy vào profile thông qua localStorage / update
    const updatedProfiles = profiles.map(p => {
      if (p.id === selectedTargetProfileId) {
        return {
          ...p,
          proxy: {
            type: assignModalProxy.type,
            host: assignModalProxy.host,
            port: assignModalProxy.port,
            user: assignModalProxy.user,
            pass: assignModalProxy.pass,
            country: assignModalProxy.country
          }
        };
      }
      return p;
    });

    localStorage.setItem('antidetect_profiles', JSON.stringify(updatedProfiles));
    addLog?.(`Đã gán proxy ${assignModalProxy.host}:${assignModalProxy.port} vào hồ sơ "${targetProfile.title}"`, 'success');
    showToast?.(`Đã gán proxy thành công vào hồ sơ "${targetProfile.title}"`);
    setAssignModalProxy(null);
    setSelectedTargetProfileId('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
        backgroundColor: '#FFFFFF',
        color: 'var(--apidog-text-main, #1E293B)',
        fontFamily: 'inherit',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP INTEGRATED HEADER & SUB-TABS (Matches Profiles / Extensions)
         ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid var(--apidog-border, #E2E8F0)',
          backgroundColor: '#FFFFFF',
          minHeight: '48px',
          flexShrink: 0,
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Left Side: Module Title + Sub-Tabs Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Brand/Title indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#EDE9FE',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Shield size={16} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.2px' }}>
              Quản lý Proxy
            </span>
          </div>

          <span style={{ color: '#E2E8F0', height: '16px', width: '1px', backgroundColor: '#CBD5E1' }} />

          {/* Sub-Tabs: Pool | Rotating | DCOM | IPv6 | Rules */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Tab 1: Proxy Tĩnh */}
            <button
              onClick={() => setActiveSubTab('pool')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeSubTab === 'pool' ? '#F1F5F9' : 'transparent',
                color: activeSubTab === 'pool' ? '#7C3AED' : '#64748B',
                fontSize: '12px',
                fontWeight: activeSubTab === 'pool' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Globe size={13} />
              <span>Proxy tĩnh</span>
              <span
                style={{
                  fontSize: '10.5px',
                  padding: '1px 5px',
                  borderRadius: '10px',
                  backgroundColor: activeSubTab === 'pool' ? '#EDE9FE' : '#E2E8F0',
                  color: activeSubTab === 'pool' ? '#7C3AED' : '#475569',
                  fontWeight: 600
                }}
              >
                {totalCount}
              </span>
            </button>

            {/* Tab 2: Proxy Xoay */}
            <button
              onClick={() => setActiveSubTab('rotating')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeSubTab === 'rotating' ? '#F1F5F9' : 'transparent',
                color: activeSubTab === 'rotating' ? '#7C3AED' : '#64748B',
                fontSize: '12px',
                fontWeight: activeSubTab === 'rotating' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <RotateCw size={13} />
              <span>Proxy xoay (API)</span>
              <span
                style={{
                  fontSize: '10.5px',
                  padding: '1px 5px',
                  borderRadius: '10px',
                  backgroundColor: activeSubTab === 'rotating' ? '#EDE9FE' : '#E2E8F0',
                  color: activeSubTab === 'rotating' ? '#7C3AED' : '#475569',
                  fontWeight: 600
                }}
              >
                {rotatingProxies.length}
              </span>
            </button>

            {/* Tab 3: DCOM 4G/5G */}
            <button
              onClick={() => setActiveSubTab('dcom')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeSubTab === 'dcom' ? '#F1F5F9' : 'transparent',
                color: activeSubTab === 'dcom' ? '#7C3AED' : '#64748B',
                fontSize: '12px',
                fontWeight: activeSubTab === 'dcom' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Smartphone size={13} />
              <span>DCOM 4G/5G</span>
              <span
                style={{
                  fontSize: '10.5px',
                  padding: '1px 5px',
                  borderRadius: '10px',
                  backgroundColor: activeSubTab === 'dcom' ? '#EDE9FE' : '#E2E8F0',
                  color: activeSubTab === 'dcom' ? '#7C3AED' : '#475569',
                  fontWeight: 600
                }}
              >
                {dcomDevices.length}
              </span>
            </button>

            {/* Tab 4: Sinh IPv6 */}
            <button
              onClick={() => setActiveSubTab('ipv6')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeSubTab === 'ipv6' ? '#F1F5F9' : 'transparent',
                color: activeSubTab === 'ipv6' ? '#7C3AED' : '#64748B',
                fontSize: '12px',
                fontWeight: activeSubTab === 'ipv6' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Cpu size={13} />
              <span>Sinh IPv6 /64</span>
            </button>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {activeSubTab === 'pool' && (
            <>
              {/* Check All Button */}
              <button
                onClick={handleCheckAll}
                disabled={isCheckingAll}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  height: '30px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: isCheckingAll ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <RefreshCw size={12} className={isCheckingAll ? 'spin-anim' : ''} />
                <span>{isCheckingAll ? 'Đang test ping...' : 'Kiểm tra Ping'}</span>
              </button>

              {/* Bulk Import Button */}
              <button
                onClick={() => setShowBulkModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  height: '30px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Upload size={12} />
                <span>Nhập hàng loạt</span>
              </button>

              {/* Split Button: Thêm Proxy + Dropdown Chevron */}
              <div ref={proxyDropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={handleOpenAddModal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    height: '30px',
                    padding: '0 10px 0 12px',
                    borderTopLeftRadius: '6px',
                    borderBottomLeftRadius: '6px',
                    borderTopRightRadius: '0',
                    borderBottomRightRadius: '0',
                    border: 'none',
                    backgroundColor: '#7C3AED',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(124, 58, 237, 0.25)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6D28D9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7C3AED'}
                  title="Thêm Proxy mới"
                >
                  <Plus size={14} />
                  <span>Thêm Proxy</span>
                </button>

                {/* Vertical Divider */}
                <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

                {/* Dropdown Chevron Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddProxyDropdownOpen(prev => !prev);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '30px',
                    width: '24px',
                    borderTopRightRadius: '6px',
                    borderBottomRightRadius: '6px',
                    borderTopLeftRadius: '0',
                    borderBottomLeftRadius: '0',
                    border: 'none',
                    backgroundColor: isAddProxyDropdownOpen ? '#6D28D9' : '#7C3AED',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(124, 58, 237, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6D28D9'}
                  onMouseLeave={(e) => {
                    if (!isAddProxyDropdownOpen) e.currentTarget.style.backgroundColor = '#7C3AED';
                  }}
                  title="Tùy chọn thêm Proxy"
                >
                  <ChevronDown
                    size={12}
                    style={{
                      transform: isAddProxyDropdownOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.18s ease'
                    }}
                  />
                </button>

                {/* Dropdown Menu */}
                {isAddProxyDropdownOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      right: 0,
                      width: '250px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
                      padding: '5px',
                      zIndex: 1000,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      animation: 'fadeIn 0.12s ease-out'
                    }}
                  >
                    {/* Option 1: Thêm proxy đơn */}
                    <div
                      onClick={() => {
                        setIsAddProxyDropdownOpen(false);
                        handleOpenAddModal();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.12s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: '#EDE9FE',
                        color: '#7C3AED',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Plus size={14} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>Thêm proxy đơn</span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Nhập thủ công IP, Port, User, Pass</span>
                      </div>
                    </div>

                    {/* Option 2: Nhập proxy hàng loạt */}
                    <div
                      onClick={() => {
                        setIsAddProxyDropdownOpen(false);
                        setShowBulkModal(true);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.12s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: '#E0F2FE',
                        color: '#0284C7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Upload size={14} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>Nhập proxy hàng loạt</span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Dán danh sách định dạng IP:Port...</span>
                      </div>
                    </div>

                    <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '3px 0' }} />

                    {/* Option 3: Sinh dải IPv6 /64 */}
                    <div
                      onClick={() => {
                        setIsAddProxyDropdownOpen(false);
                        setActiveSubTab('ipv6');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.12s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: '#DCFCE7',
                        color: '#16A34A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Cpu size={14} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>Sinh dải IPv6 /64</span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Tự động sinh dải IP proxy IPv6</span>
                      </div>
                    </div>

                    {/* Option 4: Thêm proxy xoay */}
                    <div
                      onClick={() => {
                        setIsAddProxyDropdownOpen(false);
                        setActiveSubTab('rotating');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.12s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: '#FFEDD5',
                        color: '#EA580C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <RotateCw size={14} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>Thêm proxy xoay (Rotating)</span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Đổi IP qua link API hoặc thời gian</span>
                      </div>
                    </div>

                    {/* Option 5: Thêm thiết bị DCOM 4G */}
                    <div
                      onClick={() => {
                        setIsAddProxyDropdownOpen(false);
                        setActiveSubTab('dcom');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.12s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: '#F3E8FF',
                        color: '#9333EA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Smartphone size={14} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>Thêm DCOM 4G/5G</span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>Đổi IP qua sim 4G Huawei/ZTE</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeSubTab === 'rotating' && (
            <button
              onClick={() => setShowAddRotatingModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                height: '30px',
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
              <Plus size={14} />
              <span>Thêm Proxy Xoay</span>
            </button>
          )}

          {activeSubTab === 'dcom' && (
            <button
              onClick={() => setShowAddDcomModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                height: '30px',
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
              <Plus size={14} />
              <span>Kết nối DCOM mới</span>
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FILTER & SEARCH TOOLBAR (For Static Pool view)
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'pool' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            flexShrink: 0,
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          {/* Left: Search box + Protocol dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Search Box */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                padding: '0 8px',
                height: '28px',
                width: '240px'
              }}
            >
              <Search size={13} style={{ color: '#94A3B8', marginRight: '6px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Tìm theo Host, Port, Quốc gia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '12px',
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: '#1E293B'
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Protocol Filter */}
            <select
              value={protocolFilter}
              onChange={(e) => setProtocolFilter(e.target.value)}
              style={{
                height: '28px',
                padding: '0 8px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '11.5px',
                color: '#334155',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="ALL">Tất cả giao thức</option>
              <option value="SOCKS5">SOCKS5</option>
              <option value="HTTP">HTTP</option>
              <option value="HTTPS">HTTPS</option>
            </select>
          </div>

          {/* Right: Selected count indicator + Status Filter (Live/Die/All) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {selectedProxyIds.length > 0 && (
              <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                Đã chọn <strong style={{ color: '#7C3AED' }}>{selectedProxyIds.length}</strong> / {filteredProxies.length} proxy
              </div>
            )}

            {/* Status Filter Segmented Button */}
            <div style={{ display: 'flex', backgroundColor: '#E2E8F0', borderRadius: '6px', padding: '2px', gap: '2px' }}>
              <button
                onClick={() => setStatusFilter('ALL')}
                style={{
                  padding: '3px 9px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: statusFilter === 'ALL' ? 600 : 500,
                  backgroundColor: statusFilter === 'ALL' ? '#FFFFFF' : 'transparent',
                  color: statusFilter === 'ALL' ? '#1E293B' : '#64748B',
                  cursor: 'pointer',
                  boxShadow: statusFilter === 'ALL' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
                  transition: 'all 0.12s'
                }}
              >
                Tất cả ({totalCount})
              </button>
              <button
                onClick={() => setStatusFilter('live')}
                style={{
                  padding: '3px 9px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: statusFilter === 'live' ? 600 : 500,
                  backgroundColor: statusFilter === 'live' ? '#FFFFFF' : 'transparent',
                  color: statusFilter === 'live' ? '#059669' : '#64748B',
                  cursor: 'pointer',
                  boxShadow: statusFilter === 'live' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
                  transition: 'all 0.12s'
                }}
              >
                ● Hoạt động ({liveCount})
              </button>
              <button
                onClick={() => setStatusFilter('die')}
                style={{
                  padding: '3px 9px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: statusFilter === 'die' ? 600 : 500,
                  backgroundColor: statusFilter === 'die' ? '#FFFFFF' : 'transparent',
                  color: statusFilter === 'die' ? '#DC2626' : '#64748B',
                  cursor: 'pointer',
                  boxShadow: statusFilter === 'die' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
                  transition: 'all 0.12s'
                }}
              >
                ● Lỗi / Chết ({dieCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT BODY ACCORDING TO SUB-TAB
         ───────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* ── TAB 1: KHO PROXY TĨNH (STATIC POOL TABLE) ── */}
        {activeSubTab === 'pool' && (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {isCheckingAll ? (
              <div style={{ padding: '24px 20px', backgroundColor: '#FFFFFF' }}>
                <SkeletonLoader type="lines" count={4} />
              </div>
            ) : filteredProxies.length === 0 ? (
              /* Empty State */
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 20px',
                  color: '#64748B'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    color: '#94A3B8'
                  }}
                >
                  <Shield size={28} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>
                  {searchTerm ? 'Không tìm thấy proxy nào phù hợp' : 'Kho Proxy đang trống'}
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '14px', maxWidth: '340px', textAlign: 'center' }}>
                  {searchTerm
                    ? 'Hãy kiểm tra lại từ khóa hoặc chuyển đổi bộ lọc trạng thái để tìm lại.'
                    : 'Thêm proxy mới hoặc nhập hàng loạt để cấp mạng cho các hồ sơ trình duyệt.'}
                </div>
                <button
                  onClick={handleOpenAddModal}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    backgroundColor: '#7C3AED',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + Thêm Proxy Đầu Tiên
                </button>
              </div>
            ) : (
              /* High-Density Screenshot-Aligned Data Table */
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderBottom: '1px solid #E2E8F0',
                      color: '#475569',
                      fontSize: '12px',
                      fontWeight: 600,
                      position: 'sticky',
                      top: 0,
                      zIndex: 10
                    }}
                  >
                    <th style={{ width: '38px', padding: '12px 14px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        style={{ cursor: 'pointer' }}
                      />
                    </th>
                    <th style={{ padding: '12px 14px', width: '280px' }}>Proxy Info</th>
                    <th style={{ padding: '12px 14px', width: '200px' }}>Outbound IP</th>
                    <th style={{ padding: '12px 14px', width: '90px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span>Notes</span>
                        <button
                          type="button"
                          onClick={() => setShowNoteText(!showNoteText)}
                          title={showNoteText ? "Chuyển thành dạng biểu tượng" : "Hiển thị chữ ghi chú"}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            color: showNoteText ? '#7C3AED' : '#94A3B8',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    </th>
                    <th style={{ padding: '12px 14px', width: '160px' }}>IP Query Channel</th>
                    <th style={{ padding: '12px 14px', width: '150px' }}>Related Profiles</th>
                    <th style={{ width: '140px', padding: '12px 14px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProxies.map((p) => {
                    const isSelected = selectedProxyIds.includes(p.id);
                    const isTesting = testingId === p.id;
                    const isLive = p.status === 'live';
                    const isDie = p.status === 'die';
                    const assignedProfiles = profiles.filter(prof => prof.proxy?.host === p.host && Number(prof.proxy?.port) === Number(p.port));
                    const assignedProfilesCount = assignedProfiles.length;
                    const proxyUrl = `${(p.type || 'socks5').toLowerCase()}://${p.host}:${p.port}`;
                    const ipTypeDisplay = (p.ipVersion || 'IPV4').toUpperCase();
                    const noteContent = p.name || p.notes || '';

                    return (
                      <tr
                        key={p.id}
                        style={{
                          borderBottom: '1px solid #F1F5F9',
                          backgroundColor: isSelected ? '#F5F3FF' : '#FFFFFF',
                          transition: 'background-color 0.12s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = '#FAFAFC';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }}
                      >
                        {/* 1. Checkbox */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(p.id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>

                        {/* 2. Proxy Info (dùng font mặc định đồng bộ với Outbound IP) */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#0F172A',
                                letterSpacing: '-0.1px'
                              }}
                            >
                              {proxyUrl}
                            </span>
                            <button
                              onClick={() => handleCopy(proxyUrl, `pi-${p.id}`)}
                              title="Sao chép Proxy"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: copiedId === `pi-${p.id}` ? '#10B981' : '#94A3B8',
                                cursor: 'pointer',
                                padding: '2px',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}
                            >
                              {copiedId === `pi-${p.id}` ? <Check size={12} /> : <Copy size={12} />}
                            </button>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                            <span style={{ fontWeight: 500 }}>{ipTypeDisplay}</span>
                            <span style={{ color: '#CBD5E1' }}>|</span>
                            <span style={{ color: p.user ? '#64748B' : '#94A3B8' }}>{p.user || p.name || '--'}</span>
                          </div>
                        </td>

                        {/* 3. Outbound IP */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Globe Icon với gạch chéo đỏ khi die */}
                            <div
                              style={{
                                position: 'relative',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: isTesting ? '#F1F5F9' : isLive ? '#EFF6FF' : isDie ? '#FEF2F2' : '#F1F5F9',
                                color: isTesting ? '#64748B' : isLive ? '#2563EB' : isDie ? '#EF4444' : '#94A3B8',
                                border: isTesting ? '1px solid #E2E8F0' : isLive ? '1px solid #BFDBFE' : isDie ? '1px solid #FECACA' : '1px solid #E2E8F0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              <Globe size={15} />
                              {isDie && (
                                /* Gạch chéo màu đỏ xuyên qua quả địa cầu */
                                <div
                                  style={{
                                    position: 'absolute',
                                    width: '18px',
                                    height: '2px',
                                    backgroundColor: '#EF4444',
                                    transform: 'rotate(-45deg)',
                                    borderRadius: '1px'
                                  }}
                                />
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {isTesting ? (
                                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#3B82F6' }}>Đang kiểm tra...</span>
                                ) : isLive ? (
                                  <>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>
                                      {p.outboundIp || p.host}
                                    </span>
                                    {p.country && (
                                      <CountryFlag code={p.country} width={15} height={10} />
                                    )}
                                  </>
                                ) : isDie ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#DC2626' }}>
                                      Mất kết nối
                                    </span>
                                    <span
                                      style={{
                                        fontSize: '9.5px',
                                        padding: '1px 5px',
                                        borderRadius: '4px',
                                        backgroundColor: '#FEE2E2',
                                        color: '#DC2626',
                                        fontWeight: 700
                                      }}
                                    >
                                      DIE
                                    </span>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748B' }}>--</span>
                                )}
                              </div>
                              {/* Dòng dưới: Vị trí địa lý và Tốc độ ping (ms) */}
                              <div style={{ fontSize: '11px', marginTop: '1px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {isTesting ? (
                                  <span style={{ color: '#94A3B8' }}>Đang đo ping...</span>
                                ) : isLive ? (
                                  <>
                                    <span style={{ color: '#94A3B8' }}>
                                      {p.country ? `${p.country} | ${p.city || p.region || '--'}` : '-- | --'}
                                    </span>
                                    {p.latency != null && (
                                      <>
                                        <span style={{ color: '#CBD5E1' }}>•</span>
                                        <span style={{ color: '#059669', fontWeight: 600 }}>{p.latency}ms</span>
                                      </>
                                    )}
                                  </>
                                ) : isDie ? (
                                  <span style={{ color: '#EF4444' }}>Không thể kết nối máy chủ</span>
                                ) : (
                                  <span style={{ color: '#94A3B8' }}>-- | --</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 4. Notes 👁 */}
                        <td style={{ padding: '12px 14px' }}>
                          {showNoteText ? (
                            <div
                              onClick={() => handleOpenNoteModal(p)}
                              title="Nhấp để sửa ghi chú"
                              style={{
                                fontSize: '12px',
                                color: noteContent ? '#334155' : '#94A3B8',
                                cursor: 'pointer',
                                maxWidth: '120px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {noteContent || '--'}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenNoteModal(p)}
                              title={noteContent || 'Nhấp để xem/thêm ghi chú'}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: noteContent ? '#7C3AED' : '#94A3B8',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '4px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                transition: 'all 0.15s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#7C3AED'}
                              onMouseLeave={(e) => e.currentTarget.style.color = noteContent ? '#7C3AED' : '#94A3B8'}
                            >
                              <FileText size={16} />
                            </button>
                          )}
                        </td>

                        {/* 5. IP Query Channel */}
                        <td style={{ padding: '12px 14px' }}>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 9px',
                              borderRadius: '6px',
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              color: '#475569',
                              fontSize: '11.5px',
                              fontWeight: 500
                            }}
                          >
                            <User size={12} style={{ color: '#64748B' }} />
                            <span>{p.queryChannel || ipQueryChannel || 'IPRust.io'}</span>
                          </div>
                        </td>

                        {/* 6. Related Profiles */}
                        <td style={{ padding: '12px 14px' }}>
                          {assignedProfilesCount > 0 ? (
                            <button
                              type="button"
                              onClick={() => setAssignModalProxy(p)}
                              title="Nhấp để xem/gán thêm hồ sơ"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: '#EFF6FF',
                                color: '#2563EB',
                                border: '1px solid #BFDBFE',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              {assignedProfilesCount} hồ sơ
                            </button>
                          ) : (
                            <span style={{ color: '#94A3B8', fontSize: '13px' }}>--</span>
                          )}
                        </td>

                        {/* 7. Action: 4 icons (Edit, Assign/Radio, Refresh, Delete) */}
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                            {/* Icon 1: Edit */}
                            <button
                              type="button"
                              onClick={(e) => handleOpenEditModal(p, e)}
                              title="Chỉnh sửa Proxy"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#64748B',
                                cursor: 'pointer',
                                padding: '5px',
                                borderRadius: '5px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                transition: 'all 0.12s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#0F172A'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
                            >
                              <Pencil size={14} />
                            </button>

                            {/* Icon 2: Assign / Radio */}
                            <button
                              type="button"
                              onClick={() => setAssignModalProxy(p)}
                              title="Gán proxy vào hồ sơ trình duyệt"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#64748B',
                                cursor: 'pointer',
                                padding: '5px',
                                borderRadius: '5px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                transition: 'all 0.12s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#7C3AED'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
                            >
                              <Radio size={14} />
                            </button>

                            {/* Icon 3: Refresh / Ping */}
                            <button
                              type="button"
                              onClick={(e) => handleCheckSingle(p, e)}
                              disabled={isTesting}
                              title="Kiểm tra ping Proxy"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#64748B',
                                cursor: isTesting ? 'not-allowed' : 'pointer',
                                padding: '5px',
                                borderRadius: '5px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                transition: 'all 0.12s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#0284C7'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
                            >
                              <RotateCw size={14} className={isTesting ? 'spin-anim' : ''} />
                            </button>

                            {/* Icon 4: Delete */}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm({ type: 'single', proxy: p })}
                              title="Xóa Proxy"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#64748B',
                                cursor: 'pointer',
                                padding: '5px',
                                borderRadius: '5px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                transition: 'all 0.12s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
                            >
                              <Trash2 size={14} />
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

            {/* ── FLOATING BATCH ACTION BAR (Pinned firmly to bottom) ── */}
            {selectedProxyIds.length > 0 && (
              <div
                style={{
                  flexShrink: 0,
                  width: '100%',
                  padding: '11px 24px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.25)',
                  zIndex: 20,
                  boxSizing: 'border-box',
                  animation: 'fadeInModal 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 600 }}>
                    Đã chọn {selectedProxyIds.length} proxy
                  </span>
                  <button
                    onClick={() => setSelectedProxyIds([])}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Bỏ chọn
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => {
                      selectedProxyIds.forEach(id => checkProxy(id));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 12px',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={12} />
                    <span>Ping đã chọn</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirm({ type: 'multiple', count: selectedProxyIds.length })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 12px',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={12} />
                    <span>Xóa ({selectedProxyIds.length})</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: PROXY XOAY (ROTATING PROXIES VIA API) ── */}
        {activeSubTab === 'rotating' && (
          <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                Quản Lý Proxy Xoay (Rotating Proxy API)
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                Cấu hình link API đổi IP tự động của các nhà cung cấp (TMProxy, TinProxy, ProxyNo1, v.v.). Hỗ trợ đếm ngược cooldown và kích hoạt đổi IP tức thì cho profile.
              </p>
            </div>

            {rotatingProxies.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#94A3B8' }}>
                <RotateCw size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Chưa có cấu hình Proxy Xoay nào</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Nhấn nút "+ Thêm Proxy Xoay" ở góc trên để cấu hình API đổi IP.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
                {rotatingProxies.map((rot) => (
                  <div
                    key={rot.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      padding: '14px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                        {rot.name}
                      </span>
                      <span
                        style={{
                          fontSize: '10.5px',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#EDE9FE',
                          color: '#7C3AED',
                          fontWeight: 600
                        }}
                      >
                        {rot.provider || 'API Gateway'}
                      </span>
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#475569', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ color: '#94A3B8' }}>IP hiện tại:</span>
                        <strong style={{ fontFamily: 'monospace', color: '#059669' }}>{rot.currentIp || '14.162.88.12'}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ color: '#94A3B8' }}>Lần đổi cuối:</span>
                        <span>{rot.lastRotated || 'Vừa xong'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#94A3B8' }}>Thời gian chờ (Cooldown):</span>
                        <span>{rot.cooldown || 60} giây</span>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '6px 8px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '4px',
                        border: '1px solid #E2E8F0',
                        fontSize: '11px',
                        color: '#64748B',
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '10px'
                      }}
                      title={rot.rotateUrl}
                    >
                      {rot.rotateUrl || 'https://api.tmproxy.com/api/proxy/change-ip'}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <button
                        onClick={() => triggerRotateProxy(rot.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#7C3AED',
                          color: '#FFFFFF',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <RotateCw size={12} />
                        <span>Xoay IP ngay</span>
                      </button>

                      <button
                        onClick={() => deleteRotatingProxy(rot.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          padding: '4px 6px'
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: THIẾT BỊ DCOM 4G/5G ── */}
        {activeSubTab === 'dcom' && (
          <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                Quản Lý Thiết Bị DCOM 4G/5G (USB Dongle)
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                Kết nối USB 4G vật lý cắm trực tiếp vào máy tính. Hỗ trợ tự động chuyển chế độ máy bay (Airplane Mode toggle) để đổi dải IP WAN sạch từ nhà mạng.
              </p>
            </div>

            {dcomDevices.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#94A3B8' }}>
                <Smartphone size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Chưa có thiết bị DCOM nào được kết nối</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Cắm USB 4G vào cổng máy tính và nhấn "Kết nối DCOM mới".</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
                {dcomDevices.map((dcom) => (
                  <div
                    key={dcom.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      padding: '14px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Smartphone size={16} style={{ color: '#2563EB' }} />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                          {dcom.name}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '10.5px',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#ECFDF5',
                          color: '#059669',
                          fontWeight: 600
                        }}
                      >
                        Đã kết nối
                      </span>
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#475569', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ color: '#94A3B8' }}>Cổng COM / Local:</span>
                        <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                          {dcom.comPort} (127.0.0.1:{dcom.localPort || 20001})
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ color: '#94A3B8' }}>Nhà mạng:</span>
                        <span>{dcom.carrier || 'Viettel 4G LTE'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#94A3B8' }}>IP WAN nhà mạng:</span>
                        <strong style={{ fontFamily: 'monospace', color: '#2563EB' }}>
                          {dcom.wanIp || '171.244.18.92'}
                        </strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <button
                        onClick={() => triggerDcomRotate(dcom.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#2563EB',
                          color: '#FFFFFF',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <RefreshCw size={12} />
                        <span>Reset máy bay (Đổi IP)</span>
                      </button>

                      <button
                        onClick={() => deleteDcomDevice(dcom.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          fontSize: '11.5px',
                          cursor: 'pointer'
                        }}
                      >
                        Ngắt kết nối
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: SINH IPV6 SUBNET /64 ── */}
        {activeSubTab === 'ipv6' && (
          <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                Trình Tạo Proxy IPv6 Subnet /64 Tự Động
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                Nhập dải prefix IPv6 (ví dụ: từ VPS Viettel, OVH, Hetzner) để hệ thống tự động sinh hàng nghìn địa chỉ IPv6 tĩnh kèm Port và Auth riêng biệt.
              </p>
            </div>

            <div style={{ maxWidth: '640px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    IPv6 Prefix Subnet
                  </label>
                  <input
                    type="text"
                    value={ipv6Config.prefix}
                    onChange={(e) => setIpv6Config({ ...ipv6Config, prefix: e.target.value })}
                    placeholder="2402:800:6000:a1b2::/64"
                    style={{ width: '100%', height: '30px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px', fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Số lượng Proxy muốn sinh
                  </label>
                  <input
                    type="number"
                    value={ipv6Config.count}
                    onChange={(e) => setIpv6Config({ ...ipv6Config, count: Number(e.target.value) })}
                    min={1}
                    max={500}
                    style={{ width: '100%', height: '30px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Cổng Port bắt đầu (Start Port)
                  </label>
                  <input
                    type="number"
                    value={ipv6Config.startPort}
                    onChange={(e) => setIpv6Config({ ...ipv6Config, startPort: Number(e.target.value) })}
                    style={{ width: '100%', height: '30px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px', fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Tài khoản / Mật khẩu Auth
                  </label>
                  <input
                    type="text"
                    value={ipv6Config.customPass}
                    onChange={(e) => setIpv6Config({ ...ipv6Config, customPass: e.target.value })}
                    placeholder="Mật khẩu proxy"
                    style={{ width: '100%', height: '30px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => generateIpv6Batch(ipv6Config)}
                  style={{
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
                  ⚡ Tạo {ipv6Config.count} Proxy IPv6
                </button>

                {generatedIpv6List.length > 0 && (
                  <button
                    onClick={() => {
                      addGeneratedIpv6ToPool();
                      showToast?.(`Đã thêm ${generatedIpv6List.length} proxy IPv6 vào kho chính!`);
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#059669',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    + Nhập toàn bộ vào kho Proxy chính
                  </button>
                )}
              </div>
            </div>

            {/* Generated list preview */}
            {generatedIpv6List.length > 0 && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#1E293B' }}>
                  Danh sách đã sinh ({generatedIpv6List.length} proxy):
                </div>
                <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F1F5F9', color: '#475569', textAlign: 'left' }}>
                        <th style={{ padding: '6px 10px' }}>IPv6 Host</th>
                        <th style={{ padding: '6px 10px' }}>Port</th>
                        <th style={{ padding: '6px 10px' }}>User</th>
                        <th style={{ padding: '6px 10px' }}>Password</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedIpv6List.map((p, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{p.host}</td>
                          <td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{p.port}</td>
                          <td style={{ padding: '6px 10px' }}>{p.user}</td>
                          <td style={{ padding: '6px 10px' }}>{p.pass}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MODALS (Add/Edit Single, Bulk Import, Assign, Delete)
         ───────────────────────────────────────────────────────────── */}
      {/* ── MODAL 1: ADD / EDIT SINGLE PROXY ── */}
      {modalMode && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setModalMode(null)}
        >
          <div
            style={{
              width: '580px',
              maxWidth: '94vw',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)',
              overflow: 'hidden',
              animation: 'fadeInModal 0.15s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 22px',
                borderBottom: '1px solid #F1F5F9',
                backgroundColor: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#EDE9FE',
                    color: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Shield size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                    {modalMode === 'add' ? 'Thêm Proxy Mới' : 'Cập Nhật Proxy'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Thiết lập kết nối máy chủ Proxy cho các hồ sơ trình duyệt
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalMode(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#0F172A'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm}>
              <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {formError && (
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FEE2E2',
                      color: '#DC2626',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Section 1: Protocol & IP Version Selection + Choose file */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Giao thức Proxy
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 28px 0 10px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#F8FAFC',
                          color: '#0F172A',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          outline: 'none',
                          appearance: 'none',
                          WebkitAppearance: 'none'
                        }}
                      >
                        <option value="SOCKS5">SOCKS5</option>
                        <option value="HTTP">HTTP</option>
                        <option value="HTTPS">HTTPS</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Loại IP
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={formData.ipVersion || 'IPv4'}
                        onChange={(e) => setFormData({ ...formData, ipVersion: e.target.value })}
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 28px 0 10px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#F8FAFC',
                          color: '#0F172A',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          outline: 'none',
                          appearance: 'none',
                          WebkitAppearance: 'none'
                        }}
                      >
                        <option value="IPv4">IPv4</option>
                        <option value="IPv6">IPv6</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'transparent', marginBottom: '6px' }}>
                      Tệp
                    </label>
                    <input
                      type="file"
                      ref={singleFileInputRef}
                      accept=".txt,.csv"
                      onChange={handleSingleFileChange}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => singleFileInputRef.current?.click()}
                      title="Chọn tệp proxy (.txt, .csv)"
                      style={{
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                        color: '#475569',
                        fontSize: '12px',
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                    >
                      <Upload size={14} style={{ color: '#0EA5E9' }} />
                      <span>Chọn file</span>
                    </button>
                  </div>
                </div>

                {/* Section 2: Host / IP & Port (NÚT DÁN NẰM TRỰC TIẾP TRONG Ô INPUT) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Địa chỉ Host / IP / Chuỗi Proxy *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        placeholder={formData.ipVersion === 'IPv6' ? 'vd: 2402:800:6000:a1b2::1' : 'vd: 14.162.90.12 hoặc dán chuỗi proxy'}
                        value={formData.host}
                        onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                        onPaste={handleHostPaste}
                        style={{
                          width: '100%',
                          height: '40px',
                          padding: '0 80px 0 12px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                          outline: 'none',
                          transition: 'border-color 0.15s, box-shadow 0.15s'
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#7C3AED'; e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; e.target.style.boxShadow = 'none'; }}
                      />
                      {/* Nút Dán nằm ngay trong ô input */}
                      <button
                        type="button"
                        onClick={handlePasteSingleProxy}
                        title="Dán nhanh chuỗi proxy từ Clipboard (tự động điền Port, User, Pass nếu có)"
                        style={{
                          position: 'absolute',
                          right: '6px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          height: '28px',
                          padding: '0 9px',
                          borderRadius: '6px',
                          backgroundColor: '#EDE9FE',
                          color: '#7C3AED',
                          border: '1px solid #DDD6FE',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#7C3AED';
                          e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#EDE9FE';
                          e.currentTarget.style.color = '#7C3AED';
                        }}
                      >
                        <Copy size={12} />
                        <span>Dán</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Cổng Port *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="1080"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'border-color 0.15s, box-shadow 0.15s'
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#7C3AED'; e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                {/* Section 3: User & Pass */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Tài khoản (Tùy chọn)
                    </label>
                    <input
                      type="text"
                      placeholder="Username"
                      value={formData.user}
                      onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Mật khẩu (Tùy chọn)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswordInModal ? 'text' : 'password'}
                        placeholder="Password"
                        value={formData.pass}
                        onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 34px 0 10px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {showPasswordInModal ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 4: Tag Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Tên gợi nhớ (Tag / Ghi chú)
                  </label>
                  <input
                    type="text"
                    placeholder="vd: Residential US #01, Proxy chính MMO..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 10px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Live Test connection result box */}
                {testResultInModal && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      backgroundColor:
                        testResultInModal.status === 'testing'
                          ? '#EFF6FF'
                          : testResultInModal.status === 'success'
                          ? '#ECFDF5'
                          : '#FEF2F2',
                      border:
                        testResultInModal.status === 'testing'
                          ? '1px solid #BFDBFE'
                          : testResultInModal.status === 'success'
                          ? '1px solid #A7F3D0'
                          : '1px solid #FECACA',
                      color:
                        testResultInModal.status === 'testing'
                          ? '#1D4ED8'
                          : testResultInModal.status === 'success'
                          ? '#047857'
                          : '#DC2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {testResultInModal.status === 'testing' && <RefreshCw size={14} className="spin-anim" />}
                      {testResultInModal.status === 'success' && <CheckCircle2 size={14} />}
                      {testResultInModal.status === 'error' && <AlertCircle size={14} />}
                      <span style={{ fontWeight: 500 }}>{testResultInModal.message}</span>
                    </div>
                    {testResultInModal.status === 'success' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {testResultInModal.country && (
                          <CountryFlag code={testResultInModal.country} width={18} height={12} />
                        )}
                        <span style={{ fontWeight: 700, fontSize: '12px' }}>{testResultInModal.latency}ms</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #E2E8F0',
                  padding: '14px 22px',
                  backgroundColor: '#F8FAFC'
                }}
              >
                <button
                  type="button"
                  onClick={handleTestInModal}
                  disabled={testResultInModal?.status === 'testing'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    fontSize: '12.5px',
                    fontWeight: 500,
                    cursor: testResultInModal?.status === 'testing' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                >
                  <Activity size={14} style={{ color: '#7C3AED' }} />
                  <span>{testResultInModal?.status === 'testing' ? 'Đang test...' : 'Test kết nối'}</span>
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#475569',
                      fontSize: '12.5px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#7C3AED',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(124, 58, 237, 0.25)',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#6D28D9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#7C3AED'; }}
                  >
                    {modalMode === 'add' ? 'Thêm proxy' : 'Lưu thay đổi'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: BULK IMPORT PROXIES ── */}
      {showBulkModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setShowBulkModal(false)}
        >
          <div
            style={{
              width: '600px',
              maxWidth: '94vw',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)',
              overflow: 'hidden',
              animation: 'fadeInModal 0.15s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 22px',
                borderBottom: '1px solid #F1F5F9',
                backgroundColor: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#EDE9FE',
                    color: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Upload size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                    Nhập Proxy Hàng Loạt
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Thêm nhiều proxy cùng lúc từ văn bản hoặc tệp tin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#0F172A'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit}>
              <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Protocol & IP Version Selection + Choose file */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Giao thức mặc định
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={bulkType}
                        onChange={(e) => setBulkType(e.target.value)}
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 28px 0 10px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#F8FAFC',
                          color: '#0F172A',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          outline: 'none',
                          appearance: 'none',
                          WebkitAppearance: 'none'
                        }}
                      >
                        <option value="SOCKS5">SOCKS5</option>
                        <option value="HTTP">HTTP</option>
                        <option value="HTTPS">HTTPS</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Loại IP
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={bulkIpVersion}
                        onChange={(e) => setBulkIpVersion(e.target.value)}
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 28px 0 10px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#F8FAFC',
                          color: '#0F172A',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          outline: 'none',
                          appearance: 'none',
                          WebkitAppearance: 'none'
                        }}
                      >
                        <option value="IPv4">IPv4</option>
                        <option value="IPv6">IPv6</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'transparent', marginBottom: '6px' }}>
                      Tệp
                    </label>
                    <input
                      type="file"
                      ref={bulkFileInputRef}
                      accept=".txt,.csv"
                      onChange={handleBulkFileChange}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => bulkFileInputRef.current?.click()}
                      title="Chọn tệp proxy (.txt, .csv)"
                      style={{
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                        color: '#475569',
                        fontSize: '12px',
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                    >
                      <Upload size={14} style={{ color: '#0EA5E9' }} />
                      <span>Chọn file</span>
                    </button>
                  </div>
                </div>

                {/* Textarea container with inside-toolbar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                      Danh sách Proxy (Mỗi dòng 1 Proxy)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={handlePasteBulk}
                        title="Dán từ Clipboard"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '5px',
                          backgroundColor: '#EDE9FE',
                          color: '#7C3AED',
                          border: '1px solid #DDD6FE',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <Copy size={11} />
                        <span>Dán từ clipboard</span>
                      </button>
                      <span style={{ fontSize: '11.5px', color: '#7C3AED', fontWeight: 600, backgroundColor: '#F5F3FF', padding: '2px 8px', borderRadius: '4px' }}>
                        {bulkLineCount} dòng
                      </span>
                    </div>
                  </div>
                  <textarea
                    rows={8}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={`Định dạng hỗ trợ:\n14.162.88.10:1080\n14.162.88.10:1080:username:password\nusername:password@14.162.88.10:1080\n[2402:800:6000:a1b2::1]:1080`}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '12.5px',
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      lineHeight: '1.6',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'border-color 0.15s, box-shadow 0.15s'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#7C3AED'; e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  borderTop: '1px solid #E2E8F0',
                  padding: '14px 22px',
                  backgroundColor: '#F8FAFC'
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontSize: '12.5px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={bulkLineCount === 0}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: bulkLineCount === 0 ? '#CBD5E1' : '#7C3AED',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: bulkLineCount === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: bulkLineCount === 0 ? 'none' : '0 2px 4px rgba(124, 58, 237, 0.25)'
                  }}
                >
                  Nhập {bulkLineCount > 0 ? `${bulkLineCount} Proxy` : ''}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: ASSIGN PROXY TO PROFILE ── */}
      {assignModalProxy && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={() => setAssignModalProxy(null)}
        >
          <div
            style={{
              width: '420px',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                Gán Proxy Vào Hồ Sơ Trình Duyệt
              </span>
              <button onClick={() => setAssignModalProxy(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '16px 18px' }}>
              <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', marginBottom: '14px', fontSize: '12px' }}>
                <div style={{ color: '#64748B', fontSize: '11px' }}>Proxy được chọn:</div>
                <strong style={{ fontFamily: 'monospace', color: '#7C3AED' }}>
                  {assignModalProxy.type}://{assignModalProxy.host}:{assignModalProxy.port}
                </strong>
              </div>

              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Chọn Hồ Sơ Profile muốn gán:
              </label>
              <select
                value={selectedTargetProfileId}
                onChange={(e) => setSelectedTargetProfileId(e.target.value)}
                style={{
                  width: '100%',
                  height: '34px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  backgroundColor: '#FFFFFF',
                  marginBottom: '16px'
                }}
              >
                <option value="">-- Chọn hồ sơ profile --</option>
                {profiles.map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.title || prof.name} (Nhóm: {prof.group || 'Chung'})
                  </option>
                ))}
              </select>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setAssignModalProxy(null)}
                  style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '12px', cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={!selectedTargetProfileId}
                  onClick={handleAssignToProfile}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: selectedTargetProfileId ? '#7C3AED' : '#CBD5E1',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: selectedTargetProfileId ? 'pointer' : 'not-allowed'
                  }}
                >
                  Xác nhận gán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT PROXY NOTE ── */}
      {editingNoteProxy && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={() => setEditingNoteProxy(null)}
        >
          <div
            style={{
              width: '400px',
              maxWidth: '92vw',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              padding: '20px',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={15} />
                </div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Ghi chú Proxy</h4>
              </div>
              <button
                onClick={() => setEditingNoteProxy(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '10px' }}>
              Proxy: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0F172A' }}>{(editingNoteProxy.type || 'socks5').toLowerCase()}://{editingNoteProxy.host}:{editingNoteProxy.port}</span>
            </div>

            <textarea
              rows={3}
              value={noteInputText}
              onChange={(e) => setNoteInputText(e.target.value)}
              placeholder="Nhập ghi chú hoặc tên gợi nhớ cho proxy..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                boxSizing: 'border-box',
                outline: 'none',
                resize: 'none',
                marginBottom: '16px'
              }}
              autoFocus
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setEditingNoteProxy(null)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#7C3AED',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: DELETE CONFIRMATION ── */}
      {deleteConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            style={{
              width: '380px',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '18px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                <Trash2 size={16} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                Xác nhận xóa Proxy
              </span>
            </div>

            <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              {deleteConfirm.type === 'single'
                ? `Bạn có chắc chắn muốn xóa proxy "${deleteConfirm.proxy.host}:${deleteConfirm.proxy.port}" khỏi danh sách?`
                : `Bạn có chắc chắn muốn xóa ${deleteConfirm.count} proxy đã chọn khỏi danh sách?`}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '12px', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirm.type === 'single') {
                    deleteProxy(deleteConfirm.proxy.id);
                  } else {
                    deleteMultipleProxies(selectedProxyIds);
                    setSelectedProxyIds([]);
                  }
                  setDeleteConfirm(null);
                  showToast?.('Đã xóa proxy thành công');
                }}
                style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5: ADD ROTATING PROXY ── */}
      {showAddRotatingModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={() => setShowAddRotatingModal(false)}
        >
          <div
            style={{
              width: '460px',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              padding: '18px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                Thêm Cấu Hình Proxy Xoay (API)
              </span>
              <button onClick={() => setShowAddRotatingModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Tên cấu hình
                </label>
                <input
                  type="text"
                  value={rotatingFormData.name}
                  onChange={(e) => setRotatingFormData({ ...rotatingFormData, name: e.target.value })}
                  placeholder="vd: TMProxy VN 4G Fast"
                  style={{ width: '100%', height: '32px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Đường dẫn API đổi IP (Rotate API Key / URL)
                </label>
                <input
                  type="text"
                  value={rotatingFormData.rotateUrl}
                  onChange={(e) => setRotatingFormData({ ...rotatingFormData, rotateUrl: e.target.value })}
                  placeholder="https://api.tmproxy.com/api/proxy/get-new-proxy?api_key=..."
                  style={{ width: '100%', height: '32px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Nhà cung cấp
                  </label>
                  <input
                    type="text"
                    value={rotatingFormData.provider}
                    onChange={(e) => setRotatingFormData({ ...rotatingFormData, provider: e.target.value })}
                    placeholder="TMProxy / TinProxy / ProxyNo1"
                    style={{ width: '100%', height: '32px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Cooldown (giây)
                  </label>
                  <input
                    type="number"
                    value={rotatingFormData.cooldown}
                    onChange={(e) => setRotatingFormData({ ...rotatingFormData, cooldown: Number(e.target.value) })}
                    style={{ width: '100%', height: '32px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowAddRotatingModal(false)}
                style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '12px', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!rotatingFormData.name.trim()) return;
                  addRotatingProxy(rotatingFormData);
                  setShowAddRotatingModal(false);
                  setRotatingFormData({ name: '', provider: 'TMProxy', rotateUrl: '', protocol: 'HTTP', cooldown: 60 });
                  showToast?.('Đã thêm proxy xoay mới thành công');
                }}
                style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#7C3AED', color: '#FFFFFF', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Thêm cấu hình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 6: ADD DCOM DEVICE ── */}
      {showAddDcomModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={() => setShowAddDcomModal(false)}
        >
          <div
            style={{
              width: '420px',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              padding: '18px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                Kết Nối Thiết Bị DCOM 4G Mới
              </span>
              <button onClick={() => setShowAddDcomModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Tên thiết bị
                </label>
                <input
                  type="text"
                  value={dcomFormData.name}
                  onChange={(e) => setDcomFormData({ ...dcomFormData, name: e.target.value })}
                  style={{ width: '100%', height: '32px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Cổng COM (Serial)
                  </label>
                  <input
                    type="text"
                    value={dcomFormData.comPort}
                    onChange={(e) => setDcomFormData({ ...dcomFormData, comPort: e.target.value })}
                    placeholder="COM3"
                    style={{ width: '100%', height: '32px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Local Port chuyển tiếp
                  </label>
                  <input
                    type="number"
                    value={dcomFormData.localPort}
                    onChange={(e) => setDcomFormData({ ...dcomFormData, localPort: Number(e.target.value) })}
                    style={{ width: '100%', height: '32px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Nhà mạng Sim
                </label>
                <input
                  type="text"
                  value={dcomFormData.carrier}
                  onChange={(e) => setDcomFormData({ ...dcomFormData, carrier: e.target.value })}
                  placeholder="Viettel 4G / Vinaphone / Mobifone"
                  style={{ width: '100%', height: '32px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowAddDcomModal(false)}
                style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '12px', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!dcomFormData.name.trim()) return;
                  addDcomDevice(dcomFormData);
                  setShowAddDcomModal(false);
                  showToast?.('Đã kết nối thiết bị DCOM thành công');
                }}
                style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#7C3AED', color: '#FFFFFF', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Kết nối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
