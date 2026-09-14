import React, { useMemo } from 'react';
import { ArrowUpCircle, AlertCircle, X, CheckCircle2, RefreshCw, WifiOff, RotateCcw } from 'lucide-react';
import { useAppUpdateDownload } from '../../hooks/useAppUpdateDownload';
import { updateModalStyles as s } from './AppUpdateModal.styles';

/**
 * AppUpdateModal - Lean UI Component
 * State machine and IPC logic are isolated in `useAppUpdateDownload`
 * Styling objects are isolated in `AppUpdateModal.styles.js`
 */
export default function AppUpdateModal({
  isOpen,
  updateInfo,
  onClose
}) {
  const { forceUpdate, latestVersion, downloadUrl, releaseNotes } = updateInfo || {};

  const {
    state,
    startDownload,
    installUpdate,
    manualDownload
  } = useAppUpdateDownload(downloadUrl, isOpen);

  const { status, progress, error } = state;

  const notes = useMemo(() => {
    if (!releaseNotes) return [];
    return releaseNotes
      .split('\n')
      .map(line => line.replace(/^[0-9]+\.\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 4);
  }, [releaseNotes]);

  if (!isOpen || !updateInfo) return null;

  const canDismiss = !forceUpdate && status !== 'downloading';

  return (
    <div
      style={s.backdrop(forceUpdate)}
      onClick={(e) => canDismiss && e.target === e.currentTarget && onClose()}
    >
      <div style={s.container}>
        {/* Close Button */}
        {canDismiss && (
          <button onClick={onClose} style={s.closeBtn}>
            <X size={17} />
          </button>
        )}

        {/* Header (Icon + Title) */}
        <div style={s.header}>
          <div style={s.iconBox(status, forceUpdate)}>
            {status === 'ready' ? (
              <CheckCircle2 size={22} />
            ) : forceUpdate ? (
              <AlertCircle size={22} />
            ) : (
              <ArrowUpCircle size={22} />
            )}
          </div>

          <div>
            <h3 style={s.title}>
              {status === 'ready'
                ? 'Tải cập nhật hoàn tất'
                : status === 'downloading'
                ? 'Đang tải bản cập nhật...'
                : forceUpdate
                ? 'Yêu cầu cập nhật'
                : 'Có bản cập nhật mới'}
            </h3>
            <span style={s.versionText}>Phiên bản {latestVersion}</span>
          </div>
        </div>

        {/* Description */}
        <p style={s.description(forceUpdate)}>
          {status === 'ready'
            ? 'Bản cập nhật đã sẵn sàng. Khởi động lại ứng dụng để áp dụng ngay.'
            : status === 'downloading'
            ? 'Vui lòng giữ ứng dụng mở trong khi quá trình tải diễn ra.'
            : forceUpdate
            ? 'Phiên bản hiện tại đã lỗi thời. Vui lòng cập nhật để tiếp tục sử dụng.'
            : 'Đã có phiên bản mới với các cải tiến và sửa lỗi hệ thống.'}
        </p>

        {/* Downloading Progress Bar */}
        {status === 'downloading' && (
          <div style={s.progressContainer}>
            <div style={s.progressHeader}>
              <span>Tiến trình tải</span>
              <span style={{ color: '#2563EB' }}>{progress}%</span>
            </div>
            <div style={s.progressTrack}>
              <div style={s.progressBar(progress)} />
            </div>
          </div>
        )}

        {/* Release Notes */}
        {status === 'idle' && notes.length > 0 && (
          <div style={s.notesBox}>
            {notes.map((note, idx) => (
              <div key={idx} style={s.noteItem}>
                <span style={s.noteDot(forceUpdate)} />
                <span>{note}</span>
              </div>
            ))}
          </div>
        )}

        {/* Error / Disconnected Banner */}
        {status === 'error' && (
          <div style={s.errorBox}>
            <WifiOff size={18} style={{ flexShrink: 0, color: '#DC2626' }} />
            <span>{error || 'Mất kết nối mạng hoặc máy chủ không phản hồi.'}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={s.actions}>
          {canDismiss && (
            <button onClick={onClose} style={s.secondaryBtn}>
              Để sau
            </button>
          )}

          {status === 'idle' && (
            <button onClick={startDownload} style={s.primaryBtn(forceUpdate)}>
              {forceUpdate ? 'Cập nhật ngay' : 'Cập nhật'}
            </button>
          )}

          {status === 'downloading' && (
            <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Đang tải xuống...</span>
            </div>
          )}

          {status === 'ready' && (
            <button onClick={installUpdate} style={s.installBtn}>
              Khởi động lại & Cài đặt ngay
            </button>
          )}

          {status === 'error' && (
            <>
              <button onClick={manualDownload} style={s.secondaryBtn}>
                Mở link tải ngoài
              </button>
              <button
                onClick={startDownload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  ...s.primaryBtn(false)
                }}
              >
                <RotateCcw size={13} />
                <span>Thử lại</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
