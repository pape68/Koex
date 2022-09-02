import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

import addFriendFromId from '../api/account/addFriendFromId';
import getFromDisplayName from '../api/account/getFromDisplayName';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'friend',
    description: 'Send a friend request on Epic Games.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const displayName = interaction.options.getString('username')!;

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) return interaction.editReply(defaultResponses.loggedOut);

        const friendData = await getFromDisplayName(auth.accessToken, displayName);

        if (!friendData) {
            return interaction.editReply({
                embeds: [createEmbed('error', `Failed to retrieve user **${displayName}**.`)]
            });
        }

        const error = await addFriendFromId(auth.accessToken, auth.accountId, friendData.id);

        if (error) {
            switch (error.numericErrorCode) {
                case 1041:
                    return interaction.editReply({
                        embeds: [
                            createEmbed(
                                'error',
                                `You've sent too many friend requests in a short amount of time.`
                            )
                        ]
                    });
                // Common Errors
                case 14009:
                    return interaction.editReply({
                        embeds: [
                            createEmbed(
                                'info',
                                `You already have **${displayName}** on your friends list.`
                            )
                        ]
                    });
                case 14014:
                    return interaction.editReply({
                        embeds: [
                            createEmbed(
                                'info',
                                `You already sent a friend request to **${displayName}**.`
                            )
                        ]
                    });
                case 14131:
                    return interaction.editReply({
                        embeds: [
                            createEmbed(
                                'error',
                                `User **${displayName}** has too many incoming friend requests.`
                            )
                        ]
                    });
            }

            return interaction.editReply({
                embeds: [
                    createEmbed('error', `Failed to send friend request to user **${displayName}**`)
                ]
            });
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
