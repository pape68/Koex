import axios, { AxiosError } from 'axios';
import EpicGamesAPIError from '../../utils/errors/EpicGamesAPIError';
import { Endpoints, EpicApiErrorData } from '../types';

const verifyAuthSession = async (accessToken: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    try {
        await axios.get(Endpoints.oAuthTokenVerify, config);
        return true;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(error.response?.data as EpicApiErrorData, err.request, error.response?.status!);
    }
};

export default verifyAuthSession;
