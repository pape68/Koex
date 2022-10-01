import { APIEmbedField, ApplicationCommandOptionType, ApplicationCommandType, Embed, EmbedBuilder } from 'discord.js';

import { Command } from '../interfaces/Command';
import createAuthData from '../utils/functions/createAuthData';
import createEmbed from '../utils/commands/createEmbed';
import toggleDupe from '../utils/commands/toggleDupe';
import { getAllAccounts } from '../utils/functions/database';
import getCharacterAvatar from '../utils/functions/getCharacterAvatar';

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

        const accounts = await getAllAccounts(userId);

        if (!accounts || !accounts.auths.length) {
            await interaction.editReply({
                embeds: [createEmbed('info', `\`${userId}\` is not logged into any accounts.`)]
            });
            return;
        }

        const embeds: EmbedBuilder[] = [];

        for (const auth of accounts.auths) {
            const bearerAuth = await createAuthData(userId, auth.accountId);

            const characterAvatarUrl = await getCharacterAvatar(userId, bearerAuth ?? undefined);

            if (!bearerAuth) {
                embeds.push(
                    new EmbedBuilder()
                        .setAuthor({ name: auth.displayName, iconURL: characterAvatarUrl })
                        .setDescription(`Failed to create authorization data for \`${userId}\`.`)
                );
                continue;
            }

            const res = await toggleDupe(false, interaction.user.id, bearerAuth, true);
            embeds.push(res.setAuthor({ name: auth.displayName, iconURL: characterAvatarUrl }));
            continue;
        }

        await interaction.editReply({ embeds });
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
