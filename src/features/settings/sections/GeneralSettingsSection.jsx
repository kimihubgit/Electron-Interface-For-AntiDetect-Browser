import React from 'react';
import {
  Save,
  Globe,
  Rocket,
  Bookmark,
  Monitor,
  Network,
  FolderOpen,
  Plus,
  Trash2,
  Upload
} from 'lucide-react';
import SettingSwitchItem from '../components/SettingSwitchItem';

export default function GeneralSettingsSection({
  t,
  // 1. Trình duyệt & Dấu vân tay
  syncIpGeo,
  setSyncIpGeo,
  allowChromeLogin,
  setAllowChromeLogin,
  translatePages,
  setTranslatePages,
  disableDevTools,
  setDisableDevTools,
  disableExtensionsManage,
  setDisableExtensionsManage,
  virtualCamera,
  setVirtualCamera,
  mobileEmulation,
  setMobileEmulation,
  // 2. Khi khởi động
  skipProxyDetectPage,
  setSkipProxyDetectPage,
  resumeLastSession,
  setResumeLastSession,
  onlyAvailableProxy,
  setOnlyAvailableProxy,
  waitCacheLoaded,
  setWaitCacheLoaded,
  geoMatchLast,
  setGeoMatchLast,
  safeBrowsingHttps,
  setSafeBrowsingHttps,
  disableVideoLoading,
  setDisableVideoLoading,
  blockImagesAboveSize,
  setBlockImagesAboveSize,
  imageSizeLimitKb,
  setImageSizeLimitKb,
  clearCacheOnStartup,
  setClearCacheOnStartup,
  clearCacheTypes,
  setClearCacheTypes,
  // 3. Upload Dấu trang
  bookmarksList,
  setBookmarksList,
  newBookmarkTitle,
  setNewBookmarkTitle,
  newBookmarkUrl,
  setNewBookmarkUrl,
  handleAddBookmark,
  handleDeleteBookmark,
  handleFileUploadBookmarks,
  // 4. Chế độ nhiều thiết bị
  multiDeviceMode,
  setMultiDeviceMode,
  multiDeviceScope,
  setMultiDeviceScope,
  multiDeviceCustomProfiles,
  setMultiDeviceCustomProfiles,
  // 5. Quản lý trang web & Mạng
  urlFilterEnabled,
  setUrlFilterEnabled,
  urlFilterMode,
  setUrlFilterMode,
  urlFilterList,
  setUrlFilterList,
  fbStaticLocal,
  setFbStaticLocal,
  localNetworkAccess,
  setLocalNetworkAccess,
  localNetworkUrls,
  setLocalNetworkUrls,
  // 6. Đường dẫn & Mã hóa
  profileDataPath,
  setProfileDataPath,
  chromiumPath,
  setChromiumPath,
  autoSyncCookie,
  setAutoSyncCookie,
  encryptLocalProfiles,
  setEncryptLocalProfiles,
  onSave
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '880px', paddingBottom: '40px' }}>
      {/* Header & Save Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {t('settings.generalTitle', 'Cài Đặt Chung Hệ Thống (General Settings)')}
          </h2>
          <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
            {t('settings.generalDesc', 'Tùy biến môi trường vân tay, hành vi khi khởi động, quản lý dấu trang, chế độ nhiều thiết bị và kiểm soát mạng')}
          </p>
        </div>
        <button
          onClick={onSave}
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            fontSize: '13px',
            fontWeight: 600,
            borderRadius: '8px',
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)'
          }}
        >
          <Save size={15} />
          {t('settings.saveGeneralBtn', 'Lưu Cài Đặt')}
        </button>
      </div>

      {/* CARD 1: TRÌNH DUYỆT & DẤU VÂN TAY */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FAFCFF'
          }}
        >
          <Globe size={18} style={{ color: '#3B82F6' }} />
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
              {t('settings.cardBrowserFp', 'Trình Duyệt & Dấu Vân Tay')}
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              {t('settings.cardBrowserFpDesc', 'Thiết lập hành vi đồng bộ vân tay địa lý, quyền truy cập công cụ nhà phát triển và tiện ích')}
            </span>
          </div>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <SettingSwitchItem
            label="Khi IP thay đổi, thời gian và địa lý sẽ thay đổi theo"
            subtitle="Tự động căn chỉnh Timezone, Geolocation và Ngôn ngữ khớp với địa chỉ IP của Proxy"
            checked={syncIpGeo}
            onChange={setSyncIpGeo}
          />

          <SettingSwitchItem
            label="Cho phép đăng nhập Chrome"
            subtitle="Khi tắt, bạn có thể đăng nhập vào các trang Google như Gmail mà không cần Chrome. Việc bật/tắt công tắc này sẽ đăng xuất tài khoản Google hiện đang đăng nhập trong Chrome."
            checked={allowChromeLogin}
            onChange={setAllowChromeLogin}
          />

          <SettingSwitchItem
            label="Yêu cầu dịch các trang không có trong ngôn ngữ của bạn"
            subtitle="Tự động kích hoạt thanh dịch của Chrome khi truy cập trang web nước ngoài"
            checked={translatePages}
            onChange={setTranslatePages}
          />

          {/* Disable DevTools */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                onClick={() => setDisableDevTools(!disableDevTools)}
                style={{
                  width: '38px',
                  height: '21px',
                  borderRadius: '12px',
                  backgroundColor: disableDevTools ? '#3B82F6' : '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  cursor: 'pointer',
                  transition: 'background-color 0.18s ease',
                  flexShrink: 0,
                  boxSizing: 'border-box'
                }}
              >
                <div
                  style={{
                    width: '17px',
                    height: '17px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transform: disableDevTools ? 'translateX(17px)' : 'translateX(0px)',
                    transition: 'transform 0.18s ease'
                  }}
                />
              </div>
              <div
                onClick={() => setDisableDevTools(!disableDevTools)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                  Vô hiệu hóa quyền truy cập vào Công cụ Nhà phát triển của trình duyệt
                </span>
                <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #DBEAFE' }}>
                  Chrome 133+
                </span>
              </div>
            </div>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', paddingLeft: '48px' }}>
              Khóa phím F12 và mục Inspect Element để tránh rò rỉ cấu trúc môi trường. Chỉ áp dụng cho Chrome 133 trở lên.
            </span>
          </div>

          {/* Disable Extensions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                onClick={() => setDisableExtensionsManage(!disableExtensionsManage)}
                style={{
                  width: '38px',
                  height: '21px',
                  borderRadius: '12px',
                  backgroundColor: disableExtensionsManage ? '#3B82F6' : '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  cursor: 'pointer',
                  transition: 'background-color 0.18s ease',
                  flexShrink: 0,
                  boxSizing: 'border-box'
                }}
              >
                <div
                  style={{
                    width: '17px',
                    height: '17px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transform: disableExtensionsManage ? 'translateX(17px)' : 'translateX(0px)',
                    transition: 'transform 0.18s ease'
                  }}
                />
              </div>
              <div
                onClick={() => setDisableExtensionsManage(!disableExtensionsManage)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                  Vô hiệu hóa cài đặt và gỡ bỏ tiện ích mở rộng trong trình duyệt
                </span>
                <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #DBEAFE' }}>
                  Chrome 133+
                </span>
                <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 500 }}>
                  Chủ sở hữu không bị hạn chế
                </span>
              </div>
            </div>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', paddingLeft: '48px' }}>
              Ngăn người dùng tự ý cài hoặc xóa extension. Chỉ có hiệu lực với Chrome phiên bản 133 trở lên.
            </span>
          </div>

          {/* Virtual Camera */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                onClick={() => setVirtualCamera(!virtualCamera)}
                style={{
                  width: '38px',
                  height: '21px',
                  borderRadius: '12px',
                  backgroundColor: virtualCamera ? '#3B82F6' : '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  cursor: 'pointer',
                  transition: 'background-color 0.18s ease',
                  flexShrink: 0,
                  boxSizing: 'border-box'
                }}
              >
                <div
                  style={{
                    width: '17px',
                    height: '17px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transform: virtualCamera ? 'translateX(17px)' : 'translateX(0px)',
                    transition: 'transform 0.18s ease'
                  }}
                />
              </div>
              <div
                onClick={() => setVirtualCamera(!virtualCamera)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                  Bật camera ảo để mô phỏng video cục bộ như một nguồn phát trực tiếp từ camera
                </span>
                <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #DBEAFE' }}>
                  Chrome 140+
                </span>
              </div>
            </div>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', paddingLeft: '48px' }}>
              Giả lập webcam từ tệp video định dạng mp4/webm mà không cần camera thực tế.
            </span>
          </div>

          {/* Mobile Emulation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                onClick={() => setMobileEmulation(!mobileEmulation)}
                style={{
                  width: '38px',
                  height: '21px',
                  borderRadius: '12px',
                  backgroundColor: mobileEmulation ? '#3B82F6' : '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  cursor: 'pointer',
                  transition: 'background-color 0.18s ease',
                  flexShrink: 0,
                  boxSizing: 'border-box'
                }}
              >
                <div
                  style={{
                    width: '17px',
                    height: '17px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transform: mobileEmulation ? 'translateX(17px)' : 'translateX(0px)',
                    transition: 'transform 0.18s ease'
                  }}
                />
              </div>
              <div
                onClick={() => setMobileEmulation(!mobileEmulation)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                  Bật tối ưu hóa mô phỏng trên thiết bị di động
                </span>
                <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #DBEAFE' }}>
                  Chrome 143+
                </span>
              </div>
            </div>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', paddingLeft: '48px' }}>
              Tối ưu giao diện hiển thị giống với hiệu ứng của thiết bị thật hơn (touch events, viewport scaling). Chỉ áp dụng cho Chrome 143 trở lên.
            </span>
          </div>
        </div>
      </div>

      {/* CARD 2: KHI KHỞI ĐỘNG */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FAFCFF'
          }}
        >
          <Rocket size={18} style={{ color: '#3B82F6' }} />
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
              {t('settings.cardStartup', 'Khi Khởi Động')}
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              {t('settings.cardStartupDesc', 'Kiểm soát an toàn proxy, điều kiện mở profile, tối ưu hóa tốc độ và bảo mật')}
            </span>
          </div>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <SettingSwitchItem
            label="Không khởi động trang phát hiện proxy"
            subtitle="Bỏ qua trang kiểm tra IP và tốc độ mạng mặc định khi mở trình duyệt"
            checked={skipProxyDetectPage}
            onChange={setSkipProxyDetectPage}
          />

          <SettingSwitchItem
            label="Tiếp tục duyệt trang đã mở gần đây nhất"
            subtitle="Tự động khôi phục tất cả các tab đã mở từ phiên làm việc trước"
            checked={resumeLastSession}
            onChange={setResumeLastSession}
          />

          <SettingSwitchItem
            label="Chỉ mở trình duyệt bằng proxy khả dụng"
            subtitle="Nếu không tìm thấy proxy, các mục dấu vân tay dựa trên IP sẽ không khớp với các giá trị."
            checked={onlyAvailableProxy}
            onChange={setOnlyAvailableProxy}
          />

          <SettingSwitchItem
            label="Chỉ mở trình duyệt sau khi dữ liệu bộ nhớ đệm được tải thành công"
            subtitle="Đảm bảo đồng bộ hóa toàn bộ cache và cookie đám mây trước khi bắt đầu phiên duyệt web"
            checked={waitCacheLoaded}
            onChange={setWaitCacheLoaded}
          />

          <SettingSwitchItem
            label="Hồ sơ sẽ không được mở nếu Quốc gia/Khu vực không giống với lần cuối hồ sơ được mở"
            subtitle="Bảo vệ tài khoản tránh bị checkpoint hoặc khóa do thay đổi vị trí địa lý đột ngột"
            checked={geoMatchLast}
            onChange={setGeoMatchLast}
          />

          <SettingSwitchItem
            label="Truy cập an toàn"
            subtitle="Bất cứ khi nào có thể, hãy sử dụng HTTPS và nhận cảnh báo trước khi tải các trang web không phải HTTPS."
            checked={safeBrowsingHttps}
            onChange={setSafeBrowsingHttps}
          />

          <SettingSwitchItem
            label="Vô hiệu hóa tải video"
            subtitle="Chặn các video và luồng media tự động chạy để tiết kiệm băng thông"
            checked={disableVideoLoading}
            onChange={setDisableVideoLoading}
          />

          {/* Block images above size */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: blockImagesAboveSize ? '#F0F9FF' : 'transparent',
              border: blockImagesAboveSize ? '1px solid #BAE6FD' : '1px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <SettingSwitchItem
              label="Tắt tải hình ảnh để tiết kiệm lưu lượng"
              subtitle="Có thể đặt kích thước tối thiểu của hình ảnh sẽ được tải lên, chúng tôi khuyên bạn nên điền vào 10 KB; 0 KB có nghĩa là hình ảnh sẽ không được tải lên"
              checked={blockImagesAboveSize}
              onChange={setBlockImagesAboveSize}
            />

            {blockImagesAboveSize && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '48px', marginTop: '4px' }}>
                <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                  Ngưỡng kích thước tối đa:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={imageSizeLimitKb}
                    onChange={(e) => setImageSizeLimitKb(e.target.value)}
                    style={{
                      width: '80px',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                      fontWeight: 600,
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>KB</span>
                </div>
              </div>
            )}
          </div>

          {/* Clear cache on startup */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: clearCacheOnStartup ? '#F0F9FF' : 'transparent',
              border: clearCacheOnStartup ? '1px solid #BAE6FD' : '1px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <SettingSwitchItem
              label="Xoá dữ liệu bộ nhớ đệm"
              subtitle="Dữ liệu sẽ tự động bị xoá khi khởi động và không đồng bộ các loại dữ liệu đã chọn giữa các thiết bị."
              checked={clearCacheOnStartup}
              onChange={setClearCacheOnStartup}
            />

            {clearCacheOnStartup && (
              <div style={{ display: 'flex', gap: '20px', paddingLeft: '48px', marginTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#1E293B', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={clearCacheTypes.cache}
                    onChange={(e) => setClearCacheTypes({ ...clearCacheTypes, cache: e.target.checked })}
                  />
                  Dữ liệu bộ nhớ đệm
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#1E293B', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={clearCacheTypes.cookies}
                    onChange={(e) => setClearCacheTypes({ ...clearCacheTypes, cookies: e.target.checked })}
                  />
                  Cookie
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#1E293B', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={clearCacheTypes.history}
                    onChange={(e) => setClearCacheTypes({ ...clearCacheTypes, history: e.target.checked })}
                  />
                  Lịch sử duyệt web
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CARD 3: UPLOAD DẤU TRANG */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAFCFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bookmark size={18} style={{ color: '#3B82F6' }} />
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                {t('settings.cardBookmarks', 'Upload Dấu Trang (Bookmarks)')}
              </h3>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                {t('settings.cardBookmarksDesc', 'Tải lên danh sách dấu trang HTML / JSON để nạp sẵn cho mọi profile trình duyệt')}
              </span>
            </div>
          </div>

          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              border: '1px solid #BFDBFE',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Upload size={14} />
            Tải lên tệp (.html, .json)
            <input
              type="file"
              accept=".html,.htm,.json"
              onChange={handleFileUploadBookmarks}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Tiêu đề dấu trang (VD: Google)"
              value={newBookmarkTitle}
              onChange={(e) => setNewBookmarkTitle(e.target.value)}
              style={{
                flex: '0 0 200px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <input
              type="text"
              placeholder="URL dấu trang (VD: https://google.com)"
              value={newBookmarkUrl}
              onChange={(e) => setNewBookmarkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddBookmark();
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleAddBookmark}
              disabled={!newBookmarkUrl.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: newBookmarkUrl.trim() ? '#3B82F6' : '#E2E8F0',
                color: newBookmarkUrl.trim() ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: newBookmarkUrl.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              <Plus size={15} />
              Thêm
            </button>
          </div>

          <div
            style={{
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              backgroundColor: '#F8FAFC'
            }}
          >
            <div
              style={{
                padding: '8px 14px',
                borderBottom: '1px solid #E2E8F0',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#64748B',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>DANH SÁCH DẤU TRANG ({bookmarksList.length})</span>
              {bookmarksList.length > 0 && (
                <span
                  onClick={() => {
                    if (confirm('Bạn có chắc muốn xoá tất cả dấu trang?')) {
                      setBookmarksList([]);
                      localStorage.setItem('cfg_gen_bookmarks', JSON.stringify([]));
                    }
                  }}
                  style={{ cursor: 'pointer', color: '#EF4444', fontWeight: 600 }}
                >
                  Xoá tất cả
                </span>
              )}
            </div>

            {bookmarksList.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: '#94A3B8' }}>
                Chưa có dấu trang nào. Hãy tải lên tệp .html/.json hoặc thêm thủ công ở trên.
              </div>
            ) : (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {bookmarksList.map((bm) => (
                  <div
                    key={bm.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderBottom: '1px solid #F1F5F9',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                      <Bookmark size={14} style={{ color: '#3B82F6', flexShrink: 0 }} />
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                        {bm.title}
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#64748B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {bm.url}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteBookmark(bm.id)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Xoá dấu trang"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CARD 4: CHẾ ĐỘ NHIỀU THIẾT BỊ */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FAFCFF'
          }}
        >
          <Monitor size={18} style={{ color: '#3B82F6' }} />
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
              {t('settings.cardMultiDevice', 'Chế Độ Nhiều Thiết Bị')}
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              {t('settings.cardMultiDeviceDesc', 'Quản lý quyền mở đồng thời một hồ sơ trình duyệt giữa các tài khoản và máy trạm')}
            </span>
          </div>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SettingSwitchItem
            label="Chế độ nhiều thiết bị"
            subtitle="Sau khi bật, hỗ trợ nhiều thành viên mở cùng một hồ sơ đồng thời"
            checked={multiDeviceMode}
            onChange={setMultiDeviceMode}
          />

          {multiDeviceMode && (
            <div
              style={{
                paddingLeft: '48px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                paddingTop: '8px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="multiDeviceScope"
                    checked={multiDeviceScope === 'all'}
                    onChange={() => setMultiDeviceScope('all')}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    Mở nhiều toàn bộ
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    — Tất cả hồ sơ đều hỗ trợ nhiều thành viên mở đồng thời
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="multiDeviceScope"
                    checked={multiDeviceScope === 'custom'}
                    onChange={() => setMultiDeviceScope('custom')}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    Mở nhiều chỉ định
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    — Chỉ hồ sơ được chỉ định mới hỗ trợ nhiều thành viên mở đồng thời
                  </span>
                </label>
              </div>

              {multiDeviceScope === 'custom' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                    Danh sách tên hoặc ID hồ sơ được phép mở nhiều (cách nhau bởi dấu phẩy):
                  </label>
                  <input
                    type="text"
                    value={multiDeviceCustomProfiles}
                    onChange={(e) => setMultiDeviceCustomProfiles(e.target.value)}
                    placeholder="VD: Profile 1, Profile 2, 1024, 1055"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CARD 5: QUẢN LÝ TRANG WEB & MẠNG */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FAFCFF'
          }}
        >
          <Network size={18} style={{ color: '#3B82F6' }} />
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
              {t('settings.cardNetwork', 'Quản Lý Trang Web & Mạng')}
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              {t('settings.cardNetworkDesc', 'Lọc URL truy cập, định tuyến tài nguyên Facebook và cấu hình mạng nội bộ')}
            </span>
          </div>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <SettingSwitchItem
              label="Chặn truy cập"
              subtitle="Sử dụng danh sách chặn và danh sách cho phép để quản lý URL cơ bản."
              checked={urlFilterEnabled}
              onChange={setUrlFilterEnabled}
            />

            {urlFilterEnabled && (
              <div
                style={{
                  paddingLeft: '48px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'gap', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="urlFilterMode"
                      checked={urlFilterMode === 'blacklist'}
                      onChange={() => setUrlFilterMode('blacklist')}
                    />
                    Danh sách chặn (Blacklist)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', cursor: 'pointer', fontWeight: 600, marginLeft: '20px' }}>
                    <input
                      type="radio"
                      name="urlFilterMode"
                      checked={urlFilterMode === 'whitelist'}
                      onChange={() => setUrlFilterMode('whitelist')}
                    />
                    Danh sách cho phép (Whitelist)
                  </label>
                </div>

                <textarea
                  rows={3}
                  value={urlFilterList}
                  onChange={(e) => setUrlFilterList(e.target.value)}
                  placeholder="Nhập danh sách domain hoặc URL (mỗi dòng một địa chỉ, ví dụ: *.tiktok.com, facebook.com)..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}
          </div>

          <SettingSwitchItem
            label="Nguồn FB tĩnh"
            subtitle="Sau khi mở, sử dụng mạng local để tải tài nguyên tĩnh Facebook (giúp tăng tốc độ tải trang và tiết kiệm lưu lượng proxy)"
            checked={fbStaticLocal}
            onChange={setFbStaticLocal}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <SettingSwitchItem
              label="Truy cập mạng local"
              subtitle="Khi được bật, có thể cài đặt URL để truy cập mạng local"
              checked={localNetworkAccess}
              onChange={setLocalNetworkAccess}
            />

            {localNetworkAccess && (
              <div style={{ paddingLeft: '48px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Địa chỉ truy cập mạng local:
                </label>
                <input
                  type="text"
                  value={localNetworkUrls}
                  onChange={(e) => setLocalNetworkUrls(e.target.value)}
                  placeholder="http://localhost:*, 127.0.0.1:*"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CARD 6: ĐƯỜNG DẪN & MÃ HÓA LƯU TRỮ */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FAFCFF'
          }}
        >
          <FolderOpen size={18} style={{ color: '#3B82F6' }} />
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
              {t('settings.cardStorage', 'Đường Dẫn & Mã Hóa Lưu Trữ')}
            </h3>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              {t('settings.cardStorageDesc', 'Vị trí tệp tin profile cục bộ và đường dẫn thực thi Chromium Core')}
            </span>
          </div>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Thư mục lưu trữ User Data Profiles
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={profileDataPath}
                onChange={(e) => setProfileDataPath(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '12px', fontFamily: 'monospace' }}
              />
              <button
                onClick={() => alert(`📂 Thư mục profiles: ${profileDataPath}`)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', cursor: 'pointer' }}
              >
                <FolderOpen size={15} />
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Đường dẫn Chromium Core Executable
            </label>
            <input
              type="text"
              value={chromiumPath}
              onChange={(e) => setChromiumPath(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '12px', fontFamily: 'monospace', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', display: 'block' }}>Tự Động Lưu Cookie & Phiên Đăng Nhập</span>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>Lưu trữ token và cookie sau khi đóng cửa sổ trình duyệt</span>
            </div>
            <input
              type="checkbox"
              checked={autoSyncCookie}
              onChange={(e) => setAutoSyncCookie(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', display: 'block' }}>Mã Hóa Hồ Sơ Cục Bộ (AES-256)</span>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>Mã hóa mật khẩu và proxy lưu trữ trên ổ đĩa</span>
            </div>
            <input
              type="checkbox"
              checked={encryptLocalProfiles}
              onChange={(e) => setEncryptLocalProfiles(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
