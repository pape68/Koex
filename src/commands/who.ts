import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import getCharacterAvatar from '../utils/commands/getCharacterAvatar';
import refreshAuthData from '../utils/commands/refreshAuthData';

const command: Command = {
    name: 'who',
    description: 'Display your current account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await refreshAuthData(interaction.user.id, undefined, async (msg) => {
            await interaction.editReply({ embeds: [createEmbed('info', msg)] });
            return;
        });

        const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `Hello, ${auth!.displayName}`,
                        iconURL: characterAvatarUrl ?? undefined
                    })
                    .setColor(Color.GRAY)
            ]
        });
    }
};

export default command;
