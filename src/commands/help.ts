import {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    inlineCode
} from 'discord.js';

import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import { ExtendedClient } from '../interfaces/ExtendedClient';

const command: Command = {
    name: 'help',
    description: "Get information about the bot's commands.",
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        const client = interaction.client as ExtendedClient;

        const commands = client.commands.map((c) => ({
            name: c.name,
            description: c.description
        }));

        let currentPage = 1;
        const embed = new EmbedBuilder()
            .setColor(Color.GRAY)
            .setTitle(`${client.user!.username} - Help`)
            .setDescription(`**Total Commands** \`${commands.length}\``)
            .setFooter({
                text: `Page ${currentPage}/${Math.ceil(commands.length / 9)}`
            });

        let chunks = commands.slice(0, 9);
        embed.addFields(
            chunks.map(({ name, description }) => {
                return {
                    name: inlineCode(name),
                    value: description,
                    inline: true
                };
            })
        );

        const getRow = (pageIdx: number) =>
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
                    .setCustomId('prev')
                    .setDisabled(pageIdx <= 1),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('➡️')
                    .setCustomId('next')
                    .setDisabled(!(pageIdx < Math.ceil(commands.length / 9)))
            );

        const inter = await interaction.reply({
            embeds: [embed],
            components: [getRow(currentPage)],
            fetchReply: true
        });

        const collector = inter.createMessageComponentCollector({
            time: 600000,
            componentType: ComponentType.Button
        });

        collector.on('collect', async (i) => {
            switch (i.customId) {
                case 'next':
                    currentPage++;
                    break;
                case 'prev':
                    currentPage--;
            }

            embed.data.fields = [];

            let chunks;
            if (currentPage === 1) {
                chunks = commands.slice(0, 9 * currentPage);
            } else {
                chunks = commands.slice(9 * currentPage - 9, 9 * currentPage);
            }

            embed
                .addFields(
                    chunks.map(({ name, description }) => {
                        return {
                            name: inlineCode(name),
                            value: description,
                            inline: true
                        };
                    })
                )
                .setFooter({
                    text: `Page ${currentPage}/${Math.ceil(commands.length / 9)}`
                });

            await i.update({
                embeds: [embed],
                components: [getRow(currentPage)],
                fetchReply: true
            });
        });
    }
};

export default command;
