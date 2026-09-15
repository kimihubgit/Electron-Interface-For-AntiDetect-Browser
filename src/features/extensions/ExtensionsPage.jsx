import React, { useState, useEffect, useMemo } from 'react';
import { useBrowser } from '../../store/BrowserContext';
import { useTranslation } from '../../i18n/I18nContext';

import { STORE_CATALOG } from './data/storeCatalog';
import ExtensionHeader from './components/ExtensionHeader';
import ExtensionsManagerTab from './tabs/ExtensionsManagerTab';
import ExtensionsStoreTab from './tabs/ExtensionsStoreTab';
import InstallExtensionModal from './modals/InstallExtensionModal';
import UpdateExtensionModal from './modals/UpdateExtensionModal';
import AssignProfilesModal from './modals/AssignProfilesModal';

const DEFAULT_EXTENSIONS = [];

export default function ExtensionsPage() {
  const { t, language } = useTranslation();
  const { profiles = [], addLog, showToast } = useBrowser();

  // Active Main Tab: 'manager' | 'store'
  const [activeView, setActiveView] = useState('manager');

  // Extensions in Manager, persisted to localStorage & loaded directly from disk
  const [extensions, setExtensions] = useState(() => {
    try {
      const saved = localStorage.getItem('antidetect_installed_extensions_v2');
      return saved ? JSON.parse(saved) : DEFAULT_EXTENSIONS;
    } catch {
      return DEFAULT_EXTENSIONS;
    }
  });
  const [isLoadingInstalled, setIsLoadingInstalled] = useState(false);

  // Store filters
  const [storeSearch, setStoreSearch] = useState('');

  // Manager filters
  const [managerSearch, setManagerSearch] = useState('');
  const [managerStatus, setManagerStatus] = useState('all'); // 'all' | 'enabled' | 'disabled'

  // Modal: Install
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installSource, setInstallSource] = useState('file'); // 'file' | 'folder' | 'store'
  const [installFile, setInstallFile] = useState(null);
  const [installFolder, setInstallFolder] = useState(null);
  const [storeUrlInput, setStoreUrlInput] = useState('');
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgressText, setInstallProgressText] = useState('');
  const [downloadingStoreIds, setDownloadingStoreIds] = useState(new Set());

  // Modal: Update
  const [updateTargetExt, setUpdateTargetExt] = useState(null);
  const [updateFile, setUpdateFile] = useState(null);

  // Modal: Assign
  const [assignTargetExt, setAssignTargetExt] = useState(null);
  const [assignAllMode, setAssignAllMode] = useState(true);
  const [selectedProfileIds, setSelectedProfileIds] = useState([]);
  const [profileSearchQuery, setProfileSearchQuery] = useState('');

  // Refresh extensions from physical folders on disk
  const refreshInstalledExtensions = async (silent = false) => {
    if (window.electronAPI?.getInstalledExtensions) {
      if (!silent) setIsLoadingInstalled(true);
      try {
        const list = await window.electronAPI.getInstalledExtensions();
        if (Array.isArray(list)) {
          setExtensions(list);
          try {
            localStorage.setItem('antidetect_installed_extensions_v2', JSON.stringify(list));
          } catch {}
        }
      } catch (err) {
        console.warn('Lỗi quét tiện ích từ thư mục máy tính:', err);
      } finally {
        if (!silent) setIsLoadingInstalled(false);
      }
    }
  };

  useEffect(() => {
    refreshInstalledExtensions(false);
  }, []);

  // Installed Ext IDs for store lookup
  const installedExtIds = useMemo(() => {
    return new Set(extensions.map(e => e.extId || e.name.toLowerCase()));
  }, [extensions]);

  // Filtered store catalog
  const filteredStoreExtensions = useMemo(() => {
    return STORE_CATALOG.filter(item => {
      const q = storeSearch.trim().toLowerCase();
      return (
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q)
      );
    });
  }, [storeSearch]);

  // Filtered manager list
  const filteredManagerExtensions = useMemo(() => {
    return extensions.filter(ext => {
      const q = managerSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        ext.name.toLowerCase().includes(q) ||
        (ext.description && ext.description.toLowerCase().includes(q)) ||
        (ext.author && ext.author.toLowerCase().includes(q)) ||
        (ext.extId && ext.extId.toLowerCase().includes(q));

      const matchesStatus =
        managerStatus === 'all' ||
        (managerStatus === 'enabled' && ext.enabled) ||
        (managerStatus === 'disabled' && !ext.enabled);

      return matchesSearch && matchesStatus;
    });
  }, [extensions, managerSearch, managerStatus]);

  // Toggle extension enabled state
  const handleToggle = async (id) => {
    let nextState = false;
    setExtensions(prev =>
      prev.map(ext => {
        if (ext.id === id) {
          nextState = !ext.enabled;
          addLog?.(`${nextState ? 'Bật' : 'Tắt'} tiện ích "${ext.name}"`, nextState ? 'success' : 'info');
          if (showToast) showToast(`${nextState ? 'Đã bật' : 'Đã tắt'} tiện ích "${ext.name}"`, 'info');
          return { ...ext, enabled: nextState };
        }
        return ext;
      })
    );

    if (window.electronAPI?.saveExtensionConfig) {
      try {
        await window.electronAPI.saveExtensionConfig({ id, enabled: nextState });
      } catch (err) {
        console.warn('Lỗi lưu cấu hình bật/tắt tiện ích:', err);
      }
    }
  };

  // Open extension folder in Explorer
  const handleOpenFolder = async (ext) => {
    if (!ext) return;
    const target = ext.folderPath || ext.extId || ext.id;
    if (window.electronAPI?.openExtensionFolder) {
      try {
        const res = await window.electronAPI.openExtensionFolder(target);
        if (res && res.success) {
          if (res.folderPath && res.folderPath !== ext.folderPath) {
            setExtensions(prev => prev.map(e => (e.id === ext.id ? { ...e, folderPath: res.folderPath } : e)));
          }
          addLog?.(`Đã mở thư mục tiện ích: "${ext.name}"`, 'info');
        } else {
          if (showToast) showToast(res?.error || 'Không thể mở thư mục tiện ích', 'error');
        }
      } catch (err) {
        console.warn('Lỗi mở thư mục tiện ích:', err);
        if (showToast) showToast(`Lỗi: ${err.message}`, 'error');
      }
    }
  };

  // Delete extension
  const handleDelete = async (idOrExt, name) => {
    const ext = typeof idOrExt === 'object' && idOrExt !== null ? idOrExt : extensions.find(e => e.id === idOrExt);
    const extId = ext ? ext.id : idOrExt;
    const extName = ext?.name || name || 'Tiện ích';

    if (confirm(`Bạn có chắc chắn muốn gỡ bỏ tiện ích "${extName}" và xóa toàn bộ mã nguồn của tiện ích này khỏi máy tính?`)) {
      setExtensions(prev => prev.filter(e => e.id !== extId));

      if (window.electronAPI?.deleteExtension) {
        try {
          const target = ext?.folderPath || ext?.extId || extId;
          await window.electronAPI.deleteExtension(target);
        } catch (err) {
          console.warn('Lỗi xóa tệp mã nguồn tiện ích trên đĩa:', err);
        }
      }

      await refreshInstalledExtensions(true);

      addLog?.(`Đã gỡ bỏ và xóa toàn bộ mã nguồn tiện ích "${extName}"`, 'warning');
      if (showToast) showToast(`Đã gỡ bỏ và xóa mã nguồn của "${extName}"`, 'info');
    }
  };

  // 1-Click Install from Store
  const handleAddFromStore = async (storeItem) => {
    if (extensions.some(e => e.extId === storeItem.extId || e.name.toLowerCase() === storeItem.name.toLowerCase())) {
      if (showToast) showToast(`Tiện ích "${storeItem.name}" đã có sẵn trong danh sách!`, 'info');
      return;
    }

    setDownloadingStoreIds(prev => new Set(prev).add(storeItem.id));
    if (showToast) showToast(`Đang tải mã nguồn "${storeItem.name}" từ Chrome Web Store...`, 'info');

    let name = storeItem.name;

    if (window.electronAPI?.downloadStoreExtension) {
      try {
        const res = await window.electronAPI.downloadStoreExtension(storeItem.extId || storeItem.storeUrl);
        if (res && res.success) {
          if (res.name) name = res.name;
        } else if (window.electronAPI?.saveUnpackedExtension) {
          await window.electronAPI.saveUnpackedExtension({
            id: storeItem.extId,
            name: storeItem.name,
            version: storeItem.version,
            description: storeItem.description
          });
        }
      } catch (err) {
        console.warn('Lỗi tải tiện ích từ store:', err);
      }
    }

    await refreshInstalledExtensions(true);

    setDownloadingStoreIds(prev => {
      const next = new Set(prev);
      next.delete(storeItem.id);
      return next;
    });

    addLog?.(`Đã tải và cài đặt tiện ích "${name}" với đầy đủ mã nguồn từ ổ đĩa!`, 'success');
    if (showToast) showToast(`Cài đặt thành công "${name}" vào Quản lý tiện ích!`, 'success');
  };

  // Pick folder
  const handlePickFolder = async () => {
    if (window.electronAPI?.selectExtensionFolder) {
      try {
        const res = await window.electronAPI.selectExtensionFolder();
        if (res && !res.canceled && res.folderPath) {
          setInstallFolder(res);
          return;
        }
      } catch (err) {
        console.warn('Lỗi chọn thư mục tiện ích:', err);
      }
    }
  };

  const handleFolderInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const firstFile = files[0];
      const folderName = firstFile.webkitRelativePath ? firstFile.webkitRelativePath.split('/')[0] : 'Extension Folder';
      const hasManifest = Array.from(files).some(f => f.name === 'manifest.json');
      setInstallFolder({
        folderName,
        folderPath: folderName,
        name: folderName,
        version: '1.0.0',
        description: `Tiện ích mở rộng từ thư mục cục bộ (${folderName}).`,
        hasManifest
      });
    }
  };

  // Pick file
  const handlePickFile = async () => {
    if (window.electronAPI?.selectExtensionFile) {
      try {
        const res = await window.electronAPI.selectExtensionFile();
        if (res && !res.canceled && res.folderPath) {
          setInstallFile({
            name: res.fileName || res.name,
            folderPath: res.folderPath,
            version: res.version || '1.0.0',
            description: res.description,
            hasManifest: res.hasManifest
          });
          return;
        }
      } catch (err) {
        console.warn('Lỗi chọn tệp tiện ích:', err);
      }
    }
  };

  // Paste store url
  const handlePasteStoreUrl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setStoreUrlInput(text.trim());
        if (showToast) showToast('Đã dán liên kết từ bộ nhớ tạm!', 'success');
      } else {
        if (showToast) showToast('Bộ nhớ tạm (Clipboard) đang trống.', 'info');
      }
    } catch (err) {
      if (showToast) showToast('Không thể đọc bộ nhớ tạm. Bạn có thể bấm Ctrl + V để dán.', 'warning');
    }
  };

  // Submit manual install
  const handleInstallSubmit = async (e) => {
    e.preventDefault();

    if (installSource === 'file') {
      if (!installFile) return;
      const cleanName = installFile.name.replace(/\.(zip|crx)$/i, '');
      await refreshInstalledExtensions(true);
      addLog?.(`Cài đặt thành công tiện ích từ file: ${cleanName}`, 'success');
      if (showToast) showToast(`Đã thêm tiện ích "${cleanName}" từ file!`, 'success');
      setShowInstallModal(false);
      setInstallFile(null);
    } else if (installSource === 'folder') {
      if (!installFolder) return;
      const cleanName = installFolder.name || installFolder.folderName || 'Unpacked Extension';
      await refreshInstalledExtensions(true);
      addLog?.(`Cài đặt thành công tiện ích từ thư mục: ${cleanName}`, 'success');
      if (showToast) showToast(`Đã thêm tiện ích "${cleanName}" từ thư mục!`, 'success');
      setShowInstallModal(false);
      setInstallFolder(null);
    } else {
      if (!storeUrlInput.trim()) return;
      const input = storeUrlInput.trim();
      const match = input.match(/([a-z]{32})/i);
      if (!match) {
        if (showToast) showToast('Không tìm thấy Extension ID hợp lệ (cần chuỗi 32 ký tự)', 'error');
        return;
      }

      setIsInstalling(true);
      setInstallProgressText('Đang tải mã nguồn và tệp manifest từ Chrome Web Store...');

      try {
        let extInfo = null;
        if (window.electronAPI?.downloadStoreExtension) {
          const res = await window.electronAPI.downloadStoreExtension(input);
          if (res && res.success) {
            extInfo = res;
          } else {
            if (showToast) showToast(res?.error || 'Không thể tải CRX từ Chrome Web Store', 'error');
            setIsInstalling(false);
            setInstallProgressText('');
            return;
          }
        }

        const extName = extInfo?.name || `Chrome Extension (${(extInfo?.extId || match[1]).slice(0, 8)}...)`;
        await refreshInstalledExtensions(true);

        addLog?.(`Đã tải và cài đặt thành công tiện ích: "${extName}" kèm đầy đủ source code!`, 'success');
        if (showToast) showToast(`Cài đặt thành công "${extName}"!`, 'success');
        setShowInstallModal(false);
        setStoreUrlInput('');
      } catch (err) {
        if (showToast) showToast(`Lỗi: ${err.message}`, 'error');
      } finally {
        setIsInstalling(false);
        setInstallProgressText('');
      }
    }
  };

  // Submit update
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!updateTargetExt || !updateFile) return;

    const parts = updateTargetExt.version.split('.');
    if (parts.length >= 3) {
      parts[2] = String(Number(parts[2]) + 1);
    } else {
      parts.push('1');
    }
    const newVer = parts.join('.');

    setExtensions(prev =>
      prev.map(ext => {
        if (ext.id === updateTargetExt.id) {
          return {
            ...ext,
            version: newVer,
            folderPath: updateFile.folderPath || ext.folderPath,
            size: updateFile.size ? `${(updateFile.size / (1024 * 1024)).toFixed(1)} MB` : ext.size
          };
        }
        return ext;
      })
    );

    addLog?.(`Đã nâng cấp tiện ích "${updateTargetExt.name}" lên v${newVer}`, 'success');
    if (showToast) showToast(`Cập nhật thành công v${newVer} cho "${updateTargetExt.name}"`, 'success');
    setUpdateTargetExt(null);
    setUpdateFile(null);
  };

  // Open assign modal
  const handleOpenAssignModal = (ext) => {
    setAssignTargetExt(ext);
    const hasSpecific = Array.isArray(ext.targetProfileIds) && ext.targetProfileIds.length > 0;
    setAssignAllMode(!hasSpecific);
    setSelectedProfileIds(hasSpecific ? [...ext.targetProfileIds] : []);
    setProfileSearchQuery('');
  };

  // Save assign modal
  const handleSaveAssign = async () => {
    if (!assignTargetExt) return;
    const targetIds = assignAllMode ? [] : selectedProfileIds;
    const assignedCount = assignAllMode ? profiles.length : targetIds.length;

    setExtensions(prev =>
      prev.map(e => {
        if (e.id === assignTargetExt.id) {
          return {
            ...e,
            targetProfileIds: targetIds,
            assignedProfiles: assignedCount
          };
        }
        return e;
      })
    );

    if (window.electronAPI?.saveExtensionConfig) {
      try {
        await window.electronAPI.saveExtensionConfig({
          id: assignTargetExt.id,
          targetProfileIds: targetIds
        });
      } catch (err) {
        console.warn('Lỗi lưu cấu hình phân quyền tiện ích:', err);
      }
    }

    addLog?.(`Đã cập nhật áp dụng tiện ích "${assignTargetExt.name}" cho ${assignedCount} profile`, 'success');
    if (showToast) showToast(`Đã áp dụng tiện ích "${assignTargetExt.name}" cho ${assignedCount} profile!`, 'success');
    setAssignTargetExt(null);
  };

  // Filtered profiles for Assign Modal
  const modalFilteredProfiles = useMemo(() => {
    if (!profileSearchQuery.trim()) return profiles;
    const q = profileSearchQuery.toLowerCase();
    return profiles.filter(p => p.name?.toLowerCase().includes(q) || String(p.id).includes(q));
  }, [profiles, profileSearchQuery]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
        backgroundColor: '#FFFFFF',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* 1. Header with View Switcher */}
      <ExtensionHeader
        activeView={activeView}
        setActiveView={setActiveView}
        extensionsCount={extensions.length}
        storeCount={STORE_CATALOG.length}
        profilesCount={profiles.length}
        isLoading={isLoadingInstalled}
        onRefresh={() => refreshInstalledExtensions(false)}
        onOpenFolder={() => handleOpenFolder({ id: '', name: 'Extensions Root' })}
        onOpenInstallModal={() => {
          setInstallSource('file');
          setInstallFile(null);
          setInstallFolder(null);
          setStoreUrlInput('');
          setShowInstallModal(true);
        }}
      />

      {/* 2. Main Tab: Manager View */}
      {activeView === 'manager' && (
        <ExtensionsManagerTab
          extensions={extensions}
          filteredExtensions={filteredManagerExtensions}
          profilesCount={profiles.length}
          isLoading={isLoadingInstalled}
          search={managerSearch}
          setSearch={setManagerSearch}
          status={managerStatus}
          setStatus={setManagerStatus}
          onToggle={handleToggle}
          onOpenFolder={handleOpenFolder}
          onOpenAssignModal={handleOpenAssignModal}
          onOpenUpdateModal={(ext) => {
            setUpdateTargetExt(ext);
            setUpdateFile(null);
          }}
          onDelete={handleDelete}
          onNavigateToStore={() => setActiveView('store')}
        />
      )}

      {/* 3. Main Tab: Store View */}
      {activeView === 'store' && (
        <ExtensionsStoreTab
          filteredStoreExtensions={filteredStoreExtensions}
          storeSearch={storeSearch}
          setStoreSearch={setStoreSearch}
          installedExtIds={installedExtIds}
          downloadingStoreIds={downloadingStoreIds}
          onAddFromStore={handleAddFromStore}
        />
      )}

      {/* 4. Modal: Install Extension */}
      <InstallExtensionModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        installSource={installSource}
        setInstallSource={setInstallSource}
        installFile={installFile}
        setInstallFile={setInstallFile}
        installFolder={installFolder}
        setInstallFolder={setInstallFolder}
        storeUrlInput={storeUrlInput}
        setStoreUrlInput={setStoreUrlInput}
        isInstalling={isInstalling}
        installProgressText={installProgressText}
        onSubmit={handleInstallSubmit}
        onPickFile={handlePickFile}
        onPickFolder={handlePickFolder}
        onFolderInputChange={handleFolderInputChange}
        onPasteStoreUrl={handlePasteStoreUrl}
      />

      {/* 5. Modal: Update Extension */}
      <UpdateExtensionModal
        targetExt={updateTargetExt}
        updateFile={updateFile}
        setUpdateFile={setUpdateFile}
        onClose={() => setUpdateTargetExt(null)}
        onSubmit={handleUpdateSubmit}
      />

      {/* 6. Modal: Assign Profiles */}
      <AssignProfilesModal
        targetExt={assignTargetExt}
        assignAllMode={assignAllMode}
        setAssignAllMode={setAssignAllMode}
        selectedProfileIds={selectedProfileIds}
        setSelectedProfileIds={setSelectedProfileIds}
        filteredProfiles={modalFilteredProfiles}
        profilesCount={profiles.length}
        searchQuery={profileSearchQuery}
        setSearchQuery={setProfileSearchQuery}
        onClose={() => setAssignTargetExt(null)}
        onSave={handleSaveAssign}
      />
    </div>
  );
}
