import { SelectMenuInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component';
import createEmbed from '../../utils/commands/createEmbed';
import { getAllAccounts, setAccounts } from '../../utils/functions/database';

const selectMenu: Component<SelectMenuInteraction> = {
    name: 'logoutAccount',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const accountIds = interaction.values;

        const accounts = await getAllAccounts(interaction.user.id);

        if (!accounts || !accounts.auths.length) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged into any accounts.')] });
            return;
        }

        const displayNames = accounts.auths.map((a) => a.displayName);

        for (const accountId of accountIds) {
            const idx = accounts.auths.findIndex((a) => a.accountId === accountId);
            accounts.auths.splice(idx, 1);
        }

        await setAccounts(
            interaction.user.id,
            accounts.auths,
            accounts.auths.length ? accounts.auths[0].accountId : null
        );
        await interaction.editReply({
            embeds: [createEmbed('success', `Successfully removed account(s): **${displayNames.join('**, **')}**.`)]
        });
        return;
    }
};

export default selectMenu;
