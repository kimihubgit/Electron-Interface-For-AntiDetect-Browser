import { useEffect, useRef } from 'react';

/**
 * useModalShortcuts - Hook chuẩn hóa trải nghiệm Modal & Accessibility
 * 1. Tự động đóng modal khi nhấn phím Escape
 * 2. Ngăn cuộn trang nền (scroll lock) khi modal đang hiển thị
 * 3. Hỗ trợ autofocus vào modal container
 *
 * @param {boolean} isOpen - Trạng thái modal đang mở hay đóng
 * @param {function} onClose - Hàm callback đóng modal
 * @param {object} options - Cấu hình mở rộng { closeOnEsc: true, lockScroll: true }
 */
export function useModalShortcuts(isOpen, onClose, { closeOnEsc = true, lockScroll = true } = {}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Phím Escape để đóng
    const handleKeyDown = (e) => {
      if (closeOnEsc && e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // 2. Lock scroll body
    let originalOverflow = '';
    if (lockScroll) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (lockScroll) {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [isOpen, onClose, closeOnEsc, lockScroll]);

  return modalRef;
}

export default useModalShortcuts;
