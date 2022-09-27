import { ButtonInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component';
import createEmbed from '../../utils/commands/createEmbed';
import toggleDupe from '../../utils/commands/toggleDupe';

const button: Component<ButtonInteraction> = {
    name: 'startDupe',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        try {
            await toggleDupe(true, interaction.user.id);
        } catch (err: any) {
            await interaction.editReply({ embeds: [createEmbed('info', err.message ?? 'An unknown error occurred')] });
            return;
        }

        await interaction.editReply({ embeds: [createEmbed('success', 'Successfully enabled the dupe.')] });
    }
};

export default button;
