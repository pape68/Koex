import { ApplicationCommandOptionType, ApplicationCommandType, AttachmentBuilder } from 'discord.js';

import composeMcp from '../api/mcp/composeMcp';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import createAuthData from '../utils/commands/createAuthData';
import { FortniteProfile, MCPOperation } from '../utils/helpers/operationResources';

const command: Command = {
    name: 'compose-mcp',
    description: 'Compose an MCP operation.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const operationNamae = interaction.options.getString('operation', true) as keyof typeof MCPOperation;
        const profile = interaction.options.getString('profile', true) as keyof typeof FortniteProfile;
        const payload = interaction.options.getString('payload');

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const data = await composeMcp(auth, profile, operationNamae, payload ? JSON.parse(payload) : {});
        const response = JSON.stringify(data, null, 4);
        const file = new AttachmentBuilder(Buffer.from(response), { name: 'response.json' });

        await interaction.editReply(
            response.length < 128
                ? {
                      embeds: [createEmbed('info', '`' + JSON + '`')]
                  }
                : {
                      files: [file]
                  }
        );
    },
    options: [
        {
            name: 'operation',
            description: 'The operation to request.',
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'profile',
            description: 'The Fortnite MCP profile.',
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'payload',
            description: 'The request payload for the operation request.',
            required: false,
            type: ApplicationCommandOptionType.String
        }
    ]
};

export default command;
