import { ApplicationCommandType } from 'discord.js';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';

const command: Command = {
    name: 'restart-kora',
    description: 'Restarts the Koex utility bot Kora.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        interaction.reply({
            embeds: [createEmbed('error', "You don't have permission to use this command.")]
        });
    }
};

export default command;
