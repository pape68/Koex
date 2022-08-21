import { ApplicationCommandOptionType, ApplicationCommandType, AttachmentBuilder } from 'discord.js';

import createOperationRequest from '../api/mcp/createOperationRequest';
import { FortniteProfile, MCPOperation } from '../api/types';
import { Command } from '../interfaces/Command';
import { Accounts, AuthData, SlotName } from '../types/supabase';
import createEmbed from '../utils/functions/createEmbed';
import supabase from '../utils/functions/supabase';
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

        const { data: account, error } = await supabase
            .from<Accounts>('accounts_test')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (error) return interaction.editReply(defaultResponses.authError);

        if (!account) return interaction.editReply(defaultResponses.loggedOut);

        const auth: AuthData | null = account[('slot_' + account.active_slot) as SlotName];

        if (!auth) return interaction.editReply(defaultResponses.loggedOut);

        const operationRes = await createOperationRequest(auth, profile, operation, payload ? JSON.parse(payload) : {});

        if (operationRes.error) {
            return interaction.editReply({
                embeds: [createEmbed('error', '`' + operationRes.error.message + '`')]
            });
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
