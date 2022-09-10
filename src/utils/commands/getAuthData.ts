import { Accounts, SlotName } from '../../typings/supabase';
import supabase from '../functions/supabase';

const getAuthData = async (userId: string) => {
    const { data: account } = await supabase
        .from<Accounts>('accounts_test')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (!account) return null;

    return account[('slot_' + account.active_slot) as SlotName];
};

export default getAuthData;
