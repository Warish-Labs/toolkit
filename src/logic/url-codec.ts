export function encodeUrl(urlStr: string, mode: 'all' | 'special' = 'all'): string {
  if (!urlStr) return '';
  if (mode === 'all') {
    return encodeURIComponent(urlStr);
  } else {
    return encodeURI(urlStr);
  }
}

export function decodeUrl(urlStr: string, mode: 'all' | 'special' = 'all'): string {
  if (!urlStr) return '';
  if (mode === 'all') {
    return decodeURIComponent(urlStr);
  } else {
    return decodeURI(urlStr);
  }
}
