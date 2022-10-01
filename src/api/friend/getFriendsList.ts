import axios, { AxiosError } from 'axios';

import { EpicGamesEndpoints } from '../utils/helpers/constants';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError';

interface PendingFriendData {
    accountId: string;
    mutual: number;
    favorite: boolean;
    created: Date;
}

interface FriendData extends PendingFriendData {
    groups: any[];
    alias: string;
    note: string;
}

interface FriendSummaryResponse {
    friends: FriendData[];
    incoming: PendingFriendData[];
    outgoing: PendingFriendData[];
    blocklist: { accountId: string }[];
    settings: {
        acceptInvites: 'string';
        mutualPrivacy: string;
    };
    limitsReached: {
        incoming: boolean;
        outgoing: boolean;
        accepted: boolean;
    };
}

const getFriendSummary = async (accessToken: string, accountId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            displayNames: true
        }
    };

    try {
        const { data } = await axios.get<FriendSummaryResponse>(
            `${EpicGamesEndpoints.friends}/${accountId}/summary`,
            config
        );
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(error.response?.data as EpicGamesAPIErrorData, err.request, error.response?.status);
    }
};

export default getFriendSummary;
