import { ApplicationCommandType } from 'discord.js';

import { Command } from '../interfaces/Command';

import { ExtendedClient } from '../interfaces/ExtendedClient';
import startAutoDailyJob from '../jobs/autoDaily';

const command: Command = {
    name: 'force-auto-daily',
    description: 'Force trigger an auto daily .',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.reply('Starting...');
        await startAutoDailyJob(interaction.client as ExtendedClient);
        await interaction.editReply('Done.');
    }
};

export default command;
