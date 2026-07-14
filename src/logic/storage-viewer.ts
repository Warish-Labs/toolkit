// Cookies and storage values query logic

export interface StorageItem {
  key: string;
  value: string;
}

export function getCookiesList(): StorageItem[] {
  if (typeof document === 'undefined') return [];
  
  const cookies = document.cookie;
  if (!cookies) return [];

  return cookies.split(';').map(cookie => {
    const parts = cookie.split('=');
    return {
      key: parts[0].trim(),
      value: decodeURIComponent(parts.slice(1).join('='))
    };
  });
}

export function getLocalStorageItems(): StorageItem[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];

  const items: StorageItem[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key) {
      items.push({
        key,
        value: window.localStorage.getItem(key) || ''
      });
    }
  }
  return items;
}

export function getSessionStorageItems(): StorageItem[] {
  if (typeof window === 'undefined' || !window.sessionStorage) return [];

  const items: StorageItem[] = [];
  for (let i = 0; i < window.sessionStorage.length; i++) {
    const key = window.sessionStorage.key(i);
    if (key) {
      items.push({
        key,
        value: window.sessionStorage.getItem(key) || ''
      });
    }
  }
  return items;
}
