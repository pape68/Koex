import createOAuthData from '../../api/auth/createOAuthData';
import { FORTNITE_CLIENT } from '../../constants';
import { Accounts, SlotName } from '../../types/supabase';
import supabase from '../functions/supabase';

const refreshAuthData = async (userId: string) => {
    const { data: account } = await supabase
        .from<Accounts>('accounts_test')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (!account) return null;

    let auth = account[('slot_' + account.active_slot) as SlotName];

    if (!auth) return null;

    const oAuthData = await createOAuthData(FORTNITE_CLIENT.client, {
        grant_type: 'device_auth',
        account_id: auth.accountId,
        device_id: auth.deviceId,
        secret: auth.secret
    });

    if (!oAuthData) return null;

    auth = {
        ...auth,
        accessToken: oAuthData.access_token,
        displayName: oAuthData.displayName
    };

    await supabase.from<Accounts>('accounts').upsert({
        user_id: userId,
        ['slot_' + account.active_slot]: auth
    });

    return auth;
};

export default refreshAuthData;
