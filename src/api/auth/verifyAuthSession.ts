import { UserData } from '../../typings/supabase';
import sendEpicAPIRequest from '../../utils/functions/request';
import { Endpoints } from '../types';

const verifyAuthSession = async (accessToken: string) => {
    const { error } = await sendEpicAPIRequest<UserData>({
        method: 'GET',
        url: Endpoints.oAuthTokenVerify,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    if (error?.errorCode === 'errors.com.epicgames.common.oauth.invalid_token') return false;
    else return true;
};

export default verifyAuthSession;
