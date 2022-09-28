import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import createAuthData from '../utils/commands/createAuthData';
import createEmbed from '../utils/commands/createEmbed';
import getCharacterAvatar from '../utils/commands/getCharacterAvatar';
import { getWhitelistedUser } from '../utils/functions/database';

const command: Command = {
    name: 'magic',
    description: 'Abracadabra! 🪄',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const isWhitelisted = await getWhitelistedUser(interaction.user.id);

        if (!isWhitelisted) {
            await interaction.editReply('(∩｀-´)⊃━☆ﾟ.*･｡ﾟ');
            return;
        }

        const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);
        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(Color.GRAY)
            .addFields([
                {
                    name: 'Dupe Menu',
                    value: 'Click the buttons below to toggle the dupe.'
                }
            ])
            .setFooter({ text: auth.displayName, iconURL: characterAvatarUrl ?? undefined })
            .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setLabel('Start Dupe').setStyle(ButtonStyle.Primary).setCustomId('startDupe'),
            new ButtonBuilder().setLabel('Stop Dupe').setStyle(ButtonStyle.Secondary).setCustomId('stopDupe')
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};

export default command;
