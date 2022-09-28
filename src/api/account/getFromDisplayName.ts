import axios, { AxiosError } from 'axios';

import EpicGamesAPIError from '../../utils/errors/EpicGamesAPIError';
import { Endpoints, EpicGamesAPIErrorData } from '../types';

export interface AccountData {
    id: string;
    displayName: string;
    externalAuths?: any;
    name?: string;
    email?: string;
    failedLoginAttempts?: number;
    lastLogin?: Date;
    numberOfdisplayNameChanges?: number;
    ageGroup?: string;
    headless?: boolean;
    country?: string;
    lastName?: string;
    preferredLanguage?: string;
    links?: any;
    lastdisplayNameChange?: Date;
    canUpdatedisplayName?: boolean;
    tfaEnabled?: boolean;
    emailVerified?: boolean;
    minorVerified?: boolean;
    minorExpected?: boolean;
    minorStatus?: string;
    cabinedModev: boolean;
}

const getFromDisplayName = async (accessToken: string, displayName: string) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const { data } = await axios.get<AccountData>(`${Endpoints.accountdisplayName}/${displayName}`, config);
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(error.response?.data as EpicGamesAPIErrorData, err.request, error.response?.status);
    }
};

export default getFromDisplayName;
