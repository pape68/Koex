import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

import { COLORS } from '../constants';
import { Command } from '../interfaces/Command';
import { Accounts } from '../types/supabase';
import supabase from '../utils/functions/supabase';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'dupe',
    description: 'Brings up the dupe menu.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const { data: account, error } = await supabase
            .from<Accounts>('accounts_test')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (error) return interaction.editReply(defaultResponses.authError);

        if (!account) return interaction.editReply(defaultResponses.loggedOut);

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
    }
};

export default command;
