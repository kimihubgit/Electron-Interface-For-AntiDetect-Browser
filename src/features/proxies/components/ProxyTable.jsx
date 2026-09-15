import React from 'react';
import { Eye, Shield, Plus } from 'lucide-react';
import ProxyTableRow from './ProxyTableRow';

export default function ProxyTable({
  filteredProxies = [],
  selectedProxyIds = [],
  onSelectAll,
  onSelectOne,
  isAllSelected,
  testingProxyIds = [],
  testingId,
  copiedId,
  onCopy,
  showNoteText,
  setShowNoteText,
  ipQueryChannel,
  profiles = [],
  onOpenEdit,
  onOpenAssign,
  onCheckSingle,
  onDeleteSingle,
  onOpenNote,
  onOpenAddModal
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredProxies.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94A3B8'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                color: '#64748B'
              }}
            >
              <Shield size={24} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
              Không tìm thấy Proxy phù hợp
            </div>
            <div style={{ fontSize: '12px', marginTop: '4px', maxWidth: '320px', marginBottom: '16px' }}>
              Thử thay đổi bộ lọc tìm kiếm hoặc thêm proxy mới vào kho lưu trữ
            </div>
            <button
              onClick={onOpenAddModal}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                backgroundColor: 'var(--apidog-purple)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              + Thêm Proxy Đầu Tiên
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 600,
                  position: 'sticky',
                  top: 0,
                  zIndex: 10
                }}
              >
                <th style={{ width: '38px', padding: '12px 14px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '12px 14px', width: '280px' }}>Proxy Info</th>
                <th style={{ padding: '12px 14px', width: '200px' }}>Outbound IP</th>
                <th style={{ padding: '12px 14px', width: '90px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>Notes</span>
                    <button
                      type="button"
                      onClick={() => setShowNoteText(!showNoteText)}
                      title={showNoteText ? 'Chuyển thành dạng biểu tượng' : 'Hiển thị chữ ghi chú'}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        color: showNoteText ? '#7C3AED' : '#94A3B8',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                </th>
                <th style={{ padding: '12px 14px', width: '160px' }}>IP Query Channel</th>
                <th style={{ padding: '12px 14px', width: '150px' }}>Related Profiles</th>
                <th style={{ width: '140px', padding: '12px 14px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProxies.map((p) => {
                const isSelected = selectedProxyIds.includes(p.id);
                const isTesting = testingProxyIds.includes(p.id) || testingId === p.id;
                const assignedProfiles = profiles.filter(
                  (prof) => prof.proxy?.host === p.host && Number(prof.proxy?.port) === Number(p.port)
                );

                return (
                  <ProxyTableRow
                    key={p.id}
                    proxy={p}
                    isSelected={isSelected}
                    onToggleSelect={onSelectOne}
                    isTesting={isTesting}
                    copiedId={copiedId}
                    onCopy={onCopy}
                    showNoteText={showNoteText}
                    ipQueryChannel={ipQueryChannel}
                    assignedProfiles={assignedProfiles}
                    onOpenEdit={onOpenEdit}
                    onOpenAssign={onOpenAssign}
                    onCheckSingle={onCheckSingle}
                    onDeleteSingle={onDeleteSingle}
                    onOpenNote={onOpenNote}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
