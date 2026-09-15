import React from 'react';
import { Sliders, X, Trash2 } from 'lucide-react';

export default function AutomationInspectorDrawer({
  editingNode,
  setEditingNode,
  setNodes,
  onDeleteNode
}) {
  if (!editingNode) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '320px',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderLeft: '1px solid #E5E7EB',
        boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 30
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={16} color="#2563EB" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
            Cấu hình: {editingNode.title}
          </span>
        </div>
        <button
          onClick={() => setEditingNode(null)}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#9CA3AF' }}
        >
          <X size={16} />
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {/* Node title */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
            Tên khối
          </label>
          <input
            type="text"
            value={editingNode.title}
            onChange={(e) => {
              const val = e.target.value;
              setNodes((prev) => (prev.map((n) => (n.id === editingNode.id ? { ...n, title: val } : n))));
              setEditingNode((prev) => ({ ...prev, title: val }));
            }}
            style={{
              width: '100%',
              height: '32px',
              padding: '0 10px',
              fontSize: '12px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Dynamic type fields */}
        {editingNode.type === 'browser_open' && (
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
              Đường dẫn URL
            </label>
            <input
              type="text"
              value={editingNode.data?.url || ''}
              onChange={(e) => {
                const val = e.target.value;
                setNodes((prev) =>
                  prev.map((n) => (n.id === editingNode.id ? { ...n, data: { ...n.data, url: val } } : n))
                );
                setEditingNode((prev) => ({ ...prev, data: { ...prev.data, url: val } }));
              }}
              style={{
                width: '100%',
                height: '32px',
                padding: '0 10px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {editingNode.type === 'mouse_click' && (
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
              CSS Selector nút click
            </label>
            <input
              type="text"
              value={editingNode.data?.selector || ''}
              onChange={(e) => {
                const val = e.target.value;
                setNodes((prev) =>
                  prev.map((n) => (n.id === editingNode.id ? { ...n, data: { ...n.data, selector: val } } : n))
                );
                setEditingNode((prev) => ({ ...prev, data: { ...prev.data, selector: val } }));
              }}
              style={{
                width: '100%',
                height: '32px',
                padding: '0 10px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {editingNode.type === 'human_type' && (
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
              Văn bản cần gõ
            </label>
            <input
              type="text"
              value={editingNode.data?.text || ''}
              onChange={(e) => {
                const val = e.target.value;
                setNodes((prev) =>
                  prev.map((n) => (n.id === editingNode.id ? { ...n, data: { ...n.data, text: val } } : n))
                );
                setEditingNode((prev) => ({ ...prev, data: { ...prev.data, text: val } }));
              }}
              style={{
                width: '100%',
                height: '32px',
                padding: '0 10px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {editingNode.type === 'ai_navigator' && (
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
              Mục tiêu AI Vision
            </label>
            <textarea
              rows={3}
              value={editingNode.data?.goal || ''}
              onChange={(e) => {
                const val = e.target.value;
                setNodes((prev) =>
                  prev.map((n) => (n.id === editingNode.id ? { ...n, data: { ...n.data, goal: val } } : n))
                );
                setEditingNode((prev) => ({ ...prev, data: { ...prev.data, goal: val } }));
              }}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', paddingTop: '16px' }}>
          <button
            onClick={() => onDeleteNode(editingNode.id)}
            style={{
              flex: 1,
              height: '34px',
              borderRadius: '6px',
              border: '1px solid #FCA5A5',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={14} />
            <span>Xóa</span>
          </button>

          <button
            onClick={() => setEditingNode(null)}
            style={{
              flex: 1,
              height: '34px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Lưu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
