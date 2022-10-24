import axios, { AxiosError } from 'axios';

import { EpicGamesEndpoints } from '../utils/helpers/constants';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError';

const deletePartyMember = async (accessToken: string, accountId: string, partyId: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const { data } = await axios.delete(
            `${EpicGamesEndpoints.fortniteParty}/parties/${partyId}/members/${accountId}`,
            config
        );
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(error.response?.data as EpicGamesAPIErrorData, err.request, error.response?.status);
    }
};

export default deletePartyMember;
