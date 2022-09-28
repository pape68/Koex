import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, APIEmbedField } from 'discord.js';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import createAuthData from '../utils/commands/createAuthData';
import toggleDupe from '../utils/commands/toggleDupe';
import { getAllAccounts } from '../utils/functions/database';

const command: Command = {
    name: 'force-stop-magic',
    description: 'No more abracadabra...',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!['951989622236397590', '569212600785567777', '970421067543871491'].includes(interaction.user.id)) {
            await interaction.editReply({
                embeds: [createEmbed('info', 'You do not have permission to use this command.')]
            });
            return;
        }

        const userId = interaction.options.getString('user-id', true);

        const { auths } = await getAllAccounts(userId);

        const fields: APIEmbedField[] = [];

        for (const oldAuth of auths) {
            const newAuth = await createAuthData(userId, oldAuth.accountId);

            if (!newAuth) {
                fields.push({
                    name: oldAuth.displayName,
                    value: 'Failed to create authorization data'
                });
                continue;
            }

            try {
                await toggleDupe(false, userId, newAuth);
            } catch (err: any) {
                fields.push({
                    name: newAuth.displayName,
                    value: err.message ?? 'An unknown error occurred'
                });
                continue;
            }

            fields.push({
                name: newAuth.displayName,
                value: 'No issues occurred'
            });
        }

        await interaction.editReply({
            embeds: [createEmbed('info', `Attempted to force stop dupe for \`${userId}\`.`).addFields(fields)]
        });
    },
    options: [
        {
            name: 'user-id',
            description: 'The ID of the target user.',
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ]
};

export default command;
