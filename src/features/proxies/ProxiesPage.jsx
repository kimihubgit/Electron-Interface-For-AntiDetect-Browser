import React, { useState, useMemo } from 'react';
import { useBrowser } from '../../store/BrowserContext';
import { testProxyConnection } from '../profiles/utils/proxyUtils';

// Subcomponents
import ProxyHeader from './components/ProxyHeader';
import ProxyFilterBar from './components/ProxyFilterBar';
import ProxyTable from './components/ProxyTable';
import ProxyFloatingBar from './components/ProxyFloatingBar';

// Subtabs
import RotatingProxiesTab from './tabs/RotatingProxiesTab';
import DcomDonglesTab from './tabs/DcomDonglesTab';
import Ipv6SubnetTab from './tabs/Ipv6SubnetTab';

// Modals
import ProxySingleModal from './modals/ProxySingleModal';
import ProxyBulkModal from './modals/ProxyBulkModal';
import ProxyAssignModal from './modals/ProxyAssignModal';
import ProxyNoteModal from './modals/ProxyNoteModal';
import ProxyDeleteConfirmModal from './modals/ProxyDeleteConfirmModal';
import AddRotatingProxyModal from './modals/AddRotatingProxyModal';
import AddDcomModal from './modals/AddDcomModal';

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
    showToast
  } = useBrowser();

  // Sub-tab Navigation ('pool' | 'rotating' | 'dcom' | 'ipv6')
  const [activeSubTab, setActiveSubTab] = useState('pool');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selection
  const [selectedProxyIds, setSelectedProxyIds] = useState([]);

  // Testing states
  const [testingId, setTestingId] = useState(null);
  const [testingProxyIds, setTestingProxyIds] = useState([]);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Table options
  const [showNoteText, setShowNoteText] = useState(false);
  const [ipQueryChannel] = useState('IPRust.io');
  const [editingNoteProxy, setEditingNoteProxy] = useState(null);
  const [noteInputText, setNoteInputText] = useState('');

  // Modals state
  const [modalMode, setModalMode] = useState(null); // null | 'add' | 'edit'
  const [currentEditingProxy, setCurrentEditingProxy] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [assignModalProxy, setAssignModalProxy] = useState(null);
  const [selectedTargetProfileId, setSelectedTargetProfileId] = useState('');

  // Single Proxy Form State
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

  // Bulk Import Form State
  const [bulkText, setBulkText] = useState('');
  const [bulkType, setBulkType] = useState('SOCKS5');
  const [bulkIpVersion, setBulkIpVersion] = useState('IPv4');

  // Rotating & DCOM Modals State
  const [showAddRotatingModal, setShowAddRotatingModal] = useState(false);
  const [rotatingFormData, setRotatingFormData] = useState({
    name: '',
    provider: 'TMProxy',
    rotateUrl: '',
    protocol: 'HTTP',
    cooldown: 60
  });

  const [showAddDcomModal, setShowAddDcomModal] = useState(false);
  const [dcomFormData, setDcomFormData] = useState({
    name: 'Huawei E3372 4G #1',
    comPort: 'COM3',
    localPort: 20001,
    carrier: 'Viettel 4G'
  });

  // Copy helper
  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast?.('Đã sao chép vào clipboard');
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filtered Proxies
  const filteredProxies = useMemo(() => {
    return proxies.filter((p) => {
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

  // Stats
  const totalCount = proxies.length;
  const liveCount = proxies.filter((p) => p.status === 'live').length;
  const dieCount = proxies.filter((p) => p.status === 'die').length;

  // Selection
  const isAllSelected = filteredProxies.length > 0 && selectedProxyIds.length === filteredProxies.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProxyIds(filteredProxies.map((p) => p.id));
    } else {
      setSelectedProxyIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedProxyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectBatch = (idsToToggle, shouldSelect) => {
    setSelectedProxyIds((prev) => {
      const set = new Set(prev);
      if (shouldSelect) {
        idsToToggle.forEach((id) => set.add(id));
      } else {
        idsToToggle.forEach((id) => set.delete(id));
      }
      return Array.from(set);
    });
  };

  // Ping Handlers
  const handleCheckSingle = async (p, e) => {
    e?.stopPropagation();
    setTestingProxyIds((prev) => Array.from(new Set([...prev, p.id])));
    try {
      await checkProxy(p.id);
    } finally {
      setTestingProxyIds((prev) => prev.filter((id) => id !== p.id));
    }
  };

  const handleCheckAll = async () => {
    const allIds = filteredProxies.map((p) => p.id);
    if (allIds.length === 0) return;
    setIsCheckingAll(true);
    setTestingProxyIds((prev) => Array.from(new Set([...prev, ...allIds])));
    try {
      await checkAllProxies(allIds, (finishedIds) => {
        const idsToRemove = Array.isArray(finishedIds) ? finishedIds : [finishedIds];
        const removeSet = new Set(idsToRemove);
        setTestingProxyIds((prev) => prev.filter((id) => !removeSet.has(id)));
      });
    } finally {
      setTestingProxyIds([]);
      setIsCheckingAll(false);
    }
  };

  const handlePingSelected = async () => {
    if (selectedProxyIds.length === 0) return;
    const idsToCheck = [...selectedProxyIds];
    setTestingProxyIds((prev) => Array.from(new Set([...prev, ...idsToCheck])));

    try {
      await checkAllProxies(idsToCheck, (finishedIds) => {
        const idsToRemove = Array.isArray(finishedIds) ? finishedIds : [finishedIds];
        const removeSet = new Set(idsToRemove);
        setTestingProxyIds((prev) => prev.filter((item) => !removeSet.has(item)));
      });
    } finally {
      setTestingProxyIds((prev) => prev.filter((id) => !idsToCheck.includes(id)));
    }
  };

  // Delete Handlers
  const handleDeleteDieProxies = () => {
    const dieProxies = proxies.filter((p) => p.status === 'die');
    if (dieProxies.length === 0) {
      showToast?.('Không có proxy Die nào để xóa!');
      return;
    }
    setDeleteConfirm({
      type: 'die',
      count: dieProxies.length,
      ids: dieProxies.map((p) => p.id)
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'single') {
      deleteProxy(deleteConfirm.proxy.id);
      showToast?.('Đã xóa proxy thành công');
    } else if (deleteConfirm.type === 'die') {
      deleteMultipleProxies(deleteConfirm.ids);
      setSelectedProxyIds((prev) => prev.filter((id) => !deleteConfirm.ids.includes(id)));
      showToast?.(`Đã xóa ${deleteConfirm.count} proxy Die thành công`);
    } else {
      deleteMultipleProxies(selectedProxyIds);
      setSelectedProxyIds([]);
      showToast?.('Đã xóa các proxy đã chọn thành công');
    }
    setDeleteConfirm(null);
  };

  // Export Selected
  const handleExportProxies = (format = 'txt') => {
    const selectedProxies = proxies.filter((p) => selectedProxyIds.includes(p.id));
    if (selectedProxies.length === 0) {
      showToast?.('Vui lòng chọn ít nhất 1 proxy để xuất!');
      return;
    }

    let content = '';
    let mimeType = 'text/plain;charset=utf-8';
    let filename = `proxies_export_${new Date().toISOString().slice(0, 10)}`;

    if (format === 'csv') {
      mimeType = 'text/csv;charset=utf-8';
      filename += '.csv';
      const headers = ['Protocol', 'Host', 'Port', 'User', 'Password', 'Country', 'Status', 'Ping(ms)', 'Tag/Note'];
      const rows = selectedProxies.map((p) => [
        p.type || 'SOCKS5',
        p.host || '',
        p.port || '',
        `"${(p.user || '').replace(/"/g, '""')}"`,
        `"${(p.pass || '').replace(/"/g, '""')}"`,
        p.country || '',
        p.status || 'unknown',
        p.latency || '',
        `"${(p.name || p.notes || '').replace(/"/g, '""')}"`
      ]);
      content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    } else if (format === 'url') {
      filename += '.txt';
      content = selectedProxies
        .map((p) => {
          const auth = p.user ? `${encodeURIComponent(p.user)}:${encodeURIComponent(p.pass || '')}@` : '';
          const proto = (p.type || 'socks5').toLowerCase();
          return `${proto}://${auth}${p.host}:${p.port}`;
        })
        .join('\r\n');
    } else {
      filename += '.txt';
      content = selectedProxies
        .map((p) => {
          if (p.user || p.pass) {
            return `${p.host}:${p.port}:${p.user || ''}:${p.pass || ''}`;
          }
          return `${p.host}:${p.port}`;
        })
        .join('\r\n');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast?.(`Đã xuất file cho ${selectedProxies.length} proxy thành công!`);
  };

  const handleCopySelectedProxies = () => {
    const selectedProxies = proxies.filter((p) => selectedProxyIds.includes(p.id));
    if (selectedProxies.length === 0) return;

    const text = selectedProxies
      .map((p) => {
        if (p.user || p.pass) {
          return `${p.host}:${p.port}:${p.user || ''}:${p.pass || ''}`;
        }
        return `${p.host}:${p.port}`;
      })
      .join('\n');

    navigator.clipboard.writeText(text);
    showToast?.(`Đã sao chép ${selectedProxies.length} proxy vào clipboard!`);
  };

  const handleQuickAssignSelected = () => {
    if (selectedProxyIds.length === 0) return;
    const targetProxy = proxies.find((p) => p.id === selectedProxyIds[0]);
    if (targetProxy) {
      setAssignModalProxy(targetProxy);
    }
  };

  // Single Modal Handlers
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
      const hasModalTest = testResultInModal && testResultInModal.status === 'success';
      const isModalError = testResultInModal && testResultInModal.status === 'error';
      addProxy({
        ...formData,
        host,
        port,
        user: formData.user.trim(),
        pass: formData.pass.trim(),
        ipVersion: formData.ipVersion || (host.includes(':') ? 'IPv6' : 'IPv4'),
        country: hasModalTest
          ? (testResultInModal.country || formData.country || '').toUpperCase()
          : (formData.country || '').toUpperCase(),
        status: hasModalTest ? 'live' : isModalError ? 'die' : 'unknown',
        latency: hasModalTest && testResultInModal.latency != null ? testResultInModal.latency : null,
        outboundIp: hasModalTest ? testResultInModal.ip || host : null
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
      setFormData((prev) => ({ ...prev, country: res.country }));
    }

    setTestResultInModal({
      status: isOk ? 'success' : 'error',
      latency: res.latency,
      country: res.country || formData.country || '',
      ip: isOk ? formData.host : null,
      message: res.message || (isOk ? `Kết nối thành công (${res.latency}ms)` : 'Không thể kết nối đến máy chủ Proxy!')
    });
  };

  // Bulk Submit
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

  // Assign Proxy
  const handleAssignToProfile = () => {
    if (!assignModalProxy || !selectedTargetProfileId) return;
    const targetProfile = profiles.find((p) => p.id === selectedTargetProfileId);
    if (!targetProfile) return;

    // Trigger toast & close
    showToast?.(`Đã gán proxy ${assignModalProxy.host} vào profile "${targetProfile.title || targetProfile.name}"!`);
    setAssignModalProxy(null);
    setSelectedTargetProfileId('');
  };

  // Notes
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC', position: 'relative' }}>
      {/* 1. Header with Title, Subtabs & Action Buttons */}
      <ProxyHeader
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        proxiesCount={proxies.length}
        rotatingCount={rotatingProxies.length}
        dcomCount={dcomDevices.length}
        ipv6Count={generatedIpv6List.length}
        handleCheckAll={handleCheckAll}
        isCheckingAll={isCheckingAll}
        onOpenBulkModal={() => setShowBulkModal(true)}
        onOpenAddModal={handleOpenAddModal}
        onOpenAddRotatingModal={() => setShowAddRotatingModal(true)}
        onOpenAddDcomModal={() => setShowAddDcomModal(true)}
      />

      {/* 2. Sub-tab Contents */}
      {activeSubTab === 'pool' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Filter Bar */}
          <ProxyFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            protocolFilter={protocolFilter}
            setProtocolFilter={setProtocolFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            totalCount={totalCount}
            liveCount={liveCount}
            dieCount={dieCount}
            handleDeleteDieProxies={handleDeleteDieProxies}
          />

          {/* Table */}
          <ProxyTable
            filteredProxies={filteredProxies}
            selectedProxyIds={selectedProxyIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onSelectBatch={handleSelectBatch}
            isAllSelected={isAllSelected}
            testingProxyIds={testingProxyIds}
            testingId={testingId}
            copiedId={copiedId}
            onCopy={handleCopy}
            showNoteText={showNoteText}
            setShowNoteText={setShowNoteText}
            ipQueryChannel={ipQueryChannel}
            profiles={profiles}
            onOpenEdit={handleOpenEditModal}
            onOpenAssign={(p) => setAssignModalProxy(p)}
            onCheckSingle={handleCheckSingle}
            onDeleteSingle={(p) => setDeleteConfirm({ type: 'single', proxy: p })}
            onOpenNote={handleOpenNoteModal}
            onOpenAddModal={handleOpenAddModal}
          />

          {/* Floating Bottom Bar */}
          <ProxyFloatingBar
            selectedProxyIds={selectedProxyIds}
            totalCount={filteredProxies.length}
            onSelectAllVisible={() => setSelectedProxyIds(filteredProxies.map((p) => p.id))}
            isAllSelected={isAllSelected}
            onPingSelected={handlePingSelected}
            isAnySelectedTesting={selectedProxyIds.some((id) => testingProxyIds.includes(id))}
            onCopySelected={handleCopySelectedProxies}
            onExportProxies={handleExportProxies}
            onQuickAssign={handleQuickAssignSelected}
            onDeleteSelected={() => setDeleteConfirm({ type: 'multiple', count: selectedProxyIds.length })}
          />
        </div>
      )}

      {activeSubTab === 'rotating' && (
        <RotatingProxiesTab
          rotatingProxies={rotatingProxies}
          triggerRotateProxy={triggerRotateProxy}
          deleteRotatingProxy={deleteRotatingProxy}
        />
      )}

      {activeSubTab === 'dcom' && (
        <DcomDonglesTab
          dcomDevices={dcomDevices}
          triggerDcomRotate={triggerDcomRotate}
          deleteDcomDevice={deleteDcomDevice}
        />
      )}

      {activeSubTab === 'ipv6' && (
        <Ipv6SubnetTab
          generatedIpv6List={generatedIpv6List}
          generateIpv6Batch={generateIpv6Batch}
          addGeneratedIpv6ToPool={addGeneratedIpv6ToPool}
          showToast={showToast}
        />
      )}

      {/* 3. Modals */}
      <ProxySingleModal
        modalMode={modalMode}
        onClose={() => setModalMode(null)}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
        setFormError={setFormError}
        onSubmit={handleSubmitForm}
        onTestInModal={handleTestInModal}
        testResultInModal={testResultInModal}
        showPasswordInModal={showPasswordInModal}
        setShowPasswordInModal={setShowPasswordInModal}
        quickParseInput={quickParseInput}
        setQuickParseInput={setQuickParseInput}
        showToast={showToast}
      />

      <ProxyBulkModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        bulkType={bulkType}
        setBulkType={setBulkType}
        bulkIpVersion={bulkIpVersion}
        setBulkIpVersion={setBulkIpVersion}
        bulkText={bulkText}
        setBulkText={setBulkText}
        onSubmit={handleBulkSubmit}
        showToast={showToast}
      />

      <ProxyAssignModal
        proxy={assignModalProxy}
        onClose={() => setAssignModalProxy(null)}
        profiles={profiles}
        selectedTargetProfileId={selectedTargetProfileId}
        setSelectedTargetProfileId={setSelectedTargetProfileId}
        onAssign={handleAssignToProfile}
      />

      <ProxyNoteModal
        proxy={editingNoteProxy}
        onClose={() => setEditingNoteProxy(null)}
        noteInputText={noteInputText}
        setNoteInputText={setNoteInputText}
        onSave={handleSaveNote}
      />

      <ProxyDeleteConfirmModal
        deleteConfirm={deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
      />

      <AddRotatingProxyModal
        isOpen={showAddRotatingModal}
        onClose={() => setShowAddRotatingModal(false)}
        formData={rotatingFormData}
        setFormData={setRotatingFormData}
        onSubmit={() => {
          if (!rotatingFormData.name.trim()) return;
          addRotatingProxy(rotatingFormData);
          setShowAddRotatingModal(false);
          setRotatingFormData({ name: '', provider: 'TMProxy', rotateUrl: '', protocol: 'HTTP', cooldown: 60 });
          showToast?.('Đã thêm proxy xoay mới thành công');
        }}
      />

      <AddDcomModal
        isOpen={showAddDcomModal}
        onClose={() => setShowAddDcomModal(false)}
        formData={dcomFormData}
        setFormData={setDcomFormData}
        onSubmit={() => {
          if (!dcomFormData.name.trim()) return;
          addDcomDevice(dcomFormData);
          setShowAddDcomModal(false);
          showToast?.('Đã kết nối thiết bị DCOM thành công');
        }}
      />
    </div>
  );
}
