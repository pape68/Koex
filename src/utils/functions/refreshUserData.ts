import { ChatInputCommandInteraction } from 'discord.js';
import qs from 'qs';

import { FORTNITE_BASIC_AUTH } from '../../constants';
import { ComponentInteraction } from '../../interfaces/Component';
import { UserData } from '../../typings';
import { Accounts, DeviceAuth } from '../../typings/supabase';
import { Endpoints } from '../constants/classes';
import createEmbed from './createEmbed';
import getUserData from './getUserData';
import request from './request';
import supabase from './supabase';

const refreshUserData = async (userId: string, interaction?: ChatInputCommandInteraction | ComponentInteraction, deviceAuth?: DeviceAuth) => {
    const user: Accounts = await getUserData(userId, interaction, false);

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: FORTNITE_BASIC_AUTH
    };

    const { accountId, deviceId, secret } = deviceAuth ?? user['slot_' + user.active_slot];

    const body = qs.stringify({
        grant_type: 'device_auth',
        account_id: accountId,
        device_id: deviceId,
        secret
    });

    const endpoints = new Endpoints();
    const { data, error } = await request<UserData>(
        'POST',
        endpoints.oauthTokenCreate,
        null,
        headers,
        body
    );

    if (error && interaction) {
        interaction.editReply({
            embeds: [createEmbed('error', 'Failed to refresh account data.')]
        });
    }

    await supabase.from<Accounts>('accounts').upsert({
        user_id: userId,
        ['slot_' + user.active_slot]: {
            ...data,
            accountId,
            deviceId,
            secret,
        }
    });

    return data;
};

export default refreshUserData;
