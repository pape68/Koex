import qs from 'qs';

import { UserData } from '../../typings/supabase';
import sendEpicAPIRequest from '../../utils/functions/request';
import { AuthClients, Endpoints, GrantData } from '../types';

const createOAuthData = async (client: keyof typeof AuthClients, grant: GrantData) => {
    const { data } = await sendEpicAPIRequest<UserData>({
        method: 'POST',
        url: Endpoints.oAuthTokenCreate,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${AuthClients[client]}`
        },
        data: qs.stringify(grant)
    });

    return data;
};

export default createOAuthData;
