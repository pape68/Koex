import { ButtonInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component';
import createEmbed from '../../utils/commands/createEmbed';
import toggleDupe from '../../utils/commands/toggleDupe';

const button: Component<ButtonInteraction> = {
    name: 'startDupe',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        await toggleDupe(true, interaction.user.id, async (msg) => {
            await interaction.editReply({ embeds: [createEmbed('info', msg)] });
            return;
        });

        await interaction.editReply({ embeds: [createEmbed('success', 'Successfully enabled the dupe.')] });
    }
};

export default button;
