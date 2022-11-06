import axios, { AxiosError } from 'axios';

import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError';
import { EpicGamesEndpoints } from '../utils/helpers/constants';
import { PartialFriend } from '../utils/helpers/interfaces';

const getBlocklist = async (accessToken: string, accountId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const { data } = await axios.get<PartialFriend[]>(
            `${EpicGamesEndpoints.friends}/${accountId}/blocklist`,
            config
        );
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(err.request, error.response?.data as EpicGamesAPIErrorData, error.response?.status);
    }
};

export default getBlocklist;
