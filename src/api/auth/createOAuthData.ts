import qs from 'qs';

import { UserData } from '../../typings/supabase';
import request from '../../utils/functions/request';
import { AuthClients, Endpoints } from '../types';

enum GrantType {
    'authorization_code',
    'client_credentials',
    'device_auth',
    'device_code',
    'exchange_code',
    'external_auth',
    'password',
    'refresh_token',
    'token_to_token'
}

interface GrantData {
    grant_type: keyof typeof GrantType;
    [key: string]: any;
}

const createOAuthData = async (client: keyof typeof AuthClients, grant: GrantData) => {
    const { data } = await request<UserData>({
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
