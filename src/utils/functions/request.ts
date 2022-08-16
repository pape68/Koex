import axios, { AxiosRequestConfig } from 'axios';

interface Result<D> {
    data?: D;
    error?: any;
}

const request = async <D>(
    method?: AxiosRequestConfig['method'],
    url?: AxiosRequestConfig['url'],
    params?: AxiosRequestConfig['params'],
    headers?: AxiosRequestConfig['headers'],
    data: AxiosRequestConfig['data'] = {}
): Promise<Result<D>> => {
    return await axios({
        method,
        url,
        params,
        headers,
        data
    })
        .then(({ data }) => ({ data }))
        .catch((error) => ({
            error: error.response.data ?? { rawError: error }
        }));
};

export default request;
