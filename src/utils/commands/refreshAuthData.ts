import createOAuthData from '../../api/auth/createOAuthData';
import { fortniteClient } from '../../constants';
import { Accounts, SlotName } from '../../typings/supabase';
import supabase from '../functions/supabase';
import util from 'node:util';
import { getAllAccounts } from '../functions/database';

const refreshAuthData = async (userId: string, slotIdx?: number, cb?: (msg: string) => void) => {
    const accounts = await getAllAccounts(userId);

    if (!accounts) {
        if (cb) await util.promisify(cb)('You are not logged in. Please log in and try again.');
        return null;
    }

    const oldAuth = accounts[('slot_' + (slotIdx ?? accounts.active_slot)) as SlotName];

    if (!oldAuth) {
        if (cb) await util.promisify(cb)('No data on your active account. Switch accounts or login again.');
        return null;
    }

    const newAuth = await createOAuthData(fortniteClient.name, {
        grant_type: 'device_auth',
        account_id: oldAuth.accountId,
        device_id: oldAuth.deviceId,
        secret: oldAuth.secret
    });

    const auth = {
        ...oldAuth,
        accessToken: newAuth.access_token,
        displayName: newAuth.displayName
    };

    await supabase.from<Accounts>('accounts').upsert({
        user_id: userId,
        ['slot_' + accounts.active_slot]: auth
    });

    return auth;
};

export default refreshAuthData;
