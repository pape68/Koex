import axios, { AxiosError, AxiosRequestHeaders, Method } from 'axios';
import verifyAuthSession from '../../api/auth/verifyAuthSession';

export interface EpicApiErrorData {
    errorCode: string;
    errorMessage: string;
    messageVars: string[];
    numericErrorCode: number;
    originatingService: string;
    intent: string;
    message: string;
    errorStatus?: number;
}

export interface Result<T> {
    data: T | null;
    error: EpicApiErrorData | null;
}

export interface RequestData {
    method: Method;
    url: string;
    params?: any;
    headers?: AxiosRequestHeaders;
    data?: any;
}

const sendEpicAPIRequest = async <T>(data: RequestData, accessToken?: string): Promise<Result<T>> => {
    if (accessToken) {
        const sessionValid = await verifyAuthSession(accessToken);

        if (!sessionValid) return Promise.reject('The bearer token supplied was not found. Session invalid');

        Object.assign(data, {
            headers: {
                Authentication: `bearer ${accessToken}`
            }
        });
    }

    try {
        const res = await axios.request(data);
        return { data: res.data, error: null };
    } catch (error) {
        const data = (error as AxiosError).response?.data as EpicApiErrorData | undefined;
        const message = data?.errorMessage;

        if (!data) return { data: null, error: data ?? null };

        console.error(message);

        return { data: null, error: data };
    }
};

export default sendEpicAPIRequest;
