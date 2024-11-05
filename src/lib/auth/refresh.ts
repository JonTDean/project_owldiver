let refreshPromise: Promise<void> | null = null;

export async function refreshToken() {
  // Prevent multiple simultaneous refresh requests
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = fetch('/auth/refresh', {
    method: 'POST',
    credentials: 'include'
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error('Failed to refresh token');
      }
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

// Auto-refresh before token expires
export function setupAutoRefresh() {
  // Refresh 1 minute before token expires
  const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes

  const interval = setInterval(refreshToken, REFRESH_INTERVAL);
  return () => clearInterval(interval);
} 