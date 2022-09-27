import axios, { AxiosError } from 'axios';
import EpicGamesAPIError from '../../utils/errors/EpicGamesAPIError';

import { Endpoints, EpicApiErrorData } from '../types';

interface BlocklistEntry {
    accountId: string;
}

const getBlocklist = async (accessToken: string, accountId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            displayNames: true
        }
    };

    try {
        const { data } = await axios.get<BlocklistEntry[]>(`${Endpoints.friends}/${accountId}/blocklist`, config);
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(error.response?.data as EpicApiErrorData, err.request, error.response?.status!);
    }
};

export default getBlocklist;
