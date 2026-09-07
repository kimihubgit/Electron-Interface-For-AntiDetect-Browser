import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';

/**
 * Centered Login Card component matching the Apidog Welcome UI
 */
export default function LoginCard({ onLogin, onOfflineSpace }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: 'Google User',
        email: 'user.google@gmail.com',
        provider: 'google'
      });
      setIsLoading(false);
    }, 450);
  };

  const handleGithubLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: 'GitHub Developer',
        email: 'developer@github.com',
        provider: 'github'
      });
      setIsLoading(false);
    }, 450);
  };

  const handleSsoLogin = () => {
    const ssoDomain = prompt(t('auth.ssoPrompt'), 'antidetect');
    if (ssoDomain) {
      setIsLoading(true);
      setTimeout(() => {
        onLogin({
          name: `${ssoDomain.trim()} Member`,
          email: `admin@${ssoDomain.trim().toLowerCase()}.com`,
          provider: 'sso'
        });
        setIsLoading(false);
      }, 400);
    }
  };

  const handleEmailLogin = (e) => {
    e?.preventDefault();
    const clean = email.trim();
    if (!clean) {
      setErrorMsg(t('auth.emailRequired'));
      return;
    }
    if (!clean.includes('@') || !clean.includes('.')) {
      setErrorMsg(t('auth.emailInvalid'));
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: clean.split('@')[0],
        email: clean,
        provider: 'email'
      });
      setIsLoading(false);
    }, 450);
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        width: '410px',
        maxWidth: '92vw',
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #F1F5F9',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(15, 23, 42, 0.03)',
        padding: '36px 32px 28px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        boxSizing: 'border-box'
      }}
    >
      {/* Title */}
      <h1
        style={{
          margin: '0 0 24px 0',
          fontSize: '24px',
          fontWeight: 700,
          color: '#0F172A',
          textAlign: 'center',
          letterSpacing: '-0.3px'
        }}
      >
        {t('auth.welcome')}
      </h1>

      {/* Button 1: Continue with Google */}
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          height: '40px',
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          marginBottom: '10px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
      >
        {/* Google G logo */}
        <div style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        </div>
        <span>{t('auth.continueWithGoogle')}</span>
      </button>

      {/* Button 2: Continue with GitHub */}
      <button
        onClick={handleGithubLogin}
        disabled={isLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          height: '40px',
          backgroundColor: '#18181B',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          marginBottom: '10px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#000000'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#18181B'}
      >
        {/* GitHub Octocat Icon */}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#FFFFFF">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
        <span>{t('auth.continueWithGithub')}</span>
      </button>

      {/* Button 3: Sign In with SSO */}
      <button
        onClick={handleSsoLogin}
        disabled={isLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          height: '40px',
          backgroundColor: '#FFFFFF',
          color: '#1E293B',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          marginBottom: '16px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F8FAFC';
          e.currentTarget.style.borderColor = '#CBD5E1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF';
          e.currentTarget.style.borderColor = '#E2E8F0';
        }}
      >
        <span>{t('auth.signInWithSso')}</span>
      </button>

      {/* Email Input & Submit Form */}
      <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <input
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            style={{
              width: '100%',
              height: '40px',
              padding: '0 14px',
              borderRadius: '8px',
              border: errorMsg ? '1.5px solid #EF4444' : '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              fontSize: '13px',
              color: '#0F172A',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease'
            }}
            onFocus={(e) => {
              if (!errorMsg) e.target.style.borderColor = 'var(--apidog-purple)';
            }}
            onBlur={(e) => {
              if (!errorMsg) e.target.style.borderColor = '#E2E8F0';
            }}
          />
          {errorMsg && (
            <div style={{ color: '#EF4444', fontSize: '11px', marginTop: '4px', paddingLeft: '2px' }}>
              {errorMsg}
            </div>
          )}
        </div>

        {/* Button 4: Continue with Email */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            height: '40px',
            backgroundColor: 'var(--apidog-purple)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-purple)'}
        >
          {isLoading ? t('auth.connecting') : t('auth.continueWithEmail')}
        </button>
      </form>

      {/* Free Plan Checklist */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          marginTop: '16px',
          fontSize: '11.5px',
          color: '#64748B',
          whiteSpace: 'nowrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Check size={13} style={{ color: 'var(--apidog-purple)', strokeWidth: 2.5 }} />
          <span>{t('auth.noCreditCard')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Check size={13} style={{ color: 'var(--apidog-purple)', strokeWidth: 2.5 }} />
          <span>{t('auth.noTimeLimit')}</span>
        </div>
      </div>

      {/* Terms and Privacy Disclaimer */}
      <div
        style={{
          marginTop: '22px',
          fontSize: '11px',
          color: '#64748B',
          textAlign: 'center',
          lineHeight: '1.5'
        }}
      >
        {t('auth.agreePrefix')}{' '}
        <span
          onClick={() => alert('Điều khoản dịch vụ (Terms of Service)')}
          style={{ color: 'var(--apidog-purple)', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {t('auth.termsOfService')}
        </span>{' '}
        {t('auth.and')}{' '}
        <span
          onClick={() => alert('Chính sách bảo mật (Privacy Policy)')}
          style={{ color: 'var(--apidog-purple)', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {t('auth.privacyPolicy')}
        </span>
      </div>

      {/* Bottom Link: Use Offline Space */}
      <div style={{ textAlign: 'center', marginTop: '14px' }}>
        <button
          onClick={onOfflineSpace}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '12px',
            color: '#64748B',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--apidog-purple)'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
        >
          {t('auth.useOfflineSpace')}
        </button>
      </div>
    </div>
  );
}
