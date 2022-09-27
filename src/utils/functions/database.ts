import util from 'node:util';

import errorMessages from '../helpers/errorMessages';
import { Accounts, DupeWhitelist, SlotData } from './../../typings/supabase.d';
import supabase from './supabase';

export const getAllAccounts = async (userId: string, cb?: (msg: string) => void) => {
    const { data, error } = await supabase
        .from<Accounts>('accounts_test')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (error) {
        throw new Error(errorMessages.databaseReadError);
    }

    if (!data) {
        if (cb) await util.promisify(cb)('You are not logged in. Please log in and try again.');
        return null;
    }

    return Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null)) as Accounts;
};

export const getAllAutoDailyUsers = async () => {
    const { data, error } = await supabase.from<Accounts>('auto_daily').select('*');

    if (error) {
        throw new Error(errorMessages.databaseReadError);
    }

    return data;
};

export const getAutoDailyEnabled = async (userId: string) => {
    const { data, error } = await supabase
        .from<Accounts>('auto_daily')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (error) {
        throw new Error(errorMessages.databaseReadError);
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
        throw new Error(errorMessages.databaseReadError);
    }

    return !!data;
};

export const saveAutoDailyUser = async (userId: string) => {
    const { data, error } = await supabase.from<Accounts>('auto_daily').upsert({ user_id: userId }).single();

    if (error) {
        throw new Error(errorMessages.databaseReadError);
    }

    return data;
};

export const removeAutoDailyUser = async (userId: string) => {
    const { data, error } = await supabase.from<Accounts>('auto_daily').delete().match({ user_id: userId }).single();

    if (error) {
        throw new Error(errorMessages.databaseReadError);
    }

    return data;
};

export const initializeAccounts = async (userId: string) => {
    const { data, error } = await supabase.from<Accounts>('accounts_test').upsert({ user_id: userId }).single();

    if (error) {
        throw new Error(errorMessages.databaseWriteError);
    }

    return data;
};

export const saveAccount = async (userId: string, slotIdx: number, account: Partial<SlotData>) => {
    const accounts = await getAllAccounts(userId);

    const { data, error } = await supabase
        .from<Accounts>('accounts_test')
        .upsert({
            user_id: userId,
            ...accounts,
            ['slot_' + slotIdx]: account,
            active_slot: slotIdx
        })
        .single();

    if (error) {
        throw new Error(errorMessages.databaseWriteError);
    }

    return data;
};

export const deleteAccount = async (userId: string, slotIdx: number) => {
    const { data, error } = await supabase
        .from<Accounts>('accounts_test')
        .upsert({
            user_id: userId,
            ['slot_' + slotIdx]: null,
            active_slot: slotIdx
        })
        .single();

    if (error) {
        throw new Error(errorMessages.databaseWriteError);
    }

    return data;
};
