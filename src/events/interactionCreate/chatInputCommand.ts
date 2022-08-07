import { ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../interfaces/Command';

import { Event } from '../../interfaces/Event';
import { ExtendedClient } from '../../interfaces/ExtendedClient';

const event: Event = {
    execute: async (client: ExtendedClient, interaction: ChatInputCommandInteraction) => {
        if (!interaction.isChatInputCommand() || interaction.guild) return;

        try {
            (client.interactions.get(interaction.commandName) as Command).execute(
                client,
                interaction
            );
        } catch (err) {
            client.logger.error(err);
        }
    },
    options: {
        name: 'interactionCreate'
    }
};

export default event;
