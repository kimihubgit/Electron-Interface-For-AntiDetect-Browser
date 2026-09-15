import React from 'react';
import { UserPlus, X, Check } from 'lucide-react';
import { AVAILABLE_GROUPS } from '../data/teamConstants';

export default function InviteMemberModal({
  isOpen,
  onClose,
  editingMember,
  formData,
  setFormData,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(3px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '460px',
          maxWidth: '92vw',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: '#EDE9FE',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UserPlus size={16} />
            </div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
              {editingMember ? 'Chỉnh sửa phân quyền thành viên' : 'Mời thành viên mới vào nhóm'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
              Họ và tên <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Hoàng Văn Nam"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: '100%',
                height: '34px',
                padding: '0 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
              Địa chỉ Email <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="email"
              placeholder="name@agency.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={Boolean(editingMember)}
              required
              style={{
                width: '100%',
                height: '34px',
                padding: '0 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                outline: 'none',
                backgroundColor: editingMember ? '#F8FAFC' : '#FFFFFF',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Role */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
              Vai trò (Role)
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={editingMember?.isSelf}
              style={{
                width: '100%',
                height: '34px',
                padding: '0 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                color: '#0F172A',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <option value="admin">Thành viên (Member) — Toàn quyền thao tác</option>
              <option value="manager">Quản lý nhóm (Manager) — Quản lý hồ sơ & Proxy được gán</option>
              <option value="operator">Nhân viên chạy (Operator) — Mở và sử dụng hồ sơ</option>
              <option value="viewer">Chỉ xem (Viewer) — Chỉ xem danh sách hồ sơ</option>
            </select>
          </div>

          {/* Assigned Groups Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Cho phép truy cập nhóm hồ sơ:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {AVAILABLE_GROUPS.map((grp) => {
                const isChecked = formData.assignedGroups.includes(grp);
                return (
                  <label
                    key={grp}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      border: isChecked ? '1px solid #7C3AED' : '1px solid #E2E8F0',
                      backgroundColor: isChecked ? '#EDE9FE' : '#F8FAFC',
                      color: isChecked ? '#6D28D9' : '#475569',
                      fontSize: '11.5px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (grp === 'Tất cả nhóm') {
                          setFormData({
                            ...formData,
                            assignedGroups: e.target.checked ? ['Tất cả nhóm'] : []
                          });
                        } else {
                          const withoutAll = formData.assignedGroups.filter(x => x !== 'Tất cả nhóm');
                          const updated = e.target.checked ? [...withoutAll, grp] : withoutAll.filter(x => x !== grp);
                          setFormData({ ...formData, assignedGroups: updated });
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                    {isChecked && <Check size={12} color="#7C3AED" />}
                    <span>{grp}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Specific Permissions */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
            <span style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>
              Cài đặt bảo mật nhạy cảm:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(formData.permissions?.canExportCookies)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permissions: { ...formData.permissions, canExportCookies: e.target.checked }
                    })
                  }
                />
                <span>Cho phép xuất (Export) Cookies tài khoản</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(formData.permissions?.canViewProxyPassword)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permissions: { ...formData.permissions, canViewProxyPassword: e.target.checked }
                    })
                  }
                />
                <span>Cho phép xem mật khẩu Proxy thô</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontSize: '12.5px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: '7px 18px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {editingMember ? 'Lưu thay đổi' : 'Gửi lời mời'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
