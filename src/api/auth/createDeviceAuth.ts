import axios, { AxiosError } from 'axios';

import { EpicGamesEndpoints } from '../utils/helpers/constants';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError';

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
            `${EpicGamesEndpoints.oAuthDeviceAuth}/${accountId}/deviceAuth`,
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
        throw new EpicGamesAPIError(error.response?.data as EpicGamesAPIErrorData, err.request, error.response?.status);
    }
};

export default createDeviceAuth;
