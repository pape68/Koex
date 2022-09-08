import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

import addFriendFromId from '../api/account/addFriendFromId';
import getFromdisplayName from '../api/account/getFromdisplayName';
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

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const friendData = await getFromdisplayName(auth.accessToken, displayName);

        if (!friendData) {
            await interaction.editReply({
                embeds: [createEmbed('error', `Failed to retrieve user **${displayName}**.`)]
            });
            return;
        }

        const error = await addFriendFromId(auth.accessToken, auth.accountId, friendData.id);

        if (error) {
            switch (error.numericErrorCode) {
                case 1041:
                    await interaction.editReply({
                        embeds: [
                            createEmbed(
                                'error',
                                `You've sent too many friend requests in a short amount of time.`
                            )
                        ]
                    });
                    return;
                // Common Errors
                case 14009:
                    await interaction.editReply({
                        embeds: [
                            createEmbed(
                                'info',
                                `You already have **${displayName}** on your friends list.`
                            )
                        ]
                    });
                    return;
                case 14014:
                    await interaction.editReply({
                        embeds: [
                            createEmbed(
                                'info',
                                `You already sent a friend request to **${displayName}**.`
                            )
                        ]
                    });
                    return;
                case 14131:
                    await interaction.editReply({
                        embeds: [
                            createEmbed(
                                'error',
                                `User **${displayName}** has too many incoming friend requests.`
                            )
                        ]
                    });
                    return;
            }

            await interaction.editReply({
                embeds: [
                    createEmbed(
                        'error',
                        `Failed to send friend request to user **${displayName}**.`
                    )
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
