import { ActionRowBuilder, ApplicationCommandType, EmbedBuilder, SelectMenuBuilder } from 'discord.js';

import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import { Accounts, SlotData } from '../typings/supabase';
import supabase from '../utils/functions/supabase';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'switch-accounts',
    description: 'Switch your active Epic Games account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const { data: account, error } = await supabase
            .from<Accounts>('accounts_test')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (error) {
            await interaction.editReply(defaultResponses.authError);
            return;
        }

        const options = Object.entries(account ?? {})
            .filter(([k, v]) => k.startsWith('slot_') && !!v)
            .map(([k, v]) => {
                const { displayName, accountId } = v as SlotData;

                return {
                    label: displayName,
                    description: accountId,
                    value: k.split('_')[1]
                };
            });

        if (!account || !options.length) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const embed = new EmbedBuilder().setColor(Color.blue).addFields([
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
