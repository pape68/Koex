import axios, { AxiosError } from 'axios';
import EpicGamesAPIError from '../../utils/errors/EpicGamesAPIError';

import { Endpoints, EpicApiErrorData } from '../types';

interface ExchangeCodeResponse {
    expiresInSeconds: number;
    code: string;
    creatingClientId: string;
}

const createExchangeCode = async (accessToken: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const { data } = await axios.post<ExchangeCodeResponse>(Endpoints.oAuthTokenExchange, {}, config);
        return data.code;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(error.response?.data as EpicApiErrorData, err.request, error.response?.status!);
    }
};

export default createExchangeCode;
