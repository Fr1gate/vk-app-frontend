import { useErrorStore } from "@/stores/errorStore";
import { Api } from "./generated/types";
import type { AxiosError } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipErrorHandler?: boolean;
  }
}

export class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, opts?: { status?: number; code?: string }) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status;
    this.code = opts?.code;
  }
}

const api = new Api({
  baseURL: import.meta.env.VITE_API_URL,
});

api.instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const skip = error.config?.skipErrorHandler === true;

    let apiError: ApiError;
    if (!error.response) {
      apiError = error.code === "ECONNABORTED" ? new ApiError("Сервер не ответил вовремя") : new ApiError("Нет соединения с сервером");
    } else {
      const body = error.response.data as { message?: string; code?: string } | undefined;
      apiError = new ApiError(body?.message ?? error.message, {
        status: error.response.status,
        code: body?.code,
      });
    }

    if (!skip) {
      useErrorStore().handleError(apiError);
    }
    return Promise.reject(apiError);
  },
);

function setHeaders(headers: Record<string, string>) {
  Object.entries(headers).forEach(([key, value]) => {
    api.instance.defaults.headers.common[key] = value;
  });
}

/**
 * Выводит тип payload ответа API по пути внутри сгенерированного класса `Api`.
 *
 * Путь задаётся кортежем ключей: `[тег, метод]` (и глубже, если нужно).
 * На последнем ключе извлекается тип `data` из `Promise<AxiosResponse<D>>`.
 * Неверный путь или не-функция на конце даёт `never` — ошибка видна на этапе типов.
 *
 * @template GPath Кортеж ключей-пути к методу API, например `["auth", "loginCreate"]`
 * @template GObj Внутренний параметр рекурсии — текущий уровень дерева Api (не указывается)
 *
 * @example
 * // Весь payload ответа POST /auth/login:
 * type LoginData = ApiData<["auth", "loginCreate"]>;
 * //    ^ { success?: boolean; user?: {...} }
 *
 * @example
 * // Вложенное поле
 * type Player = ApiData<["auth", "loginCreate"]>["user"];
 * //    ^ { id?: string; vk_id?: string; name?: string; earth_base_id?: number }
 */
export type ApiData<GPath extends readonly string[], GObj = Api<never>> = GPath extends readonly [
  infer FirstProp extends keyof GObj,
  ...infer RestProps extends readonly string[],
]
  ? // проверяем, что ключи верные
    FirstProp extends keyof GObj
    ? RestProps extends readonly []
      ? // Добрались до запроса? Если да, то возвращаем дату
        GObj[FirstProp] extends (...args: never[]) => Promise<{ data: infer Data }>
        ? Data
        : never
      : // Не добрались, идем дальше рекурсией
        ApiData<RestProps, GObj[FirstProp]>
    : never
  : never;

export { api, setHeaders };
