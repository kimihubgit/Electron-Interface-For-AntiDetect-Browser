import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          backgroundColor: '#FFFFFF',
          padding: '32px',
          boxSizing: 'border-box',
          textAlign: 'center'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)'
          }}>
            <AlertTriangle size={28} />
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
            Đã xảy ra sự cố hiển thị giao diện
          </h2>

          <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '480px', margin: '0 0 20px 0', lineHeight: 1.5 }}>
            Ứng dụng đã bảo vệ an toàn dữ liệu của bạn. Bạn có thể nhấn làm mới trang để tải lại giao diện hoàn chỉnh.
          </p>

          {this.state.error && (
            <div style={{
              maxWidth: '600px',
              width: '100%',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#DC2626',
              textAlign: 'left',
              overflowX: 'auto',
              maxHeight: '120px'
            }}>
              {this.state.error.toString()}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={this.handleReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '8px',
                backgroundColor: 'var(--apidog-purple, #7C3AED)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} /> Làm Mới Giao Diện
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
