/**
 * Isolated Toast Pub/Sub Store
 * Allows any component to show toasts without causing the root React tree or BrowserContext to re-render.
 */

class ToastStore {
  constructor() {
    this.toasts = [];
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.toasts);
    }
  }

  getToasts() {
    return this.toasts;
  }

  showToast(message, type = 'success', duration = 3200) {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    this.toasts = [...this.toasts, newToast];
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }
    return id;
  }

  removeToast(id) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }
}

export const toastStore = new ToastStore();
