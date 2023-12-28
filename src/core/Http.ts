const API_KEY = import.meta.env.VITE_API_KEY;

const HEADERS = {
  JSON: {
    "Content-Type": "application/json;charset=utf-8",
  },
  NONE: {},
} as const;

const METHODS = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

type PostProps<T> = {
  url: string;
  body?: T;
  headers?: keyof typeof HEADERS;
  withApiKey?: boolean;
};

const API_URL = import.meta.env.VITE_API_URL;

const handleResponse = async <T>(
  response: Response,
  handler: (response: Response) => Promise<T> | T
) => {
  if (response.ok) {
    return handler(response);
  } else {
    const err = await response.json();
    throw new Error(err.message || err.error || err);
  }
};

export default class HTTPTransport {
  public put<TResponse, TBody = unknown>({
    url,
    body,
    headers = "JSON",
  }: PostProps<TBody>): Promise<TResponse> {
    return fetch(API_URL + url, {
      method: METHODS.PUT,
      headers: HEADERS[headers],
      cache: "no-store",
      body:
        body instanceof FormData ? body : body ? JSON.stringify(body) : null,
    }).then(async (response) => {
      return await handleResponse(response, () => {
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          return response.json();
        } else {
          return response.text();
        }
      });
    });
  }

  public post<TResponse, TBody = unknown>({
    url,
    body,
    headers = "JSON",
    withApiKey,
  }: PostProps<TBody>): Promise<TResponse> {
    return fetch(`${API_URL}${url}${withApiKey ? "/" + API_KEY : ""}`, {
      method: METHODS.POST,
      headers: HEADERS[headers],
      cache: "reload",
      body: body ? JSON.stringify(body) : null,
    }).then(async (response) => {
      return await handleResponse(response, () => {
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          return response.json();
        } else {
          return response.text();
        }
      });
    });
  }

  public get<TResponse>({
    url,
    params,
  }: {
    url: string;
    params?: Record<string, string>;
  }): Promise<TResponse> {
    const query = new URLSearchParams(params);
    return fetch(`${API_URL}${url}?api_key=${API_KEY}&${query.toString}`, {
      cache: "reload",
    }).then((res) => handleResponse(res, (r) => r.json()));
  }
}
