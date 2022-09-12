import { UserData } from '../../typings/supabase';
import request from '../../utils/functions/request';
import { Endpoints } from '../types';

const verifyAuthSession = async (accessToken: string) => {
    const { data } = await request<UserData>({
        method: 'GET',
        url: Endpoints.oAuthTokenVerify,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    return data;
};

export default verifyAuthSession;
