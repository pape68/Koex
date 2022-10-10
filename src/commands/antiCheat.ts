import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

import createExchangeCode from '../api/auth/createExchangeCode';
import calderaRequest from '../api/caldera/calderaRequest';
import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import createAuthData from '../utils/functions/createAuthData';
import getAvatar from '../utils/functions/getAvatar';

const command: Command = {
    name: 'anticheat',
    description: 'Check your anti-cheat provider.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const exchangeCode = await createExchangeCode(auth.accessToken);
        const caldera = await calderaRequest(auth.accountId, exchangeCode);
        const avatarUrl = await getAvatar(interaction.user.id);

        const embed = new EmbedBuilder()
            .setColor(Color.GRAY)
            .setFields({
                name: 'Anti-Cheat',
                value: `Your current anti-cheat provider is **${caldera.provider}**.`
            })
            .setFooter({ text: auth.displayName, iconURL: avatarUrl })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
