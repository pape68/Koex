import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import getCharacterAvatar from '../utils/commands/getCharacterAvatar';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'who',
    description: 'Display your current account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `Hello, ${auth.displayName}`,
                        iconURL: characterAvatarUrl ?? undefined
                    })
                    .setColor(Color.gray)
            ]
        });
    }
};

export default command;
