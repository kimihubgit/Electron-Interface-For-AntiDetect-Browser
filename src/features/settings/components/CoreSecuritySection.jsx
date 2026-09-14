import React, { useState, useEffect } from 'react';
import ToggleSwitch from './ToggleSwitch';
import { Cpu, Download, HardDrive, Check, Star } from 'lucide-react';
import BrowserCoreManagerModal from '../../../components/modals/BrowserCoreManagerModal';
import { getStoredBrowserCores } from '../../../services/browserCoreService';

export default function CoreSecuritySection({
  chromiumPath,
  setChromiumPath,
  encryptLocalStorage,
  setEncryptLocalStorage
}) {
  const [isCoreModalOpen, setIsCoreModalOpen] = useState(false);
  const [cores, setCores] = useState(() => getStoredBrowserCores());

  useEffect(() => {
    const handleCoresUpdated = () => {
      setCores(getStoredBrowserCores());
    };
    window.addEventListener('antidetect-cores-updated', handleCoresUpdated);
    return () => window.removeEventListener('antidetect-cores-updated', handleCoresUpdated);
  }, []);

  const installedCores = cores.filter(c => c.isInstalled);

  return (
    <div id="setting-section-core">
      <div style={{
        fontSize: '12px',
        fontWeight: 700,
        color: '#4B5563',
        letterSpacing: '0.5px',
        marginBottom: '8px'
      }}>
        LÕI CHROMIUM VÀ BẢO MẬT HỆ THỐNG
      </div>

      <div style={{
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Browser Core Center Box */}
        <div style={{
          padding: '14px',
          borderRadius: '8px',
          border: '1px solid #BFDBFE',
          backgroundColor: '#F0F7FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cpu size={20} />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E293B' }}>
                Quản lý Lõi Trình duyệt (Browser Core Manager)
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Đang có <strong>{installedCores.length} lõi</strong> đã tải về ({cores.length - installedCores.length} lõi sẵn sàng cập nhật trên đám mây)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCoreModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
          >
            <Download size={13} />
            <span>Xem & Tải lõi mới</span>
          </button>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
            Đường Dẫn Chromium Core Executable
          </label>
          <input
            type="text"
            value={chromiumPath}
            onChange={(e) => setChromiumPath(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#F9FAFB',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              color: '#111827',
              fontSize: '12px',
              fontFamily: 'Consolas, monospace',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #F3F4F6' }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: '13px', color: '#111827', display: 'block' }}>
              Mã Hóa Hồ Sơ Cục Bộ (AES-256)
            </span>
            <span style={{ fontSize: '11.5px', color: '#6B7280' }}>
              Mã hóa an toàn mật khẩu và proxy lưu trữ trên ổ đĩa cứng
            </span>
          </div>
          <ToggleSwitch checked={encryptLocalStorage} onChange={setEncryptLocalStorage} />
        </div>
      </div>

      <BrowserCoreManagerModal
        isOpen={isCoreModalOpen}
        onClose={() => setIsCoreModalOpen(false)}
      />
    </div>
  );
}
