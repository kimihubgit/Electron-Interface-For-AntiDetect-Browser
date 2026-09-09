import React from 'react';
import { 
  FileArchive, 
  RotateCcw, 
  Download, 
  Trash2, 
  Lock, 
  CheckCircle2, 
  HardDrive,
  Calendar,
  Layers,
  Database
} from 'lucide-react';

export default function BackupHistoryTable({ history = [], onRestore, onDelete }) {
  if (history.length === 0) {
    return (
      <div style={{
        padding: '60px 20px',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        color: '#64748B'
      }}>
        <FileArchive size={36} style={{ color: '#CBD5E1', marginBottom: '12px' }} />
        <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#1E293B', fontWeight: 600 }}>
          Chưa có bản sao lưu nào
        </h4>
        <p style={{ margin: 0, fontSize: '12.5px' }}>
          Hãy chọn một nền tảng lưu trữ và tạo bản sao lưu đầu tiên của bạn.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #F1F5F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
            Lịch sử lưu trữ & Phục hồi ({history.length} bản)
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
            Quản lý các bản sao lưu trên Cloudflare R2, Telegram, Google Drive, Wasabi, S3...
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 600 }}>
              <th style={{ padding: '12px 18px' }}>Tên bản sao lưu</th>
              <th style={{ padding: '12px 14px' }}>Nền tảng Cloud</th>
              <th style={{ padding: '12px 14px' }}>Hồ sơ & Proxy</th>
              <th style={{ padding: '12px 14px' }}>Dung lượng</th>
              <th style={{ padding: '12px 14px' }}>Thời gian tạo</th>
              <th style={{ padding: '12px 14px' }}>Bảo mật</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr 
                key={item.id}
                style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.12s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {/* File Name */}
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#EDE9FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--apidog-purple)',
                      flexShrink: 0
                    }}>
                      <FileArchive size={16} />
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: '#0F172A', fontFamily: 'monospace' }}>
                        {item.fileName}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Provider */}
                <td style={{ padding: '12px 14px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#F1F5F9',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#334155'
                  }}>
                    {item.providerName}
                  </span>
                </td>

                {/* Profiles count */}
                <td style={{ padding: '12px 14px', color: '#475569' }}>
                  <span>{item.profileCount} profiles • {item.proxyCount || 0} proxies</span>
                </td>

                {/* Size */}
                <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>
                  {item.size}
                </td>

                {/* Date */}
                <td style={{ padding: '12px 14px', color: '#64748B', whiteSpace: 'nowrap' }}>
                  {item.createdAt}
                </td>

                {/* Encryption badge */}
                <td style={{ padding: '12px 14px' }}>
                  {item.encrypted ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#7C3AED', fontSize: '11.5px', fontWeight: 600 }}>
                      <Lock size={12} />
                      <span>AES-256</span>
                    </div>
                  ) : (
                    <span style={{ color: '#94A3B8', fontSize: '11.5px' }}>Tiêu chuẩn</span>
                  )}
                </td>

                {/* Actions */}
                <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <button
                      onClick={() => onRestore(item)}
                      title="Phục hồi hồ sơ từ bản sao lưu này"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--apidog-purple)',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#EDE9FE';
                        e.currentTarget.style.borderColor = 'var(--apidog-purple)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#CBD5E1';
                      }}
                    >
                      <RotateCcw size={12} />
                      <span>Phục hồi</span>
                    </button>

                    <button
                      onClick={() => alert(`Bắt đầu tải file "${item.fileName}" về máy tính.`)}
                      title="Tải file về máy tính"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                        color: '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <Download size={13} />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Xóa bản sao lưu "${item.fileName}"?`)) {
                          onDelete(item.id);
                        }
                      }}
                      title="Xóa bản sao lưu"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        border: '1px solid #FEE2E2',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
