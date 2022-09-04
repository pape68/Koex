import { AuthData } from '../../types/supabase';
import request from '../../utils/functions/request';
import { FortniteProfile, MCPOperation } from '../types';
import createMCPUrl from './createMCPUrl';

export interface MCPResponse<T = any> {
    profileRevision: number;
    profileId: string;
    profileChangesBaseRevision: number;
    profileChanges: ProfileChange<T>[];
    profileCommandRevision: number;
    serverTime: Date;
    responseVersion: number;
}

export interface ProfileChange<T> {
    changeType: string;
    profile: Profile<T>;
}

export interface Profile<T> {
    _id: string;
    created: string;
    updated: string;
    rvn: number;
    wipeNumber: number;
    accountId: string;
    profileId: string;
    version: string;
    items: any;
    stats: Stats<T>;
}

export interface Stats<T> {
    attributes: T;
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
