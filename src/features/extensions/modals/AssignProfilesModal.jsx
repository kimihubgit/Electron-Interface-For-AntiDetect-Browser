import React from 'react';
import { X, Search } from 'lucide-react';

export default function AssignProfilesModal({
  targetExt,
  assignAllMode,
  setAssignAllMode,
  selectedProfileIds,
  setSelectedProfileIds,
  filteredProfiles,
  profilesCount,
  searchQuery,
  setSearchQuery,
  onClose,
  onSave
}) {
  if (!targetExt) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '85vh',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC'
          }}
        >
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Áp Dụng Tiện Ích Cho Profile
            </h3>
            <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
              {targetExt.name}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          {/* Mode 1: All Profiles */}
          <div
            onClick={() => setAssignAllMode(true)}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: `1.5px solid ${assignAllMode ? '#7C3AED' : '#E2E8F0'}`,
              backgroundColor: assignAllMode ? '#F5F3FF' : '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <input
              type="radio"
              checked={assignAllMode}
              onChange={() => setAssignAllMode(true)}
              style={{ accentColor: '#7C3AED' }}
            />
            <div>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: assignAllMode ? '#7C3AED' : '#0F172A' }}>
                Áp dụng cho toàn bộ profiles (Mặc định)
              </span>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                Tự động kích hoạt tiện ích này cho tất cả {profilesCount} profiles hiện có và profiles mới tạo.
              </p>
            </div>
          </div>

          {/* Mode 2: Specific Profiles */}
          <div
            onClick={() => setAssignAllMode(false)}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: `1.5px solid ${!assignAllMode ? '#7C3AED' : '#E2E8F0'}`,
              backgroundColor: !assignAllMode ? '#F5F3FF' : '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <input
              type="radio"
              checked={!assignAllMode}
              onChange={() => setAssignAllMode(false)}
              style={{ accentColor: '#7C3AED' }}
            />
            <div>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: !assignAllMode ? '#7C3AED' : '#0F172A' }}>
                Chỉ định profiles cụ thể
              </span>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                Chỉ kích hoạt tiện ích này trên các profile được bạn chọn trong danh sách dưới đây.
              </p>
            </div>
          </div>

          {/* Specific Profiles List */}
          {!assignAllMode && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              {/* Search profile */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <Search size={13} color="#64748B" />
                <input
                  type="text"
                  placeholder="Tìm kiếm profile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: '11.5px', width: '100%' }}
                />
              </div>

              {/* Profile items container */}
              <div
                style={{
                  maxHeight: '180px',
                  overflowY: 'auto',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  padding: '4px'
                }}
              >
                {filteredProfiles.length === 0 ? (
                  <div style={{ padding: '12px', textAlign: 'center', fontSize: '11.5px', color: '#94A3B8' }}>
                    Không tìm thấy profile phù hợp
                  </div>
                ) : (
                  filteredProfiles.map((p) => {
                    const isChecked = selectedProfileIds.includes(String(p.id));
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProfileIds((prev) =>
                            isChecked ? prev.filter((id) => id !== String(p.id)) : [...prev, String(p.id)]
                          );
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 8px',
                          borderRadius: '4px',
                          backgroundColor: isChecked ? '#EDE9FE' : 'transparent',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <span style={{ fontWeight: isChecked ? 600 : 400, color: isChecked ? '#7C3AED' : '#334155' }}>
                          {p.name}
                        </span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          style={{ accentColor: '#7C3AED' }}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 18px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onSave}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Lưu áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
