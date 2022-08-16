import { Endpoints } from "../constants/classes";
import { FortniteProfile, MCPOperation } from "../constants/enums";

const createMCPURL = (
    accountId: string,
    route: string,
    operation: keyof typeof MCPOperation,
    profile: keyof typeof FortniteProfile
) => ({
    url: `${new Endpoints().mcp}/${accountId}/${route}/${operation.toString()}`,
    params: { profileId: profile.toString() }
});

export default createMCPURL;