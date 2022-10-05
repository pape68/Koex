import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import getAvatar from '../utils/functions/getAvatar';
import createAuthData from '../utils/functions/createAuthData';

const command: Command = {
    name: 'who',
    description: 'Display your current account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const characterAvatarUrl = await getAvatar(interaction.user.id);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `Hello, ${auth.displayName}`,
                        iconURL: characterAvatarUrl ?? undefined
                    })
                    .setColor(Color.GRAY)
            ]
        });
    }
};

export default command;
