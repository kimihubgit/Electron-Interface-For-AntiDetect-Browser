import React, { useState, useEffect } from 'react';
import {
  X,
  Gift,
  Users,
  Link2,
  Mail,
  Copy,
  Check,
  Upload,
  RotateCw,
  ChevronDown,
  Sparkles,
  Search,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

export default function ReferralModal() {
  const { activeReferralModal, setActiveReferralModal } = useBrowser();

  // Active top-level modal tab: 'referrals' | 'project'
  const [activeTab, setActiveTab] = useState('referrals');

  useEffect(() => {
    if (activeReferralModal === 'project') {
      setActiveTab('project');
    } else if (activeReferralModal === 'referrals' || activeReferralModal === true) {
      setActiveTab('referrals');
    }
  }, [activeReferralModal]);

  // Tab 1 (Referrals) States
  const [inviteMethod, setInviteMethod] = useState('link'); // 'link' | 'email'
  const [referralLink, setReferralLink] = useState('https://app.apidog.com/invite?token=8f9a2b7c');
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [referralEmail, setReferralEmail] = useState('');
  const [referralEmailSent, setReferralEmailSent] = useState(false);
  const [submitModalTask, setSubmitModalTask] = useState(null);
  const [submissionInput, setSubmissionInput] = useState('');
  const [taskStatus, setTaskStatus] = useState({
    linkedin: 'READY',
    twitter: 'READY',
    g2: 'READY',
    capterra: 'READY'
  });

  // Tab 2 (Invite to Project) States
  const [projectInviteTab, setProjectInviteTab] = useState('link'); // 'link' | 'email' | 'team'
  const [projectLink, setProjectLink] = useState('https://app.apidog.com/invite?token=km-dev992x');
  const [copiedProjectLink, setCopiedProjectLink] = useState(false);
  const [permission, setPermission] = useState('Editor');
  const [teamRole, setTeamRole] = useState('Team Member');
  const [otherProjects, setOtherProjects] = useState('Forbidden');
  const [isResettingLink, setIsResettingLink] = useState(false);
  const [teamEmails, setTeamEmails] = useState('');
  const [teamEmailSent, setTeamEmailSent] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState('');

  if (!activeReferralModal) return null;

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleCopyProjectLink = () => {
    navigator.clipboard?.writeText(projectLink);
    setCopiedProjectLink(true);
    setTimeout(() => setCopiedProjectLink(false), 2000);
  };

  const handleResetLink = () => {
    setIsResettingLink(true);
    setTimeout(() => {
      const newToken = Math.random().toString(36).substring(2, 10);
      setProjectLink(`https://app.apidog.com/invite?token=km-${newToken}`);
      setIsResettingLink(false);
      alert('Đã tạo liên kết mời mới thành công! Liên kết cũ đã hết hiệu lực.');
    }, 400);
  };

  const handleSendTeamEmail = (e) => {
    e.preventDefault();
    if (!teamEmails.trim()) {
      alert('Vui lòng nhập ít nhất một địa chỉ email!');
      return;
    }
    setTeamEmailSent(true);
    setTimeout(() => {
      setTeamEmailSent(false);
      setTeamEmails('');
      alert(`Đã gửi lời mời tham gia dự án Kimidev thành công!`);
    }, 800);
  };

  // Mock members for Select from Team
  const teamMembers = [
    { id: 1, name: 'Võ Văn Khải (You)', email: 'vkhai2603@gmail.com', role: 'Owner', inProject: true },
    { id: 2, name: 'Alex Nguyen', email: 'alex.nguyen@company.io', role: 'Team Member', inProject: false },
    { id: 3, name: 'Sarah Chen', email: 'sarah.chen@company.io', role: 'Team Member', inProject: false },
    { id: 4, name: 'David Miller', email: 'david.m@company.io', role: 'Guest', inProject: false },
  ];

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
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInModal 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* MODAL UNIFIED HEADER */}
        <div style={{
          height: '56px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #F1F3F5',
          backgroundColor: '#FFFFFF',
          flexShrink: 0
        }}>
          {/* Integrated Segmented Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#F1F5F9',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid #E2E8F0'
          }}>
            <button
              onClick={() => setActiveTab('referrals')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: activeTab === 'referrals' ? '1px solid #E2E8F0' : '1px solid transparent',
                backgroundColor: activeTab === 'referrals' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'referrals' ? '#0F172A' : '#64748B',
                fontSize: '12.5px',
                fontWeight: activeTab === 'referrals' ? 600 : 500,
                cursor: 'pointer',
                boxShadow: activeTab === 'referrals' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Gift size={14} style={{ color: activeTab === 'referrals' ? '#7C3AED' : '#64748B' }} />
              <span>Referrals and Credits</span>
            </button>

            <button
              onClick={() => setActiveTab('project')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: activeTab === 'project' ? '1px solid #E2E8F0' : '1px solid transparent',
                backgroundColor: activeTab === 'project' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'project' ? '#0F172A' : '#64748B',
                fontSize: '12.5px',
                fontWeight: activeTab === 'project' ? 600 : 500,
                cursor: 'pointer',
                boxShadow: activeTab === 'project' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Users size={14} style={{ color: activeTab === 'project' ? '#6366F1' : '#64748B' }} />
              <span>Invite to Kimidev</span>
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={() => setActiveReferralModal(false)}
            className="btn-icon"
            title="Đóng cửa sổ"
            style={{
              width: '32px',
              height: '32px',
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
              e.currentTarget.style.backgroundColor = '#F3F4F6';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* SCROLLABLE MODAL CONTENT */}
        <div className="no-scrollbar" style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 28px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>

          {/* ========================================================
              TAB 1: REFERRALS AND CREDITS (Apidog Matching UI)
             ======================================================== */}
          {activeTab === 'referrals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* TOP BANNER: YOUR CREDITS BALANCE */}
              <div style={{
                position: 'relative',
                background: 'linear-gradient(98deg, #FCE7F3 0%, #EDE9FE 38%, #DBEAFE 82%, #E0F2FE 100%)',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '22px 26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden'
              }}>
                {/* Left Info */}
                <div style={{ zIndex: 1 }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.6px',
                    color: '#64748B',
                    textTransform: 'uppercase'
                  }}>
                    YOUR CREDITS BALANCE
                  </div>
                  <div style={{
                    fontSize: '38px',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.15,
                    margin: '6px 0 10px 0',
                    fontFamily: 'var(--font-mono, monospace)'
                  }}>
                    $0
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>Applied to team subscription.</span>
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6366F1',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <span>View history</span>
                      <ChevronDown size={14} style={{ transform: showHistory ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                  </div>

                  {/* Dropdown history if opened */}
                  {showHistory && (
                    <div style={{
                      marginTop: '12px',
                      background: '#FFFFFF',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                      color: '#64748B',
                      maxWidth: '320px'
                    }}>
                      <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>Transaction History</div>
                      <div>No credit transactions recorded yet. Complete tasks below to earn credits!</div>
                    </div>
                  )}
                </div>

                {/* Right Illustration & CTA Button */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '12px',
                  zIndex: 1
                }}>
                  {/* 3D Gift Box Graphic */}
                  <div style={{ position: 'relative', width: '90px', height: '60px', display: 'flex', justifyContent: 'flex-end' }}>
                    <svg width="88" height="58" viewBox="0 0 88 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="giftGlowRef" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="boxFront1Ref" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#FB7185" />
                          <stop offset="100%" stopColor="#E11D48" />
                        </linearGradient>
                        <linearGradient id="boxFront2Ref" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#F43F5E" />
                          <stop offset="100%" stopColor="#BE123C" />
                        </linearGradient>
                        <linearGradient id="ribbonGoldRef" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#FDE047" />
                          <stop offset="100%" stopColor="#D97706" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="30" r="28" fill="url(#giftGlowRef)" />

                      {/* Left Gift Box */}
                      <g transform="translate(4, 12)">
                        <path d="M5 12 L17 4 L33 9 L21 17 Z" fill="#FDA4AF" />
                        <path d="M5 12 L21 17 L21 21 L5 16 Z" fill="#F43F5E" />
                        <path d="M21 17 L33 9 L33 13 L21 21 Z" fill="#E11D48" />
                        <path d="M7 19 L19 23 L19 38 L7 34 Z" fill="url(#boxFront1Ref)" />
                        <path d="M19 23 L31 15 L31 30 L19 38 Z" fill="url(#boxFront2Ref)" />
                        <path d="M12 21 L14 22 L14 36 L12 35 Z" fill="url(#ribbonGoldRef)" />
                        <path d="M24 17 L26 18 L26 32 L24 33 Z" fill="url(#ribbonGoldRef)" />
                        <circle cx="19" cy="9" r="3.5" fill="url(#ribbonGoldRef)" />
                        <path d="M16 8 C14 5, 12 8, 16 9" stroke="#FBBF24" strokeWidth="2" fill="none" />
                        <path d="M22 8 C24 5, 26 8, 22 9" stroke="#FBBF24" strokeWidth="2" fill="none" />
                      </g>

                      {/* Right Big Gift Box */}
                      <g transform="translate(40, 2)">
                        <path d="M7 15 L22 5 L42 12 L27 22 Z" fill="#FDA4AF" />
                        <path d="M7 15 L27 22 L27 27 L7 20 Z" fill="#F43F5E" />
                        <path d="M27 22 L42 12 L42 17 L27 27 Z" fill="#BE123C" />
                        <path d="M9 24 L25 29 L25 48 L9 43 Z" fill="url(#boxFront1Ref)" />
                        <path d="M25 29 L40 19 L40 38 L25 48 Z" fill="url(#boxFront2Ref)" />
                        <path d="M16 26 L19 27 L19 46 L16 45 Z" fill="url(#ribbonGoldRef)" />
                        <path d="M31 22 L34 23 L34 42 L31 43 Z" fill="url(#ribbonGoldRef)" />
                        <circle cx="25" cy="12" r="4.5" fill="url(#ribbonGoldRef)" />
                        <path d="M21 11 C18 6, 16 11, 21 13" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
                        <path d="M29 11 C32 6, 34 11, 29 13" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
                      </g>
                    </svg>
                  </div>

                  {/* Apply Credits Button */}
                  <button
                    onClick={() => alert('Bạn hiện chưa có đủ số dư tín dụng để quy đổi hoặc khấu trừ gói đăng ký.')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '9999px',
                      padding: '7px 16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#0F172A',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.06)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <span>Apply Credits</span>
                    <span style={{ fontSize: '13px' }}>→</span>
                  </button>
                </div>
              </div>

              {/* SECTION: INVITE FRIENDS */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    Invite Friends
                  </h3>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#7C3AED',
                    background: '#F3E8FF',
                    padding: '2px 9px',
                    borderRadius: '9999px'
                  }}>
                    <span>🎁</span>
                    <span>Earn $10 per signup</span>
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '14px' }}>
                  No cap — refer as many people as you like.
                </div>

                {/* Referral Link Container Card */}
                <div style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                  {/* Segmented Tab Buttons */}
                  <div style={{ display: 'flex', gap: '4px', background: '#F8FAFC', padding: '3px', borderRadius: '8px', width: 'fit-content', border: '1px solid #F1F5F9' }}>
                    <button
                      onClick={() => setInviteMethod('link')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: inviteMethod === 'link' ? '1px solid #E2E8F0' : '1px solid transparent',
                        backgroundColor: inviteMethod === 'link' ? '#FFFFFF' : 'transparent',
                        color: inviteMethod === 'link' ? '#0F172A' : '#64748B',
                        fontSize: '12px',
                        fontWeight: inviteMethod === 'link' ? 600 : 500,
                        cursor: 'pointer',
                        boxShadow: inviteMethod === 'link' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Link2 size={13} />
                      <span>Copy Link</span>
                    </button>
                    <button
                      onClick={() => setInviteMethod('email')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: inviteMethod === 'email' ? '1px solid #E2E8F0' : '1px solid transparent',
                        backgroundColor: inviteMethod === 'email' ? '#FFFFFF' : 'transparent',
                        color: inviteMethod === 'email' ? '#0F172A' : '#64748B',
                        fontSize: '12px',
                        fontWeight: inviteMethod === 'email' ? 600 : 500,
                        cursor: 'pointer',
                        boxShadow: inviteMethod === 'email' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Mail size={13} />
                      <span>Email Invite</span>
                    </button>
                  </div>

                  {/* Input Form based on active Tab */}
                  {inviteMethod === 'link' ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        readOnly
                        value={referralLink}
                        style={{
                          flex: 1,
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: '6px',
                          padding: '9px 12px',
                          fontSize: '13px',
                          color: '#94A3B8',
                          fontFamily: 'var(--font-mono, monospace)',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={handleCopyReferral}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: copiedReferral ? '#10B981' : '#7C3AED',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '9px 18px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        {copiedReferral ? <Check size={15} /> : <Copy size={15} />}
                        <span>{copiedReferral ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="email"
                        placeholder="friend@company.com"
                        value={referralEmail}
                        onChange={(e) => setReferralEmail(e.target.value)}
                        style={{
                          flex: 1,
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '6px',
                          padding: '9px 12px',
                          fontSize: '13px',
                          color: '#0F172A',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => {
                          if (!referralEmail) return alert('Vui lòng nhập email bạn bè!');
                          setReferralEmailSent(true);
                          setTimeout(() => {
                            setReferralEmailSent(false);
                            setReferralEmail('');
                            alert(`Lời mời đã được gửi tới ${referralEmail}!`);
                          }, 800);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#7C3AED',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '9px 18px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <Mail size={15} />
                        <span>{referralEmailSent ? 'Sending...' : 'Send Invite'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-card: Cross-link to Tab 2 (Invite Teammates) */}
                <div style={{
                  marginTop: '12px',
                  border: '1px solid #F1F5F9',
                  backgroundColor: '#FAFAFC',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🎁</span>
                      <span>Also earn $10 when inviting teammates</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      Invite someone to your team and they register — you'll earn $10 separately.
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('project')}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#0F172A',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    Invite Teammates →
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              TAB 2: INVITE TO JOIN PROJECT: KIMIDEV (Exact Match Image 2)
             ======================================================== */}
          {activeTab === 'project' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
                  Invite to join project: Kimidev
                </h3>

                {/* Subtabs for Project Invite */}
                <div style={{
                  display: 'flex',
                  backgroundColor: '#F1F5F9',
                  padding: '3px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  width: '100%',
                  marginBottom: '16px'
                }}>
                  <button
                    onClick={() => setProjectInviteTab('link')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: projectInviteTab === 'link' ? '1px solid #E2E8F0' : '1px solid transparent',
                      backgroundColor: projectInviteTab === 'link' ? '#FFFFFF' : 'transparent',
                      color: projectInviteTab === 'link' ? '#0F172A' : '#64748B',
                      fontSize: '13px',
                      fontWeight: projectInviteTab === 'link' ? 600 : 500,
                      cursor: 'pointer',
                      textAlign: 'center',
                      boxShadow: projectInviteTab === 'link' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Invite via Link
                  </button>
                  <button
                    onClick={() => setProjectInviteTab('email')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: projectInviteTab === 'email' ? '1px solid #E2E8F0' : '1px solid transparent',
                      backgroundColor: projectInviteTab === 'email' ? '#FFFFFF' : 'transparent',
                      color: projectInviteTab === 'email' ? '#0F172A' : '#64748B',
                      fontSize: '13px',
                      fontWeight: projectInviteTab === 'email' ? 600 : 500,
                      cursor: 'pointer',
                      textAlign: 'center',
                      boxShadow: projectInviteTab === 'email' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Invite via Email
                  </button>
                  <button
                    onClick={() => setProjectInviteTab('team')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: projectInviteTab === 'team' ? '1px solid #E2E8F0' : '1px solid transparent',
                      backgroundColor: projectInviteTab === 'team' ? '#FFFFFF' : 'transparent',
                      color: projectInviteTab === 'team' ? '#0F172A' : '#64748B',
                      fontSize: '13px',
                      fontWeight: projectInviteTab === 'team' ? 600 : 500,
                      cursor: 'pointer',
                      textAlign: 'center',
                      boxShadow: projectInviteTab === 'team' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Select from Team
                  </button>
                </div>

                <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
                  Invite teammates to your Apidog project. The invitation link expires in 7 days.
                </div>

                {/* --- 1. INVITE VIA LINK (Exact matching UI from screenshot 2) --- */}
                {projectInviteTab === 'link' && (
                  <div style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '10px',
                    padding: '20px',
                    backgroundColor: '#FAFAFC',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    {/* Link Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '6px 8px 6px 14px',
                      gap: '10px'
                    }}>
                      <Link2 size={16} style={{ color: '#64748B', flexShrink: 0 }} />
                      <input
                        type="text"
                        readOnly
                        value={projectLink}
                        style={{
                          flex: 1,
                          border: 'none',
                          outline: 'none',
                          fontSize: '13px',
                          color: '#475569',
                          fontFamily: 'var(--font-mono, monospace)',
                          background: 'transparent'
                        }}
                      />
                      <button
                        onClick={handleCopyProjectLink}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: copiedProjectLink ? '#10B981' : '#7C3AED',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 18px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        {copiedProjectLink ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedProjectLink ? 'Copied' : 'Copy Link'}</span>
                      </button>
                    </div>

                    {/* Permissions & Roles Dropdown Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '18px',
                      flexWrap: 'wrap',
                      fontSize: '13px',
                      color: '#475569'
                    }}>
                      {/* Permissions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#374151', fontWeight: 500 }}>Permissions:</span>
                        <div style={{ position: 'relative' }}>
                          <select
                            value={permission}
                            onChange={(e) => setPermission(e.target.value)}
                            style={{
                              padding: '6px 28px 6px 12px',
                              borderRadius: '6px',
                              border: '1px solid #E2E8F0',
                              backgroundColor: '#FFFFFF',
                              fontSize: '13px',
                              fontWeight: 500,
                              color: '#0F172A',
                              appearance: 'none',
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            <option value="Editor">Editor</option>
                            <option value="Viewer">Viewer</option>
                            <option value="Admin">Admin</option>
                          </select>
                          <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
                        </div>
                      </div>

                      {/* Team Role */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#374151', fontWeight: 500 }}>Team Role:</span>
                        <div style={{ position: 'relative' }}>
                          <select
                            value={teamRole}
                            onChange={(e) => setTeamRole(e.target.value)}
                            style={{
                              padding: '6px 28px 6px 12px',
                              borderRadius: '6px',
                              border: '1px solid #E2E8F0',
                              backgroundColor: '#FFFFFF',
                              fontSize: '13px',
                              fontWeight: 500,
                              color: '#0F172A',
                              appearance: 'none',
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            <option value="Team Member">Team Member</option>
                            <option value="Team Admin">Team Admin</option>
                            <option value="Guest">Guest</option>
                          </select>
                          <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
                        </div>
                      </div>

                      {/* Other Projects */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#374151', fontWeight: 500 }}>Other Projects:</span>
                        <div style={{ position: 'relative' }}>
                          <select
                            value={otherProjects}
                            onChange={(e) => setOtherProjects(e.target.value)}
                            style={{
                              padding: '6px 28px 6px 12px',
                              borderRadius: '6px',
                              border: '1px solid #E2E8F0',
                              backgroundColor: '#FFFFFF',
                              fontSize: '13px',
                              fontWeight: 500,
                              color: '#0F172A',
                              appearance: 'none',
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            <option value="Forbidden">Forbidden</option>
                            <option value="Read Only">Read Only</option>
                            <option value="Full Access">Full Access</option>
                          </select>
                          <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }} />
                        </div>
                      </div>
                    </div>

                    {/* Reset Link */}
                    <div style={{ display: 'flex', alignItems: 'center', paddingTop: '4px' }}>
                      <button
                        onClick={handleResetLink}
                        disabled={isResettingLink}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748B',
                          fontSize: '13px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          padding: '4px 0',
                          textDecoration: 'underline'
                        }}
                      >
                        <RotateCw size={13} style={{ animation: isResettingLink ? 'spin 0.6s linear infinite' : 'none' }} />
                        <span>Reset Link</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* --- 2. INVITE VIA EMAIL --- */}
                {projectInviteTab === 'email' && (
                  <form onSubmit={handleSendTeamEmail} style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '10px',
                    padding: '20px',
                    backgroundColor: '#FAFAFC',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                        Email addresses (comma separated)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="developer@company.com, tester@company.com"
                        value={teamEmails}
                        onChange={(e) => setTeamEmails(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #E2E8F0',
                          fontSize: '13px',
                          color: '#0F172A',
                          backgroundColor: '#FFFFFF',
                          outline: 'none',
                          resize: 'none'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>Default Role:</span>
                        <select
                          value={permission}
                          onChange={(e) => setPermission(e.target.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#FFFFFF',
                            fontSize: '13px',
                            color: '#0F172A'
                          }}
                        >
                          <option value="Editor">Editor</option>
                          <option value="Viewer">Viewer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={teamEmailSent}
                        style={{
                          backgroundColor: '#7C3AED',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 20px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Mail size={14} />
                        <span>{teamEmailSent ? 'Sending...' : 'Send Invitations'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* --- 3. SELECT FROM TEAM --- */}
                {projectInviteTab === 'team' && (
                  <div style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '10px',
                    padding: '16px',
                    backgroundColor: '#FAFAFC',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '8px 12px'
                    }}>
                      <Search size={14} style={{ color: '#94A3B8' }} />
                      <input
                        type="text"
                        placeholder="Search team member by name or email..."
                        value={teamSearchQuery}
                        onChange={(e) => setTeamSearchQuery(e.target.value)}
                        style={{
                          border: 'none',
                          outline: 'none',
                          fontSize: '13px',
                          width: '100%',
                          background: 'transparent'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                      {teamMembers
                        .filter(m => m.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) || m.email.toLowerCase().includes(teamSearchQuery.toLowerCase()))
                        .map(member => (
                          <div
                            key={member.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E2E8F0',
                              borderRadius: '6px'
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{member.name}</div>
                              <div style={{ fontSize: '12px', color: '#64748B' }}>{member.email} • {member.role}</div>
                            </div>
                            {member.inProject ? (
                              <span style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                                <CheckCircle2 size={14} /> In Project
                              </span>
                            ) : (
                              <button
                                onClick={() => alert(`Đã thêm ${member.name} vào dự án Kimidev!`)}
                                style={{
                                  backgroundColor: '#F1F5F9',
                                  border: '1px solid #E2E8F0',
                                  borderRadius: '4px',
                                  padding: '4px 12px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: '#0F172A',
                                  cursor: 'pointer'
                                }}
                              >
                                Add to Project
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* BOTTOM CROSS-LINK BANNER (Exact Matching UI from Screenshot 2) */}
              <div
                onClick={() => setActiveTab('referrals')}
                style={{
                  marginTop: '10px',
                  backgroundColor: '#F5F3FF',
                  border: '1px solid #EDE9FE',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#EDE9FE';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5F3FF';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Gift size={18} style={{ color: '#7C3AED', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: '#374151' }}>
                    Invite a new user and earn a <strong style={{ color: '#0F172A' }}>$10 credit</strong>.
                  </span>
                </div>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>Learn more</span>
                  <span style={{ fontSize: '14px' }}>→</span>
                </span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Proof Submission Modal for Tasks */}
      {submitModalTask && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0, 0, 0, 0.06)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                Submit Proof: {submitModalTask.title}
              </h4>
              <button
                onClick={() => setSubmitModalTask(null)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '13px', color: '#64748B' }}>
              {submitModalTask.type === 'screenshot'
                ? 'Tải lên ảnh chụp màn hình bài đánh giá của bạn hoặc dán liên kết URL bài viết.'
                : 'Dán liên kết URL bài viết hoặc trang cá nhân của bạn để đội ngũ kiểm duyệt xác minh.'}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                {submitModalTask.type === 'screenshot' ? 'Đường link bài viết hoặc liên kết ảnh' : 'Đường link URL xác nhận'}
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={submissionInput}
                onChange={(e) => setSubmissionInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  fontSize: '13px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={() => setSubmitModalTask(null)}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  background: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!submissionInput.trim()) {
                    alert('Vui lòng nhập liên kết trước khi gửi minh chứng!');
                    return;
                  }
                  setTaskStatus(prev => ({ ...prev, [submitModalTask.id]: 'REVIEWING' }));
                  setSubmitModalTask(null);
                  alert(`Đã gửi bằng chứng nhận ${submitModalTask.reward} thành công! Đang chờ duyệt.`);
                }}
                style={{
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  background: '#7C3AED',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Gửi duyệt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
