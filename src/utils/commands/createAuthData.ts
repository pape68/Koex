import createOAuthData from '../../api/auth/createOAuthData';
import { fortniteGameClient } from '../../constants';
import { getAllAccounts } from '../functions/database';

export interface BearerAuth {
    accountId: string;
    accessToken: string;
    displayName: string;
}

const createAuthData = async (userId: string, accountId?: string): Promise<Required<BearerAuth> | null> => {
    const accounts = await getAllAccounts(userId);

    if (!accounts) return null;

    const auth = accounts.auths.find((a) => a.accountId === (accountId ?? accounts.active_account_id));

    if (!auth) return null;

    const oAuthData = await createOAuthData(fortniteGameClient._name, {
        grant_type: 'device_auth',
        account_id: auth.accountId,
        device_id: auth.deviceId,
        secret: auth.secret
    });

    return {
        accountId: oAuthData.account_id,
        accessToken: oAuthData.access_token,
        displayName: oAuthData.displayName
    };
};

export default createAuthData;
