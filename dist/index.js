export const asUrl = (url) => url;
export const asMethod = (method) => method.toUpperCase();
export const asStatusCode = (status) => status;
export const asHeaderName = (name) => name;
export const asHeaderValue = (value) => value;
function createTsAxiosInstance() {
    const tsaxiosCore = async (urlOrConfig, config) => {
        let finalConfig;
        if (typeof urlOrConfig === 'string') {
            finalConfig = { ...config, url: urlOrConfig };
        }
        else {
            finalConfig = urlOrConfig;
        }
        const { url, method = asMethod('GET'), params, data, headers, responseType = 'json', } = finalConfig;
        const finalUrl = new URL(url);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                finalUrl.searchParams.append(key, String(value));
            });
        }
        const fetchOptions = {
            method: method,
            headers: headers,
        };
        if (data !== undefined && data !== null) {
            if (typeof data === 'object' &&
                !(data instanceof FormData) &&
                !(data instanceof URLSearchParams) &&
                // @ts-ignore (ReadableStream existe no ambiente Node/Web moderno)
                !(typeof ReadableStream !== 'undefined' && data instanceof ReadableStream)) {
                fetchOptions.body = JSON.stringify(data);
                if (!fetchOptions.headers)
                    fetchOptions.headers = {};
                fetchOptions.headers['Content-Type'] = 'application/json';
            }
            else {
                fetchOptions.body = data;
            }
        }
        const response = await fetch(finalUrl.toString(), fetchOptions);
        let responseData;
        if (responseType === 'stream') {
            responseData = response.body;
        }
        else if (responseType === 'text') {
            responseData = (await response.text());
        }
        else {
            try {
                const text = await response.text();
                responseData = text ? JSON.parse(text) : null;
            }
            catch (e) {
                console.warn('Falha ao parsear JSON, retornando null/texto cru');
                responseData = null;
            }
        }
        return {
            data: responseData,
            status: asStatusCode(response.status),
            statusText: response.statusText,
            headers: response.headers,
            config: finalConfig,
            request: response,
        };
    };
    const instance = tsaxiosCore;
    instance.get = (url, config) => instance({ ...config, url, method: asMethod('GET') });
    instance.delete = (url, config) => instance({ ...config, url, method: asMethod('DELETE') });
    instance.head = (url, config) => instance({ ...config, url, method: asMethod('HEAD') });
    instance.options = (url, config) => instance({ ...config, url, method: asMethod('OPTIONS') });
    instance.post = (url, data, config) => instance({ ...config, url, data, method: asMethod('POST') });
    instance.put = (url, data, config) => instance({ ...config, url, data, method: asMethod('PUT') });
    instance.patch = (url, data, config) => instance({ ...config, url, data, method: asMethod('PATCH') });
    return instance;
}
export const tsaxios = createTsAxiosInstance();
export default tsaxios;
//# sourceMappingURL=index.js.map