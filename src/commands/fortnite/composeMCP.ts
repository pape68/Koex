import axios, { AxiosError } from 'axios';
import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    AttachmentBuilder,
    ChatInputCommandInteraction
} from 'discord.js';

import { Command } from '../../interfaces/Command';
import { ExtendedClient } from '../../interfaces/ExtendedClient';

const command: Command = {
    execute: async (client: ExtendedClient, interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ ephemeral: true });

        return interaction.editReply('This command is currently unavailable.');

        // const operation = interaction.options.getString('operation');
        // const profileId = interaction.options.getString('profile-id');
        // const payload = interaction.options.getString('payload');

        // const { data } = await client.supabase
        //     .from('fortnite')
        //     .select('*')
        //     .eq('user_id', interaction.user.id)
        //     .single();

        // if (!data) return interaction.editReply("You can't use this while not logged in.");

        // const baseInstace = {
        //     baseURL: 'https://fortnite-public-service-prod11.ol.epicgames.com',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `bearer ${data.access_token}`
        //     }
        // };

        // const compositionInstance = axios.create({
        //     ...baseInstace,
        //     params: {
        //         profileId
        //     }
        // });

        // let body;

        // try {
        //     body = payload ? JSON.parse(payload) : {};
        // } catch (err) {
        //     client.logger.error(err);
        //     return interaction.editReply('Invalid JSON payload.');
        // }

        // await compositionInstance
        //     .post(`/fortnite/api/game/v2/profile/${data.account_id}/client/${operation}`, body)
        //     .then(async (res) => {
        //         const response = new AttachmentBuilder(
        //             Buffer.from(JSON.stringify(res.data, null, 4)),
        //             { name: 'response.json' }
        //         );

        //         interaction.editReply({
        //             files: [response]
        //         });
        //     })
        //     .catch((err: AxiosError) => {
        //         client.logger.error(err);
        //         interaction.editReply(err.message);
        //     });
    },
    options: {
        name: 'compose-mcp',
        description: '🔮',
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'operation',
                description: 'The ID of the user.',
                required: true,
                type: ApplicationCommandOptionType.String
            },
            {
                name: 'profile',
                description: 'Whether to input authorization code or query database.',
                required: true,
                type: ApplicationCommandOptionType.String
            },
            {
                name: 'payload',
                description: "The user's authorization code.",
                required: false,
                type: ApplicationCommandOptionType.String
            }
        ]
    }
};

export default command;
