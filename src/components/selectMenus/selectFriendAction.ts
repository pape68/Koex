import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component';

const selectMenu: Component<SelectMenuInteraction> = {
    name: 'selectFriendAction',
    execute: async (interaction) => {
        const action = interaction.values[0];

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId(`friendConfirm-${action}`).setLabel('Confirm').setStyle(ButtonStyle.Danger)
        );

        await interaction.update({ components: [row] });
        return;
    }
};

export default selectMenu;
