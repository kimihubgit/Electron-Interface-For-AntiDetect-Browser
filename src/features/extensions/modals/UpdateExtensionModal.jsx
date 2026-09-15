import React, { useRef } from 'react';
import { X, RotateCw } from 'lucide-react';

export default function UpdateExtensionModal({
  targetExt,
  updateFile,
  setUpdateFile,
  onClose,
  onSubmit
}) {
  const updateFileInputRef = useRef(null);

  if (!targetExt) return null;

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
          maxWidth: '440px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC'
          }}
        >
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Cập nhật: {targetExt.name}
            </h3>
            <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
              Phiên bản hiện tại: v{targetExt.version}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="file"
            ref={updateFileInputRef}
            accept=".zip,.crx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setUpdateFile({
                  name: file.name,
                  size: file.size
                });
              }
            }}
            style={{ display: 'none' }}
          />
          <div
            onClick={() => {
              if (window.electronAPI?.selectExtensionFile) {
                window.electronAPI.selectExtensionFile().then((res) => {
                  if (res && !res.canceled) {
                    setUpdateFile({
                      name: res.fileName || res.name,
                      folderPath: res.folderPath
                    });
                  }
                });
              } else {
                updateFileInputRef.current?.click();
              }
            }}
            style={{
              border: '2px dashed #CBD5E1',
              borderRadius: '8px',
              padding: '18px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: updateFile ? '#F0FDF4' : '#F8FAFC'
            }}
          >
            <RotateCw size={22} style={{ color: updateFile ? '#16A34A' : '#7C3AED', margin: '0 auto 6px auto' }} />
            {updateFile ? (
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A' }}>
                  {updateFile.name}
                </span>
                <p style={{ fontSize: '10px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Đã sẵn sàng nâng cấp phiên bản
                </p>
              </div>
            ) : (
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                  Chọn gói .zip / .crx phiên bản mới
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!updateFile}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: updateFile ? '#7C3AED' : '#CBD5E1',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: updateFile ? 'pointer' : 'not-allowed'
              }}
            >
              Nâng cấp phiên bản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
