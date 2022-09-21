import {
    ActionRowBuilder,
    ButtonInteraction,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

import { Component } from '../../interfaces/Component';

const button: Component<ButtonInteraction> = {
    name: 'saveSurvivorPreset',
    execute: async (interaction) => {
        const modal = new ModalBuilder()
            .setTitle(`Survivor Preset Naming`)
            .setCustomId('name-preset')
            .addComponents([
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([
                    new TextInputBuilder()
                        .setLabel('Name')
                        .setCustomId('name')
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

export default button;
