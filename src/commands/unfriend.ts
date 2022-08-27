import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

import deleteFriendFromId from '../api/account/deleteFriendFromId';
import getFromDisplayName from '../api/account/getFromDisplayName';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'unfriend',
    description: 'Remove a friend on Epic Games.',
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

        const error = await deleteFriendFromId(auth.accessToken, auth.accountId, friendData.id);

        if (error) {
            console.log(error);
            switch (error.numericErrorCode) {
                // Common Errors
                case 14004:
                    return interaction.editReply({
                        embeds: [createEmbed('info', `You don't have user **${displayName}** on your friends list.`)]
                    });
            }

            return interaction.editReply({
                embeds: [createEmbed('error', `Failed to remove user **${displayName}** from your friends list.`)]
            });
        }

        interaction.editReply({
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
