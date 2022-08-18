import { UserData } from '../../typings';
import { Endpoints } from '../constants/classes';
import { AvatarResponse } from '../constants/interfaces';
import getUserData from './getUserData';
import request from './request';

const getAvatar = async (userId: string) => {
    const endpoints = new Endpoints();

    const user: UserData = await getUserData(userId);

    const params = {
        accountIds: user.account_id
    };

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `bearer ${user.access_token}`
    };

    const { data } = await request<AvatarResponse[]>('GET', endpoints.accountAvatars, params, headers);

    let cosmeticId = 'CID_884_ATHENA_COMMANDO_F_CHONERAMIREZ';

    if (data) cosmeticId = data[0].avatarId.replace('ATHENACHARACTER:', '');

    return `https://fortnite-api.com/images/cosmetics/br/${cosmeticId}/icon.png`;
};

export default getAvatar;
