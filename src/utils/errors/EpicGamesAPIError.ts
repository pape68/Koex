import { AxiosRequestConfig } from 'axios';
import { EpicApiErrorData } from '../functions/request';

class EpicGamesAPIError extends Error {
    public method: string;
    public url: string;
    public code: string;
    public messageVars: string[];
    public request?: any;
    public status: number;

    constructor(error: EpicApiErrorData, request: AxiosRequestConfig, status: number) {
        super();
        this.name = 'EpicGamesAPIError';
        this.message = error.errorMessage;

        this.method = request.method?.toUpperCase() ?? 'GET';
        this.url = request.url ?? '';
        this.code = error.errorCode;
        this.messageVars = error.messageVars ?? [];
        this.request = request;
        this.status = status;
    }
}

export default EpicGamesAPIError;
