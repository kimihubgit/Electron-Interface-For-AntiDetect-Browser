import React from 'react';
import { Gift, X } from 'lucide-react';

export default function HomeReferralBanner({
  showBanner,
  onCloseBanner,
  onOpenReferralModal,
  t
}) {
  if (!showBanner) return null;

  return (
    <div
      style={{
        backgroundColor: '#FFFBEB',
        border: '1px solid #FEF3C7',
        borderRadius: '8px',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12.5px',
        color: '#92400E',
        marginBottom: '24px'
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        onClick={onOpenReferralModal}
      >
        <Gift size={15} color="#D97706" />
        <span>{t('home.referralBanner', 'Giới thiệu bạn bè để nhận ngay {amount} Credits vào tài khoản ➔', { amount: '$10' })}</span>
      </div>
      <button
        onClick={onCloseBanner}
        style={{ background: 'none', border: 'none', color: '#92400E', cursor: 'pointer', opacity: 0.7, padding: '2px' }}
        title={t('home.closeBanner', 'Đóng thông báo')}
      >
        <X size={14} />
      </button>
    </div>
  );
}
