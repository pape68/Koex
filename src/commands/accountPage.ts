import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle } from 'discord.js';

import createExchangeCode from '../api/auth/createExchangeCode';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';

const command: Command = {
    name: 'account-page',
    description: 'Generates a direct link to your account page.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const auth = await refreshAuthData(interaction.user.id, undefined, async (msg) => {
            await interaction.editReply({ embeds: [createEmbed('info', msg)] });
            return;
        });

        const exchangeCode = await createExchangeCode(auth!.accessToken);
        const url = 'https://epicgames.com/id/exchange?exchangeCode=' + exchangeCode;
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setLabel('Epic Games').setURL(url).setStyle(ButtonStyle.Link)
        );

        await interaction.editReply({ components: [row] });
    }
};

export default command;
