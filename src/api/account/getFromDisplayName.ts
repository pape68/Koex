import request from '../../utils/functions/request';
import { Endpoints } from '../types';

interface AccountData {
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

const getFromdisplayName = async (accessToken: string, displayName: string) => {
    const { data } = await request<AccountData>({
        method: 'GET',
        url: `${Endpoints.accountdisplayName}/${displayName}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    });

    return data ?? null;
};

export default getFromdisplayName;
