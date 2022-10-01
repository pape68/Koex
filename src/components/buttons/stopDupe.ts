import { ButtonInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component';
import createEmbed from '../../utils/commands/createEmbed';
import toggleDupe from '../../utils/commands/toggleDupe';

const button: Component<ButtonInteraction> = {
    name: 'stopDupe',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        await toggleDupe(false, interaction.user.id, async (msg) => {
            await interaction.editReply({ embeds: [createEmbed('info', msg)] });
            return;
        });

        await interaction.editReply({ embeds: [createEmbed('success', 'Successfully disabled the dupe.')] });
    }
};

export default button;
