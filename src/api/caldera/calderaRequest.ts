import sendEpicAPIRequest from '../../utils/functions/request';
import { Endpoints } from '../types';

interface CalderaResponse {
    jwt: string;
    provider: 'EasyAntiCheat' | 'BattlEye';
}

const calderaRequest = async (accountId: string, exchangeCode: string) => {
    return await sendEpicAPIRequest<CalderaResponse>({
        method: 'POST',
        url: Endpoints.caldera,
        data: {
            account_id: accountId,
            exchange_code: exchangeCode,
            test_mode: false,
            epic_app: 'fortntie',
            nvidia: false
        }
    });
};

export default calderaRequest;
