import { SlotData } from '../../typings/supabase';
import sendEpicAPIRequest from '../../utils/functions/request';
import { FortniteProfile, MCPOperation, McpResponse, ProfileAttributes } from '../../utils/helpers/operationResources';
import createMcpUrl from './createMcpUrl';

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

export default composeMcp;
