import { usePlayerStore } from "@/stores/player";
import { api, setHeaders } from "@/api";

const isDevMode = import.meta.env.VITE_DEV_MODE === "true";

/**
 *
 * @param vkParams VK launch params
 * @returns true if user is registered, false otherwise
 */
export async function auth(vkParams: Record<string, unknown>): Promise<boolean> {
  const playerStore = usePlayerStore();

  // Encode VK params to base64
  const base64Params = btoa(JSON.stringify(vkParams));

  if (isDevMode) {
    const devUserId = (vkParams.vk_user_id as string) || "dev_user_1";
    setHeaders({
      "x-vk-params": base64Params,
      "x-dev-user-id": devUserId,
    });
  } else {
    setHeaders({
      "x-vk-params": base64Params,
    });
  }

  try {
    // Use generated API class
    const response = await api.auth.loginCreate();
    console.log("auth response", response);

    // set player store
    if (response.data?.user) {
      playerStore.player = response.data.user;
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
