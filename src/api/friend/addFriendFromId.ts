import axios, { AxiosError } from 'axios';
import EpicGamesAPIError from '../../utils/errors/EpicGamesAPIError';

import { Endpoints, EpicApiErrorData } from '../types';

const addFriendFromId = async (accessToken: string, accountId: string, friendId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        await axios.post(`${Endpoints.addFriend}/${accountId}/friends/${friendId}`, {}, config);
        return true;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(error.response?.data as EpicApiErrorData, err.request, error.response?.status!);
    }
};

export default addFriendFromId;
