const VISITOR_ID_KEY = 'warishlabs_vid';

/**
 * Retrieves existing visitor ID from localStorage or creates a new UUID token.
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';

  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        visitorId = crypto.randomUUID();
      } else {
        visitorId = 'vid_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
      }
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  } catch {
    return '';
  }
}

interface AnalyticsPayload {
  eventName?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Low-level function to send event payload to the central analytics ingest endpoint.
 * Always fails silently so error handling or network issues never affect the app.
 */
export async function sendAnalytics(payload: AnalyticsPayload = {}): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const analyticsUrl =
      process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'https://warishlabs.in/api/analytics/event';
    const projectId = process.env.NEXT_PUBLIC_ANALYTICS_PROJECT_ID || 'toolkit';
    const visitorId = getVisitorId();

    const fullPayload = {
      projectId,
      visitorId,
      path: window.location.pathname + window.location.search,
      url: window.location.href,
      referrer: document.referrer || '',
      userAgent: navigator.userAgent || '',
      timestamp: new Date().toISOString(),
      ...payload,
    };

    await fetch(analyticsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fullPayload),
      keepalive: true,
    }).catch(() => null);
  } catch {
    // Fail silently
  }
}

/**
 * Tracks route / page view changes automatically or manually.
 */
export function trackPageView(customPath?: string): void {
  sendAnalytics({
    eventName: 'page_view',
    data: customPath ? { path: customPath } : undefined,
  });
}

/**
 * Custom event tracking helper for component-level button clicks or feature usage.
 */
export function trackEvent(eventName: string, data?: Record<string, unknown>): void {
  sendAnalytics({
    eventName,
    data,
  });
}
