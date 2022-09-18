import sendEpicAPIRequest from '../../utils/functions/request';
import { AccountData, Endpoints } from '../types';

const getFromDisplayName = async (accessToken: string, displayName: string) => {
    const { data } = await sendEpicAPIRequest<AccountData>({
        method: 'GET',
        url: `${Endpoints.accountdisplayName}/${displayName}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    });

    return data ?? null;
};

export default getFromDisplayName;
