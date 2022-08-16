import { ChatInputCommandInteraction } from 'discord.js';
import qs from 'qs';

import { FORTNITE_BASIC_AUTH } from '../../constants';
import { ComponentInteraction } from '../../interfaces/Component';
import { UserData } from '../../typings';
import { Accounts, AuthData, DeviceAuth } from '../../typings/supabase';
import { Endpoints } from '../constants/classes';
import { EpicServices } from '../constants/enums';
import createEmbed from './createEmbed';
import getUserData from './getUserData';
import request from './request';
import supabase from './supabase';

const refreshUserData = async (userId: string, interaction?: ChatInputCommandInteraction | ComponentInteraction, deviceAuth?: DeviceAuth) => {
    const user: AuthData = await getUserData(userId, interaction);

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: FORTNITE_BASIC_AUTH
    };

    const { accountId, deviceId, secret } = deviceAuth ?? user;

    const body = qs.stringify({
        grant_type: 'device_auth',
        account_id: accountId,
        device_id: deviceId,
        secret
    });

    const endpoints = new Endpoints();
    const { data, error } = await request<UserData>(
        'POST',
        endpoints.oauth,
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
            accountId,
            deviceId,
            secret,
            ...data
        }
    });

    return data;
};

export default refreshUserData;
