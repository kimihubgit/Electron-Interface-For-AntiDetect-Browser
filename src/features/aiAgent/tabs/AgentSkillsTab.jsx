import React from 'react';
import { Sparkles, Shield, RotateCw } from 'lucide-react';

export default function AgentSkillsTab() {
  return (
    <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
      <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600, color: '#1E293B' }}>
        Pre-built Agent Skills
      </h3>
      <p style={{ margin: '0 0 18px 0', fontSize: '12px', color: '#64748B' }}>
        Composite high-level capabilities chaining multiple MCP tools for autonomous browser operations.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={16} style={{ color: '#7C3AED' }} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Stealth Social Account Warmup</span>
            <span style={{ fontSize: '11px', color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>Ready</span>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 8px 0' }}>
            Autonomously visits authority domains (Wikipedia, News, Reddit), conducts organic searches, moves mouse organically, and gathers trusted cookies before entering social platforms.
          </p>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Tools chained: <code>antidetect_launch_profile</code> ➔ <code>antidetect_navigate</code> ➔ <code>antidetect_human_click</code>
          </div>
        </div>

        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Shield size={16} style={{ color: '#2563EB' }} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Cloudflare Turnstile & reCAPTCHA Auto-Bypass</span>
            <span style={{ fontSize: '11px', color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>Ready</span>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 8px 0' }}>
            Detects challenge iframes, waits for domestic canvas stability, solves Turnstile box with human click coordinates, or calls audio captcha AI transcript.
          </p>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Tools chained: <code>antidetect_bypass_captcha</code> ➔ <code>antidetect_human_click</code>
          </div>
        </div>

        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <RotateCw size={16} style={{ color: '#D97706' }} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Proxy Auto-Failover & IP Health Audit</span>
            <span style={{ fontSize: '11px', color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>Ready</span>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 8px 0' }}>
            Tests IP fraud score against Scamalytics / IP-API, automatically calls proxy provider rotate endpoint if blacklisted, and verifies DNS leak.
          </p>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Tools chained: <code>antidetect_rotate_proxy</code> ➔ <code>antidetect_navigate</code>
          </div>
        </div>
      </div>
    </div>
  );
}
