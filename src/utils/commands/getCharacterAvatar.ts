import { Endpoints } from '../../api/types';
import request from '../functions/request';
import refreshAuthData from './refreshAuthData';

export interface AvatarResponse {
    accountId: string;
    namespace: string;
    avatarId: string;
}

const getCharacterAvatar = async (userId: string) => {
    const user = await refreshAuthData(userId);

    if (!user) return null;

    const { data } = await request<AvatarResponse[]>({
        method: 'GET',
        url: Endpoints.accountAvatars,
        params: { accountIds: user.accountId },
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${user.accessToken}`
        }
    });

    let cosmeticId = 'CID_884_ATHENA_COMMANDO_F_CHONERAMIREZ';

    if (data) cosmeticId = data[0].avatarId.replace('ATHENACHARACTER:', '');

    return `https://fortnite-api.com/images/cosmetics/br/${cosmeticId}/icon.png`;
};

export default getCharacterAvatar;
