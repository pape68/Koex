import { EmbedBuilder, InteractionReplyOptions } from 'discord.js';

import { Color, Emoji } from '../../constants';
import { Component, ComponentInteraction } from '../../interfaces/Component';
import { Event } from '../../interfaces/Event';
import createEmbed from '../../utils/commands/createEmbed';
import EpicGamesAPIError from '../../api/utils/errors/EpicGamesAPIError';

const event: Event = {
    name: 'interactionCreate',
    execute: async (client, interaction: ComponentInteraction) => {
        if (interaction.isChatInputCommand()) return;

        if (interaction.user !== interaction.message?.interaction?.user) {
            await interaction.reply({
                embeds: [createEmbed('info', "This isn't for you.")],
                ephemeral: true
            });
            return;
        }

        if (['next', 'prev'].includes(interaction.customId)) return;

        const component = client.components.get(interaction.customId) as Component<ComponentInteraction> | undefined;

        try {
            if (component) await component.execute(interaction);
        } catch (error) {
            const embed = new EmbedBuilder()
                .setTitle(`${Emoji.CROSS} Oops. We've hit a roadblock.`)
                .setColor(Color.RED)
                .setDescription(
                    `Please join our [support server](https://discord.gg/koex/) if the issue persists.\n\`\`\`${String(
                        error
                    )}\`\`\``
                );

            if (error instanceof EpicGamesAPIError) embed.setFooter({ text: error.code });

            const res: InteractionReplyOptions = { embeds: [embed] };
            if (interaction.deferred) interaction.editReply(res);
            else if (interaction.replied) interaction.followUp(res);
            else interaction.reply(res);
        }
    }
};

export default event;
1;
