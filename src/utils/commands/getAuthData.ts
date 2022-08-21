import { Accounts, SlotName } from '../../types/supabase';
import supabase from '../functions/supabase';

const getAuthData = async (userId: string) => {
    const { data: account } = await supabase
        .from<Accounts>('accounts_test')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (!account) return null;

    const auth = account[('slot_' + account.active_slot) as SlotName];

    return auth;
};

export default getAuthData;
