import axios, { AxiosError } from 'axios';

import { EpicGamesEndpoints } from '../utils/helpers/constants';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError';

interface PartyMeta {
    delete: any[];
    revision: number;
    update: any;
}

const sendPartyPatch = async (accessToken: string, accountId: string, partyId: string, body: PartyMeta) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const { data } = await axios.patch(
            `${EpicGamesEndpoints.fortniteParty}/parties/${partyId}/members/${accountId}/meta`,
            body,
            config
        );
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(error.response?.data as EpicGamesAPIErrorData, err.request, error.response?.status);
    }
};

export default sendPartyPatch;
