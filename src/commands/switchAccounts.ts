import {
    ActionRowBuilder,
    ApplicationCommandType,
    EmbedBuilder,
    SelectMenuBuilder
} from 'discord.js';

import { COLORS } from '../constants';
import { Command } from '../interfaces/Command';
import { Accounts, AuthData } from '../types/supabase';
import supabase from '../utils/functions/supabase';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'switch-accounts',
    description: 'Switch your active Epic Games account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const { data: account, error } = await supabase
            .from<Accounts>('accounts_test')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (error) return interaction.editReply(defaultResponses.authError);

        const options = Object.entries(account ?? {})
            .filter(([k]) => k.startsWith('slot_'))
            .filter(([, v]) => !!v)
            .map(([k, v]) => {
                const { displayName, accountId } = v as AuthData;

                return {
                    label: displayName,
                    description: accountId,
                    value: k.split('_')[1]
                };
            });

        if (!account || !options.length) return interaction.editReply(defaultResponses.loggedOut);

        const embed = new EmbedBuilder().setColor(COLORS.blue).addFields([
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

        return interaction.editReply({ embeds: [embed], components: [row] });
    }
};

export default command;
