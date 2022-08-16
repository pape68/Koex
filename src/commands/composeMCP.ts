import { ApplicationCommandOptionType, ApplicationCommandType, AttachmentBuilder } from 'discord.js';
import _ from 'lodash';

import { Command } from '../interfaces/Command';
import { AuthData } from '../typings/supabase';
import { FortniteProfile, MCPOperation } from '../utils/constants/enums';
import createEmbed from '../utils/functions/createEmbed';
import getUserData from '../utils/functions/getUserData';
import operationRequest from '../utils/functions/operationRequest';
import toCommandChoices from '../utils/functions/toCommandChoices';

const command: Command = {
    execute: async (interaction) => {
        await interaction.deferReply();

        const operation = interaction.options.getString('operation')! as keyof typeof MCPOperation;
        const profile = interaction.options.getString('profile')! as keyof typeof FortniteProfile;
        const payload = interaction.options.getString('payload');

        const user: AuthData = await getUserData(interaction.user.id, interaction);

        if (_.isEmpty(user))
            return interaction.editReply({
                embeds: [createEmbed('info', 'You must be signed in to use this command.')]
            });

        const { data, error } = await operationRequest(user, operation, profile, JSON.parse(payload || '{}'));

        if (!data || error) return interaction.editReply({
                embeds: [createEmbed('error', '`' + (error.errorMessage ?? error.rawError.message) + '`')]
            });

        const file = new AttachmentBuilder(Buffer.from(JSON.stringify(data, null, 4)), {
            name: 'response.json'
        });

        interaction.editReply({
            files: [file]
        });
    },
    name: 'compose-mcp',
    description: 'Compose an MCP operation.',
    type: ApplicationCommandType.ChatInput,
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
            choices: toCommandChoices(FortniteProfile)
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
