import axios, { AxiosRequestHeaders, Method } from 'axios';

export interface Result<T> {
    data: T | null;
    error: any | null;
}

export interface RequestData {
    method: Method;
    url: string;
    params?: any;
    headers?: AxiosRequestHeaders;
    data?: any;
}

const request = async <T>(data: RequestData): Promise<Result<T>> => {
    return axios
        .request(data)
        .then(({ data }) => ({ data, error: null }))
        .catch((error) => {
            const data = error.response.data ?? error;
            const message: string = data.errorMessage ?? error.message;

            console.error(new Error(message));

            return { data: null, error: data };
        });
};

export default request;
