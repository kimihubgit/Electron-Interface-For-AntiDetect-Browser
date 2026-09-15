import { useState, useEffect } from 'react';

/**
 * useDebounce - Trì hoãn giá trị cập nhật cho đến khi người dùng ngừng thao tác
 * Tránh re-render danh sách lớn hoặc gọi API liên tục khi gõ phím.
 *
 * @param {any} value - Giá trị cần debounce
 * @param {number} delay - Thời gian chờ (ms), mặc định 250ms
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
