import { ButtonInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component';
import toggleDupe from '../../utils/commands/toggleDupe';

const button: Component<ButtonInteraction> = {
    name: 'stopDupe',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const res = await toggleDupe(false, interaction.user.id, undefined, false);
        await interaction.editReply({ embeds: [res] });
    }
};

export default button;
