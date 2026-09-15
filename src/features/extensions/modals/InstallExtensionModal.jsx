import React, { useRef } from 'react';
import { X, FileArchive, FolderOpen, ShoppingBag, RotateCw, Clipboard } from 'lucide-react';

export default function InstallExtensionModal({
  isOpen,
  onClose,
  installSource,
  setInstallSource,
  installFile,
  setInstallFile,
  installFolder,
  setInstallFolder,
  storeUrlInput,
  setStoreUrlInput,
  isInstalling,
  installProgressText,
  onSubmit,
  onPickFile,
  onPickFolder,
  onFolderInputChange,
  onPasteStoreUrl
}) {
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC'
          }}
        >
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Thêm Tiện Ích Mở Rộng Thủ Công
            </h3>
            <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
              Cài từ tệp zip/crx, thư mục Unpacked hoặc Chrome Web Store URL
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isInstalling}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div
              onClick={() => !isInstalling && setInstallSource('file')}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: `1.5px solid ${installSource === 'file' ? '#7C3AED' : '#E2E8F0'}`,
                backgroundColor: installSource === 'file' ? '#F5F3FF' : '#FFFFFF',
                cursor: isInstalling ? 'not-allowed' : 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FileArchive size={13} color={installSource === 'file' ? '#7C3AED' : '#64748B'} />
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: installSource === 'file' ? '#7C3AED' : '#0F172A' }}>
                  Tệp .zip / .crx
                </span>
              </div>
              <p style={{ fontSize: '10px', color: '#64748B', margin: '2px 0 0 0' }}>Tệp đóng gói</p>
            </div>

            <div
              onClick={() => !isInstalling && setInstallSource('folder')}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: `1.5px solid ${installSource === 'folder' ? '#10B981' : '#E2E8F0'}`,
                backgroundColor: installSource === 'folder' ? '#ECFDF5' : '#FFFFFF',
                cursor: isInstalling ? 'not-allowed' : 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FolderOpen size={13} color={installSource === 'folder' ? '#10B981' : '#64748B'} />
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: installSource === 'folder' ? '#059669' : '#0F172A' }}>
                  Thư mục
                </span>
              </div>
              <p style={{ fontSize: '10px', color: '#64748B', margin: '2px 0 0 0' }}>Unpacked folder</p>
            </div>

            <div
              onClick={() => !isInstalling && setInstallSource('store')}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: `1.5px solid ${installSource === 'store' ? '#7C3AED' : '#E2E8F0'}`,
                backgroundColor: installSource === 'store' ? '#F5F3FF' : '#FFFFFF',
                cursor: isInstalling ? 'not-allowed' : 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShoppingBag size={13} color={installSource === 'store' ? '#7C3AED' : '#64748B'} />
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: installSource === 'store' ? '#7C3AED' : '#0F172A' }}>
                  Web Store
                </span>
              </div>
              <p style={{ fontSize: '10px', color: '#64748B', margin: '2px 0 0 0' }}>Link hoặc ID</p>
            </div>
          </div>

          {/* View 1: File .zip / .crx */}
          {installSource === 'file' && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".zip,.crx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setInstallFile({
                      name: file.name,
                      size: file.size,
                      folderPath: ''
                    });
                  }
                }}
                style={{ display: 'none' }}
              />
              <div
                onClick={() => onPickFile ? onPickFile() : fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: installFile ? '#F0FDF4' : '#F8FAFC'
                }}
              >
                <FileArchive size={24} style={{ color: installFile ? '#16A34A' : '#7C3AED', margin: '0 auto 6px auto' }} />
                {installFile ? (
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A' }}>
                      {installFile.name}
                    </span>
                    <p style={{ fontSize: '10.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                      Đã chọn tệp • Nhấn để chọn file khác
                    </p>
                  </div>
                ) : (
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                      Bấm vào đây để chọn tệp .zip hoặc .crx
                    </span>
                    <p style={{ fontSize: '10.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                      Tự động giải nén và nạp manifest vào trình duyệt
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* View 2: Folder Unpacked */}
          {installSource === 'folder' && (
            <div>
              <input
                type="file"
                ref={folderInputRef}
                webkitdirectory="true"
                directory="true"
                onChange={onFolderInputChange}
                style={{ display: 'none' }}
              />
              <div
                onClick={() => onPickFolder ? onPickFolder() : folderInputRef.current?.click()}
                style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: installFolder ? '#ECFDF5' : '#F8FAFC'
                }}
              >
                <FolderOpen size={24} style={{ color: installFolder ? '#059669' : '#10B981', margin: '0 auto 6px auto' }} />
                {installFolder ? (
                  <div>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#065F46' }}>
                      {installFolder.name || installFolder.folderName}
                    </span>
                    <p style={{ fontSize: '10.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                      Thư mục: {installFolder.folderPath || installFolder.folderName} • Nhấn để đổi
                    </p>
                  </div>
                ) : (
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                      Bấm vào đây để chọn thư mục Extension (Unpacked)
                    </span>
                    <p style={{ fontSize: '10.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                      Thư mục chứa file <strong>manifest.json</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* View 3: Chrome Web Store URL */}
          {installSource === 'store' && (
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Đường dẫn Chrome Web Store hoặc Extension ID
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  required
                  disabled={isInstalling}
                  value={storeUrlInput}
                  onChange={(e) => setStoreUrlInput(e.target.value)}
                  placeholder="https://chromewebstore.google.com/detail/... hoặc 32 ký tự ID"
                  style={{
                    width: '100%',
                    padding: '8px 84px 8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7C3AED';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#CBD5E1';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {storeUrlInput && (
                    <button
                      type="button"
                      onClick={() => setStoreUrlInput('')}
                      disabled={isInstalling}
                      title="Xóa liên kết đã nhập"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#F1F5F9',
                        color: '#64748B',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={12} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onPasteStoreUrl}
                    disabled={isInstalling}
                    title="Dán từ Clipboard (Bộ nhớ tạm)"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '5px',
                      border: '1px solid #DDD6FE',
                      backgroundColor: '#F5F3FF',
                      color: '#7C3AED',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: isInstalling ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#EDE9FE';
                      e.currentTarget.style.borderColor = '#C4B5FD';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F5F3FF';
                      e.currentTarget.style.borderColor = '#DDD6FE';
                    }}
                  >
                    <Clipboard size={12} />
                    <span>Dán</span>
                  </button>
                </div>
              </div>
              {isInstalling ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: '#7C3AED', fontSize: '11px', fontWeight: 600 }}>
                  <RotateCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>{installProgressText || 'Đang tải xuống và giải nén tệp mã nguồn...'}</span>
                </div>
              ) : (
                <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', marginTop: '3px' }}>
                  Ứng dụng sẽ tự động tải CRX từ máy chủ Chrome Web Store, giải nén toàn bộ tệp source code vào thư mục máy tính.
                </span>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
            <button
              type="button"
              disabled={isInstalling}
              onClick={onClose}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                cursor: isInstalling ? 'not-allowed' : 'pointer'
              }}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={
                isInstalling ||
                (installSource === 'file' && !installFile) ||
                (installSource === 'folder' && !installFolder) ||
                (installSource === 'store' && !storeUrlInput.trim())
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isInstalling ? '#A78BFA' : '#7C3AED',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: isInstalling ? 'not-allowed' : 'pointer'
              }}
            >
              {isInstalling && <RotateCw size={12} style={{ animation: 'spin 1s linear infinite' }} />}
              <span>{isInstalling ? 'Đang tải...' : 'Cài đặt ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
