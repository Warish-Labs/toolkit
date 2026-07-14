// Browser and Viewport diagnostic parsing logic

export interface BrowserDetails {
  userAgent: string;
  browserName: string;
  osName: string;
  screenResolution: string;
  viewportSize: string;
  touchSupport: boolean;
  networkType: string;
  onlineStatus: boolean;
}

export function getBrowserInspectorDetails(): BrowserDetails {
  if (typeof window === 'undefined') {
    return {
      userAgent: 'Server-side pre-render',
      browserName: 'Unknown',
      osName: 'Unknown',
      screenResolution: 'N/A',
      viewportSize: 'N/A',
      touchSupport: false,
      networkType: 'Unknown',
      onlineStatus: true
    };
  }

  const ua = navigator.userAgent;
  let browserName = 'Unknown Browser';
  let osName = 'Unknown OS';

  // Parse Browser
  if (ua.includes('Firefox')) browserName = 'Mozilla Firefox';
  else if (ua.includes('SamsungBrowser')) browserName = 'Samsung Internet';
  else if (ua.includes('Opera') || ua.includes('OPR')) browserName = 'Opera';
  else if (ua.includes('Trident')) browserName = 'Microsoft Internet Explorer';
  else if (ua.includes('Edge') || ua.includes('Edg')) browserName = 'Microsoft Edge';
  else if (ua.includes('Chrome')) browserName = 'Google Chrome';
  else if (ua.includes('Safari')) browserName = 'Apple Safari';

  // Parse OS
  if (ua.includes('Windows')) osName = 'Windows';
  else if (ua.includes('Macintosh') || ua.includes('Mac OS')) osName = 'macOS';
  else if (ua.includes('Android')) osName = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) osName = 'iOS';
  else if (ua.includes('Linux')) osName = 'Linux';

  const screenResolution = `${window.screen.width} × ${window.screen.height}`;
  const viewportSize = `${window.innerWidth} × ${window.innerHeight}`;
  
  const touchSupport = 
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0;

  // Network connection info
  const conn = (navigator as any).connection;
  const networkType = conn ? `${conn.effectiveType || ''} (${conn.type || 'cellular'})` : 'Unknown';

  return {
    userAgent: ua,
    browserName,
    osName,
    screenResolution,
    viewportSize,
    touchSupport,
    networkType,
    onlineStatus: navigator.onLine
  };
}
