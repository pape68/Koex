import sendEpicAPIRequest from '../../utils/functions/request';
import { Endpoints } from '../types';

interface DeviceAuthResponse {
    accountId: string;
    deviceId: string;
    secret: string;
}

const createDeviceAuth = async (accessToken: string, accountId: string) => {
    const { data } = await sendEpicAPIRequest<DeviceAuthResponse>({
        method: 'POST',
        url: `${Endpoints.oAuthDeviceAuth}/${accountId}/deviceAuth`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    });

    return data
        ? {
              accountId: data.accountId,
              deviceId: data.deviceId,
              secret: data.secret
          }
        : null;
};

export default createDeviceAuth;
