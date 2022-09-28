import { ActionRowBuilder, ApplicationCommandType, EmbedBuilder, SelectMenuBuilder } from 'discord.js';

import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import { getAllAuths } from '../utils/functions/database';

const command: Command = {
    name: 'switch-accounts',
    description: 'Switch your active Epic Games account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const auths = await getAllAuths(interaction.user.id);

        if (!auths.length) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged into any accounts.')] });
            return;
        }
        const options = auths.map((a) => ({
            label: a.displayName,
            description: a.accountId,
            value: a.accountId
        }));

        const embed = new EmbedBuilder().setColor(Color.BLUE).addFields([
            {
                name: 'Switching Accounts',
                value: `Use the select menu below to switch accounts.`
            }
        ]);

        const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
            new SelectMenuBuilder()
                .setPlaceholder('Account')
                .setCustomId('switchAccounts')
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(options)
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};

export default command;
