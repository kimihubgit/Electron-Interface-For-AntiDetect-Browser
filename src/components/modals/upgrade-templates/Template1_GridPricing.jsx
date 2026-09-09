import React, { useState } from 'react';
import {
  X,
  Check,
  Monitor,
  Sparkles,
  Rocket,
  ShieldCheck,
  Copy,
  QrCode,
  CreditCard,
  Key,
  ArrowLeft,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useBrowser } from '../../../store/BrowserContext';

export default function Template1_GridPricing() {
  const { activeUpgradeModal, setActiveUpgradeModal, currentPlan, setCurrentPlan, addLog } = useBrowser();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentTab, setPaymentTab] = useState('qr'); // 'qr' | 'crypto' | 'key'
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  if (!activeUpgradeModal) return null;

  const plans = [
    {
      id: 'monthly',
      title: 'Thuê theo tháng',
      badge: 'PHỔ BIẾN',
      badgeType: 'popular',
      price: '$9',
      unit: '/tháng/key',
      priceVnd: '225.000 VNĐ',
      devices: '1 thiết bị cho mỗi key',
      popular: true,
      features: [
        'Không giới hạn profile',
        'Hỗ trợ proxy',
        'API & automation',
        'Cập nhật phần mềm'
      ],
      btnVariant: 'primary'
    },
    {
      id: 'starter',
      title: 'Starter',
      badge: 'VĨNH VIỄN',
      badgeType: 'lifetime',
      price: '$99',
      unit: ' một lần',
      priceVnd: '2.450.000 VNĐ',
      devices: 'Bao gồm 1 thiết bị',
      popular: false,
      features: [
        'Không giới hạn profile',
        'Hỗ trợ proxy',
        'API & automation',
        'Cập nhật phần mềm'
      ],
      btnVariant: 'outline'
    },
    {
      id: 'team-3',
      title: 'Team-3',
      badge: 'VĨNH VIỄN',
      badgeType: 'lifetime',
      price: '$199',
      unit: ' một lần',
      priceVnd: '4.950.000 VNĐ',
      devices: 'Bao gồm 3 thiết bị',
      popular: false,
      features: [
        'Không giới hạn profile',
        'Hỗ trợ proxy',
        'API & automation',
        'Cập nhật phần mềm'
      ],
      btnVariant: 'outline'
    },
    {
      id: 'team-5',
      title: 'Team-5',
      badge: 'VĨNH VIỄN',
      badgeType: 'lifetime',
      price: '$299',
      unit: ' một lần',
      priceVnd: '7.450.000 VNĐ',
      devices: 'Bao gồm 5 thiết bị',
      popular: false,
      features: [
        'Không giới hạn profile',
        'Hỗ trợ proxy',
        'API & automation',
        'Cập nhật phần mềm'
      ],
      btnVariant: 'outline'
    }
  ];

  const handleCopy = (text, field) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleActivatePlan = (planName) => {
    setPurchaseSuccess(true);
    setCurrentPlan(planName);
    addLog('Kích hoạt thành công ' + planName, 'success');
    setTimeout(() => {
      setPurchaseSuccess(false);
      setSelectedPlan(null);
      setActiveUpgradeModal(false);
    }, 2200);
  };

  const handleKeySubmit = (e) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) return;
    const planName = selectedPlan ? selectedPlan.title : 'Bản Quyền Pro'; 
    handleActivatePlan(planName);
  };

  return (
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
      zIndex: 1000,
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        width: '100%',
        maxWidth: '1160px',
        maxHeight: '92vh',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Fixed Close button */}
        <button
          onClick={() => {
            setSelectedPlan(null);
            setActiveUpgradeModal(false);
          }}
          title='Đóng'
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: '#F3F4F6',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B7280',
            cursor: 'pointer',
            zIndex: 50,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E5E7EB';
            e.currentTarget.style.color = '#111827';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F3F4F6';
            e.currentTarget.style.color = '#6B7280';
          }}
        >
          <X size={18} />
        </button>

        {/* Scrollable body content */}
        <div className="no-scrollbar" style={{
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>

        {/* Header */}
        <div style={{ padding: '36px 36px 20px', textAlign: 'center', position: 'relative' }}>
          {selectedPlan && (
            <button
              onClick={() => setSelectedPlan(null)}
              style={{
                position: 'absolute',
                left: '36px',
                top: '36px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: '#2563EB',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} /> Quay lại bảng giá
            </button>
          )}

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            borderRadius: '20px',
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            <Sparkles size={14} /> GÓI NÂNG CẤP BẢN QUYỀN
          </div>

          <h2 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 8px',
            letterSpacing: '-0.5px'
          }}>
            {selectedPlan ? ('Thanh Toán ' + selectedPlan.title) : 'Chọn Gói Bản Quyền Phù Hợp'}
          </h2>

          <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '640px', margin: '0 auto', lineHeight: '1.5' }}>
            {selectedPlan 
              ? 'Hoàn tất thủ tục thanh toán hoặc nhập mã License Key để kích hoạt ngay' 
              : 'Mở khóa toàn bộ sức mạnh Antidetect Browser với không giới hạn profile, proxy đa nhiệm và tự động hóa'
            }
          </p>
        </div>

        {/* Content */}
        {!selectedPlan ? (
          <div style={{ padding: '10px 36px 36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 4 Cards Grid - Exactly matching user screenshot */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', alignItems: 'stretch' }}>
              {plans.map(plan => {
                const isPopular = plan.popular;
                return (
                  <div
                    key={plan.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: isPopular ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      boxShadow: isPopular 
                        ? '0 10px 25px -5px rgba(37, 99, 235, 0.15)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.04)',
                      padding: '24px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                  >
                    <div>
                      {/* Badge: PHỔ BIẾN or VĨNH VIỄN */}
                      <div style={{ marginBottom: '14px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.4px',
                          backgroundColor: plan.badgeType === 'popular' ? '#E6F9EE' : '#F1F5F9',
                          color: plan.badgeType === 'popular' ? '#16A34A' : '#64748B'
                        }}>
                          {plan.badge}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: '0 0 16px' }}>
                        {plan.title}
                      </h3>

                      {/* Price */}
                      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '16px' }}>
                        <span style={{ fontSize: '34px', fontWeight: 800, color: '#0F172A', letterSpacing: '-1px' }}>
                          {plan.price}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B', marginLeft: '3px' }}>
                          {plan.unit}
                        </span>
                      </div>

                      {/* Device Pill */}
                      <div style={{
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        borderRadius: '10px',
                        padding: '7px 10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        marginBottom: '20px'
                      }}>
                        <Monitor size={15} style={{ flexShrink: 0 }} />
                        <span>{plan.devices}</span>
                      </div>

                      {/* Features with green checkmarks */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                        {plan.features.map((feat, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                            <Check size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      style={{
                        width: '100%',
                        padding: '10px 0',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: plan.btnVariant === 'primary' ? 'none' : '1.5px solid #2563EB',
                        backgroundColor: plan.btnVariant === 'primary' ? '#2563EB' : 'transparent',
                        color: plan.btnVariant === 'primary' ? '#FFFFFF' : '#2563EB',
                        boxShadow: plan.btnVariant === 'primary' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
                      }}
                    >
                      Bắt đầu
                    </button>
                  </div>
                );
              })}
            </div>

            {/* License key strip */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Key size={18} style={{ color: '#2563EB' }} />
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    Đã mua key bản quyền trước đó?
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '8px' }}>
                    Nhập mã key gồm 16 ký tự để kích hoạt bản quyền ngay lập tức
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPlan(plans[0]);
                  setPaymentTab('key');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#2563EB',
                  cursor: 'pointer'
                }}
              >
                <span>Nhập mã kích hoạt</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* Checkout View */
          <div style={{ padding: '10px 36px 36px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px' }}>
            {/* Left Column */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: selectedPlan.badgeType === 'popular' ? '#E6F9EE' : '#F1F5F9',
                  color: selectedPlan.badgeType === 'popular' ? '#16A34A' : '#64748B',
                  marginBottom: '10px'
                }}>
                  {selectedPlan.badge}
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                  {selectedPlan.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px' }}>
                  Bản quyền Antidetect Browser Nexus
                </p>
                <div style={{ padding: '16px 0', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>Giá gói:</span>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB' }}>
                      {selectedPlan.price + ' ' + selectedPlan.unit}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>Quy đổi (VNĐ):</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                      {selectedPlan.priceVnd}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
                    <Monitor size={14} style={{ color: '#2563EB' }} />
                    <span>{selectedPlan.devices}</span>
                  </div>
                  {selectedPlan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
                      <Check size={14} style={{ color: '#16A34A' }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: '24px', padding: '12px', backgroundColor: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1D4ED8', fontSize: '11px' }}>
                <ShieldCheck size={16} style={{ flexShrink: 0 }} />
                <span>Bảo hành hoàn tiền 100% trong 7 ngày nếu không tương thích.</span>
              </div>
            </div>

            {/* Right Column: Payment Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', gap: '8px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
                <button
                  onClick={() => setPaymentTab('qr')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: paymentTab === 'qr' ? '#FFFFFF' : 'transparent',
                    color: paymentTab === 'qr' ? '#2563EB' : '#64748B',
                    fontWeight: paymentTab === 'qr' ? 700 : 500,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <QrCode size={15} /> VietQR / Ngân Hàng
                </button>
                <button
                  onClick={() => setPaymentTab('crypto')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: paymentTab === 'crypto' ? '#FFFFFF' : 'transparent',
                    color: paymentTab === 'crypto' ? '#2563EB' : '#64748B',
                    fontWeight: paymentTab === 'crypto' ? 700 : 500,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <CreditCard size={15} /> Crypto USDT
                </button>
                <button
                  onClick={() => setPaymentTab('key')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: paymentTab === 'key' ? '#FFFFFF' : 'transparent',
                    color: paymentTab === 'key' ? '#2563EB' : '#64748B',
                    fontWeight: paymentTab === 'key' ? 700 : 500,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Key size={15} /> Nhập License Key
                </button>
              </div>

              {paymentTab === 'qr' && (
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{ width: '160px', height: '160px', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6px', flexShrink: 0 }}>
                    <img
                      src={'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=2|99|0988888888|MB|NEXUS_' + selectedPlan.id.toUpperCase() + '|0|0|' + selectedPlan.priceVnd.replace(/\D/g, '')}
                      alt='VietQR'
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Ngân hàng thụ hưởng:</span>
                      <strong style={{ fontSize: '14px', color: '#0F172A' }}>MB Bank (Ngân hàng Quân Đội)</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Số tài khoản:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <code style={{ fontSize: '16px', fontWeight: 700, color: '#2563EB', fontFamily: 'monospace' }}>0988888888</code>
                        <button
                          onClick={() => handleCopy('0988888888', 'stk')}
                          style={{ border: '1px solid #CBD5E1', background: '#FFFFFF', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          {copiedField === 'stk' ? <Check size={12} color='#16A34A' /> : <Copy size={12} />}
                          <span>{copiedField === 'stk' ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Chủ tài khoản:</span>
                      <strong style={{ fontSize: '13px', color: '#1E293B' }}>CÔNG TY CP NEXUS ANTIDETECT</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Nội dung chuyển khoản:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <code style={{ fontSize: '13px', fontWeight: 700, color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                          {'NEXUS ' + selectedPlan.id.toUpperCase() + ' 8899'}
                        </code>
                        <button
                          onClick={() => handleCopy('NEXUS ' + selectedPlan.id.toUpperCase() + ' 8899', 'syntax')}
                          style={{ border: '1px solid #CBD5E1', background: '#FFFFFF', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          {copiedField === 'syntax' ? <Check size={12} color='#16A34A' /> : <Copy size={12} />}
                          <span>{copiedField === 'syntax' ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentTab === 'crypto' && (
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Mạng lưới:</span>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>USDT (TRC-20 / BEP-20)</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Địa chỉ ví:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <code style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB', backgroundColor: '#F1F5F9', padding: '6px 10px', borderRadius: '6px', flex: 1, fontFamily: 'monospace' }}>
                        TQ8dF7pQz2vP9mK1jX8wY6nB3cE5rT7uA1
                      </code>
                      <button
                        onClick={() => handleCopy('TQ8dF7pQz2vP9mK1jX8wY6nB3cE5rT7uA1', 'wallet')}
                        style={{ border: '1px solid #CBD5E1', background: '#FFFFFF', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {copiedField === 'wallet' ? <Check size={14} color='#16A34A' /> : <Copy size={14} />}
                        <span>{copiedField === 'wallet' ? 'Đã chép' : 'Sao chép'}</span>
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    Chuyển chính xác: <strong>{selectedPlan.price} USDT</strong>. Hệ thống tự kích hoạt sau 1 xác nhận.
                  </p>
                </div>
              )}

              {paymentTab === 'key' && (
                <form onSubmit={handleKeySubmit} style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                      Nhập mã License Key của bạn:
                    </label>
                    <input
                      type='text'
                      placeholder='Ví dụ: NX-PRO-8899-AABB-CCDD'
                      value={licenseKeyInput}
                      onChange={e => setLicenseKeyInput(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }}
                      autoFocus
                    />
                  </div>
                  <button
                    type='submit'
                    style={{ padding: '10px 18px', backgroundColor: '#2563EB', color: '#FFFFFF', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Key size={14} /> Kích hoạt key ngay
                  </button>
                </form>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <button
                  onClick={() => handleActivatePlan(selectedPlan.title)}
                  disabled={purchaseSuccess}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: purchaseSuccess ? '#16A34A' : '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: purchaseSuccess ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {purchaseSuccess ? (
                    <>
                      <Check size={18} /> Đã kích hoạt bản quyền thành công!
                    </>
                  ) : (
                    <>
                      <Rocket size={16} /> Tôi đã hoàn tất thanh toán
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedPlan(null)}
                  style={{ padding: '12px 18px', borderRadius: '10px', backgroundColor: '#FFFFFF', color: '#475569', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Chọn gói khác
                </button>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Gói hiện tại: <strong style={{ color: '#2563EB' }}>{currentPlan}</strong></span>
            <span>•</span>
            <span>Hỗ trợ 24/7 qua Telegram: <strong>@NexusAntidetectSupport</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={13} />
            <span>Kích hoạt tự động trong vòng 30 giây</span>
          </div>
        </div>
      </div>
    </div>
  );
}
