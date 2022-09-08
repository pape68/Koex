import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

import { Command } from '../interfaces/Command';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';
import getCosmetic from '../utils/commands/getCosmetic';
import { COLORS } from '../constants';

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

        const cosmeticUrl = await getCosmetic(interaction.user.id);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: auth.displayName,
                        iconURL: cosmeticUrl ?? undefined
                    })
                    .setColor(COLORS.blue)
            ]
        });
    }
};

export default command;
