import {
    ActionRowBuilder,
    EmbedBuilder,
    Message,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    SelectMenuInteraction,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

import { Color } from '../../constants';
import { Component } from '../../interfaces/Component';
import { Accounts, PresetData, SlotName } from '../../typings/supabase';
import createEmbed from '../../utils/commands/createEmbed';
import refreshAuthData from '../../utils/commands/refreshAuthData';
import supabase from '../../utils/functions/supabase';
import defaultResponses from '../../utils/helpers/defaultResponses';

const selectMenu: Component<SelectMenuInteraction> = {
    name: 'renamePreset',
    execute: async (interaction) => {
        const slot = interaction.values[0];

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const presets = auth.survivorPresets;

        if (!presets) {
            await interaction.editReply({
                embeds: [createEmbed('error', "You don't have any survivor presets.")]
            });
            return;
        }

        const preset = presets[('slot_' + slot) as SlotName]!;

        const modal = new ModalBuilder()
            .setTitle(`Survivor Preset Renaming`)
            .setCustomId('rename-preset')
            .addComponents([
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([
                    new TextInputBuilder()
                        .setLabel('Old Name')
                        .setCustomId('old-name')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setValue(preset.name ?? '')
                        .setPlaceholder('Type your new preset name here.')
                        .setMaxLength(16)
                        .setMinLength(3)
                ]),
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([
                    new TextInputBuilder()
                        .setLabel('New Name')
                        .setCustomId('new-name')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setPlaceholder('Type your new preset name here.')
                        .setMaxLength(16)
                        .setMinLength(3)
                ])
            ]);

        await interaction.showModal(modal);
    }
};

export default selectMenu;
