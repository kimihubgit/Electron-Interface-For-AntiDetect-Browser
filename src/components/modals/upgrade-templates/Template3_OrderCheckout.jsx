import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Minus,
  Plus,
  HelpCircle,
  ArrowRight,
  Mail,
  CreditCard,
  Building,
  CheckCircle2
} from 'lucide-react';
import { useBrowser } from '../../../store/BrowserContext';
import { useTranslation } from '../../../i18n/I18nContext';
import { getPlansApi, getStoredPlans } from '../../../services/planService';

// Import custom icons from assets/icon/upgrade
import basicIcon from '../../../assets/icon/upgrade/basic.svg';
import proIcon from '../../../assets/icon/upgrade/profestional.svg';
import enterpriseIcon from '../../../assets/icon/upgrade/enterprise.svg';
import onPremisesIcon from '../../../assets/icon/upgrade/on-premises.svg';

export default function Template3_OrderCheckout() {
  const { t } = useTranslation();
  const { activeUpgradeModal, setActiveUpgradeModal, setCurrentPlan, addLog } = useBrowser();

  // State
  const [selectedPlanId, setSelectedPlanId] = useState('plan_pro');
  const [duration, setDuration] = useState('1m'); // '1m' | '3m' | '6m' | '1y' | '2y' | '3y'
  const [seats, setSeats] = useState(1);
  const [paymentStep, setPaymentStep] = useState('config'); // 'config' | 'processing' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('');
  const [apiPlans, setApiPlans] = useState(() => getStoredPlans());

  // Fetch plans from GET /api/v1/plans on open
  useEffect(() => {
    getPlansApi().then(res => {
      if (res.success && res.data && res.data.length > 0) {
        setApiPlans(res.data);
      }
    });
  }, []);

  if (!activeUpgradeModal) return null;

  const PLAN_ICONS_CONFIG = {
    plan_free: { icon: basicIcon, iconBg: '#F1F5F9', iconColor: '#64748B', tagline: t('upgrade.planFreeTagline', 'Dành cho trải nghiệm cơ bản') },
    plan_basic: { icon: basicIcon, iconBg: '#E8F5E9', iconColor: '#2E7D32', tagline: t('upgrade.planBasicTagline', 'Phù hợp cá nhân & nhóm nhỏ') },
    plan_pro: { icon: proIcon, iconBg: '#E0F7FA', iconColor: '#00838F', tagline: t('upgrade.planProTagline', 'Dành cho MMO & Đội nhóm chuyên nghiệp') },
    plan_enterprise: { icon: enterpriseIcon, iconBg: '#E8EAF6', iconColor: '#283593', tagline: t('upgrade.planEnterpriseTagline', 'Quy mô lớn & Tự động hóa cao cấp') }
  };

  // Plans config dynamically populated from API
  const plans = apiPlans.map(p => {
    const cfg = PLAN_ICONS_CONFIG[p.id] || {
      icon: basicIcon,
      iconBg: '#F1F5F9',
      iconColor: '#64748B',
      tagline: `${p.max_profiles} Profiles - ${p.max_seats} Seats`
    };
    return {
      id: p.id,
      name: p.name,
      tagline: cfg.tagline,
      annualPrice: p.price_year,
      originalAnnual: p.price_month * 12,
      monthlyPrice: p.price_month,
      max_profiles: p.max_profiles,
      max_seats: p.max_seats,
      is_popular: Boolean(p.is_popular),
      icon: cfg.icon,
      iconBg: cfg.iconBg,
      iconColor: cfg.iconColor,
      features: p.features || []
    };
  });

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[0] || {};

  // Duration durations list
  const durations = [
    { id: '1m', label: t('upgrade.month', '1 month', { count: 1 }), months: 1, discount: 0 },
    { id: '3m', label: t('upgrade.months', '3 months', { count: 3 }), months: 3, discount: 0 },
    { id: '6m', label: t('upgrade.months', '6 months', { count: 6 }), months: 6, discount: 0 },
    { id: '1y', label: t('upgrade.year', '1 year', { count: 1 }), months: 12, discount: 0.2, tag: t('upgrade.off', '20% off') },
    { id: '2y', label: t('upgrade.years', '2 years', { count: 2 }), months: 24, discount: 0.2, tag: t('upgrade.off', '20% off') },
    { id: '3y', label: t('upgrade.years', '3 years', { count: 3 }), months: 36, discount: 0.2, tag: t('upgrade.off', '20% off') },
  ];

  const selectedDuration = durations.find(d => d.id === duration) || durations[0];

  // Calculate Order Amount
  const calculateTotal = () => {
    if (currentPlan.isCustom) return t('upgrade.contactConsultant', 'Liên hệ');
    if (!currentPlan.monthlyPrice || currentPlan.monthlyPrice === 0) return '0.00';
    let basePricePerMonth = currentPlan.monthlyPrice;
    if (selectedDuration.months >= 12) {
      // Annual rate per month
      const annualPricePerMonth = (currentPlan.annualPrice || 0) / 12;
      return (annualPricePerMonth * selectedDuration.months * seats).toFixed(2);
    }
    return (basePricePerMonth * selectedDuration.months * seats).toFixed(2);
  };

  const totalAmount = calculateTotal();

  const handlePay = (method) => {
    setPaymentMethod(method);
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      setCurrentPlan(`${currentPlan.name} Plan (${selectedDuration.label})`);
      addLog(`Kích hoạt thành công gói ${currentPlan.name}`, 'success');
    }, 1000);
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
      zIndex: 1100,
      padding: '20px'
    }}>
      <div
        className="no-scrollbar"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          width: '100%',
          maxWidth: '1020px',
          maxHeight: '94vh',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          overflow: 'hidden',
          animation: 'fadeInModal 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* ========================================================
            COLUMN 1: LEFT SIDEBAR (Plan features & Comparison)
           ======================================================== */}
        <div style={{
          width: '260px',
          backgroundColor: '#FAFAFC',
          borderRight: '1px solid #F1F3F5',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div>
            {/* Plan Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: currentPlan.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={currentPlan.icon} 
                  alt={currentPlan.name} 
                  style={{ width: '20px', height: '20px', objectFit: 'contain' }} 
                />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {currentPlan.name}
              </h3>
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '24px' }}>
              {currentPlan.tagline}
            </div>

            {/* Feature Subheader */}
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '14px' }}>
              {selectedPlanId === 'basic' ? t('upgrade.freeFeaturesPlus', 'All Free features, plus:') : t('upgrade.highlights', '{name} highlights:', { name: currentPlan.name })}
            </div>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentPlan.features.map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#64748B', fontSize: '13px', marginTop: '1px', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.35 }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom link */}
          <div style={{ paddingTop: '20px', borderTop: '1px solid #E2E8F0', marginTop: '20px' }}>
            <a
              href="#compare"
              onClick={(e) => { e.preventDefault(); alert(t('upgrade.comparePlans', 'So sánh tính năng các gói.')); }}
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#4F46E5',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{t('upgrade.comparePlans', 'Compare Plans & Features')}</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* ========================================================
            COLUMN 2: MIDDLE (Plan, Duration, Seats Configurator)
           ======================================================== */}
        <div style={{
          flex: 1,
          padding: '28px 28px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Section 1: Plan Selector (2x2 Grid) */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
              {t('upgrade.plan', 'Plan')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {plans.map(p => {
                const isSelected = selectedPlanId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    style={{
                      border: isSelected ? '1.5px solid #6366F1' : '1px solid #E2E8F0',
                      backgroundColor: isSelected ? '#F5F7FF' : '#FFFFFF',
                      borderRadius: '10px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '108px'
                    }}
                  >
                    {p.is_popular && (
                      <span style={{
                        position: 'absolute',
                        top: '-7px',
                        right: '10px',
                        backgroundColor: '#3B82F6',
                        color: '#FFFFFF',
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
                        letterSpacing: '0.3px'
                      }}>
                        PHỔ BIẾN
                      </span>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img 
                        src={p.icon} 
                        alt={p.name} 
                        style={{ width: '18px', height: '18px', objectFit: 'contain' }} 
                      />
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                        {p.name}
                      </span>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      {p.isCustom ? (
                        <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={13} />
                          <span>{t('upgrade.contactConsultant', 'Contact the corporate consultant')}</span>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                              {p.annualPrice === 0 ? '$0' : `$${p.annualPrice}`}
                            </span>
                            {p.originalAnnual > p.annualPrice && (
                              <span style={{ fontSize: '12px', color: '#94A3B8', textDecoration: 'line-through' }}>
                                ${p.originalAnnual}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                            {p.annualPrice === 0 ? 'Miễn phí vĩnh viễn' : `${p.max_profiles} Profiles / năm`}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Purchase Duration */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
              {t('upgrade.purchaseDuration', 'Purchase Duration')}
            </div>
            {/* 2 rows: monthly options & yearly options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Row 1: Short term */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {durations.slice(0, 3).map(d => {
                  const isSelected = duration === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDuration(d.id)}
                      style={{
                        padding: '10px 0',
                        textAlign: 'center',
                        backgroundColor: '#FFFFFF',
                        border: isSelected ? '1.5px solid #6366F1' : '1px solid #E2E8F0',
                        color: isSelected ? '#4F46E5' : '#334155',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>

              {/* Row 2: Annual with discount badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {durations.slice(3).map(d => {
                  const isSelected = duration === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDuration(d.id)}
                      style={{
                        position: 'relative',
                        padding: '10px 0',
                        textAlign: 'center',
                        backgroundColor: '#FFFFFF',
                        border: isSelected ? '1.5px solid #6366F1' : '1px solid #E2E8F0',
                        color: isSelected ? '#4F46E5' : '#334155',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{d.label}</span>
                      {d.tag && (
                        <span style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-4px',
                          backgroundColor: '#E25B2D',
                          color: '#FFFFFF',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          lineHeight: '13px'
                        }}>
                          {d.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: The number of seats */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
              {t('upgrade.seatsCount', 'The number of seats')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Stepper container */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  style={{
                    width: '36px',
                    height: '34px',
                    border: 'none',
                    background: '#FFFFFF',
                    color: seats <= 1 ? '#CBD5E1' : '#64748B',
                    cursor: seats <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Minus size={14} />
                </button>
                <div style={{
                  width: '48px',
                  height: '34px',
                  borderLeft: '1px solid #E2E8F0',
                  borderRight: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A'
                }}>
                  {seats}
                </div>
                <button
                  onClick={() => setSeats(seats + 1)}
                  style={{
                    width: '36px',
                    height: '34px',
                    border: 'none',
                    background: '#FFFFFF',
                    color: '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>ⓘ</span>
              <span>{t('upgrade.seatsNote', 'The number of seats you have chosen here is the total number of seats for this team.')}</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            COLUMN 3: RIGHT (Order Details & Checkout Action)
           ======================================================== */}
        <div style={{
          width: '330px',
          borderLeft: '1px solid #F1F3F5',
          backgroundColor: '#FFFFFF',
          padding: '24px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div>
            {/* Header + Close */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {t('upgrade.orderTitle', 'Order details')}
              </h4>
              <button
                onClick={() => setActiveUpgradeModal(false)}
                title={t('common.close', 'Đóng')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4, marginBottom: '20px' }}>
              {t('upgrade.invoiceNotice', 'After the payment is successful, you can contact us to issue an invoice.')}
            </div>

            {/* Summary Line Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>{t('upgrade.teamLabel', 'Team')}</span>
                <span style={{ color: '#0F172A', fontWeight: 500 }}>{t('upgrade.personalTeam', 'Personal Team')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>{t('upgrade.typeLabel', 'Type')}</span>
                <span style={{ color: '#0F172A', fontWeight: 500 }}>{t('upgrade.upgradeAction', 'Upgrade')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>{t('upgrade.plan', 'Plan')}</span>
                <span style={{ color: '#0F172A', fontWeight: 600 }}>{currentPlan.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>{t('upgrade.purchaseDuration', 'Purchase Duration')}</span>
                <span style={{ color: '#0F172A', fontWeight: 500 }}>{selectedDuration.label}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>{t('upgrade.seatsCount', 'Purchase Seats')}</span>
                <span style={{ color: '#0F172A', fontWeight: 500 }}>{seats}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>{t('upgrade.startTime', 'Start Time')}</span>
                <span style={{ color: '#0F172A', fontWeight: 500 }}>{t('upgrade.paymentCompleted', 'Payment completed')}</span>
              </div>
            </div>
          </div>

          {/* Bottom Payment Actions */}
          <div style={{ paddingTop: '20px' }}>
            {/* Amount */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{t('upgrade.orderAmount', 'Order amount')}</span>
                <HelpCircle size={13} style={{ color: '#94A3B8' }} />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                {currentPlan.isCustom ? t('upgrade.contactConsultant', 'Liên hệ') : `$${totalAmount}`}
              </div>
            </div>

            {paymentStep === 'processing' ? (
              <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '13px', color: '#4F46E5', fontWeight: 600 }}>
                {t('upgrade.processing', 'Đang xử lý thanh toán đơn hàng...')}
              </div>
            ) : paymentStep === 'success' ? (
              <div style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
                color: '#065F46',
                fontSize: '13px',
                fontWeight: 600
              }}>
                {t('upgrade.success', '✓ Thanh toán hoàn tất! Đã kích hoạt bản quyền.')}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Online Payment Button */}
                <button
                  onClick={() => handlePay('Online Payment')}
                  style={{
                    width: '100%',
                    backgroundColor: '#5C67F2',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 0',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4F58DE'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5C67F2'}
                >
                  {t('upgrade.onlinePayment', 'Online Payment')}
                </button>

                {/* B2B Bank Transfer */}
                <button
                  onClick={() => handlePay('B2B Bank Transfer')}
                  style={{
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '9px 0',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  {t('upgrade.bankTransfer', 'B2B Bank Transfer')}
                </button>
              </div>
            )}

            {/* Legal Footnotes */}
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '14px', lineHeight: 1.4 }}>
              {t('upgrade.transferNotice', 'After selecting B2B Bank Transfer, the order is valid for 30 days. Please complete the transfer as soon as possible. (It will be activated within 2 working days after arrival)')}
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px', lineHeight: 1.4 }}>
              {t('upgrade.agreeNotice', 'By clicking on "Online Payment / Bank Transfer", you are expressing your consent to our {termsLink}.', { termsLink: t('upgrade.termsOfService', 'Terms of Service') })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
