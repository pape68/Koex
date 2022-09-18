import sendEpicAPIRequest from '../../utils/functions/request';
import { Endpoints } from '../types';

const addFriendFromId = async (accessToken: string, accountId: string, friendId: string) => {
    const { error } = await sendEpicAPIRequest<any>({
        method: 'POST',
        url: `${Endpoints.addFriend}/${accountId}/friends/${friendId}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    });

    return error ?? null;
};

export default addFriendFromId;
