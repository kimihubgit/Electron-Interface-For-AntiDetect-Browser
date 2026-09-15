import React, { useRef } from 'react';
import {
  Shield,
  X,
  AlertCircle,
  ChevronDown,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Globe,
  Radio,
  Zap
} from 'lucide-react';
import { COUNTRY_OPTIONS, parseProxyFlexible } from '../utils/proxyConstants';
import { useModalShortcuts } from '../../../hooks/useModalShortcuts';

export default function ProxySingleModal({
  modalMode,
  onClose,
  formData,
  setFormData,
  formError,
  setFormError,
  onSubmit,
  onTestInModal,
  testResultInModal,
  showPasswordInModal,
  setShowPasswordInModal,
  quickParseInput,
  setQuickParseInput,
  showToast
}) {
  const singleFileInputRef = useRef(null);
  useModalShortcuts(!!modalMode, onClose);

  if (!modalMode) return null;

  const handleQuickParse = () => {
    if (!quickParseInput.trim()) {
      setFormError('Vui lòng nhập chuỗi proxy vào ô phân tích!');
      return;
    }
    const parsed = parseProxyFlexible(quickParseInput.trim());
    if (parsed && parsed.host) {
      setFormData((prev) => ({
        ...prev,
        host: parsed.host,
        port: parsed.port || prev.port,
        user: parsed.user || '',
        pass: parsed.pass || '',
        type: parsed.type || prev.type,
        ipVersion: parsed.ipVersion || (parsed.host.includes(':') ? 'IPv6' : prev.ipVersion)
      }));
      setFormError('');
      showToast?.('Đã nhận diện định dạng proxy thành công!');
    } else {
      setFormError('Không thể nhận diện định dạng proxy. Vui lòng kiểm tra lại chuỗi đã nhập!');
    }
  };

  const handlePasteSingleProxy = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        showToast?.('Clipboard trống, không có dữ liệu proxy!');
        return;
      }
      const parsed = parseProxyFlexible(text.trim());
      if (parsed && parsed.host) {
        setFormData((prev) => ({
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
        setFormData((prev) => ({ ...prev, host: text.trim() }));
        showToast?.('Đã dán chuỗi vào ô Host!');
      }
    } catch (err) {
      showToast?.('Không thể đọc clipboard: ' + (err.message || ''));
    }
  };

  const handleSingleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result || '';
      const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) {
        showToast?.('File trống!');
        return;
      }
      const parsed = parseProxyFlexible(lines[0]);
      if (parsed && parsed.host) {
        setFormData((prev) => ({
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

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          width: '580px',
          maxWidth: '94vw',
          backgroundColor: '#FFFFFF',
          borderRadius: '6px',
          border: '1px solid #CBD5E1',
          boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(15, 23, 42, 0.05)',
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
            padding: '15px 20px',
            borderBottom: '1px solid #F1F5F9',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '4px',
                backgroundColor: '#EDE9FE',
                color: 'var(--apidog-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Shield size={17} />
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
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit}>
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {formError && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  color: '#DC2626',
                  padding: '10px 14px',
                  borderRadius: '4px',
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
                      borderRadius: '4px',
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
                  <ChevronDown
                    size={14}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }}
                  />
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
                      borderRadius: '4px',
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
                  <ChevronDown
                    size={14}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }}
                  />
                </div>
              </div>

              <div>
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
                  title="Tải proxy từ tệp (.txt, .csv)"
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.borderColor = '#94A3B8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#CBD5E1';
                  }}
                >
                  <Upload size={14} />
                  <span>Chọn tệp</span>
                </button>
              </div>
            </div>

            {/* Quick Parse Row */}
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  Nhập nhanh chuỗi Proxy (Tự động điền)
                </span>
                <button
                  type="button"
                  onClick={handlePasteSingleProxy}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--apidog-purple)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Dán từ clipboard
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="host:port:user:pass hoặc socks5://user:pass@host:port"
                  value={quickParseInput}
                  onChange={(e) => setQuickParseInput(e.target.value)}
                  style={{
                    flex: 1,
                    height: '32px',
                    padding: '0 10px',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                />
                <button
                  type="button"
                  onClick={handleQuickParse}
                  style={{
                    height: '32px',
                    padding: '0 12px',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Phân tích
                </button>
              </div>
            </div>

            {/* Host & Port */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Địa chỉ IP / Host <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="vd: 154.21.32.88 hoặc 2402:800:..."
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Cổng Port <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="number"
                  placeholder="1080"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
            </div>

            {/* Auth: User & Pass */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Tài khoản (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Username xác thực"
                  value={formData.user}
                  onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                    Mật khẩu (Tùy chọn)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                    style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px', padding: 0 }}
                  >
                    {showPasswordInModal ? <EyeOff size={12} /> : <Eye size={12} />}
                    <span>{showPasswordInModal ? 'Ẩn' : 'Hiện'}</span>
                  </button>
                </div>
                <input
                  type={showPasswordInModal ? 'text' : 'password'}
                  placeholder="Password xác thực"
                  value={formData.pass}
                  onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Country & Note/Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Quốc gia (Tùy chọn)
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 28px 0 10px',
                      borderRadius: '4px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                      appearance: 'none',
                      WebkitAppearance: 'none'
                    }}
                  >
                    <option value="">Tự động nhận diện</option>
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Tên gợi nhớ / Ghi chú
                </label>
                <input
                  type="text"
                  placeholder="vd: Proxy nuôi nick US 01"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Test Connection Result Box */}
            {testResultInModal && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '4px',
                  border:
                    testResultInModal.status === 'success'
                      ? '1px solid #BBF7D0'
                      : testResultInModal.status === 'error'
                      ? '1px solid #FECACA'
                      : '1px solid #CBD5E1',
                  backgroundColor:
                    testResultInModal.status === 'success'
                      ? '#F0FDF4'
                      : testResultInModal.status === 'error'
                      ? '#FEF2F2'
                      : '#F8FAFC',
                  color:
                    testResultInModal.status === 'success'
                      ? '#15803D'
                      : testResultInModal.status === 'error'
                      ? '#DC2626'
                      : '#475569',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {testResultInModal.status === 'testing' && <RefreshCw size={14} className="spin-anim" />}
                {testResultInModal.status === 'success' && <CheckCircle2 size={14} style={{ color: '#16A34A' }} />}
                {testResultInModal.status === 'error' && <AlertTriangle size={14} style={{ color: '#DC2626' }} />}
                <div style={{ flex: 1 }}>
                  <span>{testResultInModal.message}</span>
                  {testResultInModal.status === 'success' && testResultInModal.latency && (
                    <strong style={{ marginLeft: '6px' }}>• Ping: {testResultInModal.latency}ms</strong>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 22px',
              borderTop: '1px solid #F1F5F9',
              backgroundColor: '#F8FAFC'
            }}
          >
            {/* Test Connection Button */}
            <button
              type="button"
              onClick={onTestInModal}
              disabled={testResultInModal?.status === 'testing'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '34px',
                padding: '0 14px',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                fontSize: '12px',
                fontWeight: 600,
                cursor: testResultInModal?.status === 'testing' ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Zap size={13} style={{ color: 'var(--apidog-purple)' }} />
              <span>{testResultInModal?.status === 'testing' ? 'Đang kiểm tra...' : 'Kiểm tra Proxy'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  height: '34px',
                  padding: '0 16px',
                  borderRadius: '4px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>

              <button
                type="submit"
                style={{
                  height: '34px',
                  padding: '0 18px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: 'var(--apidog-purple)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(124, 58, 237, 0.25)',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--apidog-purple)')}
              >
                {modalMode === 'add' ? 'Thêm proxy' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
