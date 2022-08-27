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
    numberOfDisplayNameChanges?: number;
    ageGroup?: string;
    headless?: boolean;
    country?: string;
    lastName?: string;
    preferredLanguage?: string;
    links?: any;
    lastDisplayNameChange?: Date;
    canUpdateDisplayName?: boolean;
    tfaEnabled?: boolean;
    emailVerified?: boolean;
    minorVerified?: boolean;
    minorExpected?: boolean;
    minorStatus?: string;
    cabinedModev: boolean;
}

const getFromDisplayName = async (accessToken: string, displayName: string) => {
    const { data } = await request<AccountData>({
        method: 'GET',
        url: `${Endpoints.accountDisplayName}/${displayName}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    });

    return data ?? null;
};

export default getFromDisplayName;
