import { ApplicationCommandType, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

import createExchangeCode from '../api/auth/createExchangeCode';
import { Command } from '../interfaces/Command';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'account-page',
    description: 'Generates a direct link to your account page.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const exchangeCode = await createExchangeCode(auth.accessToken);

        const url = 'https://epicgames.com/id/exchange?exchangeCode=' + exchangeCode;

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setLabel('Epic Games').setURL(url).setStyle(ButtonStyle.Link)
        );

        await interaction.editReply({ components: [row] });
    }
};

export default command;
