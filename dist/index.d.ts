export type Brand<T, K extends string> = T & {
    __brand: K;
};
export type Url = Brand<string, 'Url'>;
export type HttpMethod = Brand<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS', 'HttpMethod'>;
export type StatusCode = Brand<number, 'StatusCode'>;
export type HeaderName = Brand<string, 'HeaderName'>;
export type HeaderValue = Brand<string, 'HeaderValue'>;
export declare const asUrl: (url: string) => Url;
export declare const asMethod: (method: string) => HttpMethod;
export declare const asStatusCode: (status: number) => StatusCode;
export declare const asHeaderName: (name: string) => HeaderName;
export declare const asHeaderValue: (value: string) => HeaderValue;
export type TsAxiosHeaders = Record<HeaderName, HeaderValue> | Record<string, string>;
export interface TsAxiosRequestConfig<D = any> {
    url: Url;
    method?: HttpMethod;
    headers?: TsAxiosHeaders;
    data?: D;
    params?: Record<string, string | number | boolean>;
    responseType?: 'json' | 'text' | 'stream';
}
export interface TsAxiosResponse<T = any, D = any> {
    data: T;
    status: StatusCode;
    statusText: string;
    headers: Headers;
    config: TsAxiosRequestConfig<D>;
    request: Response;
}
export interface TsAxiosInstance {
    <T = any, D = any>(config: TsAxiosRequestConfig<D>): Promise<TsAxiosResponse<T, D>>;
    <T = any, D = any>(url: Url, config?: Omit<TsAxiosRequestConfig<D>, 'url'>): Promise<TsAxiosResponse<T, D>>;
    get<T = any, D = any>(url: Url, config?: Omit<TsAxiosRequestConfig<D>, 'url' | 'method'>): Promise<TsAxiosResponse<T, D>>;
    delete<T = any, D = any>(url: Url, config?: Omit<TsAxiosRequestConfig<D>, 'url' | 'method'>): Promise<TsAxiosResponse<T, D>>;
    head<T = any, D = any>(url: Url, config?: Omit<TsAxiosRequestConfig<D>, 'url' | 'method'>): Promise<TsAxiosResponse<T, D>>;
    options<T = any, D = any>(url: Url, config?: Omit<TsAxiosRequestConfig<D>, 'url' | 'method'>): Promise<TsAxiosResponse<T, D>>;
    post<T = any, D = any>(url: Url, data?: D, config?: Omit<TsAxiosRequestConfig<D>, 'url' | 'method' | 'data'>): Promise<TsAxiosResponse<T, D>>;
    put<T = any, D = any>(url: Url, data?: D, config?: Omit<TsAxiosRequestConfig<D>, 'url' | 'method' | 'data'>): Promise<TsAxiosResponse<T, D>>;
    patch<T = any, D = any>(url: Url, data?: D, config?: Omit<TsAxiosRequestConfig<D>, 'url' | 'method' | 'data'>): Promise<TsAxiosResponse<T, D>>;
}
export declare const tsaxios: TsAxiosInstance;
export default tsaxios;
//# sourceMappingURL=index.d.ts.map