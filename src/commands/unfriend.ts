import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

import removeFriendFromId from '../api/friend/removeFriendFromId';
import getFromDisplayName from '../api/account/getFromDisplayName';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';
import EpicGamesAPIError from '../utils/errors/EpicGamesAPIError';

const command: Command = {
    name: 'unfriend',
    description: 'Remove a friend on Epic Games.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const displayName = interaction.options.getString('username')!;

        const auth = await refreshAuthData(interaction.user.id, undefined, async (msg) => {
            await interaction.editReply({ embeds: [createEmbed('info', msg)] });
            return;
        });

        const friendData = await getFromDisplayName(auth!.accessToken, displayName);

        if (!friendData) {
            await interaction.editReply({
                embeds: [createEmbed('error', `Failed to retrieve user **${displayName}**.`)]
            });
            return;
        }

        try {
            await removeFriendFromId(auth!.accessToken, auth!.accountId, friendData.id);
        } catch (err: any) {
            const error: EpicGamesAPIError = err;

            switch (error.code) {
                case 'errors.com.epicgames.friends.friendship_not_found':
                    await interaction.editReply({
                        embeds: [createEmbed('info', `You don't have user **${displayName}** on your friends list.`)]
                    });
                    return;
                default:
                    throw new Error(error.message);
            }
        }

        await interaction.editReply({
            embeds: [createEmbed('success', `Removed user **${displayName}** from your friends list.`)]
        });
    },
    options: [
        {
            name: 'username',
            description: 'The Epic Games display name of the user to unfriend.',
            required: true,
            type: ApplicationCommandOptionType.String,
            min_length: 3,
            max_length: 16
        }
    ]
};

export default command;
