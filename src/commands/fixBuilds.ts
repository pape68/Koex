import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

import createDeviceAuth from '../api/auth/createDeviceAuth';
import createOAuthData from '../api/auth/createOAuthData';
import { FORTNITE_CLIENT } from '../constants';
import { Command } from '../interfaces/Command';
import { AuthData } from '../types/supabase';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import toggleDupe from '../utils/commands/toggleDupe';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'fix-builds',
    description: "Fix a user's building tools.",
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!['951989622236397590', '569212600785567777', '970421067543871491'].includes(interaction.user.id)) {
            return interaction.editReply({
                embeds: [createEmbed('info', 'You do not have permission to use this command.')]
            });
        }

        const userId = interaction.options.getString('user-id')!;
        const queryDatabase = interaction.options.getBoolean('query-database');
        const code = interaction.options.getString('auth-code');

        if ((code && queryDatabase) || (!code && !queryDatabase)) {
            return interaction.editReply({
                embeds: [
                    createEmbed(
                        'error',
                        'You must specify either an auth code or if you want to query the database, but not both.'
                    )
                ]
            });
        }

        let auth: AuthData | null = null;
        if (queryDatabase) {
            auth = await refreshAuthData(userId);

            if (!auth) return interaction.editReply(defaultResponses.loggedOut);
        }

        const oAuthData = await createOAuthData(
            FORTNITE_CLIENT.client,
            queryDatabase
                ? {
                      grant_type: 'device_auth',
                      account_id: auth!.accountId,
                      device_id: auth!.deviceId,
                      secret: auth!.secret
                  }
                : {
                      grant_type: 'authorization_code',
                      code
                  }
        );

        if (!oAuthData) return interaction.editReply(defaultResponses.authError);

        const deviceAuth = await createDeviceAuth(oAuthData.access_token, oAuthData.account_id);

        if (!deviceAuth) return interaction.editReply(defaultResponses.authError);

        await toggleDupe(false, interaction, {
            userId,
            auth: {
                accessToken: oAuthData.access_token,
                displayName: oAuthData.displayName,
                accountId: deviceAuth.accountId,
                deviceId: deviceAuth.deviceId,
                secret: deviceAuth.secret
            }
        });
    },
    options: [
        {
            name: 'user-id',
            description: 'The ID of the target user.',
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'query-database',
            description: 'Whether to input authorization code or query the database.',
            required: false,
            type: ApplicationCommandOptionType.Boolean
        },
        {
            name: 'auth-code',
            description: "The user's authorization code.",
            required: false,
            type: ApplicationCommandOptionType.String
        }
    ]
};

export default command;
