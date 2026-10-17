import bridge from "@vkontakte/vk-bridge";

const isDevMode = import.meta.env.VITE_DEV_MODE === "true";

interface LegacyFullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

export function isFullscreenActive(): boolean {
  return Boolean(document.fullscreenElement);
}

export async function toggleFullscreen(): Promise<void> {
  if (isFullscreenActive()) {
    await document.exitFullscreen().catch(() => undefined);
    return;
  }

  const element = document.documentElement as LegacyFullscreenElement;
  const requestFullscreen = element.requestFullscreen ?? element.webkitRequestFullscreen;

  if (requestFullscreen) {
    try {
      await requestFullscreen.call(element);
      return;
    } catch {
      // iframe без allowfullscreen или платформа без поддержки — ниже нативный fallback
    }
  }

  if (isDevMode) return;

  try {
    await (bridge as unknown as { send: (method: string) => Promise<unknown> }).send("VKWebAppExpand");
  } catch {
    // метод недоступен на этой платформе
  }
}
