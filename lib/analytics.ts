type EventProps = Record<string, unknown>;

declare global {
  interface Window { __events?: Array<{ event: string; props?: EventProps; ts: number }>; }
}

export function track(event: string, props?: EventProps) {
  if (typeof window === 'undefined') return;
  window.__events = window.__events || [];
  const payload = { event, props, ts: Date.now() };
  window.__events.push(payload);
  // 这里可接入真实 SDK，如 PostHog/GA4
  // posthog?.capture?.(event, props)
  // gtag?.('event', event, props)
  if (process.env.NODE_ENV !== 'production') {
    // 开发期便于查看
    // eslint-disable-next-line no-console
    console.debug('[track]', payload);
  }
}