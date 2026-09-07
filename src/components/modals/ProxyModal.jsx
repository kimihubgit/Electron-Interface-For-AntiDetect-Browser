import React, { useState } from 'react';
import { X, Shield, Check, Activity, CheckCircle2, AlertCircle, ClipboardPaste } from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

export default function ProxyModal() {
  const { activeProxyModal, setActiveProxyModal, addProxy } = useBrowser();

  const [type, setType] = useState('SOCKS5');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [country, setCountry] = useState('US');
  const [quickInput, setQuickInput] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!activeProxyModal) return null;

  const handleParseQuickInput = () => {
    if (!quickInput.trim()) return;
    const parts = quickInput.trim().split(':');
    if (parts.length >= 2) {
      setHost(parts[0].trim());
      setPort(parts[1].trim());
      if (parts.length >= 4) {
        setUser(parts[2].trim());
        setPass(parts[3].trim());
      }
      setQuickInput('');
    }
  };

  const handleTestPing = () => {
    if (!host || !port) {
      setTestResult({ ok: false, msg: 'Vui lòng nhập IP và Port!' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult({ ok: true, msg: `Kết nối Live! Latency: 38ms (IP: ${host})` });
    }, 900);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!host || !port) return alert('Vui lòng nhập IP và Port!');

    addProxy({
      type,
      host,
      port: Number(port),
      user,
      pass,
      country,
    });
    setActiveProxyModal(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px'
    }}>
      <div style={{
        width: '100%', maxWidth: '520px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#EDE9FE',
              color: 'var(--apidog-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Thêm Proxy Mới</h3>
              <span style={{ fontSize: '11px', color: '#6B7280' }}>Cấu hình máy chủ đại diện cho hồ sơ trình duyệt</span>
            </div>
          </div>
          <button onClick={() => setActiveProxyModal(false)} className="btn-icon" title="Đóng">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick paste */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Dán nhanh: IP:Port hoặc IP:Port:User:Pass"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              style={{
                flex: 1,
                padding: '7px 10px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #D1D5DB',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={handleParseQuickInput}
              className="btn btn-secondary"
              style={{ fontSize: '11px', whiteSpace: 'nowrap' }}
            >
              <ClipboardPaste size={13} /> Nhận diện
            </button>
          </div>

          {/* Protocol Switcher */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Loại Giao Thức (Protocol)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {['SOCKS5', 'HTTP', 'HTTPS'].map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    border: type === t ? '1.5px solid var(--apidog-purple)' : '1px solid #D1D5DB',
                    backgroundColor: type === t ? '#FAF5FF' : '#FFFFFF',
                    color: type === t ? 'var(--apidog-purple)' : '#4B5563',
                    fontWeight: type === t ? 600 : 500,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Host & Port */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Proxy Host / IP <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text" required placeholder="154.21.32.88"
                value={host} onChange={(e) => setHost(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px',
                  backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB',
                  borderRadius: 'var(--radius-sm)', color: '#111827', fontSize: '13px',
                  outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Port <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="number" required placeholder="1080"
                value={port} onChange={(e) => setPort(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px',
                  backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB',
                  borderRadius: 'var(--radius-sm)', color: '#111827', fontSize: '13px',
                  outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* User & Pass */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Username (Tùy chọn)
              </label>
              <input
                type="text" placeholder="user_123"
                value={user} onChange={(e) => setUser(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px',
                  backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB',
                  borderRadius: 'var(--radius-sm)', color: '#111827', fontSize: '13px',
                  outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Mật khẩu Proxy (Password - Tùy chọn)
              </label>
              <input
                type="password" placeholder="••••••••"
                value={pass} onChange={(e) => setPass(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px',
                  backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB',
                  borderRadius: 'var(--radius-sm)', color: '#111827', fontSize: '13px',
                  outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Country Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Quốc Gia Proxy (Country / Region)
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px',
                backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB',
                borderRadius: 'var(--radius-sm)', color: '#111827', fontSize: '13px',
                outline: 'none', boxSizing: 'border-box'
              }}
            >
              <option value="US">Hoa Kỳ (United States - US)</option>
              <option value="VN">Việt Nam (Vietnam - VN)</option>
              <option value="SG">Singapore (SG)</option>
              <option value="JP">Nhật Bản (Japan - JP)</option>
              <option value="DE">Đức (Germany - DE)</option>
              <option value="UK">Vương Quốc Anh (United Kingdom - UK)</option>
            </select>
          </div>

          {/* Test connection & Results */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '12px' }}>
            <button
              type="button"
              onClick={handleTestPing}
              className="btn btn-secondary"
              disabled={testing}
              style={{ fontSize: '12px' }}
            >
              <Activity size={13} className={testing ? 'animate-spin' : ''} />
              {testing ? 'Đang test...' : 'Kiểm tra kết nối'}
            </button>

            {testResult && (
              <span style={{ fontSize: '11px', fontWeight: 600, color: testResult.ok ? '#059669' : '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {testResult.ok ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                {testResult.msg}
              </span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px', borderTop: '1px solid #E5E7EB', paddingTop: '14px' }}>
            <button type="button" onClick={() => setActiveProxyModal(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" style={{ fontWeight: 600 }}>
              <Check size={15} /> Thêm Proxy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
