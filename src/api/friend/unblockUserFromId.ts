import axios, { AxiosError } from 'axios';

import { EpicGamesEndpoints } from '../utils/helpers/constants';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError';

const unblockUserFromId = async (accessToken: string, accountId: string, userId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        await axios.delete(`${EpicGamesEndpoints.friends}/${accountId}/blocklist/${userId}`, config);
        return true;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(error.response?.data as EpicGamesAPIErrorData, err.request, error.response?.status);
    }
};

export default unblockUserFromId;
