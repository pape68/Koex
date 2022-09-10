import { Endpoints, FortniteProfile, MCPOperation } from '../types';

const createMcpUrl = (
    accountId: string,
    route: string,
    operation: keyof typeof MCPOperation,
    profile: keyof typeof FortniteProfile
) => ({
    url: `${Endpoints.mcp}/${accountId}/${route}/${operation.toString()}`,
    params: { profileId: profile.toString() }
});

export default createMcpUrl;
