import axios, { AxiosError } from 'axios';

import { Endpoints, EpicGamesAPIErrorData } from '../types';
import EpicGamesAPIError from '../../utils/errors/EpicGamesAPIError';

const removeFriendFromId = async (accessToken: string, accountId: string, friendId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        await axios.delete(`${Endpoints.addFriend}/${accountId}/friends/${friendId}`, config);
        return true;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(
            error.response?.data as EpicGamesAPIErrorData,
            err.request,
            error.response?.status!
        );
    }
};

export default removeFriendFromId;
