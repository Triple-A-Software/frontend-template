import type { API } from "~/types/api";

export async function fetchJson<T>(...args: Parameters<typeof fetch>): Promise<T> {
    const response = await fetch(...args);
    const data = (await response.json()) as T;
    return data;
}

type Body<T> = T extends { body: infer TBody } ? TBody : never;
type Query<T> = T extends { query: infer TQuery } ? TQuery : never;
type Options<T, TMethod> = T extends { body: infer TBody; query: infer TQuery }
    ? { body: TBody; query: TQuery; method: TMethod }
    : T extends { body: infer TBody }
      ? { body: TBody; method: TMethod }
      : T extends { query: infer TQuery }
        ? { query: TQuery; method: TMethod }
        : { method: TMethod };

export async function fetchApi<
    TPath extends keyof API,
    TMethod extends keyof API[TPath],
    TResponse extends Extract<API[TPath][TMethod], { response: unknown }>["response"],
    TBody extends Body<API[TPath][TMethod]>,
    TQuery extends Query<API[TPath][TMethod]>,
>(path: TPath, options: Options<API[TPath][TMethod], TMethod>): Promise<TResponse> {
    const _options = options as { body?: TBody; query?: TQuery; method?: TMethod };
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(_options.query ?? {})) {
        if (Array.isArray(value)) {
            for (const v of value) {
                query.append(`${key}[]`, v);
            }
        } else if (value) {
            query.set(key, String(value));
        }
    }
    let _path = path as string;
    if (_options.query) {
        _path += `?${query.toString()}`;
    }
    let response: Response | null = null;
    if (_options.body instanceof FormData) {
        response = await fetch(_path, {
            method: options.method as string,
            body: _options.body,
        });
    } else {
        response = await fetch(_path, {
            method: options.method as string,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(_options.body),
        });
    }
    const json = await response.json();
    return json as TResponse;
}
