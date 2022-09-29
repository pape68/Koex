import { Accounts, AccountAuth, AutoDaily, DupeWhitelist } from './../../typings/supabase.d';
import supabase from './supabase';

export const getAllAccounts = async (userId: string) => {
    const { data, error } = await supabase
        .from<Accounts>('accounts')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getAllAuths = async (userId: string) => {
    const { data, error } = await supabase
        .from<Accounts>('accounts')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data ? data.auths : [];
};

export const getAllAutoDailyUsers = async () => {
    const { data, error } = await supabase.from<AutoDaily>('auto_daily').select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getAutoDailyEnabled = async (userId: string) => {
    const { data, error } = await supabase
        .from<AutoDaily>('auto_daily')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return !!data;
};

export const getWhitelistedUser = async (userId: string) => {
    const { data, error } = await supabase
        .from<DupeWhitelist>('dupe_whitelist')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return !!data;
};

export const removeAutoDailyUser = async (userId: string) => {
    const { data, error } = await supabase.from<AutoDaily>('auto_daily').delete().match({ user_id: userId }).single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const removeWhitelistedUser = async (userId: string) => {
    const { data, error } = await supabase
        .from<DupeWhitelist>('dupe_whitelist')
        .delete()
        .match({ user_id: userId })
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const saveAccount = async (userId: string, auth: AccountAuth) => {
    const accounts = await getAllAccounts(userId);

    const auths: AccountAuth[] = accounts?.auths.length ? accounts.auths : [];
    auths.push(auth);

    const { data, error } = await supabase
        .from<Accounts>('accounts')
        .upsert({ user_id: userId, auths, active_account_id: auth.accountId })
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const setAccounts = async (userId: string, auths?: AccountAuth[], active_account_id?: string | null) => {
    const { data, error } = await supabase
        .from<Accounts>('accounts')
        .upsert({ user_id: userId, auths, active_account_id })
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data.auths;
};

export const saveAutoDailyUser = async (userId: string) => {
    const { data, error } = await supabase.from<AutoDaily>('auto_daily').upsert({ user_id: userId }).single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const saveWhitelistedUser = async (userId: string) => {
    const { data, error } = await supabase.from<DupeWhitelist>('dupe_whitelist').upsert({ user_id: userId }).single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};
