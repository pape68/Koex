import axios, { AxiosError } from 'axios';
import qs from 'qs';

import EpicGamesAPIError from '../../utils/errors/EpicGamesAPIError';
import { AuthClients, Endpoints, EpicGamesAPIErrorData, GrantData } from '../types';

interface OAuthDataResponse {
    access_token: string;
    expires_in: number;
    expires_at: string;
    token_type: string;
    refresh_token: string;
    refresh_expires: number;
    refresh_expires_at: string;
    account_id: string;
    client_id: string;
    internal_client: boolean;
    client_service: string;
    scope: any[];
    displayName: string;
    app: string;
    in_app_id: string;
    device_id?: string;
}

const createOAuthData = async (client: keyof typeof AuthClients, grant: GrantData) => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${AuthClients[client]}`
        }
    };

    try {
        const { data } = await axios.post<OAuthDataResponse>(Endpoints.oAuthTokenCreate, qs.stringify(grant), config);
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(
            error.response?.data as EpicGamesAPIErrorData,
            err.request,
            error.response?.status!
        );
    }
};

export default createOAuthData;
