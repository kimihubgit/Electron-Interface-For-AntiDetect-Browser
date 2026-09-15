import React from 'react';
import {
  Globe,
  Copy,
  ChevronDown,
  Play,
  Grid,
  Database,
  Settings,
  Code,
  MoreVertical,
  Search
} from 'lucide-react';
import { BLOCK_CATALOG } from '../data/blockCatalog';

export default function AutomationSidebar({
  workflowTitle,
  workflowVersion,
  activeCategoryTab,
  setActiveCategoryTab,
  blockSearchQuery,
  setBlockSearchQuery,
  openAccordions,
  setOpenAccordions,
  onPaletteDragStart,
  onAddBlockClick
}) {
  const categories = ['General', 'Browser & AI'];

  return (
    <div
      style={{
        width: '215px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 10
      }}
    >
      {/* Script Title & Version */}
      <div style={{ padding: '12px 14px 10px 14px', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={16} style={{ color: '#2563EB' }} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>
            {workflowTitle}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '6px',
            padding: '4px 8px',
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#4B5563',
            cursor: 'pointer'
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {workflowVersion}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Copy size={11} color="#9CA3AF" />
            <ChevronDown size={11} color="#9CA3AF" />
          </div>
        </div>
      </div>

      {/* Icon Category Tabs (Play, Grid, Database, Settings, Code, More) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          borderBottom: '1px solid #F1F5F9'
        }}
      >
        <button
          onClick={() => setActiveCategoryTab('general')}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: activeCategoryTab === 'general' ? '#2563EB' : 'transparent',
            color: activeCategoryTab === 'general' ? '#FFFFFF' : '#6B7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Play size={13} fill={activeCategoryTab === 'general' ? '#FFFFFF' : 'none'} />
        </button>

        <button
          onClick={() => setActiveCategoryTab('grid')}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: activeCategoryTab === 'grid' ? '#2563EB' : 'transparent',
            color: activeCategoryTab === 'grid' ? '#FFFFFF' : '#6B7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Grid size={14} />
        </button>

        <button
          onClick={() => setActiveCategoryTab('storage')}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: activeCategoryTab === 'storage' ? '#2563EB' : 'transparent',
            color: activeCategoryTab === 'storage' ? '#FFFFFF' : '#6B7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Database size={14} />
        </button>

        <button
          onClick={() => setActiveCategoryTab('settings')}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: activeCategoryTab === 'settings' ? '#2563EB' : 'transparent',
            color: activeCategoryTab === 'settings' ? '#FFFFFF' : '#6B7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Settings size={14} />
        </button>

        <button
          onClick={() => setActiveCategoryTab('code')}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: activeCategoryTab === 'code' ? '#2563EB' : 'transparent',
            color: activeCategoryTab === 'code' ? '#FFFFFF' : '#6B7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Code size={14} />
        </button>

        <button
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#9CA3AF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Quick Search */}
      <div style={{ padding: '8px 12px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={12} style={{ position: 'absolute', left: '8px', color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Tìm kiếm ..."
            value={blockSearchQuery}
            onChange={(e) => setBlockSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '28px',
              paddingLeft: '26px',
              paddingRight: '8px',
              fontSize: '11px',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              outline: 'none',
              color: '#1F2937'
            }}
          />
        </div>
      </div>

      {/* Block Category Accordions */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {categories.map((catName) => {
          const isOpen = openAccordions[catName] ?? true;
          const blocks = BLOCK_CATALOG.filter((b) => b.category === catName).filter((b) => {
            if (!blockSearchQuery.trim()) return true;
            return (
              b.title.toLowerCase().includes(blockSearchQuery.toLowerCase()) ||
              b.desc.toLowerCase().includes(blockSearchQuery.toLowerCase())
            );
          });

          if (blocks.length === 0) return null;

          return (
            <div key={catName} style={{ marginBottom: '2px' }}>
              <div
                onClick={() => setOpenAccordions((prev) => ({ ...prev, [catName]: !isOpen }))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  backgroundColor: '#F9FAFB',
                  borderTop: '1px solid #F1F5F9',
                  borderBottom: '1px solid #F1F5F9'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: catName === 'General' ? '#10B981' : '#3B82F6'
                    }}
                  />
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#374151' }}>
                    {catName}
                  </span>
                </div>
                <ChevronDown
                  size={13}
                  color="#6B7280"
                  style={{
                    transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.15s ease'
                  }}
                />
              </div>

              {isOpen && (
                <div
                  style={{
                    padding: '8px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '7px'
                  }}
                >
                  {blocks.map((block) => {
                    const IconComp = block.icon;
                    return (
                      <div
                        key={block.id}
                        draggable={true}
                        onDragStart={(e) => onPaletteDragStart(e, block)}
                        onClick={() => onAddBlockClick(block)}
                        title={`${block.title}: ${block.desc}`}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          padding: '10px 4px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'grab',
                          transition: 'all 0.15s ease',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#2563EB';
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.12)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#E5E7EB';
                          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{ color: block.color }}>
                          <IconComp size={18} />
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 500,
                            color: '#374151',
                            textAlign: 'center',
                            lineHeight: 1.2,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '82px'
                          }}
                        >
                          {block.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
