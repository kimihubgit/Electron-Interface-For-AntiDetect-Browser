// Default Antidetect MCP Tools (9 Core Tools)
export const ANTIDETECT_MCP_TOOLS = [
  {
    name: 'antidetect_list_profiles',
    description: 'List all antidetect browser profiles with tags, proxy status, and fingerprint configs.',
    category: 'Management',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        filter: { type: 'string', description: 'Filter by status: all, active, stopped' },
        limit: { type: 'number', description: 'Max profiles to return' }
      }
    },
    sampleArgs: { filter: 'active', limit: 10 }
  },
  {
    name: 'antidetect_launch_profile',
    description: 'Launch an isolated profile with stealth fingerprint spoofing and return CDP WebSocket URL.',
    category: 'Lifecycle',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'ID of the profile to launch' },
        headless: { type: 'boolean', description: 'Launch without UI window' },
        stealth: { type: 'boolean', description: 'Inject antidetect evasion scripts' }
      },
      required: ['profileId']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', headless: false, stealth: true }
  },
  {
    name: 'antidetect_close_profile',
    description: 'Gracefully close profile, terminate browser process, and flush cookies to persistent storage.',
    category: 'Lifecycle',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'ID of profile to close' },
        saveStorage: { type: 'boolean', description: 'Whether to persist storage/cookies' }
      },
      required: ['profileId']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', saveStorage: true }
  },
  {
    name: 'antidetect_navigate',
    description: 'Navigate target page with randomized human latency and network idle checks.',
    category: 'Navigation',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'Active profile ID' },
        url: { type: 'string', description: 'Target URL' },
        waitUntil: { type: 'string', enum: ['load', 'domcontentloaded', 'networkidle0'] }
      },
      required: ['profileId', 'url']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', url: 'https://browserleaks.com/canvas', waitUntil: 'networkidle0' }
  },
  {
    name: 'antidetect_human_click',
    description: 'Perform human-like mouse movement via Bezier curve trajectory before clicking selector.',
    category: 'Interaction',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'Active profile ID' },
        selector: { type: 'string', description: 'CSS or XPath selector' },
        jitter: { type: 'boolean', description: 'Add micro mouse jitter' }
      },
      required: ['profileId', 'selector']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', selector: 'button[type="submit"]', jitter: true }
  },
  {
    name: 'antidetect_human_type',
    description: 'Type text with variable keystroke delays (60-180ms) and organic typo correction simulation.',
    category: 'Interaction',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'Active profile ID' },
        selector: { type: 'string', description: 'Input selector' },
        text: { type: 'string', description: 'Text to input' }
      },
      required: ['profileId', 'selector', 'text']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', selector: 'input[name="username"]', text: 'affiliate_partner_us' }
  },
  {
    name: 'antidetect_bypass_captcha',
    description: 'Detect and solve Cloudflare Turnstile, reCAPTCHA v2/v3, GeeTest, or hCaptcha autonomously.',
    category: 'Security',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'Active profile ID' },
        type: { type: 'string', enum: ['auto', 'cloudflare_turnstile', 'recaptcha', 'hcaptcha'] },
        timeoutMs: { type: 'number', description: 'Max solving wait time' }
      },
      required: ['profileId']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', type: 'cloudflare_turnstile', timeoutMs: 15000 }
  },
  {
    name: 'antidetect_rotate_proxy',
    description: 'Trigger dynamic IP rotation on active mobile/residential proxy gateway.',
    category: 'Network',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'Profile whose proxy needs rotation' },
        changeCountry: { type: 'string', description: 'Optional 2-letter ISO country code' }
      },
      required: ['profileId']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', changeCountry: 'US' }
  },
  {
    name: 'antidetect_take_screenshot',
    description: 'Capture screenshot of current page or element without leaving automation artifacts.',
    category: 'Inspection',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'Active profile ID' },
        fullPage: { type: 'boolean', description: 'Capture full scrollable height' }
      },
      required: ['profileId']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', fullPage: false }
  }
];

// Initial Debugger Sessions
export const INITIAL_SESSIONS = [
  {
    id: 'session-1',
    title: 'Session 1',
    status: 'error',
    turnsCount: 1,
    stepsCount: 0,
    duration: '1s',
    model: 'gpt-5.5',
    errorSnippet: '[Auth Error] Incorrect API key provided. You can find your API key at https://platform.openai.com/account/api-keys',
    turns: [
      {
        id: 'turn-1',
        title: 'Turn 1',
        userPrompt: 'Hi',
        status: 'error',
        error: 'AuthenticationError: Incorrect API key provided. Please configure key in Auth tab.',
        duration: '0.8s',
        tokens: 0,
        toolsCalled: 0,
        steps: []
      }
    ]
  },
  {
    id: 'session-2',
    title: 'Session 2 (TikTok Stealth)',
    status: 'success',
    turnsCount: 1,
    stepsCount: 3,
    duration: '2.4s',
    model: 'gpt-4o',
    errorSnippet: null,
    statusSnippet: 'antidetect_launch_profile -> Success (CDP ws://127.0.0.1:9222/devtools/...)',
    turns: [
      {
        id: 'turn-1',
        title: 'Turn 1',
        userPrompt: 'Launch TikTok US #1 profile, navigate to tiktok.com and check canvas spoofing.',
        status: 'success',
        duration: '2.4s',
        tokens: 684,
        toolsCalled: 3,
        steps: [
          {
            id: 'step-1',
            tool: 'antidetect_launch_profile',
            duration: '820ms',
            status: 'success',
            statusCode: 200,
            args: {
              profileId: 'prof_tiktok_01',
              headless: false,
              stealth: true
            },
            result: {
              success: true,
              pid: 14820,
              cdpWebSocketUrl: 'ws://127.0.0.1:9222/devtools/browser/7b1c4e92-3a5f-4d9a',
              fingerprint: {
                os: 'Windows 11',
                browser: 'Chrome 131.0.6778.86',
                canvasNoise: '0.0019248 (Spoofed)',
                webglVendor: 'Google Inc. (NVIDIA GeForce RTX 4070)',
                audioContextLatency: '0.0412s'
              }
            }
          },
          {
            id: 'step-2',
            tool: 'antidetect_navigate',
            duration: '950ms',
            status: 'success',
            statusCode: 200,
            args: {
              profileId: 'prof_tiktok_01',
              url: 'https://browserleaks.com/canvas',
              waitUntil: 'networkidle0'
            },
            result: {
              success: true,
              httpStatus: 200,
              pageTitle: 'Canvas Fingerprinting - BrowserLeaks',
              loadedInMs: 942
            }
          },
          {
            id: 'step-3',
            tool: 'antidetect_take_screenshot',
            duration: '630ms',
            status: 'success',
            statusCode: 200,
            args: {
              profileId: 'prof_tiktok_01',
              fullPage: false
            },
            result: {
              success: true,
              mimeType: 'image/png',
              sizeBytes: 124980,
              previewUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
            }
          }
        ]
      }
    ]
  }
];
