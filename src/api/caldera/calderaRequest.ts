import axios, { AxiosError } from 'axios';
import EpicGamesAPIError from '../../utils/errors/EpicGamesAPIError';
import { EpicApiErrorData } from '../../utils/functions/request';
import { Endpoints } from '../types';

interface CalderaResponse {
    jwt: string;
    provider: 'EasyAntiCheat' | 'BattlEye';
}

const calderaRequest = async (accountId: string, exchangeCode: string) => {
    const body = {
        account_id: accountId,
        exchange_code: exchangeCode,
        test_mode: false,
        epic_app: 'fortntie',
        nvidia: false
    };

    try {
        const { data } = await axios.post<CalderaResponse>(Endpoints.caldera, body);
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(error.response?.data as EpicApiErrorData, err.request, error.response?.status!);
    }
};

export default calderaRequest;
