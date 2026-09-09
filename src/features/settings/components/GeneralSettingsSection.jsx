import React from 'react';
import { Folder, FolderOpen } from 'lucide-react';

export default function GeneralSettingsSection({
  profileDataPath,
  setProfileDataPath,
  workflowDataPath,
  setWorkflowDataPath,
  onBrowseFolder
}) {
  return (
    <div id="setting-section-general" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. THƯ MỤC PROFILE DATA */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
          Thư mục Profile Data
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          padding: '7px 12px',
          gap: '10px'
        }}>
          <Folder size={17} style={{ color: '#6B7280', flexShrink: 0 }} />
          <input
            type="text"
            value={profileDataPath}
            onChange={(e) => setProfileDataPath(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '12.5px',
              color: '#1F2937',
              fontFamily: 'Consolas, monospace',
              backgroundColor: 'transparent'
            }}
          />
          <button
            type="button"
            onClick={() => onBrowseFolder('profile')}
            title="Chọn thư mục"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '4px',
              color: '#4B5563',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FolderOpen size={17} />
          </button>
        </div>
        <span style={{ display: 'block', fontSize: '11.5px', color: '#6B7280', marginTop: '5px' }}>
          Thư mục gốc lưu User Data Folder khi mở profile.
        </span>
      </div>

      {/* 2. THƯ MỤC QUY TRÌNH */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
          Thư mục quy trình
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          padding: '7px 12px',
          gap: '10px'
        }}>
          <Folder size={17} style={{ color: '#6B7280', flexShrink: 0 }} />
          <input
            type="text"
            value={workflowDataPath}
            onChange={(e) => setWorkflowDataPath(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '12.5px',
              color: '#1F2937',
              fontFamily: 'Consolas, monospace',
              backgroundColor: 'transparent'
            }}
          />
          <button
            type="button"
            onClick={() => onBrowseFolder('workflow')}
            title="Chọn thư mục"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '4px',
              color: '#4B5563',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FolderOpen size={17} />
          </button>
        </div>
        <span style={{ display: 'block', fontSize: '11.5px', color: '#6B7280', marginTop: '5px' }}>
          Thư mục lưu dữ liệu quy trình/kịch bản tự động (automation scripts)
        </span>
      </div>
    </div>
  );
}
