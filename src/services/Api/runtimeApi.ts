export function getApiBaseUrl() {
  const hostname = window.location.hostname;

  if (hostname.includes('localhost') || hostname === '127.0.0.1') {
    return 'http://10.67.0.89:9999/sbcsm_flagradar/api/v1';
  }

  return `${window.location.origin}/sbcsm_flagradar/api/v1`;
}
