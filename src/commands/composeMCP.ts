import { ApplicationCommandOptionType, ApplicationCommandType, AttachmentBuilder } from 'discord.js';

import composeMcp from '../api/mcp/composeMcp';
import { FortniteProfile, MCPOperation } from '../api/types';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'compose-mcp',
    description: 'Compose an MCP operation.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const operation = interaction.options.getString('operation')! as keyof typeof MCPOperation;
        const profile = interaction.options.getString('profile')! as keyof typeof FortniteProfile;
        const payload = interaction.options.getString('payload');

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const operationRes = await composeMcp(auth, profile, operation, payload ? JSON.parse(payload) : {});

        if (operationRes.error) {
            await interaction.editReply({
                embeds: [createEmbed('error', '`' + operationRes.error.message + '`')]
            });
            return;
        }

        const response = JSON.stringify(operationRes.data, null, 4);

        const file = new AttachmentBuilder(Buffer.from(response), {
            name: 'response.json'
        });

        interaction.editReply(
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
            type: ApplicationCommandOptionType.String,
            choices: Object.values(FortniteProfile)
                .filter((v) => isNaN(Number(v)))
                .map((v) => ({
                    name: v.toString(),
                    value: v.toString()
                }))
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
