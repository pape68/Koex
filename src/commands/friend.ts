import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

import getFromDisplayName from '../api/account/getFromDisplayName';
import addFriendFromId from '../api/friend/addFriendFromId';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import createAuthData from '../utils/commands/createAuthData';
import EpicGamesAPIError from '../api/utils/errors/EpicGamesAPIError';

const command: Command = {
    name: 'friend',
    description: 'Send a friend request on Epic Games.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const displayName = interaction.options.getString('username')!;

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const friendData = await getFromDisplayName(auth.accessToken, displayName);

        if (!friendData) {
            await interaction.editReply({
                embeds: [createEmbed('error', `Failed to retrieve user **${displayName}**.`)]
            });
            return;
        }

        try {
            await addFriendFromId(auth.accessToken, auth.accountId, friendData.id);
        } catch (err: any) {
            const error: EpicGamesAPIError = err;

            switch (error.code) {
                case 'errors.com.epicgames.friends.duplicate_friendship':
                    await interaction.editReply({
                        embeds: [createEmbed('info', `You already have **${displayName}** on your friends list.`)]
                    });
                    return;
                case 'errors.com.epicgames.friends.friend_request_already_sent':
                    await interaction.editReply({
                        embeds: [createEmbed('info', `You already sent a friend request to **${displayName}**.`)]
                    });
                    return;
                case 'errors.com.epicgames.friends.incoming_friendships_limit_exceeded':
                    await interaction.editReply({
                        embeds: [createEmbed('error', `User **${displayName}** has too many incoming friend requests.`)]
                    });
                    return;
                default:
                    throw new Error(error.message);
            }
        }

        interaction.editReply({
            embeds: [createEmbed('success', `Sent friend request to user **${displayName}**.`)]
        });
    },
    options: [
        {
            name: 'username',
            description: 'The Epic Games display name of the user to friend.',
            required: true,
            type: ApplicationCommandOptionType.String,
            min_length: 3,
            max_length: 16
        }
    ]
};

export default command;
