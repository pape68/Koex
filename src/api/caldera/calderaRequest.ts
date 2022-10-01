import axios, { AxiosError } from 'axios';

import { EpicGamesEndpoints } from '../utils/helpers/constants';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError';

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
        const { data } = await axios.post<CalderaResponse>(EpicGamesEndpoints.caldera, body);
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(error.response?.data as EpicGamesAPIErrorData, err.request, error.response?.status);
    }
};

export default calderaRequest;
