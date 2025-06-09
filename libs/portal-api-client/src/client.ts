import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type ErrorResponse = {
  success: false;
  message: string;
};

export type BaseResponse<T> = SuccessResponse<T> | ErrorResponse;

export let client = axios.create({});
export const setAxiosClient = (_client: AxiosInstance) => {
  client = _client;
};

export class APIError extends Error {
  constructor(
    message: string,
    public response?: AxiosResponse,
    public originalError?: Error,
  ) {
    super(message);
  }
}

const isJsonResponse = (res: AxiosResponse) => {
  const contentType = (res.headers as any).get("Content-Type");

  if (!contentType) return false;

  if (Array.isArray(contentType)) {
    return contentType.includes("application/json");
  }

  if (typeof contentType === "string") {
    return contentType.includes("application/json");
  }

  return false;
};

export const processResponse = async <T>(
  response: () => Promise<AxiosResponse<BaseResponse<T>>>,
) => {
  try {
    const res = await response();

    if (!isJsonResponse(res)) {
      return res.data as T;
    }

    if (!res.data.success) {
      throw new APIError(res.data.message, res);
    }
    return res.data.data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError("network error", error);
  }
};

export type RequestConfig<TData = unknown> = {
  url?: string;
  method: string;
  params?: unknown;
  data?: TData | FormData;
  responseType?:
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream";
  signal?: AbortSignal;
  headers?: AxiosRequestConfig["headers"];
  queryKey?: string[];
};

export type ResponseConfig<TData = unknown> = TData;

const request = async <TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
): Promise<TData> => {
  const res = await processResponse(() =>
    client.request<BaseResponse<TData>>(config),
  );

  return res;
};

export default request;
