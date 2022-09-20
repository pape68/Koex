import { SlotData } from '../../typings/supabase';
import sendEpicAPIRequest from '../../utils/functions/request';
import { FortniteProfile, MCPOperation, McpResponse, ProfileAttributes } from '../../utils/helpers/operationResources';
import { Endpoints } from '../types';

const composeMcp = async <T extends ProfileAttributes>(
    auth: SlotData,
    profile: keyof typeof FortniteProfile,
    operation: keyof typeof MCPOperation,
    payload?: any
) => {
    const { url, params } = createMcpUrl(auth.accountId, 'client', operation, profile);

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.accessToken}`
    };

    return await sendEpicAPIRequest<McpResponse<T>>({
        method: 'POST',
        url,
        params,
        headers,
        data: payload ?? {}
    });
};

const createMcpUrl = (
    accountId: string,
    route: string,
    operation: keyof typeof MCPOperation,
    profile: keyof typeof FortniteProfile
) => ({
    url: `${Endpoints.mcp}/${accountId}/${route}/${operation.toString()}`,
    params: { profileId: profile.toString() }
});

export default composeMcp;
