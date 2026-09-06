import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Trash2, 
  Edit3, 
  Globe, 
  Shield, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Activity,
  CheckCircle2,
  RefreshCw,
  Folder
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';
import QuickActionCards from '../components/QuickActionCards';

export default function ProfilesPage() {
  const { profiles, toggleLaunchProfile, deleteProfile, setActiveProfileModal, selectedGroup } = useBrowser();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'home' | 'table'

  const filteredProfiles = profiles.filter(p => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.proxy?.host && p.proxy.host.includes(q));
    const matchGroup = selectedGroup === 'All' || p.group === selectedGroup;
    return matchSearch && matchGroup;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProfiles(filteredProfiles.map(p => p.id));
    } else {
      setSelectedProfiles([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedProfiles(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
      {/* Top Banner with Apidog-style Quick Cards */}
      <QuickActionCards />

      {/* Main Section Header */}
      <div style={{
        padding: '12px 24px',
        borderTop: '1px solid var(--apidog-border)',
        borderBottom: '1px solid var(--apidog-border)',
        backgroundColor: '#FAFAFA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <strong style={{ fontSize: '13px', color: 'var(--apidog-text-main)' }}>
            Danh sách Hồ Sơ ({selectedGroup}): {filteredProfiles.length}
          </strong>

          {/* Quick Search */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--apidog-border)',
            padding: '0 10px',
            height: '28px',
            width: '220px'
          }}>
            <Search size={13} style={{ color: '#9CA3AF', marginRight: '6px' }} />
            <input
              type="text"
              placeholder="Lọc hồ sơ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '12px', width: '100%' }}
            />
          </div>
        </div>

        {/* Right action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveProfileModal('new')}
            className="btn btn-primary"
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            <Plus size={14} /> Thêm Hồ Sơ
          </button>
        </div>
      </div>

      {/* Clean Apidog-style Table */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '0 24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--apidog-border)', color: 'var(--apidog-text-muted)', fontWeight: 600 }}>
              <th style={{ padding: '12px 10px', width: '36px' }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={filteredProfiles.length > 0 && selectedProfiles.length === filteredProfiles.length}
                />
              </th>
              <th style={{ padding: '12px 10px' }}>Tên Hồ Sơ</th>
              <th style={{ padding: '12px 10px' }}>Trạng Thái</th>
              <th style={{ padding: '12px 10px' }}>Proxy IP & Port</th>
              <th style={{ padding: '12px 10px' }}>Nhóm</th>
              <th style={{ padding: '12px 10px' }}>Hệ Điều Hành & Core</th>
              <th style={{ padding: '12px 10px', textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.map(p => {
              const isRunning = p.status === 'running';
              const isChecked = selectedProfiles.includes(p.id);

              return (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid var(--apidog-border-light)',
                    backgroundColor: isRunning ? '#F0FDF4' : isChecked ? '#F5F3FF' : '#FFFFFF',
                    transition: 'background 0.15s'
                  }}
                >
                  <td style={{ padding: '12px 10px' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSelect(p.id)}
                    />
                  </td>

                  {/* Name */}
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Globe size={15} style={{ color: 'var(--apidog-purple)' }} />
                      <strong style={{ color: 'var(--apidog-text-main)', fontSize: '13px' }}>
                        {p.name}
                      </strong>
                    </div>
                  </td>

                  {/* Launch button */}
                  <td style={{ padding: '12px 10px' }}>
                    <button
                      onClick={() => toggleLaunchProfile(p.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-xs)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: isRunning ? '#FEE2E2' : '#DCFCE7',
                        color: isRunning ? '#DC2626' : '#15803D',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isRunning ? <Square size={11} /> : <Play size={11} />}
                      {isRunning ? 'DỪNG (STOP)' : 'CHẠY (START)'}
                    </button>
                  </td>

                  {/* Proxy */}
                  <td style={{ padding: '12px 10px' }}>
                    {p.proxy?.host ? (
                      <span className="badge badge-purple" style={{ fontFamily: 'var(--font-mono)' }}>
                        {p.proxy.type}://{p.proxy.host}:{p.proxy.port}
                      </span>
                    ) : (
                      <span style={{ color: '#9CA3AF' }}>Direct (No Proxy)</span>
                    )}
                  </td>

                  {/* Group */}
                  <td style={{ padding: '12px 10px' }}>
                    <span className="badge badge-gray">{p.group}</span>
                  </td>

                  {/* Specs */}
                  <td style={{ padding: '12px 10px', color: 'var(--apidog-text-muted)' }}>
                    {p.os} • {p.cores} Cores • {p.ram}GB
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '4px' }}>
                      <button onClick={() => setActiveProfileModal(p)} className="btn-icon-subtle" title="Chỉnh sửa">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => deleteProfile(p.id)} className="btn-icon-subtle" style={{ color: '#EF4444' }} title="Xóa">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
