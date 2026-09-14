import { useState, useRef, useEffect } from 'react';
import { useBrowser } from '../../../store/BrowserContext';
import { useTranslation } from '../../../i18n/I18nContext';

export function useSettingsState() {
  const { t } = useTranslation();
  const {
    activeSettingsSection = 'general',
    setActiveSettingsSection,
    setActiveTab,
    addLog = () => {},
    showToast
  } = useBrowser();

  const scrollContainerRef = useRef(null);
  const isProgrammaticScroll = useRef(false);

  // 1. Thư mục chung
  const [profileDataPath, setProfileDataPath] = useState(() => {
    return localStorage.getItem('cfg_profile_data_path') || 'C:\\Users\\vkhai\\AppData\\Roaming\\omnilogin\\omni-profiles';
  });
  const [workflowDataPath, setWorkflowDataPath] = useState(() => {
    return localStorage.getItem('cfg_workflow_data_path') || 'C:\\Users\\vkhai\\AppData\\Roaming\\omnilogin\\automation\\data';
  });

  // 2. Mọi phiên trình duyệt
  const [clearCacheOnClose, setClearCacheOnClose] = useState(() => {
    return localStorage.getItem('cfg_clear_cache_on_close') === 'true';
  });
  const [saveSessionOnClose, setSaveSessionOnClose] = useState(() => {
    return localStorage.getItem('cfg_save_session_on_close') === 'true';
  });
  const [autoSavePassword, setAutoSavePassword] = useState(() => {
    const val = localStorage.getItem('cfg_auto_save_password');
    return val === null ? true : val === 'true';
  });
  const [headlessMode, setHeadlessMode] = useState(() => {
    return localStorage.getItem('cfg_headless_mode') === 'true';
  });
  const [disableGpu, setDisableGpu] = useState(() => {
    return localStorage.getItem('cfg_disable_gpu') === 'true';
  });
  const [disableExtensions, setDisableExtensions] = useState(() => {
    return localStorage.getItem('cfg_disable_extensions') === 'true';
  });
  const [enableTranslate, setEnableTranslate] = useState(() => {
    return localStorage.getItem('cfg_enable_translate') === 'true';
  });

  // 3. Chạy đồng thời & Hiệu năng
  const [maxConcurrentProfiles, setMaxConcurrentProfiles] = useState(() => {
    const val = localStorage.getItem('cfg_max_concurrent_profiles');
    return val !== null ? parseInt(val, 10) : 5; // 0 = Không giới hạn, mặc định 5
  });
  const [launchDelaySeconds, setLaunchDelaySeconds] = useState(() => {
    const val = localStorage.getItem('cfg_launch_delay_seconds');
    return val !== null ? parseFloat(val) : 2; // Khoảng cách mở các profile liên tiếp
  });
  const [autoCloseIdle, setAutoCloseIdle] = useState(() => {
    return localStorage.getItem('cfg_auto_close_idle') === 'true';
  });
  const [idleTimeoutMinutes, setIdleTimeoutMinutes] = useState(() => {
    const val = localStorage.getItem('cfg_idle_timeout_minutes');
    return val !== null ? parseInt(val, 10) : 30;
  });
  const [ramWarningThreshold, setRamWarningThreshold] = useState(() => {
    const val = localStorage.getItem('cfg_ram_warning_threshold');
    return val !== null ? parseInt(val, 10) : 85; // Cảnh báo khi RAM vượt quá 85%
  });

  // 4. Nội dung trang tải
  const [blockImages, setBlockImages] = useState(() => {
    return localStorage.getItem('cfg_block_images') === 'true';
  });
  const [hideImages, setHideImages] = useState(() => {
    return localStorage.getItem('cfg_hide_images') === 'true';
  });
  const [blockMedia, setBlockMedia] = useState(() => {
    return localStorage.getItem('cfg_block_media') === 'true';
  });
  const [muteAudio, setMuteAudio] = useState(() => {
    return localStorage.getItem('cfg_mute_audio') === 'true';
  });

  // 5. Hiển thị & Thao tác
  const [iconDisplayLabel, setIconDisplayLabel] = useState(() => {
    return localStorage.getItem('cfg_icon_display_label') || 'ID Profile';
  });
  const [recordsPerPage, setRecordsPerPage] = useState(() => {
    return localStorage.getItem('cfg_records_per_page') || '10, 20, 50, 100';
  });
  const [typingSpeed, setTypingSpeed] = useState(() => {
    const val = localStorage.getItem('cfg_typing_speed');
    return val ? Number(val) : 3;
  });

  // 6. Lõi Chromium & Bảo mật
  const [chromiumPath, setChromiumPath] = useState(() => {
    return localStorage.getItem('cfg_chromium_path') || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  });
  const [encryptLocalStorage, setEncryptLocalStorage] = useState(() => {
    return localStorage.getItem('cfg_encrypt_local_storage') === 'true';
  });

  // Lưu cài đặt
  const handleSaveSettings = () => {
    localStorage.setItem('cfg_profile_data_path', profileDataPath);
    localStorage.setItem('cfg_workflow_data_path', workflowDataPath);

    localStorage.setItem('cfg_clear_cache_on_close', clearCacheOnClose);
    localStorage.setItem('cfg_save_session_on_close', saveSessionOnClose);
    localStorage.setItem('cfg_auto_save_password', autoSavePassword);
    localStorage.setItem('cfg_headless_mode', headlessMode);
    localStorage.setItem('cfg_disable_gpu', disableGpu);
    localStorage.setItem('cfg_disable_extensions', disableExtensions);
    localStorage.setItem('cfg_enable_translate', enableTranslate);

    localStorage.setItem('cfg_max_concurrent_profiles', maxConcurrentProfiles);
    localStorage.setItem('cfg_launch_delay_seconds', launchDelaySeconds);
    localStorage.setItem('cfg_auto_close_idle', autoCloseIdle);
    localStorage.setItem('cfg_idle_timeout_minutes', idleTimeoutMinutes);
    localStorage.setItem('cfg_ram_warning_threshold', ramWarningThreshold);

    localStorage.setItem('cfg_block_images', blockImages);
    localStorage.setItem('cfg_hide_images', hideImages);
    localStorage.setItem('cfg_block_media', blockMedia);
    localStorage.setItem('cfg_mute_audio', muteAudio);

    localStorage.setItem('cfg_icon_display_label', iconDisplayLabel);
    localStorage.setItem('cfg_records_per_page', recordsPerPage);
    localStorage.setItem('cfg_typing_speed', typingSpeed);

    localStorage.setItem('cfg_chromium_path', chromiumPath);
    localStorage.setItem('cfg_encrypt_local_storage', encryptLocalStorage);

    addLog(t('toasts.savedSystemSettings', 'Đã lưu cấu hình cài đặt hệ thống thành công!'), 'success');
    if (showToast) {
      showToast(t('toasts.savedSystemSettings', 'Đã lưu cấu hình cài đặt hệ thống thành công!'), 'success');
    }
  };

  const handleBrowseFolder = (type) => {
    const current = type === 'profile' ? profileDataPath : workflowDataPath;
    const newPath = prompt(`Nhập đường dẫn thư mục mới cho ${type === 'profile' ? 'Profile Data' : 'Quy trình'}:`, current);
    if (newPath && newPath.trim()) {
      if (type === 'profile') setProfileDataPath(newPath.trim());
      else setWorkflowDataPath(newPath.trim());
    }
  };

  // Cuộn mượt đến section khi activeSettingsSection đổi
  useEffect(() => {
    if (!activeSettingsSection) return;
    const el = document.getElementById(`setting-section-${activeSettingsSection}`);
    if (el && scrollContainerRef.current) {
      isProgrammaticScroll.current = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const timer = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [activeSettingsSection]);

  // Scroll spy để đổi section active bên sidebar
  const handleScroll = () => {
    if (isProgrammaticScroll.current || !scrollContainerRef.current) return;
    const sections = ['general', 'browser', 'concurrency', 'content', 'display', 'core'];
    const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
    let current = 'general';
    for (const s of sections) {
      const el = document.getElementById(`setting-section-${s}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top - containerTop <= 150) {
          current = s;
        }
      }
    }
    if (current && current !== activeSettingsSection) {
      setActiveSettingsSection?.(current);
    }
  };

  return {
    scrollContainerRef,
    handleScroll,
    handleSaveSettings,
    handleBrowseFolder,
    setActiveTab,
    activeSettingsSection,
    setActiveSettingsSection,

    // General
    profileDataPath,
    setProfileDataPath,
    workflowDataPath,
    setWorkflowDataPath,

    // Browser
    clearCacheOnClose,
    setClearCacheOnClose,
    saveSessionOnClose,
    setSaveSessionOnClose,
    autoSavePassword,
    setAutoSavePassword,
    headlessMode,
    setHeadlessMode,
    disableGpu,
    setDisableGpu,
    disableExtensions,
    setDisableExtensions,
    enableTranslate,
    setEnableTranslate,

    // Concurrency
    maxConcurrentProfiles,
    setMaxConcurrentProfiles,
    launchDelaySeconds,
    setLaunchDelaySeconds,
    autoCloseIdle,
    setAutoCloseIdle,
    idleTimeoutMinutes,
    setIdleTimeoutMinutes,
    ramWarningThreshold,
    setRamWarningThreshold,

    // Content
    blockImages,
    setBlockImages,
    hideImages,
    setHideImages,
    blockMedia,
    setBlockMedia,
    muteAudio,
    setMuteAudio,

    // Display
    iconDisplayLabel,
    setIconDisplayLabel,
    recordsPerPage,
    setRecordsPerPage,
    typingSpeed,
    setTypingSpeed,

    // Core
    chromiumPath,
    setChromiumPath,
    encryptLocalStorage,
    setEncryptLocalStorage
  };
}
