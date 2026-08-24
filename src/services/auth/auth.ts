import { usePlayerStore } from "@/stores/playerStore";
import { api, setHeaders } from "@/api";
import axios from "axios";

const isDevMode = import.meta.env.VITE_DEV_MODE === "true";

export interface AuthReturnValue {
  loggedIn: boolean;
  isError: boolean;
}

export async function auth(vkParams: Record<string, unknown>): Promise<AuthReturnValue> {
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

    // set player store
    if (response.data?.user) {
      playerStore.player = response.data.user;
      return {
        loggedIn: true,
        isError: false,
      };
    }

    return {
      loggedIn: false,
      isError: false,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        // NOT AUTHORIZED
        return {
          loggedIn: false,
          isError: false,
        };
      }
    }
    console.error("Login error");
    console.error(error);
    return {
      loggedIn: false,
      isError: true,
    };
  }
}
