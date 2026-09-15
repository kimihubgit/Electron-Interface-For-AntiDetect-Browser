import React from 'react';
import { Activity, Ban } from 'lucide-react';
import SearchInput from '../../../components/common/SearchInput';

export default function ProxyStreamTable({
  filteredRequests,
  searchTerm,
  setSearchTerm,
  selectedRouteFilter,
  setSelectedRouteFilter,
  selectedTypeFilter,
  setSelectedTypeFilter,
  selectedProfileFilter,
  setSelectedProfileFilter,
  profiles,
  onAssignRoute
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Filter controls row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        {/* Search Bar with collocated state & debounce */}
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Lọc theo URL, Host, Profile..."
          delay={200}
          style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            height: '34px',
            width: '320px'
          }}
        />

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Route filter */}
          <select
            value={selectedRouteFilter}
            onChange={(e) => setSelectedRouteFilter(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '12px', color: '#374151', backgroundColor: '#FFFFFF' }}
          >
            <option value="All">Mọi Tuyến Đường</option>
            <option value="DIRECT">Chỉ DIRECT (Đi thẳng)</option>
            <option value="PROXY">Chỉ PROXY</option>
            <option value="BLOCKED">Đã Bị CHẶN</option>
          </select>

          {/* Resource type filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '12px', color: '#374151', backgroundColor: '#FFFFFF' }}
          >
            <option value="All">Mọi Loại Dữ Liệu</option>
            <option value="Media">Media / Video</option>
            <option value="API">API / Fetch</option>
            <option value="Telemetry">Telemetry / Tracking</option>
            <option value="Ad Tracker">Ad Tracker</option>
          </select>

          {/* Profile Filter */}
          <select
            value={selectedProfileFilter}
            onChange={(e) => setSelectedProfileFilter(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '12px', color: '#374151', backgroundColor: '#FFFFFF' }}
          >
            <option value="All">Tất Cả Hồ Sơ</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Requests Stream Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '11.5px', fontWeight: 600 }}>
              <th style={{ padding: '10px 14px' }}>Thời Gian</th>
              <th style={{ padding: '10px 14px' }}>Hồ Sơ</th>
              <th style={{ padding: '10px 14px' }}>Method</th>
              <th style={{ padding: '10px 14px' }}>URL / API Endpoint</th>
              <th style={{ padding: '10px 14px' }}>Loại & Dung Lượng</th>
              <th style={{ padding: '10px 14px' }}>Tuyến Đường</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Thao Tác Định Tuyến 1-Click</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#9CA3AF' }}>
                  <Activity size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#4B5563' }}>Chưa có request mạng nào được bắt</div>
                  <div style={{ fontSize: '12px', marginTop: '3px' }}>Bật "Đang Bắt Gói (Capture ON)" và chạy một hồ sơ trình duyệt để xem luồng mạng.</div>
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => {
                const isDirect = req.route === 'DIRECT';
                const isProxy = req.route === 'PROXY';
                const isBlocked = req.route === 'BLOCKED';

                return (
                  <tr key={req.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.1s ease' }}>
                    {/* Timestamp */}
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#6B7280', fontSize: '11px', whiteSpace: 'nowrap' }}>
                      {req.time}
                    </td>

                    {/* Profile */}
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color: '#374151',
                          backgroundColor: '#F3F4F6',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {req.profile}
                      </span>
                    </td>

                    {/* Method */}
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          fontSize: '11px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: req.method === 'POST' ? '#EFF6FF' : '#ECFDF5',
                          color: req.method === 'POST' ? '#2563EB' : '#059669',
                          border: `1px solid ${req.method === 'POST' ? '#BFDBFE' : '#A7F3D0'}`
                        }}
                      >
                        {req.method}
                      </span>
                    </td>

                    {/* URL / Domain */}
                    <td style={{ padding: '10px 14px', maxWidth: '380px' }}>
                      <div
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          color: isBlocked ? '#9CA3AF' : '#111827',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          textDecoration: isBlocked ? 'line-through' : 'none'
                        }}
                      >
                        {req.url}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                        Domain: <span style={{ color: '#4B5563' }}>{req.domain}</span> · {req.latency}ms
                      </div>
                    </td>

                    {/* Type & Size */}
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '12px',
                            color: req.sizeFormatted.includes('MB') ? '#EA580C' : '#374151'
                          }}
                        >
                          {req.sizeFormatted}
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#9CA3AF' }}>({req.type})</span>
                      </div>
                    </td>

                    {/* Current Route */}
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: isDirect ? '#ECFDF5' : isProxy ? '#EFF6FF' : '#FEF2F2',
                          color: isDirect ? '#059669' : isProxy ? '#2563EB' : '#DC2626',
                          border: `1px solid ${isDirect ? '#A7F3D0' : isProxy ? '#BFDBFE' : '#FECACA'}`
                        }}
                      >
                        {req.route}
                      </span>
                    </td>

                    {/* 1-Click Action Buttons */}
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {!isDirect && (
                          <button
                            onClick={() => onAssignRoute(req.domain, 'DIRECT')}
                            style={{
                              border: '1px solid #10B981',
                              backgroundColor: '#ECFDF5',
                              color: '#059669',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                            title="Chuyển domain này đi thẳng mạng gốc để tiết kiệm dung lượng Proxy"
                          >
                            ⚡ Đi DIRECT
                          </button>
                        )}

                        {!isProxy && (
                          <button
                            onClick={() => onAssignRoute(req.domain, 'PROXY')}
                            style={{
                              border: '1px solid #3B82F6',
                              backgroundColor: '#EFF6FF',
                              color: '#2563EB',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                            title="Bắt buộc đi qua IP Proxy"
                          >
                            🛡 Đi PROXY
                          </button>
                        )}

                        {!isBlocked && (
                          <button
                            onClick={() => onAssignRoute(req.domain, 'BLOCKED')}
                            style={{
                              border: '1px solid #EF4444',
                              backgroundColor: '#FEF2F2',
                              color: '#DC2626',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                            title="Chặn hoàn toàn API này"
                          >
                            <Ban size={11} /> Chặn API
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
