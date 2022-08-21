import { AuthData } from '../../types/supabase';
import request from '../../utils/functions/request';
import { FortniteProfile, MCPOperation } from '../types';
import createMCPUrl from './createMCPUrl';

export interface MCPResponse {
    profileRevision: number;
    profileId: string;
    profileChangesBaseRevision: number;
    profileChanges: any[];
}

const createOperationRequest = async (
    auth: AuthData,
    profile: keyof typeof FortniteProfile,
    operation: keyof typeof MCPOperation,
    payload?: any
) => {
    const { url, params } = createMCPUrl(auth.accountId, 'client', operation, profile);

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.accessToken}`
    };

    return await request<MCPResponse>({
        method: 'POST',
        url,
        params,
        headers,
        data: payload ?? {}
    });
};

export default createOperationRequest;
