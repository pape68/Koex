import axios, { AxiosError } from 'axios';

import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../../api/utils/errors/EpicGamesAPIError';
import { EpicGamesEndpoints } from '../../api/utils/helpers/constants';
import createAuthData, { BearerAuth } from './createAuthData';

export interface AvatarResponse {
    accountId: string;
    namespace: string;
    avatarId: string;
}

const getCharacterAvatar = async (userId: string, authOverride?: BearerAuth) => {
    const auth = authOverride ?? (await createAuthData(userId));

    if (!auth) throw new Error('Failed to create authorization data');

    const config = {
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        },
        params: {
            accountIds: auth.accountId
        }
    };

    try {
        const { data } = await axios.get<AvatarResponse[]>(EpicGamesEndpoints.accountAvatars, config);
        let cosmeticId = 'CID_884_ATHENA_COMMANDO_F_CHONERAMIREZ';

        if (data) cosmeticId = data[0].avatarId.replace('ATHENACHARACTER:', '');

        return `https://fortnite-api.com/images/cosmetics/br/${cosmeticId}/icon.png`;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(error.response?.data as EpicGamesAPIErrorData, err.request, error.response?.status);
    }
};

export default getCharacterAvatar;
