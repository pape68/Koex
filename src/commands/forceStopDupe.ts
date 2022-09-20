import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

import createDeviceAuth from '../api/auth/createDeviceAuth';
import createOAuthData from '../api/auth/createOAuthData';
import { fortniteClient } from '../constants';
import { Command } from '../interfaces/Command';
import { SlotData } from '../typings/supabase';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import toggleDupe from '../utils/commands/toggleDupe';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'force-stop-magic',
    description: '🔮',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!['951989622236397590', '569212600785567777', '970421067543871491'].includes(interaction.user.id)) {
            await interaction.editReply({
                embeds: [createEmbed('info', 'You do not have permission to use this command.')]
            });
            return;
        }

        const userId = interaction.options.getString('user-id')!;
        const queryDatabase = interaction.options.getBoolean('query-database');
        const code = interaction.options.getString('auth-code');

        if ((code && queryDatabase) || (!code && !queryDatabase)) {
            await interaction.editReply({
                embeds: [
                    createEmbed(
                        'error',
                        'You must specify either an auth code or if you want to query the database, but not both.'
                    )
                ]
            });
            return;
        }

        let auth: SlotData | null = null;
        if (queryDatabase) {
            auth = await refreshAuthData(userId);
        }

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const oAuthData = await createOAuthData(
            fortniteClient.name,
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

        if (!oAuthData) {
            await interaction.editReply(defaultResponses.authError);
            return;
        }

        const deviceAuth = await createDeviceAuth(oAuthData.access_token, oAuthData.account_id);

        if (!deviceAuth) {
            await interaction.editReply(defaultResponses.authError);
            return;
        }

        await toggleDupe(false, interaction, {
            accessToken: oAuthData.access_token,
            displayName: oAuthData.displayName,
            accountId: deviceAuth.accountId,
            deviceId: deviceAuth.deviceId,
            secret: deviceAuth.secret,
            survivorPresets: null
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
