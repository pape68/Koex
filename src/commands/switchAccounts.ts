import { ActionRowBuilder, ApplicationCommandType, EmbedBuilder, SelectMenuBuilder } from 'discord.js';

import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import { SlotData } from '../typings/supabase';
import createEmbed from '../utils/commands/createEmbed';
import { getAllAccounts } from '../utils/functions/database';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'switch-accounts',
    description: 'Switch your active Epic Games account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const accounts = await getAllAccounts(interaction.user.id, async (msg) => {
            await interaction.editReply({ embeds: [createEmbed('info', msg)] });
            return;
        });

        const options = Object.entries(accounts!)
            .filter(([k, v]) => k.startsWith('slot_') && !!v)
            .map(([k, v]) => {
                const { displayName, accountId } = v as SlotData;

                return {
                    label: displayName,
                    description: accountId,
                    value: k.split('_')[1]
                };
            });

        if (!accounts || !options.length) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const embed = new EmbedBuilder().setColor(Color.BLUE).addFields([
            {
                name: 'Switching Accounts',
                value: `Use the select menu below to switch accounts.`
            }
        ]);

        const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
            new SelectMenuBuilder()
                .setPlaceholder('Select Account')
                .setCustomId('selectAccount')
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(options)
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};

export default command;
