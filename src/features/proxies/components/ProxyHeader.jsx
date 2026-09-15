import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Layers,
  RotateCw,
  Smartphone,
  Cpu,
  RefreshCw,
  Upload,
  Plus,
  ChevronDown
} from 'lucide-react';

export default function ProxyHeader({
  activeSubTab,
  setActiveSubTab,
  proxiesCount = 0,
  rotatingCount = 0,
  dcomCount = 0,
  ipv6Count = 0,
  handleCheckAll,
  isCheckingAll,
  onOpenBulkModal,
  onOpenAddModal,
  onOpenAddRotatingModal,
  onOpenAddDcomModal
}) {
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsAddDropdownOpen(false);
      }
    };
    if (isAddDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAddDropdownOpen]);

  const SUB_TABS = [
    { id: 'pool', label: 'Proxy Tĩnh', count: proxiesCount, icon: Layers },
    { id: 'rotating', label: 'Proxy Xoay (API)', count: rotatingCount, icon: RotateCw },
    { id: 'dcom', label: 'Thiết Bị DCOM 4G', count: dcomCount, icon: Smartphone },
    { id: 'ipv6', label: 'Sinh IPv6 Subnet', count: ipv6Count, icon: Cpu }
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        flexShrink: 0
      }}
    >
      {/* Left: Title & Sub-tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#EDE9FE',
              color: 'var(--apidog-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Shield size={16} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              Quản Lý Proxy
            </h2>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Kho kết nối proxy tĩnh, proxy xoay dân cư, DCOM 4G và dải IPv6
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F1F5F9',
            padding: '3px',
            borderRadius: '6px',
            gap: '2px'
          }}
        >
          {SUB_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? '#0F172A' : '#64748B',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 1px 2px rgba(0, 0, 0, 0.06)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={13} style={{ color: isActive ? 'var(--apidog-purple)' : '#94A3B8' }} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '0 5px',
                      borderRadius: '10px',
                      backgroundColor: isActive ? '#EDE9FE' : '#E2E8F0',
                      color: isActive ? 'var(--apidog-purple)' : '#64748B',
                      fontWeight: 600
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Quick Action Buttons */}
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
                gap: '6px',
                height: '32px',
                padding: '0 12px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                fontSize: '12.5px',
                fontWeight: 500,
                cursor: isCheckingAll ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <RefreshCw size={13} className={isCheckingAll ? 'spin-anim' : ''} />
              <span>{isCheckingAll ? 'Đang test ping...' : 'Kiểm tra Ping'}</span>
            </button>

            {/* Bulk Import Button */}
            <button
              onClick={onOpenBulkModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '32px',
                padding: '0 12px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                fontSize: '12.5px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Upload size={13} />
              <span>Nhập hàng loạt</span>
            </button>

            {/* Split Button: Thêm Proxy + Dropdown Chevron */}
            <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={onOpenAddModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '32px',
                  padding: '0 12px 0 14px',
                  borderTopLeftRadius: '6px',
                  borderBottomLeftRadius: '6px',
                  borderTopRightRadius: '0',
                  borderBottomRightRadius: '0',
                  border: 'none',
                  backgroundColor: 'var(--apidog-purple)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(124, 58, 237, 0.25)',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--apidog-purple)')}
                title="Thêm Proxy mới"
              >
                <Plus size={15} />
                <span>Thêm Proxy</span>
              </button>

              {/* Vertical Divider */}
              <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

              {/* Dropdown Chevron Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddDropdownOpen((prev) => !prev);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '32px',
                  width: '24px',
                  borderTopRightRadius: '6px',
                  borderBottomRightRadius: '6px',
                  borderTopLeftRadius: '0',
                  borderBottomLeftRadius: '0',
                  border: 'none',
                  backgroundColor: isAddDropdownOpen ? 'var(--apidog-purple-hover)' : 'var(--apidog-purple)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(124, 58, 237, 0.25)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)')}
                onMouseLeave={(e) => {
                  if (!isAddDropdownOpen) e.currentTarget.style.backgroundColor = 'var(--apidog-purple)';
                }}
                title="Tùy chọn thêm Proxy"
              >
                <ChevronDown
                  size={12}
                  style={{
                    transform: isAddDropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.18s ease'
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              {isAddDropdownOpen && (
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
                      setIsAddDropdownOpen(false);
                      onOpenAddModal();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 0.12s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#EDE9FE',
                        color: 'var(--apidog-purple)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Plus size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>Thêm Proxy đơn</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Thêm từng proxy qua biểu mẫu</div>
                    </div>
                  </div>

                  {/* Option 2: Nhập hàng loạt */}
                  <div
                    onClick={() => {
                      setIsAddDropdownOpen(false);
                      onOpenBulkModal();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 0.12s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Upload size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>Nhập hàng loạt</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Dán danh sách hoặc tải tệp .TXT/.CSV</div>
                    </div>
                  </div>

                  <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '4px 0' }} />

                  {/* Option 3: Thêm proxy xoay */}
                  <div
                    onClick={() => {
                      setIsAddDropdownOpen(false);
                      setActiveSubTab('rotating');
                      onOpenAddRotatingModal();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 0.12s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#FEF3C7',
                        color: '#D97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <RotateCw size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>Thêm Proxy Xoay (API)</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>TMProxy, TinProxy, ProxyNo1...</div>
                    </div>
                  </div>

                  {/* Option 4: Thêm DCOM */}
                  <div
                    onClick={() => {
                      setIsAddDropdownOpen(false);
                      setActiveSubTab('dcom');
                      onOpenAddDcomModal();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 0.12s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#ECFDF5',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Smartphone size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>Kết nối DCOM 4G</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Huawei, ZTE USB Dongle</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeSubTab === 'rotating' && (
          <button
            onClick={onOpenAddRotatingModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '32px',
              padding: '0 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--apidog-purple)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(124, 58, 237, 0.25)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--apidog-purple)')}
          >
            <Plus size={15} />
            <span>+ Thêm Proxy Xoay</span>
          </button>
        )}

        {activeSubTab === 'dcom' && (
          <button
            onClick={onOpenAddDcomModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '32px',
              padding: '0 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--apidog-purple)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(124, 58, 237, 0.25)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--apidog-purple)')}
          >
            <Plus size={15} />
            <span>+ Kết nối DCOM mới</span>
          </button>
        )}
      </div>
    </div>
  );
}
