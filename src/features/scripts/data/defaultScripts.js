export const DEFAULT_SCRIPTS = [
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
];

export const INITIAL_SCRIPT_LOGS = [
  '[20:15:01] [SCRIPTS] Kho mã nguồn Playwright / Puppeteer sẵn sàng.',
  '[20:15:10] [SYSTEM] Đã nạp 4 kịch bản lập trình mẫu.'
];
