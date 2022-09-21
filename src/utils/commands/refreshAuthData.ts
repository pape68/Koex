import createOAuthData from '../../api/auth/createOAuthData';
import { fortniteClient } from '../../constants';
import { Accounts, SlotName } from '../../typings/supabase';
import supabase from '../functions/supabase';

const refreshAuthData = async (userId: string, slotIdx?: number) => {
    const { data: account } = await supabase
        .from<Accounts>('accounts_test')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (!account) return null;

    const oldAuth = account[('slot_' + (slotIdx ?? account.active_slot)) as SlotName];

    if (!oldAuth) return null;

    const newAuth = await createOAuthData(fortniteClient.name, {
        grant_type: 'device_auth',
        account_id: oldAuth.accountId,
        device_id: oldAuth.deviceId,
        secret: oldAuth.secret
    });

    if (!newAuth) return null;

    const auth = {
        ...oldAuth,
        accessToken: newAuth.access_token,
        displayName: newAuth.displayName
    };

    await supabase.from<Accounts>('accounts').upsert({
        user_id: userId,
        ['slot_' + account.active_slot]: auth
    });

    return auth;
};

export default refreshAuthData;
