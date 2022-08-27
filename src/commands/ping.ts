import { ApplicationCommandType } from 'discord.js';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';

const command: Command = {
    name: 'ping',
    description: 'Generates a direct link to your account page.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        const reply = await interaction.deferReply({ fetchReply: true });

        const latency = reply.createdTimestamp - interaction.createdTimestamp;
        const wsLatency = interaction.client.ws.ping;

        await interaction.editReply({
            embeds: [createEmbed('info', `Pong! Latency is \`${latency}ms\`. API latency is \`${wsLatency}ms\``)]
        });
    }
};

export default command;
