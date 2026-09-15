import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * SearchInput - Thành phần tìm kiếm chuẩn State Colocation
 * Lưu state nhập liệu cục bộ và chỉ phát tín hiệu (onChange) lên component cha sau khi debounce.
 * Giúp ngăn chặn việc re-render toàn bộ bảng hoặc danh sách hàng nghìn items khi người dùng đang gõ phím.
 *
 * @param {string} value - Giá trị từ component cha (đồng bộ 2 chiều)
 * @param {function} onChange - Hàm callback nhận giá trị debounced
 * @param {string} placeholder - Placeholder text
 * @param {number} delay - Thời gian debounce (ms)
 * @param {object} style - Tùy chỉnh style container
 */
export default function SearchInput({
  value = '',
  onChange,
  placeholder = 'Tìm kiếm...',
  delay = 250,
  style = {},
  className = '',
  autoFocus = false
}) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, delay);
  const inputRef = useRef(null);
  const isFirstRender = useRef(true);

  // Sync ngược từ cha nếu cha đổi value chủ động (ví dụ: nút reset filter)
  useEffect(() => {
    if (value !== localValue && isFirstRender.current) {
      setLocalValue(value);
    }
  }, [value]);

  // Bắn giá trị debounced lên cha
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onChange?.(debouncedValue);
  }, [debouncedValue]);

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '7px',
        padding: '0 10px',
        height: '32px',
        minWidth: '220px',
        boxSizing: 'border-box',
        transition: 'all 0.15s ease',
        ...style
      }}
      className={className}
    >
      <Search size={14} style={{ color: '#9CA3AF', flexShrink: 0, marginRight: '6px' }} />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={localValue}
        autoFocus={autoFocus}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            handleClear();
          }
        }}
        style={{
          border: 'none',
          outline: 'none',
          fontSize: '12.5px',
          width: '100%',
          backgroundColor: 'transparent',
          color: '#1F2937',
          padding: 0
        }}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            color: '#9CA3AF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            marginLeft: '4px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#4B5563'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
          title="Xóa tìm kiếm (ESC)"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
