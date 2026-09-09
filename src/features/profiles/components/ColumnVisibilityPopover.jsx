import React, { useState, useEffect, useRef } from 'react';
import { GripVertical, Check } from 'lucide-react';

export const ALL_COLUMNS = [
  { id: 'description', label: 'Description', defaultVisible: true, minWidth: '150px', flex: '1.2fr' },
  { id: 'proxy', label: 'Proxy', defaultVisible: true, minWidth: '170px', flex: '1.5fr' },
  { id: 'folder', label: 'Folder', defaultVisible: true, minWidth: '100px', flex: '0.9fr' },
  { id: 'tags', label: 'Tags', defaultVisible: true, minWidth: '110px', flex: '1fr' },
  { id: 'tasks', label: 'Tasks', defaultVisible: true, minWidth: '90px', flex: '0.8fr' },
  { id: 'workTime', label: 'Work time', defaultVisible: false, minWidth: '100px', flex: '0.9fr' },
  { id: 'size', label: 'Size', defaultVisible: false, minWidth: '85px', flex: '0.8fr' },
  { id: 'launches', label: 'Launches', defaultVisible: false, minWidth: '85px', flex: '0.8fr' },
  { id: 'created', label: 'Created', defaultVisible: false, minWidth: '110px', flex: '1fr' },
  { id: 'cookies', label: 'Cookies', defaultVisible: true, minWidth: '100px', flex: '0.9fr' },
  { id: 'id', label: 'ID', defaultVisible: false, minWidth: '95px', flex: '0.8fr' },
  { id: 'fingerprint', label: 'Fingerprint', defaultVisible: true, minWidth: '160px', flex: '1.4fr' }
];

export const STORAGE_KEY = 'antidetect_profile_columns_v1';

export function getInitialColumns() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with ALL_COLUMNS in case new columns were added in code updates
      const savedMap = new Map(parsed.map(c => [c.id, c.visible]));
      const ordered = parsed
        .map(c => {
          const base = ALL_COLUMNS.find(ac => ac.id === c.id);
          return base ? { ...base, visible: Boolean(c.visible) } : null;
        })
        .filter(Boolean);

      // Append any new columns not in saved
      ALL_COLUMNS.forEach(ac => {
        if (!ordered.some(c => c.id === ac.id)) {
          ordered.push({ ...ac, visible: ac.defaultVisible });
        }
      });
      return ordered;
    }
  } catch (err) {
    console.error('Failed to parse saved columns', err);
  }
  return ALL_COLUMNS.map(c => ({ ...c, visible: c.defaultVisible }));
}

/**
 * Column Visibility Popover matching the user's reference image:
 * - Header: "Columns", "Reset"
 * - Column items with `::` drag handle, blue checkbox, and label
 * - Drag-and-drop reordering
 * - Footer with "Cancel" and "Save" buttons
 */
export default function ColumnVisibilityPopover({
  isOpen,
  onClose,
  columns,
  onSaveColumns
}) {
  const [items, setItems] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const popoverRef = useRef(null);

  // Sync with prop when opened
  useEffect(() => {
    if (isOpen) {
      setItems(columns.map(c => ({ ...c })));
    }
  }, [isOpen, columns]);

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleColumn = (id) => {
    setItems(prev => prev.map(col => {
      if (col.id === id) {
        return { ...col, visible: !col.visible };
      }
      return col;
    }));
  };

  const handleReset = () => {
    setItems(ALL_COLUMNS.map(c => ({ ...c, visible: c.defaultVisible })));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map(i => ({ id: i.id, visible: i.visible }))));
    onSaveColumns(items);
    onClose();
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newItems = [...items];
    const draggedItem = newItems.splice(draggedIndex, 1)[0];
    newItems.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setItems(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 4px)',
        right: '12px',
        width: '210px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 10px 28px -4px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(15, 23, 42, 0.08)',
        zIndex: 1000,
        padding: '12px 14px 10px 14px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        userSelect: 'none',
        animation: 'fadeInPop 0.14s ease-out'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}
      >
        <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1E293B' }}>
          Columns
        </span>
        <button
          type="button"
          onClick={handleReset}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '12px',
            color: '#64748B',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: '4px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
        >
          Reset
        </button>
      </div>

      {/* ── COLUMN ITEMS LIST ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          maxHeight: '340px',
          overflowY: 'auto',
          margin: '0 -4px 12px -4px',
          padding: '0 4px'
        }}
      >
        {items.map((col, index) => {
          const isDragging = draggedIndex === index;
          return (
            <div
              key={col.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => handleToggleColumn(col.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 6px',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: isDragging ? '#F1F5F9' : 'transparent',
                opacity: isDragging ? 0.6 : 1,
                transition: 'background-color 0.1s ease'
              }}
              onMouseEnter={(e) => {
                if (!isDragging) e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseLeave={(e) => {
                if (!isDragging) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {/* Drag Handle :: */}
              <div
                style={{
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'grab'
                }}
                title="Kéo để đổi thứ tự cột"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <GripVertical size={13} />
              </div>

              {/* Checkbox */}
              <div
                style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '3.5px',
                  border: col.visible ? '1.5px solid #2563EB' : '1.5px solid #CBD5E1',
                  backgroundColor: col.visible ? '#2563EB' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.12s ease',
                  boxSizing: 'border-box'
                }}
              >
                {col.visible && (
                  <Check size={11} color="#FFFFFF" strokeWidth={3.5} />
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '13px',
                  color: col.visible ? '#0F172A' : '#64748B',
                  fontWeight: col.visible ? 500 : 400
                }}
              >
                {col.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── FOOTER ACTIONS ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '8px',
          paddingTop: '8px',
          borderTop: '1px solid #F1F5F9'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '4px 12px',
            fontSize: '12px',
            borderRadius: '5px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            color: '#475569',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.borderColor = '#CBD5E1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#E2E8F0';
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          style={{
            padding: '4px 16px',
            fontSize: '12px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 1px 2px rgba(37, 99, 235, 0.25)',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1D4ED8')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
        >
          Save
        </button>
      </div>
    </div>
  );
}
