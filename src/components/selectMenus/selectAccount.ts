import { SelectMenuInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component';
import { Accounts, AuthData, SlotName } from '../../types/supabase';
import createEmbed from '../../utils/functions/createEmbed';
import supabase from '../../utils/functions/supabase';
import defaultResponses from '../../utils/helpers/defaultResponses';

const selectMenu: Component<SelectMenuInteraction> = {
    name: 'selectAccount',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const slot = interaction.values[0];

        const { data: account, error } = await supabase
            .from<Accounts>('accounts_test')
            .upsert({ user_id: interaction.user.id, active_slot: parseInt(slot) })
            .single();

        if (!account || error) return interaction.editReply(defaultResponses.loggedOut);

        const auth: AuthData | null = account[('slot_' + slot) as SlotName];

        if (!auth) return interaction.editReply(defaultResponses.loggedOut);

        interaction.editReply({
            embeds: [createEmbed('info', `Logged in as **${auth.displayName}**.`)]
        });
    }
};

export default selectMenu;
