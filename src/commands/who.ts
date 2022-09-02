import { ApplicationCommandType } from 'discord.js';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';
import getCosmetic from '../utils/commands/getCosmetic';

const command: Command = {
    name: 'who',
    description: 'Display your current account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) return interaction.editReply(defaultResponses.loggedOut);

        const cosmeticUrl = await getCosmetic(interaction.user.id);

        interaction.editReply({
            embeds: [
                createEmbed('info', `Logged in as **${auth.displayName}**.`).setThumbnail(
                    cosmeticUrl
                )
            ]
        });
    }
};

export default command;
