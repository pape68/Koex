import { ChatInputCommandInteraction, EmbedBuilder, inlineCode, InteractionReplyOptions } from 'discord.js';

import _ from 'lodash';

import { Color, Emoji } from '../../constants';
import { Command } from '../../interfaces/Command';
import { Event } from '../../interfaces/Event';
import EpicGamesAPIError from '../../api/utils/errors/EpicGamesAPIError';

const event: Event = {
    name: 'interactionCreate',
    execute: async (client, interaction: ChatInputCommandInteraction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName) as Command | undefined;

        try {
            if (command) await command.execute(interaction);
            console.info(`${interaction.user.tag} [${interaction.user.id}] used ${interaction.commandName}.`);
        } catch (error) {
            const embed = new EmbedBuilder()
                .setTitle(`${Emoji.CROSS} Oops. We've hit a roadblock.`)
                .setColor(Color.RED)
                .setDescription(
                    `Please join our [support server](https://discord.gg/koex) if the issue persists.\n\`\`\`${String(
                        error
                    )}\`\`\``
                );

            if (error instanceof EpicGamesAPIError && error.code) embed.setFooter({ text: error.code });

            const res: InteractionReplyOptions = { embeds: [embed] };
            if (interaction.deferred) interaction.editReply(res);
            else if (interaction.replied) interaction.followUp(res);
            else interaction.reply(res);
        }
    }
};

export default event;
