import { ActionRowBuilder, ApplicationCommandType, EmbedBuilder, SelectMenuBuilder } from 'discord.js';

import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import { getAllAccounts } from '../utils/functions/database';

const command: Command = {
    name: 'logout',
    description: 'Logout from your active Epic Games account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const accounts = await getAllAccounts(interaction.user.id);

        if (!accounts || !accounts.auths.length) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged into any accounts.')] });
            return;
        }

        const options = accounts.auths.map((a) => ({
            label: a.displayName,
            description: a.accountId,
            value: a.accountId
        }));

        if (!options.length) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const embed = new EmbedBuilder().setColor(Color.BLUE).addFields([
            {
                name: 'Logout from Accounts',
                value: `Use the select menu below to logout from accounts.`
            }
        ]);

        const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
            new SelectMenuBuilder()
                .setPlaceholder('Account')
                .setCustomId('logoutAccount')
                .setMaxValues(options.length)
                .setMinValues(1)
                .setOptions(options)
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};

export default command;
