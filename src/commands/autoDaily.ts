import { ApplicationCommandType } from 'discord.js';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import { getAutoDailyEnabled, removeAutoDailyUser, saveAutoDailyUser } from '../utils/functions/database';

const command: Command = {
    name: 'autodaily',
    description: 'Toggle automatic daily reward claims.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const isEnabled = await getAutoDailyEnabled(interaction.user.id);

        switch (isEnabled) {
            case true:
                await removeAutoDailyUser(interaction.user.id);
                break;
            case false:
                await saveAutoDailyUser(interaction.user.id);
                break;
        }

        await interaction.editReply({
            embeds: [createEmbed('success', `Toggled autodaily status to **${isEnabled ? 'Off' : 'On'}**.`)]
        });
    }
};

export default command;
