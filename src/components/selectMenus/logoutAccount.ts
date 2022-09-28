import { SelectMenuInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component';
import createEmbed from '../../utils/commands/createEmbed';
import { getAllAccounts, setAuths } from '../../utils/functions/database';

const selectMenu: Component<SelectMenuInteraction> = {
    name: 'logoutAccount',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const accountIds = interaction.values;

        const { auths } = await getAllAccounts(interaction.user.id);

        if (!auths.length) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged into any accounts.')] });
            return;
        }

        const displayNames = auths.map((a) => a.displayName);

        for (const accountId of accountIds) {
            const idx = auths.findIndex((a) => a.accountId === accountId);
            auths.splice(idx, 1);
        }

        await setAuths(interaction.user.id, auths);
        await interaction.editReply({
            embeds: [createEmbed('success', `Successfully removed account(s): **${displayNames.join('**, **')}**.`)]
        });
        return;
    }
};

export default selectMenu;
