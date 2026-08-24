/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:3000",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title VK Game Backend API
 * @version 1.0.0
 * @baseUrl http://localhost:3000
 *
 * API documentation for VK Game Backend.
 *
 * ## Authentication
 *
 * All endpoints (except `/test/ping`) require the `x-vk-params` header.
 *
 * **Header format:** Base64-encoded JSON string containing VK launch parameters.
 *
 * ```
 * x-vk-params: <base64 of {"vk_user_id":"12345","sign":"...","vk_app_id":"...","...":"..."}>
 * ```
 *
 * In **production**, the `sign` field is verified against `VK_CLIENT_SECRET`.
 *
 * In **development** (`DEV_MODE=true`), the header is optional. If omitted, a mock user `dev_user_1` is used. You can override the dev user ID with query param `?dev_user_id=123` or header `x-dev-user-id: 123`.
 *
 * ## Базы и точки высадки
 *
 * Базы однородны и адресуются точкой высадки: `/bases/:siteId`, где `siteId` — идентификатор из баланса (`site_earth`, `site_moon_shackleton`, …). Раздельных `/earth-base` и `/moon-base` больше нет. Справочник точек: `GET /sites`.
 *
 * ## Идентификаторы
 *
 * Ресурсы, здания, модули и технологии адресуются строковыми id из баланса: `res_*`, `bld_*`, `mod_*`, техи вида `A1`/`BH2`. Количество ресурсов — килограммы (одна единица = 1 кг), деньги — такой же ресурс `res_money`.
 *
 * ## Производство базы
 *
 * Здания базы работают циклами (добыча и переработка). Производство доначисляется лениво: при каждом чтении базы закрываются целые прошедшие циклы и результат пишется в склад. Ставок «доход в час» и посекундного начисления на сервере нет — клиент узнаёт о производстве по изменившимся запасам. Деньги базовое производство не приносит: они поступают из грантов, миссий и контрактов.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  test = {
    /**
     * @description Simple ping endpoint to test server connectivity. No authentication required.
     *
     * @tags test
     * @name PingList
     * @summary Ping endpoint
     * @request GET:/test/ping
     */
    pingList: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/test/ping`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  auth = {
    /**
     * @description Login user by VK ID
     *
     * @tags auth
     * @name LoginCreate
     * @summary User login
     * @request POST:/auth/login
     * @secure
     */
    loginCreate: (params: RequestParams = {}) =>
      this.request<
        {
          success?: boolean;
          message?: string;
          user?: {
            id: string;
            vk_id: string;
            name: string;
            earth_base_id: number;
          };
        },
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/auth/login`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Register a new user with VK ID
     *
     * @tags auth
     * @name RegisterCreate
     * @summary User registration
     * @request POST:/auth/register
     * @secure
     */
    registerCreate: (
      data: {
        /** User's name */
        name: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          success?: boolean;
          message?: string;
          user?: {
            id: string;
            vk_id: string;
            name: string;
            earth_base_id: number;
          };
        },
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/auth/register`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  bases = {
    /**
     * @description Базы игрока на всех точках высадки, каждая в том же виде, что и одиночный запрос. Производство доначисляется перед выдачей.
     *
     * @tags bases
     * @name BasesList
     * @summary Все базы игрока
     * @request GET:/bases
     * @secure
     */
    basesList: (params: RequestParams = {}) =>
      this.request<
        {
          id?: number;
          site_id?: string;
          site_name?: string;
          body?: string;
          /** Факторы точки, влияющие на базу */
          site?: {
            gravity?: number;
            ambient_temp_c?: number;
            solar_efficiency?: number;
            radiation?: number;
            delta_v_from_leo?: number;
          };
          /** Построенные здания базы */
          buildings?: {
            id?: number;
            building_id?: string;
            name?: string;
            slot_number?: number;
            level?: number;
            /** @format date-time */
            will_upgrade_at?: null | string;
          }[];
          /** Что можно строить на этом теле: текущий уровень, цена следующего и гейт по технологии */
          buildings_available?: {
            building_id?: string;
            name?: string;
            kind?: string;
            /** Текущий уровень; 0 — ещё не построено */
            level?: number;
            max_level?: number;
            /** Открыто ли технологией */
            unlocked?: boolean;
            required_tech?: null | string;
            next_level_cost?: Record<string, number>;
            next_level_minutes?: number;
          }[];
          /** Ресурсы на базе без топлива: res_* → килограммы (res_money — деньги) */
          resources?: Record<string, number>;
          /** Топливные ресурсы отдельной группой: res_* → килограммы (только isFuelType) */
          fuel?: Record<string, number>;
          /** Готовые модули на складе: mod_* → штуки */
          modules?: Record<string, number>;
          /** Склады по агрегатным состояниям. Корзина ресурса — его `state` из баланса (для этого и построен склад/депо); `resource_phase_here` — справка, во что вещество превращается на этой точке. Излишек сверх вместимости не блокирует производство, а сгорает раз в `overflow_tick_minutes`. */
          storage?: {
            phases?: {
              phase?: "solid" | "liquid" | "gas";
              used?: number;
              capacity?: number;
              /** Сколько сгорит на следующем тике */
              overflow?: number;
            }[];
            overflow_tick_minutes?: number;
            site_conditions?: {
              ambient_temp_c?: number;
              pressure_atm?: number;
            };
            /** res_* → фаза на этой точке (solid/liquid/gas) */
            resource_phase_here?: Record<string, string>;
          };
          /** Активные производственные линии базы. Момент завершения цикла детерминирован, поэтому клиент сам ставит таймер и перезапрашивает базу — сокеты не нужны. */
          production?: {
            lines?: {
              /** id постройки на базе */
              building_id?: number;
              building_type?: string;
              /** ex:<sourceId> — добыча, rcp:<recipeId> — переработка */
              line_key?: string;
              kind?: "extraction" | "recipe";
              name?: string;
              inputs?: Record<string, number>;
              /** Выход за цикл с учётом богатства жилы */
              outputs?: Record<string, number>;
              cycle_seconds?: number;
              /**
               * Начало текущего цикла — для прогресс-бара
               * @format date-time
               */
              started_at?: null | string;
              /**
               * Когда завершится текущий цикл
               * @format date-time
               */
              next_cycle_at?: null | string;
              /** no_power — не хватило мощности (линия стоит весь интервал); no_input — нет входного сырья на складе */
              status?: "running" | "no_power" | "no_input";
              missing_inputs?: string[];
              power_demand_per_hour?: number;
            }[];
            /**
             * Ближайшее завершение среди работающих линий — таймер для клиента
             * @format date-time
             */
            next_cycle_at?: null | string;
            /** Баланс мощности базы: сколько вырабатывается и сколько просят линии */
            power?: {
              generation_per_hour?: number;
              demand_per_hour?: number;
            };
          };
          /** @format date-time */
          server_time?: string;
        }[],
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/bases`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Единый ответ для экрана базы — построенные здания, ресурсы, склад модулей, список доступных к постройке зданий с ценами и гейтами по технологиям, активные производственные линии и факторы точки. Собирать экран из нескольких запросов не нужно. Перед выдачей доначисляется производство (целые завершённые циклы), закрываются очереди фабрики, сборка кораблей и завершённые полёты. `production.next_cycle_at` — ближайшее завершение цикла: клиент ставит таймер на этот момент и перезапрашивает базу, обновления по сокету не нужны.
     *
     * @tags bases
     * @name BasesDetail
     * @summary База игрока: всё для экрана базы
     * @request GET:/bases/{siteId}
     * @secure
     */
    basesDetail: (
      siteId:
        | "site_earth"
        | "site_leo"
        | "site_mars_arcadia"
        | "site_mars_deuteronilus"
        | "site_mars_marineris"
        | "site_mars_polar"
        | "site_mars_tharsis"
        | "site_moon_highlands"
        | "site_moon_meteorfield"
        | "site_moon_procellarum"
        | "site_moon_shackleton"
        | "site_moon_tranquillitatis"
        | "site_psyche"
        | "site_venus_cloud"
        | "site_venus_orbit",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id?: number;
          site_id?: string;
          site_name?: string;
          body?: string;
          /** Факторы точки, влияющие на базу */
          site?: {
            gravity?: number;
            ambient_temp_c?: number;
            solar_efficiency?: number;
            radiation?: number;
            delta_v_from_leo?: number;
          };
          /** Построенные здания базы */
          buildings?: {
            id?: number;
            building_id?: string;
            name?: string;
            slot_number?: number;
            level?: number;
            /** @format date-time */
            will_upgrade_at?: null | string;
          }[];
          /** Что можно строить на этом теле: текущий уровень, цена следующего и гейт по технологии */
          buildings_available?: {
            building_id?: string;
            name?: string;
            kind?: string;
            /** Текущий уровень; 0 — ещё не построено */
            level?: number;
            max_level?: number;
            /** Открыто ли технологией */
            unlocked?: boolean;
            required_tech?: null | string;
            next_level_cost?: Record<string, number>;
            next_level_minutes?: number;
          }[];
          /** Ресурсы на базе без топлива: res_* → килограммы (res_money — деньги) */
          resources?: Record<string, number>;
          /** Топливные ресурсы отдельной группой: res_* → килограммы (только isFuelType) */
          fuel?: Record<string, number>;
          /** Готовые модули на складе: mod_* → штуки */
          modules?: Record<string, number>;
          /** Склады по агрегатным состояниям. Корзина ресурса — его `state` из баланса (для этого и построен склад/депо); `resource_phase_here` — справка, во что вещество превращается на этой точке. Излишек сверх вместимости не блокирует производство, а сгорает раз в `overflow_tick_minutes`. */
          storage?: {
            phases?: {
              phase?: "solid" | "liquid" | "gas";
              used?: number;
              capacity?: number;
              /** Сколько сгорит на следующем тике */
              overflow?: number;
            }[];
            overflow_tick_minutes?: number;
            site_conditions?: {
              ambient_temp_c?: number;
              pressure_atm?: number;
            };
            /** res_* → фаза на этой точке (solid/liquid/gas) */
            resource_phase_here?: Record<string, string>;
          };
          /** Активные производственные линии базы. Момент завершения цикла детерминирован, поэтому клиент сам ставит таймер и перезапрашивает базу — сокеты не нужны. */
          production?: {
            lines?: {
              /** id постройки на базе */
              building_id?: number;
              building_type?: string;
              /** ex:<sourceId> — добыча, rcp:<recipeId> — переработка */
              line_key?: string;
              kind?: "extraction" | "recipe";
              name?: string;
              inputs?: Record<string, number>;
              /** Выход за цикл с учётом богатства жилы */
              outputs?: Record<string, number>;
              cycle_seconds?: number;
              /**
               * Начало текущего цикла — для прогресс-бара
               * @format date-time
               */
              started_at?: null | string;
              /**
               * Когда завершится текущий цикл
               * @format date-time
               */
              next_cycle_at?: null | string;
              /** no_power — не хватило мощности (линия стоит весь интервал); no_input — нет входного сырья на складе */
              status?: "running" | "no_power" | "no_input";
              missing_inputs?: string[];
              power_demand_per_hour?: number;
            }[];
            /**
             * Ближайшее завершение среди работающих линий — таймер для клиента
             * @format date-time
             */
            next_cycle_at?: null | string;
            /** Баланс мощности базы: сколько вырабатывается и сколько просят линии */
            power?: {
              generation_per_hour?: number;
              demand_per_hour?: number;
            };
          };
          /** @format date-time */
          server_time?: string;
        },
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/bases/${siteId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт базу игрока на указанной точке. Точка должна быть открыта технологией (`unlockedByTechId`). Колония начинается с нуля — стартовые ресурсы получает только домашняя база.
     *
     * @tags bases
     * @name OpenCreate
     * @summary Открыть базу на точке высадки
     * @request POST:/bases/{siteId}/open
     * @secure
     */
    openCreate: (
      siteId:
        | "site_earth"
        | "site_leo"
        | "site_mars_arcadia"
        | "site_mars_deuteronilus"
        | "site_mars_marineris"
        | "site_mars_polar"
        | "site_mars_tharsis"
        | "site_moon_highlands"
        | "site_moon_meteorfield"
        | "site_moon_procellarum"
        | "site_moon_shackleton"
        | "site_moon_tranquillitatis"
        | "site_psyche"
        | "site_venus_cloud"
        | "site_venus_orbit",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id?: number;
          site_id?: string;
        },
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/bases/${siteId}/open`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Списывает ресурсы и ставит здание на улучшение. Если здания ещё нет, оно создаётся в свободном слоте нулевого уровня и поднимается до первого.
     *
     * @tags bases
     * @name BuildingsUpgradeCreate
     * @summary Построить или улучшить здание
     * @request POST:/bases/{siteId}/buildings/{buildingId}/upgrade
     * @secure
     */
    buildingsUpgradeCreate: (
      siteId: string,
      buildingId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id?: number;
          building_id?: string;
          level?: number;
          /** @format date-time */
          will_upgrade_at?: null | string;
        },
        | {
            error?: string;
            message?: string;
            missingResources?: string[];
          }
        | {
            error?: string;
            message?: string;
          }
      >({
        path: `/bases/${siteId}/buildings/${buildingId}/upgrade`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Очередь производства и список модулей, доступных к выпуску. У элемента очереди может быть `defect` — дефект незрелой технологии, выпавший при запуске цикла: `{ id, description, severity }`. Пока это только запись в журнале для показа: на срок и выпуск модуля дефект НЕ влияет (эффект ждёт учёных и полётов). Риск выпадения исчезает, когда технологию применили `resolvesAfterUses` раз.
     *
     * @tags facilities
     * @name FacilitiesDetail
     * @summary Состояние производственного здания
     * @request GET:/bases/{siteId}/facilities/{buildingId}
     * @secure
     */
    facilitiesDetail: (
      siteId: string,
      buildingId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        Record<string, any>,
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/bases/${siteId}/facilities/${buildingId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Ресурсы списываются сразу при постановке в очередь.
     *
     * @tags facilities
     * @name FacilitiesProduceCreate
     * @summary Поставить модуль в очередь производства
     * @request POST:/bases/{siteId}/facilities/{buildingId}/produce
     * @secure
     */
    facilitiesProduceCreate: (
      siteId: string,
      buildingId: string,
      data: {
        /** mod_* из modules.json */
        moduleId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          taskId?: number;
        },
        | {
            error?: string;
            message?: string;
            missingResources?: string[];
          }
        | {
            error?: string;
            message?: string;
          }
      >({
        path: `/bases/${siteId}/facilities/${buildingId}/produce`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Выпущенные модули, готовые к сборке корабля: id, название, категория, масса и количество.
     *
     * @tags facilities
     * @name ModulesList
     * @summary Склад готовых модулей базы
     * @request GET:/bases/{siteId}/modules
     * @secure
     */
    modulesList: (siteId: string, params: RequestParams = {}) =>
      this.request<
        {
          moduleId?: string;
          name?: string;
          category?: string;
          massT?: number;
          count?: number;
        }[],
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/bases/${siteId}/modules`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Лимиты уровня (сколько модулей вмещает корабль, минут на модуль) и корабли в сборке.
     *
     * @tags ships
     * @name ShipyardDetail
     * @summary Состояние верфи
     * @request GET:/bases/{siteId}/shipyard/{buildingId}
     * @secure
     */
    shipyardDetail: (
      siteId: string,
      buildingId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        Record<string, any>,
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/bases/${siteId}/shipyard/${buildingId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Состав задаётся картой mod_* → количество. Корпус обязателен.
     *
     * @tags ships
     * @name ShipyardAssembleCreate
     * @summary Собрать корабль из модулей склада
     * @request POST:/bases/{siteId}/shipyard/{buildingId}/assemble
     * @secure
     */
    shipyardAssembleCreate: (
      siteId: string,
      buildingId: string,
      data: {
        name?: string;
        composition: Record<string, number>;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          shipId?: number;
        },
        | {
            error?: string;
            message?: string;
            missingModules?: string[];
          }
        | {
            error?: string;
            message?: string;
          }
      >({
        path: `/bases/${siteId}/shipyard/${buildingId}/assemble`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Лимит модулей на запуск для текущего уровня и все корабли базы с их статусами, целями и временем возврата.
     *
     * @tags ships
     * @name LaunchpadDetail
     * @summary Состояние стартовой платформы и корабли базы
     * @request GET:/bases/{siteId}/launchpad/{buildingId}
     * @secure
     */
    launchpadDetail: (
      siteId: string,
      buildingId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        Record<string, any>,
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/bases/${siteId}/launchpad/${buildingId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Топливо тратится по Δv между текущей точкой и целью, время полёта пропорционально Δv.
     *
     * @tags ships
     * @name LaunchpadLaunchCreate
     * @summary Отправить корабль к точке назначения
     * @request POST:/bases/{siteId}/launchpad/{buildingId}/launch
     * @secure
     */
    launchpadLaunchCreate: (
      siteId: string,
      buildingId: string,
      data: {
        shipId: number;
        destinationSiteId: string;
        contractId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @format date-time */
          flight_completes_at?: string;
        },
        | {
            error?: string;
            message?: string;
            missingResources?: string[];
          }
        | {
            error?: string;
            message?: string;
          }
      >({
        path: `/bases/${siteId}/launchpad/${buildingId}/launch`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Цены покупки и продажи по всем торгуемым ресурсам: `basePrice` × множитель из `progression.npcMarket`. Спред большой намеренно — перепродажей не заработать, рынок нужен, чтобы закрыть нехватку и обратить излишки в деньги.
     *
     * @tags market
     * @name MarketList
     * @summary Котировки рынка NPC
     * @request GET:/bases/{siteId}/market
     * @secure
     */
    marketList: (siteId: string, params: RequestParams = {}) =>
      this.request<
        {
          quotes?: {
            resource_id?: string;
            name?: string;
            base_price?: number;
            buy_price?: number;
            sell_price?: number;
          }[];
          buy_multiplier?: number;
          sell_multiplier?: number;
        },
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/bases/${siteId}/market`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Списывает `res_money` со склада базы и кладёт товар. Вместимость склада не проверяется — перелив разрешён и сгорает по своему тику.
     *
     * @tags market
     * @name MarketBuyCreate
     * @summary Купить ресурс за деньги
     * @request POST:/bases/{siteId}/market/buy
     * @secure
     */
    marketBuyCreate: (
      siteId: string,
      data: {
        /** res_* из resources.json */
        resource_id: string;
        /** Количество в кг, больше нуля */
        amount_kg: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          resource_id?: string;
          amount_kg?: number;
          spent?: number;
        },
        | {
            /** Not enough money · Not enough resource · Not tradable · Bad amount · Unknown resource */
            error?: string;
            message?: string;
          }
        | {
            error?: string;
            message?: string;
          }
      >({
        path: `/bases/${siteId}/market/buy`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Списывает товар со склада базы и начисляет `res_money`. Пока это единственный источник денег на сервере: производство их не приносит, контракты ещё не сдаются.
     *
     * @tags market
     * @name MarketSellCreate
     * @summary Продать ресурс за деньги
     * @request POST:/bases/{siteId}/market/sell
     * @secure
     */
    marketSellCreate: (
      siteId: string,
      data: {
        /** res_* из resources.json */
        resource_id: string;
        /** Количество в кг, больше нуля */
        amount_kg: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          resource_id?: string;
          amount_kg?: number;
          earned?: number;
        },
        | {
            /** Not enough money · Not enough resource · Not tradable · Bad amount · Unknown resource */
            error?: string;
            message?: string;
          }
        | {
            error?: string;
            message?: string;
          }
      >({
        path: `/bases/${siteId}/market/sell`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  ships = {
    /**
     * @description Переносит груз корабля на склад базы и возвращает его в статус READY. Работает только со своим кораблём в статусе RETURNED.
     *
     * @tags ships
     * @name UnloadCreate
     * @summary Разгрузить вернувшийся корабль
     * @request POST:/ships/{shipId}/unload
     * @secure
     */
    unloadCreate: (shipId: number, params: RequestParams = {}) =>
      this.request<
        {
          unloaded?: Record<string, number>;
        },
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/ships/${shipId}/unload`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  sites = {
    /**
     * @description Справочник всех точек с их факторами — для карты и выбора цели полёта.
     *
     * @tags bases
     * @name SitesList
     * @summary Точки высадки из баланса
     * @request GET:/sites
     * @secure
     */
    sitesList: (params: RequestParams = {}) =>
      this.request<
        {
          id?: string;
          name?: string;
          body?: string;
          gravity?: number;
          ambientTempC?: number;
          deltaVFromLEO?: number;
          solarEfficiency?: number;
          unlockedByTechId?: null | string;
        }[],
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/sites`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  technologies = {
    /**
     * @description Весь экран исследований одним ответом: тиры, ветки, все технологии со статусом и стоимостью, идущие исследования и число свободных слотов. Слоты: один доступен всегда, лаборатория (`bld_research_lab`) добавляет по своему уровню — так решается то, что саму лабораторию открывает технология G1.
     *
     * @tags technologies
     * @name TechnologiesList
     * @summary Дерево технологий игрока
     * @request GET:/technologies
     * @secure
     */
    technologiesList: (params: RequestParams = {}) =>
      this.request<
        {
          tiers?: {
            id?: string;
            name?: string;
            order?: number;
            optional?: boolean;
          }[];
          branches?: {
            id?: string;
            name?: string;
          }[];
          technologies?: {
            /** A1, BH2, K5 … */
            id?: string;
            name?: string;
            description?: string;
            /** Ветка дерева (A…K) */
            branch_id?: string;
            /** Исторический тир (T1…) */
            tier_id?: null | string;
            /** researched — открыта; in_progress — исследуется сейчас; available — пререквизиты выполнены; locked — нет */
            status?: "researched" | "in_progress" | "available" | "locked";
            /** Группы требований. Строка — одна технология, вложенный массив — «любая из». */
            prerequisites?: any[];
            /** Незакрытые группы, альтернативы через « | ». Пусто, если всё выполнено. */
            missing_prerequisites?: string[];
            cost?: {
              money?: number;
              hours?: number;
              /** Материалы-прототипы: res_* → количество (кг) */
              materials?: Record<string, number>;
            };
            unlocks?: {
              modules?: string[];
              buildings?: string[];
              resources?: string[];
              recipes?: string[];
              sites?: string[];
            };
            /**
             * Когда завершится, если статус in_progress
             * @format date-time
             */
            completes_at?: null | string;
          }[];
          active_research?: {
            tech_id?: string;
            /** @format date-time */
            started_at?: string;
            /** @format date-time */
            completes_at?: string;
          }[];
          /** 1 + уровень лучшей лаборатории */
          slots_total?: number;
          slots_free?: number;
          /** @format date-time */
          server_time?: string;
        },
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/technologies`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Проверяет пререквизиты и свободный слот, списывает деньги и материалы-прототипы со склада указанной базы и ставит технологию в работу на `cost.hours`. Завершение происходит по времени: его догоняет фоновый поллер, а также любой запрос `GET /technologies`.
     *
     * @tags technologies
     * @name ResearchCreate
     * @summary Начать исследование технологии
     * @request POST:/technologies/{techId}/research
     * @secure
     */
    researchCreate: (
      techId: string,
      data: {
        /** Точка базы-плательщика. По умолчанию домашняя (site_earth). */
        site_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          tech_id?: string;
          /** @format date-time */
          completes_at?: string;
        },
        | {
            /** Already researched · Research in progress · No research slots · Prerequisites not met · Not enough resources */
            error?: string;
            message?: string;
            /** Чего именно не хватило на складе базы */
            missingResources?: string[];
          }
        | {
            error?: string;
            message?: string;
          }
      >({
        path: `/technologies/${techId}/research`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  contracts = {
    /**
     * @description Все контракты со статусом и незакрытыми гейтами — экран контрактов одним ответом. Структура данных: 15 контрактов-`milestone` открываются технологиями и служат входами, 35 `delivery` навешаны на них через `required_contract`. Контрактов без гейтов нет, поэтому у игрока без исследований доступного нет ничего. **Взятие и сдача пока не работают** (`fulfilment_enabled: false`): цели контрактов записаны своим словарём (`suborbital`, `gto`, …) и не сопоставимы с точками высадки, а цепочка начинается с суборбитального контракта. Подробности — docs/balance-issues.md §9.
     *
     * @tags contracts
     * @name ContractsList
     * @summary Доска контрактов
     * @request GET:/contracts
     * @secure
     */
    contractsList: (params: RequestParams = {}) =>
      this.request<
        {
          contracts?: {
            /** ct_* из tasks.json */
            id?: string;
            tier?: number;
            /** milestone — вход в цепочку (открывается техой); delivery — звено цепочки */
            kind?: "milestone" | "delivery";
            name?: string;
            description?: string;
            /** available — гейты пройдены; locked — нет */
            status?: "available" | "locked";
            /** Условия из баланса: destination (suborbital/leo/gto/moon/mars/venus/belt), payload_t, deadline_h, crew_min, docking */
            requirements?: Record<string, any>;
            /** Награда деньгами. prestige/reputation пока не начисляются */
            reward_money?: number;
            required_tech?: null | string;
            required_contract?: null | string;
            /** Незакрытые гейты: «tech:BH1», «contract:ct_ms_karman» */
            missing_requirements?: string[];
          }[];
          tiers?: number[];
          kinds?: string[];
          /** @format date-time */
          server_time?: string;
          /** Включена ли сдача контрактов. Пока всегда false */
          fulfilment_enabled?: boolean;
        },
        {
          error?: string;
          message?: string;
        }
      >({
        path: `/contracts`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  solarSystem = {
    /**
     * @description Положения планет, Луны и орбитальных станций на момент t (игровое время ускорено). Публичный.
     *
     * @tags solar-system
     * @name StateList
     * @summary Состояние Солнечной системы
     * @request GET:/solar-system/state
     * @secure
     */
    stateList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/solar-system/state`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Мягкое окно запуска, Δv маршрута и длительность перелёта между телами. Публичный.
     *
     * @tags solar-system
     * @name FlightPlanList
     * @summary План перелёта
     * @request GET:/solar-system/flight-plan
     * @secure
     */
    flightPlanList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/solar-system/flight-plan`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Корабли игрока в пути и их позиции (ленивый расчёт на лету).
     *
     * @tags solar-system
     * @name ShipsList
     * @summary Корабли игрока в полёте
     * @request GET:/solar-system/ships
     * @secure
     */
    shipsList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/solar-system/ships`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Наведение перехватчика на корабль-цель. Бой разрешится лениво при встрече.
     *
     * @tags solar-system
     * @name InterceptCreate
     * @summary Наведение перехватчика
     * @request POST:/solar-system/intercept
     * @secure
     */
    interceptCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/solar-system/intercept`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Бои игрока: как перехватчик и как цель (отчёты разрешённых боёв).
     *
     * @tags solar-system
     * @name BattlesList
     * @summary Мои бои
     * @request GET:/solar-system/battles
     * @secure
     */
    battlesList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/solar-system/battles`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
}
