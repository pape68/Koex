import supabase from './supabase';

import { ChatInputCommandInteraction } from 'discord.js';

import { ComponentInteraction } from '../../interfaces/Component';
import { Accounts } from '../../typings/supabase';
import createEmbed from './createEmbed';
import refreshUserData from './refreshUserData';

const getUserData = async(
    userId: string,
    interaction?: ChatInputCommandInteraction | ComponentInteraction,
    slotData = true
) => {
    await refreshUserData(userId, interaction);
    
    const { data, error } = await supabase
        .from<Accounts>('accounts')
        .upsert({ user_id: userId })
        .maybeSingle();

    const account: Accounts = data!;

    if (error && interaction)
        interaction.editReply({
            embeds: [createEmbed('error', 'Failed to retrieve account data.')]
        });

    return slotData ? account['slot_' + account.active_slot] : account;
};

export default getUserData;
