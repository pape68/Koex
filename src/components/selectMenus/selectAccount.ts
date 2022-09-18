import { EmbedBuilder, SelectMenuInteraction } from 'discord.js';

import { Color } from '../../constants';
import { Component } from '../../interfaces/Component';
import { Accounts, SlotName } from '../../typings/supabase';
import createEmbed from '../../utils/commands/createEmbed';
import getCharacterAvatar from '../../utils/commands/getCharacterAvatar';
import supabase from '../../utils/functions/supabase';
import defaultResponses from '../../utils/helpers/defaultResponses';

const selectMenu: Component<SelectMenuInteraction> = {
    name: 'selectAccount',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (interaction.user !== interaction.message?.interaction?.user) {
            await interaction.reply({
                embeds: [createEmbed('error', "This isn't for you.")],
                ephemeral: true
            });
            return;
        }

        const slot = interaction.values[0];

        const { data: account } = await supabase
            .from<Accounts>('accounts_test')
            .upsert({ user_id: interaction.user.id, active_slot: parseInt(slot) })
            .single();

        if (!account) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const auth = account[('slot_' + slot) as SlotName];

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: auth.displayName,
                        iconURL: characterAvatarUrl ?? undefined
                    })
                    .setColor(Color.GREEN)
            ]
        });
    }
};

export default selectMenu;
