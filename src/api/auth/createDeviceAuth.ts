import axios, { AxiosError } from 'axios';

import EpicGamesAPIError from '../../utils/errors/EpicGamesAPIError';
import { Endpoints, EpicGamesAPIErrorData } from '../types';

interface DeviceAuthResponse {
    accountId: string;
    deviceId: string;
    secret: string;
}

const createDeviceAuth = async (accessToken: string, accountId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const { data } = await axios.post<DeviceAuthResponse>(
            `${Endpoints.oAuthDeviceAuth}/${accountId}/deviceAuth`,
            {},
            config
        );
        return {
            accountId: data.accountId,
            deviceId: data.deviceId,
            secret: data.secret
        };
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(
            error.response?.data as EpicGamesAPIErrorData,
            err.request,
            error.response?.status!
        );
    }
};

export default createDeviceAuth;
