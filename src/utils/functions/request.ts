import axios, { AxiosRequestHeaders, Method } from 'axios';
import verifyAuthSession from '../../api/auth/verifyAuthSession';

export interface EpicApiErrorData {
    errorCode: string;
    errorMessage: string;
    messageVars: any[];
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

        if (!sessionValid) return Promise.reject('Invalid account credentials.');

        Object.assign(data, {
            headers: {
                Authentication: `bearer ${accessToken}`
            }
        });
    }

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

export default sendEpicAPIRequest;
