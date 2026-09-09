import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useBrowser } from '../../../store/BrowserContext';

export default function Template2_ApidogPlanSelector() {
  const { activeUpgradeModal, setActiveUpgradeModal, setCurrentPlan, addLog } = useBrowser();

  const [selectedPlanId, setSelectedPlanId] = useState('team'); // 'solo' | 'team' | 'enterprise'
  const [isProcessing, setIsProcessing] = useState(false);

  if (!activeUpgradeModal) return null;

  const plans = [
    {
      id: 'solo',
      name: 'Solo',
      price: '$9',
      unit: 'per / month',
      description: 'For individuals who want to move faster with AI and automation',
      subtitle: 'Key starter capabilities:',
      features: [
        'Single-user personal workspace',
        'AI-assisted generation & testing',
        'Unlimited API requests & mock data',
        'Automated test runner & scheduling',
        'Community & standard email support'
      ]
    },
    {
      id: 'team',
      name: 'Team',
      price: '$19',
      unit: 'per seat / month',
      description: 'For teams building and shipping APIs together',
      subtitle: 'Everything in Solo, and',
      features: [
        'Team collaboration',
        'Unlimited workspace & collection viewers',
        'Basic Role Based Access Control (RBAC)',
        'SDK generation',
        'Simple security (add-on)'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$49',
      unit: 'per seat / month',
      description: 'For organizations building, managing, and distributing APIs at scale',
      subtitle: 'Everything in Team, and',
      features: [
        'Advanced Role Based Access Control (RBAC)',
        'Dedicated Account Manager & 99.9% SLA',
        'Single Sign-On (SAML / Okta / Azure AD)',
        'Enterprise audit logs & compliance security',
        'Custom on-premise or hybrid deployment'
      ]
    }
  ];

  const currentPlanData = plans.find(p => p.id === selectedPlanId) || plans[1];

  const handleContinue = (isTrial = false) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const planTitle = isTrial ? `Team Trial (14 ngày)` : `${currentPlanData.name} Plan`;
      setCurrentPlan(planTitle);
      addLog(`Kích hoạt thành công gói ${planTitle}`, 'success');
      alert(`Đã nâng cấp thành công gói ${planTitle}!`);
      setActiveUpgradeModal(false);
    }, 600);
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
      padding: '24px'
    }}>
      <div 
        className="no-scrollbar"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          width: '100%',
          maxWidth: '820px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          overflow: 'hidden',
          animation: 'fadeInModal 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          minHeight: '480px'
        }}
      >
        {/* LEFT COLUMN: Plan Selection */}
        <div style={{
          flex: '1.4',
          padding: '36px 32px 32px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          <div>
            {/* Title */}
            <h2 style={{
              fontSize: '21px',
              fontWeight: 700,
              color: '#0F172A',
              margin: '0 0 24px 0',
              lineHeight: 1.35
            }}>
              Upgrade to the {currentPlanData.name} plan to access more features
            </h2>

            {/* Plan Radio Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {plans.map(plan => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    style={{
                      border: isSelected ? '1.5px solid #F25F22' : '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      cursor: 'pointer',
                      backgroundColor: '#FFFFFF',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                      boxShadow: isSelected ? '0 0 0 1px rgba(242, 95, 34, 0.15)' : 'none'
                    }}
                  >
                    {/* Custom Radio Circle */}
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: isSelected ? '5px solid #2563EB' : '1.5px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      flexShrink: 0,
                      marginTop: '2px',
                      transition: 'all 0.15s ease'
                    }} />

                    {/* Plan details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                          {plan.name} {plan.price}
                        </span>
                        <span style={{ fontSize: '13px', color: '#64748B' }}>
                          {plan.unit}
                        </span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '3px', lineHeight: 1.4 }}>
                        {plan.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footnote */}
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '16px', marginBottom: '20px' }}>
              Pricing reflects annual plans
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            <button
              onClick={() => handleContinue(false)}
              disabled={isProcessing}
              style={{
                width: '100%',
                backgroundColor: '#F25F22',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '11px 0',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: isProcessing ? 'default' : 'pointer',
                transition: 'background-color 0.15s ease',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) e.currentTarget.style.backgroundColor = '#E05016';
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) e.currentTarget.style.backgroundColor = '#F25F22';
              }}
            >
              {isProcessing ? 'Processing...' : `Continue with ${currentPlanData.name} Plan`}
            </button>

            <button
              onClick={() => handleContinue(true)}
              disabled={isProcessing}
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '9px 0',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                marginTop: '10px',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              Start Team Trial
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Feature Breakdown */}
        <div style={{
          flex: '1',
          backgroundColor: '#FAFAFC',
          borderLeft: '1px solid #F1F5F9',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Close button */}
          <button
            onClick={() => setActiveUpgradeModal(false)}
            title="Đóng cửa sổ"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              color: '#64748B',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <X size={18} />
          </button>

          <div style={{ marginTop: '54px' }}>
            {/* Header */}
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              {currentPlanData.name} plan includes:
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '22px' }}>
              {currentPlanData.subtitle}
            </div>

            {/* Features List with Thin Orange Checkmarks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {currentPlanData.features.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none" 
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  >
                    <path 
                      d="M3.5 8.5L6.5 11.5L13 4.5" 
                      stroke="#F25F22" 
                      strokeWidth="1.6" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                  <span style={{ fontSize: '13px', color: '#334155', lineHeight: 1.4 }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
