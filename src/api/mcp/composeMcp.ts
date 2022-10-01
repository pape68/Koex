import axios, { AxiosError } from 'axios';

import { BearerAuth } from '../../utils/commands/createAuthData';
import { FortniteProfile, MCPOperation, MCPResponse, ProfileAttributes } from '../../utils/helpers/operationResources';
import { EpicGamesEndpoints } from '../utils/helpers/constants';
import EpicGamesAPIError, { EpicGamesAPIErrorData } from '../utils/errors/EpicGamesAPIError';

const composeMcp = async <T extends ProfileAttributes>(
    auth: BearerAuth,
    profile: keyof typeof FortniteProfile,
    operation: keyof typeof MCPOperation,
    payload = {}
) => {
    const { url, params } = createMcpUrl(auth.accountId, 'client', operation, profile);

    const config = {
        headers: {
            Authorization: `Bearer ${auth.accessToken}`
        },
        params
    };

    try {
        const { data } = await axios.post<MCPResponse<T>>(url, payload, config);
        return data;
    } catch (err: any) {
        const error: AxiosError = err;
        throw new EpicGamesAPIError(error.response?.data as EpicGamesAPIErrorData, err.request, error.response?.status);
    }
};

const createMcpUrl = (
    accountId: string,
    route: string,
    operation: keyof typeof MCPOperation,
    profile: keyof typeof FortniteProfile
) => ({
    url: `${EpicGamesEndpoints.mcp}/${accountId}/${route}/${operation.toString()}`,
    params: { profileId: profile.toString() }
});

export default composeMcp;
