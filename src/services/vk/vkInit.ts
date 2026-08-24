import bridge from "@vkontakte/vk-bridge";
import { auth, type AuthReturnValue } from "@/services/auth/auth";

const isDevMode = import.meta.env.VITE_DEV_MODE === "true";

/**
 *
 * @returns true if user is registered, false otherwise
 */
export async function vkInit(): Promise<AuthReturnValue> {
  // DEV MODE: Bypass VK bridge and use mock data
  if (isDevMode) {
    const mockVkParams = {
      vk_user_id: "dev_user_1", // Matches backend default
      vk_app_id: "12345",
      vk_is_app_user: "1",
      vk_are_notifications_enabled: "0",
      vk_language: "ru",
      vk_ref: "other",
      vk_access_token_settings: "",
      vk_group_id: "0",
      vk_viewer_group_role: "none",
      vk_platform: "desktop_web",
      vk_is_favorite: "0",
      vk_ts: Date.now().toString(),
      sign: "dev_mode_signature",
    };

    return await auth(mockVkParams);
  }

  // PRODUCTION MODE: Use VK bridge
  return new Promise((resolve) => {
    bridge.send("VKWebAppInit");

    bridge.subscribe((event) => {
      if (!event.detail) {
        return;
      }

      switch (event.detail.type) {
        case "VKWebAppInitResult": {
          if (event.detail.data.result) {
            bridge.send("VKWebAppGetLaunchParams");
            bridge.send("VKWebAppResizeWindow", { width: 1000, height: 450 });
          } else {
            return;
          }
          break;
        }
        case "VKWebAppGetLaunchParamsResult": {
          // auth
          const vkParams = event.detail.data;
          auth(vkParams).then((authResult) => {
            resolve(authResult);
          });

          break;
        }
        case "VKWebAppGetLaunchParamsFailed": {
          break;
        }
      }
    });
  });
}
