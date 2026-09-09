import React, { useState } from 'react';
import {
  FileCode,
  Play,
  Plus,
  RotateCw,
  CheckCircle2,
  Clock,
  Zap,
  Copy,
  Check,
  Search,
  Terminal,
  Code
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

export default function ScriptsPage() {
  const { profiles = [], addLog } = useBrowser();

  const [activeSubTab, setActiveSubTab] = useState('templates');
  const [runningScriptId, setRunningScriptId] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [scripts, setScripts] = useState([
    {
      id: 'script-01',
      name: 'Nuôi tài khoản Facebook & Lướt Bảng Tin',
      engine: 'Playwright',
      category: 'Social Media',
      successRate: '99.2%',
      assignedProfiles: 12,
      lastRun: '15 phút trước',
      description: 'Mã kịch bản Playwright Node.js mô phỏng thao tác người thật trên Facebook: cuộn newsfeed ngẫu nhiên, xem video watch, like bài viết.',
      code: `// Playwright Script: Facebook Human Interaction
const { chromium } = require('playwright');

async function runFacebookFarming(profile) {
  const browser = await chromium.launchPersistentContext(profile.userDataDir, {
    headless: false,
    args: profile.launchArgs
  });
  const page = await browser.newPage();
  await page.goto('https://www.facebook.com');
  // Human-like scroll behavior
  for (let i = 0; i < 15; i++) {
    await page.mouse.wheel(0, Math.floor(Math.random() * 300 + 100));
    await page.waitForTimeout(Math.random() * 2000 + 1000);
  }
  console.log('[Script] Completed session for ' + profile.name);
  await browser.close();
}`
    },
    {
      id: 'script-02',
      name: 'Tự động tương tác TikTok Shop VN',
      engine: 'Puppeteer',
      category: 'E-commerce',
      successRate: '98.5%',
      assignedProfiles: 8,
      lastRun: '1 giờ trước',
      description: 'Kịch bản Puppeteer Core kết nối qua CDP Endpoint, xem livestream 3-5 phút, lướt giỏ hàng và lưu voucher.',
      code: `// Puppeteer Script: TikTok Shop
const puppeteer = require('puppeteer-core');

async function runTikTok(profile) {
  const browser = await puppeteer.connect({ browserWSEndpoint: profile.wsEndpoint });
  const page = await browser.newPage();
  await page.goto('https://seller-vn.tiktok.com');
  await page.waitForSelector('.creator-dashboard', { timeout: 15000 });
  console.log('[TikTok] Interacted successfully');
}`
    },
    {
      id: 'script-03',
      name: 'Auto Claim Token & Crypto Airdrop',
      engine: 'Playwright Web3',
      category: 'Web3 / Crypto',
      successRate: '96.8%',
      assignedProfiles: 15,
      lastRun: '3 giờ trước',
      description: 'Kịch bản tự động ký ví MetaMask, điểm danh nhận token airdrop hàng ngày trên mạng testnet/mainnet.',
      code: `// Web3 Airdrop Automation Script
async function claimAirdrop(profile) {
  console.log('[Web3] Connecting to wallet on ' + profile.name);
  // Auto-fill faucet and sign transaction
}`
    },
    {
      id: 'script-04',
      name: 'Cào dữ liệu giá Shopee & Amazon đối thủ',
      engine: 'Puppeteer Stealth',
      category: 'Data Scraping',
      successRate: '99.8%',
      assignedProfiles: 4,
      lastRun: 'Hôm qua',
      description: 'Thu thập thông tin sản phẩm, số lượng đã bán, giá niêm yết và đánh giá của gian hàng đối thủ cạnh tranh.',
      code: `// Scraper: Shopee / Amazon competitor products
async function scrapeCompetitor(targetUrl) {
  console.log('[Scraper] Extracting product catalog: ' + targetUrl);
}`
    }
  ]);

  const [logs, setLogs] = useState([
    '[20:15:01] [SCRIPTS] Kho mã nguồn Playwright / Puppeteer sẵn sàng.',
    '[20:15:10] [SYSTEM] Đã nạp 4 kịch bản lập trình mẫu.'
  ]);

  const handleRunScript = (script) => {
    setRunningScriptId(script.id);
    if (addLog) addLog(`▶ Đang chạy kịch bản mã nguồn: "${script.name}"`, 'success');
    
    setLogs(prev => [
      `[${new Date().toLocaleTimeString('vi-VN')}] [START] Chạy file script "${script.name}"...`,
      ...prev
    ]);

    setTimeout(() => {
      setRunningScriptId(null);
      if (addLog) addLog(`✓ Kịch bản "${script.name}" đã thực thi thành công!`, 'success');
      setLogs(prev => [
        `[${new Date().toLocaleTimeString('vi-VN')}] [DONE] Hoàn tất script "${script.name}".`,
        ...prev
      ]);
    }, 2000);
  };

  const handleCopyCode = (code, key) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    if (addLog) addLog('Đã sao chép mã kịch bản vào clipboard', 'info');
  };

  const filteredScripts = scripts.filter(s => 
    !searchTerm || 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      flex: 1,
      height: '100%',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--apidog-bg)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 24px',
        backgroundColor: 'var(--apidog-card-bg)',
        borderBottom: '1px solid var(--apidog-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563EB'
          }}>
            <FileCode size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
                Kho Kịch Bản Mã Nguồn (Code Scripts Library)
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '4px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: '#2563EB'
              }}>
                PLAYWRIGHT & PUPPETEER
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--apidog-text-muted)', marginTop: '2px' }}>
              Thư viện mã script lập trình độc lập dành cho developers và chuyên gia automation.
            </div>
          </div>
        </div>

        <button
          onClick={() => alert('Mở trình tạo script mới')}
          style={{
            height: '34px',
            padding: '0 14px',
            backgroundColor: 'var(--apidog-purple)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={14} />
          <span>Tạo Script Mới</span>
        </button>
      </div>

      {/* Sub-tabs & Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid var(--apidog-border)',
        backgroundColor: 'var(--apidog-card-bg)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {[
            { id: 'templates', label: 'Tất cả Scripts', count: scripts.length },
            { id: 'logs', label: 'Terminal Logs', count: logs.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '11px 16px',
                fontSize: '12.5px',
                fontWeight: activeSubTab === tab.id ? 600 : 500,
                color: activeSubTab === tab.id ? 'var(--apidog-purple)' : 'var(--apidog-text-muted)',
                borderBottom: activeSubTab === tab.id ? '2px solid var(--apidog-purple)' : '2px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: '10.5px',
                padding: '1px 6px',
                borderRadius: '10px',
                backgroundColor: activeSubTab === tab.id ? 'rgba(124, 58, 237, 0.1)' : 'var(--apidog-bg)',
                color: activeSubTab === tab.id ? 'var(--apidog-purple)' : 'var(--apidog-text-muted)'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--apidog-bg)',
          border: '1px solid var(--apidog-border)',
          borderRadius: '6px',
          padding: '0 8px',
          height: '28px',
          width: '240px'
        }}>
          <Search size={13} style={{ color: 'var(--apidog-text-muted)', marginRight: '6px' }} />
          <input
            type="text"
            placeholder="Tìm script..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '12px',
              width: '100%',
              backgroundColor: 'transparent',
              color: 'var(--apidog-text-main)'
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 24px' }}>
        {activeSubTab === 'templates' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredScripts.map(script => (
              <div
                key={script.id}
                style={{
                  backgroundColor: 'var(--apidog-card-bg)',
                  border: '1px solid var(--apidog-border)',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
                        {script.name}
                      </span>
                      <span style={{ fontSize: '10.5px', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600 }}>
                        {script.engine}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--apidog-text-muted)', marginTop: '4px' }}>
                      {script.description}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleCopyCode(script.code, script.id)}
                      className="btn-secondary"
                      style={{ fontSize: '12px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedKey === script.id ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                      <span>{copiedKey === script.id ? 'Đã chép' : 'Sao chép mã'}</span>
                    </button>
                    <button
                      onClick={() => handleRunScript(script)}
                      disabled={runningScriptId === script.id}
                      style={{
                        height: '30px',
                        padding: '0 12px',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      {runningScriptId === script.id ? <RotateCw size={12} className="spin" /> : <Play size={12} fill="#FFFFFF" />}
                      <span>{runningScriptId === script.id ? 'Đang chạy...' : 'Chạy'}</span>
                    </button>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#0F172A',
                  color: '#38BDF8',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontFamily: 'monospace',
                  fontSize: '11.5px',
                  maxHeight: '100px',
                  overflowY: 'hidden',
                  whiteSpace: 'pre-wrap',
                  opacity: 0.85
                }}>
                  {script.code.slice(0, 220)}...
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'logs' && (
          <div style={{
            height: '100%',
            backgroundColor: '#0F172A',
            color: '#F8FAFC',
            borderRadius: '8px',
            padding: '14px',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: 1.7
          }}>
            {logs.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        )}
      </div>
    </div>
  );
}
