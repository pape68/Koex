import { EmbedBuilder, SelectMenuInteraction } from 'discord.js';

import { Color } from '../../constants';
import { Component } from '../../interfaces/Component';
import { SlotName } from '../../typings/supabase';
import createEmbed from '../../utils/commands/createEmbed';
import getCharacterAvatar from '../../utils/commands/getCharacterAvatar';
import { getAllAccounts } from '../../utils/functions/database';

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

        const accounts = await getAllAccounts(interaction.user.id, async (msg) => {
            await interaction.editReply({ embeds: [createEmbed('info', msg)] });
            return;
        });

        const auth = accounts![('slot_' + slot) as SlotName];

        const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: auth!.displayName,
                        iconURL: characterAvatarUrl ?? undefined
                    })
                    .setColor(Color.GREEN)
            ]
        });
    }
};

export default selectMenu;
