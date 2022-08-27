import request from '../../utils/functions/request';
import { Endpoints } from '../types';

const deleteFriendFromId = async (accessToken: string, accountId: string, friendId: string) => {
    const { error } = await request<any>({
        method: 'DELETE',
        url: `${Endpoints.addFriend}/${accountId}/friends/${friendId}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    });

    return error ?? null;
};

export default deleteFriendFromId;
