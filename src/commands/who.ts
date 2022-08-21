import { ApplicationCommandType } from 'discord.js';

import { Command } from '../interfaces/Command';
import { Accounts, AuthData, SlotName } from '../types/supabase';
import createEmbed from '../utils/functions/createEmbed';
import supabase from '../utils/functions/supabase';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'who',
    description: 'Display your current account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const { data: account, error } = await supabase
            .from<Accounts>('accounts_test')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (error) return interaction.editReply(defaultResponses.authError);

        if (!account) return interaction.editReply(defaultResponses.loggedOut);

        const auth: AuthData | null = account[('slot_' + account.active_slot) as SlotName];

        if (!auth) return interaction.editReply(defaultResponses.loggedOut);

        interaction.editReply({
            embeds: [createEmbed('info', `Logged in as **${auth.displayName}**.`)]
        });
    }
};

export default command;
