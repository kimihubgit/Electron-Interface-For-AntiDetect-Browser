import React from 'react';
import { 
  CheckCircle2, 
  Shield, 
  Cookie, 
  Trash2, 
  HelpCircle, 
  ChevronRight,
  Maximize2,
  Cpu
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

export default function BottomStatusBar() {
  const { profiles } = useBrowser();
  const runningCount = profiles.filter(p => p.status === 'running').length;

  return (
    <footer style={{
      height: '28px',
      backgroundColor: '#FAFAFA',
      borderTop: '1px solid var(--apidog-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      fontSize: '11px',
      color: 'var(--apidog-text-muted)',
      flexShrink: 0
    }}>
      {/* Left items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 600 }}>
          <CheckCircle2 size={12} /> Đã trực tuyến (Ready)
        </span>

        {runningCount > 0 && (
          <span style={{ color: 'var(--apidog-purple)', fontWeight: 600 }}>
            ● {runningCount} Profile đang khởi chạy
          </span>
        )}
      </div>

      {/* Right items matching Apidog screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <Shield size={12} /> Proxy request ▾
        </span>

        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <Cookie size={12} /> Cookies
        </span>

        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <Trash2 size={12} /> Thùng rác
        </span>

        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <HelpCircle size={12} /> Trợ giúp & hỗ trợ
        </span>
      </div>
    </footer>
  );
}
