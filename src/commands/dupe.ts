import {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} from 'discord.js';

import { COLORS, WHITELISTED_SERVERS } from '../constants';
import { Command } from '../interfaces/Command';
import { Accounts, DupeWhitelist } from '../types/supabase';
import supabase from '../utils/functions/supabase';
import defaultResponses from '../utils/helpers/defaultResponses';
import createEmbed from '../utils/commands/createEmbed';

const command: Command = {
    name: 'dupe',
    description: 'Brings up the dupe menu.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const whitelist = await supabase
            .from<DupeWhitelist>('dupe_whitelist')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (!whitelist.data) {
            return interaction.editReply({
                embeds: [
                    createEmbed(
                        'error',
                        `You must be whitelisted to use \`${interaction.commandName}\`.`
                    )
                ]
            });
        }

        const account = await supabase
            .from<Accounts>('accounts_test')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (account.error) return interaction.editReply(defaultResponses.authError);

        if (!account.data) return interaction.editReply(defaultResponses.loggedOut);

        const embed = new EmbedBuilder().setColor(COLORS.blue).addFields([
            {
                name: 'Dupe Menu',
                value: 'Click the buttons below to toggle the dupe.'
            }
        ]);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('Start Dupe')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('startDupe'),
            new ButtonBuilder()
                .setLabel('Stop Dupe')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('stopDupe')
        );

        interaction.editReply({ embeds: [embed], components: [row] });
    }
};

export default command;
