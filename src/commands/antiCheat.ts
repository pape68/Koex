import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

import calderaRequest from '../api/caldera/calderaRequest';
import createExchangeCode from '../api/auth/createExchangeCode';
import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import getCharacterAvatar from '../utils/commands/getCharacterAvatar';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'anti-cheat',
    description: 'Check your anti-cheat provider.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const exchangeCode = await createExchangeCode(auth.accessToken);

        if (!exchangeCode) {
            await interaction.editReply(defaultResponses.authError);
            return;
        }

        const caldera = await calderaRequest(auth.accountId, exchangeCode);

        if (!caldera.data || caldera.error) {
            await interaction.editReply({
                embeds: [createEmbed('error', '`' + caldera.error!.errorMessage + '`')]
            });
            return;
        }

        const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);

        const embed = new EmbedBuilder()
            .setColor(Color.GRAY)
            .setFields({
                name: 'Anti-Cheat',
                value: `Your current anti-cheat provider is **${caldera.data.provider}**.`
            })
            .setFooter({ text: auth.displayName, iconURL: characterAvatarUrl ?? undefined })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
