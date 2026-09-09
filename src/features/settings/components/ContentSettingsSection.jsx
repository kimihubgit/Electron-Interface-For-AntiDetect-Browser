import React from 'react';
import ToggleSwitch from './ToggleSwitch';

export default function ContentSettingsSection({
  blockImages,
  setBlockImages,
  hideImages,
  setHideImages,
  blockMedia,
  setBlockMedia,
  muteAudio,
  setMuteAudio
}) {
  return (
    <div id="setting-section-content">
      <div style={{
        fontSize: '12px',
        fontWeight: 700,
        color: '#4B5563',
        letterSpacing: '0.5px',
        marginBottom: '8px'
      }}>
        NỘI DUNG TRANG TẢI
      </div>

      <div style={{
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden'
      }}>
        {/* Item: Chặn load ảnh */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Chặn load ảnh
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
              Không load ảnh trong mọi profile
            </div>
          </div>
          <ToggleSwitch checked={blockImages} onChange={setBlockImages} />
        </div>

        {/* Item: Ẩn ảnh */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Ẩn ảnh
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
              Ẩn ảnh trong mọi profile (ảnh vẫn được load)
            </div>
          </div>
          <ToggleSwitch checked={hideImages} onChange={setHideImages} />
        </div>

        {/* Item: Chặn load media */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Chặn load media
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
              Không load video và âm thanh trong mọi profile
            </div>
          </div>
          <ToggleSwitch checked={blockMedia} onChange={setBlockMedia} />
        </div>

        {/* Item: Tắt âm thanh */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Tắt âm thanh
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
              Tắt âm thanh trong mọi profile
            </div>
          </div>
          <ToggleSwitch checked={muteAudio} onChange={setMuteAudio} />
        </div>
      </div>
    </div>
  );
}
