import { Accounts, Auth, AutoDaily, DupeWhitelist } from './../../typings/supabase.d';
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

    if (!data) {
        throw new Error('Sorry your account data was not found');
    }

    return data;
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

export const saveAuth = async (userId: string, auth: Auth) => {
    const accounts = await getAllAccounts(userId);

    const { data, error } = await supabase
        .from<Accounts>('accounts')
        .upsert({
            user_id: userId,
            auths: [...accounts!.auths, auth],
            active_account_id: auth.accountId
        })
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const setAuths = async (userId: string, auths?: Auth[]) => {
    const accounts = await getAllAccounts(userId);

    const { data, error } = await supabase
        .from<Accounts>('accounts')
        .upsert({ user_id: userId, auths: auths ? accounts ? [...accounts.auths, ...auths] : auths : [] })
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
