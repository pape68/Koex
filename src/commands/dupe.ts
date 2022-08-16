import {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} from 'discord.js';
import _ from 'lodash';

import { COLORS } from '../constants';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/functions/createEmbed';
import getUserData from '../utils/functions/getUserData';

const command: Command = {
    execute: async (interaction) => {
        await interaction.deferReply();

        const user = await getUserData(interaction.user.id);

        if (_.isEmpty(user))
            return interaction.editReply({
                embeds: [createEmbed('info', 'You must be signed in to use this command.')]
            });

        const embed = new EmbedBuilder().setColor(COLORS.blue).addFields([
            {
                name: 'Dupe Menu',
                value: 'Click the buttons below to toggle the dupe.'
            }
        ]);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setLabel('Start Dupe').setStyle(ButtonStyle.Primary).setCustomId('startDupe'),
            new ButtonBuilder().setLabel('Stop Dupe').setStyle(ButtonStyle.Danger).setCustomId('stopDupe')
        );

        interaction.editReply({
            embeds: [embed],
            components: [row]
        });
    },
    name: 'dupe',
    description: 'Brings up the dupe menu.',
    type: ApplicationCommandType.ChatInput
};

export default command;
