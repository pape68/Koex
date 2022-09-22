import { ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../interfaces/Command';
import { Event } from '../../interfaces/Event';
import createEmbed from '../../utils/commands/createEmbed';

const event: Event = {
    name: 'interactionCreate',
    execute: async (client, interaction: ChatInputCommandInteraction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName) as Command | undefined;

        if (!command) {
            await interaction.reply({
                embeds: [createEmbed('error', "Couldn't find this command.")],
                ephemeral: true
            });
            return;
        }

        return command.execute(interaction).catch((error) => {
            console.error(error);
            if (interaction.deferred || interaction.replied) return;
            interaction.reply({
                embeds: [createEmbed('error', 'An error occurred while running this command.')],
                ephemeral: true
            });
        });
    }
};

export default event;
