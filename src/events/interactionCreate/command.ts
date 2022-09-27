import { ChatInputCommandInteraction } from 'discord.js';

import { Command } from '../../interfaces/Command';
import { Event } from '../../interfaces/Event';
import createEmbed from '../../utils/commands/createEmbed';

const event: Event = {
    name: 'interactionCreate',
    execute: async (client, interaction: ChatInputCommandInteraction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName) as Command | undefined;

        try {
            if (command) await command.execute(interaction);
        } catch (err: any) {
            console.log(err);
            await interaction.editReply({
                embeds: [createEmbed('error', err.message ?? 'An unknown error occurred')]
            });
        }
    }
};

export default event;
