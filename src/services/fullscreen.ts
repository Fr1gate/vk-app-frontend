interface LegacyFullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

export function isFullscreenActive(): boolean {
  return Boolean(document.fullscreenElement);
}

async function lockLandscape(): Promise<void> {
  if (!screen.orientation?.lock) return;

  try {
    await screen.orientation.lock("landscape");
  } catch {
    // платформа запретила лок (desktop / sandbox без allow-orientation-lock)
  }
}

export async function toggleFullscreen(): Promise<void> {
  if (document.fullscreenElement) {
    screen.orientation?.unlock?.();
    await document.exitFullscreen().catch(() => undefined);
    return;
  }

  const element = document.documentElement as LegacyFullscreenElement;
  const requestFullscreen = element.requestFullscreen ?? element.webkitRequestFullscreen;
  if (!requestFullscreen) return;

  try {
    await requestFullscreen.call(element);
    await lockLandscape();
  } catch {
    // iframe без allowfullscreen — фуллскрин недоступен
  }
}
