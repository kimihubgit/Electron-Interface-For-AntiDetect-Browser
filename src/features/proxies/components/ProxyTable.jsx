import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Eye, Shield, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import ProxyTableRow from './ProxyTableRow';

const EMPTY_PROFILES_ARRAY = [];

export default function ProxyTable({
  filteredProxies = [],
  selectedProxyIds = [],
  onSelectAll,
  onSelectOne,
  onSelectBatch,
  onClearSelection,
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
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Reset to page 1 if filtered list shrinks below current page
  const totalItems = filteredProxies.length;
  const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Fast O(1) Lookups for Selection & Testing State
  const selectedProxySet = useMemo(() => new Set(selectedProxyIds), [selectedProxyIds]);
  const testingProxySet = useMemo(() => new Set(testingProxyIds), [testingProxyIds]);

  // Fast O(1) Lookup Map for Assigned Profiles
  const assignedProfilesMap = useMemo(() => {
    const map = new Map();
    for (const prof of profiles) {
      if (prof.proxy?.host && prof.proxy?.port) {
        const key = `${prof.proxy.host}:${prof.proxy.port}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(prof);
      }
    }
    return map;
  }, [profiles]);

  // Current page items
  const displayProxies = useMemo(() => {
    if (pageSize === 'all') return filteredProxies;
    const start = (currentPage - 1) * pageSize;
    return filteredProxies.slice(start, start + pageSize);
  }, [filteredProxies, currentPage, pageSize]);

  // Global & Page selection states
  const hasAnySelected = selectedProxyIds.length > 0;
  const isAllSelectedGlobal = filteredProxies.length > 0 && selectedProxyIds.length === filteredProxies.length;
  const isIndeterminate = hasAnySelected && !isAllSelectedGlobal;

  const headerCheckboxRef = useRef(null);
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleHeaderCheckboxChange = () => {
    if (hasAnySelected) {
      // If ANY are selected, clicking header checkbox acts as "Bỏ chọn tất cả"
      if (onClearSelection) {
        onClearSelection();
      } else if (onSelectAll) {
        onSelectAll({ target: { checked: false } });
      }
    } else {
      // If NONE are selected, select all filtered proxies
      if (onSelectAll) {
        onSelectAll({ target: { checked: true } });
      } else if (onSelectBatch) {
        onSelectBatch(filteredProxies.map((p) => p.id), true);
      }
    }
  };

  const startItem = totalItems === 0 ? 0 : pageSize === 'all' ? 1 : (currentPage - 1) * pageSize + 1;
  const endItem = pageSize === 'all' ? totalItems : Math.min(currentPage * pageSize, totalItems);

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
                    ref={headerCheckboxRef}
                    type="checkbox"
                    checked={isAllSelectedGlobal}
                    onChange={handleHeaderCheckboxChange}
                    style={{ cursor: 'pointer' }}
                    title={hasAnySelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  />
                </th>
                <th style={{ padding: '12px 14px', width: '280px' }}>Proxy Info</th>
                <th style={{ padding: '12px 14px', width: '240px' }}>Outbound IP</th>
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
              {displayProxies.map((p) => {
                const isSelected = selectedProxySet.has(p.id);
                const isTesting = testingProxySet.has(p.id) || testingId === p.id;
                const assignedProfiles = assignedProfilesMap.get(`${p.host}:${p.port}`) || EMPTY_PROFILES_ARRAY;

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

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            fontSize: '12px',
            color: '#64748B',
            userSelect: 'none'
          }}
        >
          {/* Item count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>
              Hiển thị <strong>{startItem}</strong> - <strong>{endItem}</strong> trong tổng số <strong>{totalItems}</strong> proxy
            </span>
            {selectedProxyIds.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#7C3AED', fontWeight: 600 }}>
                  (Đã chọn {selectedProxyIds.length})
                </span>
                <button
                  type="button"
                  onClick={onClearSelection}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '0 2px'
                  }}
                  title="Bỏ chọn toàn bộ proxy"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            )}
          </div>

          {/* Page controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {pageSize !== 'all' && (
              <>
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(1)}
                  title="Trang đầu"
                  style={{
                    padding: '4px 6px',
                    borderRadius: '4px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: currentPage <= 1 ? '#F8FAFC' : '#FFFFFF',
                    color: currentPage <= 1 ? '#CBD5E1' : '#475569',
                    cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <ChevronsLeft size={14} />
                </button>
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  title="Trang trước"
                  style={{
                    padding: '4px 6px',
                    borderRadius: '4px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: currentPage <= 1 ? '#F8FAFC' : '#FFFFFF',
                    color: currentPage <= 1 ? '#CBD5E1' : '#475569',
                    cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <ChevronLeft size={14} />
                </button>

                <span style={{ padding: '0 8px', fontWeight: 600, color: '#334155' }}>
                  Trang {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  title="Trang sau"
                  style={{
                    padding: '4px 6px',
                    borderRadius: '4px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: currentPage >= totalPages ? '#F8FAFC' : '#FFFFFF',
                    color: currentPage >= totalPages ? '#CBD5E1' : '#475569',
                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <ChevronRight size={14} />
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  title="Trang cuối"
                  style={{
                    padding: '4px 6px',
                    borderRadius: '4px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: currentPage >= totalPages ? '#F8FAFC' : '#FFFFFF',
                    color: currentPage >= totalPages ? '#CBD5E1' : '#475569',
                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <ChevronsRight size={14} />
                </button>
              </>
            )}

            {/* Page Size Selector */}
            <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Số hàng:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                  setPageSize(val);
                  setCurrentPage(1);
                }}
                style={{
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  fontSize: '12px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value={25}>25 / trang</option>
                <option value={50}>50 / trang</option>
                <option value={100}>100 / trang</option>
                <option value={200}>200 / trang</option>
                <option value="all">Tất cả</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
