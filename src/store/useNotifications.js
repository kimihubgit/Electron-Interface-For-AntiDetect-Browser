import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getNotificationsApi, getCachedNotifications } from '../services/api/notificationApi';

/**
 * Hook for managing real-time notifications and to-dos
 * @param {Object|null} currentUser
 */
export function useNotifications(currentUser = null) {
  const currentKey = currentUser?.id || 'guest';
  const [items, setItems] = useState(() => getCachedNotifications(currentKey));
  const [isLoading, setIsLoading] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem(`read_notifications_${currentKey}`);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const activeUserIdRef = useRef(currentKey);

  // Sync readIds and load cached items when user switches accounts or logs in/out
  useEffect(() => {
    const key = currentUser?.id || 'guest';
    activeUserIdRef.current = key;
    try {
      const stored = localStorage.getItem(`read_notifications_${key}`);
      setReadIds(stored ? new Set(JSON.parse(stored)) : new Set());
    } catch {
      setReadIds(new Set());
    }

    // Fast-load cache for this account
    const cached = getCachedNotifications(key);
    if (cached && cached.length > 0) {
      setItems(cached);
    }
  }, [currentUser?.id]);

  // Persist readIds to localStorage
  const saveReadIds = useCallback((newSet) => {
    try {
      const key = activeUserIdRef.current;
      localStorage.setItem(`read_notifications_${key}`, JSON.stringify(Array.from(newSet)));
    } catch (e) {
      console.warn('[useNotifications] Failed to save read status:', e);
    }
  }, []);

  // Fetch notifications from server (flexible auth handled by apiClient)
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getNotificationsApi();
      if (Array.isArray(res.data)) {
        setItems(res.data);
      }
    } catch (err) {
      console.warn('[useNotifications] Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount and refetch whenever user account / token changes
  useEffect(() => {
    fetchNotifications();
  }, [currentUser?.id, fetchNotifications]);

  // Periodic background sync every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Mark single notification as read
  const markAsRead = useCallback((id) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, [saveReadIds]);

  // Mark all notifications (or all in a specific tab) as read
  const markAllAsRead = useCallback((tabType = null) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      items.forEach((item) => {
        const itemTab = item.tab_type || 'notification';
        if (!tabType || itemTab === tabType) {
          next.add(item.id);
        }
      });
      saveReadIds(next);
      return next;
    });
  }, [items, saveReadIds]);

  // Derived lists and counts
  const notificationList = useMemo(() => {
    return items.map((item) => ({
      ...item,
      tab_type: item.tab_type || 'notification',
      isRead: readIds.has(item.id)
    }));
  }, [items, readIds]);

  const notificationsOnly = useMemo(() => {
    return notificationList.filter((item) => item.tab_type === 'notification');
  }, [notificationList]);

  const todosOnly = useMemo(() => {
    return notificationList.filter((item) => item.tab_type === 'todo');
  }, [notificationList]);

  const unreadNotificationsCount = useMemo(() => {
    return notificationsOnly.filter((i) => !i.isRead).length;
  }, [notificationsOnly]);

  const unreadTodosCount = useMemo(() => {
    return todosOnly.filter((i) => !i.isRead).length;
  }, [todosOnly]);

  const totalUnreadCount = unreadNotificationsCount + unreadTodosCount;

  return {
    items: notificationList,
    notificationsOnly,
    todosOnly,
    unreadNotificationsCount,
    unreadTodosCount,
    totalUnreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}
