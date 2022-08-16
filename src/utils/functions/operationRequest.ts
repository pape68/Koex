import { UserData } from '../../typings';
import { FortniteProfile, MCPOperation } from '../constants/enums';
import createMCPURL from './createMCPUrl';
import request from './request';

const operationRequest = async <D>(
    user: UserData,
    operation: keyof typeof MCPOperation,
    profile: keyof typeof FortniteProfile,
    data?: any
) => {
    const { url, params } = createMCPURL(user.account_id, 'client', operation, profile);

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `bearer ${user.access_token}`
    };

    return await request<D>('POST', url, params, headers, data);
};

export default operationRequest;
